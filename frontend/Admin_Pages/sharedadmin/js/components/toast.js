/**
 * toast.js — Toast Notification System
 */

function initToastContainer() {
  if (document.getElementById('toast-container')) return;
  const container = Helpers.createElement('div', { id: 'toast-container', className: 'toast-container' });
  document.body.appendChild(container);
}

function showToast(message, type = 'info', duration = 3500) {
  initToastContainer();
  const container = document.getElementById('toast-container');

  const iconMap = {
    success: 'check-circle',
    error: 'x-circle',
    warning: 'alert-triangle',
    info: 'info'
  };

  const toast = Helpers.createElement('div', { className: `toast toast-${type}` });
  toast.innerHTML = `
    <i data-lucide="${iconMap[type] || 'info'}" class="toast-icon"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.closest('.toast').remove()">
      <i data-lucide="x" style="width:14px;height:14px;"></i>
    </button>
  `;

  container.appendChild(toast);
  lucide.createIcons({ nodes: [toast] });

  // Trigger entrance animation
  requestAnimationFrame(() => toast.classList.add('toast-show'));

  // Auto-remove
  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

window.Toast = {
  success: (msg) => showToast(msg, 'success'),
  error: (msg) => showToast(msg, 'error'),
  warning: (msg) => showToast(msg, 'warning'),
  info: (msg) => showToast(msg, 'info')
};
