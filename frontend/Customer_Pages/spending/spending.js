/**
 * spending.js — Spending Analytics Page Logic
 * Canvas charts, mock data per period, interactive tabs, merchants.
 */

import { logout, isLoggedIn } from '../customershared/js/auth.js';
import { initData } from '../customershared/js/data.js';
import { updateHeaderForUser, showToast, refreshIcons } from '../customershared/js/ui.js';

/* ====== MOCK DATA BY PERIOD ====== */

const CATEGORY_COLORS = {
    Food: '#3b82f6',
    Shopping: '#10b981',
    Transport: '#f59e0b',
    Entertainment: '#a855f7',
    Retail: '#ec4899',
    Others: '#94a3b8',
};

const DATA = {
    week: {
        total: 4820, change: 8,
        largest: { amount: 1299, merchant: 'Swiggy', cat: 'Food' },
        mostSpent: { cat: 'Food', amount: 2100, pct: 44 },
        categories: [
            { name: 'Food', amount: 2100, pct: 44 },
            { name: 'Shopping', amount: 1200, pct: 25 },
            { name: 'Transport', amount: 680, pct: 14 },
            { name: 'Entertainment', amount: 520, pct: 11 },
            { name: 'Retail', amount: 200, pct: 4 },
            { name: 'Others', amount: 120, pct: 2 },
        ],
        merchants: [
            { name: 'Swiggy', cat: 'Food', amount: 1299, emoji: '🍕' },
            { name: 'Amazon', cat: 'Shopping', amount: 1200, emoji: '📦' },
            { name: 'Uber', cat: 'Transport', amount: 480, emoji: '🚗' },
            { name: 'Netflix', cat: 'Entertainment', amount: 520, emoji: '🎬' },
        ],
    },
    month: {
        total: 18540, change: 12,
        largest: { amount: 3299, merchant: 'Amazon', cat: 'Shopping' },
        mostSpent: { cat: 'Shopping', amount: 6500, pct: 35 },
        categories: [
            { name: 'Food', amount: 4200, pct: 23 },
            { name: 'Shopping', amount: 6500, pct: 35 },
            { name: 'Transport', amount: 2800, pct: 15 },
            { name: 'Entertainment', amount: 3200, pct: 17 },
            { name: 'Retail', amount: 1200, pct: 7 },
            { name: 'Others', amount: 640, pct: 3 },
        ],
        merchants: [
            { name: 'Amazon', cat: 'Shopping', amount: 4500, emoji: '📦' },
            { name: 'Dominos', cat: 'Food', amount: 1200, emoji: '🍕' },
            { name: 'Uber', cat: 'Transport', amount: 950, emoji: '🚗' },
            { name: 'Netflix', cat: 'Entertainment', amount: 799, emoji: '🎬' },
            { name: 'BigBasket', cat: 'Shopping', amount: 2000, emoji: '🛒' },
            { name: 'Zomato', cat: 'Food', amount: 1800, emoji: '🍔' },
        ],
    },
    year: {
        total: 215400, change: 18,
        largest: { amount: 45000, merchant: 'Apple Store', cat: 'Shopping' },
        mostSpent: { cat: 'Shopping', amount: 72000, pct: 33 },
        categories: [
            { name: 'Food', amount: 48000, pct: 22 },
            { name: 'Shopping', amount: 72000, pct: 33 },
            { name: 'Transport', amount: 32000, pct: 15 },
            { name: 'Entertainment', amount: 38400, pct: 18 },
            { name: 'Retail', amount: 15000, pct: 7 },
            { name: 'Others', amount: 10000, pct: 5 },
        ],
        merchants: [
            { name: 'Amazon', cat: 'Shopping', amount: 45000, emoji: '📦' },
            { name: 'Swiggy', cat: 'Food', amount: 24000, emoji: '🍕' },
            { name: 'Uber', cat: 'Transport', amount: 18000, emoji: '🚗' },
            { name: 'Netflix', cat: 'Entertainment', amount: 9588, emoji: '🎬' },
            { name: 'BigBasket', cat: 'Shopping', amount: 27000, emoji: '🛒' },
            { name: 'Zomato', cat: 'Food', amount: 18000, emoji: '🍔' },
            { name: 'Apple Store', cat: 'Shopping', amount: 45000, emoji: '🍎' },
        ],
    },
};

const TREND_DATA = {
    week: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], values: [1200,1800,900,1500,2200,3000,1400] },
    month: { labels: ['Week 1','Week 2','Week 3','Week 4'], values: [4200,5100,3800,5440] },
    '3months': { labels: ['Jan','Feb','Mar'], values: [16200,14800,18540] },
    year: { labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], values: [14200,15800,18540,16200,19800,17400,21000,22400,19600,23200,24800,22000] },
};

/* ====== STATE ====== */

let currentPeriod = 'month';
let currentTrend = 'year';

/* ====== FORMAT ====== */

function fmt(n) {
    return '₹' + Number(n).toLocaleString('en-IN');
}

/* ====== RENDER SUMMARY CARDS ====== */

function renderSummary() {
    const d = DATA[currentPeriod];
    document.getElementById('total-spent').textContent = fmt(d.total);
    document.getElementById('largest-purchase').textContent = fmt(d.largest.amount);
    document.getElementById('largest-merchant').textContent = d.largest.merchant;
    document.getElementById('most-spent-cat').textContent = d.mostSpent.cat;
    document.getElementById('most-spent-amount').textContent = fmt(d.mostSpent.amount);
    document.getElementById('most-spent-pct').textContent = d.mostSpent.pct + '%';
}

/* ====== EASING ====== */

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

/* ====== ANIMATION IDs (to cancel on re-draw) ====== */

let donutAnimId = null;
let lineAnimId = null;

/* ====== DONUT CHART (Animated Canvas) ====== */

function drawDonut() {
    const canvas = document.getElementById('donut-chart');
    if (!canvas) return;

    // Cancel any running animation
    if (donutAnimId) cancelAnimationFrame(donutAnimId);

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 260;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, r = 100, lineWidth = 36;
    const cats = DATA[currentPeriod].categories;
    const total = cats.reduce((s, c) => s + c.amount, 0);

    // Pre-compute slice angles
    const slices = [];
    let cumAngle = -Math.PI / 2;
    cats.forEach(cat => {
        const sliceAngle = (cat.amount / total) * Math.PI * 2;
        slices.push({
            start: cumAngle,
            angle: sliceAngle,
            color: CATEGORY_COLORS[cat.name] || '#94a3b8',
        });
        cumAngle += sliceAngle;
    });

    const duration = 900; // ms
    const startTime = performance.now();

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutCubic(progress);
        const totalAngleToDraw = ease * Math.PI * 2;

        ctx.clearRect(0, 0, size, size);

        // Draw slices up to current progress
        let drawn = 0;
        for (const slice of slices) {
            if (drawn >= totalAngleToDraw) break;
            const available = totalAngleToDraw - drawn;
            const drawAngle = Math.min(slice.angle, available);

            ctx.beginPath();
            ctx.arc(cx, cy, r, slice.start, slice.start + drawAngle);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = slice.color;
            ctx.lineCap = 'butt';
            ctx.stroke();

            drawn += drawAngle;
        }

        // Center circle (white fill)
        ctx.beginPath();
        ctx.arc(cx, cy, r - lineWidth / 2 - 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Center text — animate count-up
        const displayTotal = Math.round(total * ease);
        ctx.fillStyle = '#101828';
        ctx.font = '800 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fmt(displayTotal), cx, cy - 8);
        ctx.font = '500 13px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Total', cx, cy + 16);

        if (progress < 1) {
            donutAnimId = requestAnimationFrame(animate);
        } else {
            donutAnimId = null;
        }
    }

    donutAnimId = requestAnimationFrame(animate);
}

/* ====== LEGEND ====== */

function renderLegend() {
    const container = document.getElementById('donut-legend');
    if (!container) return;
    const cats = DATA[currentPeriod].categories;
    container.innerHTML = cats.map((cat, i) => `
        <div class="sa-legend-item" style="opacity:0; animation: legendFadeIn 0.4s ease ${i * 0.08}s forwards;">
            <div class="sa-legend-left">
                <div class="sa-legend-dot" style="background:${CATEGORY_COLORS[cat.name] || '#94a3b8'}"></div>
                <span class="sa-legend-name">${cat.name}</span>
            </div>
            <span class="sa-legend-right">${fmt(cat.amount)} • ${cat.pct}%</span>
        </div>
    `).join('');

    // Inject the keyframe if it doesn't exist
    if (!document.getElementById('legend-anim-style')) {
        const style = document.createElement('style');
        style.id = 'legend-anim-style';
        style.textContent = `
            @keyframes legendFadeIn {
                from { opacity: 0; transform: translateX(12px); }
                to   { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ====== LINE CHART (Animated Canvas) ====== */
/* ====== LINE CHART STATE (for tooltip interaction) ====== */

let lineChartState = null;   // { canvas, ctx, dpr, W, H, points, labels, values, padL, padT, chartH, maxVal, step, segLens, totalLen }
let lineChartObserver = null;
let lineChartHasAnimated = false;

function drawLineChartStatic() {
    // Draw the final, completed frame (no animation) — used after animation or on resize
    if (!lineChartState) return;
    drawLineFrame(1);
}

function drawLineFrame(progress) {
    const s = lineChartState;
    if (!s) return;
    const { ctx, dpr, W, H, points, labels, values, padL, padR, padT, padB, chartH, maxVal, step, segLens, totalLen } = s;
    const ease = easeOutCubic(progress);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    const gridLines = 5;
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= gridLines; i++) {
        const y = padT + (chartH / gridLines) * i;
        const val = Math.round(maxVal - (maxVal / gridLines) * i);
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(W - padR, y);
        ctx.stroke();
        ctx.fillText(val.toLocaleString('en-IN'), padL - 8, y);
    }

    // X labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    labels.forEach((label, i) => {
        const x = padL + step * i;
        ctx.fillText(label, x, padT + chartH + 12);
    });

    if (points.length < 2) return;

    const drawLen = ease * totalLen;

    // Draw the line
    ctx.beginPath();
    ctx.strokeStyle = '#615fff';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.moveTo(points[0].x, points[0].y);

    let accumulated = 0;
    let lastX = points[0].x, lastY = points[0].y;

    for (let i = 0; i < segLens.length; i++) {
        const remaining = drawLen - accumulated;
        if (remaining <= 0) break;
        if (remaining >= segLens[i]) {
            ctx.lineTo(points[i + 1].x, points[i + 1].y);
            lastX = points[i + 1].x;
            lastY = points[i + 1].y;
            accumulated += segLens[i];
        } else {
            const t = remaining / segLens[i];
            lastX = points[i].x + (points[i + 1].x - points[i].x) * t;
            lastY = points[i].y + (points[i + 1].y - points[i].y) * t;
            ctx.lineTo(lastX, lastY);
            accumulated += remaining;
            break;
        }
    }
    ctx.stroke();

    // Gradient fill
    const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    grad.addColorStop(0, `rgba(97, 95, 255, ${0.15 * ease})`);
    grad.addColorStop(1, 'rgba(97, 95, 255, 0)');
    ctx.lineTo(lastX, padT + chartH);
    ctx.lineTo(points[0].x, padT + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Dots
    accumulated = 0;
    for (let i = 0; i < points.length; i++) {
        if (i === 0 || accumulated <= drawLen) {
            const dotScale = Math.min(1, ease * 1.2);
            const dotR = 5 * dotScale;
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, dotR, 0, Math.PI * 2);
            ctx.fillStyle = '#615fff';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, dotR * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }
        if (i < segLens.length) accumulated += segLens[i];
    }

    // Highlighted point (hover)
    if (progress >= 1 && s.hoverIdx != null) {
        const hi = s.hoverIdx;
        // Vertical guide line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(97, 95, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(points[hi].x, padT);
        ctx.lineTo(points[hi].x, padT + chartH);
        ctx.stroke();
        ctx.setLineDash([]);

        // Bigger dot
        ctx.beginPath();
        ctx.arc(points[hi].x, points[hi].y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(97, 95, 255, 0.2)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(points[hi].x, points[hi].y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#615fff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(points[hi].x, points[hi].y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
}

function setupLineChart() {
    const canvas = document.getElementById('line-chart');
    if (!canvas) return;

    if (lineAnimId) cancelAnimationFrame(lineAnimId);

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = Math.max(canvas.parentElement.clientWidth, 300);
    const H = 280;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    const td = TREND_DATA[currentTrend];
    const labels = td.labels;
    const values = td.values;
    const maxVal = Math.max(...values) * 1.2;

    const padL = 55, padR = 20, padT = 20, padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const step = chartW / (labels.length - 1 || 1);

    const points = values.map((val, i) => ({
        x: padL + step * i,
        y: padT + chartH - (val / maxVal) * chartH,
    }));

    let totalLen = 0;
    const segLens = [];
    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        segLens.push(Math.sqrt(dx * dx + dy * dy));
        totalLen += segLens[i - 1];
    }

    lineChartState = { canvas, ctx, dpr, W, H, points, labels, values, padL, padR, padT, padB, chartH, chartW, maxVal, step, segLens, totalLen, hoverIdx: null };
}

function animateLineChart() {
    if (!lineChartState) return;
    if (lineAnimId) cancelAnimationFrame(lineAnimId);

    const duration = 1200;
    let startTime = null;

    function tick(now) {
        if (startTime === null) startTime = now;
        const progress = Math.min((now - startTime) / duration, 1);
        drawLineFrame(progress);

        if (progress < 1) {
            lineAnimId = requestAnimationFrame(tick);
        } else {
            lineAnimId = null;
            lineChartHasAnimated = true;
        }
    }

    lineAnimId = requestAnimationFrame(tick);
}

function drawLineChart() {
    setupLineChart();
    // Always animate when explicitly called (e.g. tab change)
    lineChartHasAnimated = false;
    animateLineChart();
}

function drawLineChartOnScroll() {
    // Setup the chart but don't animate yet — wait for scroll into view
    setupLineChart();
    drawLineFrame(0); // Draw just the grid

    const canvas = document.getElementById('line-chart');
    if (!canvas) return;

    // Clean up old observer
    if (lineChartObserver) lineChartObserver.disconnect();

    // Use .OD as root since it's the scroll container
    const scrollContainer = document.querySelector('.OD') || null;

    lineChartObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                animateLineChart();
                lineChartObserver.disconnect();
                lineChartObserver = null;
                break;
            }
        }
    }, { root: scrollContainer, threshold: 0.2 });

    lineChartObserver.observe(canvas);
}

/* ====== LINE CHART TOOLTIP (hover/click) ====== */

function wireLineChartTooltip() {
    const canvas = document.getElementById('line-chart');
    const tooltip = document.getElementById('chart-tooltip');
    if (!canvas || !tooltip) return;

    function findNearestPoint(e) {
        if (!lineChartState) return -1;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const pts = lineChartState.points;
        let closest = -1, minDist = 50; // 50px snap radius
        for (let i = 0; i < pts.length; i++) {
            const dx = mx - pts[i].x;
            const dy = my - pts[i].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < minDist) { minDist = d; closest = i; }
        }
        return closest;
    }

    function showTooltipAt(idx) {
        if (idx < 0 || !lineChartState) {
            tooltip.style.opacity = '0';
            tooltip.style.pointerEvents = 'none';
            if (lineChartState) { lineChartState.hoverIdx = null; drawLineChartStatic(); }
            return;
        }
        const s = lineChartState;
        s.hoverIdx = idx;
        drawLineChartStatic();

        const label = s.labels[idx];
        const value = s.values[idx];
        tooltip.innerHTML = `<div class="tt-label">${label}</div><div class="tt-value">${fmt(value)}</div>`;

        // Use viewport coordinates for fixed positioning
        const rect = canvas.getBoundingClientRect();
        tooltip.style.left = (rect.left + s.points[idx].x) + 'px';
        tooltip.style.top = (rect.top + s.points[idx].y) + 'px';
        tooltip.classList.remove('hidden');
        tooltip.style.opacity = '1';
        tooltip.style.display = 'block';
    }

    canvas.addEventListener('mousemove', (e) => {
        const idx = findNearestPoint(e);
        showTooltipAt(idx);
    });

    canvas.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        if (lineChartState) { lineChartState.hoverIdx = null; drawLineChartStatic(); }
    });

    canvas.addEventListener('click', (e) => {
        const idx = findNearestPoint(e);
        showTooltipAt(idx);
    });
}

/* ====== MERCHANTS ====== */

const CAT_BADGE_COLORS = {
    Food: { bg: '#ecfdf5', color: '#10b981' },
    Shopping: { bg: '#eef2ff', color: '#615fff' },
    Transport: { bg: '#fef3c6', color: '#d97706' },
    Entertainment: { bg: '#faf5ff', color: '#a855f7' },
    Retail: { bg: '#fce7f3', color: '#ec4899' },
    Others: { bg: '#f1f5f9', color: '#64748b' },
};

function renderMerchants() {
    const grid = document.getElementById('merchants-grid');
    if (!grid) return;
    const merchants = DATA[currentPeriod].merchants;
    grid.innerHTML = merchants.map(m => {
        const bc = CAT_BADGE_COLORS[m.cat] || CAT_BADGE_COLORS.Others;
        return `
        <div class="sa-merchant-card">
            <div class="sa-merchant-icon" style="background:${bc.bg};">${m.emoji}</div>
            <div class="sa-merchant-info">
                <div class="sa-merchant-name-row">
                    <span class="sa-merchant-name">${m.name}</span>
                    <span class="sa-merchant-badge" style="background:${bc.bg};color:${bc.color};">${m.cat}</span>
                </div>
                <span class="sa-merchant-amount">${fmt(m.amount)}</span>
            </div>
        </div>`;
    }).join('');
}

/* ====== RENDER ALL ====== */

function renderAll(initial) {
    renderSummary();
    drawDonut();
    renderLegend();
    if (initial) {
        drawLineChartOnScroll(); // Animate only when scrolled into view
    } else {
        drawLineChart();         // Tab change — animate immediately
    }
    renderMerchants();
    refreshIcons();
}

/* ====== BOOTSTRAP ====== */

document.addEventListener('DOMContentLoaded', () => {
    initData();

    // Auto-set default user session (no login required)
    if (!isLoggedIn()) {
        sessionStorage.setItem('nexuspay_session', JSON.stringify({ userId: 1, name: 'Rajesh Kumar', email: 'rajesh@nexuspay.com', role: 'customer' }));
    }
    updateHeaderForUser();

    renderAll(true);

    // Period tabs
    document.getElementById('period-tabs')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-period]');
        if (!btn) return;
        currentPeriod = btn.dataset.period;
        document.querySelectorAll('#period-tabs .sa-tab').forEach(t => t.classList.remove('sa-tab-active'));
        btn.classList.add('sa-tab-active');
        renderAll(false);
    });

    // Trend tabs
    document.getElementById('trend-tabs')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-trend]');
        if (!btn) return;
        currentTrend = btn.dataset.trend;
        document.querySelectorAll('#trend-tabs .sa-trend-tab').forEach(t => t.classList.remove('sa-trend-tab-active'));
        btn.classList.add('sa-trend-tab-active');
        drawLineChart();
    });

    // Window resize — just redraw static, no re-animation
    window.addEventListener('resize', () => {
        drawDonut();
        setupLineChart();
        drawLineChartStatic();
    });

    wireLineChartTooltip();
    wireHeaderPopovers();
    wireLogoutBtn();
});

/* ====== HEADER POPOVERS ====== */

function wireHeaderPopovers() {
    const bellIcon = document.getElementById('bell-icon');
    const profileIcon = document.getElementById('profile-icon');
    const overlay = document.getElementById('drawer-overlay');

    function closeDrawers() {
        document.getElementById('popover-notif')?.classList.add('hidden');
        document.getElementById('popover-profile')?.classList.add('hidden');
        overlay?.classList.add('hidden');
    }

    if (bellIcon) {
        bellIcon.addEventListener('click', (e) => {
            if (e.target.closest('.popover-panel')) return;
            const notif = document.getElementById('popover-notif');
            document.getElementById('popover-profile')?.classList.add('hidden');
            notif?.classList.toggle('hidden');
            overlay?.classList.toggle('hidden', notif?.classList.contains('hidden'));
        });
    }

    if (profileIcon) {
        profileIcon.addEventListener('click', (e) => {
            if (e.target.closest('.popover-panel')) return;
            const prof = document.getElementById('popover-profile');
            document.getElementById('popover-notif')?.classList.add('hidden');
            prof?.classList.toggle('hidden');
            overlay?.classList.toggle('hidden', prof?.classList.contains('hidden'));
        });
    }

    document.querySelectorAll('.close-popover').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); closeDrawers(); });
    });
    if (overlay) overlay.addEventListener('click', closeDrawers);

    document.getElementById('popover-logout')?.addEventListener('click', (e) => {
        e.stopPropagation(); logout(); showToast('Logged out.', 'info'); closeDrawers();
    });

    // Mark all as read — clear notifications
    const markReadBtn = document.querySelector('.mark-read-btn');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', () => {
            const body = document.querySelector('#popover-notif .popover-body');
            if (body) body.innerHTML = '<div class="empty-state" style="padding:32px 0;text-align:center;color:#94a3b8;"><i data-lucide="bell-off"></i><span style="display:block;margin-top:8px;">No notifications</span></div>';
            const sub = document.querySelector('#popover-notif .ph-sub');
            if (sub) sub.textContent = 'You have 0 unread notifications';
            const dot = document.querySelector('.red-dot');
            if (dot) dot.style.display = 'none';
            markReadBtn.style.display = 'none';
            if (window.lucide) lucide.createIcons();
        });
    }
}

function wireLogoutBtn() {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        logout();
    });
}
