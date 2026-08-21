/**
 * sidebar.js — Sidebar Rendering with Lucide Icons
 * Unified sidebar for ALL pages (root + folder-based)
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
    const link = Helpers.createElement('a', {
      className: `nav-link${isActive ? ' nav-link-active' : ''}`,
      href: item.href
    });
    link.innerHTML = `
      <i data-lucide="${item.icon}" class="nav-icon"></i>
      <span class="nav-label">${item.label}</span>
    `;
    nav.appendChild(link);
  });

  // Log Out handler
  const logoutBtn = sidebarEl.querySelector('#sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Toast.warning('Logging out...');
      setTimeout(() => {
        localStorage.removeItem('nexuspay_current_role');
        localStorage.removeItem('nexuspay_notif_read');
        window.location.href = '../auth/index.html';
      }, 1000);
    });
  }

  lucide.createIcons({ nodes: [sidebarEl] });
}

window.Sidebar = { render: renderSidebar };
