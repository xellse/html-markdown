// content.js - 在页面中执行的脚本，负责将 HTML 转换为 Markdown

/**
 * 初始化 TurndownService 并添加自定义规则
 * @returns {object} - 配置好的 TurndownService 实例
 */
const initTurndownService = () => {
  // 动态导入 turndown（通过 chrome.scripting.executeScript 注入的脚本使用）
  const TurndownService = window.TurndownService;
  if (!TurndownService) {
    console.error('TurndownService 未能加载');
    return null;
  }

  // 创建 turndown 实例
  const turndownService = new TurndownService({
    headingStyle: 'atx',      // 使用 # 样式的标题
    codeBlockStyle: 'fenced', // 使用 ``` 风格的代码块
    emDelimiter: '*',         // 使用 * 作为斜体
    bulletListMarker: '-',    // 使用 - 作为无序列表标记
    hr: '---',                // 水平线样式
  });

  // 添加自定义规则 - 将图片转换为链接格式：[alt](src)
  turndownService.addRule('images', {
    filter: ['img'],
    replacement: function (content, node) {
      const alt = node.alt || '图片';
      const src = node.getAttribute('src') || '';
      return src ? `[${alt}](${src})` : '';
    }
  });

  // 添加自定义规则 - 将视频转换为链接
  turndownService.addRule('videos', {
    filter: ['video'],
    replacement: function (content, node) {
      const src = node.getAttribute('src') || '';
      const poster = node.getAttribute('poster') || '';
      return src ? `[视频](${src})` : (poster ? `[视频封面](${poster})` : '[视频]');
    }
  });

  // 添加自定义规则 - 将音频转换为链接
  turndownService.addRule('audios', {
    filter: ['audio'],
    replacement: function (content, node) {
      const src = node.getAttribute('src') || '';
      return src ? `[音频](${src})` : '[音频]';
    }
  });

  // 添加自定义规则 - 将 iframe 转换为链接
  turndownService.addRule('iframes', {
    filter: ['iframe'],
    replacement: function (content, node) {
      const src = node.getAttribute('src') || '';
      const title = node.getAttribute('title') || '嵌入内容';
      return src ? `[${title}](${src})` : `[${title}]`;
    }
  });

  return turndownService;
};

/**
 * 生成当前时间的 ISO 字符串
 * @returns {string} - 格式化的时间字符串
 */
const getCurrentTime = () => {
  return new Date().toISOString();
};

/**
 * 获取当前页面标题
 * @returns {string} - 页面标题
 */
const getPageTitle = () => {
  return document.title || '无标题页面';
};

/**
 * 将当前页面转换为 Markdown
 * @returns {string} - 生成的 Markdown 内容
 */
const convertPageToMarkdown = () => {
  try {
    const turndownService = initTurndownService();
    if (!turndownService) return null;

    // 获取转换所需的信息
    const timestamp = getCurrentTime();
    const title = getPageTitle();
    
    // 复制当前 body 以避免修改原页面
    const tempBody = document.body.cloneNode(true);
    
    // 移除不需要的元素（如脚本、样式等）
    ['script', 'style', 'noscript', 'svg'].forEach(selector => {
      const elements = tempBody.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
    
    // 转换内容为 Markdown
    const markdown = turndownService.turndown(tempBody);
    
    // 组装最终的 Markdown 文档（按要求：第一行时间，第二行标题）
    return `${timestamp}\n# ${title}\n\n${markdown}`;
  } catch (error) {
    console.error('转换 Markdown 时出错:', error);
    return null;
  }
};

/**
 * 向 Service Worker 发送保存 Markdown 的消息
 * @param {string} markdown - Markdown 内容
 */
const sendMarkdownToServiceWorker = (markdown) => {
  chrome.runtime.sendMessage({
    type: 'SAVE_MD',
    payload: markdown
  }).catch(error => {
    console.error('发送 Markdown 到 Service Worker 时出错:', error);
  });
};

// 当从 worker.js 调用时执行
const convertAndSendMarkdown = () => {
  const markdown = convertPageToMarkdown();
  if (markdown) {
    sendMarkdownToServiceWorker(markdown);
  }
};

// 导出函数，使 worker.js 可以通过 chrome.scripting.executeScript 调用
window.convertAndSendMarkdown = convertAndSendMarkdown;
