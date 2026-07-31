/**
 * roleSwitcher.js — Header Bar with Notifications & Profile Dropdown
 * Notifications styled like scheduled.html (card-based, colored icons, blue dots)
 */

/* ───────── Mock Notification Data ───────── */
const NOTIFICATIONS = [
  { id: 1, icon: 'indian-rupee', title: 'Payment Received', desc: '₹2,500 from Priya Sharma', time: '2 minutes ago', read: false, iconColor: '#10b981', iconBg: '#ecfdf5' },
  { id: 2, icon: 'check-circle-2', title: 'Split Payment Completed', desc: 'Dinner split with 4 people settled', time: '1 hour ago', read: false, iconColor: '#4f46e5', iconBg: '#eef2ff' },
  { id: 3, icon: 'calendar', title: 'Scheduled Payment Request', desc: 'Amit Singh requested monthly rent schedule', time: '3 hours ago', read: false, iconColor: '#a855f7', iconBg: '#faf5ff' },
  { id: 4, icon: 'alert-triangle', title: 'High-value transaction flagged', desc: 'Transaction #xn_004 of ₹67,800 requires review', time: '5 hours ago', read: true, iconColor: '#f59e0b', iconBg: '#fffbeb' },
  { id: 5, icon: 'shield-check', title: 'Daily report generated', desc: 'Analytics report for March 28 is ready', time: 'Yesterday', read: true, iconColor: '#10b981', iconBg: '#ecfdf5' }
];

let notificationsRead = JSON.parse(localStorage.getItem('nexuspay_notif_read') || '[]');

function getUnreadCount() {
  return NOTIFICATIONS.filter(n => !notificationsRead.includes(n.id) && !n.read).length;
}

function markNotificationRead(id) {
  if (!notificationsRead.includes(id)) {
    notificationsRead.push(id);
    localStorage.setItem('nexuspay_notif_read', JSON.stringify(notificationsRead));
  }
}

function markAllRead() {
  notificationsRead = NOTIFICATIONS.map(n => n.id);
  localStorage.setItem('nexuspay_notif_read', JSON.stringify(notificationsRead));
}

/* ───────── Header Bar (Both Pages) ───────── */

function renderHeaderBar(containerId, pageTitle, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const role = Auth.getCurrentRole();
  const roleLabel = Auth.getRoleLabel(role);
  const unread = getUnreadCount();

  container.innerHTML = `
    <div class="header-bar">
      <div class="header-left">
        <h1 class="page-title">${pageTitle}</h1>
      </div>
      <div class="header-right">
        <!-- Notifications -->
        <div class="header-dropdown" id="notif-dropdown-wrap">
          <button class="icon-btn" id="notification-btn" title="Notifications">
            <i data-lucide="bell"></i>
            ${unread > 0 ? `<span class="notification-badge">${unread}</span>` : ''}
          </button>
          <div class="dropdown-panel notif-panel" id="notif-panel">
            <div class="dropdown-panel-header">
              <div class="notif-header-info">
                <span class="dropdown-panel-title">Notifications</span>
                <span class="notif-header-sub">You have ${unread} unread notification${unread !== 1 ? 's' : ''}</span>
              </div>
              <button class="notif-close-btn" id="notif-close-btn">&times;</button>
            </div>
            <div class="notif-list" id="notif-list">
              ${renderNotificationList()}
            </div>
            <div class="dropdown-panel-footer">
              <span class="mark-read-btn" id="mark-all-read-btn">Mark all as read</span>
            </div>
          </div>
        </div>

        <div class="header-divider"></div>

        <!-- Profile -->
        <div class="header-dropdown" id="profile-dropdown-wrap">
          <button class="profile-trigger" id="profile-btn">
            <div class="header-avatar">${roleLabel.charAt(0)}${roleLabel.charAt(roleLabel.indexOf(' ') + 1) || ''}</div>
            <div class="header-user-info">
              <div class="header-user-name">${roleLabel}</div>
              <div class="header-user-email">${role === 'super_user' ? 'super' : role}@nexuspay.com</div>
            </div>
            <i data-lucide="chevron-down" class="profile-chevron"></i>
          </button>
          <div class="dropdown-panel profile-panel" id="profile-panel">
            <div class="profile-panel-header">
              <div class="profile-panel-avatar">${roleLabel.charAt(0)}${roleLabel.charAt(roleLabel.indexOf(' ') + 1) || ''}</div>
              <div class="profile-panel-info">
                <div class="profile-panel-name">${roleLabel}</div>
                <div class="profile-panel-email">${role === 'super_user' ? 'super' : role}@nexuspay.com</div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-menu">
              <button class="dropdown-item" onclick="ProfileDropdown.action('profile')">
                <i data-lucide="user"></i> My Profile
              </button>
              <button class="dropdown-item" onclick="ProfileDropdown.action('settings')">
                <i data-lucide="settings"></i> Account Settings
              </button>
              <button class="dropdown-item" onclick="ProfileDropdown.action('activity')">
                <i data-lucide="activity"></i> Activity Log
              </button>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-menu">
              <button class="dropdown-item dropdown-item-danger" onclick="ProfileDropdown.action('logout')">
                <i data-lucide="log-out"></i> Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons({ nodes: [container] });
  bindDropdownEvents();
}

/* ───────── Notification List (matches scheduled.html card style) ───────── */

function renderNotificationList() {
  return NOTIFICATIONS.map(n => {
    const isRead = notificationsRead.includes(n.id) || n.read;
    return `
      <div class="notif-card ${isRead ? 'notif-read' : ''}" data-id="${n.id}" onclick="NotifDropdown.markRead(${n.id})">
        <div class="notif-icon" style="color:${n.iconColor}; background:${n.iconBg};">
          <i data-lucide="${n.icon}"></i>
        </div>
        <div class="notif-content">
          <div class="notif-title">${n.title} ${!isRead ? '<span class="blue-dot"></span>' : ''}</div>
          <div class="notif-desc">${n.desc}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `;
  }).join('');
}

/* ───────── Dropdown Toggle Logic ───────── */

function bindDropdownEvents() {
  const notifBtn = document.getElementById('notification-btn');
  const notifPanel = document.getElementById('notif-panel');
  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      notifPanel.classList.toggle('dropdown-open');
    });
  }

  const notifCloseBtn = document.getElementById('notif-close-btn');
  if (notifCloseBtn) {
    notifCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns();
    });
  }

  const profileBtn = document.getElementById('profile-btn');
  const profilePanel = document.getElementById('profile-panel');
  if (profileBtn && profilePanel) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      profilePanel.classList.toggle('dropdown-open');
    });
  }

  const markAllBtn = document.getElementById('mark-all-read-btn');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      markAllRead();
      const list = document.getElementById('notif-list');
      if (list) {
        list.innerHTML = renderNotificationList();
        lucide.createIcons({ nodes: [list] });
      }
      const badge = document.querySelector('.notification-badge');
      if (badge) badge.remove();
      const sub = document.querySelector('.notif-header-sub');
      if (sub) sub.textContent = 'You have 0 unread notifications';
      Toast.success('All notifications marked as read');
    });
  }

  document.addEventListener('click', closeAllDropdowns);
  document.querySelectorAll('.dropdown-panel').forEach(panel => {
    panel.addEventListener('click', (e) => e.stopPropagation());
  });
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-panel').forEach(p => p.classList.remove('dropdown-open'));
}

/* ───────── Notification Actions ───────── */

window.NotifDropdown = {
  markRead(id) {
    markNotificationRead(id);
    const item = document.querySelector(`.notif-card[data-id="${id}"]`);
    if (item) {
      item.classList.add('notif-read');
      const dot = item.querySelector('.blue-dot');
      if (dot) dot.remove();
    }
    const badge = document.querySelector('.notification-badge');
    const remaining = getUnreadCount();
    if (badge) {
      if (remaining > 0) { badge.textContent = remaining; }
      else { badge.remove(); }
    }
    const sub = document.querySelector('.notif-header-sub');
    if (sub) sub.textContent = `You have ${remaining} unread notification${remaining !== 1 ? 's' : ''}`;
  }
};

/* ───────── Profile Actions ───────── */

window.ProfileDropdown = {
  action(type) {
    closeAllDropdowns();
    switch (type) {
      case 'profile':
        window.location.href = '../profile/index.html';
        break;
      case 'settings':
        window.location.href = '../settings/index.html';
        break;
      case 'activity':
        window.location.href = '../logs/index.html';
        break;
      case 'logout':
        Toast.warning('Logging out...');
        setTimeout(() => {
          localStorage.removeItem('nexuspay_current_role');
          localStorage.removeItem('nexuspay_notif_read');
          window.location.href = '../auth/index.html';
        }, 1000);
        break;
    }
  }
};

window.HeaderBar = { render: renderHeaderBar };
