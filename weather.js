// 天气 API 配置
const WEATHER_APIS = {
  // OpenWeatherMap - 免费版每分钟60次调用
  openweather: {
    key: '7c932b4d6d8f4cce4b6876d54b962633', // 免费公共key
    getUrl: (lat, lon) => 
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=7c932b4d6d8f4cce4b6876d54b962633&units=metric&lang=zh_cn`
  },

  // OpenMeteo - 完全免费，无需key
  openmeteo: {
    url: 'https://api.open-meteo.com/v1',
    getUrl: (lat, lon) =>
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
  },

  // 中国气象局 - 公开数据
  cma: {
    url: 'http://www.weather.com.cn',
    getUrl: (lat, lon) =>
      `http://www.weather.com.cn/data/sk/${getCityCodeByLocation(lat, lon)}.html`
  },
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

// 添加默认天气数据
const DEFAULT_WEATHER = {
  temp: '--',
  icon: 'wi-cloudy',
  description: '加载中...',
  location: '正在获取位置...'
};

// 扩展天气图标映射
const WEATHER_ICONS = {
  // OpenWeatherMap icons
  '01d': 'wi-day-sunny',
  '01n': 'wi-night-clear',
  '02d': 'wi-day-cloudy',
  '02n': 'wi-night-alt-cloudy',
  '03d': 'wi-cloud',
  '03n': 'wi-cloud',
  '04d': 'wi-cloudy',
  '04n': 'wi-cloudy',
  '09d': 'wi-showers',
  '09n': 'wi-showers',
  '10d': 'wi-day-rain',
  '10n': 'wi-night-alt-rain',
  '11d': 'wi-thunderstorm',
  '11n': 'wi-thunderstorm',
  '13d': 'wi-snow',
  '13n': 'wi-snow',
  '50d': 'wi-fog',
  '50n': 'wi-fog',
  
  // OpenMeteo codes
  '0': 'wi-day-sunny',        // Clear sky
  '1': 'wi-day-cloudy',       // Mainly clear
  '2': 'wi-cloudy',           // Partly cloudy
  '3': 'wi-cloud',            // Overcast
  '45': 'wi-fog',             // Foggy
  '48': 'wi-fog',             // Depositing rime fog
  '51': 'wi-sprinkle',        // Light drizzle
  '53': 'wi-sprinkle',        // Moderate drizzle
  '55': 'wi-rain',            // Dense drizzle
  '61': 'wi-rain',            // Slight rain
  '63': 'wi-rain',            // Moderate rain
  '65': 'wi-rain-wind',       // Heavy rain
  '71': 'wi-snow',            // Slight snow fall
  '73': 'wi-snow',            // Moderate snow fall
  '75': 'wi-snow-wind',       // Heavy snow fall
  '77': 'wi-snow',            // Snow grains
  '80': 'wi-showers',         // Slight rain showers
  '81': 'wi-showers',         // Moderate rain showers
  '82': 'wi-rain-wind',       // Violent rain showers
  '85': 'wi-snow',            // Slight snow showers
  '86': 'wi-snow-wind',       // Heavy snow showers
  '95': 'wi-thunderstorm',    // Thunderstorm
  '96': 'wi-thunderstorm',    // Thunderstorm with slight hail
  '99': 'wi-thunderstorm',    // Thunderstorm with heavy hail
  
  // 通用
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
  location: 'Beijing',
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
    console.log('Getting location...');
    // 检查缓存
    const cachedLocation = await WeatherCache.get(CACHE_KEYS.LOCATION);
    if (cachedLocation) {
      console.log('Using cached location');
      return cachedLocation;
    }

    // 如果没有缓存，获取新位置
    let location;
    
    // 1. 首先尝试IP定位服务
    console.log('Trying IP-based location services...');

    const ipServices = [
      'https://ip-api.com/json',
      'https://ipapi.co/json/',
      'https://freegeoip.app/json/'
    ];

    for (const service of ipServices) {
      try {
        const response = await fetch(service);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        const data = await response.json();
        location = {
          lat: data.latitude || data.lat,
          lon: data.longitude || data.lon,
          location: data.city || data.region_name || data.region,
          city: data.city,
          region: data.region_name || data.region
        };
      console.log(`IP location success from ${service}:`, location);
        break;
      } catch (error) {
      console.log(`IP location failed from ${service}:`, error.message);
        continue;
      }
    }

    // 2. 如果IP定位失败，尝试使用 Geolocation API
    if (!location) {
      console.log('IP location failed, trying Geolocation API...');
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
        console.log('Geolocation API success:', location);
      } catch (error) {
        console.log('Geolocation API failed:', error.message);
      }
    }

    // 3. 如果所有方法都失败，使用默认位置
    if (!location) {
      console.log('All location services failed, using default location');
      location = DEFAULT_LOCATION;
    }

    // 补充城市信息（如果没有）
    if (!location.city && location !== DEFAULT_LOCATION) {
      try {
        // 使用 OpenWeatherMap 的地理编码 API 获取城市名
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${location.lat}&lon=${location.lon}&limit=1&appid=${WEATHER_APIS.openweather.key}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data[0]) {
            location.city = data[0].name;
            location.country = data[0].country;
          }
        }
      } catch (error) {
        console.log('Failed to get city name:', error.message);
      }
    }

    console.log('Final location:', location);

    // 缓存位置信息
    await WeatherCache.set(CACHE_KEYS.LOCATION, location, CACHE_TTL.LOCATION);
    return location;
  } catch (error) {
    console.error('Failed to get location:', error);
    return DEFAULT_LOCATION;
  }
}

// 添加天气代码描述转换函数
function getWeatherDescription(code) {
  const descriptions = {
    0: '晴天',
    1: '多云',
    2: '阴天',
    3: '阴天',
    45: '雾',
    48: '雾凇',
    51: '小毛毛雨',
    53: '毛毛雨',
    55: '大毛毛雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    77: '雪粒',
    80: '阵雨',
    81: '阵雨',
    82: '暴雨',
    85: '阵雪',
    86: '大阵雪',
    95: '雷雨',
    96: '雷阵雨伴有冰雹',
    99: '强雷阵雨伴有冰雹'
  };
  
  return descriptions[code] || '未知天气';
}

// 修改获取天气信息函数，添加缓存
// 修改 getWeather 函数中的 fetch 请求部分
async function getWeather(lat, lon) {
  try {
    const cacheKey = `${CACHE_KEYS.WEATHER}_${lat}_${lon}`;
    
    const cachedWeather = await WeatherCache.get(cacheKey);
    if (cachedWeather) {
      console.log('Using cached weather data');
      return cachedWeather;
    }

    let weatherData = null;
    let errors = [];

    // 添加通用的 fetch 选项
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Origin': chrome.runtime.getURL(''),
      },
      mode: 'cors'
    };

    // 1. 尝试 OpenMeteo API (最稳定)
    if (!weatherData) {
      try {
        const response = await fetch(WEATHER_APIS.openmeteo.getUrl(lat, lon), fetchOptions);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        weatherData = {
          temp: Math.round(data.current_weather.temperature),
          icon: WEATHER_ICONS[data.current_weather.weathercode.toString()] || WEATHER_ICONS.default,
          description: getWeatherDescription(data.current_weather.weathercode),
          location: `${lat.toFixed(2)},${lon.toFixed(2)}`
        };
      } catch (error) {
        errors.push(`OpenMeteo: ${error.message}`);
        console.error('OpenMeteo failed:', error);
      }
    }

    // 2. 尝试 OpenWeatherMap API
    if (!weatherData) {
      try {
        const response = await fetch(WEATHER_APIS.openweather.getUrl(lat, lon), fetchOptions);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        weatherData = {
          temp: Math.round(data.main.temp),
          icon: WEATHER_ICONS[data.weather[0].icon] || WEATHER_ICONS.default,
          description: data.weather[0].description,
          location: data.name || `${lat.toFixed(2)},${lon.toFixed(2)}`
        };
      } catch (error) {
        errors.push(`OpenWeatherMap: ${error.message}`);
        console.error('OpenWeatherMap failed:', error);
      }
    }

    // 3. 尝试 wttr.in
    if (!weatherData) {
      try {
        const response = await fetch(WEATHER_APIS.wttr.getUrl(lat, lon), {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            'User-Agent': 'Mozilla/5.0 Chrome Extension'
          }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        weatherData = {
          temp: Math.round(data.current_condition[0].temp_C),
          icon: WEATHER_ICONS[data.current_condition[0].weatherDesc[0].value] || WEATHER_ICONS.default,
          description: data.current_condition[0].weatherDesc[0].value,
          location: data.nearest_area[0].areaName[0].value || `${lat.toFixed(2)},${lon.toFixed(2)}`
        };
      } catch (error) {
        errors.push(`wttr.in: ${error.message}`);
        console.error('wttr.in failed:', error);
      }
    }

    // 4. 尝试和风天气
    if (!weatherData) {
      try {
        const response = await fetch(WEATHER_APIS.hefeng.getUrl(lat, lon), fetchOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.code === '200') {
          weatherData = {
            temp: Math.round(parseFloat(data.now.temp)),
            icon: WEATHER_ICONS[data.now.text] || WEATHER_ICONS.default,
            description: data.now.text,
            location: data.now.city || `${lat.toFixed(2)},${lon.toFixed(2)}`
          };
        } else {
          throw new Error(`API error: ${data.code}`);
        }
      } catch (error) {
        errors.push(`HeFeng: ${error.message}`);
        console.error('HeFeng weather failed:', error);
      }
    }

    // 5. 尝试彩云天气
    if (!weatherData) {
      try {
        const response = await fetch(WEATHER_APIS.caiyun.getUrl(lat, lon), fetchOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.status === 'ok') {
          weatherData = {
            temp: Math.round(data.result.realtime.temperature),
            icon: WEATHER_ICONS[data.result.realtime.skycon] || WEATHER_ICONS.default,
            description: data.result.realtime.skycon,
            location: data.result.location || `${lat.toFixed(2)},${lon.toFixed(2)}`
          };
        } else {
          throw new Error(`API error: ${data.status}`);
        }
      } catch (error) {
        errors.push(`CaiYun: ${error.message}`);
        console.error('CaiYun failed:', error);
      }
    }

    // 如果所有 API 都失败
    if (!weatherData) {
      const errorData = {
        ...DEFAULT_WEATHER,
        description: '暂时无法获取天气',
        location: `${lat.toFixed(2)},${lon.toFixed(2)}`,
        errors: errors
      };
      
      // 缓存错误状态，但使用较短的缓存时间
      await WeatherCache.set(cacheKey, errorData, 5 * 60 * 1000); // 5分钟
      return errorData;
    }

    // 缓存成功获取的天气数据
    await WeatherCache.set(cacheKey, weatherData, CACHE_TTL.WEATHER);
    return weatherData;

  } catch (error) {
    console.error('Weather fetch failed:', error);
    return {
      ...DEFAULT_WEATHER,
      description: '天气数据获取失败',
      location: `${lat.toFixed(2)},${lon.toFixed(2)}`,
      error: error.message
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
      <div class="weather-temp">${weatherData.temp === '--' ? '--' : `${weatherData.temp}°C`}</div>
      <div class="weather-location">${weatherData.location}</div>
    </div>
  `;

  // 添加详细的工具提示
  let tooltipText = `${weatherData.description}\n${weatherData.location}`;
  if (weatherData.errors) {
    tooltipText += '\n\n获取失败原因：\n' + weatherData.errors.join('\n');
  }
  widget.title = tooltipText;

  // 如果是错误状态，添加视觉提示
  if (weatherData.temp === '--' || weatherData.error) {
    widget.classList.add('weather-error');
  } else {
    widget.classList.remove('weather-error');
  }
}

// 添加错误状态样式
const errorStyle = document.createElement('style');
errorStyle.textContent = `
  .weather-widget.weather-error {
    opacity: 0.7;
  }
  
  .weather-widget.weather-error:hover {
    opacity: 1;
  }

  .weather-widget.weather-error .weather-temp {
    color: #999;
  }

  .weather-widget.weather-error .weather-location {
    font-size: 0.9em;
    color: #666;
  }
`;
document.head.appendChild(errorStyle);


// 修改初始化天气组件函数，添加智能更新逻辑
async function initWeather() {
  let retryCount = 0;
  let updateInterval = UPDATE_INTERVALS.NORMAL;
  let updateTimer = null;

  async function updateWeatherData() {
    try {
      const location = await getLocation();
      const weather = await getWeather(location.lat, location.lon);

      console.log('Updating location data ...', location);
      console.log('Updating weather data ...', weather);
      
      // 更新成功，重置重试计数和更新间隔
      retryCount = 0;
      updateInterval = UPDATE_INTERVALS.NORMAL;
      
      updateWeatherWidget({
        ...weather,
        ...location,
      });
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
        ...DEFAULT_WEATHER,
        description: 'Weather unavailable',
        location: 'Retry in ' + Math.round(updateInterval/60000) + ' min',
        error: error.message || 'Unknown error'
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