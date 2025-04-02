// 天气 API 配置
const WEATHER_APIS = {
  // wttr.in - 完全开放的天气 API，不需要 key
  wttr: {
    url: 'https://wttr.in',
    getUrl: (lat, lon) => 
      `https://wttr.in/${lat},${lon}?format=j1`
  },
  
  // 中国天气网 - 公开接口
  weather_cn: {
    url: 'http://www.weather.com.cn/data/cityinfo',
    getUrl: (cityCode) =>
      `http://www.weather.com.cn/data/cityinfo/${cityCode}.html`
  },

  // 和风天气 - 开发版 API (使用示例 key)
  hefeng: {
    key: '4e43590718c84f4eb39d116814dcb67c',
    getUrl: (lat, lon) => 
      `https://devapi.qweather.com/v7/weather/now?location=${lon},${lat}&key=4e43590718c84f4eb39d116814dcb67c&lang=zh`
  },

  // 彩云天气开发版 - 有免费配额
  caiyun: {
    key: 'TAkhjf8d1nlSlspN', // 测试 key
    url: 'https://api.caiyunapp.com/v2.5',
    getUrl: (lat, lon) =>
      `https://api.caiyunapp.com/v2.5/TAkhjf8d1nlSlspN/${lon},${lat}/weather.json`
  }
};

// 天气图标映射
const WEATHER_ICONS = {
  'Clear': 'wi-day-sunny',
  'Sunny': 'wi-day-sunny',
  'Cloudy': 'wi-cloudy',
  'Overcast': 'wi-cloudy',
  'Rain': 'wi-rain',
  'Snow': 'wi-snow',
  'Thunder': 'wi-thunderstorm',
  'Fog': 'wi-fog',
  'Mist': 'wi-fog',
  'Light rain': 'wi-sprinkle',
  'Moderate rain': 'wi-rain',
  'Heavy rain': 'wi-rain-wind',
  'default': 'wi-day-sunny'
};

// 获取默认位置（北京）
const DEFAULT_LOCATION = {
  lat: 39.9042,
  lon: 116.4074,
  city: '北京'
};

// 添加缓存相关的常量和工具函数
const CACHE_KEYS = {
  LOCATION: 'weather_location',
  WEATHER: 'weather_data'
};

const CACHE_TTL = {
  LOCATION: 60 * 60 * 1000, // 位置信息缓存60分钟
  WEATHER: 30 * 60 * 1000   // 天气数据缓存30分钟
};

// 添加动态更新间隔
const UPDATE_INTERVALS = {
  NORMAL: 30 * 60 * 1000,      // 正常情况下30分钟更新一次
  ERROR: 5 * 60 * 1000,        // 发生错误后5分钟重试
  MAX_RETRIES: 3               // 最大重试次数
};

// 缓存工具类
const WeatherCache = {
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
  
  async set(key, value, ttl) {
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

// 修改获取位置信息函数，添加缓存
async function getLocation() {
  try {
    // 检查缓存
    const cachedLocation = await WeatherCache.get(CACHE_KEYS.LOCATION);
    if (cachedLocation) {
      console.log('Using cached location');
      return cachedLocation;
    }

    // 如果没有缓存，获取新位置
    let location;
    
    // 首先尝试使用 Geolocation API
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60000
        });
      });
      
      location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
    } catch (error) {
      console.log('Geolocation failed, trying IP-based location...');
      
      // 尝试IP定位服务
      const ipServices = [
        'https://ip-api.com/json',
        'https://ipapi.co/json/',
        'https://freegeoip.app/json/'
      ];

      for (const service of ipServices) {
        try {
          const response = await fetch(service);
          const data = await response.json();
          location = {
            lat: data.latitude || data.lat,
            lon: data.longitude || data.lon,
            city: data.city,
            region: data.region_name || data.region
          };
          break;
        } catch (error) {
          continue;
        }
      }
    }

    // 如果所有方法都失败，使用默认位置
    if (!location) {
      location = DEFAULT_LOCATION;
    }

    // 缓存位置信息
    await WeatherCache.set(CACHE_KEYS.LOCATION, location, CACHE_TTL.LOCATION);
    return location;
  } catch (error) {
    console.error('Failed to get location:', error);
    return DEFAULT_LOCATION;
  }
}

// 修改获取天气信息函数，添加缓存
async function getWeather(lat, lon) {
  try {
    // 生成缓存键
    const cacheKey = `${CACHE_KEYS.WEATHER}_${lat}_${lon}`;
    
    // 检查缓存
    const cachedWeather = await WeatherCache.get(cacheKey);
    if (cachedWeather) {
      console.log('Using cached weather data');
      return cachedWeather;
    }

    // 如果没有缓存，依次尝试不同的天气API
    let weatherData;

    // 尝试 wttr.in
    try {
      const response = await fetch(WEATHER_APIS.wttr.getUrl(lat, lon));
      const data = await response.json();
      weatherData = {
        temp: Math.round(data.current_condition[0].temp_C),
        icon: WEATHER_ICONS[data.current_condition[0].weatherDesc[0].value] || WEATHER_ICONS.default,
        description: data.current_condition[0].weatherDesc[0].value,
        location: data.nearest_area[0].areaName[0].value
      };
    } catch (error) {
      console.error('wttr.in failed, trying HeFeng...', error);
    }

    // 如果 wttr.in 失败，尝试和风天气
    if (!weatherData) {
      try {
        const response = await fetch(WEATHER_APIS.hefeng.getUrl(lat, lon));
        const data = await response.json();
        if (data.code === '200') {
          weatherData = {
            temp: Math.round(parseFloat(data.now.temp)),
            icon: WEATHER_ICONS[data.now.text] || WEATHER_ICONS.default,
            description: data.now.text,
            location: data.now.city || `${lat.toFixed(2)},${lon.toFixed(2)}`
          };
        }
      } catch (error) {
        console.error('HeFeng weather failed, trying CaiYun...', error);
      }
    }

    // 如果和风天气也失败，尝试彩云天气
    if (!weatherData) {
      try {
        const response = await fetch(WEATHER_APIS.caiyun.getUrl(lat, lon));
        const data = await response.json();
        if (data.status === 'ok') {
          weatherData = {
            temp: Math.round(data.result.realtime.temperature),
            icon: WEATHER_ICONS[data.result.realtime.skycon] || WEATHER_ICONS.default,
            description: data.result.realtime.skycon,
            location: data.result.location || `${lat.toFixed(2)},${lon.toFixed(2)}`
          };
        }
      } catch (error) {
        console.error('CaiYun failed', error);
      }
    }

    // 如果所有API都失败，返回默认数据
    if (!weatherData) {
      weatherData = {
        temp: 'N/A',
        icon: 'wi-na',
        description: 'Weather unavailable',
        location: `${lat.toFixed(2)},${lon.toFixed(2)}`
      };
    }

    // 缓存天气数据
    await WeatherCache.set(cacheKey, weatherData, CACHE_TTL.WEATHER);
    return weatherData;
  } catch (error) {
    console.error('Weather fetch failed:', error);
    return {
      temp: 'N/A',
      icon: 'wi-na',
      description: 'Weather unavailable',
      location: `${lat.toFixed(2)},${lon.toFixed(2)}`
    };
  }
}

// 更新天气组件
function updateWeatherWidget(weatherData) {
  const widget = document.querySelector('.weather-widget');
  if (!widget) return;

  widget.classList.remove('weather-loading');
  widget.innerHTML = `
    <i class="weather-icon wi ${weatherData.icon}"></i>
    <div class="weather-info">
      <div class="weather-temp">${weatherData.temp === 'N/A' ? 'N/A' : `${weatherData.temp}°C`}</div>
      <div class="weather-location">${weatherData.location}</div>
    </div>
  `;

  // 添加工具提示
  widget.title = `${weatherData.description}\n${weatherData.location}`;
}

// 初始化天气组件函数
/* async function initWeather() {
  try {
    const location = await getLocation();
    const weather = await getWeather(location.lat, location.lon);
    updateWeatherWidget(weather);
    
    // 每30分钟更新一次天气（与缓存时间同步）
    setInterval(async () => {
      try {
        // 清除旧的缓存
        const cacheKey = `${CACHE_KEYS.WEATHER}_${location.lat}_${location.lon}`;
        await WeatherCache.clear(cacheKey);
        
        // 获取新的天气数据
        const weather = await getWeather(location.lat, location.lon);
        updateWeatherWidget(weather);
      } catch (error) {
        console.error('Failed to update weather:', error);
      }
    }, CACHE_TTL.WEATHER);
    
  } catch (error) {
    console.error('Weather initialization failed:', error);
    updateWeatherWidget({
      temp: 'N/A',
      icon: 'wi-na',
      description: 'Weather unavailable',
      location: 'Weather unavailable'
    });
  }
} */


// 修改初始化天气组件函数，添加智能更新逻辑
async function initWeather() {
  let retryCount = 0;
  let updateInterval = UPDATE_INTERVALS.NORMAL;
  let updateTimer = null;

  async function updateWeatherData() {
    try {
      const location = await getLocation();
      const weather = await getWeather(location.lat, location.lon);
      
      // 更新成功，重置重试计数和更新间隔
      retryCount = 0;
      updateInterval = UPDATE_INTERVALS.NORMAL;
      
      updateWeatherWidget(weather);
    } catch (error) {
      console.error('Weather update failed:', error);
      
      retryCount++;
      if (retryCount <= UPDATE_INTERVALS.MAX_RETRIES) {
        // 如果失败，缩短更新间隔进行重试
        updateInterval = UPDATE_INTERVALS.ERROR;
      } else {
        // 超过最大重试次数，恢复正常更新间隔
        retryCount = 0;
        updateInterval = UPDATE_INTERVALS.NORMAL;
      }
      
      updateWeatherWidget({
        temp: 'N/A',
        icon: 'wi-na',
        description: 'Weather unavailable',
        location: 'Retry in ' + Math.round(updateInterval/60000) + ' min'
      });
    }

    // 设置下次更新
    updateTimer = setTimeout(updateWeatherData, updateInterval);
  }

  // 首次更新
  await updateWeatherData();

  // 当标签页变为活动状态时更新天气
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // 清除现有定时器
      if (updateTimer) {
        clearTimeout(updateTimer);
      }
      // 立即更新天气
      updateWeatherData();
    }
  });

  // 添加手动刷新功能
  const widget = document.querySelector('.weather-widget');
  if (widget) {
    widget.addEventListener('click', async () => {
      // 添加刷新动画类
      widget.classList.add('refreshing');
      
      // 清除现有定时器
      if (updateTimer) {
        clearTimeout(updateTimer);
      }
      
      // 立即更新天气
      await updateWeatherData();
      
      // 移除刷新动画类
      setTimeout(() => {
        widget.classList.remove('refreshing');
      }, 1000);
    });
  }
}

// 添加刷新动画样式
// const style = document.createElement('style');
// style.textContent = `
//   @keyframes refresh-spin {
//     from { transform: rotate(0deg); }
//     to { transform: rotate(360deg); }
//   }

//   .weather-widget.refreshing .weather-icon {
//     animation: refresh-spin 1s linear;
//   }
// `;
// document.head.appendChild(style);

// 添加缓存清理函数
async function clearWeatherCache() {
  try {
    await WeatherCache.clear(CACHE_KEYS.LOCATION);
    const allData = await chrome.storage.local.get(null);
    const weatherKeys = Object.keys(allData).filter(key => 
      key.startsWith(CACHE_KEYS.WEATHER)
    );
    await Promise.all(weatherKeys.map(key => WeatherCache.clear(key)));
    console.log('Weather cache cleared successfully');
  } catch (error) {
    console.error('Failed to clear weather cache:', error);
  }
}

// 启动天气功能
document.addEventListener('DOMContentLoaded', () => {
  // 添加天气图标样式
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons.min.css';
  document.head.appendChild(link);

  // 初始化天气
  initWeather();
});