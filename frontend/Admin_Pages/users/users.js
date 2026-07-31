/**
 * Users.js — NexusPay Admin Users Page (API-Backed)
 * Customer & Merchant tabs with table, search, pagination, and detail modal.
 * Requires: ../../../shared/api-config.js
 */

let CUSTOMERS = [];
let MERCHANTS = [];

document.addEventListener('DOMContentLoaded', async () => {
  renderSidebar('users');
  renderHeaderBar('header-bar', 'Users');
  lucide.createIcons();
  await loadUsersData();
  renderTab();
  bindEvents();
});

async function loadUsersData() {
  try {
    const users = await api.get('/users');
    CUSTOMERS = users.filter(u => u.role === 'customer').map((u, i) => ({
      id: `CUST${String(i + 1).padStart(3, '0')}`,
      name: u.name, email: u.email, phone: u.phone || '-',
      txns: u.txns || 0, spent: u.spent || '₹0',
      perf: u.perf || '+0%', status: u.status || 'Active', joined: u.joined,
    }));
    MERCHANTS = users.filter(u => u.role === 'merchant').map((u, i) => ({
      id: `MER${String(i + 1).padStart(3, '0')}`,
      name: u.name || u.businessName, email: u.email,
      category: u.category || 'General', revenue: u.revenue || '₹0',
      txns: u.txns || 0, perf: u.perf || '+0%',
      status: u.status || 'Active', joined: u.joined,
    }));
  } catch (e) {
    console.error('Failed to load users from API:', e);
    // Will render empty tables
  }
}

let activeTab = 'customers';
let currentPage = 1;
const PAGE_SIZE = 8;
let searchQuery = '';

// Avatar helpers
const AVATAR_COLORS = ['#4f46e5','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1'];
function avatarColor(name) { let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h); return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]; }
function initials(name) { return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase(); }

function getData() {
  const data = activeTab === 'customers' ? CUSTOMERS : MERCHANTS;
  if (!searchQuery) return data;
  const q = searchQuery.toLowerCase();
  return data.filter(d => d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) || d.id.toLowerCase().includes(q));
}

function statusBadge(s) {
  const isActive = s === 'Active';
  return `<span class="status-badge ${isActive ? 'status-completed' : 'status-failed'}">${s.toLowerCase()}</span>`;
}

function perfBadge(perf) {
  const isPositive = perf.startsWith('+');
  const color = isPositive ? '#10b981' : '#ef4444';
  const arrow = isPositive ? '↗' : '↘';
  return `<span style="display:inline-flex;align-items:center;gap:4px;color:${color};font-weight:500;font-size:13px;"><span>${arrow}</span> ${perf}</span>`;
}

function avatarCell(name) {
  const bg = avatarColor(name);
  return `<div style="display:flex;align-items:center;gap:10px;">
    <div style="width:30px;height:30px;border-radius:50%;background:${bg};color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;">${initials(name)}</div>
    <span>${name}</span>
  </div>`;
}

function renderTab() {
  const data = getData();
  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (currentPage > pages) currentPage = pages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const slice = data.slice(start, start + PAGE_SIZE);

  const isCust = activeTab === 'customers';

  const title = document.getElementById('panelTitle');
  if (title) title.textContent = isCust ? 'Customer Performance' : 'Merchant Performance';

  const input = document.getElementById('searchInput');
  if (input) input.placeholder = `Search ${isCust ? 'customers' : 'merchants'}...`;

  // Table head
  const thead = document.getElementById('tableHead');
  if (thead) {
    thead.innerHTML = isCust
      ? '<th>CUSTOMER ID</th><th>NAME</th><th>EMAIL</th><th>TRANSACTIONS</th><th>TOTAL SPENT</th><th>PERFORMANCE</th><th>STATUS</th>'
      : '<th>MERCHANT ID</th><th>NAME</th><th>CATEGORY</th><th>TRANSACTIONS</th><th>REVENUE</th><th>PERFORMANCE</th><th>STATUS</th>';
  }

  // Table body
  const tbody = document.getElementById('tableBody');
  if (tbody) {
    tbody.innerHTML = slice.length ? slice.map(d => {
      if (isCust) {
        return `<tr onclick="showUserModal('${d.id}')" style="cursor:pointer">
          <td><span style="color:#4f46e5;font-weight:600;">${d.id}</span></td>
          <td>${avatarCell(d.name)}</td>
          <td style="color:#64748b;">${d.email}</td>
          <td>${d.txns}</td>
          <td><strong>${d.spent}</strong></td>
          <td>${perfBadge(d.perf)}</td>
          <td>${statusBadge(d.status)}</td>
        </tr>`;
      } else {
        return `<tr onclick="showUserModal('${d.id}')" style="cursor:pointer">
          <td><span style="color:#4f46e5;font-weight:600;">${d.id}</span></td>
          <td>${avatarCell(d.name)}</td>
          <td style="color:#64748b;">${d.category}</td>
          <td>${d.txns.toLocaleString()}</td>
          <td><strong>${d.revenue}</strong></td>
          <td>${perfBadge(d.perf)}</td>
          <td>${statusBadge(d.status)}</td>
        </tr>`;
      }
    }).join('') : '<tr><td colspan="7" style="text-align:center;padding:40px;color:#94a3b8;">No users found</td></tr>';
  }

  // Pagination
  const info = document.getElementById('pagInfo');
  if (info) info.textContent = total ? `Showing ${start+1}–${Math.min(start+PAGE_SIZE, total)} of ${total}` : 'No results';

  const pagesEl = document.getElementById('pageNumbers');
  if (pagesEl) {
    pagesEl.innerHTML = '';
    for (let i = 1; i <= pages; i++) {
      const btn = document.createElement('button');
      btn.className = 'pagination__page' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.onclick = () => { currentPage = i; renderTab(); };
      pagesEl.appendChild(btn);
    }
  }

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= pages;
}

function bindEvents() {
  document.querySelectorAll('.usr-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.usr-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      currentPage = 1;
      searchQuery = '';
      const input = document.getElementById('searchInput');
      if (input) input.value = '';
      renderTab();
    });
  });

  document.getElementById('searchInput')?.addEventListener('input', e => {
    searchQuery = e.target.value;
    currentPage = 1;
    renderTab();
  });

  document.getElementById('prevBtn')?.addEventListener('click', () => { currentPage--; renderTab(); });
  document.getElementById('nextBtn')?.addEventListener('click', () => { currentPage++; renderTab(); });

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
}

function showUserModal(id) {
  const allData = [...CUSTOMERS, ...MERCHANTS];
  const d = allData.find(x => x.id === id);
  if (!d) return;

  const isCust = d.id.startsWith('CUS');
  document.getElementById('modalBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #e2e8f0;">
      <div style="width:48px;height:48px;border-radius:50%;background:${avatarColor(d.name)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600;">${initials(d.name)}</div>
      <div>
        <div style="font-size:18px;font-weight:600;color:#0f172b;">${d.name}</div>
        <div style="font-size:13px;color:#64748b;">${d.email}</div>
      </div>
      <div style="margin-left:auto;">${statusBadge(d.status)}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">ID</div><span style="color:#4f46e5;font-weight:600;">${d.id}</span></div>
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">Performance</div>${perfBadge(d.perf)}</div>
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">Transactions</div><strong>${isCust ? d.txns : d.txns.toLocaleString()}</strong></div>
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">${isCust ? 'Total Spent' : 'Revenue'}</div><strong>${isCust ? d.spent : d.revenue}</strong></div>
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">${isCust ? 'Phone' : 'Category'}</div>${isCust ? d.phone : d.category}</div>
      <div><div style="color:#94a3b8;font-size:12px;margin-bottom:4px;">Joined</div>${d.joined}</div>
    </div>`;
  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() { document.getElementById('modalOverlay')?.classList.remove('active'); }
