// 缓存工具函数
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function setCache(key, data, ttl) {
  const item = {
    data: data,
    expiry: Date.now() + ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getCache(key) {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const parsed = JSON.parse(item);
  if (Date.now() > parsed.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.data;
}

// API 调用封装
async function fetchFromAPI(cityId) {
  // 使用 data.js 中的模拟数据
  const cityData = window.oilPriceData.mockPrices[cityId];

  // 处理 nextAdjust：计算剩余天数，过期则不返回
  let nextAdjust = null;
  if (window.oilPriceData.nextAdjust) {
    const today = new Date(getTodayDate());
    const adjustDate = new Date(window.oilPriceData.nextAdjust.date);

    const days = Math.ceil((adjustDate - today) / (1000 * 60 * 60 * 24));

    if (days > 0) {
      nextAdjust = {
        ...window.oilPriceData.nextAdjust,
        days
      };
    }
  }

  const mockData = {
    city: cityId,
    date: getTodayDate(),
    prices: cityData.prices,
    nextAdjust,
    history: cityData.history.slice(-10)
  };

  return new Promise(resolve => setTimeout(() => resolve(mockData), 500));
}

async function getOilPrice(cityId) {
  const cacheKey = `oilPrice_${cityId}_${getTodayDate()}`;
  const cached = getCache(cacheKey);

  if (cached) return cached;

  try {
    const data = await fetchFromAPI(cityId);
    setCache(cacheKey, data, 3600000); // 1小时
    return data;
  } catch (error) {
    const oldCache = localStorage.getItem(cacheKey);
    if (oldCache) return JSON.parse(oldCache).data;
    throw error;
  }
}
