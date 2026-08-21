// ── PIE CHART ──
let notificationHelpersPromise;

function getNotificationHelpers() {
  if (!notificationHelpersPromise) {
    notificationHelpersPromise = import('../customershared/js/data.js').catch((error) => {
      console.warn('Notification helpers unavailable:', error);
      return null;
    });
  }

  return notificationHelpersPromise;
}

function formatCurrency(amount, options = {}) {
  const { showSign = false } = options;
  const sign = showSign ? (amount < 0 ? '-' : '+') : '';
  return `${sign}\u20b9${Math.abs(amount).toLocaleString('en-IN')}`;
}
lucide.createIcons();

function getPieTotal() {
  return pieChart.data.datasets[0].data.reduce((a, b) => a + b, 0) || 1;
}

const pieCtx = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(pieCtx, {
  type: 'doughnut',
  data: {
    labels: pieLabels,
    datasets: [{
      data: pieData,
      backgroundColor: pieColors,
      borderColor: '#fff',
      borderWidth: 3,
      hoverBorderWidth: 3,
      hoverOffset: 10,
      borderRadius: 4,
    }]
  },
  options: {
    cutout: '70%',
    responsive: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${formatCurrency(ctx.parsed)} (${Math.round(ctx.parsed / getPieTotal() * 100)}%)`
        },
        backgroundColor: '#1e293b',
        titleFont: { family: 'DM Sans', size: 13, weight: '600' },
        bodyFont:  { family: 'DM Sans', size: 12 },
        padding: 10,
        cornerRadius: 8,
      }
    },
    animation: { animateScale: true, duration: 900, easing: 'easeOutQuart' },
    onHover: (evt, elements) => {
      pieCtx.canvas.style.cursor = elements.length ? 'pointer' : 'default';
    }
  }
});

document.getElementById('pieChart').addEventListener('mousemove', (e) => {
  const pts = pieChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
  document.querySelectorAll('.cat-item').forEach((el, i) => {
    el.style.outline = (pts.length && pts[0].index === i) ? `2px solid ${pieColors[i]}` : 'none';
  });
});
document.getElementById('pieChart').addEventListener('mouseleave', () => {
  document.querySelectorAll('.cat-item').forEach(el => el.style.outline = 'none');
});

// ── RENDER NOTIFICATIONS ──
async function renderNotifications() {
  const helpers = await getNotificationHelpers();
  const getNotifications = helpers?.getNotifications;
  const markNotificationRead = helpers?.markNotificationRead;
  if (!getNotifications || !markNotificationRead) return;

  const notifications = await getNotifications();
  const notifList = document.querySelector('.notif-list');
  if (!notifList) return;

  if (!notifications || notifications.length === 0) {
    notifList.innerHTML = '<div class="notif-row">No notifications</div>';
    return;
  }

  notifList.innerHTML = notifications.map(n => {
    const isUnread = !n.read;
    const icon = n.type === 'scheduled_payment' ? 'calendar' : n.type === 'payment' ? 'arrow-down-left' : 'bell';
    const bgColor = n.type === 'scheduled_payment' ? '#fef3c7' : n.type === 'payment' ? '#ecfdf5' : '#f3f4f6';
    const color = n.type === 'scheduled_payment' ? '#f59e0b' : n.type === 'payment' ? '#10b981' : '#6b7280';
    
    return `
      <div class="notif-row ${isUnread ? 'unread' : ''}" data-id="${n.id}">
        <div class="notif-row-icon" style="background:${bgColor};color:${color}"><i data-lucide="${icon}"></i></div>
        <div class="notif-row-body">
          <div class="notif-row-title">${n.type.replace('_', ' ').toUpperCase()}</div>
          <div class="notif-row-desc">${n.message}</div>
          <div class="notif-row-time">${new Date(n.date).toLocaleTimeString()}</div>
        </div>
        ${isUnread ? '<div class="notif-unread-dot"></div>' : ''}
      </div>`;
  }).join('');

  // Update unread count
  unreadCount = notifications.filter(n => !n.read).length;
  updateNotifBadge();

  // Re-attach click handlers
  document.querySelectorAll('.notif-row').forEach(row => {
    row.addEventListener('click', async (e) => {
      const id = row.dataset.id;
      // Mark as read
      if (row.classList.contains('unread')) {
        await markNotificationRead(id);
        row.classList.remove('unread');
        unreadCount = Math.max(0, unreadCount - 1);
        updateNotifBadge();
      }
      // Navigate based on type
      const notif = notifications.find(n => n.id == id);
      if (notif.type === 'scheduled_payment') {
        window.location.href = '../scheduled/scheduled.html';
      } else {
        window.location.href = '../history/transaction_history.html';
      }
    });
  });

  lucide.createIcons();
}

const catMaxVal = Math.max(...pieData);
setTimeout(() => {
  document.querySelectorAll('.cat-bar-fill').forEach((bar, i) => {
    bar.style.width = Math.round(pieData[i] / catMaxVal * 100) + '%';
  });
}, 200);

document.querySelectorAll('.cat-item').forEach((item, i) => {
  item.addEventListener('mouseenter', () => {
    const meta = pieChart.getDatasetMeta(0);
    meta.data.forEach((arc, idx) => { arc.options.offset = idx === i ? 14 : 0; });
    pieChart.update('none');
  });
  item.addEventListener('mouseleave', () => {
    const meta = pieChart.getDatasetMeta(0);
    meta.data.forEach(arc => arc.options.offset = 0);
    pieChart.update('none');
  });
});

// ── LINE CHART ──
const lineCtx  = document.getElementById('lineChart').getContext('2d');

const gradient = lineCtx.createLinearGradient(0, 0, 0, 220);
gradient.addColorStop(0, 'rgba(124,58,237,0.22)');
gradient.addColorStop(1, 'rgba(124,58,237,0.01)');

const lineChart = new Chart(lineCtx, {
  type: 'line',
  data: {
    labels: months,
    datasets: [{
      label: 'Spending',
      data: spending,
      borderColor: '#7c3aed',
      borderWidth: 2.5,
      backgroundColor: gradient,
      fill: true,
      tension: 0.45,
      pointBackgroundColor: '#7c3aed',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: '#7c3aed',
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: ctx => ` ${formatCurrency(ctx.parsed.y)}` },
        backgroundColor: '#1e293b',
        titleFont: { family: 'DM Sans', size: 12, weight: '600' },
        bodyFont:  { family: 'DM Sans', size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { family: 'DM Sans', size: 11 }, color: '#94a3b8' }
      },
      y: {
        grid: { color: '#f1f5f9', lineWidth: 1 },
        border: { display: false, dash: [4,4] },
        ticks: {
          font: { family: 'DM Mono', size: 10 },
          color: '#94a3b8',
          callback: v => v >= 1000 ? (v/1000)+'k' : v,
        },
        min: 0, max: 15000, stepSize: 3500,
      }
    },
    animation: { duration: 1000, easing: 'easeOutQuart' },
    interaction: { mode: 'index', intersect: false },
  }
});

// ── PERIOD SELECT ──
const dataByPeriod = {
  'This Month':    [2400,2100,1800,1500,1200,800],
  'Last Month':    [2100,2400,1600,1300,1100,900],
  'Last 3 Months': [7000,6800,5100,4200,3900,2700],
};
document.getElementById('periodSelect').addEventListener('change', function () {
  const d  = dataByPeriod[this.value] || pieData;
  const t  = d.reduce((a,b) => a+b, 0);
  const mx = Math.max(...d);
  pieChart.data.datasets[0].data = d;
  pieChart.update();
  document.querySelector('.pie-center-label .amount').textContent = formatCurrency(t);
  document.querySelectorAll('.cat-bar-fill').forEach((bar, i) => {
    bar.style.width = Math.round(d[i] / mx * 100) + '%';
  });
  document.querySelectorAll('.cat-amount').forEach((el, i) => {
    el.textContent = formatCurrency(d[i]);
  });
});

// ── TRANSACTION RENDERER ──
function renderRecentTransactions() {
  const listElement = document.getElementById('dashboardTxnList');
  if (!listElement) return;

  // Render last 5 transactions
  const latest = transactions.slice(0, 5);
  if (!latest.length) {
    listElement.innerHTML = '<div class="empty-state">No recent transactions yet</div>';
    return;
  }

  listElement.innerHTML = latest.map(t => {
      const isExpense = t.amount < 0;
      const formattedAmt = formatCurrency(t.amount, { showSign: true });
      return `
        <div class="txn-item" data-id="${t.id}">
          <div class="txn-icon">${t.icon}</div>
          <div class="txn-info">
            <div class="txn-name">${t.name}</div>
            <div class="txn-date">${t.date}, ${t.time || '12:00 PM'}</div>
          </div>
          <div class="txn-right">
            <div class="txn-amount ${isExpense ? 'expense' : 'income'}">${formattedAmt}</div>
            <div class="txn-cat">${t.category}</div>
          </div>
        </div>
      `;
  }).join('');

  // Re-bind receipt listeners
  const items = listElement.querySelectorAll('.txn-item');
  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      const t = latest[idx];
      const txnId = t.id ? (String(t.id).startsWith('TXN') ? t.id : 'TXN-' + String(t.id).padStart(10, '0')) : 'TXN-GEN-' + Date.now();

      document.getElementById('receipt-icon').textContent     = t.icon;
      document.getElementById('receipt-merchant').textContent = t.name;
      document.getElementById('receipt-date').textContent     = `${t.date} \u2022 ${t.time || '12:00 PM'}`;
      document.getElementById('receipt-category').textContent = t.category;
      document.getElementById('receipt-amount').textContent   = formatCurrency(t.amount, { showSign: true });
      document.getElementById('receipt-txn-id').textContent   = txnId;
      document.getElementById('raise-dispute-receipt').dataset.txnId = txnId;
      document.getElementById('receipt-popup').style.display  = 'flex';
    });
  });
}

// ── UPDATE STATS ──
function updateDashboardStats() {
    const analyticsTotal = pieData.reduce((sum, amount) => sum + amount, 0);
    const transactionTotal = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalSpent = analyticsTotal || transactionTotal;
    const mainWalletBalance = document.getElementById('mainWalletBalance');
    if (mainWalletBalance) mainWalletBalance.textContent = formatCurrency(totalSpent);
    
    // Update chart center label too
    const pieCenterLabel = document.querySelector('.pie-center-label .amount');
    if (pieCenterLabel) pieCenterLabel.textContent = formatCurrency(totalSpent);

    // Update transaction count
    const stats = document.querySelectorAll('.stat-num');
    if (stats.length > 1) stats[1].textContent = transactions.length;
}

// Load data from API, then render
(async () => {
  await loadDashboardData();
  renderRecentTransactions();
  updateDashboardStats();
  await renderNotifications();

  // Update pie chart with API data if available
  const newTotal = pieData.reduce((a, b) => a + b, 0);
  pieChart.data.labels = pieLabels;
  pieChart.data.datasets[0].data = pieData;
  pieChart.update();
  const pieCenterLabel2 = document.querySelector('.pie-center-label .amount');
  if (pieCenterLabel2) pieCenterLabel2.textContent = formatCurrency(newTotal);

  // Update category bars
  const catMaxVal2 = Math.max(...pieData);
  document.querySelectorAll('.cat-bar-fill').forEach((bar, i) => {
    bar.style.width = Math.round(pieData[i] / catMaxVal2 * 100) + '%';
  });
  document.querySelectorAll('.cat-amount').forEach((el, i) => {
    el.textContent = formatCurrency(pieData[i]);
  });
})();

document.getElementById('close-receipt-popup').addEventListener('click', () => {
  document.getElementById('receipt-popup').style.display = 'none';
});
document.getElementById('receipt-popup').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.style.display = 'none';
  }
});
document.getElementById('done-receipt').addEventListener('click', () => {
  document.getElementById('receipt-popup').style.display = 'none';
});
document.getElementById('raise-dispute-receipt').addEventListener('click', (e) => {
  const txnId = e.currentTarget.dataset.txnId || '';
  const target = txnId
    ? `../raiseDispute/RaiseDispute.html?txnId=${encodeURIComponent(txnId)}`
    : '../raiseDispute/RaiseDispute.html';
  window.location.href = target;
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// NOTIFICATION & PROFILE PANELS
// ── All element refs grabbed first ──
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const notifWrapper   = document.getElementById('notifWrapper');
const notifBtn       = document.getElementById('notifBtn');
const notifPanel     = document.getElementById('notifPanel');
const notifDot       = document.getElementById('notifDot');
const profileWrapper = document.getElementById('profileWrapper');
const profileBtn     = document.getElementById('profileBtn');
const profileDrop    = document.getElementById('profileDropdown');

// Track state explicitly — never rely on class presence alone
let notifOpen   = false;
let profileOpen = false;
let unreadCount = document.querySelectorAll('.notif-row.unread').length;

function setNotif(open) {
  notifOpen = open;
  notifPanel.style.display = open ? 'block' : 'none';
  notifBtn.classList.toggle('active', open);
}

function setProfile(open) {
  profileOpen = open;
  profileDrop.style.display = open ? 'block' : 'none';
  profileBtn.classList.toggle('active', open);
}

function closeAll() {
  setNotif(false);
  setProfile(false);
}

const logoutPopup = document.getElementById('logout-popup');

function openLogoutPopup() {
  if (logoutPopup) logoutPopup.style.display = 'flex';
}

function closeLogoutPopup() {
  if (logoutPopup) logoutPopup.style.display = 'none';
}

function updateNotifBadge() {
  notifDot.style.display = unreadCount > 0 ? 'block' : 'none';
}

// ── Bell click ──
notifBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const opening = !notifOpen;
  closeAll();
  if (opening) setNotif(true);
});

// ── Profile click ──
profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const opening = !profileOpen;
  closeAll();
  if (opening) setProfile(true);
});

// ── Mark individual notification read & Navigate ──
document.querySelectorAll('.notif-row').forEach(row => {
  row.addEventListener('click', (e) => {
    // Determine target page based on content
    const title = row.querySelector('.notif-row-title').textContent.toLowerCase();
    const txnId = row.dataset.id;
    let target = '../history/transaction_history.html';
    
    if (title.includes('split')) {
        target = '../split/split.html';
    } else if (txnId) {
        target += `?txnId=${txnId}`;
    }

    if (row.classList.contains('unread')) {
      row.classList.remove('unread');
      unreadCount = Math.max(0, unreadCount - 1);
      updateNotifBadge();
    }

    // Small delay to see "read" change before navigating
    setTimeout(() => {
        window.location.href = target;
    }, 150);
  });
});

// ── Mark all read ──
document.getElementById('markAllRead').addEventListener('click', async (e) => {
  e.stopPropagation();
  const helpers = await getNotificationHelpers();
  await helpers?.markAllNotificationsRead?.();
  document.querySelectorAll('.notif-row.unread').forEach(r => r.classList.remove('unread'));
  unreadCount = 0;
  updateNotifBadge();
});

// ── Sign out ──
function handleCustomerLogout(e) {
  if (e) e.stopPropagation();
  closeAll();
  openLogoutPopup();
}

document.getElementById('logoutBtn').addEventListener('click', handleCustomerLogout);
document.querySelectorAll('.logout-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    handleCustomerLogout(e);
  });
});

document.getElementById('close-logout-popup').addEventListener('click', closeLogoutPopup);
document.getElementById('cancel-logout-btn').addEventListener('click', closeLogoutPopup);
document.getElementById('confirm-logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('nexuspay_session');
  window.location.href = '../../Public_Pages/Signin.html?role=customer';
});
logoutPopup.addEventListener('click', (e) => {
  if (e.target === logoutPopup) closeLogoutPopup();
});

// ── Clicks inside the panels don't close them ──
notifPanel.addEventListener('click',  (e) => e.stopPropagation());
profileDrop.addEventListener('click', (e) => e.stopPropagation());

// ── Click anywhere outside → close both ──
document.addEventListener('click', () => closeAll());

// ── Escape key → close both ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAll();
    closeLogoutPopup();
  }
});
