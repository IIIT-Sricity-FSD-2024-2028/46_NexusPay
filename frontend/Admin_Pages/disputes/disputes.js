/**
 * Disputes.js — NexusPay Admin Disputes Page (API-Backed)
 * Fetches dispute data from the NestJS backend API.
 * Requires: ../../../shared/api-config.js
 */

let disputes = [];
let activeTab = 'open';

document.addEventListener('DOMContentLoaded', async () => {
  renderSidebar('disputes');
  renderHeaderBar('header-bar', 'Disputes');
  lucide.createIcons();
  await loadDisputesData();
  renderAll();
  bindEvents();
});

async function loadDisputesData() {
  try {
    disputes = await api.get('/disputes');
  } catch (e) {
    console.error('Failed to load disputes from API:', e);
    disputes = [];
  }
}

function getCounts() {
  const pending = disputes.filter(d => d.status === 'Pending').length;
  const review = disputes.filter(d => d.status === 'In Review').length;
  const solved = disputes.filter(d => d.status === 'Solved').length;
  return { total: disputes.length, pending, review, solved };
}

function getTabData() {
  if (activeTab === 'open') return disputes.filter(d => d.status !== 'Solved');
  if (activeTab === 'pending') return disputes.filter(d => d.status === 'Pending');
  if (activeTab === 'review') return disputes.filter(d => d.status === 'In Review');
  if (activeTab === 'solved') return disputes.filter(d => d.status === 'Solved');
  return disputes;
}

function priorityBadge(p) {
  const colors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
  return `<span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;color:#fff;background:${colors[p] || '#94a3b8'}">${p}</span>`;
}

function statusBadge(s) {
  const map = { Pending: { bg: '#fef3c7', color: '#b45309' }, 'In Review': { bg: '#dbeafe', color: '#2563eb' }, Solved: { bg: '#d1fae5', color: '#059669' } };
  const st = map[s] || { bg: '#f1f5f9', color: '#64748b' };
  return `<span style="display:inline-block;padding:3px 10px;border-radius:9999px;font-size:12px;font-weight:500;background:${st.bg};color:${st.color}">${s}</span>`;
}

function renderAll() { updateStats(); renderGrid(); }

function updateStats() {
  const c = getCounts();
  const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  el('valTotal', c.total); el('valPending', c.pending); el('valReview', c.review); el('valSolved', c.solved);
  el('tabPendingCount', c.pending); el('tabReviewCount', c.review); el('tabSolvedCount', c.solved);
}

function renderGrid() {
  const data = getTabData();
  const grid = document.getElementById('dspGrid');
  const empty = document.getElementById('emptyState');

  if (!data.length) { if (grid) grid.innerHTML = ''; if (empty) empty.style.display = 'flex'; return; }

  if (empty) empty.style.display = 'none';
  if (grid) {
    grid.innerHTML = data.map(d => `
      <div class="dsp-card" onclick="showDisputeModal('${d.id}')">
        <div class="dsp-card__header"><span class="dsp-card__id">${d.id}</span>${priorityBadge(d.priority)}</div>
        <div class="dsp-card__customer">${d.customer}</div>
        <div class="dsp-card__reason">${d.reason}</div>
        <div class="dsp-card__footer"><span class="dsp-card__amount">₹${d.amount.toLocaleString('en-IN')}</span>${statusBadge(d.status)}</div>
        <div class="dsp-card__date">${d.date} · Txn: ${d.txnId}</div>
        ${d.status !== 'Solved' ? `<div class="dsp-card__actions">
          ${d.status === 'Pending' ? `<button class="dsp-action-btn dsp-action-review" onclick="event.stopPropagation();moveToReview('${d.id}')">Move to Review</button>` : ''}
          ${d.status === 'In Review' ? `<button class="dsp-action-btn dsp-action-resolve" onclick="event.stopPropagation();resolveDispute('${d.id}')">Resolve</button>` : ''}
        </div>` : ''}
      </div>
    `).join('');
  }
}

function bindEvents() {
  document.querySelectorAll('.dsp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dsp-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      renderAll();
    });
  });
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
}

async function moveToReview(id) {
  try {
    await api.patch(`/disputes/${id}/status`, { status: 'In Review' });
    const d = disputes.find(x => x.id === id);
    if (d) d.status = 'In Review';
    renderAll();
    showToast('Dispute moved to review', 'info');
  } catch (e) {
    showToast('Failed to update dispute', 'error');
  }
}

async function resolveDispute(id) {
  try {
    await api.patch(`/disputes/${id}/status`, { status: 'Solved' });
    const d = disputes.find(x => x.id === id);
    if (d) d.status = 'Solved';
    renderAll();
    showToast('Dispute resolved!', 'success');
  } catch (e) {
    showToast('Failed to resolve dispute', 'error');
  }
}

async function resetDisputes() {
  showToast('Reset is handled by restarting the backend server.', 'info');
}

function showDisputeModal(id) {
  const d = disputes.find(x => x.id === id);
  if (!d) return;
  document.getElementById('modalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div><strong style="color:#94a3b8;font-size:12px;">Dispute ID</strong><br>${d.id}</div>
      <div><strong style="color:#94a3b8;font-size:12px;">Transaction ID</strong><br>${d.txnId}</div>
      <div><strong style="color:#94a3b8;font-size:12px;">Customer</strong><br>${d.customer}</div>
      <div><strong style="color:#94a3b8;font-size:12px;">Merchant</strong><br>${d.merchant}</div>
      <div><strong style="color:#94a3b8;font-size:12px;">Amount</strong><br><span style="font-size:20px;font-weight:700;color:#4f46e5;">₹${d.amount.toLocaleString('en-IN')}</span></div>
      <div><strong style="color:#94a3b8;font-size:12px;">Priority</strong><br>${priorityBadge(d.priority)}</div>
      <div><strong style="color:#94a3b8;font-size:12px;">Status</strong><br>${statusBadge(d.status)}</div>
      <div><strong style="color:#94a3b8;font-size:12px;">Date</strong><br>${d.date}</div>
      <div style="grid-column:1/-1"><strong style="color:#94a3b8;font-size:12px;">Reason</strong><br>${d.reason}</div>
    </div>`;
  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() { document.getElementById('modalOverlay')?.classList.remove('active'); }

/* ───────── Toast ───────── */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastWrap');
  if (!container) { container = document.createElement('div'); container.id = 'toastWrap'; container.className = 'toast-wrap'; document.body.appendChild(container); }
  const colorMap = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
  const toast = document.createElement('div');
  toast.className = 'dsp-toast';
  toast.style.cssText = `padding:12px 20px;border-radius:8px;background:#1e293b;color:#fff;font-size:14px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,0.15);border-left:4px solid ${colorMap[type]};opacity:0;transform:translateY(-12px);transition:all 0.3s ease;margin-bottom:8px;`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-12px)'; setTimeout(() => toast.remove(), 300); }, 3000);
}
