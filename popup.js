const tableBody = document.querySelector("#cookieTable tbody");

// Fetch and display cookies
async function fetchCookies() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  chrome.cookies.getAll({ url: tab.url }, (cookies) => {
    tableBody.innerHTML = ""; // Clear existing rows
    cookies.forEach((cookie) => {
      addCookieToTable(cookie);
    });
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
  editButton.addEventListener("click", () => {
    const newValue = prompt("Enter new value for cookie:", cookie.value);
    if (newValue !== null) {
      chrome.cookies.set({
        url: cookie.domain,
        name: cookie.name,
        value: newValue
      }, () => {
        valueCell.textContent = newValue;
      });
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
    });
  });

  actionCell.appendChild(editButton);
  actionCell.appendChild(deleteButton);
  row.appendChild(actionCell);

  tableBody.appendChild(row);
}

// Add a new cookie
document.getElementById("addCookie").addEventListener("click", () => {
  const name = prompt("Enter cookie name:");
  const value = prompt("Enter cookie value:");
  if (name && value) {
    chrome.cookies.set({
      url: location.origin,
      name: name,
      value: value
    }, fetchCookies);
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

// Import cookies
document.getElementById("importCookies").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const cookies = JSON.parse(reader.result);
      cookies.forEach((cookie) => {
        chrome.cookies.set(cookie, fetchCookies);
      });
    };
    reader.readAsText(file);
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

// Fetch daily quote
fetch("https://v1.hitokoto.cn/?c=i&encode=json")
  .then((response) => response.json())
  .then((data) => {
    const quoteElement = document.getElementById("dailyQuote");
    quoteElement.textContent = `${data.hitokoto} — ${data.from}`;
  })
  .catch(() => {
    document.getElementById("dailyQuote").textContent = "Failed to load quote.";
  });

// Fetch daily quote with translation
async function fetchDailyQuote() {
  try {
    // 获取一言数据
    const response = await fetch("https://v1.hitokoto.cn/?c=i&encode=json");
    const data = await response.json();
    const originalText = `${data.hitokoto} — ${data.from}`;
    
    // 使用Google翻译API进行翻译
    const translateResponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodeURIComponent(data.hitokoto)}`);
    const translateData = await translateResponse.json();
    const translatedText = translateData[0][0][0];

    // 更新DOM显示双语
    const quoteElement = document.getElementById("dailyQuote");
    quoteElement.innerHTML = `
      <div class="quote-container">
        <div class="quote-original">${data.hitokoto} — ${data.from}</div>
        <div class="quote-translated">${translatedText}</div>
      </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .quote-container {
        padding: 10px;
        background: #f5f5f5;
        border-radius: 5px;
        margin: 10px 0;
      }
      .quote-original {
        font-size: 14px;
        color: #333;
        margin-bottom: 5px;
      }
      .quote-translated {
        font-size: 13px;
        color: #666;
        font-style: italic;
      }
    `;
    document.head.appendChild(style);

  } catch (error) {
    console.error('Error fetching or translating quote:', error);
    document.getElementById("dailyQuote").textContent = "Failed to load quote.";
  }
}

// 替换原有的fetch调用为新的函数调用
fetchDailyQuote();

// Initial fetch
fetchCookies();