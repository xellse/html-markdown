// worker.js - Service Worker，处理扩展图标点击和 Markdown 文件下载

// 存储设置的键名
const STORAGE_KEY = 'markdown_save_settings';

// 默认设置
const DEFAULT_SETTINGS = {
  dirTemplate: '',       // 保存目录模板
  hasChosenDir: false    // 用户是否已选择目录
};

/**
 * 获取保存设置
 * @returns {Promise<object>} - 保存设置
 */
const getSettings = async () => {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    return result[STORAGE_KEY] || DEFAULT_SETTINGS;
  } catch (error) {
    console.error('获取设置时出错:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * 保存设置
 * @param {object} settings - 要保存的设置
 * @returns {Promise<void>}
 */
const saveSettings = async (settings) => {
  try {
    await chrome.storage.sync.set({
      [STORAGE_KEY]: settings
    });
  } catch (error) {
    console.error('保存设置时出错:', error);
  }
};

/**
 * 从当前选项卡获取 Markdown
 * @param {number} tabId - 选项卡 ID
 * @returns {Promise<void>}
 */
const getMarkdownFromTab = async (tabId) => {
  try {
    // 注入 Turndown 库
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['turndown.js']
    });
    
    // 注入并执行 content.js
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    
    // 调用转换函数
    await chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
        // 调用在 content.js 中定义的函数
        window.convertAndSendMarkdown();
      }
    });
  } catch (error) {
    console.error('获取 Markdown 时出错:', error);
  }
};

/**
 * 生成文件名
 * @param {object} tab - 选项卡信息
 * @returns {string} - 文件名
 */
const generateFilename = (tab) => {
  const date = new Date();
  const timestamp = date.toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')
    .replace('T', '_');
  
  // 从标题中提取安全的文件名部分
  const safeTitle = (tab.title || '无标题')
    .replace(/[\\/:*?"<>|]/g, '_')  // 替换不允许的字符
    .substring(0, 50);              // 限制长度
  
  return `${timestamp}_${safeTitle}.md`;
};

/**
 * 为下载准备路径
 * @param {object} settings - 用户设置
 * @param {string} filename - 文件名
 * @returns {object} - 下载选项
 */
const prepareDownloadOptions = (settings, filename) => {
  const options = {
    filename: filename,
    saveAs: !settings.hasChosenDir
  };
  
  // 如果用户已经选择了目录，使用他们的模板
  if (settings.hasChosenDir && settings.dirTemplate) {
    // 替换日期变量
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    let path = settings.dirTemplate
      .replace('${YYYY}', year)
      .replace('${MM}', month)
      .replace('${DD}', day);
    
    // 确保路径以 / 结尾
    if (path && !path.endsWith('/')) {
      path += '/';
    }
    
    options.filename = path + filename;
  }
  
  return options;
};

/**
 * 保存 Markdown 到文件
 * @param {string} markdown - Markdown 内容
 * @param {object} tab - 选项卡信息
 */
const saveMarkdownToFile = async (markdown, tab) => {
  try {
    // 获取用户设置
    const settings = await getSettings();
    
    // 创建 Blob
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // 生成文件名和下载选项
    const filename = generateFilename(tab);
    const options = prepareDownloadOptions(settings, filename);
    
    // 执行下载
    const downloadId = await chrome.downloads.download({
      url: url,
      filename: options.filename,
      saveAs: options.saveAs
    });
    
    // 如果这是首次保存，记录用户已选择目录
    if (options.saveAs && !settings.hasChosenDir) {
      // 监听下载完成事件，以便获取用户选择的路径
      chrome.downloads.onDeterminingFilename.addListener(function listener(item, suggest) {
        if (item.id === downloadId) {
          // 从完整路径中提取目录
          const pathParts = item.filename.split('/');
          pathParts.pop(); // 移除文件名
          const dirTemplate = pathParts.join('/');
          
          // 更新设置
          saveSettings({
            ...settings,
            dirTemplate,
            hasChosenDir: true
          });
          
          // 移除监听器
          chrome.downloads.onDeterminingFilename.removeListener(listener);
        }
        suggest();
      });
    }
    
    // 释放 Blob URL
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error('保存 Markdown 文件时出错:', error);
  }
};

// 监听扩展图标点击
chrome.action.onClicked.addListener(async (tab) => {
  // 只处理 http 和 https 协议的页面
  if (tab.url.startsWith('http')) {
    await getMarkdownFromTab(tab.id);
  } else {
    console.warn('不支持的页面类型:', tab.url);
  }
});

// 监听来自 content.js 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_MD' && message.payload) {
    saveMarkdownToFile(message.payload, sender.tab);
  }
  
  // 必须返回 true 以支持异步响应
  return true;
});
