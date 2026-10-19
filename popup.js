// 定义一个日志函数，用于调试信息输出
const DEBUG = true;

function log(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

// ==================== 国际化 (i18n) 双语字典与语言管理器 ====================
const I18N_DICT = {
  zh: {
    extName: "Cookie 管理器与每日语录",
    extDescription: "一个强大的浏览器扩展，帮助用户轻松管理和操作网站 Cookie。",
    loadingQuote: "正在加载名言...",
    searchPlaceholder: "搜索 cookies...",
    getCookies: "获取 Cookies",
    addCookie: "添加 Cookie",
    editCookie: "编辑 Cookie",
    deleteCookie: "删除 Cookie",
    importCookies: "导入 Cookies",
    exportCookies: "导出 Cookies",
    deleteAllCookies: "删除所有 Cookies",
    pinAll: "固定全部",
    unpinAll: "取消全部固定",
    refreshPage: "刷新页面",
    currentCookies: "当前页 Cookies",
    deleteCurrentCookies: "删除当前 Cookies",
    pinnedCookies: "已固定 Cookies",
    applyToCurrent: "应用到当前页面",
    dailyQuote: "每日语录",
    settings: "设置",
    colName: "名称",
    colValue: "值",
    colActions: "操作",
    actionEdit: "编辑",
    actionDelete: "删除",
    actionPin: "固定",
    actionUnpin: "取消",
    switchLang: "中",
    dialogEditCookieTitle: "编辑 Cookie",
    dialogCookieName: "Cookie 名称",
    dialogCookieValue: "Cookie 值",
    dialogCancel: "取消",
    dialogSave: "保存",
    dialogSaving: "保存中...",
    notifyDeleteSuccess: "Cookie 已成功删除",
    notifyDeleteFailed: "删除 Cookie 失败",
    modalGetCookiesTitle: "已获取 Cookies",
    modalFoundCookies: "共找到 {n} 个 Cookies",
    modalBtnCopySimple: "复制文本格式",
    modalBtnCopyDetailed: "复制详细 JSON",
    modalBtnClose: "关闭",
    modalCopiedSimple: "文本格式已复制到剪贴板！",
    modalCopiedDetailed: "详细 JSON 已复制到剪贴板！",
    modalCopyFailed: "复制失败",
    modalExportTitle: "导出 Cookies",
    modalCurrentPageCookiesCount: "当前页 Cookies 数量: ",
    modalAllDomainsCookiesCount: "所有域名 Cookies 数量: ",
    modalScopeCurrent: "当前页面 Cookies",
    modalScopeAll: "所有域名 Cookies",
    modalFormatJson: "JSON 格式 (包含详细属性)",
    modalFormatText: "纯文本格式",
    modalFormatCurl: "cURL 格式",
    modalDescriptionPlaceholder: "添加备注说明 (可选)",
    modalBtnCancel: "取消",
    modalBtnExport: "导出",
    modalExportSuccess: "Cookies 导出成功！",
    modalImportTitle: "导入 Cookies",
    modalFormatArray: "数组格式 (Array)",
    modalFormatObject: "对象格式 (Object)",
    modalImportPlaceholder: "在此粘贴 Cookies 数据...",
    modalBtnImport: "导入",
    modalImportSuccess: "导入成功",
    modalImportCompletedErrors: "导入完成（部分失败）",
    modalImportSuccessCount: "✓ 成功导入: ",
    modalImportFailCount: "✕ 失败: ",
    modalImportFailedList: "失败项列表:",
    modalImportFailedTitle: "导入失败",
    modalApplyTitle: "Cookie 应用状态",
    modalApplySuccess: "成功: {n} 个",
    modalApplyFail: "失败: {n} 个",
    modalApplyDomain: "目标域名: ",
    modalApplyFailDetails: "失败详情：",
    modalBtnConfirm: "确定",
    modalBtnRetry: "重试",
    modalBtnDebug: "查看详情",
    modalDebugAlert: "详细信息已输出到控制台，请按F12查看",
    modalConfirmDeleteCurrentTitle: "确认删除",
    modalConfirmDeleteCurrentMsg: "确定要删除当前页面的全部 {n} 个 Cookies 吗？",
    modalBtnDeleteAll: "全部删除",
    modalDeleteSuccess: "删除成功",
    modalDeleteCompletedErrors: "删除完成（部分失败）",
    modalDeleteSuccessCount: "✓ 成功删除: ",
    modalDeleteFailList: "删除失败项:",
    modalWarningTitle: "⚠️ 风险警告",
    modalWarningAllMsg: "确定要删除所有域名下的全部 {n} 个 Cookies 吗？此操作无法撤销。",
    modalAddTitle: "添加新 Cookie",
    modalAddName: "Cookie 名称 *",
    modalAddValue: "Cookie 值 *",
    modalAdvancedSettings: "高级设置",
    modalDomain: "域名 (Domain)",
    modalDomainPlaceholder: "留空默认为当前域名",
    modalDomainUsingCurrent: "使用当前域名",
    modalPath: "路径 (Path)",
    modalExpiration: "过期时间 (Expiration)",
    modalExpSession: "会话结束 (Session)",
    modalExpDate: "指定时间 (Specific Date)",
    modalExpDuration: "时长 (Duration)",
    modalUnitMinutes: "分钟",
    modalUnitHours: "小时",
    modalUnitDays: "天",
    modalUnitMonths: "月",
    modalUnitYears: "年",
    modalBtnAddCookie: "添加 Cookie",
    modalNameRequired: "请输入 Cookie 名称",
    modalAddSuccess: "Cookie 添加成功",
    modalDeletingCookies: "正在删除 Cookies...",
    modalDeletingAllCookies: "正在删除所有 Cookies...",
    modalApplyAutoRefresh: "3秒后将自动刷新页面...",
    modalErrorTitle: "错误",
    modalUnknownError: "未知错误",
    modalApplyErrorAlert: "应用Cookie时发生错误: {msg}\n请查看控制台获取详细信息",
    notifyCookiesRefreshed: "Cookies 刷新成功",
    notifyCookiesFetchFailed: "获取 Cookies 失败: ",
    notifyIncognitoWarning: "在无痕模式下使用此扩展，请在扩展管理设置中开启“在无痕模式下启用”"
  },
  en: {
    extName: "Cookie Manager with Daily Quotes",
    extDescription: "A powerful browser extension that helps users easily manage and manipulate website cookies.",
    loadingQuote: "Loading quote...",
    searchPlaceholder: "Search cookies...",
    getCookies: "Get Cookies",
    addCookie: "Add Cookie",
    editCookie: "Edit Cookie",
    deleteCookie: "Delete Cookie",
    importCookies: "Import Cookies",
    exportCookies: "Export Cookies",
    deleteAllCookies: "Delete All Cookies",
    pinAll: "Pin All",
    unpinAll: "Unpin All",
    refreshPage: "Refresh Page",
    currentCookies: "Current Page Cookies",
    deleteCurrentCookies: "Delete Current Cookies",
    pinnedCookies: "Pinned Cookies",
    applyToCurrent: "Apply to Current Page",
    dailyQuote: "Daily Quote",
    settings: "Settings",
    colName: "Name",
    colValue: "Value",
    colActions: "Actions",
    actionEdit: "Edit",
    actionDelete: "Delete",
    actionPin: "Pin",
    actionUnpin: "Unpin",
    switchLang: "EN",
    dialogEditCookieTitle: "Edit Cookie",
    dialogCookieName: "Cookie Name",
    dialogCookieValue: "Cookie Value",
    dialogCancel: "Cancel",
    dialogSave: "Save",
    dialogSaving: "Saving...",
    notifyDeleteSuccess: "Cookie deleted successfully",
    notifyDeleteFailed: "Failed to delete cookie",
    modalGetCookiesTitle: "Cookies Retrieved",
    modalFoundCookies: "Found {n} cookies",
    modalBtnCopySimple: "Copy Simple Format",
    modalBtnCopyDetailed: "Copy Detailed JSON",
    modalBtnClose: "Close",
    modalCopiedSimple: "Simple format copied to clipboard!",
    modalCopiedDetailed: "Detailed JSON copied to clipboard!",
    modalCopyFailed: "Failed to copy",
    modalExportTitle: "Export Cookies",
    modalCurrentPageCookiesCount: "Current page cookies: ",
    modalAllDomainsCookiesCount: "All domains cookies: ",
    modalScopeCurrent: "Current Page Cookies",
    modalScopeAll: "All Domains Cookies",
    modalFormatJson: "JSON Format (with details)",
    modalFormatText: "Simple Text Format",
    modalFormatCurl: "cURL Format",
    modalDescriptionPlaceholder: "Add description (optional)",
    modalBtnCancel: "Cancel",
    modalBtnExport: "Export",
    modalExportSuccess: "Cookies exported successfully!",
    modalImportTitle: "Import Cookies",
    modalFormatArray: "Array Format",
    modalFormatObject: "Object Format",
    modalImportPlaceholder: "Enter cookies here...",
    modalBtnImport: "Import",
    modalImportSuccess: "Import Successful",
    modalImportCompletedErrors: "Completed with Errors",
    modalImportSuccessCount: "✓ Successfully imported: ",
    modalImportFailCount: "✕ Failed: ",
    modalImportFailedList: "Failed cookies:",
    modalImportFailedTitle: "Import Failed",
    modalApplyTitle: "Cookie Application Status",
    modalApplySuccess: "Success: {n}",
    modalApplyFail: "Failed: {n}",
    modalApplyDomain: "Domain: ",
    modalApplyFailDetails: "Failure Details:",
    modalBtnConfirm: "Confirm",
    modalBtnRetry: "Retry",
    modalBtnDebug: "View Details",
    modalDebugAlert: "Details logged to console. Press F12 to inspect.",
    modalConfirmDeleteCurrentTitle: "Confirm Deletion",
    modalConfirmDeleteCurrentMsg: "Are you sure you want to delete all cookies ({n}) from the current page?",
    modalBtnDeleteAll: "Delete All",
    modalDeleteSuccess: "Deletion Successful",
    modalDeleteCompletedErrors: "Completed with Errors",
    modalDeleteSuccessCount: "✓ Successfully deleted: ",
    modalDeleteFailList: "Failed deletions:",
    modalWarningTitle: "⚠️ Warning",
    modalWarningAllMsg: "Are you sure you want to delete ALL cookies ({n}) from ALL domains? This action cannot be undone.",
    modalAddTitle: "Add New Cookie",
    modalAddName: "Cookie Name *",
    modalAddValue: "Cookie Value *" ,
    modalAdvancedSettings: "Advanced Settings",
    modalDomain: "Domain",
    modalDomainPlaceholder: "Leave empty for current domain",
    modalDomainUsingCurrent: "Using current domain",
    modalPath: "Path",
    modalExpiration: "Expiration",
    modalExpSession: "Session",
    modalExpDate: "Specific Date",
    modalExpDuration: "Duration",
    modalUnitMinutes: "Minutes",
    modalUnitHours: "Hours",
    modalUnitDays: "Days",
    modalUnitMonths: "Months",
    modalUnitYears: "Years",
    modalBtnAddCookie: "Add Cookie",
    modalNameRequired: "Cookie name is required",
    modalAddSuccess: "Cookie added successfully",
    modalDeletingCookies: "Deleting cookies...",
    modalDeletingAllCookies: "Deleting all cookies...",
    modalApplyAutoRefresh: "Page will reload in 3 seconds...",
    modalErrorTitle: "Error",
    modalUnknownError: "Unknown error",
    modalApplyErrorAlert: "Error applying cookies: {msg}\nPlease check console for details",
    notifyCookiesRefreshed: "Cookies refreshed successfully",
    notifyCookiesFetchFailed: "Failed to fetch cookies: ",
    notifyIncognitoWarning: "To use this extension in incognito mode, please enable it in extension settings"
  }
};

function detectDefaultLanguage() {
  const uiLang = (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage) 
    ? chrome.i18n.getUILanguage() 
    : (navigator.language || 'zh');
  return uiLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

let currentLang = detectDefaultLanguage();

function t(key, defaultVal = '') {
  const dict = I18N_DICT[currentLang] || I18N_DICT.en;
  if (dict && dict[key] !== undefined) {
    return dict[key];
  }
  if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
    const msg = chrome.i18n.getMessage(key);
    if (msg) return msg;
  }
  return defaultVal || key;
}

// 全局统一模态框安全退场与平滑销毁工具 (带动效闭环)
function closeUnifiedModal(dialog, overlay, callback) {
  if (!dialog && !overlay) return;
  if (dialog) dialog.classList.add('closing');
  if (overlay) overlay.classList.add('closing');
  setTimeout(() => {
    if (dialog && dialog.parentNode) dialog.remove();
    if (overlay && overlay.parentNode) overlay.remove();
    if (typeof callback === 'function') callback();
  }, 160);
}

function applyLanguage(lang, refreshTables = true) {
  currentLang = (lang === 'zh' || lang === 'en') ? lang : 'zh';
  document.documentElement.lang = currentLang;

  // 1. 替换网页标题
  document.title = t('extName');

  // 2. 遍历所有带 data-i18n 属性的元素进行更新
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  // 3. 遍历所有带 data-i18n-placeholder 属性的元素
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.placeholder = t(key);
    }
  });

  // 4. 兼容老式的 __MSG_ 文本节点扫描
  if (typeof replaceTextNodes === 'function') {
    replaceTextNodes(document.body);
  }

  // 5. 单独处理搜索输入框
  const searchInput = document.getElementById('searchCookie');
  if (searchInput) {
    searchInput.placeholder = t('searchPlaceholder');
  }

  // 6. 更新切换按钮文字与 title
  const langSwitchBtn = document.getElementById('langSwitch');
  const langSwitchText = document.getElementById('langSwitchText');
  if (langSwitchText) {
    langSwitchText.textContent = t('switchLang');
  }
  if (langSwitchBtn) {
    langSwitchBtn.title = currentLang === 'zh' 
      ? '当前语言：中文（点击切换为 English）' 
      : 'Current: English (Click to switch to 中文)';
  }

  // 7. 动态刷新表格行内按钮文本
  if (refreshTables) {
    if (typeof updateCurrentTable === 'function') {
      updateCurrentTable().catch(err => console.error(err));
    }
    if (typeof updatePinnedTable === 'function') {
      updatePinnedTable();
    }
  }
}

async function toggleLanguage() {
  const nextLang = currentLang === 'zh' ? 'en' : 'zh';
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ user_preferred_lang: nextLang });
    }
  } catch (e) {
    console.warn('Failed to save preferred language:', e);
  }
  applyLanguage(nextLang, true);
}

async function initLanguage() {
  let savedLang = null;
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const res = await chrome.storage.local.get(['user_preferred_lang']);
      if (res && res.user_preferred_lang) {
        savedLang = res.user_preferred_lang;
      }
    }
  } catch (e) {
    console.warn('Failed to get user_preferred_lang:', e);
  }

  const finalLang = savedLang || detectDefaultLanguage();
  applyLanguage(finalLang, false);

  const langSwitchBtn = document.getElementById('langSwitch');
  if (langSwitchBtn && !langSwitchBtn.dataset.bound) {
    langSwitchBtn.dataset.bound = 'true';
    langSwitchBtn.addEventListener('click', toggleLanguage);
  }
}
// ===========================================================================

// 定义多个翻译API源
const translationAPIs = [
  {
    name: 'Google',
    method: 'GET',
    getUrl: (text, from, to) => 
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`,
    extract: data => data[0][0][0],
    timeout: 5000 // 5秒超时
  },
  {
    name: 'DeepL',
    url: 'https://api-free.deepl.com/v2/translate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'DeepL-Auth-Key 123456789' // 使用免费API key
    },
    body: (text, from, to) => 
      `text=${encodeURIComponent(text)}&source_lang=${from}&target_lang=${to}`,
    extract: data => data.translations[0].text,
    timeout: 8000
  },
  {
    name: 'Yandex',
    method: 'GET',
    getUrl: (text, from, to) =>
      `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20230101T000000Z.1234567890abcdef.abc123&lang=${from}-${to}&text=${encodeURIComponent(text)}`,
    extract: data => data.text[0],
    timeout: 6000
  },
  {
    name: 'Bing',
    method: 'GET',
    getUrl: (text, from, to) =>
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${from}&to=${to}`,
    headers: {
      'Ocp-Apim-Subscription-Key': '123456789', // 使用免费试用key
      'Content-Type': 'application/json'
    },
    body: (text) => JSON.stringify([{ Text: text }]),
    extract: data => data[0].translations[0].text,
    timeout: 7000
  },
  {
    name: 'Baidu',
    method: 'GET',
    getUrl: (text, from, to) => {
      const appid = '20241015002176174'; // 使用免费API账号
      const salt = new Date().getTime();
      const key = 'B3AJF4wLIcVV7209UadB';
      const sign = MD5(appid + text + salt + key);
      return `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(text)}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;
    },
    extract: data => data.trans_result[0].dst,
    timeout: 6000
  }
];

// 定义多个一言API源
const apiSources = [
  {
    url: "https://v1.hitokoto.cn/?c=i&encode=json",
    transform: (data) => ({
      text: data.hitokoto,
      from: data.from
    })
  },
  {
    url: "https://api.quotable.io/random",
    transform: (data) => ({
      text: data.content,
      from: data.author
    })
  },
  {
    url: "https://api.apiopen.top/api/sentences",
    transform: (data) => ({
      text: data.result.name,
      from: data.result.from
    })
  },
  {
    url: "https://yijuzhan.com/api/word.php?m=json",
    transform: (data) => ({
      text: data.content,
      from: data.source
    })
  }
];

// 添加缓存相关的工具函数
const Cache = {
  async get(key) {
    try {
      const data = await chrome.storage.local.get(key);
      if (!data[key]) return null;
      
      const item = JSON.parse(data[key]);
      if (Date.now() > item.expiry) {
        await chrome.storage.local.remove(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },
  
  async set(key, value, ttl = 10 * 60 * 1000) { // 默认10分钟过期
    try {
      const item = {
        value: value,
        expiry: Date.now() + ttl
      };
      await chrome.storage.local.set({
        [key]: JSON.stringify(item)
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },
  
  async clear(key) {
    try {
      await chrome.storage.local.remove(key);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
};

/**
 * 获取每日引用
 */
async function fetchDailyQuote() {
  try {
    const quote = await getQuoteFromCacheOrApi();
    const translatedQuote = await translateQuote(quote);
    await cacheQuote(translatedQuote);
    updateQuoteDisplay(translatedQuote);
  } catch (error) {
    console.error('Quote fetch error:', error);
    // 显示默认引用
    updateQuoteDisplay({
      text: '生活总是充满希望',
      from: '永不放弃',
      translation: 'Life is always full of hope - Never give up'
    });
  }
}

/**
 * 从缓存或API获取引用
 * @returns 引用对象
 */
async function getQuoteFromCacheOrApi() {
  const cacheKey = 'dailyQuote';
  const cachedQuote = await Cache.get(cacheKey);

  if (cachedQuote) {
    console.log('Using cached quote');
    return cachedQuote;
  }

  return await fetchQuoteFromApi();
}

/**
 * 从API获取引用
 * @returns 引用对象
 * @throws 如果所有API源都失败，则抛出错误
 */
async function fetchQuoteFromApi() {
  let quote = null;
  let error = null;

  for (const source of apiSources) {
    try {
      const response = await fetch(source.url);
      if (!response.ok) continue;

      const data = await response.json();
      quote = source.transform(data);
      break;
    } catch (err) {
      error = err;
      continue;
    }
  }

  if (!quote) {
    throw new Error('All quote sources failed');
  }

  return quote;
}

/**
 * 翻译引用
 * @param quote 引用对象
 * @returns 翻译后的引用对象
 */
async function translateQuote(quote) {
  try {
    const translation = await translateTextWithCache(quote.text);
    quote.translation = translation;
  } catch (translateError) {
    console.error('Translation failed:', translateError);
    quote.translation = '';
  }

  return quote;
}

/**
 * 缓存引用
 * @param quote 引用对象
 */
async function cacheQuote(quote) {
  const cacheKey = 'dailyQuote';
  await Cache.set(cacheKey, quote);
}

/**
 * 使用缓存翻译文本
 *
 * @param text 需要翻译的文本
 * @param fromLang 源语言，默认为 'auto'
 * @param targetLang 目标语言，默认为 'en'
 * @returns Promise<string> 翻译后的文本
 * @throws Error 如果翻译过程中发生错误，将抛出异常
 */
async function translateTextWithCache(text, fromLang = 'auto', targetLang = 'en') {
  try {
    // 生成缓存键
    const cacheKey = `translation:${text}:${fromLang}:${targetLang}`;
    
    // 检查缓存
    const cachedTranslation = await Cache.get(cacheKey);
    if (cachedTranslation) {
      console.log('Using cached translation');
      return cachedTranslation;
    }

    // 如果没有缓存，进行翻译
    const translation = await translateText(text, fromLang, targetLang);
    
    // 缓存翻译结果
    await Cache.set(cacheKey, translation);
    
    return translation;
  } catch (error) {
    console.error('Translation cache error:', error);
    throw error;
  }
}

/**
 * 更新引用显示
 * @param quote 引用对象
 */
function updateQuoteDisplay(quote) {
  const quoteElement = document.getElementById("dailyQuote");
  
  quoteElement.innerHTML = `
    <div class="quote-container">
      <div class="quote-original">${quote.text} — ${quote.from}</div>
      ${quote.translation ? `<div class="quote-translated">${quote.translation}</div>` : ''}
    </div>
  `;
}

// 添加缓存清理函数（可选）
async function clearQuoteCache() {
  try {
    await Cache.clear('dailyQuote');
    // 清理所有翻译缓存
    const allData = await chrome.storage.local.get(null);
    const translationKeys = Object.keys(allData).filter(key => key.startsWith('translation:'));
    await Promise.all(translationKeys.map(key => Cache.clear(key)));
    
    console.log('Cache cleared successfully');
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

// 可以添加一个定期清理缓存的功能（可选）
async function cleanupExpiredCache() {
  try {
    const allData = await chrome.storage.local.get(null);
    const now = Date.now();
    
    for (const [key, value] of Object.entries(allData)) {
      try {
        const item = JSON.parse(value);
        if (item.expiry && now > item.expiry) {
          await Cache.clear(key);
        }
      } catch (error) {
        console.error(`Error cleaning up cache for key ${key}:`, error);
      }
    }
  } catch (error) {
    console.error('Cache cleanup error:', error);
  }
}

// 在扩展启动时清理过期缓存
chrome.runtime.onStartup.addListener(cleanupExpiredCache);


// 添加带超时的fetch函数
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 10000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// 修改翻译逻辑
async function translateText(text, fromLang = 'auto', targetLang = 'en') {
  let lastError = null;
  
  for (const api of translationAPIs) {
    try {
      console.log(`Trying translation with ${api.name}...`);
      
      const requestOptions = {
        method: api.method,
        headers: api.headers,
        timeout: api.timeout,
      };
      
      if (api.method === 'POST') {
        requestOptions.body = api.body(text, fromLang, targetLang);
      }
      
      const url = api.method === 'GET' 
        ? api.getUrl(text, fromLang, targetLang)
        : api.url;
        
      const response = await fetchWithTimeout(url, requestOptions);
      
      if (!response.ok) {
        console.log(`${api.name} returned status ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      const translation = api.extract(data);
      
      if (translation && translation.length > 0) {
        console.log(`Translation successful using ${api.name}`);
        return translation;
      }
      
      console.log(`${api.name} returned empty translation`);
    } catch (error) {
      lastError = error;
      console.log(`${api.name} translation failed:`, error.message);
      continue;
    }
  }
  
  throw new Error(`All translation APIs failed. Last error: ${lastError?.message}`);
}

const tableBody = document.querySelector("#cookieTable tbody");

// 添加更新cookie数量的函数
function updateCookieCount(count) {
  const cookieCountElement = document.getElementById('cookieCount');
  if (cookieCountElement) {
    cookieCountElement.textContent = count;
    
    // 添加动画效果
    cookieCountElement.style.animation = 'pulse 0.3s ease-in-out';
    setTimeout(() => {
      cookieCountElement.style.animation = '';
    }, 300);
  }
}

// Fetch and display cookies
async function fetchCookies() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  chrome.cookies.getAll({ url: tab.url }, (cookies) => {
    tableBody.innerHTML = ""; // Clear existing rows
    cookies.forEach((cookie) => {
      addCookieToTable(cookie);
    });
    // 更新cookie数量
    updateCookieCount(cookies.length);
  });
}

// Add a cookie row to the table
function addCookieToTable(cookie) {
  const row = document.createElement("tr");

  // Cookie Name
  const nameCell = document.createElement("td");
  nameCell.className = "cell-name";
  nameCell.textContent = cookie.name;
  nameCell.title = cookie.name;
  row.appendChild(nameCell);

  // Cookie Value
  const valueCell = document.createElement("td");
  valueCell.className = "cell-value";
  valueCell.textContent = cookie.value;
  valueCell.title = cookie.value;
  row.appendChild(valueCell);

  // Actions
  const actionCell = document.createElement("td");
  actionCell.className = "cell-actions";
  const actionGroup = document.createElement("div");
  actionGroup.className = "action-btn-group";

  const editButton = document.createElement("button");
  editButton.textContent = t("actionEdit");
  editButton.className = "btn-primary";
  editButton.addEventListener("click", () => editCookie(cookie));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = t("actionDelete");
  deleteButton.className = "btn-danger";
  deleteButton.addEventListener("click", () => {
    chrome.cookies.remove({
      url: `http${cookie.secure ? "s" : ""}://${cookie.domain}${cookie.path}`,
      name: cookie.name
    }, () => {
      row.remove();
      // 删除后更新计数
      const currentCount = tableBody.getElementsByTagName('tr').length;
      updateCookieCount(currentCount);
    });
  });

  // 在操作单元格中添加固定按钮
  const pinButton = document.createElement("button");
  pinButton.textContent = pinnedCookies.has(cookie.name) ? t("actionUnpin") : t("actionPin");
  pinButton.className = pinnedCookies.has(cookie.name) ? "unpin-button" : "pin-button";
  pinButton.addEventListener("click", () => {
    if (pinnedCookies.has(cookie.name)) {
      unpinCookie(cookie.name);
      pinButton.textContent = t("actionPin");
      pinButton.className = "pin-button";
    } else {
      pinCookie(cookie);
      pinButton.textContent = t("actionUnpin");
      pinButton.className = "unpin-button";
    }
  });

  actionGroup.appendChild(editButton);
  actionGroup.appendChild(deleteButton);
  actionGroup.appendChild(pinButton);
  actionCell.appendChild(actionGroup);
  row.appendChild(actionCell);

  tableBody.appendChild(row);
}

// Add a new cookie [暂时不开放此功能，因为需要用户手动输入域名和路径等详细信息，容易出错]

// Delete all cookies
/* document.getElementById("deleteAllCookies").addEventListener("click", () => {
  chrome.cookies.getAll({}, (cookies) => {
    cookies.forEach((cookie) => {
      chrome.cookies.remove({
        url: `http${cookie.secure ? "s" : ""}://${cookie.domain}${cookie.path}`,
        name: cookie.name
      });
    });
    fetchCookies();
    // 删除所有后更新计数为0
    updateCookieCount(0);
  });
}); */

// Export cookies
/* document.getElementById("exportCookies").addEventListener("click", () => {
  chrome.cookies.getAll({}, (cookies) => {
    const blob = new Blob([JSON.stringify(cookies, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cookies.json";
    a.click();
    URL.revokeObjectURL(url);
  });
}); */

/**
 * 导出 Cookies 的函数
 * @param {Array} cookies Cookie数组
 * @param {string} type 导出类型 ('json' | 'text' | 'curl')
 * @param {string} [description] 可选的描述信息
 */
async function exportCookies(cookies, type, description = '') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  let content = '';
  let filename = '';

  switch (type) {
    case 'json':
      content = JSON.stringify({
        description,
        exportTime: new Date().toISOString(),
        cookies: cookies.map(cookie => ({
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite,
          expirationDate: cookie.expirationDate
        }))
      }, null, 2);
      filename = `cookies_${timestamp}.json`;
      break;

    case 'text':
      content = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';\n');
      filename = `cookies_${timestamp}.txt`;
      break;

    case 'curl':
      content = cookies.map(cookie => `--cookie "${cookie.name}=${cookie.value}"`).join(' \\\n');
      content = `curl \\\n${content}`;
      filename = `cookies_${timestamp}.curl`;
      break;
  }

  // 创建并下载文件
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 显示导出选项面板
 */
async function showExportPanel() {
  // 获取当前标签页和所有 cookies
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentCookies = await chrome.cookies.getAll({ url: tab.url });
  const allCookies = await chrome.cookies.getAll({});

  // 创建遮罩层与面板元素
  const overlay = document.createElement('div');
  overlay.className = 'cm-modal-overlay';

  const panel = document.createElement('div');
  panel.className = 'cm-modal-dialog cm-modal-md';

  // 创建面板内容
  panel.innerHTML = `
    <div class="cm-modal-header">
      <h3>${t('modalExportTitle')}</h3>
      <button class="cm-modal-close" title="${t('modalBtnClose') || 'Close'}">×</button>
    </div>
    
    <div class="cm-modal-desc" style="text-align: center; margin-bottom: 12px;">
      <span style="display: inline-block; margin-right: 12px; color: rgba(255, 255, 255, 0.85);">${t('modalCurrentPageCookiesCount')}<strong style="color: #60A5FA;">${currentCookies.length}</strong></span>
      <span style="display: inline-block; color: rgba(255, 255, 255, 0.85);">${t('modalAllDomainsCookiesCount')}<strong style="color: #34D399;">${allCookies.length}</strong></span>
    </div>

    <div class="cm-modal-options" style="background: rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
      <label class="cm-modal-option">
        <input type="radio" name="cookieScope" value="current" checked>
        <span>${t('modalScopeCurrent')}</span>
      </label>
      <label class="cm-modal-option">
        <input type="radio" name="cookieScope" value="all">
        <span>${t('modalScopeAll')}</span>
      </label>
    </div>

    <div class="cm-modal-options" style="background: rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
      <label class="cm-modal-option">
        <input type="radio" name="exportFormat" value="json" checked>
        <span>${t('modalFormatJson')}</span>
      </label>
      <label class="cm-modal-option">
        <input type="radio" name="exportFormat" value="text">
        <span>${t('modalFormatText')}</span>
      </label>
      <label class="cm-modal-option">
        <input type="radio" name="exportFormat" value="curl">
        <span>${t('modalFormatCurl')}</span>
      </label>
    </div>

    <div style="margin-bottom: 12px;">
      <input type="text" class="cm-modal-input" placeholder="${t('modalDescriptionPlaceholder')}">
    </div>

    <div class="cm-modal-actions center">
      <button class="cm-modal-btn cm-btn-secondary cancel-button">${t('modalBtnCancel')}</button>
      <button class="cm-modal-btn cm-btn-primary export-button">${t('modalBtnExport')}</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  const closeFn = () => closeUnifiedModal(panel, overlay);

  panel.querySelector('.cm-modal-close').addEventListener('click', closeFn);
  panel.querySelector('.cancel-button').addEventListener('click', closeFn);
  overlay.addEventListener('click', closeFn);

  // 处理导出按钮点击
  panel.querySelector('.export-button').addEventListener('click', async () => {
    const scope = panel.querySelector('input[name="cookieScope"]:checked').value;
    const format = panel.querySelector('input[name="exportFormat"]:checked').value;
    const description = panel.querySelector('input[type="text"]').value;

    const cookiesToExport = scope === 'current' ? currentCookies : allCookies;
    await exportCookies(cookiesToExport, format, description);

    // 显示成功通知
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = t('modalExportSuccess');
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);

    closeFn();
  });

  // 添加键盘事件监听
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeFn();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// 添加导出按钮的事件监听器
document.getElementById('exportCookies').addEventListener('click', showExportPanel);

// 添加相关样式
const exportStyles = document.createElement('style');
exportStyles.textContent = `
  .export-panel {
    animation: fadeIn 0.3s ease-out;
  }

  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 4px;
    color: white;
    z-index: 1002;
    animation: slideIn 0.3s ease-out;
  }

  .notification.success {
    background: var(--success-color);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  .export-panel input[type="text"]:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }

  .export-panel button:hover {
    opacity: 0.9;
  }
`;
document.head.appendChild(exportStyles);

async function setCookies(cookies, tab) {
  const results = [];
  const url = new URL(tab.url);
  const domain = url.hostname;

  for (const cookie of cookies) {
    try {
      // 添加调试日志
      console.log('Setting cookie:', cookie);

      const cookieData = {
        url: tab.url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain || domain,
        path: cookie.path || "/",
        secure: cookie.secure || url.protocol === 'https:',
        httpOnly: cookie.httpOnly || false,
        sameSite: cookie.sameSite || "Lax",
        expirationDate: cookie.expirationDate || Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
      };

      // 先尝试删除已存在的同名cookie
      try {
        await chrome.cookies.remove({
          url: tab.url,
          name: cookie.name
        });
      } catch (error) {
        console.log(`No existing cookie to remove for ${cookie.name}`);
      }

      // 设置新cookie
      const result = await chrome.cookies.set(cookieData);
      
      if (result) {
        console.log(`Successfully set cookie:`, result);
        results.push({
          name: cookie.name,
          success: true
        });
        updateProgress(null, null, 
          `<span style="color: #28a745;">✓ Set cookie: ${cookie.name}</span>`);
      } else {
        throw new Error('Failed to set cookie');
      }

    } catch (error) {
      console.error(`Failed to set cookie ${cookie.name}:`, error);
      results.push({
        name: cookie.name,
        success: false,
        error: error.message
      });
      updateProgress(null, null, 
        `<span style="color: #dc3545;">❌ Failed to set ${cookie.name}: ${error.message}</span>`);
    }

    // 添加小延迟以避免可能的限制
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

// 添加 updateProgress 函数的实现
function updateProgress(message = null, progress = null, detail = null) {
  const progressElement = document.getElementById('importProgress');
  const progressBar = document.getElementById('progressBar');
  const detailsElement = document.getElementById('importDetails');

  // 更新进度消息
  if (message !== null && progressElement) {
    progressElement.textContent = message;
  }

  // 更新进度条
  if (progress !== null && progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  // 添加详细信息
  if (detail !== null && detailsElement) {
    const detailElement = document.createElement('div');
    detailElement.innerHTML = detail;
    detailsElement.appendChild(detailElement);
    // 自动滚动到底部
    detailsElement.scrollTop = detailsElement.scrollHeight;
  }
}

// 添加显示导入结果的函数
function showImportResults(results) {
  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;

  const dialog = document.querySelector('.import-dialog');
  if (!dialog) return;

  dialog.innerHTML = `
    <div style="text-align: center;">
      <h3 style="margin-bottom: 15px; color: ${failCount === 0 ? '#28a745' : '#dc3545'}">
        ${failCount === 0 ? t('modalImportSuccess') : t('modalImportCompletedErrors')}
      </h3>
      <div style="margin: 15px 0;">
        <p style="color: #28a745; margin: 5px 0;">${t('modalImportSuccessCount')}${successCount}</p>
        ${failCount > 0 ? `<p style="color: #dc3545; margin: 5px 0;">${t('modalImportFailCount')}${failCount}</p>` : ''}
      </div>
      ${failCount > 0 ? `
        <div style="text-align: left; margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; max-height: 200px; overflow-y: auto;">
          <p style="margin: 0 0 10px 0; font-weight: bold;">${t('modalImportFailedList')}</p>
          ${results.filter(r => !r.success)
            .map(r => `<p style="margin: 5px 0; color: #dc3545;">· ${r.name}: ${r.error || t('modalUnknownError')}</p>`)
            .join('')}
        </div>
      ` : ''}
      <div style="display: flex; justify-content: center; gap: 10px; margin-top: 15px;">
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
          padding: 8px 20px;
          border: none;
          border-radius: 4px;
          background: #28a745;
          color: white;
          cursor: pointer;
        ">${t('modalBtnClose')}</button>
        ${failCount > 0 ? `
          <button onclick="retryFailedImports(${JSON.stringify(results)})" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #dc3545;
            color: white;
            cursor: pointer;
          ">${t('modalBtnRetry')}</button>
        ` : ''}
      </div>
    </div>
  `;

  // 如果全部成功，2秒后自动关闭
  if (failCount === 0) {
    setTimeout(() => {
      if (dialog && dialog.parentNode) {
        dialog.remove();
      }
    }, 2000);
  }
}

// 添加一个新的函数来处理手动输入的cookie字符串
async function handleManualCookieInput(input) {
  try {
    // 移除多余的空白字符
    input = input.trim();
    
    // 如果输入为空
    if (!input) {
      throw new Error('Please enter cookie data');
    }

    let cookies = [];
    
    // 首先尝试作为JSON解析
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        cookies = parsed;
      } else if (parsed.cookies && Array.isArray(parsed.cookies)) {
        cookies = parsed.cookies;
      } else if (typeof parsed === 'object') {
        cookies = [parsed];
      }
    } catch (e) {
      // 如果JSON解析失败，尝试解析为简单格式
      cookies = input.split(';')
        .map(pair => {
          const [name, ...valueParts] = pair.trim().split('=');
          const value = valueParts.join('='); // 处理值中可能包含=的情况
          
          if (!name || typeof value === 'undefined') {
            console.warn('Invalid cookie pair:', pair);
            return null;
          }
          
          return {
            name: name.trim(),
            value: value.trim()
          };
        })
        .filter(cookie => cookie !== null);
    }

    // 验证解析后的结果
    if (!Array.isArray(cookies) || cookies.length === 0) {
      throw new Error('No valid cookies found in input');
    }

    // 验证每个cookie对象的格式
    cookies = cookies.filter(cookie => {
      const isValid = cookie && 
                     typeof cookie === 'object' && 
                     typeof cookie.name === 'string' && 
                     cookie.name.trim() !== '' &&
                     typeof cookie.value !== 'undefined';

      if (!isValid) {
        console.warn('Invalid cookie object:', cookie);
      }
      return isValid;
    });

    if (cookies.length === 0) {
      throw new Error('No valid cookies found after validation');
    }

    // 标准化cookie对象
    return cookies.map(cookie => ({
      name: cookie.name.trim(),
      value: String(cookie.value),
      path: cookie.path || '/',
      domain: cookie.domain || null,
      secure: !!cookie.secure,
      httpOnly: !!cookie.httpOnly,
      sameSite: cookie.sameSite || 'Lax'
    }));

  } catch (error) {
    console.error('Error parsing cookie input:', error);
    throw new Error(`Failed to parse cookie input: ${error.message}`);
  }
}

function parseCookieString(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input: Input must be a non-empty string');
  }

  input = input.trim();
  
  try {
    const jsonData = JSON.parse(input);
    
    // 处理数组格式 [{'test_a':'aaa123'}]
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => {
        // 如果是简单对象格式，转换为标准格式
        if (typeof item === 'object' && !item.name) {
          const entries = Object.entries(item);
          if (entries.length > 0) {
            const [name, value] = entries[0];
            return {
              name: name,
              value: value,
              path: "/",
              secure: false,
              httpOnly: false,
              sameSite: "Lax"
            };
          }
        }
        return item;
      });
    }
    
    // 处理单个对象格式 {'test_a':'aaa123'}
    if (typeof jsonData === 'object' && !jsonData.name) {
      const entries = Object.entries(jsonData);
      return entries.map(([name, value]) => ({
        name: name,
        value: value,
        path: "/",
        secure: false,
        httpOnly: false,
        sameSite: "Lax"
      }));
    }

    return [jsonData];
  } catch (e) {
    console.error('JSON parse error:', e);
    // 尝试解析为简单格式
    return parseSimpleFormat(input);
  }
}

function validateCookieObject(cookie) {
  // 添加调试日志
  console.log('Validating cookie object:', cookie);

  if (!cookie || typeof cookie !== 'object') {
    throw new Error('Invalid cookie format: must be an object');
  }

  // 处理简单对象格式
  if (!cookie.name && Object.keys(cookie).length === 1) {
    const [name, value] = Object.entries(cookie)[0];
    cookie = {
      name: name,
      value: value
    };
  }

  // 验证必要字段
  if (!cookie.name || typeof cookie.name !== 'string') {
    console.error('Invalid cookie object:', cookie);
    throw new Error('Invalid cookie: missing or invalid name property');
  }

  if (cookie.value === undefined) {
    throw new Error(`Invalid cookie: missing value for cookie "${cookie.name}"`);
  }

  // 返回标准化的cookie对象
  return {
    name: cookie.name.trim(),
    value: String(cookie.value),
    domain: cookie.domain || null,
    path: cookie.path || "/",
    secure: !!cookie.secure,
    httpOnly: !!cookie.httpOnly,
    sameSite: cookie.sameSite || "Lax",
    expirationDate: cookie.expirationDate || (Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60)
  };
}

// 导入 Cookies 事件监听器
document.getElementById("importCookies").addEventListener("click", () => {
  // 创建遮罩层与模态框主体
  const overlay = document.createElement('div');
  overlay.className = 'cm-modal-overlay';

  const dialog = document.createElement('div');
  dialog.className = 'cm-modal-dialog cm-modal-md';

  const closeFn = () => closeUnifiedModal(dialog, overlay);

  // 对话框内容
  dialog.innerHTML = `
    <div class="cm-modal-header">
      <h3>${t('modalImportTitle')}</h3>
      <button class="cm-modal-close" title="${t('modalBtnClose') || 'Close'}">×</button>
    </div>

    <div>
      <div class="cm-modal-pills">
        <button class="cm-modal-pill active format-array">${t('modalFormatArray')}</button>
        <button class="cm-modal-pill format-object">${t('modalFormatObject')}</button>
      </div>
      
      <textarea id="cookieInput" class="cm-modal-textarea" style="height: 160px;" placeholder="${t('modalImportPlaceholder')}"></textarea>
    </div>

    <div class="cm-modal-actions">
      <button class="cm-modal-btn cm-btn-secondary cancel-button">${t('modalBtnCancel')}</button>
      <button class="cm-modal-btn cm-btn-primary import-button">${t('modalBtnImport')}</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(dialog);

  dialog.querySelector('.cm-modal-close').addEventListener('click', closeFn);
  overlay.addEventListener('click', closeFn);

  // 示例格式
  const arrayFormat = [
    {'cookieName': 'cookieValue'},
    {'anotherCookie': 'anotherValue'}
  ];
  
  const objectFormat = {
    'cookieName': 'cookieValue',
    'anotherCookie': 'anotherValue'
  };

  // 格式化按钮事件
  dialog.querySelector('.format-array').addEventListener('click', () => {
    dialog.querySelector('.format-array').classList.add('active');
    dialog.querySelector('.format-object').classList.remove('active');
    const input = document.getElementById('cookieInput').value;
    if (!input.trim()) {
      // 如果没有输入，显示示例
      document.getElementById('cookieInput').value = JSON.stringify(arrayFormat, null, 2);
      return;
    }

    // 尝试格式化现有输入
    try {
      const formatted = formatAsArray(input);
      if (formatted) {
        document.getElementById('cookieInput').value = formatted;
      }
    } catch (error) {
      showFormatError(error.message);
    }
  });

  dialog.querySelector('.format-object').addEventListener('click', () => {
    dialog.querySelector('.format-object').classList.add('active');
    dialog.querySelector('.format-array').classList.remove('active');
    const input = document.getElementById('cookieInput').value;
    if (!input.trim()) {
      // 如果没有输入，显示示例
      document.getElementById('cookieInput').value = JSON.stringify(objectFormat, null, 2);
      return;
    }

    // 尝试格式化现有输入
    try {
      const formatted = formatAsObject(input);
      if (formatted) {
        document.getElementById('cookieInput').value = formatted;
      }
    } catch (error) {
      showFormatError(error.message);
    }
  });

  // 显示错误信息的函数
  function showFormatError(message) {
    const errorDiv = document.querySelector('#formatError');
    if (!errorDiv) {
      // 如果错误提示div不存在，创建一个
      const newErrorDiv = document.createElement('div');
      newErrorDiv.id = 'formatError';
      newErrorDiv.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 5px;
        border-radius: 4px;
        background-color: rgba(220, 53, 69, 0.1);
        display: none;
      `;
      document.getElementById('cookieInput').insertAdjacentElement('afterend', newErrorDiv);
    }

    const targetErrorDiv = document.querySelector('#formatError');
    targetErrorDiv.textContent = message;
    targetErrorDiv.style.display = 'block';

    // 3秒后自动清除错误信息
    setTimeout(() => {
      targetErrorDiv.style.display = 'none';
      targetErrorDiv.textContent = '';
    }, 3000);
  }

  // 格式化函数
  function formatAsArray(input) {
    try {
      let data;
      // 如果输入是字符串，尝试解析
      if (typeof input === 'string') {
        input = input.trim();
        if (!input) {
          throw new Error('Empty input');
        }

        // 首先尝试作为JSON解析
        try {
          data = JSON.parse(input);
        } catch (e) {
          // 如果JSON解析失败，尝试解析为cookie字符串
          if (input.includes('=')) {
            data = input.split(';').map(pair => {
              const [name, ...valueParts] = pair.trim().split('=');
              const value = valueParts.join('=');
              if (!name) throw new Error('Invalid cookie format');
              return { [name.trim()]: value.trim() };
            });
          } else {
            throw new Error('Invalid input format: must be JSON or cookie string');
          }
        }
      } else {
        data = input;
      }

      // 如果是对象格式，转换为数组格式
      if (!Array.isArray(data) && typeof data === 'object') {
        data = Object.entries(data).map(([name, value]) => ({ [name]: value }));
      }

      // 验证并规范化数组格式
      if (!Array.isArray(data)) {
        throw new Error('Cannot convert to array format');
      }

      // 验证数组内的每个元素
      data = data.map(item => {
        if (typeof item !== 'object' || item === null) {
          throw new Error('Each item must be an object');
        }
        const entries = Object.entries(item);
        if (entries.length !== 1) {
          throw new Error('Each item must have exactly one key-value pair');
        }
        return item;
      });

      return JSON.stringify(data, null, 2);
    } catch (error) {
      throw new Error(`Format error: ${error.message}`);
    }
  }

  function formatAsObject(input) {
    try {
      let data;
      // 如果输入是字符串，尝试解析
      if (typeof input === 'string') {
        input = input.trim();
        if (!input) {
          throw new Error('Empty input');
        }

        // 首先尝试作为JSON解析
        try {
          data = JSON.parse(input);
        } catch (e) {
          // 如果JSON解析失败，尝试解析为cookie字符串
          if (input.includes('=')) {
            data = {};
            input.split(';').forEach(pair => {
              const [name, ...valueParts] = pair.trim().split('=');
              const value = valueParts.join('=');
              if (!name) throw new Error('Invalid cookie format');
              data[name.trim()] = value.trim();
            });
          } else {
            throw new Error('Invalid input format: must be JSON or cookie string');
          }
        }
      } else {
        data = input;
      }

      // 如果是数组格式，转换为对象格式
      if (Array.isArray(data)) {
        const obj = {};
        data.forEach(item => {
          if (typeof item !== 'object' || item === null) {
            throw new Error('Each array item must be an object');
          }
          const entries = Object.entries(item);
          if (entries.length !== 1) {
            throw new Error('Each array item must have exactly one key-value pair');
          }
          const [key, value] = entries[0];
          obj[key] = value;
        });
        data = obj;
      }

      // 验证是否为对象
      if (typeof data !== 'object' || data === null) {
        throw new Error('Cannot convert to object format');
      }

      return JSON.stringify(data, null, 2);
    } catch (error) {
      throw new Error(`Format error: ${error.message}`);
    }
  }

  // 关闭按钮事件
  dialog.querySelector('.close-button').addEventListener('click', () => {
    dialog.remove();
  });

  // 取消按钮事件
  dialog.querySelector('.cancel-button').addEventListener('click', closeFn);

  // 导入按钮事件
  dialog.querySelector('.import-button').addEventListener('click', async () => {
    try {
      const input = document.getElementById('cookieInput').value.trim();
      if (!input) {
        throw new Error('Please enter cookie data');
      }

      // 解析输入
      let cookies = [];
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
          // 处理数组格式
          cookies = parsed.map(item => {
            const [name, value] = Object.entries(item)[0];
            return { name, value };
          });
        } else if (typeof parsed === 'object') {
          // 处理对象格式
          cookies = Object.entries(parsed).map(([name, value]) => ({
            name,
            value
          }));
        }
      } catch (e) {
        throw new Error('Invalid JSON format');
      }

      // 获取当前标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        throw new Error('No active tab found');
      }

      // 设置cookies
      const results = [];
      for (const cookie of cookies) {
        try {
          await chrome.cookies.set({
            url: tab.url,
            name: cookie.name,
            value: cookie.value
          });
          results.push({ name: cookie.name, success: true });
        } catch (error) {
          results.push({ name: cookie.name, success: false, error: error.message });
        }
      }

      // 更新cookie列表和计数
      await fetchCookies();

      // 显示结果通知
      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;

      dialog.innerHTML = `
        <div style="text-align: center; padding: 10px;">
          <h3 style="margin-bottom: 12px; font-size: 15px; color: ${failCount === 0 ? '#34D399' : '#F87171'}">
            ${failCount === 0 ? t('modalImportSuccess') : t('modalImportCompletedErrors')}
          </h3>
          <p style="color: #34D399; margin: 4px 0; font-size: 12px;">${t('modalImportSuccessCount')}${successCount}</p>
          ${failCount > 0 ? `<p style="color: #F87171; margin: 4px 0; font-size: 12px;">${t('modalImportFailCount')}${failCount}</p>` : ''}
          <div class="cm-modal-actions center" style="margin-top: 14px;">
            <button class="cm-modal-btn cm-btn-primary close-result-btn">${t('modalBtnClose')}</button>
          </div>
        </div>
      `;
      dialog.querySelector('.close-result-btn').addEventListener('click', closeFn);

      // 如果全部成功，2秒后自动关闭
      if (failCount === 0) {
        setTimeout(closeFn, 2000);
      }

    } catch (error) {
      // 显示错误消息
      dialog.innerHTML = `
        <div style="text-align: center; padding: 10px;">
          <h3 style="margin-bottom: 12px; font-size: 15px; color: #F87171;">${t('modalImportFailedTitle')}</h3>
          <p style="margin-bottom: 14px; font-size: 12px; color: rgba(255, 255, 255, 0.8);">${error.message}</p>
          <div class="cm-modal-actions center">
            <button class="cm-modal-btn cm-btn-secondary close-result-btn">${t('modalBtnClose')}</button>
          </div>
        </div>
      `;
      dialog.querySelector('.close-result-btn').addEventListener('click', closeFn);
    }
  });
});

// 添加重试失败导入的函数
window.retryFailedImports = async function(results) {
  const failedCookies = results.filter(r => !r.success);
  if (failedCookies.length > 0) {
    // 移除旧的导入对话框
    const oldDialog = document.querySelector('.import-dialog');
    if (oldDialog) oldDialog.remove();
    
    // 重新导入失败的cookie
    const event = new Event('click');
    document.getElementById('importCookies').dispatchEvent(event);
  }
};

// 优化后的搜索函数
document.getElementById("searchCookie").addEventListener("input", (event) => {
  const filter = event.target.value.toLowerCase();
  const tables = ['cookieTable', 'pinnedTable'];
  
  // 遍历两个表格
  tables.forEach(tableId => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    // 遍历表格行
    Array.from(tbody.rows).forEach(row => {
      const name = row.cells[0].textContent.toLowerCase();
      const value = row.cells[1].textContent.toLowerCase();
      const isMatch = name.includes(filter) || value.includes(filter);
      
      // 更新行的显示状态
      row.style.display = isMatch ? "" : "none";
    });

    // 更新对应的计数器
    const countId = tableId === 'cookieTable' ? 'cookieCount' : 'pinnedCount';
    const counter = document.getElementById(countId);
    if (counter) {
      const totalRows = tbody.rows.length;
      const visibleRows = Array.from(tbody.rows).filter(row => row.style.display !== "none").length;
      counter.textContent = filter ? `${visibleRows}/${totalRows}` : totalRows;
    }
  });

  // 更新搜索框样式
  const searchInput = event.target;
  const totalVisible = tables.reduce((sum, tableId) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    return sum + (tbody ? Array.from(tbody.rows).filter(row => row.style.display !== "none").length : 0);
  }, 0);

  // 设置搜索框背景色 - 使用更柔和的颜色
  if (filter) {
    searchInput.style.backgroundColor = totalVisible > 0 ? 
      'rgba(240, 248, 255, 0.95)' :  // 非常淡的蓝色，接近白色
      'rgba(255, 240, 240, 0.95)';   // 非常淡的红色，接近白色
    searchInput.style.borderColor = totalVisible > 0 ?
      '#ADD8E6' :  // 淡蓝色边框
      '#FFB6C1';   // 淡红色边框
  } else {
    searchInput.style.backgroundColor = '#FFFFFF';  // 纯白色
    searchInput.style.borderColor = 'transparent';
  }
});

// 添加搜索框样式
const searchStyle = document.createElement('style');
searchStyle.textContent = `
  #searchCookie {
    transition: background-color 0.3s ease;
    padding: 8px;
    width: calc(100% - 18px);
    border: 1px solid transparent;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #FFFFFF;
  }

  #searchCookie:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  #cookieCount, #pinnedCount {
    transition: all 0.3s ease;
  }
`;
document.head.appendChild(searchStyle);

// 存储固定的cookie
let pinnedCookies = new Map();

// 从存储中加载固定的cookie
async function loadPinnedCookies() {
  const result = await chrome.storage.local.get('pinnedCookies');
  pinnedCookies = new Map(result.pinnedCookies || []);
  updatePinnedTable();
  updatePinnedCount();
}

// 保存固定的cookie到存储
async function savePinnedCookies() {
  await chrome.storage.local.set({
    pinnedCookies: Array.from(pinnedCookies.entries())
  });
  updatePinnedCount();
}

// 更新固定cookie数量显示
function updatePinnedCount() {
  document.getElementById('pinnedCount').textContent = pinnedCookies.size;
}

// 将cookie添加到固定列表
async function pinCookie(cookie, isAlloweShowNotification = true) {
  try {
    const cookieToPin = {
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain || null,
      path: cookie.path || "/",
      secure: cookie.secure || false,
      httpOnly: cookie.httpOnly || false,
      sameSite: cookie.sameSite || "Lax",
      expirationDate: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
      url: cookie.url || null
    };
    
    pinnedCookies.set(cookie.name, cookieToPin);
    await savePinnedCookies();

    // 更新UI
    await updatePinnedTable();
    await updateCurrentTable(); // 更新当前cookie表格中的pin状态

    console.log('Cookie pinned:', cookie.name);
    
    // 显示成功提示
    console.log('Cookie pinned isAlloweShowNotification:', isAlloweShowNotification);
    if (isAlloweShowNotification) {
      showNotification(`Cookie "${cookie.name}" has been pinned`, 'success'); 
    }

    // 立即应用这个cookie
    try {
      await applyCookie(cookieToPin, isAlloweShowNotification);
    } catch (error) {
      console.error('Failed to apply pinned cookie:', error);
    }
  } catch (error) {
    console.error('Failed to pin cookie:', error);
    showNotification('Cookie pinned but failed to apply', 'warning');
  }
}

// 从固定列表移除cookie
async function unpinCookie(name) {
  try {
    pinnedCookies.delete(name);
    await savePinnedCookies();
    
    // 更新UI
    await updatePinnedTable();
    await updateCurrentTable(); // 更新当前cookie表格中的pin状态
    
    // 显示成功提示
    showNotification(`Cookie "${name}" has been unpinned`, 'success');
  } catch (error) {
    console.error('Failed to unpin cookie:', error);
    showNotification('Failed to unpin cookie', 'error');
  }
}

async function updateCurrentTable() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const cookies = await chrome.cookies.getAll({ url: tab.url });
  const tableBody = document.querySelector("#cookieTable tbody");
  tableBody.innerHTML = "";
  
  cookies.forEach(cookie => {
    const row = document.createElement("tr");
    
    // Name cell
    const nameCell = document.createElement("td");
    nameCell.className = "cell-name";
    nameCell.textContent = cookie.name;
    nameCell.title = cookie.name;
    row.appendChild(nameCell);
    
    // Value cell
    const valueCell = document.createElement("td");
    valueCell.className = "cell-value";
    valueCell.textContent = cookie.value;
    valueCell.title = cookie.value;
    row.appendChild(valueCell);
    
    // Actions cell
    const actionCell = document.createElement("td");
    actionCell.className = "cell-actions";
    const actionGroup = document.createElement("div");
    actionGroup.className = "action-btn-group";
    
    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = t("actionEdit");
    editButton.className = "btn-primary";
    editButton.addEventListener("click", () => editCookie(cookie));
    
    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = t("actionDelete");
    deleteButton.className = "btn-danger";
    deleteButton.addEventListener("click", async () => {
      try {
        await chrome.cookies.remove({
          url: tab.url,
          name: cookie.name
        });
        await updateCurrentTable();
        showNotification(`${t('notifyDeleteSuccess')}: "${cookie.name}"`, 'success');
      } catch (error) {
        console.error('Failed to delete cookie:', error);
        showNotification(`${t('notifyDeleteFailed')}: ${error.message}`, 'error');
      }
    });
    
    // Pin/Unpin button
    const pinButton = document.createElement("button");
    const isPinned = pinnedCookies.has(cookie.name);
    pinButton.textContent = isPinned ? t("actionUnpin") : t("actionPin");
    pinButton.className = isPinned ? "btn-danger" : "btn-success";
    
    pinButton.addEventListener("click", async () => {
      if (isPinned) {
        await unpinCookie(cookie.name);
      } else {
        await pinCookie(cookie);
      }
    });
    
    // 添加所有按钮到操作组
    actionGroup.appendChild(editButton);
    actionGroup.appendChild(deleteButton);
    actionGroup.appendChild(pinButton);
    actionCell.appendChild(actionGroup);
    row.appendChild(actionCell);
    
    tableBody.appendChild(row);
  });

  // 更新计数
  document.getElementById("cookieCount").textContent = cookies.length;
}

async function editCookie(cookie, isPinned = false) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('No active tab found');

    const overlay = document.createElement('div');
    overlay.className = 'cm-modal-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'cm-modal-dialog cm-modal-md';

    const closeFn = () => closeUnifiedModal(dialog, overlay);

    dialog.innerHTML = `
      <div class="cm-modal-header">
        <h3>${t('dialogEditCookieTitle')}</h3>
        <button class="cm-modal-close" title="${t('modalBtnClose') || 'Close'}">×</button>
      </div>
      
      <div style="margin-bottom: 12px;">
        <label style="display: block; margin-bottom: 4px; color: rgba(255, 255, 255, 0.7); font-size: 11.5px; font-weight: 500;">${t('dialogCookieName')}</label>
        <div style="
          padding: 7px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #60A5FA;
          font-size: 11.5px;
          font-weight: 600;
          word-break: break-all;
        ">${cookie.name}</div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 4px; color: rgba(255, 255, 255, 0.7); font-size: 11.5px; font-weight: 500;">${t('dialogCookieValue')}</label>
        <textarea id="editValue" class="cm-modal-textarea" style="height: 100px; font-size: 11px;">${cookie.value}</textarea>
      </div>

      <div class="cm-modal-actions">
        <button class="cm-modal-btn cm-btn-secondary cancel-edit">${t('dialogCancel')}</button>
        <button class="cm-modal-btn cm-btn-primary save-edit">${t('dialogSave')}</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    dialog.querySelector('.cm-modal-close').addEventListener('click', closeFn);
    overlay.addEventListener('click', closeFn);
    dialog.querySelector('.cancel-edit').addEventListener('click', closeFn);

    // 处理保存按钮
    dialog.querySelector('.save-edit').addEventListener('click', async () => {
      const saveButton = dialog.querySelector('.save-edit');
      const cancelButton = dialog.querySelector('.cancel-edit');
      const input = dialog.querySelector('#editValue');
      
      // 禁用按钮和输入框
      saveButton.disabled = true;
      cancelButton.disabled = true;
      input.disabled = true;
      saveButton.style.background = '#ccc';
      saveButton.textContent = t('dialogSaving');

      const newValue = input.value;
      
      try {
        const url = new URL(tab.url);
        const cookieData = {
          url: tab.url,
          name: cookie.name,
          value: newValue,
          domain: cookie.domain,
          path: cookie.path || '/',
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite,
          expirationDate: cookie.expirationDate || (Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60)
        };

        // 如果是localhost，不设置domain
        if (url.hostname === 'localhost') {
          delete cookieData.domain;
        }

        // 先删除现有cookie
        await chrome.cookies.remove({
          url: tab.url,
          name: cookie.name
        });

        // 设置新cookie
        const result = await chrome.cookies.set(cookieData);
        
        if (!result) {
          throw new Error('Failed to update cookie');
        }

        // 如果是固定的cookie，也更新pinnedCookies
        if (isPinned || pinnedCookies.has(cookie.name)) {
          const updatedCookie = { ...cookie, value: newValue };
          pinnedCookies.set(cookie.name, updatedCookie);
          await savePinnedCookies();
          updatePinnedTable();
        }

        // 更新表格显示
        await fetchCookies();

        showNotification('Cookie updated successfully', 'success');
        closeFn();

      } catch (error) {
        // console.error('Failed to update cookie:', error);
        showNotification(`Failed to update cookie: ${error.message}`, 'error');
        
        // 恢复按钮和输入框状态
        saveButton.disabled = false;
        cancelButton.disabled = false;
        input.disabled = false;
        saveButton.style.background = '#2196F3';
        saveButton.textContent = 'Save';
      }
    });

  } catch (error) {
    // console.error('Error in editCookie:', error);
    showNotification(`Error: ${error.message}`, 'error');
  }
}

// 更新固定cookie表格
async function updatePinnedTable() {
  const pinnedTableBody = document.querySelector("#pinnedTable tbody");
  pinnedTableBody.innerHTML = "";
  
  pinnedCookies.forEach((cookie, name) => {
    const row = document.createElement("tr");
    
    // Name cell
    const nameCell = document.createElement("td");
    nameCell.className = "cell-name";
    nameCell.textContent = name;
    nameCell.title = name;
    row.appendChild(nameCell);
    
    // Value cell
    const valueCell = document.createElement("td");
    valueCell.className = "cell-value";
    valueCell.textContent = cookie.value;
    valueCell.title = cookie.value;
    row.appendChild(valueCell);
    
    // Actions cell
    const actionCell = document.createElement("td");
    actionCell.className = "cell-actions";
    const actionGroup = document.createElement("div");
    actionGroup.className = "action-btn-group";
    
    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = t("actionEdit");
    editButton.className = "btn-primary";
    editButton.addEventListener("click", () => editCookie(cookie));
    
    // Unpin button
    const unpinButton = document.createElement("button");
    unpinButton.textContent = t("actionUnpin");
    unpinButton.className = "btn-danger";
    unpinButton.addEventListener("click", () => unpinCookie(name));
    
    actionGroup.appendChild(editButton);
    actionGroup.appendChild(unpinButton);
    actionCell.appendChild(actionGroup);
    row.appendChild(actionCell);
    
    pinnedTableBody.appendChild(row);
  });

  // 更新计数
  document.getElementById("pinnedCount").textContent = pinnedCookies.size;
}

// 修改 applyPinnedCookies 函数，添加重试机制
async function applyPinnedCookies() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  console.log('Applying pinned cookies to:', tab.url);
  
  const maxRetries = 3;
  
  for (const cookie of pinnedCookies.values()) {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        await applyCookie(cookie);
        // 验证cookie是否设置成功
        const isSet = await verifyCookie(cookie);
        if (isSet) {
          console.log(`Cookie ${cookie.name} applied successfully`);
          break;
        }
        throw new Error('Cookie verification failed');
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          console.error(`Failed to apply cookie ${cookie.name} after ${maxRetries} attempts:`, error);
        } else {
          console.log(`Retrying to set cookie ${cookie.name}, attempt ${retries + 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
        }
      }
    }
  }
}

// 修改 verifyCookie 函数，使其更可靠
async function verifyCookie(cookie) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return false;

  try {
    const url = new URL(tab.url);
    let domain = cookie.domain;
    if (domain && domain.startsWith('.')) {
      domain = domain.substring(1);
    }
    if (!domain) {
      domain = url.hostname;
    }

    const cookieUrl = `${url.protocol}//${domain}${cookie.path || '/'}`;
    
    const existingCookie = await chrome.cookies.get({
      url: cookieUrl,
      name: cookie.name
    });

    return existingCookie && existingCookie.value === cookie.value;
  } catch (error) {
    console.error(`Failed to verify cookie ${cookie.name}:`, error);
    return false;
  }
}

// 修改标签页切换监听器，增加延迟和重试
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // 等待页面完全加载
  setTimeout(async () => {
    try {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      if (tab.status === 'complete') {
        console.log('Tab activated, applying pinned cookies:', tab.url);
        await applyPinnedCookies();
      }
    } catch (error) {
      console.error('Error in tab activation handler:', error);
    }
  }, 1000); // 增加延迟到1秒
});

// 应用所有固定的cookie
async function applyPinnedCookies() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  console.log('Applying pinned cookies to:', tab.url);
  
  for (const cookie of pinnedCookies.values()) {
    try {
      await applyCookie(cookie, false);
    } catch (error) {
      console.error(`Failed to apply pinned cookie ${cookie.name}:`, error);
    }
  }
}

// 新增事件监听器
document.getElementById("pinAllCookies").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  
  const cookies = await chrome.cookies.getAll({ url: tab.url });
  for (const cookie of cookies) {
    await pinCookie(cookie, false);
  }
  console.log(cookies.length, '---cookies.length ')
  if (cookies.length > 0) {
    showNotification('All cookies pinned successfully!', 'success');  
  }
  fetchCookies();
});

document.getElementById("unpinAllCookies").addEventListener("click", async () => {
  pinnedCookies.clear();
  await savePinnedCookies();
  updatePinnedTable();
  fetchCookies();
});

// 监听标签页更改
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // 等待一小段时间确保页面完全加载
  setTimeout(async () => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.status === 'complete') {
      console.log('Tab activated, applying pinned cookies:', tab.url);
      await applyPinnedCookies();
    }
  }, 500);
});

// 监听页面加载完成
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Page loaded, applying pinned cookies:', tab.url);
    await applyPinnedCookies();
  }
});

// 函数用于验证cookie是否设置成功
async function verifyCookie(cookie) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return false;

  try {
    const url = new URL(tab.url);
    const cookieUrl = `${url.protocol}//${cookie.domain || url.hostname}${cookie.path || '/'}`;
    
    const existingCookie = await chrome.cookies.get({
      url: cookieUrl,
      name: cookie.name
    });

    return existingCookie && existingCookie.value === cookie.value;
  } catch (error) {
    console.error(`Failed to verify cookie ${cookie.name}:`, error);
    return false;
  }
}

// 添加调试信息显示
function showDebugInfo(message) {
  console.log(message);
  const debugElement = document.getElementById('debugInfo');
  if (debugElement) {
    const timestamp = new Date().toISOString();
    debugElement.innerHTML += `<div>[${timestamp}] ${message}</div>`;
    debugElement.scrollTop = debugElement.scrollHeight;
  }
}

// 添加新的函数：强制应用cookie到当前页面
async function forceApplyToCurrent() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    // 检查无痕模式权限
    if (tab.incognito) {
      const hasPermission = await chrome.extension.isAllowedIncognitoAccess();
      if (!hasPermission) {
        throw new Error('Incognito mode access not allowed');
      }
    }

    // 获取当前页面的cookie
    const url = new URL(tab.url);
    console.log('当前URL:', url.href);
    const isLocalhost = url.hostname === 'localhost';
    console.log('是否为localhost:', isLocalhost);

    let successCount = 0;
    let failCount = 0;
    let results = [];

    // 遍历所有固定的cookie
    for (const cookie of pinnedCookies.values()) {
      try {
        const cookieData = {
          url: url.href,
          name: cookie.name,
          value: cookie.value,
          path: "/",
          domain: isLocalhost ? undefined : url.hostname,
          expirationDate: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
          storeId: tab.incognito ? "1" : "0" // 添加 storeId
        };

        // 删除现有 cookie
        try {
          await chrome.cookies.remove({
            url: url.href,
            name: cookie.name,
            storeId: tab.incognito ? "1" : "0"
          });
        } catch (error) {
          console.log('No existing cookie to remove');
        }

        // 设置新cookie
        const result = await chrome.cookies.set(cookieData);
        
        if (result) {
          successCount++;
          results.push({
            name: cookie.name,
            success: true,
            value: cookie.value
          });
        } else {
          throw new Error('设置失败');
        }
      } catch (error) {
        failCount++;
        results.push({
          name: cookie.name,
          success: false,
          error: error.message
        });
      }
    }

    // 创建遮罩层与结果通知
    const overlay = document.createElement('div');
    overlay.className = 'cm-modal-overlay';

    const notification = document.createElement('div');
    notification.className = 'cm-modal-dialog cm-modal-sm';

    const closeFn = () => closeUnifiedModal(notification, overlay);

    // 构建通知内容
    let notificationContent = `
      <div style="text-align: center;">
        <h3 style="margin: 0 0 10px 0; font-size: 14.5px; font-weight: 600; color: #ffffff;">${t('modalApplyTitle')}</h3>
        <p style="color: #34D399; margin: 4px 0; font-size: 12px;">${t('modalApplySuccess').replace('{n}', successCount)}</p>
        ${failCount > 0 ? `<p style="color: #F87171; margin: 4px 0; font-size: 12px;">${t('modalApplyFail').replace('{n}', failCount)}</p>` : ''}
        <p class="cm-modal-desc" style="margin-top: 4px;">${t('modalApplyDomain')}<span style="color: #60A5FA;">${url.hostname}</span></p>
    `;

    // 如果有失败的cookie，显示详细信息
    if (failCount > 0) {
      notificationContent += `
        <div style="text-align: left; margin: 10px 0; padding: 8px 10px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; max-height: 120px; overflow-y: auto; font-size: 11px;">
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #ffffff;">${t('modalApplyFailDetails')}</p>
          ${results.filter(r => !r.success)
            .map(r => `<p style="margin: 3px 0; color: #F87171;">· ${r.name}: ${r.error}</p>`)
            .join('')}
        </div>
      `;
    }

    notificationContent += `
        <div class="cm-modal-actions center" style="margin-top: 14px; flex-wrap: wrap;">
          <button class="cm-modal-btn cm-btn-primary notification-close">${t('modalBtnConfirm')}</button>
          ${failCount > 0 ? `
            <button class="cm-modal-btn cm-btn-danger notification-retry">${t('modalBtnRetry')}</button>
          ` : ''}
          <button class="cm-modal-btn cm-btn-secondary notification-debug">${t('modalBtnDebug')}</button>
        </div>
        ${successCount > 0 ? `
          <p style="margin-top: 12px; margin-bottom: 0; color: rgba(255, 255, 255, 0.65); font-size: 11px;">
            ${t('modalApplyAutoRefresh', '3秒后将自动刷新页面...')}
          </p>
        ` : ''}
      </div>
    `;

    notification.innerHTML = notificationContent;
    document.body.appendChild(overlay);
    document.body.appendChild(notification);

    overlay.addEventListener('click', closeFn);

    // 添加按钮事件
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', async () => {
      closeFn();
      if (successCount > 0) {
        await chrome.tabs.reload(tab.id);
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchCookies();
      }
    });

    const retryButton = notification.querySelector('.notification-retry');
    if (retryButton) {
      retryButton.addEventListener('click', async () => {
        closeFn();
        await forceApplyToCurrent();
      });
    }

    const debugButton = notification.querySelector('.notification-debug');
    debugButton.addEventListener('click', () => {
      const debugInfo = results.map(r => 
        `${r.name}: ${r.success ? '成功' : '失败 - ' + r.error}`
      ).join('\n');
      alert('Cookie设置详细信息：\n\n' + debugInfo);
    });

    // 如果有成功设置的cookie，3秒后自动刷新页面
    if (successCount > 0) {
      setTimeout(async () => {
        closeFn();
        await chrome.tabs.reload(tab.id);
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchCookies();
      }, 3000);
    } else {
      setTimeout(closeFn, 5000);
    }

  } catch (error) {
    console.error('执行过程中出错:', error);
    alert(`应用Cookie时发生错误: ${error.message}\n请查看控制台获取详细信息`);
  }
}

async function forceApplyToCurrent_break() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  try {
    const url = new URL(tab.url);
    console.log('当前URL:', url.href);
    const isLocalhost = url.hostname === 'localhost';
    console.log('是否为localhost:', isLocalhost);

    let successCount = 0;
    let failCount = 0;
    
    // 注入脚本到页面中直接设置cookie
    const cookiesToSet = Array.from(pinnedCookies.values()).map(cookie => ({
      name: cookie.name,
      value: cookie.value,
      path: '/'
    }));

    // 创建一个独立的注入函数
    function setCookiesInPage(cookies) {
      const results = [];
      
      cookies.forEach(cookie => {
        try {
          document.cookie = `${cookie.name}=${cookie.value};path=${cookie.path}`;
          
          // 验证cookie是否设置成功
          const allCookies = document.cookie.split(';').map(c => c.trim());
          const found = allCookies.some(c => c.startsWith(cookie.name + '='));
          
          results.push({
            name: cookie.name,
            success: found,
            value: cookie.value
          });
        } catch (error) {
          results.push({
            name: cookie.name,
            success: false,
            error: error.message
          });
        }
      });
      
      return results;
    }

    // 注入脚本并获取结果
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: setCookiesInPage,
      args: [cookiesToSet],
      world: "MAIN"
    });

    console.log('Cookie设置结果:', results);

    // 处理结果
    if (results && results[0] && results[0].result) {
      const cookieResults = results[0].result;
      
      if (Array.isArray(cookieResults)) {
        successCount = cookieResults.filter(r => r.success).length;
        failCount = cookieResults.filter(r => !r.success).length;

        // 打印详细的成功/失败信息
        console.log('成功设置的 cookies:', cookieResults.filter(r => r.success));
        console.log('失败的 cookies:', cookieResults.filter(r => !r.success));
      }
    }

    // 显示结果通知
    const notification = document.createElement('div');
    notification.className = 'cookie-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h3>${t('modalApplyTitle')}</h3>
        <p>${t('modalApplySuccess').replace('{n}', successCount)}</p>
        ${failCount > 0 ? `<p>${t('modalApplyFail').replace('{n}', failCount)}</p>` : ''}
        <p>${t('modalApplyDomain')}${url.hostname}</p>
        <div class="notification-buttons">
          <button class="notification-close">${t('modalBtnConfirm')}</button>
          ${failCount > 0 ? `<button class="notification-retry">${t('modalBtnRetry')}</button>` : ''}
          <button class="notification-debug">${t('modalBtnDebug')}</button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // 添加按钮事件
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
      notification.remove();
    });

    const retryButton = notification.querySelector('.notification-retry');
    if (retryButton) {
      retryButton.addEventListener('click', async () => {
        notification.remove();
        await forceApplyToCurrent();
      });
    }

    const debugButton = notification.querySelector('.notification-debug');
    debugButton.addEventListener('click', () => {
      console.log('Cookie设置详细信息:', results);
      alert(t('modalDebugAlert'));
    });

    // 5秒后自动关闭通知
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);

  } catch (error) {
    console.error('执行过程中出错:', error);
    alert(t('modalApplyErrorAlert').replace('{msg}', error.message));
  }
}

// 添加事件监听器
document.getElementById("applyToCurrent").addEventListener("click", forceApplyToCurrent);

// 修改原有的 applyCookie 函数，添加强制模式参数
/* async function applyCookie(cookie, forceCurrent = false) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  
  try {
    const url = new URL(tab.url);
    
    // 如果是强制模式，使用当前页面的domain
    let domain = forceCurrent ? url.hostname : cookie.domain;
    if (domain && domain.startsWith('.')) {
      domain = domain.substring(1);
    }
    if (!domain) {
      domain = url.hostname;
    }

    const cookieUrl = `${url.protocol}//${domain}${cookie.path || '/'}`;

    const cookieData = {
      url: cookieUrl,
      name: cookie.name,
      value: cookie.value,
      domain: domain,
      path: cookie.path || "/",
      secure: cookie.secure || url.protocol === 'https:',
      httpOnly: cookie.httpOnly || false,
      sameSite: cookie.sameSite || "Lax",
      expirationDate: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
    };

    // 先删除已存在的cookie
    await chrome.cookies.remove({
      url: cookieUrl,
      name: cookie.name
    });

    // 设置新cookie
    const result = await chrome.cookies.set(cookieData);
    
    if (result) {
      console.log(`Cookie set successfully:`, {
        name: cookie.name,
        domain: domain,
        value: cookie.value
      });
    } else {
      throw new Error('Failed to set cookie');
    }

  } catch (error) {
    console.error(`Failed to set cookie ${cookie.name}:`, error);
    throw error;
  }
} */
async function applyCookie(cookie, isAlloweShowNotification = true) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    const currentUrl = new URL(tab.url);
    
    // 检查是否在无痕模式下
    if (tab.incognito) {
      const hasPermission = await chrome.extension.isAllowedIncognitoAccess();
      if (!hasPermission) {
        throw new Error('Incognito mode access not allowed. Please enable it in extension settings.');
      }
    }

    // 处理 domain
    let cookieDomain = cookie.domain;
    if (cookieDomain) {
      // 如果 cookie.domain 以点开头，移除开头的点
      cookieDomain = cookieDomain.startsWith('.') ? cookieDomain.slice(1) : cookieDomain;
    } else {
      // 如果没有指定 domain，使用当前页面的域名
      cookieDomain = currentUrl.hostname;
      }

    // 验证域名兼容性
    if (!currentUrl.hostname.endsWith(cookieDomain) && 
        !cookieDomain.endsWith(currentUrl.hostname)) {
      throw new Error(`Cannot set cookie for domain ${cookieDomain} on ${currentUrl.hostname}`);
    }
    
    // 构建 cookie URL
    const protocol = cookie.secure ? 'https:' : currentUrl.protocol;
    const cookieUrl = `${protocol}//${cookieDomain}${cookie.path || '/'}`;

    // 先尝试删除现有的 cookie
    try {
      await chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name,
        storeId: tab.incognito ? "1" : "0"
      });
    } catch (error) {
      console.log('No existing cookie to remove or removal failed:', error);
  }

    // 准备 cookie 数据
    const cookieData = {
      url: cookieUrl,
      name: cookie.name,
      value: cookie.value,
      path: cookie.path || "/",
      secure: cookie.secure || protocol === 'https:',
      httpOnly: cookie.httpOnly || false,
      sameSite: cookie.sameSite || "Lax",
      storeId: tab.incognito ? "1" : "0"
    };

    // 如果不是 session cookie，添加过期时间
    if (cookie.expirationDate) {
      cookieData.expirationDate = cookie.expirationDate;
}

    // 只有在非 hostOnly 的情况下才设置 domain
    if (!cookie.hostOnly && cookieDomain !== currentUrl.hostname) {
      cookieData.domain = cookieDomain;
    }

    console.log('Setting cookie with data:', cookieData);

    // 设置 cookie
    const result = await chrome.cookies.set(cookieData);
    
    if (!result) {
      throw new Error('Failed to set cookie');
    }

    // 验证 cookie 是否设置成功
    const verification = await chrome.cookies.get({
      url: cookieUrl,
      name: cookie.name,
      storeId: tab.incognito ? "1" : "0"
    });

    if (!verification) {
      throw new Error('Cookie verification failed - cookie not found after setting');
    }

    if (verification.value !== cookie.value) {
      throw new Error('Cookie verification failed - value mismatch');
    }

    if (isAlloweShowNotification) {
      showNotification(`Successfully applied cookie: ${cookie.name}`, 'success');
    }

    return true;

  } catch (error) {
    console.error(`Failed to set cookie ${cookie.name}:`, error);
    
    // 提供更详细的错误信息
    if (error.message.includes('incognito')) {
      showNotification('Please enable incognito mode access in extension settings', 'warning', 5000);
    } else if (isAlloweShowNotification) {
      let errorMessage = error.message;
      
      // 添加更友好的错误提示
      if (errorMessage.includes('Cannot set cookie')) {
        errorMessage = 'Cannot set cookie for a different domain. The cookie domain must be a subdomain of the current page.';
      }
      showNotification(`Failed to set cookie: ${errorMessage}`, 'error');
    }
    
    throw error;
  }
}

// 添加CSS样式
const style = document.createElement('style');
style.textContent = `
  .apply-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .apply-button:hover {
    background-color: #218838;
  }

  .pinned-section h3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
document.head.appendChild(style);

// 为 getCookies 按钮添加事件监听器
document.getElementById("getCookies").addEventListener("click", async () => {
  try {
    await fetchCookies();
    
    // 获取当前标签页的所有cookie
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    
    const cookies = await new Promise(resolve => {
      chrome.cookies.getAll({ url: tab.url }, resolve);
    });

    // 格式化cookie数据
    const cookieData = {
      url: tab.url,
      timestamp: new Date().toISOString(),
      cookies: cookies.map(cookie => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite
      }))
    };

    // 创建格式化的文本版本
    const textVersion = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    
    // 创建详细的格式化版本
    const detailedVersion = JSON.stringify(cookieData, null, 2);

    // 创建遮罩层与弹窗主体
    const overlay = document.createElement('div');
    overlay.className = 'cm-modal-overlay';

    const notification = document.createElement('div');
    notification.className = 'cm-modal-dialog cm-modal-sm';

    const closeFn = () => closeUnifiedModal(notification, overlay);

    notification.innerHTML = `
      <div style="position: relative; text-align: center;">
        <button class="close-notify cm-modal-close" style="position: absolute; top: -6px; right: -4px;" title="${t('modalBtnClose') || 'Close'}">×</button>
        <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #ffffff;">${t('modalGetCookiesTitle')}</h3>
        <p class="cm-modal-desc" style="margin: 0 0 16px 0;">${t('modalFoundCookies').replace('{n}', cookies.length)}</p>
        <div style="display: flex; justify-content: center; gap: 10px; margin-top: 12px; flex-wrap: nowrap;">
          <button class="copy-simple cm-modal-btn cm-btn-primary">${t('modalBtnCopySimple')}</button>
          <button class="copy-detailed cm-modal-btn cm-btn-success">${t('modalBtnCopyDetailed')}</button>
        </div>
        <div class="copy-status" style="
          margin-top: 10px;
          color: #34D399;
          font-size: 11.5px;
          height: 18px;
          line-height: 18px;
          font-weight: 500;
        "></div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(notification);

    // 复制简单格式
    notification.querySelector('.copy-simple').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(textVersion);
        showCopyStatus(t('modalCopiedSimple'));
      } catch (err) {
        showCopyStatus(t('modalCopyFailed') + ': ' + err.message, true);
      }
    });

    // 复制详细格式
    notification.querySelector('.copy-detailed').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(detailedVersion);
        showCopyStatus(t('modalCopiedDetailed'));
      } catch (err) {
        showCopyStatus(t('modalCopyFailed') + ': ' + err.message, true);
      }
    });

    // 关闭/取消函数与事件
    notification.querySelector('.close-notify').addEventListener('click', closeFn);
    overlay.addEventListener('click', closeFn);

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeFn();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    // 显示复制状态的函数
    function showCopyStatus(message, isError = false) {
      const statusDiv = notification.querySelector('.copy-status');
      statusDiv.textContent = message;
      statusDiv.style.color = isError ? '#F87171' : '#34D399';
      
      // 2秒后清除消息
      setTimeout(() => {
        if (statusDiv) {
          statusDiv.textContent = '';
        }
      }, 2000);
    }



    // 显示成功提示
    const successNotification = document.createElement('div');
    successNotification.className = 'cookie-notification';
    successNotification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    successNotification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>✓</span>
        <span>${t('notifyCookiesRefreshed')}</span>
      </div>
    `;
    document.body.appendChild(successNotification);

    // 2秒后自动移除成功提示
    setTimeout(() => {
      successNotification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => successNotification.remove(), 300);
    }, 2000);

  } catch (error) {
    console.error('Failed to fetch cookies:', error);
    alert(t('notifyCookiesFetchFailed') + error.message);
  }
});

// 添加刷新页面按钮的事件监听器
document.getElementById("refreshPage").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    // 显示加载提示
    const notification = document.createElement('div');
    notification.className = 'cookie-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007bff;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>↻</span>
        <span>Refreshing page...</span>
      </div>
    `;
    document.body.appendChild(notification);

    // 刷新页面
    await chrome.tabs.reload(tab.id);
    
    // 等待页面加载完成
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 更新cookie表格
    await fetchCookies();

    // 更新通知内容
    notification.style.background = '#28a745';
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>✓</span>
        <span>Page refreshed successfully</span>
      </div>
    `;

    // 2秒后移除通知
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  } catch (error) {
    console.error('Failed to refresh page:', error);
    alert('Failed to refresh page: ' + error.message);
  }
});

// 添加动画样式
const animationStyle = document.createElement('style');
animationStyle.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .cookie-notification {
    transition: background-color 0.3s ease;
  }
`;
document.head.appendChild(animationStyle);

// 添加删除当前页面cookies的函数
async function deleteCurrentCookies() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      throw new Error('No active tab found');
    }

    // 获取当前页面的所有cookies
    const cookies = await chrome.cookies.getAll({ url: tab.url });
    
    if (cookies.length === 0) {
      showNotification('No cookies found to delete', 'info');
      return;
    }

    // 创建确认对话框与遮罩
    const overlay = document.createElement('div');
    overlay.className = 'cm-modal-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'cm-modal-dialog cm-modal-sm';

    const closeFn = () => closeUnifiedModal(dialog, overlay);

    dialog.innerHTML = `
      <div style="text-align: center;">
        <h3 style="margin: 0 0 10px 0; font-size: 14.5px; font-weight: 600; color: #F87171;">${t('modalConfirmDeleteCurrentTitle')}</h3>
        <p class="cm-modal-desc" style="margin-bottom: 16px;">
          ${t('modalConfirmDeleteCurrentMsg').replace('{n}', cookies.length)}
        </p>
        <div class="cm-modal-actions center">
          <button class="cm-modal-btn cm-btn-secondary cancel-delete">${t('modalBtnCancel')}</button>
          <button class="cm-modal-btn cm-btn-danger confirm-delete">${t('modalBtnDeleteAll')}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    dialog.querySelector('.cancel-delete').addEventListener('click', closeFn);
    overlay.addEventListener('click', closeFn);

    // 处理确认删除按钮
    dialog.querySelector('.confirm-delete').addEventListener('click', async () => {
      // 显示加载状态
      dialog.innerHTML = `
        <div style="text-align: center; padding: 12px 0;">
          <div class="loading-spinner" style="
            border: 3px solid rgba(255,255,255,0.15);
            border-top: 3px solid #E11D48;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            animation: spin 1s linear infinite;
            margin: 10px auto;
          "></div>
          <p class="cm-modal-desc" style="margin: 10px 0 0 0;">${t('modalDeletingCookies')}</p>
        </div>
      `;

      try {
        let successCount = 0;
        let failCount = 0;
        const results = [];

        // 删除每个cookie
        for (const cookie of cookies) {
          try {
            await chrome.cookies.remove({
              url: tab.url,
              name: cookie.name
            });
            successCount++;
            results.push({
              name: cookie.name,
              success: true
            });
          } catch (error) {
            failCount++;
            results.push({
              name: cookie.name,
              success: false,
              error: error.message
            });
          }
        }

        // 更新cookie列表
        await fetchCookies();

        // 显示结果
        dialog.innerHTML = `
          <div style="text-align: center;">
            <h3 style="margin-bottom: 10px; font-size: 14px; font-weight: 600; color: ${failCount === 0 ? '#34D399' : '#F87171'}">
              ${failCount === 0 ? t('modalDeleteSuccess') : t('modalDeleteCompletedErrors')}
            </h3>
            <p style="color: #34D399; margin: 4px 0; font-size: 12px;">${t('modalDeleteSuccessCount')}${successCount}</p>
            ${failCount > 0 ? `<p style="color: #F87171; margin: 4px 0; font-size: 12px;">${t('modalImportFailCount')}${failCount}</p>` : ''}
            ${failCount > 0 ? `
              <div style="text-align: left; margin: 12px 0; padding: 8px 10px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; max-height: 120px; overflow-y: auto; font-size: 11px;">
                <p style="margin: 0 0 6px 0; font-weight: 600; color: #fff;">${t('modalDeleteFailList')}</p>
                ${results.filter(r => !r.success)
                  .map(r => `<p style="margin: 3px 0; color: #F87171;">· ${r.name}: ${r.error || t('modalUnknownError')}</p>`)
                  .join('')}
              </div>
            ` : ''}
            <div class="cm-modal-actions center" style="margin-top: 14px;">
              <button class="cm-modal-btn cm-btn-primary close-dialog">${t('modalBtnClose')}</button>
            </div>
          </div>
        `;

        dialog.querySelector('.close-dialog').addEventListener('click', closeFn);

        // 如果全部成功，2秒后自动关闭
        if (failCount === 0) {
          setTimeout(closeFn, 2000);
        }

      } catch (error) {
        dialog.innerHTML = `
          <div style="text-align: center;">
            <h3 style="margin-bottom: 10px; color: #F87171; font-size: 14px;">${t('modalErrorTitle')}</h3>
            <p class="cm-modal-desc">${error.message}</p>
            <div class="cm-modal-actions center">
              <button class="cm-modal-btn cm-btn-secondary close-dialog">${t('modalBtnClose')}</button>
            </div>
          </div>
        `;

        dialog.querySelector('.close-dialog').addEventListener('click', closeFn);
      }
    });

  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// 添加删除按钮的事件监听器
document.getElementById("deleteCurrentCookies").addEventListener("click", deleteCurrentCookies);

// 添加动画样式
const deleteAnimationStyle = document.createElement('style');
deleteAnimationStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(deleteAnimationStyle);

// 删除所有 cookies 的函数
async function deleteAllCookies() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      throw new Error('No active tab found');
    }

    // 获取所有域名的 cookies
    const allCookies = await chrome.cookies.getAll({});
    
    if (allCookies.length === 0) {
      showNotification('No cookies found to delete', 'info');
      return;
    }

    // 创建确认对话框与遮罩
    const overlay = document.createElement('div');
    overlay.className = 'cm-modal-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'cm-modal-dialog cm-modal-sm';

    const closeFn = () => closeUnifiedModal(dialog, overlay);

    dialog.innerHTML = `
      <div style="text-align: center;">
        <h3 style="margin: 0 0 10px 0; font-size: 14.5px; font-weight: 600; color: #F87171;">${t('modalWarningTitle')}</h3>
        <p class="cm-modal-desc" style="margin-bottom: 16px;">
          ${t('modalWarningAllMsg').replace('{n}', allCookies.length)}
        </p>
        <div class="cm-modal-actions center">
          <button class="cm-modal-btn cm-btn-secondary cancel-delete">${t('modalBtnCancel')}</button>
          <button class="cm-modal-btn cm-btn-danger confirm-delete">${t('modalBtnDeleteAll')}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    dialog.querySelector('.cancel-delete').addEventListener('click', closeFn);
    overlay.addEventListener('click', closeFn);

    // 处理确认删除按钮
    dialog.querySelector('.confirm-delete').addEventListener('click', async () => {
      // 显示加载状态
      dialog.innerHTML = `
        <div style="text-align: center; padding: 12px 0;">
          <div class="loading-spinner" style="
            border: 3px solid rgba(255,255,255,0.15);
            border-top: 3px solid #E11D48;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            animation: spin 1s linear infinite;
            margin: 10px auto;
          "></div>
          <p class="cm-modal-desc" style="margin: 10px 0 0 0;">${t('modalDeletingAllCookies')}</p>
        </div>
      `;

      try {
        let successCount = 0;
        let failCount = 0;
        const results = [];

        // 删除每个cookie
        for (const cookie of allCookies) {
          try {
            const url = `${cookie.secure ? 'https' : 'http'}://${cookie.domain}${cookie.path}`;
            await chrome.cookies.remove({
              url: url,
              name: cookie.name
            });
            successCount++;
            results.push({
              name: cookie.name,
              domain: cookie.domain,
              success: true
            });
          } catch (error) {
            failCount++;
            results.push({
              name: cookie.name,
              domain: cookie.domain,
              success: false,
              error: error.message
            });
          }
        }

        // 更新cookie列表
        await fetchCookies();

        // 显示结果
        dialog.innerHTML = `
          <div style="text-align: center;">
            <h3 style="margin-bottom: 10px; font-size: 14px; font-weight: 600; color: ${failCount === 0 ? '#34D399' : '#F87171'}">
              ${failCount === 0 ? t('modalDeleteSuccess') : t('modalDeleteCompletedErrors')}
            </h3>
            <p style="color: #34D399; margin: 4px 0; font-size: 12px;">${t('modalDeleteSuccessCount')}${successCount}</p>
            ${failCount > 0 ? `<p style="color: #F87171; margin: 4px 0; font-size: 12px;">${t('modalImportFailCount')}${failCount}</p>` : ''}
            ${failCount > 0 ? `
              <div style="text-align: left; margin: 12px 0; padding: 8px 10px; background: rgba(255, 255, 255, 0.05); border-radius: 6px; max-height: 120px; overflow-y: auto; font-size: 11px;">
                <p style="margin: 0 0 6px 0; font-weight: 600; color: #fff;">${t('modalDeleteFailList')}</p>
                ${results.filter(r => !r.success)
                  .map(r => `<p style="margin: 3px 0; color: #F87171;">· ${r.name} (${r.domain}): ${r.error || t('modalUnknownError')}</p>`)
                  .join('')}
              </div>
            ` : ''}
            <div class="cm-modal-actions center" style="margin-top: 14px;">
              <button class="cm-modal-btn cm-btn-primary close-dialog">${t('modalBtnClose')}</button>
            </div>
          </div>
        `;

        dialog.querySelector('.close-dialog').addEventListener('click', closeFn);

        // 如果全部成功，2秒后自动关闭
        if (failCount === 0) {
          setTimeout(closeFn, 2000);
        }

      } catch (error) {
        dialog.innerHTML = `
          <div style="text-align: center;">
            <h3 style="margin-bottom: 10px; color: #F87171; font-size: 14px;">${t('modalErrorTitle')}</h3>
            <p class="cm-modal-desc">${error.message}</p>
            <div class="cm-modal-actions center">
              <button class="cm-modal-btn cm-btn-secondary close-dialog">${t('modalBtnClose')}</button>
            </div>
          </div>
        `;

        dialog.querySelector('.close-dialog').addEventListener('click', closeFn);
      }
    });

  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// 添加删除所有cookies按钮的事件监听器
document.getElementById("deleteAllCookies").addEventListener("click", deleteAllCookies);

/* function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    max-width: 400px;
    word-wrap: break-word;
  `;

  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };
  
  notification.style.background = colors[type] || colors.info;

  // 添加图标
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span>${icons[type] || icons.info}</span>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, duration);
} */
// 通知管理器
const NotificationManager = {
  queue: [],
  isProcessing: false,
  offset: 20, // 初始顶部偏移
  activeNotifications: new Set(),
  
  // 添加通知到队列
  add(message, type = 'info', duration = 3000) {
    this.queue.push({ message, type, duration });
    if (!this.isProcessing) {
      this.processQueue();
    }
  },

  // 处理队列
  async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const { message, type, duration } = this.queue.shift();
    await this.showNotification(message, type, duration);
    this.processQueue();
  },

  // 显示单个通知
  async showNotification(message, type, duration) {
    return new Promise(resolve => {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      
      // 计算通知位置
      const currentOffset = this.calculateOffset();
      
      notification.style.cssText = `
        position: fixed;
        top: ${currentOffset}px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        word-wrap: break-word;
        transition: all 0.3s ease;
      `;

      const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
      };
      
      notification.style.background = colors[type] || colors.info;

      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };

      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span>${icons[type] || icons.info}</span>
          <span>${message}</span>
        </div>
      `;

      document.body.appendChild(notification);
      this.activeNotifications.add(notification);

      // 自动关闭
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
          notification.remove();
          this.activeNotifications.delete(notification);
          this.updatePositions();
          resolve();
        }, 300);
      }, duration);
    });
  },

  // 计算新通知的位置
  calculateOffset() {
    let offset = this.offset;
    this.activeNotifications.forEach(notification => {
      offset += notification.offsetHeight + 10; // 10px 间距
    });
    return offset;
  },

  // 更新所有通知的位置
  updatePositions() {
    let currentOffset = this.offset;
    this.activeNotifications.forEach(notification => {
      notification.style.top = `${currentOffset}px`;
      currentOffset += notification.offsetHeight + 10;
    });
  }
};

// 替换原有的 showNotification 函数
function showNotification(message, type = 'info', duration = 3000) {
  NotificationManager.add(message, type, duration);
}

// 添加必要的 CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .notification {
    transition: all 0.3s ease;
  }
`;
document.head.appendChild(notificationStyles);

function initializeEventListeners() {
  const elements = {
    addCookie: document.getElementById("addCookie"),
    // 其他元素...
  };

  // 检查所有必需的元素是否存在
  Object.entries(elements).forEach(([name, element]) => {
    if (!element) {
      console.error(`Required element '${name}' not found in the document`);
    }
  });

  // 只有在元素存在时才添加事件监听器
  if (elements.addCookie) {
    elements.addCookie.addEventListener("click", async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
          throw new Error('No active tab found');
        }
    
        const url = new URL(tab.url);
        
        // 创建表单结构
        const formHtml = `
          <div class="cookie-form">
            <label for="cookieName">${t('modalAddName')} *</label>
            <input type="text" id="cookieName" class="cm-modal-input" required placeholder="name">
            
            <label for="cookieValue">${t('modalAddValue')} *</label>
            <input type="text" id="cookieValue" class="cm-modal-input" required placeholder="value">
            
            <div class="advanced-toggle">
              ▶ ${t('modalAdvancedSettings')}
            </div>
            
            <div class="advanced-section">
              <label for="cookieDomain">${t('modalDomain')}</label>
              <input type="text" id="cookieDomain" class="cm-modal-input" placeholder="${t('modalDomainPlaceholder')}">
              
              <label for="cookiePath">${t('modalPath')}</label>
              <input type="text" id="cookiePath" class="cm-modal-input" value="/" placeholder="/">
              
              <label for="cookieExpiration">${t('modalExpiration')}</label>
              <select id="cookieExpirationType" class="cm-modal-select">
                <option value="session">${t('modalExpSession')}</option>
                <option value="date">${t('modalExpDate')}</option>
                <option value="duration" selected>${t('modalExpDuration')}</option>
              </select>
              
              <div id="expirationDateContainer" style="display: none;">
                <input type="datetime-local" id="cookieExpirationDate" class="cm-modal-input">
              </div>
              
              <div id="expirationDurationContainer" style="display: flex; gap: 8px;">
                <input type="number" id="cookieExpirationDuration" class="cm-modal-input" value="365" min="1" style="flex: 1;">
                <select id="cookieExpirationUnit" class="cm-modal-select" style="flex: 1;">
                  <option value="minutes">${t('modalUnitMinutes')}</option>
                  <option value="hours">${t('modalUnitHours')}</option>
                  <option value="days" selected>${t('modalUnitDays')}</option>
                  <option value="months">${t('modalUnitMonths')}</option>
                  <option value="years">${t('modalUnitYears')}</option>
                </select>
              </div>
              
              <label for="cookieSameSite">SameSite</label>
              <select id="cookieSameSite" class="cm-modal-select">
                <option value="Lax">Lax</option>
                <option value="Strict">Strict</option>
                <option value="None">None</option>
              </select>
              
              <div style="margin-top: 8px; display: flex; gap: 14px; flex-wrap: wrap;">
                <label style="display: inline-flex; align-items: center; cursor: pointer;">
                  <input type="checkbox" id="cookieSecure" ${url.protocol === 'https:' ? 'checked' : ''}>
                  <span style="margin-left: 5px;">Secure</span>
                </label>
                
                <label style="display: inline-flex; align-items: center; cursor: pointer;">
                  <input type="checkbox" id="cookieHttpOnly">
                  <span style="margin-left: 5px;">HttpOnly</span>
                </label>
                
                <label style="display: inline-flex; align-items: center; cursor: pointer;">
                  <input type="checkbox" id="cookieHostOnly">
                  <span style="margin-left: 5px;">Host Only</span>
                </label>
              </div>
            </div>
          </div>
        `;
    
        // 显示对话框与遮罩
        const overlay = document.createElement('div');
        overlay.className = 'cm-modal-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'cm-modal-dialog cm-modal-md';

        const closeFn = () => closeUnifiedModal(dialog, overlay);
        
        dialog.innerHTML = `
          <div class="cm-modal-header">
            <h3>${t('modalAddTitle')}</h3>
            <button class="cm-modal-close" title="${t('modalBtnClose') || 'Close'}">×</button>
          </div>
          ${formHtml}
          <div class="cm-modal-actions" style="margin-top: 14px;">
            <button id="cancelAdd" class="cm-modal-btn cm-btn-secondary">${t('modalBtnCancel')}</button>
            <button id="confirmAdd" class="cm-modal-btn cm-btn-primary">${t('modalBtnAddCookie')}</button>
          </div>
        `;
    
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        dialog.querySelector('.cm-modal-close').addEventListener('click', closeFn);
        overlay.addEventListener('click', closeFn);
        document.getElementById('cancelAdd').addEventListener('click', closeFn);
    
        // 高级设置切换
        const advancedToggle = dialog.querySelector('.advanced-toggle');
        const advancedSection = dialog.querySelector('.advanced-section');
        advancedToggle.addEventListener('click', () => {
          advancedSection.classList.toggle('show');
          advancedToggle.textContent = advancedSection.classList.contains('show') ? 
            `▼ ${t('modalAdvancedSettings')}` : `▶ ${t('modalAdvancedSettings')}`;
        });
    
        // 过期时间类型切换
        const expirationType = dialog.querySelector('#cookieExpirationType');
        const expirationDateContainer = dialog.querySelector('#expirationDateContainer');
        const expirationDurationContainer = dialog.querySelector('#expirationDurationContainer');
        
        expirationType.addEventListener('change', () => {
          expirationDateContainer.style.display = expirationType.value === 'date' ? 'block' : 'none';
          expirationDurationContainer.style.display = expirationType.value === 'duration' ? 'flex' : 'none';
        });
    
        // Host Only 复选框事件
        const hostOnlyCheckbox = dialog.querySelector('#cookieHostOnly');
        const domainInput = dialog.querySelector('#cookieDomain');
        
        hostOnlyCheckbox.addEventListener('change', () => {
          domainInput.disabled = hostOnlyCheckbox.checked;
          if (hostOnlyCheckbox.checked) {
            domainInput.value = '';
            domainInput.placeholder = t('modalDomainUsingCurrent');
          } else {
            domainInput.placeholder = t('modalDomainPlaceholder');
          }
        });
    
        // 处理确认按钮
        document.getElementById('confirmAdd').addEventListener('click', async () => {
          const name = document.getElementById('cookieName').value.trim();
          const value = document.getElementById('cookieValue').value;
          
          if (!name) {
            alert(t('modalNameRequired'));
            return;
          }
    
          try {
            // 获取表单数据
            const hostOnly = document.getElementById('cookieHostOnly').checked;
            const domain = document.getElementById('cookieDomain').value.trim();
            const path = document.getElementById('cookiePath').value.trim() || '/';
            const sameSite = document.getElementById('cookieSameSite').value;
            const secure = document.getElementById('cookieSecure').checked;
            const httpOnly = document.getElementById('cookieHttpOnly').checked;
    
            // 计算过期时间
            let expirationDate;
            const expirationType = document.getElementById('cookieExpirationType').value;
            
            if (expirationType === 'session') {
              expirationDate = undefined;
            } else if (expirationType === 'date') {
              const dateStr = document.getElementById('cookieExpirationDate').value;
              if (dateStr) {
                expirationDate = Math.floor(new Date(dateStr).getTime() / 1000);
              }
            } else {
              const duration = parseInt(document.getElementById('cookieExpirationDuration').value) || 365;
              const unit = document.getElementById('cookieExpirationUnit').value;
              
              const multipliers = {
                minutes: 60,
                hours: 3600,
                days: 86400,
                months: 2592000,
                years: 31536000
              };
              
              expirationDate = Math.floor(Date.now() / 1000) + (duration * multipliers[unit]);
            }
    
            // 获取当前标签页URL
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) throw new Error('No active tab found');
            
            const url = new URL(tab.url);
    
            // 构建cookie数据
            const cookieData = {
              url: tab.url, // 使用当前标签页的URL
              name: name,
              value: value,
              path: path,
              secure: secure,
              httpOnly: httpOnly,
              // sameSite: sameSite,
              expirationDate
            };
    
            // 如果指定了domain,则添加到cookie数据中
            if (domain) {
              cookieData.domain = domain;
            }
    
            // 直接设置cookie,不做任何域名验证
            const result = await chrome.cookies.set(cookieData);
            
            if (!result) {
              throw new Error('Failed to set cookie');
            }
    
            // 优雅平滑退场
            closeFn();
    
            // 显示成功通知
            const notification = document.createElement('div');
            notification.className = 'cookie-notification success';
            notification.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: #28a745;
              color: white;
              padding: 10px 20px;
              border-radius: 4px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              z-index: 1000;
              animation: slideIn 0.3s ease-out;
            `;
            notification.innerHTML = `
              <div style="display: flex; align-items: center; gap: 10px;">
                <span>✓</span>
                <span>${t('modalAddSuccess')}</span>
              </div>
            `;
            document.body.appendChild(notification);
    
            // 2秒后移除通知
            setTimeout(() => {
              notification.style.animation = 'slideOut 0.3s ease-out';
              setTimeout(() => notification.remove(), 300);
            }, 2000);
    
            // 刷新cookie列表
            await fetchCookies();
    
          } catch (error) {
            // console.error('Failed to add cookie:', error);
            // 显示错误通知
            const errorNotification = document.createElement('div');
            errorNotification.className = 'cookie-notification error';
            errorNotification.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: #dc3545;
              color: white;
              padding: 10px 20px;
              border-radius: 4px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              z-index: 1000;
              animation: slideIn 0.3s ease-out;
            `;
            errorNotification.innerHTML = `
              <div style="display: flex; align-items: center; gap: 10px;">
                <span>✕</span>
                <span>Failed to add cookie: ${error.message}</span>
              </div>
            `;
            document.body.appendChild(errorNotification);
    
            // 5秒后移除错误通知
            setTimeout(() => {
              errorNotification.style.animation = 'slideOut 0.3s ease-out';
              setTimeout(() => errorNotification.remove(), 300);
            }, 5000);
          }
        });
    
      } catch (error) {
        console.error('Error in addCookie:', error);
        alert(`Error: ${error.message}`);
      }
    });
  }
}

// 将 replaceTextNodes 函数移到全局作用域
function replaceTextNodes(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    // 检查文本节点是否包含需要替换的内容
    if (node.textContent.includes('__MSG_')) {
      const matches = node.textContent.match(/__MSG_(\w+)__/);
      if (matches && matches[1]) {
        const messageName = matches[1];
        const translation = t(messageName);
        if (translation) {
          node.textContent = node.textContent.replace(
            /__MSG_\w+__/,
            translation
          );
        }
      }
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // 处理属性
    for (let attr of node.attributes) {
      if (attr.value && attr.value.includes('__MSG_')) {
        const matches = attr.value.match(/__MSG_(\w+)__/);
        if (matches && matches[1]) {
          const messageName = matches[1];
          const translation = t(messageName);
          if (translation) {
            attr.value = attr.value.replace(/__MSG_\w+__/, translation);
          }
        }
      }
    }

    // 特殊处理 placeholder 属性
    if (node.hasAttribute('placeholder')) {
      const placeholderValue = node.getAttribute('placeholder');
      if (placeholderValue.includes('__MSG_')) {
        const matches = placeholderValue.match(/__MSG_(\w+)__/);
        if (matches && matches[1]) {
          const translation = t(matches[1]);
          if (translation) {
            node.setAttribute('placeholder', translation);
          }
        }
      }
    }

    // 递归处理子节点
    for (let child of node.childNodes) {
      replaceTextNodes(child);
    }
  }
}

function replaceI18nMessages() {
  // 使用当前统一语言管理器更新
  applyLanguage(currentLang, false);
}

// 添加 MutationObserver 来处理动态添加的内容
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        replaceTextNodes(node);
      }
    });
  });
});

// 开始观察 DOM 变化
function renderBasicUI() {
  // 显示基础界面框架
  document.getElementById('mainContent').style.display = 'block';
  
  // 显示加载提示
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loadingIndicator';
  loadingIndicator.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Loading...</p>
  `;
  document.body.appendChild(loadingIndicator);
}

// 页面初始化管理器
const InitializationManager = {
  // 核心功能初始化
  async initializeCore() {
    try {
      // 1. 初始化国际化文本与用户语言偏好(立即执行)
      await initLanguage();
      
      // 2. 初始化事件监听(立即执行，不等待)
      initializeEventListeners();
      
      // 3. 加载并显示cookies(核心功能)
      await Promise.all([
        this.loadCookies(),
        this.loadPinnedCookies()
      ]);
      
      return true;
    } catch (error) {
      console.error('Core initialization failed:', error);
      return false;
    }
  },

  // 非核心功能初始化
  async initializeNonCore() {
    // 并行加载非核心功能
    Promise.allSettled([
      this.initializeQuote(),
      this.initializeWeather(),
      this.checkIncognitoPermission()
    ]).then(results => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`Non-core feature ${index} failed:`, result.reason);
        }
      });
    });
  },

  // 加载Cookies(核心功能)
  async loadCookies() {
    try {
      await fetchCookies();
    } catch (error) {
      console.error('Failed to load cookies:', error);
      showNotification('Failed to load cookies', 'error');
      throw error;
    }
  },

  // 加载已固定的Cookies(核心功能)
  async loadPinnedCookies() {
    try {
      await loadPinnedCookies();
    } catch (error) {
      console.error('Failed to load pinned cookies:', error);
      showNotification('Failed to load pinned cookies', 'error');
      throw error;
    }
  },

  // 初始化每日一言(非核心功能)
  async initializeQuote() {
    try {
      await fetchDailyQuote();
    } catch (error) {
      console.warn('Quote initialization failed:', error);
      // 失败时显示默认内容
      const quoteContainer = document.getElementById('dailyQuote');
      if (quoteContainer) {
        quoteContainer.innerHTML = `
          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 0; color: #6c757d;">Welcome to Cookie Manager</p>
          </div>
        `;
      }
    }
  },

  // 初始化天气(非核心功能)
  async initializeWeather() {
    try {
      // 假设weather.js中定义了initializeWeather函数
      await window.WeatherWidget?.initialize();
    } catch (error) {
      console.warn('Weather initialization failed:', error);
      // 隐藏天气组件
      const weatherWidget = document.querySelector('.weather-widget');
      if (weatherWidget) {
        weatherWidget.style.display = 'none';
      }
    }
  },

  // 检查无痕模式权限(非核心功能)：仅当用户在隐身/无痕窗口中打开插件，且未获得无痕权限时才提示；普通窗口下完全静默
  async checkIncognitoPermission() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      // 如果当前窗口并非无痕/隐身模式，直接返回，绝不弹出无意义的黄色警告
      if (!tab || !tab.incognito) {
        return;
      }

      const hasIncognitoPermission = await chrome.extension.isAllowedIncognitoAccess();
      if (!hasIncognitoPermission) {
        showNotification(
          t('notifyIncognitoWarning'),
          'warning',
          6000
        );
      }
    } catch (error) {
      console.warn('Incognito permission check failed:', error);
    }
  }
};

// 优化后的页面加载初始化
document.addEventListener('DOMContentLoaded', async () => {
  // 1. 启动DOM观察器(立即执行)
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 2. 显示加载状态
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loadingIndicator';
  loadingIndicator.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Loading...</p>
  `;
  document.body.appendChild(loadingIndicator);

  try {
    // 3. 初始化核心功能
    await InitializationManager.initializeCore();
    
    // 4. 移除加载指示器
    loadingIndicator.remove();
    
    // 5. 异步初始化非核心功能
    InitializationManager.initializeNonCore();
    
  } catch (error) {
    console.error('Initialization failed:', error);
    
    // 显示错误状态
    loadingIndicator.innerHTML = `
      <div style="color: #dc3545; text-align: center;">
        <p>Failed to initialize. Please try again.</p>
        <button onclick="window.location.reload()" style="
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">Reload</button>
      </div>
    `;
  }
});

// 在 popup.js 中添加滚动控制逻辑（适配局部独立滚动容器）
document.addEventListener('DOMContentLoaded', () => {
  const quickNav = document.querySelector('.quick-nav');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const scrollBottomBtn = document.querySelector('.scroll-bottom');
  const scrollContainer = document.querySelector('.scrollable-content-area');
  
  // 滚动处理函数
  function handleScroll() {
    if (!quickNav) return;
    if (scrollContainer) {
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      // 当局部滚动内容高度大于容器可视高度时显示快速导航
      if (scrollHeight > clientHeight + 40) {
        quickNav.classList.add('show');
        quickNav.classList.remove('hide');
      } else {
        quickNav.classList.remove('show');
        quickNav.classList.add('hide');
      }
    } else {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollHeight > clientHeight + 60) {
        quickNav.classList.add('show');
        quickNav.classList.remove('hide');
      } else {
        quickNav.classList.remove('show');
        quickNav.classList.add('hide');
      }
    }
  }

  // 滚动到顶部
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  // 滚动到底部
  if (scrollBottomBtn) {
    scrollBottomBtn.addEventListener('click', () => {
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  }

  // 添加滚动监听（同时监听局部滚动容器与全局窗口）
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // 监听内容变化，动态刷新导航显隐
  const observer = new MutationObserver(handleScroll);
  const targetToObserve = scrollContainer || document.body;
  observer.observe(targetToObserve, {
    childList: true,
    subtree: true
  });
});