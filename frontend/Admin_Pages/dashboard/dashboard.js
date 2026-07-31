/**
 * Dashboard.js — NexusPay Admin Dashboard
 * Charts: Revenue (area), Volume (bar), Growth (dual line), Category (horizontal bar), Hourly (area)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar('dashboard');
  renderHeaderBar('header-bar', 'Dashboard');
  lucide.createIcons();
  renderCharts();
  renderTopCategories();
});

const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const revenueData   = [145000, 189000, 210000, 178000, 230000, 195000, 283000];
const volumeData    = [2100, 2800, 3200, 2600, 3400, 2900, 3800];
const customersData = [1800, 2200, 2600, 3100, 3500, 4000, 4500];
const merchantsData = [120, 180, 250, 310, 380, 420, 490];

const chartFont = { family: "'Inter', sans-serif" };
const gridColor = 'rgba(0,0,0,0.05)';

function baseOptions() {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1e293b', titleFont: { ...chartFont, size: 12 }, bodyFont: { ...chartFont, size: 13 }, padding: 10, cornerRadius: 8, displayColors: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { ...chartFont, size: 11 }, color: '#94a3b8' } },
      y: { grid: { color: gridColor }, ticks: { font: { ...chartFont, size: 11 }, color: '#94a3b8' }, border: { display: false } }
    }
  };
}

function renderCharts() {
  // 1. Revenue Trend (gradient area)
  const revCtx = document.getElementById('revenueChart')?.getContext('2d');
  if (revCtx) {
    const g = revCtx.createLinearGradient(0, 0, 0, 200);
    g.addColorStop(0, 'rgba(99, 102, 241, 0.25)'); g.addColorStop(1, 'rgba(99, 102, 241, 0)');
    new Chart(revCtx, { type: 'line', data: { labels: MONTHS, datasets: [{ data: revenueData, borderColor: '#6366f1', backgroundColor: g, fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#6366f1' }] }, options: baseOptions() });
  }

  // 2. Transaction Volume (bar)
  const volCtx = document.getElementById('volumeChart')?.getContext('2d');
  if (volCtx) {
    new Chart(volCtx, { type: 'bar', data: { labels: MONTHS, datasets: [{ data: volumeData, backgroundColor: 'rgba(16, 185, 129, 0.75)', borderRadius: 6, borderSkipped: false, maxBarThickness: 36 }] }, options: baseOptions() });
  }

  // 3. User Growth (dual line)
  const growCtx = document.getElementById('growthChart')?.getContext('2d');
  if (growCtx) {
    new Chart(growCtx, { type: 'line', data: { labels: MONTHS, datasets: [
      { label: 'Customers', data: customersData, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.08)', fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#10b981' },
      { label: 'Merchants', data: merchantsData, borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.08)', fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#8b5cf6' }
    ] }, options: { ...baseOptions(), plugins: { ...baseOptions().plugins, legend: { display: false } } } });
  }

  // 4. Category Performance (horizontal bar — matching analytics)
  const catCtx = document.getElementById('categoryChart')?.getContext('2d');
  if (catCtx) {
    new Chart(catCtx, {
      type: 'bar',
      data: {
        labels: ['Electronics', 'Fashion', 'Grocery', 'Food & Dining', 'Services', 'Others'],
        datasets: [{ data: [482000, 378000, 314000, 257000, 200000, 171000], backgroundColor: '#6366f1', borderRadius: 4, maxBarThickness: 22 }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', bodyFont: { ...chartFont, size: 13 }, padding: 10, cornerRadius: 8, callbacks: { label: c => '₹' + c.parsed.x.toLocaleString('en-IN') } } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { font: { ...chartFont, size: 11 }, color: '#94a3b8', callback: v => (v/1000)+'k' }, border: { display: false } },
          y: { grid: { display: false }, ticks: { font: { ...chartFont, size: 12 }, color: '#334155' } }
        }
      }
    });
  }

  // 5. Hourly Activity (area chart — matching analytics)
  const hrCtx = document.getElementById('hourlyChart')?.getContext('2d');
  if (hrCtx) {
    const hrGrad = hrCtx.createLinearGradient(0, 0, 0, 220);
    hrGrad.addColorStop(0, 'rgba(16, 185, 129, 0.2)'); hrGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
    new Chart(hrCtx, {
      type: 'line',
      data: {
        labels: ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'],
        datasets: [{ data: [100, 80, 120, 380, 680, 720, 520, 310], borderColor: '#10b981', backgroundColor: hrGrad, fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0 }]
      },
      options: baseOptions()
    });
  }
}

function renderTopCategories() {
  const container = document.getElementById('categoriesList');
  if (!container) return;
  const categories = [
    { name: 'Electronics', revenue: '₹4,50,000', growth: '+28%' },
    { name: 'Fashion', revenue: '₹3,80,000', growth: '+22%' },
    { name: 'Grocery', revenue: '₹3,20,000', growth: '+18%' },
    { name: 'Food & Dining', revenue: '₹2,80,000', growth: '+15%' },
    { name: 'Services', revenue: '₹2,10,000', growth: '+12%' },
    { name: 'Others', revenue: '₹1,50,000', growth: '+8%' }
  ];
  container.innerHTML = categories.map((c, i) => `
    <div class="category-row">
      <div class="category-row__rank">${i + 1}</div>
      <div class="category-row__info">
        <span class="category-row__name">${c.name}</span>
        <span class="category-row__revenue">Revenue: ${c.revenue}</span>
      </div>
      <div class="category-row__growth">
        <span class="category-row__growth-value">${c.growth}</span>
        <span class="category-row__growth-label">Growth</span>
      </div>
      <svg class="category-row__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
    </div>
  `).join('');
}
