/**
 * charts.js — Interactive SVG Chart Components
 * Matches the reference design: line/area charts, bar charts, horizontal bars with tooltips.
 */

/* ───────── Revenue Trend (Line/Area Chart) ───────── */
function renderRevenueChart(containerId, data, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { title = 'Revenue Trend' } = options;
  const width = 480, height = 320;
  const pad = { top: 30, right: 30, bottom: 40, left: 70 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const maxVal = 300000;
  const yTicks = [0, 75000, 150000, 225000, 300000];

  const points = data.values.map((v, i) => ({
    x: pad.left + (i / (data.labels.length - 1)) * cw,
    y: pad.top + ch - (v / maxVal) * ch,
    label: data.labels[i],
    value: v
  }));

  // Build smooth path
  const linePath = buildSmoothPath(points);
  const areaPath = linePath + ` L ${points[points.length - 1].x},${pad.top + ch} L ${points[0].x},${pad.top + ch} Z`;

  let svg = `<div class="chart-card"><div class="chart-header"><h3 class="chart-title">${title}</h3></div>
  <div class="chart-body chart-interactive">
  <svg viewBox="0 0 ${width} ${height}" class="chart-svg">
    <defs>
      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.02"/>
      </linearGradient>
    </defs>`;

  // Grid lines
  yTicks.forEach(tick => {
    const y = pad.top + ch - (tick / maxVal) * ch;
    svg += `<line x1="${pad.left}" y1="${y}" x2="${pad.left + cw}" y2="${y}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4"/>`;
    svg += `<text x="${pad.left - 10}" y="${y + 4}" text-anchor="end" fill="#64748b" font-size="12" font-family="Inter,sans-serif">${formatAxisNum(tick)}</text>`;
  });

  // X labels
  data.labels.forEach((lbl, i) => {
    const x = pad.left + (i / (data.labels.length - 1)) * cw;
    svg += `<text x="${x}" y="${height - 10}" text-anchor="middle" fill="#64748b" font-size="12" font-family="Inter,sans-serif">${lbl}</text>`;
  });

  // Y axis line
  svg += `<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + ch}" stroke="#cbd5e1" stroke-width="1"/>`;

  // Area fill (fade in)
  svg += `<path d="${areaPath}" fill="url(#revGrad)" class="chart-area-anim"/>`;

  // Line (draw-in animation)
  svg += `<path d="${linePath}" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" class="chart-line-anim"/>`;

  // Interactive dots + invisible hover zones
  points.forEach((p, i) => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#4f46e5" stroke="#fff" stroke-width="2.5" class="chart-dot" style="animation-delay:${0.6 + i * 0.08}s"/>`;
    svg += `<circle cx="${p.x}" cy="${p.y}" r="20" fill="transparent" class="chart-hover-zone" 
      onmouseenter="showChartTooltip(event, '${p.label}', 'revenue : ${Helpers.formatCurrency(p.value)}', '${containerId}')"
      onmouseleave="hideChartTooltip('${containerId}')"/>`;
    // Vertical hover line
    svg += `<line x1="${p.x}" y1="${pad.top}" x2="${p.x}" y2="${pad.top + ch}" stroke="#cbd5e1" stroke-width="1" opacity="0" class="chart-vline" data-idx="${i}"/>`;
  });

  svg += `</svg>
  <div class="chart-tooltip" id="tooltip-${containerId}"></div>
  </div></div>`;

  container.innerHTML = svg;
}

/* ───────── Transaction Volume (Bar Chart) ───────── */
function renderVolumeChart(containerId, data, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { title = 'Transaction Volume', color = '#10b981' } = options;
  const width = 480, height = 320;
  const pad = { top: 30, right: 30, bottom: 40, left: 60 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const maxVal = 6000;
  const yTicks = [0, 1500, 3000, 4500, 6000];
  const barWidth = (cw / data.labels.length) * 0.55;
  const barGap = cw / data.labels.length;

  let svg = `<div class="chart-card"><div class="chart-header"><h3 class="chart-title">${title}</h3></div>
  <div class="chart-body chart-interactive">
  <svg viewBox="0 0 ${width} ${height}" class="chart-svg">`;

  // Grid
  yTicks.forEach(tick => {
    const y = pad.top + ch - (tick / maxVal) * ch;
    svg += `<line x1="${pad.left}" y1="${y}" x2="${pad.left + cw}" y2="${y}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4"/>`;
    svg += `<text x="${pad.left - 10}" y="${y + 4}" text-anchor="end" fill="#64748b" font-size="12" font-family="Inter,sans-serif">${formatAxisNum(tick)}</text>`;
  });

  // Y axis
  svg += `<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + ch}" stroke="#cbd5e1" stroke-width="1"/>`;

  // Bars
  data.values.forEach((val, i) => {
    const bh = (val / maxVal) * ch;
    const x = pad.left + barGap * i + (barGap - barWidth) / 2;
    const y = pad.top + ch - bh;
    svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${bh}" rx="4" fill="${color}" class="chart-bar chart-bar-anim" style="transform-origin:${x + barWidth/2}px ${pad.top + ch}px;animation-delay:${0.1 + i * 0.08}s"
      onmouseenter="showChartTooltip(event, '${data.labels[i]}', '${Helpers.formatNumber(val)} transactions', '${containerId}')"
      onmouseleave="hideChartTooltip('${containerId}')"/>`;
    svg += `<text x="${x + barWidth / 2}" y="${height - 10}" text-anchor="middle" fill="#64748b" font-size="12" font-family="Inter,sans-serif">${data.labels[i]}</text>`;
  });

  svg += `</svg>
  <div class="chart-tooltip" id="tooltip-${containerId}"></div>
  </div></div>`;

  container.innerHTML = svg;
}

/* ───────── User Growth (Dual Line Chart) ───────── */
function renderGrowthChart(containerId, data, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { title = 'User Growth' } = options;
  const width = 800, height = 350;
  const pad = { top: 30, right: 30, bottom: 60, left: 60 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const maxVal = 26000;
  const yTicks = [0, 6500, 13000, 19500, 26000];

  const custPoints = data.customers.map((v, i) => ({
    x: pad.left + (i / (data.labels.length - 1)) * cw,
    y: pad.top + ch - (v / maxVal) * ch,
    val: v
  }));
  const merchPoints = data.merchants.map((v, i) => ({
    x: pad.left + (i / (data.labels.length - 1)) * cw,
    y: pad.top + ch - (v / maxVal) * ch,
    val: v
  }));

  const custPath = buildSmoothPath(custPoints);
  const merchPath = buildSmoothPath(merchPoints);

  let svg = `<div class="chart-card"><div class="chart-header"><h3 class="chart-title">${title}</h3></div>
  <div class="chart-body chart-interactive">
  <svg viewBox="0 0 ${width} ${height}" class="chart-svg">`;

  // Grid
  yTicks.forEach(tick => {
    const y = pad.top + ch - (tick / maxVal) * ch;
    svg += `<line x1="${pad.left}" y1="${y}" x2="${pad.left + cw}" y2="${y}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4"/>`;
    svg += `<text x="${pad.left - 10}" y="${y + 4}" text-anchor="end" fill="#64748b" font-size="12" font-family="Inter,sans-serif">${formatAxisNum(tick)}</text>`;
  });

  // Y axis
  svg += `<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + ch}" stroke="#cbd5e1" stroke-width="1"/>`;

  // X labels
  data.labels.forEach((lbl, i) => {
    const x = pad.left + (i / (data.labels.length - 1)) * cw;
    svg += `<text x="${x}" y="${height - 30}" text-anchor="middle" fill="#64748b" font-size="12" font-family="Inter,sans-serif">${lbl}</text>`;
  });

  // Customer line
  svg += `<path d="${custPath}" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" class="chart-line-anim"/>`;
  custPoints.forEach((p, i) => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#4f46e5" stroke="#fff" stroke-width="2.5" class="chart-dot" style="animation-delay:${0.6 + i * 0.08}s"/>`;
    svg += `<circle cx="${p.x}" cy="${p.y}" r="22" fill="transparent" class="chart-hover-zone"
      onmouseenter="showChartTooltip(event, '${data.labels[i]}', 'customers : ${Helpers.formatNumber(p.val)}<br>merchants : ${Helpers.formatNumber(merchPoints[i].val)}', '${containerId}')"
      onmouseleave="hideChartTooltip('${containerId}')"/>`;
  });

  // Merchant line
  svg += `<path d="${merchPath}" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" class="chart-line-anim" style="animation-delay:0.15s"/>`;
  merchPoints.forEach((p, mi) => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#10b981" stroke="#fff" stroke-width="2.5" class="chart-dot" style="animation-delay:${0.7 + mi * 0.08}s"/>`;
    svg += `<circle cx="${p.x}" cy="${p.y}" r="22" fill="transparent" class="chart-hover-zone"
      onmouseenter="showChartTooltip(event, '${data.labels[mi]}', 'customers : ${Helpers.formatNumber(custPoints[mi].val)}<br>merchants : ${Helpers.formatNumber(p.val)}', '${containerId}')"
      onmouseleave="hideChartTooltip('${containerId}')"/>`;
  });

  // Legend
  const legendY = height - 10;
  svg += `<circle cx="${width / 2 - 80}" cy="${legendY - 4}" r="4" fill="#4f46e5"/>`;
  svg += `<line x1="${width / 2 - 90}" y1="${legendY - 4}" x2="${width / 2 - 76}" y2="${legendY - 4}" stroke="#4f46e5" stroke-width="2"/>`;
  svg += `<text x="${width / 2 - 68}" y="${legendY}" fill="#4f46e5" font-size="13" font-family="Inter,sans-serif">customers</text>`;

  svg += `<circle cx="${width / 2 + 30}" cy="${legendY - 4}" r="4" fill="#10b981"/>`;
  svg += `<line x1="${width / 2 + 20}" y1="${legendY - 4}" x2="${width / 2 + 34}" y2="${legendY - 4}" stroke="#10b981" stroke-width="2"/>`;
  svg += `<text x="${width / 2 + 42}" y="${legendY}" fill="#10b981" font-size="13" font-family="Inter,sans-serif">merchants</text>`;

  svg += `</svg>
  <div class="chart-tooltip" id="tooltip-${containerId}"></div>
  </div></div>`;

  container.innerHTML = svg;
}

/* ───────── Category Performance (Horizontal Bar) ───────── */
function renderCategoryChart(containerId, data, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { title = 'Category Performance' } = options;
  const width = 480, height = 340;
  const pad = { top: 30, right: 30, bottom: 45, left: 90 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;
  const maxVal = 600000;
  const xTicks = [0, 150000, 300000, 600000];
  const barH = (ch / data.length) * 0.6;
  const rowH = ch / data.length;

  let svg = `<div class="chart-card"><div class="chart-header"><h3 class="chart-title">${title}</h3></div>
  <div class="chart-body chart-interactive">
  <svg viewBox="0 0 ${width} ${height}" class="chart-svg">`;

  // Vertical grid lines
  xTicks.forEach(tick => {
    const x = pad.left + (tick / maxVal) * cw;
    svg += `<line x1="${x}" y1="${pad.top}" x2="${x}" y2="${pad.top + ch}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,4"/>`;
    svg += `<text x="${x}" y="${height - 10}" text-anchor="middle" fill="#64748b" font-size="11" font-family="Inter,sans-serif">${formatAxisNum(tick)}</text>`;
  });

  // Horizontal bars
  data.forEach((item, i) => {
    const bw = (item.value / maxVal) * cw;
    const y = pad.top + rowH * i + (rowH - barH) / 2;

    // Category label
    svg += `<text x="${pad.left - 10}" y="${y + barH / 2 + 4}" text-anchor="end" fill="#334155" font-size="12" font-family="Inter,sans-serif">${item.name}</text>`;

    // Bar
    svg += `<rect x="${pad.left}" y="${y}" width="${bw}" height="${barH}" rx="3" fill="#4f46e5" class="chart-bar chart-hbar-anim" style="transform-origin:${pad.left}px ${y + barH/2}px;animation-delay:${0.1 + i * 0.1}s"
      onmouseenter="showChartTooltip(event, '${item.name}', 'revenue : ${Helpers.formatCurrency(item.value)}', '${containerId}')"
      onmouseleave="hideChartTooltip('${containerId}')"/>`;
  });

  svg += `</svg>
  <div class="chart-tooltip" id="tooltip-${containerId}"></div>
  </div></div>`;

  container.innerHTML = svg;
}

/* ───────── Hourly Activity (Bar Chart) ───────── */
function renderHourlyChart(containerId, data, options = {}) {
  renderVolumeChart(containerId, data, { title: 'Hourly Transaction Activity', color: '#0891b2' });
}

/* ───────── Top Performing Categories ───────── */
function renderTopCategories(containerId, data, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { title = '' } = options;

  let html = `<div class="chart-card">`;
  if (title) html += `<div class="chart-header"><h3 class="chart-title">${title}</h3></div>`;
  html += `<div class="chart-body"><div class="top-categories">`;

  data.forEach(item => {
    html += `
      <div class="category-row">
        <div class="category-left">
          <div class="category-rank">${item.rank}</div>
          <div class="category-info">
            <div class="category-name">${item.name}</div>
            <div class="category-revenue">Revenue: ${Helpers.formatCurrency(item.revenue)}</div>
          </div>
        </div>
        <div class="category-right">
          <div class="category-growth">
            <span class="growth-value">+${item.growth}%</span>
            <span class="growth-label">Growth</span>
          </div>
          <i data-lucide="trending-up" class="growth-icon"></i>
        </div>
      </div>
    `;
  });

  html += `</div></div></div>`;
  container.innerHTML = html;
  lucide.createIcons({ nodes: [container] });
}

/* ───────── Helpers ───────── */

function buildSmoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

function formatAxisNum(n) {
  if (n === 0) return '0';
  if (n >= 100000) return (n / 100000).toFixed(0) + 'L';
  if (n >= 1000) return Helpers.formatNumber(n);
  return n.toString();
}

/* ───────── Tooltip System ───────── */

function showChartTooltip(event, title, content, chartId) {
  const tooltip = document.getElementById('tooltip-' + chartId);
  if (!tooltip) return;

  tooltip.innerHTML = `
    <div class="ct-title">${title}</div>
    <div class="ct-value">${content}</div>
  `;
  tooltip.classList.add('ct-visible');

  const chartBody = tooltip.closest('.chart-interactive');
  const rect = chartBody.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Position tooltip near cursor
  let tx = mouseX + 12;
  let ty = mouseY - 10;

  // Keep inside bounds
  const tw = tooltip.offsetWidth || 150;
  if (tx + tw > rect.width - 10) tx = mouseX - tw - 12;
  if (ty < 10) ty = 10;

  tooltip.style.left = tx + 'px';
  tooltip.style.top = ty + 'px';

  // Show vertical hover line (for line charts)
  const svg = chartBody.querySelector('.chart-svg');
  if (svg) {
    const vlines = svg.querySelectorAll('.chart-vline');
    vlines.forEach(l => l.setAttribute('opacity', '0'));
  }
}

function hideChartTooltip(chartId) {
  const tooltip = document.getElementById('tooltip-' + chartId);
  if (tooltip) tooltip.classList.remove('ct-visible');
}

// Make tooltip functions global
window.showChartTooltip = showChartTooltip;
window.hideChartTooltip = hideChartTooltip;

window.Charts = {
  renderRevenueChart,
  renderVolumeChart,
  renderGrowthChart,
  renderCategoryChart,
  renderHourlyChart,
  renderTopCategories
};
