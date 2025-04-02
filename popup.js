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

// 修改 fetchDailyQuote 函数，添加缓存功能
async function fetchDailyQuote() {
  try {
    // 先检查缓存
    const cacheKey = 'dailyQuote';
    const cachedQuote = await Cache.get(cacheKey);
    
    if (cachedQuote) {
      console.log('Using cached quote');
      updateQuoteDisplay(cachedQuote);
      return;
    }

    let quote = null;
    let error = null;

    // 依次尝试不同的API源
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

    // 获取翻译
    try {
      const translation = await translateTextWithCache(quote.text);
      quote.translation = translation;
    } catch (translateError) {
      console.error('Translation failed:', translateError);
      quote.translation = '';
    }

    // 缓存结果
    await Cache.set(cacheKey, quote);

    // 显示结果
    updateQuoteDisplay(quote);

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

// 添加带缓存的翻译函数
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

// 更新显示函数
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
  nameCell.textContent = cookie.name;
  row.appendChild(nameCell);

  // Cookie Value
  const valueCell = document.createElement("td");
  valueCell.textContent = cookie.value;
  row.appendChild(valueCell);

  // Actions
  const actionCell = document.createElement("td");
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "btn-primary";
  editButton.addEventListener("click", () => editCookie(cookie));
  /* editButton.addEventListener("click", async () => {
    const newValue = prompt("Enter new value for cookie:", cookie.value);
    if (newValue !== null) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        const url = new URL(tab.url);
        const cookieUrl = `${url.protocol}//${cookie.domain || url.hostname}${cookie.path || '/'}`;

        await chrome.cookies.set({
          url: cookieUrl,
          name: cookie.name,
          value: newValue,
          domain: cookie.domain,
          path: cookie.path || "/",
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite,
          storeId: cookie.storeId
        });

        valueCell.textContent = newValue;
        
        // 如果是固定的cookie，也更新固定列表
        if (pinnedCookies.has(cookie.name)) {
          const pinnedCookie = pinnedCookies.get(cookie.name);
          pinnedCookie.value = newValue;
          await savePinnedCookies();
          updatePinnedTable();
        }
      } catch (error) {
        console.error(`Failed to update cookie ${cookie.name}:`, error);
        alert(`Failed to update cookie: ${error.message}`);
      }
    }
  }); */

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
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

  actionCell.appendChild(editButton);
  actionCell.appendChild(deleteButton);
  row.appendChild(actionCell);

  tableBody.appendChild(row);

  // 在操作单元格中添加固定按钮
  const pinButton = document.createElement("button");
  pinButton.textContent = pinnedCookies.has(cookie.name) ? "Unpin" : "Pin";
  pinButton.className = pinnedCookies.has(cookie.name) ? "unpin-button" : "pin-button";
  pinButton.addEventListener("click", () => {
    if (pinnedCookies.has(cookie.name)) {
      unpinCookie(cookie.name);
      pinButton.textContent = "Pin";
      pinButton.className = "pin-button";
    } else {
      pinCookie(cookie);
      pinButton.textContent = "Unpin";
      pinButton.className = "unpin-button";
    }
  });
  
  actionCell.appendChild(pinButton);
}

// Add a new cookie [暂时不开放此功能，因为需要用户手动输入域名和路径等详细信息，容易出错]
/* document.getElementById("addCookie").addEventListener("click", () => {
  const name = prompt("Enter cookie name:");
  const value = prompt("Enter cookie value:");
  if (name && value) {
    chrome.cookies.set({
      url: location.origin,
      name: name,
      value: value
    }, fetchCookies);
  }
}); */

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

  // 创建面板元素
  const panel = document.createElement('div');
  panel.className = 'export-panel';
  panel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1001;
    min-width: 300px;
    color: #333;
  `;

  // 创建面板内容
  panel.innerHTML = `
    <div style="text-align: center;">
      <h3 style="margin-bottom: 15px; color: #333;">Export Cookies</h3>
      
      <div style="margin-bottom: 20px;">
        <p style="margin: 5px 0; color: #666;">Current page cookies: ${currentCookies.length}</p>
        <p style="margin: 5px 0; color: #666;">All domains cookies: ${allCookies.length}</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        <label style="display: flex; align-items: center; gap: 10px;">
          <input type="radio" name="cookieScope" value="current" checked>
          <span>Current Page Cookies</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px;">
          <input type="radio" name="cookieScope" value="all">
          <span>All Domains Cookies</span>
        </label>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        <label style="display: flex; align-items: center; gap: 10px;">
          <input type="radio" name="exportFormat" value="json" checked>
          <span>JSON Format (with details)</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px;">
          <input type="radio" name="exportFormat" value="text">
          <span>Simple Text Format</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px;">
          <input type="radio" name="exportFormat" value="curl">
          <span>cURL Format</span>
        </label>
      </div>

      <div style="margin-bottom: 20px;">
        <input type="text" placeholder="Add description (optional)" 
               style="width: calc(100% - 18px); padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      </div>

      <div style="display: flex; justify-content: center; gap: 10px;">
        <button class="cancel-button" style="
          padding: 8px 20px;
          border: none;
          border-radius: 4px;
          background: #f5f5f5;
          color: #666;
          cursor: pointer;
        ">Cancel</button>
        <button class="export-button" style="
          padding: 8px 20px;
          border: none;
          border-radius: 4px;
          background: #007BFF;
          color: white;
          cursor: pointer;
        ">Export</button>
      </div>
    </div>
  `;

  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(2px);
    z-index: 1000;
  `;

  // 添加到文档
  document.body.appendChild(overlay);
  document.body.appendChild(panel);

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
    notification.textContent = 'Cookies exported successfully!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);

    // 关闭面板
    panel.remove();
    overlay.remove();
  });

  // 处理取消按钮点击
  panel.querySelector('.cancel-button').addEventListener('click', () => {
    panel.remove();
    overlay.remove();
  });

  // 添加键盘事件监听
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      panel.remove();
      overlay.remove();
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
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
        Import ${failCount === 0 ? 'Completed' : 'Completed with Errors'}
      </h3>
      <div style="margin: 15px 0;">
        <p style="color: #28a745; margin: 5px 0;">✓ Successfully imported: ${successCount}</p>
        ${failCount > 0 ? `<p style="color: #dc3545; margin: 5px 0;">✕ Failed: ${failCount}</p>` : ''}
      </div>
      ${failCount > 0 ? `
        <div style="text-align: left; margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; max-height: 200px; overflow-y: auto;">
          <p style="margin: 0 0 10px 0; font-weight: bold;">Failed cookies:</p>
          ${results.filter(r => !r.success)
            .map(r => `<p style="margin: 5px 0; color: #dc3545;">· ${r.name}: ${r.error || 'Unknown error'}</p>`)
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
        ">Close</button>
        ${failCount > 0 ? `
          <button onclick="retryFailedImports(${JSON.stringify(results)})" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #dc3545;
            color: white;
            cursor: pointer;
          ">Retry Failed</button>
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
  // 创建导入对话框
  const dialog = document.createElement('div');
  dialog.className = 'import-dialog';
  dialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,.8);
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
    width: calc(100% - 80px);
    max-width: 500px;
  `;

  // 对话框内容
  dialog.innerHTML = `
    <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0;">Import Cookies</h3>
      <button class="close-button" style="
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        display: none;
      ">×</button>
    </div>

    <div style="overflow: hidden;">
      <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <button class="format-array" style="
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          background: #007BFF;
          color: #fff;
          cursor: pointer;
        ">Array Format</button>
        <button class="format-object" style="
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          background: #007BFF;
          color: #fff;
          cursor: pointer;
        ">Object Format</button>
      </div>
      
      <textarea id="cookieInput" style="
        width: calc(100% - 22px);
        height: 200px;
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: none;
        font-family: monospace;
      " placeholder="Enter cookies here..."></textarea>
    </div>

    <div style="text-align: right;">
      <button class="cancel-button" style="
        padding: 8px 15px;
        border: none;
        border-radius: 4px;
        background: #f5f5f5;
        color: #666;
        cursor: pointer;
        margin-right: 10px;
      ">Cancel</button>
      <button class="import-button" style="
        padding: 8px 15px;
        border: none;
        border-radius: 4px;
        background: #007BFF;
        color: white;
        cursor: pointer;
      ">Import</button>
    </div>
  `;

  document.body.appendChild(dialog);

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
  dialog.querySelector('.cancel-button').addEventListener('click', () => {
    dialog.remove();
  });

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
        <div style="text-align: center; padding: 20px;">
          <h3 style="margin-bottom: 15px; color: ${failCount === 0 ? '#28a745' : '#dc3545'}">
            Import ${failCount === 0 ? 'Successful' : 'Completed with Errors'}
          </h3>
          <p style="color: #28a745; margin: 5px 0;">✓ Successfully imported: ${successCount}</p>
          ${failCount > 0 ? `<p style="color: #dc3545; margin: 5px 0;">✕ Failed: ${failCount}</p>` : ''}
          <button onclick="this.parentElement.parentElement.remove()" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #28a745;
            color: white;
            cursor: pointer;
            margin-top: 15px;
          ">Close</button>
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

    } catch (error) {
      // 显示错误消息
      dialog.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h3 style="margin-bottom: 15px; color: #dc3545;">Import Failed</h3>
          <p style="margin-bottom: 15px;">${error.message}</p>
          <button onclick="this.parentElement.parentElement.remove()" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #6c757d;
            color: white;
            cursor: pointer;
          ">Close</button>
        </div>
      `;
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
async function pinCookie(cookie) {
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
    
    // 显示成功提示
    showNotification(`Cookie "${cookie.name}" has been pinned`, 'success');

    // 立即应用这个cookie
    try {
      await applyCookie(cookieToPin);
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
    nameCell.textContent = cookie.name;
    row.appendChild(nameCell);
    
    // Value cell
    const valueCell = document.createElement("td");
    valueCell.textContent = cookie.value;
    row.appendChild(valueCell);
    
    // Actions cell
    const actionCell = document.createElement("td");
    // actionCell.className = 'cookie-actions';
    
    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn-primary";
    editButton.addEventListener("click", () => editCookie(cookie));
    
    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn-danger";
    deleteButton.addEventListener("click", async () => {
      try {
        await chrome.cookies.remove({
          url: tab.url,
          name: cookie.name
        });
        await updateCurrentTable();
        showNotification(`Cookie "${cookie.name}" deleted successfully`, 'success');
      } catch (error) {
        console.error('Failed to delete cookie:', error);
        showNotification(`Failed to delete cookie: ${error.message}`, 'error');
      }
    });
    
    // Pin/Unpin button
    const pinButton = document.createElement("button");
    const isPinned = pinnedCookies.has(cookie.name);
    pinButton.textContent = isPinned ? "Unpin" : "Pin";
    pinButton.className = isPinned ? "btn-danger" : "btn-success";
    
    pinButton.addEventListener("click", async () => {
      if (isPinned) {
        await unpinCookie(cookie.name);
      } else {
        await pinCookie(cookie);
      }
    });
    
    // 添加所有按钮到操作单元格
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton); // 添加删除按钮
    actionCell.appendChild(pinButton);
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

    const dialog = document.createElement('div');
    dialog.className = 'edit-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      z-index: 1001;
      min-width: 320px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    `;

    dialog.innerHTML = `
      <h3 style="
        margin: 0 0 20px 0;
        color: #333;
        font-size: 18px;
        font-weight: 600;
      ">Edit Cookie</h3>
      
      <div style="margin-bottom: 16px;">
        <label style="
          display: block;
          margin-bottom: 8px;
          color: #666;
          font-size: 14px;
          font-weight: 500;
        ">Cookie Name</label>
        <div style="
          padding: 8px 12px;
          background: #f5f5f5;
          border-radius: 8px;
          color: #666;
          font-size: 14px;
        ">${cookie.name}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <label style="
          display: block;
          margin-bottom: 8px;
          color: #666;
          font-size: 14px;
          font-weight: 500;
        ">Cookie Value</label>
        <input type="text" 
          id="editValue" 
          value="${cookie.value}" 
          style="
            width: 100%;
            padding: 8px 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
            transition: all 0.2s ease;
            outline: none;
          "
        >
      </div>

      <div style="
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      ">
        <button class="cancel-edit" style="
          padding: 8px 20px;
          border: none;
          border-radius: 4px;
          background: #f5f5f5;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        ">Cancel</button>
        
        <button class="save-edit" style="
          padding: 8px 20px;
          border: none;
          border-radius: 4px;
          background: #007BFF;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        ">Save</button>
      </div>
    `;

    // 添加按钮悬停效果
    const buttons = dialog.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('mouseover', function() {
        if (this.classList.contains('cancel-edit')) {
          this.style.background = '#e0e0e0';
        } else if (this.classList.contains('save-edit')) {
          this.style.background = '#1976D2';
        }
      });

      button.addEventListener('mouseout', function() {
        if (this.classList.contains('cancel-edit')) {
          this.style.background = '#f5f5f5';
        } else if (this.classList.contains('save-edit')) {
          this.style.background = '#2196F3';
        }
      });
    });

    // 添加输入框焦点效果
    const input = dialog.querySelector('#editValue');
    input.addEventListener('focus', function() {
      this.style.borderColor = '#2196F3';
    });
    input.addEventListener('blur', function() {
      this.style.borderColor = '#e0e0e0';
    });

    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(2px);
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    // 淡入效果
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    // 处理取消按钮
    dialog.querySelector('.cancel-edit').addEventListener('click', () => {
      overlay.style.opacity = '0';
      dialog.style.opacity = '0';
      dialog.style.transform = 'translate(-50%, -60%)';
      setTimeout(() => {
        dialog.remove();
        overlay.remove();
      }, 200);
    });

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
      saveButton.textContent = 'Saving...';

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
        
        // 淡出效果
        overlay.style.opacity = '0';
        dialog.style.opacity = '0';
        dialog.style.transform = 'translate(-50%, -60%)';
        setTimeout(() => {
          dialog.remove();
          overlay.remove();
        }, 200);

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
    nameCell.textContent = name;
    row.appendChild(nameCell);
    
    // Value cell
    const valueCell = document.createElement("td");
    valueCell.textContent = cookie.value;
    row.appendChild(valueCell);
    
    // Actions cell
    const actionCell = document.createElement("td");
    // actionCell.className = 'cookie-actions';
    
    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn-primary";
    editButton.addEventListener("click", () => editCookie(cookie));
    /* editButton.addEventListener("click", async () => {
      const newValue = prompt("Enter new value for cookie:", cookie.value);
      if (newValue !== null) {
        cookie.value = newValue;
        await savePinnedCookies();
        await updatePinnedTable();
        await applyCookie(cookie);
      }
    }); */
    
    // Unpin button
    const unpinButton = document.createElement("button");
    unpinButton.textContent = "Unpin";
    unpinButton.className = "btn-danger";
    unpinButton.addEventListener("click", () => unpinCookie(name));
    
    actionCell.appendChild(editButton);
    actionCell.appendChild(unpinButton);
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
      await applyCookie(cookie);
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
    await pinCookie(cookie);
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
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  try {
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
          expirationDate: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
        };

        // 先删除已存在的cookie
        await chrome.cookies.remove({
          url: url.href,
          name: cookie.name
        });

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

    // 显示结果通知
    const notification = document.createElement('div');
    notification.className = 'cookie-notification';
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      min-width: 300px;
    `;

    // 构建通知内容
    let notificationContent = `
      <div style="text-align: center;">
        <h3 style="margin-bottom: 15px; color: #333;">Cookie 应用状态</h3>
        <p style="color: #28a745;">成功: ${successCount} 个</p>
        ${failCount > 0 ? `<p style="color: #dc3545;">失败: ${failCount} 个</p>` : ''}
        <p style="color: #666;">域名: ${url.hostname}</p>
    `;

    // 如果有失败的cookie，显示详细信息
    if (failCount > 0) {
      notificationContent += `
        <div style="text-align: left; margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #333;">失败详情：</p>
          ${results.filter(r => !r.success)
            .map(r => `<p style="margin: 5px 0; color: #dc3545;">· ${r.name}: ${r.error}</p>`)
            .join('')}
        </div>
      `;
    }

    notificationContent += `
        <div style="display: flex; justify-content: center; gap: 10px; margin-top: 15px;">
          <button class="notification-close" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #007bff;
            color: white;
          ">确定</button>
          ${failCount > 0 ? `
            <button class="notification-retry" style="
              padding: 8px 20px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              background: #dc3545;
              color: white;
            ">重试</button>
          ` : ''}
          <button class="notification-debug" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #f5f5f5;
            color: #666;
          ">详情</button>
        </div>
        ${successCount > 0 ? `
          <p style="margin-top: 15px; color: #666;">
            3秒后将自动刷新页面...
          </p>
        ` : ''}
      </div>
    `;

    notification.innerHTML = notificationContent;
    document.body.appendChild(notification);

    // 添加按钮事件
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', async () => {
      notification.remove();
      if (successCount > 0) {
        // 刷新页面并等待完成
        await chrome.tabs.reload(tab.id);
        // 等待一小段时间确保页面加载完成
        await new Promise(resolve => setTimeout(resolve, 500));
        // 更新cookie表格
        await fetchCookies();
      }
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
      const debugInfo = results.map(r => 
        `${r.name}: ${r.success ? '成功' : '失败 - ' + r.error}`
      ).join('\n');
      alert('Cookie设置详细信息：\n\n' + debugInfo);
    });

    // 如果有成功设置的cookie，3秒后自动刷新页面
    if (successCount > 0) {
      setTimeout(async () => {
        notification.remove();
        // 刷新页面并等待完成
        await chrome.tabs.reload(tab.id);
        // 等待一小段时间确保页面加载完成
        await new Promise(resolve => setTimeout(resolve, 500));
        // 更新cookie表格
        await fetchCookies();
      }, 3000);
    } else {
      // 如果全部失败，5秒后自动关闭通知
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 5000);
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
        <h3>Cookie 应用状态</h3>
        <p>成功: ${successCount} 个</p>
        ${failCount > 0 ? `<p>失败: ${failCount} 个</p>` : ''}
        <p>域名: ${url.hostname}</p>
        <div class="notification-buttons">
          <button class="notification-close">确定</button>
          ${failCount > 0 ? `<button class="notification-retry">重试</button>` : ''}
          <button class="notification-debug">查看详情</button>
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
      alert('详细信息已输出到控制台，请按F12查看');
    });

    // 5秒后自动关闭通知
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);

  } catch (error) {
    console.error('执行过程中出错:', error);
    alert(`应用Cookie时发生错误: ${error.message}\n请查看控制台获取详细信息`);
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
async function applyCookie(cookie) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  
  try {
    const url = new URL(tab.url);
    
    // 处理 domain
    let domain = cookie.domain;
    if (!domain) {
      domain = url.hostname;
    } else if (domain.startsWith('.')) {
      domain = domain.substring(1);
    }

    // 确保 cookie 路径有效
    const path = cookie.path || '/';

    // 构建 cookie URL
    const cookieUrl = `${url.protocol}//${domain}${path}`;

    // 先删除已存在的同名 cookie
    try {
      await chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name
      });
    } catch (error) {
      console.log('No existing cookie to remove');
    }

    // 设置新的 cookie
    const cookieData = {
      url: cookieUrl,
      name: cookie.name,
      value: cookie.value,
      domain: domain,
      path: path,
      secure: cookie.secure || url.protocol === 'https:',
      httpOnly: cookie.httpOnly || false,
      sameSite: cookie.sameSite || "Lax",
      expirationDate: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
    };

    const result = await chrome.cookies.set(cookieData);
    
    if (!result) {
      throw new Error('Failed to set cookie');
    }

    // 验证 cookie 是否设置成功
    const verification = await chrome.cookies.get({
      url: cookieUrl,
      name: cookie.name
    });

    if (!verification || verification.value !== cookie.value) {
      throw new Error('Cookie verification failed');
    }

    console.log(`Cookie ${cookie.name} set successfully`);
    return true;

  } catch (error) {
    console.error(`Failed to set cookie ${cookie.name}:`, error);
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

    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'cookie-notification';
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      min-width: 300px;
      color: #333;
    `;

    notification.innerHTML = `
      <div style="text-align: center;">
        <h3 style="margin-bottom: 15px; color: #333;">Cookies Retrieved</h3>
        <p style="color: #666;">Found ${cookies.length} cookies</p>
        <div style="display: flex; justify-content: center; gap: 10px; margin-top: 15px;">
          <button class="copy-simple" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #007bff;
            color: white;
          ">Copy Simple Format</button>
          <button class="copy-detailed" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #28a745;
            color: white;
          ">Copy Detailed JSON</button>
          <button class="close-notify" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #6c757d;
            color: white;
          ">Close</button>
        </div>
        <div class="copy-status" style="
          margin-top: 10px;
          color: #28a745;
          font-size: 14px;
          height: 20px;
        "></div>
      </div>
    `;

    document.body.appendChild(notification);

    // 复制简单格式
    notification.querySelector('.copy-simple').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(textVersion);
        showCopyStatus('Simple format copied to clipboard!');
      } catch (err) {
        showCopyStatus('Failed to copy: ' + err.message, true);
      }
    });

    // 复制详细格式
    notification.querySelector('.copy-detailed').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(detailedVersion);
        showCopyStatus('Detailed JSON copied to clipboard!');
      } catch (err) {
        showCopyStatus('Failed to copy: ' + err.message, true);
      }
    });

    // 关闭按钮
    notification.querySelector('.close-notify').addEventListener('click', () => {
      notification.remove();
    });

    // 显示复制状态的函数
    function showCopyStatus(message, isError = false) {
      const statusDiv = notification.querySelector('.copy-status');
      statusDiv.textContent = message;
      statusDiv.style.color = isError ? '#dc3545' : '#28a745';
      
      // 2秒后清除消息
      setTimeout(() => {
        statusDiv.textContent = '';
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
        <span>Cookies refreshed successfully</span>
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
    alert('Failed to fetch cookies: ' + error.message);
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

    // 创建确认对话框
    const dialog = document.createElement('div');
    dialog.className = 'delete-confirmation-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1001;
      min-width: 300px;
      color: #333;
    `;

    dialog.innerHTML = `
      <div style="text-align: center;">
        <h3 style="margin-bottom: 15px; color: #dc3545;">Confirm Deletion</h3>
        <p style="margin-bottom: 20px;">
          Are you sure you want to delete all cookies (${cookies.length}) 
          from the current page?
        </p>
        <div style="display: flex; justify-content: center; gap: 10px;">
          <button class="cancel-delete" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #6c757d;
            color: white;
            cursor: pointer;
          ">Cancel</button>
          <button class="confirm-delete" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #dc3545;
            color: white;
            cursor: pointer;
          ">Delete All</button>
        </div>
      </div>
    `;

    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(2px);
      z-index: 1000;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    // 处理取消按钮
    dialog.querySelector('.cancel-delete').addEventListener('click', () => {
      dialog.remove();
      overlay.remove();
    });

    // 处理确认删除按钮
    dialog.querySelector('.confirm-delete').addEventListener('click', async () => {
      // 显示加载状态
      dialog.innerHTML = `
        <div style="text-align: center;">
          <div class="loading-spinner" style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid #dc3545;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          "></div>
          <p>Deleting cookies...</p>
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
            <h3 style="margin-bottom: 15px; color: ${failCount === 0 ? '#28a745' : '#dc3545'}">
              Deletion ${failCount === 0 ? 'Successful' : 'Completed with Errors'}
            </h3>
            <p style="color: #28a745; margin: 5px 0;">✓ Successfully deleted: ${successCount}</p>
            ${failCount > 0 ? `<p style="color: #dc3545; margin: 5px 0;">✕ Failed: ${failCount}</p>` : ''}
            ${failCount > 0 ? `
              <div style="text-align: left; margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; max-height: 150px; overflow-y: auto;">
                <p style="margin: 0 0 10px 0; font-weight: bold;">Failed deletions:</p>
                ${results.filter(r => !r.success)
                  .map(r => `<p style="margin: 5px 0; color: #dc3545;">· ${r.name}: ${r.error || 'Unknown error'}</p>`)
                  .join('')}
              </div>
            ` : ''}
            <button class="close-dialog" style="
              padding: 8px 20px;
              border: none;
              border-radius: 4px;
              background: #28a745;
              color: white;
              cursor: pointer;
              margin-top: 15px;
            ">Close</button>
          </div>
        `;

        // 添加关闭按钮事件
        dialog.querySelector('.close-dialog').addEventListener('click', () => {
          dialog.remove();
          overlay.remove();
        });

        // 如果全部成功，2秒后自动关闭
        if (failCount === 0) {
          setTimeout(() => {
            dialog.remove();
            overlay.remove();
          }, 2000);
        }

      } catch (error) {
        dialog.innerHTML = `
          <div style="text-align: center;">
            <h3 style="margin-bottom: 15px; color: #dc3545;">Error</h3>
            <p style="margin-bottom: 20px;">${error.message}</p>
            <button class="close-dialog" style="
              padding: 8px 20px;
              border: none;
              border-radius: 4px;
              background: #6c757d;
              color: white;
              cursor: pointer;
            ">Close</button>
          </div>
        `;

        dialog.querySelector('.close-dialog').addEventListener('click', () => {
          dialog.remove();
          overlay.remove();
        });
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

    // 创建确认对话框
    const dialog = document.createElement('div');
    dialog.className = 'delete-confirmation-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1001;
      min-width: 300px;
      color: #333;
    `;

    dialog.innerHTML = `
      <div style="text-align: center;">
        <h3 style="margin-bottom: 15px; color: #dc3545;">⚠️ Warning</h3>
        <p style="margin-bottom: 20px;">
          Are you sure you want to delete ALL cookies (${allCookies.length}) 
          from ALL domains? This action cannot be undone.
        </p>
        <div style="display: flex; justify-content: center; gap: 10px;">
          <button class="cancel-delete" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #6c757d;
            color: white;
            cursor: pointer;
          ">Cancel</button>
          <button class="confirm-delete" style="
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #dc3545;
            color: white;
            cursor: pointer;
          ">Delete All</button>
        </div>
      </div>
    `;

    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(2px);
      z-index: 1000;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    // 处理取消按钮
    dialog.querySelector('.cancel-delete').addEventListener('click', () => {
      dialog.remove();
      overlay.remove();
    });

    // 处理确认删除按钮
    dialog.querySelector('.confirm-delete').addEventListener('click', async () => {
      // 显示加载状态
      dialog.innerHTML = `
        <div style="text-align: center;">
          <div class="loading-spinner" style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid #dc3545;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          "></div>
          <p>Deleting all cookies...</p>
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
            <h3 style="margin-bottom: 15px; color: ${failCount === 0 ? '#28a745' : '#dc3545'}">
              Deletion ${failCount === 0 ? 'Successful' : 'Completed with Errors'}
            </h3>
            <p style="color: #28a745; margin: 5px 0;">✓ Successfully deleted: ${successCount}</p>
            ${failCount > 0 ? `<p style="color: #dc3545; margin: 5px 0;">✕ Failed: ${failCount}</p>` : ''}
            ${failCount > 0 ? `
              <div style="text-align: left; margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; max-height: 150px; overflow-y: auto;">
                <p style="margin: 0 0 10px 0; font-weight: bold;">Failed deletions:</p>
                ${results.filter(r => !r.success)
                  .map(r => `<p style="margin: 5px 0; color: #dc3545;">· ${r.name} (${r.domain}): ${r.error || 'Unknown error'}</p>`)
                  .join('')}
              </div>
            ` : ''}
            <button class="close-dialog" style="
              padding: 8px 20px;
              border: none;
              border-radius: 4px;
              background: #28a745;
              color: white;
              cursor: pointer;
              margin-top: 15px;
            ">Close</button>
          </div>
        `;

        // 添加关闭按钮事件
        dialog.querySelector('.close-dialog').addEventListener('click', () => {
          dialog.remove();
          overlay.remove();
        });

        // 如果全部成功，2秒后自动关闭
        if (failCount === 0) {
          setTimeout(() => {
            dialog.remove();
            overlay.remove();
          }, 2000);
        }

      } catch (error) {
        dialog.innerHTML = `
          <div style="text-align: center;">
            <h3 style="margin-bottom: 15px; color: #dc3545;">Error</h3>
            <p style="margin-bottom: 20px;">${error.message}</p>
            <button class="close-dialog" style="
              padding: 8px 20px;
              border: none;
              border-radius: 4px;
              background: #6c757d;
              color: white;
              cursor: pointer;
            ">Close</button>
          </div>
        `;

        dialog.querySelector('.close-dialog').addEventListener('click', () => {
          dialog.remove();
          overlay.remove();
        });
      }
    });

  } catch (error) {
    showNotification(error.message, 'error');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 4px;
    color: white;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;

  // 根据类型设置背景色
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };
  notification.style.background = colors[type] || colors.info;

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  // 2秒后自动移除
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// 添加到现有的style元素中
const additionalStyle = `
  .cookie-actions {
    display: flex;
    gap: 5px;
  }

  .cookie-actions button {
    flex: 1;
    min-width: 50px;
  }

  .notification {
    transition: all 0.3s ease;
  }

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
`;

document.head.appendChild(document.createElement('style')).textContent += additionalStyle;

// 添加删除所有cookies按钮的事件监听器
document.getElementById("deleteAllCookies").addEventListener("click", deleteAllCookies);

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
        
        // 创建一个表单对话框
        const formHtml = `
          <div style="padding: 15px;">
            <style>
              .cookie-form input, .cookie-form select {
                width: 100%;
                padding: 8px;
                margin: 5px 0 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
              }
              .cookie-form label {
                font-weight: bold;
                color: #333;
              }
              .cookie-form .advanced-toggle {
                color: #007bff;
                cursor: pointer;
                margin: 10px 0;
                user-select: none;
              }
              .cookie-form .advanced-section {
                display: none;
                border-top: 1px solid #eee;
                padding-top: 10px;
                margin-top: 10px;
              }
              .cookie-form .advanced-section.show {
                display: block;
              }
            </style>
            <div class="cookie-form">
              <label for="cookieName">Cookie Name *</label>
              <input type="text" id="cookieName" required>
              
              <label for="cookieValue">Cookie Value *</label>
              <input type="text" id="cookieValue" required>
              
              <div class="advanced-toggle">
                ▶ Advanced Settings
              </div>
              
              <div class="advanced-section">
                <label for="cookieDomain">Domain</label>
                <input type="text" id="cookieDomain" placeholder="Leave empty for current domain">
                
                <label for="cookiePath">Path</label>
                <input type="text" id="cookiePath" value="/" placeholder="/">
                
                <label for="cookieExpiration">Expiration</label>
                <select id="cookieExpirationType">
                  <option value="session">Session</option>
                  <option value="date">Specific Date</option>
                  <option value="duration" selected>Duration</option>
                </select>
                
                <div id="expirationDateContainer" style="display: none;">
                  <input type="datetime-local" id="cookieExpirationDate">
                </div>
                
                <div id="expirationDurationContainer">
                  <input type="number" id="cookieExpirationDuration" value="365" min="1">
                  <select id="cookieExpirationUnit">
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days" selected>Days</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
                
                <label for="cookieSameSite">SameSite</label>
                <select id="cookieSameSite">
                  <option value="Lax">Lax</option>
                  <option value="Strict">Strict</option>
                  <option value="None">None</option>
                </select>
                
                <div style="margin-top: 10px;">
                  <label style="display: inline-flex; align-items: center;">
                    <input type="checkbox" id="cookieSecure" ${url.protocol === 'https:' ? 'checked' : ''}>
                    <span style="margin-left: 5px;">Secure</span>
                  </label>
                  
                  <label style="display: inline-flex; align-items: center; margin-left: 15px;">
                    <input type="checkbox" id="cookieHttpOnly">
                    <span style="margin-left: 5px;">HttpOnly</span>
                  </label>
                  
                  <label style="display: inline-flex; align-items: center; margin-left: 15px;">
                    <input type="checkbox" id="cookieHostOnly">
                    <span style="margin-left: 5px;">Host Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        `;
    
        // 显示对话框
        const dialog = document.createElement('div');
        dialog.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1001;
          min-width: 350px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        `;
        
        dialog.innerHTML = `
          <h3 style="margin-top: 0; margin-bottom: 15px;">Add New Cookie</h3>
          ${formHtml}
          <div style="text-align: right; margin-top: 15px;">
            <button id="cancelAdd" style="
              padding: 8px 15px;
              margin-right: 10px;
              border: none;
              border-radius: 4px;
              background: #f5f5f5;
              color: #666;
              cursor: pointer;
            ">Cancel</button>
            <button id="confirmAdd" style="
              padding: 8px 15px;
              border: none;
              border-radius: 4px;
              background: #007BFF;
              color: white;
              cursor: pointer;
            ">Add Cookie</button>
          </div>
        `;
    
        document.body.appendChild(dialog);
    
        // 添加遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(2px);
          z-index: 1000;
        `;
    
        document.body.appendChild(overlay);
    
        // 高级设置切换
        const advancedToggle = dialog.querySelector('.advanced-toggle');
        const advancedSection = dialog.querySelector('.advanced-section');
        advancedToggle.addEventListener('click', () => {
          advancedSection.classList.toggle('show');
          advancedToggle.textContent = advancedSection.classList.contains('show') ? 
            '▼ Advanced Settings' : '▶ Advanced Settings';
        });
    
        // 过期时间类型切换
        const expirationType = dialog.querySelector('#cookieExpirationType');
        const expirationDateContainer = dialog.querySelector('#expirationDateContainer');
        const expirationDurationContainer = dialog.querySelector('#expirationDurationContainer');
        
        expirationType.addEventListener('change', () => {
          expirationDateContainer.style.display = expirationType.value === 'date' ? 'block' : 'none';
          expirationDurationContainer.style.display = expirationType.value === 'duration' ? 'block' : 'none';
        });
    
        // Host Only 复选框事件
        const hostOnlyCheckbox = dialog.querySelector('#cookieHostOnly');
        const domainInput = dialog.querySelector('#cookieDomain');
        
        hostOnlyCheckbox.addEventListener('change', () => {
          domainInput.disabled = hostOnlyCheckbox.checked;
          if (hostOnlyCheckbox.checked) {
            domainInput.value = '';
            domainInput.placeholder = 'Using current domain';
          } else {
            domainInput.placeholder = 'Leave empty for current domain';
          }
        });
    
        // 处理取消按钮
        document.getElementById('cancelAdd').addEventListener('click', () => {
          dialog.remove();
          overlay.remove();
        });
    
        // 处理确认按钮
        document.getElementById('confirmAdd').addEventListener('click', async () => {
          const name = document.getElementById('cookieName').value.trim();
          const value = document.getElementById('cookieValue').value;
          
          if (!name) {
            alert('Cookie name is required');
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
    
            // 移除对话框
            dialog.remove();
            overlay.remove();
    
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
                <span>Cookie added successfully</span>
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

// 在页面加载时初始化计数
document.addEventListener('DOMContentLoaded', async() => {
  // 立即显示基础UI
  // renderBasicUI();
  
  setTimeout(async () => {
    try {
      await initializeEventListeners();
      await fetchDailyQuote();
      await loadPinnedCookies();
      await fetchCookies();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }, 0);
});

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
