// options.js - 处理设置页面的逻辑

// 存储设置的键名
const STORAGE_KEY = 'markdown_save_settings';

// 默认设置
const DEFAULT_SETTINGS = {
  dirTemplate: '',      // 保存目录模板
  hasChosenDir: false   // 用户是否已选择目录
};

// DOM 元素
const dirTemplateInput = document.getElementById('dirTemplate');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const saveMessage = document.getElementById('saveMessage');

/**
 * 显示消息
 * @param {string} message - 消息内容
 * @param {boolean} isSuccess - 是否成功消息
 */
const showMessage = (message, isSuccess = true) => {
  saveMessage.textContent = message;
  saveMessage.className = 'save-message ' + (isSuccess ? 'success' : 'error');
  
  // 3秒后自动隐藏消息
  setTimeout(() => {
    saveMessage.style.display = 'none';
  }, 3000);
};

/**
 * 加载设置
 */
const loadSettings = async () => {
  try {
    // 从 Chrome 存储中获取设置
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const settings = result[STORAGE_KEY] || DEFAULT_SETTINGS;
    
    // 更新表单
    dirTemplateInput.value = settings.dirTemplate || '';
  } catch (error) {
    console.error('加载设置时出错:', error);
    showMessage('加载设置失败: ' + error.message, false);
  }
};

/**
 * 保存设置
 */
const saveSettings = async () => {
  try {
    // 获取当前设置
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const currentSettings = result[STORAGE_KEY] || DEFAULT_SETTINGS;
    
    // 更新设置
    const newSettings = {
      ...currentSettings,
      dirTemplate: dirTemplateInput.value.trim()
    };
    
    // 保存到 Chrome 存储
    await chrome.storage.sync.set({
      [STORAGE_KEY]: newSettings
    });
    
    showMessage('设置已保存');
  } catch (error) {
    console.error('保存设置时出错:', error);
    showMessage('保存设置失败: ' + error.message, false);
  }
};

/**
 * 重置设置
 */
const resetSettings = async () => {
  try {
    // 获取当前设置，保留 hasChosenDir
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const currentSettings = result[STORAGE_KEY] || DEFAULT_SETTINGS;
    
    // 创建新设置，重置 dirTemplate 但保留其他
    const newSettings = {
      ...currentSettings,
      dirTemplate: ''
    };
    
    // 保存到 Chrome 存储
    await chrome.storage.sync.set({
      [STORAGE_KEY]: newSettings
    });
    
    // 更新表单
    dirTemplateInput.value = '';
    
    showMessage('设置已重置');
  } catch (error) {
    console.error('重置设置时出错:', error);
    showMessage('重置设置失败: ' + error.message, false);
  }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', loadSettings);

// 添加事件监听器
saveBtn.addEventListener('click', saveSettings);
resetBtn.addEventListener('click', resetSettings);
