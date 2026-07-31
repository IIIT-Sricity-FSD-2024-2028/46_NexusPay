/**
 * app.js — Logs Page Entry Point
 */

document.addEventListener('DOMContentLoaded', () => {
  Auth.getCurrentRole();
  Sidebar.render('logs');
  HeaderBar.render('header-bar', 'Activity Logs', { showRoleSwitcher: false });
  renderLogStatCards();
  CrudUI.renderLogTable('crud-container');
  lucide.createIcons();
});

function renderLogStatCards() {
  const container = document.getElementById('stat-cards');
  if (!container) return;

  const logs = LogService.getAll();
  const critical = logs.filter(l => l.severity === 'Error').length;
  const warnings = logs.filter(l => l.severity === 'Warning').length;
  const info = logs.filter(l => l.severity === 'Info').length;
  const success = logs.filter(l => l.severity === 'Success').length;

  container.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon stat-icon-purple">
        <i data-lucide="file-text"></i>
      </div>
      <div class="stat-content">
        <div class="stat-value">${logs.length}</div>
        <div class="stat-label">Total Logs</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-red">
        <i data-lucide="alert-octagon"></i>
      </div>
      <div class="stat-content">
        <div class="stat-value">${critical}</div>
        <div class="stat-label">Error</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-yellow">
        <i data-lucide="alert-triangle"></i>
      </div>
      <div class="stat-content">
        <div class="stat-value">${warnings}</div>
        <div class="stat-label">Warnings</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon stat-icon-green">
        <i data-lucide="check-circle"></i>
      </div>
      <div class="stat-content">
        <div class="stat-value">${success + info}</div>
        <div class="stat-label">Info / Success</div>
      </div>
    </div>
  `;

  lucide.createIcons({ nodes: [container] });
}
