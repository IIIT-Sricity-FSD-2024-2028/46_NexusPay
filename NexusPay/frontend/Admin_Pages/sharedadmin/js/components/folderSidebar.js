/**
 * folderSidebar.js — Sidebar + HeaderBar for folder-based pages
 * Uses ../folder/index.html paths for navigation from any subfolder.
 */

function renderSidebar(activePage) {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  const navItems = [
    { icon: 'layout-dashboard', label: 'Dashboard', href: '../dashboard/index.html', id: 'dashboard' },
    { icon: 'arrow-left-right', label: 'Transactions', href: '../transactions/index.html', id: 'transactions' },
    { icon: 'users', label: 'Users', href: '../users/index.html', id: 'users' },
    { icon: 'shield-alert', label: 'Disputes', href: '../disputes/index.html', id: 'disputes' },
    { icon: 'bar-chart-3', label: 'Analytics', href: '../analytics/index.html', id: 'analytics' },
    { icon: 'file-text', label: 'Logs', href: '../logs/index.html', id: 'logs' },
    { icon: 'settings', label: 'Settings', href: '../settings/index.html', id: 'settings' }
  ];

  sidebarEl.innerHTML = `
    <div class="sidebar-brand">
      <div class="brand-logo">
        <div class="brand-icon">N</div>
        <div class="brand-text">
          <div class="brand-name">NexusPay</div>
          <div class="brand-subtitle">Admin Panel</div>
        </div>
      </div>
    </div>
    <nav class="sidebar-nav" id="sidebar-nav"></nav>
    <div class="sidebar-footer">
      <button class="sidebar-logout-btn" id="sidebar-logout-btn">
        <i data-lucide="log-out"></i>
        <span>Log Out</span>
      </button>
    </div>
  `;

  const nav = sidebarEl.querySelector('#sidebar-nav');
  navItems.forEach(item => {
    const isActive = item.id === activePage;
    const link = document.createElement('a');
    link.className = `nav-link${isActive ? ' nav-link-active' : ''}`;
    link.href = item.href;
    link.innerHTML = `
      <i data-lucide="${item.icon}" class="nav-icon"></i>
      <span class="nav-label">${item.label}</span>
    `;
    nav.appendChild(link);
  });

  // Log Out
  sidebarEl.querySelector('#sidebar-logout-btn')?.addEventListener('click', () => {
    setTimeout(() => {
      localStorage.removeItem('nexuspay_current_role');
      localStorage.removeItem('nexuspay_notif_read');
      window.location.href = '../auth/index.html';
    }, 500);
  });

  lucide.createIcons({ nodes: [sidebarEl] });
}

/* ─── HeaderBar for folder-based pages ─── */

function renderHeaderBar(containerId, pageTitle) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.className = 'header-bar';

  const notifications = [
    { id: 1, icon: 'alert-triangle', iconColor: '#f59e0b', title: 'High-value transaction flagged', desc: 'Transaction #TXN-4521 for ₹2,45,000 requires review.', time: '5 min ago' },
    { id: 2, icon: 'user-plus', iconColor: '#10b981', title: 'New merchant onboarded', desc: 'QuickMart has completed KYC verification.', time: '22 min ago' },
    { id: 3, icon: 'shield-alert', iconColor: '#ef4444', title: 'Dispute escalated', desc: 'Dispute #DSP-892 has been escalated to admin review.', time: '1 hr ago' },
    { id: 4, icon: 'bar-chart-3', iconColor: '#4f46e5', title: 'Weekly analytics ready', desc: 'Your weekly transaction report is available.', time: '3 hrs ago' },
    { id: 5, icon: 'check-circle', iconColor: '#10b981', title: 'System update complete', desc: 'The latest security patch has been applied.', time: '5 hrs ago' }
  ];

  const readKey = 'nexuspay_notif_read';
  let readIds = [];
  try { readIds = JSON.parse(localStorage.getItem(readKey) || '[]'); } catch(e) {}
  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  container.innerHTML = `
    <div class="header-left">
      <h1 class="page-title">${pageTitle}</h1>
    </div>
    <div class="header-right">
      <div class="header-dropdown" id="notif-dropdown">
        <button class="icon-btn" id="notif-btn" aria-label="Notifications">
          <i data-lucide="bell"></i>
          ${unreadCount > 0 ? `<span class="notification-badge">${unreadCount}</span>` : ''}
        </button>
        <div class="dropdown-panel notif-panel" id="notif-panel">
          <div class="dropdown-panel-header">
            <span class="dropdown-panel-title">Notifications</span>
            <button class="dropdown-link" id="mark-all-read">Mark all read</button>
          </div>
          <div class="notif-list" id="notif-list">
            ${notifications.map(n => {
              const isRead = readIds.includes(n.id);
              return `<div class="notif-item ${isRead ? 'notif-read' : ''}" data-id="${n.id}">
                <div class="notif-icon" style="background:${n.iconColor}15;color:${n.iconColor}"><i data-lucide="${n.icon}"></i></div>
                <div class="notif-content">
                  <div class="notif-title">${n.title}${!isRead ? '<span class="blue-dot"></span>' : ''}</div>
                  <div class="notif-desc">${n.desc}</div>
                  <div class="notif-time">${n.time}</div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
      <div class="header-divider"></div>
      <div class="header-dropdown" id="profile-dropdown">
        <button class="profile-trigger" id="profile-trigger">
          <div class="header-avatar">AD</div>
          <div class="header-user-info">
            <span class="header-user-name">Admin</span>
            <span class="header-user-email">admin@nexuspay.com</span>
          </div>
          <i data-lucide="chevron-down" class="profile-chevron"></i>
        </button>
        <div class="dropdown-panel profile-panel" id="profile-panel">
          <div class="profile-panel-header">
            <div class="profile-panel-avatar">AD</div>
            <div class="profile-panel-info">
              <div class="profile-panel-name">Admin User</div>
              <div class="profile-panel-email">admin@nexuspay.com</div>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-menu">
            <button class="dropdown-item" onclick="window.location.href='../settings/index.html'"><i data-lucide="settings"></i> Settings</button>
            <button class="dropdown-item" onclick="window.location.href='../logs/index.html'"><i data-lucide="activity"></i> Activity Log</button>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-menu">
            <button class="dropdown-item dropdown-item-danger" id="header-logout-btn"><i data-lucide="log-out"></i> Logout</button>
          </div>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons({ nodes: [container] });

  document.getElementById('notif-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notif-panel')?.classList.toggle('dropdown-open');
    document.getElementById('profile-panel')?.classList.remove('dropdown-open');
  });

  document.getElementById('profile-trigger')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('profile-panel')?.classList.toggle('dropdown-open');
    document.getElementById('notif-panel')?.classList.remove('dropdown-open');
  });

  document.getElementById('mark-all-read')?.addEventListener('click', () => {
    const allIds = notifications.map(n => n.id);
    localStorage.setItem(readKey, JSON.stringify(allIds));
    renderHeaderBar(containerId, pageTitle);
  });

  document.getElementById('header-logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('nexuspay_current_role');
    localStorage.removeItem('nexuspay_notif_read');
    window.location.href = '../auth/index.html';
  });

  document.addEventListener('click', () => {
    document.getElementById('notif-panel')?.classList.remove('dropdown-open');
    document.getElementById('profile-panel')?.classList.remove('dropdown-open');
  });
}
