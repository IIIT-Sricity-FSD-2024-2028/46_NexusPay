/**
 * Transactions.js — NexusPay Admin Transactions Page (API-Backed)
 * Fetches transaction data from the NestJS backend.
 * Requires: ../../../shared/api-config.js
 */

let TRANSACTIONS = [];
let currentPage = 1;
const PAGE_SIZE = 10;
let filterStatus = 'all';
let filterType = 'all';
let searchQuery = '';

// Avatar colors
const AVATAR_COLORS = ['#4f46e5','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1'];
function avatarColor(name) { let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h); return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]; }
function initials(name) { return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase(); }

document.addEventListener('DOMContentLoaded', async () => {
  renderSidebar('transactions');
  renderHeaderBar('header-bar', 'Transactions');
  lucide.createIcons();
  await loadTransactionsData();
  renderTable();
  bindEvents();
});

async function loadTransactionsData() {
  try {
    TRANSACTIONS = await api.get('/transactions');
  } catch (e) {
    console.error('Failed to load transactions from API:', e);
    TRANSACTIONS = [];
  }
}

function getFiltered() {
  return TRANSACTIONS.filter(t => {
    if (filterStatus !== 'all' && t.status.toLowerCase() !== filterStatus) return false;
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.id.toLowerCase().includes(q) || t.sender.toLowerCase().includes(q) || t.receiver.toLowerCase().includes(q);
    }
    return true;
  });
}

function statusBadge(status) {
  const map = { Completed: 'status-completed', Pending: 'status-pending', Failed: 'status-failed' };
  return `<span class="status-badge ${map[status] || ''}">${status.toLowerCase()}</span>`;
}

function typeBadge(type) { return `<span class="category-badge">${type}</span>`; }
function formatAmt(n) { return '₹' + n.toLocaleString('en-IN'); }

function avatarCell(name) {
  const bg = avatarColor(name);
  return `<div style="display:flex;align-items:center;gap:10px;">
    <div style="width:32px;height:32px;border-radius:50%;background:${bg};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;">${initials(name)}</div>
    <span>${name}</span>
  </div>`;
}

function renderTable() {
  const data = getFiltered();
  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (currentPage > pages) currentPage = pages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const slice = data.slice(start, start + PAGE_SIZE);

  const tbody = document.getElementById('txnTableBody');
  if (tbody) {
    tbody.innerHTML = slice.length ? slice.map(t => `
      <tr onclick="showModal('${t.id}')" style="cursor:pointer">
        <td><strong>${t.id}</strong></td>
        <td>${avatarCell(t.sender)}</td>
        <td>${avatarCell(t.receiver)}</td>
        <td><strong>${formatAmt(t.amount)}</strong></td>
        <td>${typeBadge(t.type)}</td>
        <td>${statusBadge(t.status)}</td>
        <td style="color:#64748b;">${t.date}</td>
      </tr>
    `).join('') : '<tr><td colspan="7" style="text-align:center;padding:40px;color:#94a3b8;">No transactions found</td></tr>';
  }

  const info = document.getElementById('paginationInfo');
  if (info) info.textContent = total ? `Showing ${start+1}–${Math.min(start+PAGE_SIZE, total)} of ${total}` : 'No results';

  const pagesEl = document.getElementById('pageNumbers');
  if (pagesEl) {
    pagesEl.innerHTML = '';
    for (let i = 1; i <= pages; i++) {
      const btn = document.createElement('button');
      btn.className = 'pagination__page' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.onclick = () => { currentPage = i; renderTable(); };
      pagesEl.appendChild(btn);
    }
  }

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= pages;
}

function bindEvents() {
  document.getElementById('searchInput')?.addEventListener('input', e => { searchQuery = e.target.value; currentPage = 1; renderTable(); });
  document.getElementById('prevBtn')?.addEventListener('click', () => { currentPage--; renderTable(); });
  document.getElementById('nextBtn')?.addEventListener('click', () => { currentPage++; renderTable(); });
  document.getElementById('filterBtn')?.addEventListener('click', () => {
    const dd = document.getElementById('filterDropdown');
    if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  });

  document.querySelectorAll('#statusFilters .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#statusFilters .filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); filterStatus = btn.dataset.status; currentPage = 1; renderTable();
    });
  });
  document.querySelectorAll('#typeFilters .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#typeFilters .filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); filterType = btn.dataset.type; currentPage = 1; renderTable();
    });
  });

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
}

function showModal(id) {
  const t = TRANSACTIONS.find(x => x.id === id);
  if (!t) return;
  document.getElementById('modalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">Transaction ID</div><strong>${t.id}</strong></div>
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">Status</div>${statusBadge(t.status)}</div>
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">Sender</div>${avatarCell(t.sender)}</div>
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">Receiver</div>${avatarCell(t.receiver)}</div>
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">Amount</div><span style="font-size:20px;font-weight:700;color:#4f46e5;">${formatAmt(t.amount)}</span></div>
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">Type</div>${typeBadge(t.type)}</div>
      <div style="grid-column:1/-1"><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">Date & Time</div>${t.date}</div>
    </div>`;
  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() { document.getElementById('modalOverlay')?.classList.remove('active'); }
