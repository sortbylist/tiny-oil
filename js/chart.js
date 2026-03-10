// 图表渲染 (uPlot)
let chartInstance = null;

function renderChart(history) {
  const container = document.getElementById('price-chart');

  if (chartInstance) {
    chartInstance.destroy();
    container.innerHTML = '';
  }

  // 根据容器宽度动态计算显示的数据点数量
  const containerWidth = container.offsetWidth || 320;
  const pointWidth = 70; // 每个数据点约占70px
  const maxPoints = Math.max(5, Math.min(10, Math.floor(containerWidth / pointWidth)));
  const displayHistory = history.slice(-maxPoints);

  const timestamps = displayHistory.map(item => new Date(item.date).getTime() / 1000);
  const data92 = displayHistory.map(item => item.e92);
  const data95 = displayHistory.map(item => item.e95);

  const opts = {
    width: container.offsetWidth || 320,
    height: 260,
    cursor: { show: true },
    legend: { show: true },
    series: [
      {
        label: '日期',
        value: (u, v) => {
          if (v == null) return '--';
          const d = new Date(v * 1000);
          return `${d.getFullYear()}年${String(d.getMonth()+1).padStart(2,'0')}月${String(d.getDate()).padStart(2,'0')}日`;
        }
      },
      {
        label: '92#',
        stroke: '#2196F3',
        width: 2,
        fill: 'rgba(33,150,243,0.08)'
      },
      {
        label: '95#',
        stroke: '#FF9800',
        width: 2,
        fill: 'rgba(255,152,0,0.08)'
      }
    ],
    axes: [
      {
        stroke: '#666',
        ticks: { stroke: '#eee' },
        grid: { stroke: '#eee' }
      },
      {
        stroke: '#666',
        ticks: { stroke: '#eee' },
        grid: { stroke: 'rgba(0,0,0,0.05)' },
        values: (u, vals) => vals.map(v => v != null ? '¥' + v.toFixed(2) : '')
      }
    ]
  };

  chartInstance = new uPlot(opts, [timestamps, data92, data95], container);
}

// 窗口大小变化时重新适配宽度
window.addEventListener('resize', () => {
  if (chartInstance) {
    const container = document.getElementById('price-chart');
    chartInstance.setSize({ width: container.offsetWidth, height: 260 });
  }
});
