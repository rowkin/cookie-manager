// Google Analytics 配置
const GA_MEASUREMENT_ID = 'G-XXEX1FMWJ5'; // GA4 Measurement ID
const GA_API_SECRET = 'c7zU4YArRlC9h_lrjD7-Ew'; // GA4 API Secret
const GA_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;

// 生成唯一的客户端ID
const generateClientId = () => {
  return 'extension_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// 发送事件到 Google Analytics
const sendToGA = async (eventName, eventParams = {}) => {
  try {
    // 获取或生成 client_id
    const { clientId } = await chrome.storage.local.get(['clientId']);
    const currentClientId = clientId || generateClientId();
    
    if (!clientId) {
      await chrome.storage.local.set({ clientId: currentClientId });
    }

    const data = {
      client_id: currentClientId,
      events: [{
        name: eventName,
        params: {
          ...eventParams,
          engagement_time_msec: 100,
          session_id: Date.now().toString(),
          extension_version: chrome.runtime.getManifest().version
        }
      }]
    };

    const response = await fetch(GA_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`GA request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending analytics:', error);
  }
};

// 更新统计计数
const updateStats = async (eventType) => {
  try {
    const stats = await chrome.storage.local.get(['stats']);
    const newStats = {
      ...stats,
      [eventType]: (stats[eventType] || 0) + 1
    };
    
    await chrome.storage.local.set({ stats: newStats });
    
    // 发送事件到 GA4
    await sendToGA(eventType, {
      count: newStats[eventType],
      timestamp: new Date().toISOString()
    });
    
    return newStats;
  } catch (error) {
    console.error('Error updating stats:', error);
    return null;
  }
};

// 监听安装和更新事件
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // 首次安装
    const initialStats = {
      installations: 1,
      popupOpens: 0,
      totalVisits: 0
    };
    
    await chrome.storage.local.set({ stats: initialStats });
    
    // 发送安装事件到 GA4
    await sendToGA('extension_installed', {
      extension_version: chrome.runtime.getManifest().version,
      installation_type: 'new'
    });
  } else if (details.reason === 'update') {
    // 扩展更新
    await sendToGA('extension_updated', {
      extension_version: chrome.runtime.getManifest().version,
      previous_version: details.previousVersion
    });
  }
  
  // 记录访问
  await updateStats('totalVisits');
});

// 监听popup打开事件
chrome.action.onClicked.addListener(async () => {
  await updateStats('popupOpens');
});

// 处理来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATS') {
    // 返回统计数据
    chrome.storage.local.get(['stats'], (result) => {
      sendResponse(result.stats || {});
    });
    return true;
  }
  
  if (message.type === 'TRACK_EVENT') {
    // 处理自定义事件跟踪
    sendToGA(message.eventName, message.eventParams);
    sendResponse({ success: true });
    return true;
  }
  
  if (message.type === 'GET_COOKIES') {
    chrome.cookies.getAll({}, (cookies) => {
      sendResponse({ cookies: cookies });
    });
    return true;
  }
});

// 定期发送会话事件（每30分钟）
setInterval(async () => {
  try {
    const { stats } = await chrome.storage.local.get(['stats']);
    await sendToGA('session_ping', {
      total_visits: stats.totalVisits || 0,
      total_popup_opens: stats.popupOpens || 0
    });
  } catch (error) {
    console.error('Error sending session ping:', error);
  }
}, 1800000); // 30分钟