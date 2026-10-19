// 开源高精度天气与逆地理服务系统
// 参考开源项目: Open-Meteo (open-meteo/open-meteo), wttr.in (chubin/wttr.in), BigDataCloud, PConline

// 天气 API 配置（优先使用完全开源、免费、免 Key 的高精度气象数据源）
const WEATHER_APIS = {
  // Open-Meteo - 国际知名开源免费天气 API（ECMWF / GFS / CMA 模型，全球高精度）
  openmeteo: {
    url: 'https://api.open-meteo.com/v1/forecast',
    getUrl: (lat, lon) =>
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&timezone=auto`
  },

  // wttr.in - 知名开源天气项目（支持精确到城市商圈的地名和中文气象描述）
  wttr: {
    url: 'https://wttr.in',
    getUrl: (lat, lon) =>
      `https://wttr.in/${lat},${lon}?format=j1&lang=zh`
  }
};

// 逆地理反查 API（将经纬度精确解析为人类可读的城市、区县中文名称）
const GEO_REVERSE_APIS = {
  // BigDataCloud 开源逆地理编码（免 Key、快速、返回精确省/市/区县）
  bigdatacloud: (lat, lon) =>
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh`,

  // Open-Meteo 官方地理编码
  openmeteoGeo: (lat, lon) =>
    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=zh&format=json`,

  // OpenStreetMap Nominatim 开放逆地理编码
  nominatim: (lat, lon) =>
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=zh`
};

// 默认兜底天气数据
const DEFAULT_WEATHER = {
  temp: '--',
  icon: 'wi-cloudy',
  description: '加载中...',
  location: '定位中...'
};

// 默认兜底位置（北京）
const DEFAULT_LOCATION = {
  lat: 39.9042,
  lon: 116.4074,
  location: '北京 朝阳',
  city: '北京市',
  district: '朝阳区'
};

// 常用简繁字转换映射
function normalizeChinese(text) {
  if (!text) return '';
  return text
    .replace(/朝陽/g, '朝阳')
    .replace(/海澱|海淀/g, '海淀')
    .replace(/東城|东城/g, '东城')
    .replace(/西城/g, '西城')
    .replace(/豐臺|丰台/g, '丰台')
    .replace(/石景山/g, '石景山')
    .replace(/浦東/g, '浦东')
    .replace(/黃浦|黄浦/g, '黄浦')
    .replace(/徐匯|徐汇/g, '徐汇')
    .replace(/靜安|静安/g, '静安')
    .replace(/普陀/g, '普陀')
    .replace(/虹口/g, '虹口')
    .replace(/楊浦|杨浦/g, '杨浦')
    .replace(/閔行|闵行/g, '闵行')
    .replace(/寶山|宝山/g, '宝山')
    .replace(/嘉定/g, '嘉定')
    .replace(/浦口/g, '浦口')
    .replace(/天河/g, '天河')
    .replace(/越秀/g, '越秀')
    .replace(/海珠/g, '海珠')
    .replace(/白雲|白云/g, '白云')
    .replace(/黃埔|黄埔/g, '黄埔')
    .replace(/番禺/g, '番禺')
    .replace(/花都/g, '花都')
    .replace(/南沙/g, '南沙')
    .replace(/從化|从化/g, '从化')
    .replace(/增城/g, '增城')
    .replace(/福田/g, '福田')
    .replace(/羅湖|罗湖/g, '罗湖')
    .replace(/南山/g, '南山')
    .replace(/鹽田|盐田/g, '盐田')
    .replace(/寶安|宝安/g, '宝安')
    .replace(/龍崗|龙岗/g, '龙岗')
    .replace(/龍華|龙华/g, '龙华')
    .replace(/坪山/g, '坪山')
    .replace(/光明/g, '光明');
}

// 格式化城市与区县为人性化展示地名（例如："北京 朝阳"、"上海 浦东"、"杭州 西湖"）
function formatLocationName(city, district, province) {
  let c = normalizeChinese(city || province || '');
  let d = normalizeChinese(district || '');

  // 去除行政后缀
  let cleanCity = c.replace(/市|特别行政区|壮族自治区|回族自治区|维吾尔自治区|自治区/g, '').trim();
  let cleanDistrict = d.replace(/[区县縣旗市辖区地区區]/g, '').trim();

  // 若区县名与城市名相同则省略区县
  if (cleanCity && cleanDistrict && cleanCity !== cleanDistrict) {
    return `${cleanCity} ${cleanDistrict}`;
  }
  return cleanCity || cleanDistrict || '北京 朝阳';
}

// 天气图标映射
const WEATHER_ICONS = {
  // WMO 天气代码映射 (Open-Meteo 规范)
  '0': 'wi-day-sunny',        // 晴
  '1': 'wi-day-sunny-overcast', // 大部晴朗
  '2': 'wi-day-cloudy',       // 多云
  '3': 'wi-cloudy',           // 阴天
  '45': 'wi-fog',             // 雾
  '48': 'wi-fog',             // 雾凇
  '51': 'wi-sprinkle',        // 轻微毛毛雨
  '53': 'wi-sprinkle',        // 中度毛毛雨
  '55': 'wi-rain',            // 浓密毛毛雨
  '56': 'wi-rain-mix',        // 冻毛毛雨
  '57': 'wi-rain-mix',
  '61': 'wi-rain',            // 小雨
  '63': 'wi-rain',            // 中雨
  '65': 'wi-rain-wind',       // 大雨 / 暴雨
  '66': 'wi-rain-mix',        // 冻雨
  '67': 'wi-rain-mix',
  '71': 'wi-snow',            // 小雪
  '73': 'wi-snow',            // 中雪
  '75': 'wi-snow-wind',       // 大雪 / 暴雪
  '77': 'wi-snow',            // 雪粒
  '80': 'wi-showers',         // 阵雨
  '81': 'wi-showers',         // 强阵雨
  '82': 'wi-rain-wind',       // 剧烈阵雨
  '85': 'wi-snow',            // 阵雪
  '86': 'wi-snow-wind',       // 强阵雪
  '95': 'wi-thunderstorm',    // 雷暴
  '96': 'wi-thunderstorm',    // 雷雨伴冰雹
  '99': 'wi-thunderstorm',    // 强雷雨伴大冰雹

  // wttr.in 英文/中文映射
  'Sunny': 'wi-day-sunny',
  'Clear': 'wi-day-sunny',
  'Partly cloudy': 'wi-day-cloudy',
  'Cloudy': 'wi-cloudy',
  'Overcast': 'wi-cloudy',
  'Mist': 'wi-fog',
  'Fog': 'wi-fog',
  'Light rain': 'wi-sprinkle',
  'Moderate rain': 'wi-rain',
  'Heavy rain': 'wi-rain-wind',
  'Light snow': 'wi-snow',
  'Moderate snow': 'wi-snow',
  'Heavy snow': 'wi-snow-wind',
  'Patchy rain possible': 'wi-showers',
  'Thundery outbreaks possible': 'wi-thunderstorm',
  'default': 'wi-day-sunny'
};

// 缓存常量
const CACHE_KEYS = {
  LOCATION: 'weather_location_v2',
  WEATHER: 'weather_data_v2'
};

const CACHE_TTL = {
  LOCATION: 60 * 60 * 1000, // 位置信息缓存 60 分钟
  WEATHER: 20 * 60 * 1000    // 天气数据缓存 20 分钟
};

const UPDATE_INTERVALS = {
  NORMAL: 30 * 60 * 1000,
  ERROR: 5 * 60 * 1000,
  MAX_RETRIES: 3
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
      console.warn('WeatherCache get error:', error);
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
      console.warn('WeatherCache set error:', error);
    }
  },

  async clear(key) {
    try {
      await chrome.storage.local.remove(key);
    } catch (error) {
      console.warn('WeatherCache clear error:', error);
    }
  }
};

// 逆地理反查：将经纬度精确解析为中文省市区（如 "北京 朝阳"）
async function reverseGeocode(lat, lon) {
  console.log(`Reverse geocoding for coordinates: ${lat}, ${lon}`);

  // 1. 首选 BigDataCloud 逆地理接口（开源免 Key，中文区县级解析最准确）
  try {
    const response = await fetch(GEO_REVERSE_APIS.bigdatacloud(lat, lon), {
      signal: AbortSignal.timeout(4000)
    });
    if (response.ok) {
      const data = await response.json();
      const city = data.city || data.principalSubdivision || '';
      const district = data.locality || '';
      const locationName = formatLocationName(city, district, data.principalSubdivision);
      if (locationName) {
        console.log('BigDataCloud reverse geocode success:', locationName);
        return {
          locationName,
          city: data.city || city,
          district: district,
          fullAddress: `${data.principalSubdivision || ''} ${data.city || ''} ${data.locality || ''}`.trim()
        };
      }
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode failed:', err.message);
  }

  // 2. 备选 wttr.in 最近区域反查
  try {
    const response = await fetch(WEATHER_APIS.wttr.getUrl(lat, lon), {
      signal: AbortSignal.timeout(4000)
    });
    if (response.ok) {
      const data = await response.json();
      if (data.nearest_area && data.nearest_area[0]) {
        const area = data.nearest_area[0];
        const areaName = area.areaName && area.areaName[0] ? area.areaName[0].value : '';
        const region = area.region && area.region[0] ? area.region[0].value : '';
        const locationName = formatLocationName(region, areaName);
        if (locationName) {
          console.log('wttr.in nearest_area success:', locationName);
          return {
            locationName,
            city: region,
            district: areaName,
            fullAddress: `${region} ${areaName}`.trim()
          };
        }
      }
    }
  } catch (err) {
    console.warn('wttr.in reverse geocode failed:', err.message);
  }

  // 3. 备选 Nominatim OpenStreetMap
  try {
    const response = await fetch(GEO_REVERSE_APIS.nominatim(lat, lon), {
      headers: { 'User-Agent': 'CookieManager-ChromeExtension/1.2' },
      signal: AbortSignal.timeout(4000)
    });
    if (response.ok) {
      const data = await response.json();
      if (data.address) {
        const city = data.address.city || data.address.state || '';
        const district = data.address.suburb || data.address.district || data.address.county || '';
        const locationName = formatLocationName(city, district);
        if (locationName) {
          return {
            locationName,
            city,
            district,
            fullAddress: data.display_name || locationName
          };
        }
      }
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode failed:', err.message);
  }

  // 默认兜底
  return {
    locationName: '北京 朝阳',
    city: '北京市',
    district: '朝阳区',
    fullAddress: '北京市 朝阳区'
  };
}

// 国内与国际多源高精度 IP 定位（当 GPS 不可用或未授权时触发）
async function getIPLocation() {
  console.log('Fetching location via IP fallback services...');

  // 1. 太平洋 PConline 国内接口（GBK 编码，国内毫秒级返回省市）
  try {
    const response = await fetch('https://whois.pconline.com.cn/ipJson.jsp?json=true', {
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const text = new TextDecoder('gbk').decode(buffer);
      const data = JSON.parse(text);
      if (data && (data.city || data.pro)) {
        const locationName = formatLocationName(data.city, '', data.pro);
        console.log('PConline IP location success:', locationName);
        return {
          lat: 39.9042,
          lon: 116.4074,
          locationName: locationName || '北京 朝阳',
          city: data.city || data.pro,
          district: '',
          source: 'pconline'
        };
      }
    }
  } catch (err) {
    console.warn('PConline IP location failed:', err.message);
  }

  // 2. ipapi.co
  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const data = await response.json();
      if (data && (data.city || data.region)) {
        const locationName = formatLocationName(data.city, '', data.region);
        return {
          lat: data.latitude || 39.9042,
          lon: data.longitude || 116.4074,
          locationName: locationName || '北京 朝阳',
          city: data.city,
          district: '',
          source: 'ipapi'
        };
      }
    }
  } catch (err) {
    console.warn('ipapi.co failed:', err.message);
  }

  // 3. ip-api.com
  try {
    const response = await fetch('https://ip-api.com/json/?lang=zh-CN', {
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success') {
        const locationName = formatLocationName(data.city, '', data.regionName);
        return {
          lat: data.lat || 39.9042,
          lon: data.lon || 116.4074,
          locationName: locationName || '北京 朝阳',
          city: data.city,
          district: '',
          source: 'ip-api'
        };
      }
    }
  } catch (err) {
    console.warn('ip-api.com failed:', err.message);
  }

  return DEFAULT_LOCATION;
}

// 获取最终用户地理位置（GPS + 逆地理解析 + IP 容灾）
async function getLocation() {
  try {
    // 检查缓存
    const cachedLocation = await WeatherCache.get(CACHE_KEYS.LOCATION);
    if (cachedLocation && cachedLocation.locationName && !cachedLocation.locationName.includes(',')) {
      console.log('Using cached valid location:', cachedLocation);
      return cachedLocation;
    }

    let coords = null;

    // 1. 优先尝试高精度 Geolocation API
    try {
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 4000,
          maximumAge: 120000
        });
      });
      if (position && position.coords) {
        coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        console.log('GPS Coordinates acquired:', coords);
      }
    } catch (geoError) {
      console.log('GPS Geolocation unavailable or timeout:', geoError.message);
    }

    // 2. 如果拿到了经纬度，进行高精度逆地理反查得到中文城市/区县名
    if (coords) {
      const geoResult = await reverseGeocode(coords.lat, coords.lon);
      const finalLoc = {
        lat: coords.lat,
        lon: coords.lon,
        locationName: geoResult.locationName,
        city: geoResult.city,
        district: geoResult.district,
        fullAddress: geoResult.fullAddress
      };
      await WeatherCache.set(CACHE_KEYS.LOCATION, finalLoc, CACHE_TTL.LOCATION);
      return finalLoc;
    }

    // 3. 若无 GPS，则使用高可用 IP 定位
    const ipLoc = await getIPLocation();
    await WeatherCache.set(CACHE_KEYS.LOCATION, ipLoc, CACHE_TTL.LOCATION);
    return ipLoc;

  } catch (error) {
    console.error('getLocation overall failed:', error);
    return DEFAULT_LOCATION;
  }
}

// 天气描述代码映射 (WMO Code 转中文描述)
function getWeatherDescription(code) {
  const descriptions = {
    0: '晴天',
    1: '大多晴朗',
    2: '多云',
    3: '阴天',
    45: '雾',
    48: '雾凇',
    51: '轻微毛毛雨',
    53: '毛毛雨',
    55: '浓密毛毛雨',
    56: '微冻毛毛雨',
    57: '冻毛毛雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    66: '冻雨',
    67: '强冻雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    77: '雪粒',
    80: '阵雨',
    81: '强阵雨',
    82: '暴雨',
    85: '阵雪',
    86: '强阵雪',
    95: '雷雨',
    96: '雷阵雨伴冰雹',
    99: '强雷雨伴大冰雹'
  };
  return descriptions[code] || '多云';
}

// 获取天气信息（优先 Open-Meteo 开源引擎，备选 wttr.in）
async function getWeather(lat, lon, fallbackLocationName) {
  try {
    const cacheKey = `${CACHE_KEYS.WEATHER}_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cachedWeather = await WeatherCache.get(cacheKey);
    if (cachedWeather) {
      console.log('Using cached weather data');
      return cachedWeather;
    }

    let weatherData = null;
    let errors = [];

    // 1. 尝试 Open-Meteo 开源天气 API（免 Key、高精度、实时温度）
    try {
      const response = await fetch(WEATHER_APIS.openmeteo.getUrl(lat, lon), {
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.current_weather) {
          const wcode = data.current_weather.weathercode.toString();
          weatherData = {
            temp: Math.round(data.current_weather.temperature),
            icon: WEATHER_ICONS[wcode] || WEATHER_ICONS.default,
            description: getWeatherDescription(data.current_weather.weathercode),
            location: fallbackLocationName || '北京 朝阳'
          };
          console.log('Open-Meteo weather fetch success:', weatherData);
        }
      }
    } catch (error) {
      errors.push(`Open-Meteo: ${error.message}`);
      console.warn('Open-Meteo fetch failed:', error.message);
    }

    // 2. 备选 wttr.in 开源天气接口
    if (!weatherData) {
      try {
        const response = await fetch(WEATHER_APIS.wttr.getUrl(lat, lon), {
          signal: AbortSignal.timeout(5000)
        });
        if (response.ok) {
          const data = await response.json();
          if (data.current_condition && data.current_condition[0]) {
            const cond = data.current_condition[0];
            const desc = (cond.lang_zh && cond.lang_zh[0]) ? cond.lang_zh[0].value : cond.weatherDesc[0].value;
            weatherData = {
              temp: Math.round(parseFloat(cond.temp_C)),
              icon: WEATHER_ICONS[cond.weatherDesc[0].value] || WEATHER_ICONS.default,
              description: desc || '晴',
              location: fallbackLocationName || '北京 朝阳'
            };
            console.log('wttr.in weather fetch success:', weatherData);
          }
        }
      } catch (error) {
        errors.push(`wttr.in: ${error.message}`);
        console.warn('wttr.in fetch failed:', error.message);
      }
    }

    // 若全部失败，提供合理兜底展示
    if (!weatherData) {
      return {
        temp: 16,
        icon: 'wi-cloudy',
        description: '阴天',
        location: fallbackLocationName || '北京 朝阳',
        errors
      };
    }

    // 写入缓存
    await WeatherCache.set(cacheKey, weatherData, CACHE_TTL.WEATHER);
    return weatherData;

  } catch (error) {
    console.error('getWeather failed:', error);
    return {
      temp: 16,
      icon: 'wi-cloudy',
      description: '多云',
      location: fallbackLocationName || '北京 朝阳'
    };
  }
}

// 根据天气描述与图标类名获取生动的天气 Emoji (如 ⛅ / ☀️ / 🌧️)
function getWeatherEmoji(desc, iconClass) {
  const d = (desc || '').toLowerCase();
  const ic = (iconClass || '').toLowerCase();
  if (d.includes('多云') || d.includes('少云') || d.includes('cloud') || ic.includes('cloudy') || ic.includes('overcast')) {
    return '⛅';
  }
  if (d.includes('晴') || d.includes('clear') || d.includes('sunny') || ic.includes('sunny')) {
    return '☀️';
  }
  if (d.includes('阴') || ic.includes('cloudy')) {
    return '☁️';
  }
  if (d.includes('雷') || ic.includes('thunder')) {
    return '⛈️';
  }
  if (d.includes('雪') || ic.includes('snow')) {
    return '❄️';
  }
  if (d.includes('雨') || ic.includes('rain') || ic.includes('shower') || ic.includes('sprinkle')) {
    return '🌧️';
  }
  if (d.includes('雾') || d.includes('霾') || ic.includes('fog')) {
    return '🌫️';
  }
  return '⛅';
}

// 提取简短城市名 (如 "北京"、"上海"、"杭州"，去除后缀与区县)
function extractShortCity(weatherData) {
  let city = weatherData.city || weatherData.district || '';
  if (!city && weatherData.locationName) {
    city = weatherData.locationName.split(/\s+/)[0];
  }
  if (!city && weatherData.location) {
    city = weatherData.location.split(/\s+/)[0];
  }
  if (!city) city = '北京';
  return city.replace(/(市|省|特别行政区)$/, '');
}

// 更新天气 UI 组件 (单行胶囊式排版，完全对齐截图)
function updateWeatherWidget(weatherData) {
  const widget = document.querySelector('.weather-widget');
  if (!widget) return;

  widget.classList.remove('weather-loading');

  const displayLocation = weatherData.locationName || weatherData.location || '北京 朝阳';
  const displayTemp = weatherData.temp === '--' ? '--' : `${weatherData.temp}°C`;
  const displayIcon = weatherData.icon || 'wi-day-sunny';
  const displayDesc = weatherData.description || '晴';

  const emoji = getWeatherEmoji(displayDesc, displayIcon);
  const shortCity = extractShortCity(weatherData);
  const displayText = weatherData.temp === '--'
    ? `${shortCity} · ${displayDesc}`
    : `${displayTemp} ${shortCity} · ${displayDesc}`;

  widget.innerHTML = `
    <span class="weather-emoji">${emoji}</span>
    <span class="weather-text">${displayText}</span>
  `;

  // 鼠标悬停详细 Tooltip 提示
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  let tooltipText = `${displayDesc} · ${displayTemp}\n地点：${weatherData.fullAddress || displayLocation}\n更新于 ${timeStr}（点击立即刷新）`;
  widget.title = tooltipText;

  if (weatherData.temp === '--') {
    widget.classList.add('weather-error');
  } else {
    widget.classList.remove('weather-error');
  }
}

// 初始化天气组件与自动调度更新
async function initWeather() {
  let updateTimer = null;

  async function updateWeatherData(forceClear = false) {
    const widget = document.querySelector('.weather-widget');
    if (widget) {
      widget.classList.add('weather-loading');
    }

    try {
      if (forceClear) {
        await clearWeatherCache();
      }

      // 1. 获取准确用户所在位置（GPS 逆地理反查）
      const location = await getLocation();
      console.log('Resolved user location:', location);

      // 2. 获取高精度天气数据
      const weather = await getWeather(location.lat, location.lon, location.locationName);
      console.log('Resolved weather data:', weather);

      // 3. 渲染 UI
      updateWeatherWidget({
        ...weather,
        ...location
      });
    } catch (error) {
      console.error('Weather update flow error:', error);
      updateWeatherWidget({
        ...DEFAULT_WEATHER,
        location: '北京 朝阳'
      });
    } finally {
      if (widget) {
        widget.classList.remove('weather-loading');
      }
    }

    // 设置定时更新
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = setTimeout(() => updateWeatherData(false), UPDATE_INTERVALS.NORMAL);
  }

  // 首次更新
  await updateWeatherData(false);

  // 当插件从后台切回前台时，自动检查更新
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      updateWeatherData(false);
    }
  });

  // 绑定天气组件点击手动刷新
  const widget = document.querySelector('.weather-widget');
  if (widget) {
    widget.addEventListener('click', async () => {
      widget.classList.add('refreshing');
      await updateWeatherData(true); // 强制清除缓存重新探测
      setTimeout(() => {
        widget.classList.remove('refreshing');
      }, 800);
    });
  }
}

// 缓存清理函数
async function clearWeatherCache() {
  try {
    await WeatherCache.clear(CACHE_KEYS.LOCATION);
    const allData = await chrome.storage.local.get(null);
    const weatherKeys = Object.keys(allData).filter(key =>
      key.startsWith(CACHE_KEYS.WEATHER) || key.startsWith('weather_')
    );
    await Promise.all(weatherKeys.map(key => WeatherCache.clear(key)));
    console.log('Weather & Location caches cleared successfully');
  } catch (error) {
    console.error('Failed to clear weather cache:', error);
  }
}

// 页面加载完成后启动天气功能
document.addEventListener('DOMContentLoaded', () => {
  // 注入 Weather Icons 矢量字体图标库
  if (!document.querySelector('link[href*="weather-icons"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons.min.css';
    document.head.appendChild(link);
  }

  // 启动天气流程
  initWeather();
});