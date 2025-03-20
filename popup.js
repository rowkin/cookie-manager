// 修改 fetchDailyQuote 函数，添加多个备选API源
async function fetchDailyQuote() {
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

  let quote = null;
  let error = null;

  // 依次尝试不同的API源，直到获取成功
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

  const quoteElement = document.getElementById("dailyQuote");
  
  if (!quote) {
    console.error('All quote sources failed:', error);
    quoteElement.innerHTML = `
      <div class="quote-container">
        <div class="quote-original">生活总是充满希望 — 永不放弃</div>
        <div class="quote-translated">Life is always full of hope - Never give up</div>
      </div>
    `;
    return;
  }

  try {
    // 使用Google翻译API进行翻译
    const translateResponse = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(quote.text)}`
    );
    const translateData = await translateResponse.json();
    const translatedText = translateData[0][0][0];

    // 更新DOM显示双语
    quoteElement.innerHTML = `
      <div class="quote-container">
        <div class="quote-original">${quote.text} — ${quote.from}</div>
        <div class="quote-translated">${translatedText}</div>
      </div>
    `;
  } catch (translateError) {
    // 如果翻译失败，只显示原文
    quoteElement.innerHTML = `
      <div class="quote-container">
        <div class="quote-original">${quote.text} — ${quote.from}</div>
      </div>
    `;
  }
};

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
  editButton.addEventListener("click", async () => {
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
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
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

// 修改 addCookie 事件监听器
document.getElementById("addCookie").addEventListener("click", async () => {
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
      z-index: 1000;
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
          background: #6c757d;
          color: white;
          cursor: pointer;
        ">Cancel</button>
        <button id="confirmAdd" style="
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          background: #28a745;
          color: white;
          cursor: pointer;
        ">Add Cookie</button>
      </div>
    `;

    document.body.appendChild(dialog);

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
        console.error('Failed to add cookie:', error);
        
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

// Delete all cookies
document.getElementById("deleteAllCookies").addEventListener("click", () => {
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
});

// Export cookies
document.getElementById("exportCookies").addEventListener("click", () => {
  chrome.cookies.getAll({}, (cookies) => {
    const blob = new Blob([JSON.stringify(cookies, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cookies.json";
    a.click();
    URL.revokeObjectURL(url);
  });
});

// 修改 importCookies 函数
// 修改 importCookies 事件监听器
document.getElementById("importCookies").addEventListener("click", async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json,.txt";

  input.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 创建导入进度对话框
    const progressDialog = document.createElement('div');
    progressDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      min-width: 350px;
      max-width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      color: #333;
    `;

    progressDialog.innerHTML = `
      <div style="text-align: center;">
        <h3 style="margin-bottom: 15px;">Importing Cookies</h3>
        <div id="importProgress" style="margin-bottom: 15px;">Reading file...</div>
        <div id="progressBar" style="
          width: 100%;
          height: 4px;
          background: #f0f0f0;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 15px;
        ">
          <div id="progressBarInner" style="
            width: 0%;
            height: 100%;
            background: #007bff;
            transition: width 0.3s;
          "></div>
        </div>
        <div id="importDetails" style="
          text-align: left;
          margin-top: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
          display: none;
        "></div>
        <div id="importStatus" style="
          margin-top: 10px;
          font-size: 14px;
          color: #666;
        "></div>
      </div>
    `;

    document.body.appendChild(progressDialog);

    const updateProgress = (message, progress, details = null) => {
      const progressDiv = document.getElementById('importProgress');
      const progressBar = document.getElementById('progressBarInner');
      const statusDiv = document.getElementById('importStatus');
      const detailsDiv = document.getElementById('importDetails');
      
      if (progressDiv) progressDiv.textContent = message;
      if (progressBar) progressBar.style.width = `${progress}%`;
      if (statusDiv) statusDiv.textContent = `${Math.round(progress)}%`;
      
      if (details && detailsDiv) {
        detailsDiv.style.display = 'block';
        detailsDiv.innerHTML += `<div>${details}</div>`;
        detailsDiv.scrollTop = detailsDiv.scrollHeight;
      }
    };

    try {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          updateProgress('Parsing file...', 10);
          
          let cookies;
          const content = reader.result;
          
          // 尝试解析不同格式
          try {
            cookies = JSON.parse(content);
            
            if (Array.isArray(cookies)) {
              cookies = cookies;
            } else if (cookies.cookies) {
              cookies = cookies.cookies;
            } else {
              cookies = [cookies];
            }
            updateProgress('Successfully parsed JSON format', 20, '✓ File format: JSON');
          } catch (e) {
            // 尝试解析为cookie字符串
            try {
              cookies = content.split(';').map(cookie => {
                const [name, value] = cookie.trim().split('=');
                return { name, value };
              });
              updateProgress('Parsed as cookie string', 20, '✓ File format: Cookie string');
            } catch (error) {
              throw new Error('Invalid file format. Please use JSON or cookie string format.');
            }
          }

          // 验证cookie格式
          cookies = cookies.filter(cookie => {
            const isValid = cookie && typeof cookie === 'object' && cookie.name && cookie.value;
            if (!isValid) {
              updateProgress('Validating cookies...', 30, `⚠️ Skipped invalid cookie: ${JSON.stringify(cookie)}`);
            }
            return isValid;
          });

          if (cookies.length === 0) {
            throw new Error('No valid cookies found in the file');
          }

          updateProgress(`Found ${cookies.length} valid cookies`, 40);

          // 获取当前标签页信息
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (!tab) throw new Error('No active tab found');

          const url = new URL(tab.url);
          const domain = url.hostname;
          
          let successCount = 0;
          let failCount = 0;
          const results = [];

          // 导入每个cookie
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const progress = 40 + (i / cookies.length) * 50;
            updateProgress(`Importing cookie ${i + 1}/${cookies.length}...`, progress);

            try {
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

              const result = await chrome.cookies.set(cookieData);
              
              if (result) {
                successCount++;
                results.push({
                  name: cookie.name,
                  success: true
                });
                updateProgress(null, progress, `✓ Successfully set cookie: ${cookie.name}`);
              } else {
                throw new Error('Failed to set cookie');
              }
            } catch (error) {
              failCount++;
              results.push({
                name: cookie.name,
                success: false,
                error: error.message
              });
              updateProgress(null, progress, `❌ Failed to set cookie ${cookie.name}: ${error.message}`);
            }
          }

          updateProgress('Updating UI...', 90);
          await fetchCookies();

          // 更新结果显示
          progressDialog.innerHTML = `
            <div style="text-align: center;">
              <h3 style="margin-bottom: 15px;">Import Complete</h3>
              <div style="margin: 15px 0;">
                <p style="color: #28a745; margin: 5px 0;">✓ Successfully imported: ${successCount}</p>
                ${failCount > 0 ? `<p style="color: #dc3545; margin: 5px 0;">❌ Failed: ${failCount}</p>` : ''}
              </div>
              <div style="
                max-height: 200px;
                overflow-y: auto;
                margin: 15px 0;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 4px;
                text-align: left;
              ">
                ${results.map(r => `
                  <div style="margin: 5px 0; color: ${r.success ? '#28a745' : '#dc3545'}">
                    ${r.success ? '✓' : '❌'} ${r.name}: ${r.success ? 'Success' : r.error}
                  </div>
                `).join('')}
              </div>
              <div style="margin-top: 15px;">
                <button id="closeImport" style="
                  padding: 8px 20px;
                  border: none;
                  border-radius: 4px;
                  background: #6c757d;
                  color: white;
                  cursor: pointer;
                ">Close</button>
                ${failCount > 0 ? `
                  <button id="retryFailed" style="
                    padding: 8px 20px;
                    margin-left: 10px;
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

          // 添加关闭按钮事件
          document.getElementById('closeImport').addEventListener('click', () => {
            progressDialog.remove();
          });

          // 如果有失败的cookie，添加重试按钮事件
          if (failCount > 0) {
            document.getElementById('retryFailed').addEventListener('click', async () => {
              const failedCookies = cookies.filter(c => 
                results.find(r => r.name === c.name && !r.success)
              );
              progressDialog.remove();
              // 重新导入失败的cookie
              await importCookies(failedCookies);
            });
          }

        } catch (error) {
          progressDialog.innerHTML = `
            <div style="text-align: center;">
              <h3 style="margin-bottom: 15px; color: #dc3545;">Import Failed</h3>
              <div style="
                margin: 15px 0;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 4px;
                color: #dc3545;
                text-align: left;
              ">
                <p style="margin: 0;">Error: ${error.message}</p>
              </div>
              <button id="closeError" style="
                margin-top: 15px;
                padding: 8px 20px;
                border: none;
                border-radius: 4px;
                background: #6c757d;
                color: white;
                cursor: pointer;
              ">Close</button>
            </div>
          `;

          document.getElementById('closeError').addEventListener('click', () => {
            progressDialog.remove();
          });
        }
      };

      reader.onerror = () => {
        progressDialog.innerHTML = `
          <div style="text-align: center;">
            <h3 style="margin-bottom: 15px; color: #dc3545;">Error Reading File</h3>
            <p>Failed to read the file. Please try again.</p>
            <button id="closeError" style="
              margin-top: 15px;
              padding: 8px 20px;
              border: none;
              border-radius: 4px;
              background: #6c757d;
              color: white;
              cursor: pointer;
            ">Close</button>
          </div>
        `;

        document.getElementById('closeError').addEventListener('click', () => {
          progressDialog.remove();
        });
      };

      reader.readAsText(file);

    } catch (error) {
      progressDialog.innerHTML = `
        <div style="text-align: center;">
          <h3 style="margin-bottom: 15px; color: #dc3545;">Import Error</h3>
          <p>${error.message}</p>
          <button id="closeError" style="
            margin-top: 15px;
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #6c757d;
            color: white;
            cursor: pointer;
          ">Close</button>
        </div>
      `;

      document.getElementById('closeError').addEventListener('click', () => {
        progressDialog.remove();
      });
    }
  });

  input.click();
});

// Search cookies
document.getElementById("searchCookie").addEventListener("input", (event) => {
  const filter = event.target.value.toLowerCase();
  Array.from(tableBody.rows).forEach((row) => {
    const name = row.cells[0].textContent.toLowerCase();
    row.style.display = name.includes(filter) ? "" : "none";
  });
});

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
  updatePinnedTable();
  
  // 立即应用这个cookie
  try {
    await applyCookie(cookieToPin);
  } catch (error) {
    console.error('Failed to apply pinned cookie:', error);
  }
}

// 从固定列表移除cookie
async function unpinCookie(name) {
  pinnedCookies.delete(name);
  await savePinnedCookies();
  updatePinnedTable();
}

// 更新固定cookie表格
function updatePinnedTable() {
  const pinnedTableBody = document.querySelector("#pinnedTable tbody");
  pinnedTableBody.innerHTML = "";
  
  pinnedCookies.forEach((cookie, name) => {
    const row = document.createElement("tr");
    
    // Name
    const nameCell = document.createElement("td");
    nameCell.textContent = name;
    row.appendChild(nameCell);
    
    // Value
    const valueCell = document.createElement("td");
    valueCell.textContent = cookie.value;
    row.appendChild(valueCell);
    
    // Actions
    const actionCell = document.createElement("td");
    
    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", async () => {
      const newValue = prompt("Enter new value for cookie:", cookie.value);
      if (newValue !== null) {
        cookie.value = newValue;
        await savePinnedCookies();
        updatePinnedTable();
        applyCookie(cookie);
      }
    });
    
    // Unpin button
    const unpinButton = document.createElement("button");
    unpinButton.textContent = "Unpin";
    unpinButton.className = "unpin-button";
    unpinButton.addEventListener("click", () => unpinCookie(name));
    
    actionCell.appendChild(editButton);
    actionCell.appendChild(unpinButton);
    row.appendChild(actionCell);
    
    pinnedTableBody.appendChild(row);
  });
}

// 修改 pinCookie 函数，保存更完整的cookie信息
async function pinCookie(cookie) {
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
  updatePinnedTable();
  
  // 立即应用这个cookie
  try {
    await applyCookie(cookieToPin);
  } catch (error) {
    console.error('Failed to apply pinned cookie:', error);
  }
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
  // 可以添加一个隐藏的调试面板在UI上
  const debugElement = document.getElementById('debugInfo');
  if (debugElement) {
    debugElement.textContent += message + '\n';
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
            background: #6c757d;
            color: white;
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
async function applyCookie(cookie, forceCurrent = false) {
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
// document.getElementById("getCookies").addEventListener("click", async () => {
//   try {
//     await fetchCookies();
//     // 显示成功提示
//     const notification = document.createElement('div');
//     notification.className = 'cookie-notification';
//     notification.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       background: #28a745;
//       color: white;
//       padding: 10px 20px;
//       border-radius: 4px;
//       box-shadow: 0 2px 5px rgba(0,0,0,0.2);
//       z-index: 1000;
//       animation: slideIn 0.3s ease-out;
//     `;
//     notification.innerHTML = `
//       <div style="display: flex; align-items: center; gap: 10px;">
//         <span>✓</span>
//         <span>Cookies refreshed successfully</span>
//       </div>
//     `;
//     document.body.appendChild(notification);

//     // 2秒后自动移除通知
//     setTimeout(() => {
//       notification.style.animation = 'slideOut 0.3s ease-out';
//       setTimeout(() => notification.remove(), 300);
//     }, 2000);
//   } catch (error) {
//     console.error('Failed to fetch cookies:', error);
//     alert('Failed to fetch cookies: ' + error.message);
//   }
// });
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

// 在页面加载时初始化计数
document.addEventListener('DOMContentLoaded', () => {
  fetchCookies(); // 这会同时更新cookie数量
});

// 替换原有的fetch调用为新的函数调用
fetchDailyQuote();

// Initial fetch
fetchCookies();

// 初始化加载
loadPinnedCookies();