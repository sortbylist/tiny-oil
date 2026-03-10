// 主应用逻辑
let currentCity = 'shenzhen';

async function init() {
  loadCities();
  const savedCity = localStorage.getItem('selectedCity') || 'shenzhen';
  currentCity = savedCity;
  document.getElementById('city').value = savedCity;
  await loadOilPrice(savedCity);
}

function loadCities() {
  const select = document.getElementById('city');

  window.oilPriceData.cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city.id;
    option.textContent = city.name;
    select.appendChild(option);
  });

  select.addEventListener('change', async (e) => {
    currentCity = e.target.value;
    localStorage.setItem('selectedCity', currentCity);
    await loadOilPrice(currentCity);
  });
}

async function loadOilPrice(cityId) {
  const priceList = document.getElementById('price-list');
  priceList.innerHTML = '<div class="loading">加载中...</div>';

  try {
    const data = await getOilPrice(cityId);
    renderPrices(data);
    renderAdjustInfo(data);
    renderChart(data.history);
  } catch (error) {
    priceList.innerHTML = `
      <div class="error">
        数据加载失败，请检查网络连接
        <button class="retry-btn" onclick="loadOilPrice('${cityId}')">重试</button>
      </div>
    `;
  }
}

function renderPrices(data) {
  document.getElementById('price-date').textContent = `(${data.date})`;
  const priceList = document.getElementById('price-list');
  priceList.innerHTML = `
    <div class="price-item">
      <span class="price-label">92#</span>
      <span class="price-value">¥${data.prices.e92}/升</span>
    </div>
    <div class="price-item">
      <span class="price-label">95#</span>
      <span class="price-value">¥${data.prices.e95}/升</span>
    </div>
    <div class="price-item">
      <span class="price-label">98#</span>
      <span class="price-value">¥${data.prices.e98}/升</span>
    </div>
    <div class="price-item">
      <span class="price-label">0#柴油</span>
      <span class="price-value">¥${data.prices.e0}/升</span>
    </div>
  `;
}

function renderAdjustInfo(data) {
  const arrow = data.nextAdjust.prediction.startsWith('+') ? '↑' : '↓';
  const className = data.nextAdjust.prediction.startsWith('+') ? 'up' : 'down';
  document.getElementById('adjust-info').innerHTML = `
    <div class="adjust-date">📅 ${data.nextAdjust.date}</div>
    <div class="adjust-days">还有 ${data.nextAdjust.days} 天</div>
    <div class="adjust-prediction ${className}">预计 ${arrow} ${data.nextAdjust.prediction}元/升</div>
  `;
}

window.addEventListener('DOMContentLoaded', init);
