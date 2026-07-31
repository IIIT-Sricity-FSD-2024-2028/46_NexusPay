import { transactions, loadTransactions } from "./transactions.js";

// ── State ──
let state = {
  directionFilter: 'all', // 'all' | 'sent' | 'received'
  typeFilter: 'all',      // 'all' | 'P2P' | 'P2M' | 'Scheduled' | 'Split'
  searchTerm: '',
};

// ── DOM refs ──
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const els = {
  list: $('transactionList'),
  searchInput: $('searchInput'),
  directionTabs: $('directionTabs'),
  typeFilters: $('typeFilters'),
  // Modal
  modal: $('receiptModal'),
  closeModal: document.querySelector('.close-modal'),
};
let currentReceiptTxnId = '';

// Type color mapping
const typeColors = {
  P2P:       { bg: '#eef2ff', color: '#4f46e5' },
  P2M:       { bg: '#fef3c7', color: '#b45309' },
  Scheduled: { bg: '#ede9fe', color: '#7c3aed' },
  Split:     { bg: '#ecfdf5', color: '#059669' },
};

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
async function init() {
  lucide.createIcons();

  // Load transactions from API before rendering
  await loadTransactions();

  bindEvents();
  render();
  
  // Auto-open receipt if txnId is in URL
  const urlParams = new URLSearchParams(window.location.search);
  const txnId = urlParams.get('txnId');
  if (txnId) {
    const txn = transactions.find(t => t.id == txnId);
    if (txn) {
      setTimeout(() => openReceipt(txn), 100);
    }
  }
}

document.addEventListener('DOMContentLoaded', init);

// ══════════════════════════════════════════
// RENDER
// ══════════════════════════════════════════
function getFiltered() {
  let data = [...transactions];

  // Direction filter
  if (state.directionFilter === 'sent') data = data.filter(t => t.amount < 0);
  if (state.directionFilter === 'received') data = data.filter(t => t.amount > 0);

  // Type filter
  if (state.typeFilter !== 'all') {
    data = data.filter(t => t.type === state.typeFilter);
  }

  // Search
  if (state.searchTerm) {
    const q = state.searchTerm.toLowerCase();
    data = data.filter(t =>
      String(t.name || '').toLowerCase().includes(q) ||
      String(t.category || '').toLowerCase().includes(q) ||
      String(t.type || '').toLowerCase().includes(q) ||
      String(t.vpa || '').toLowerCase().includes(q) ||
      String(t.status || '').toLowerCase().includes(q) ||
      String(t.date || '').toLowerCase().includes(q) ||
      String(t.time || '').toLowerCase().includes(q) ||
      String(t.id || '').toLowerCase().includes(q) ||
      `txn${String(t.id || '').toLowerCase()}`.includes(q)
    );
  }

  // Default sort: Newest First
  data.sort((a, b) => new Date(b.rawDate || b.date) - new Date(a.rawDate || a.date));

  return data;
}

function render() {
  const data = getFiltered();
  els.list.innerHTML = '';

  if (data.length === 0) {
    els.list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No transactions found</h3>
        <p>Try adjusting your filters or search term</p>
      </div>`;
    return;
  }

  data.forEach(item => els.list.appendChild(createRow(item)));
  lucide.createIcons();
}

function createRow(item) {
  const row = document.createElement('div');
  const isFailed = item.status === 'Failed';
  row.className = `transaction-item${isFailed ? ' failed' : ''}`;
  const isExpense = item.amount < 0;
  const formatted = isExpense
    ? `-₹${Math.abs(item.amount).toLocaleString('en-IN')}`
    : `+₹${item.amount.toLocaleString('en-IN')}`;

  const tc = typeColors[item.type] || typeColors.P2P;

  row.innerHTML = `
    <div class="transaction-left">
      <div class="transaction-icon">${item.icon}</div>
      <div class="transaction-info">
        <div class="transaction-name">${item.name}</div>
        <div class="transaction-meta">
          <span class="cat-tag">${item.category}</span>
          <span class="meta-dot"></span>
          <span class="type-badge ${item.type}">${item.type}</span>
          <span class="meta-dot"></span>
          <span>${item.time}</span>
        </div>
      </div>
    </div>
    <div class="transaction-right">
      <div class="transaction-amount ${isExpense ? 'expense' : 'income'}">${formatted}</div>
      <div class="transaction-date">${item.date}</div>
    </div>`;

  row.addEventListener('click', () => openReceipt(item));
  return row;
}

// ══════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════
function openReceipt(t) {
  const isExpense = t.amount < 0;
  const abs = Math.abs(t.amount);
  currentReceiptTxnId = t.id ? `TXN${String(t.id).padStart(10, '0')}` : '';

  $('receiptIcon').textContent = t.icon || '💰';
  $('receiptName').textContent = t.name;
  $('receiptVPA').textContent = t.vpa || `${t.name.toLowerCase().replace(/\s/g, '')}@nexuspay`;
  $('receiptAmountLabel').textContent = isExpense ? 'Amount Sent' : 'Amount Received';
  $('receiptDirectionLabel').textContent = isExpense ? 'Sent To' : 'Received From';
  $('receiptNameDetail').textContent = t.name;
  $('receiptVPADetail').textContent = t.vpa || `${t.name.toLowerCase().replace(/\s/g, '')}@nexuspay`;
  $('receiptCategory').textContent = t.category;
  $('receiptDateTime').textContent = `${t.date} • ${t.time}`;
  $('receiptId').textContent = currentReceiptTxnId || `TXN${Date.now()}`;

  // Transaction type badge
  const typeEl = $('receiptType');
  typeEl.textContent = t.type;
  const tc = typeColors[t.type] || typeColors.P2P;
  typeEl.style.background = tc.bg;
  typeEl.style.color = tc.color;

  const amountEl = $('receiptAmount');
  amountEl.textContent = isExpense ? `-₹${abs.toLocaleString('en-IN')}` : `+₹${abs.toLocaleString('en-IN')}`;
  amountEl.style.color = isExpense ? '#dc2626' : '#16a34a';

  // Status Badge update
  const statusBadge = els.modal.querySelector('.status-badge');
  const isFailed = t.status === 'Failed';
  
  if (isFailed) {
      statusBadge.classList.add('failed');
      statusBadge.innerHTML = '<span class="status-dot"></span> Failed';
      amountEl.style.textDecoration = 'line-through';
      amountEl.style.opacity = '0.6';
  } else {
      statusBadge.classList.remove('failed');
      statusBadge.innerHTML = '<span class="status-dot"></span> Completed';
      amountEl.style.textDecoration = 'none';
      amountEl.style.opacity = '1';
  }

  els.modal.style.display = 'flex';
  requestAnimationFrame(() => els.modal.classList.add('active'));
  lucide.createIcons();
}

function closeReceipt() {
  els.modal.classList.remove('active');
  setTimeout(() => { els.modal.style.display = 'none'; }, 280);
}

// ══════════════════════════════════════════
// EVENT BINDING
// ══════════════════════════════════════════
function bindEvents() {
  // ── Direction Tabs ──
  els.directionTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-item');
    if (!btn) return;
    const dir = btn.dataset.direction;
    state.directionFilter = dir;
    els.directionTabs.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });

  // ── Type Filter Pills ──
  els.typeFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.type-pill');
    if (!btn) return;
    const type = btn.dataset.type;
    state.typeFilter = type;
    els.typeFilters.querySelectorAll('.type-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });

  // ── Search ──
  els.searchInput.addEventListener('input', e => {
    state.searchTerm = e.target.value.trim();
    render();
  });

  // ── Escape key closes modal ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeReceipt();
    }
  });

  // ── Modal close ──
  els.closeModal.addEventListener('click', closeReceipt);
  els.modal.addEventListener('click', e => { if (e.target === els.modal) closeReceipt(); });

  $('closeReceiptBtnAction').addEventListener('click', closeReceipt);
  $('raiseDisputeBtn').addEventListener('click', () => {
    const target = currentReceiptTxnId
      ? `../raiseDispute/RaiseDispute.html?txnId=${encodeURIComponent(currentReceiptTxnId)}`
      : '../raiseDispute/RaiseDispute.html';
    window.location.href = target;
  });
}
