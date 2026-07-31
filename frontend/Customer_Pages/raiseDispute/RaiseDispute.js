/* ═══════════════════════════════════════════
   NexusPay — Raise Dispute  (JavaScript)
   ═══════════════════════════════════════════ */

// ── Transaction Data ──────────────────────
// Fetched from the backend API with fallback defaults
const masterDefaults = [
  {
    id: 'TXN9876543212',
    recipient: 'Flipkart',
    email: 'flipkart@nexuspay',
    amount: 1299,
    type: 'debit',
    typeLabel: 'Sent',
    date: 'Mar 7, 2026',
    time: '02:34 PM',
    category: 'Shopping',
    bank: 'HDFC Bank ••1234',
    status: 'Success',
    statusClass: 'success',
    icon: '🛍️'
  },
  {
    id: 'TXN9876543198',
    recipient: 'Rahul Kumar',
    email: 'rahul.k@nexuspay',
    amount: 2000,
    type: 'debit',
    typeLabel: 'Sent',
    date: 'Mar 5, 2026',
    time: '06:20 PM',
    category: 'Friends & Family',
    bank: 'ICICI Bank ••5678',
    status: 'Success',
    statusClass: 'success',
    icon: '🤝'
  },
  {
    id: 'TXN9876543185',
    recipient: 'Priya Sharma',
    email: 'priya.s@nexuspay',
    amount: 1500,
    type: 'credit',
    typeLabel: 'Received',
    date: 'Mar 3, 2026',
    time: '04:45 PM',
    category: 'Friends & Family',
    bank: 'HDFC Bank ••1234',
    status: 'Success',
    statusClass: 'success',
    icon: '💰'
  }
];

// Transactions loaded from the backend API
let transactions = [...masterDefaults];

async function loadDisputeTransactions() {
  try {
    const apiTxns = await api.get('/transactions');
    if (apiTxns && apiTxns.length > 0) {
      const formatted = apiTxns.map(t => ({
        id: t.id || 'TXN-' + Date.now(),
        recipient: t.receiver || t.sender || 'Unknown',
        email: (t.receiver || 'user').toLowerCase().replace(/\s+/g, '.') + '@nexuspay',
        amount: t.amount,
        type: 'debit',
        typeLabel: 'Sent',
        date: t.date || 'Today',
        time: '',
        category: t.category || 'General',
        bank: 'Nexus Wallet',
        status: t.status === 'Completed' ? 'Success' : t.status,
        statusClass: t.status === 'Failed' ? 'failed' : 'success',
        icon: t.type === 'Payment' ? '🛍️' : t.type === 'Transfer' ? '👤' : '💸',
      }));
      transactions = [...formatted, ...masterDefaults];
    }
  } catch (e) {
    console.warn('Using fallback transaction data for disputes:', e.message);
  }
}

// ── Dispute History Data ──────────────────
const disputeHistory = [
  {
    id: 'D001',
    name: 'Amazon',
    email: 'amazon@nexuspay',
    reason: 'Order not delivered/Cancelled',
    categoryTag: 'Merchant Issue',
    amount: 3500,
    date: 'Feb 26, 2026',
    txnDate: 'Feb 25, 2026',
    txnTime: '03:20 PM',
    txnId: 'TXN9876543220',
    bank: 'HDFC Bank ••1234',
    description: 'Order was cancelled by merchant after payment was successful. I have not received any refund yet. Order ID: AMZ123789456',
    resolution: 'Refund of ₹3,500 has been initiated to your HDFC Bank account. It will reflect within 5-7 business days.',
    status: 'resolved',
    statusLabel: 'Resolved',
    statusIcon: '✓'
  },
  {
    id: 'D002',
    name: 'Unknown Merchant',
    email: 'merchant.alert@nexuspay',
    reason: 'Unauthorized/Suspicious transaction',
    categoryTag: 'Security',
    amount: 1200,
    date: 'Feb 21, 2026',
    txnDate: 'Feb 21, 2026',
    txnTime: '08:45 AM',
    txnId: 'TXN9876543211',
    bank: 'ICICI Bank ••5678',
    description: 'I do not recognize this merchant or the payment request. Please investigate this transaction and secure my account.',
    resolution: 'Our team is reviewing the merchant verification logs and device activity linked to this payment.',
    status: 'under-review',
    statusLabel: 'Under Review',
    statusIcon: '⚠'
  },
  {
    id: 'D003',
    name: 'Flipkart',
    email: 'flipkart@nexuspay',
    reason: 'Charged multiple times',
    categoryTag: 'Billing',
    amount: 899,
    date: 'Today',
    txnDate: 'Mar 31, 2026',
    txnTime: '09:15 AM',
    txnId: 'TXN9876543204',
    bank: 'HDFC Bank ••1234',
    description: 'My account shows two debit entries for the same order, but I only placed it once.',
    resolution: 'Your dispute has been registered and is waiting for the merchant response.',
    status: 'pending',
    statusLabel: 'Pending',
    statusIcon: '⊘'
  }
];

// ── State ─────────────────────────────────
let selectedTxnIndex = 0;
let selectedIssue = 'Other';
let activeFilter = 'all';
let notifications = [];

// ── DOM References ────────────────────────
const txnListEl = document.getElementById('txnList');
const txnSearchEl = document.getElementById('txnSearch');
const historyListEl = document.getElementById('historyList');
const historyTabsEl = document.getElementById('historyTabs');
const issueOptionsEl = document.getElementById('issueOptions');
const descriptionEl = document.getElementById('issueDescription');
const submitBtn = document.getElementById('submitDisputeBtn');
const toastWrapEl = document.getElementById('toastWrap');
const disputeModalBackdropEl = document.getElementById('disputeModalBackdrop');
const disputeModalCloseEl = document.getElementById('disputeModalClose');
const notifBtnEl = document.getElementById('notifBtn');
const notifDotEl = document.querySelector('.notif-dot');
const notifPopoverEl = document.getElementById('notifPopover');
const notifListEl = document.getElementById('notifList');
const clearNotifBtnEl = document.getElementById('clearNotifBtn');

function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function getStatusIcon(status) {
  if (status === 'resolved') return '✓';
  if (status === 'under-review') return '!';
  return '•';
}

function getStatusClass(status) {
  if (status === 'resolved') return 'is-resolved';
  if (status === 'under-review') return 'is-review';
  return 'is-pending';
}

function getNotificationTime() {
  return new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function renderNotifications() {
  if (!notifications.length) {
    notifListEl.innerHTML = '<div class="notif-empty">No notifications yet</div>';
    notifDotEl.classList.add('hidden');
    return;
  }

  notifListEl.innerHTML = notifications
    .map((item) => `
      <div class="notif-item">
        <span class="notif-item-accent ${item.type}"></span>
        <div class="notif-item-content">
          <div class="notif-item-title">${item.title}</div>
          <div class="notif-item-body">${item.body}</div>
          <div class="notif-item-time">${item.time}</div>
        </div>
      </div>
    `)
    .join('');

  notifDotEl.classList.remove('hidden');
}

function buildNotificationContent(message, type = 'info') {
  if (message === 'Dispute submitted successfully!') {
    const txn = transactions[selectedTxnIndex];
    return {
      title: 'Dispute Submitted',
      body: `Your dispute for ${txn.recipient} (${txn.id}) was filed successfully and is now waiting for review.`,
      type
    };
  }

  if (message === 'Please select an issue type') {
    return {
      title: 'Issue Type Missing',
      body: 'Choose one dispute reason before submitting so your request can be categorized correctly.',
      type
    };
  }

  if (message === 'Description must be at least 5 characters') {
    return {
      title: 'Description Too Short',
      body: 'Add a little more detail so the dispute team has enough context to review the case.',
      type
    };
  }

  return {
    title: type === 'success' ? 'Action Completed' : type === 'danger' ? 'Action Needed' : 'Update',
    body: message,
    type
  };
}

function addNotification(message, type = 'info') {
  const notification = buildNotificationContent(message, type);
  notifications.unshift({
    title: notification.title,
    body: notification.body,
    type: notification.type,
    time: getNotificationTime()
  });

  notifications = notifications.slice(0, 20);
  renderNotifications();
}

function toggleNotifications(forceOpen) {
  const shouldOpen = typeof forceOpen === 'boolean'
    ? forceOpen
    : !notifPopoverEl.classList.contains('open');

  notifPopoverEl.classList.toggle('open', shouldOpen);
  notifPopoverEl.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
}

function initNotifications() {
  if (!notifBtnEl || !notifDotEl || !notifPopoverEl || !notifListEl || !clearNotifBtnEl) {
    return;
  }

  notifications = [];
  renderNotifications();

  notifBtnEl.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleNotifications();
  });

  notifPopoverEl.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  clearNotifBtnEl.addEventListener('click', () => {
    notifications = [];
    renderNotifications();
  });

  document.addEventListener('click', (event) => {
    if (!notifPopoverEl.contains(event.target) && !notifBtnEl.contains(event.target)) {
      toggleNotifications(false);
    }
  });
}

// ── Render Transaction List ───────────────
function renderTransactions(filter = '') {
  const filtered = transactions.filter(txn => {
    const q = filter.toLowerCase();
    return (
      txn.recipient.toLowerCase().includes(q) ||
      txn.id.toLowerCase().includes(q) ||
      txn.email.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    txnListEl.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M20 20l-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p>No transactions found</p>
      </div>
    `;
    return;
  }

  txnListEl.innerHTML = filtered
    .map((txn, i) => {
      const originalIndex = transactions.indexOf(txn);
      const isSelected = originalIndex === selectedTxnIndex;
      const amountSign = txn.type === 'debit' ? '-' : '+';
      const amountClass = txn.type === 'debit' ? 'debit' : 'credit';
      const badgeClass = txn.statusClass === 'success' ? 'badge-success' : 'badge-failed';

      return `
        <div class="txn-card ${isSelected ? 'selected' : ''}" 
             onclick="selectTransaction(${originalIndex})" 
             id="txn-card-${originalIndex}">
          <div class="txn-card-top">
            <div class="txn-card-recipient">
              <span class="txn-card-name">${txn.recipient}</span>
              <span class="txn-card-badge ${badgeClass}">${txn.status}</span>
            </div>
            <div class="txn-card-amount-wrap">
              <span class="txn-card-amount ${amountClass}">${amountSign}₹${txn.amount}</span>
              <div class="txn-card-date">${txn.typeLabel}<br>${txn.date}<br>${txn.time}</div>
            </div>
          </div>
          <div class="txn-card-email">${txn.email}</div>
          <div class="txn-card-bottom">
            <div class="txn-card-category">
              <span class="category-dot"></span>
              ${txn.category}
            </div>
            <span>${txn.bank}</span>
          </div>
        </div>
      `;
    })
    .join('');
}

// ── Select Transaction ────────────────────
function selectTransaction(index) {
  selectedTxnIndex = index;
  renderTransactions(txnSearchEl.value);
  updateDetails();
}

// ── Update Details Panel ──────────────────
function updateDetails() {
  const txn = transactions[selectedTxnIndex];
  if (!txn) return;

  document.getElementById('detailRecipient').textContent = txn.recipient;
  document.getElementById('detailRecipientEmail').textContent = txn.email;
  document.getElementById('detailAmount').textContent = formatCurrency(txn.amount);
  document.getElementById('detailDate').textContent = `${txn.date} • ${txn.time}`;
  document.getElementById('detailTxnId').textContent = txn.id;
  document.getElementById('detailMethod').textContent = txn.bank;

  const statusEl = document.getElementById('detailStatus');
  statusEl.textContent = txn.status === 'Success' ? 'Completed' : 'Failed';
  statusEl.className = 'detail-value detail-status ' + (txn.status === 'Success' ? 'completed' : 'failed');
}

// ── Issue Options ─────────────────────────
function initIssueOptions() {
  const options = issueOptionsEl.querySelectorAll('.issue-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
      selectedIssue = opt.querySelector('input').value;
    });
  });
}

// ── Render Dispute History ────────────────
function renderHistory(filter = 'all') {
  const filtered = filter === 'all'
    ? disputeHistory
    : disputeHistory.filter(d => d.status === filter);

  if (filtered.length === 0) {
    historyListEl.innerHTML = `
      <div class="empty-state">
        <p>No disputes found for this filter</p>
      </div>
    `;
    return;
  }

  historyListEl.innerHTML = filtered
    .map(d => `
      <div class="history-item" role="button" tabindex="0" onclick="openDisputeModal('${d.id}')" onkeydown="handleHistoryItemKeydown(event, '${d.id}')">
        <div class="history-item-left">
          <span class="history-item-name">${d.name}</span>
          <span class="history-item-reason">${d.reason}</span>
        </div>
        <div class="history-item-right">
          <div class="history-item-amount-wrap">
            <span class="history-item-amount">${formatCurrency(d.amount)}</span>
            <span class="history-item-date">${d.date}</span>
          </div>
          <span class="history-status status-${d.status}">${d.statusIcon} ${d.statusLabel}</span>
        </div>
      </div>
    `)
    .join('');
}

// ── History Tabs ──────────────────────────
function initHistoryTabs() {
  const tabs = historyTabsEl.querySelectorAll('.history-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      renderHistory(activeFilter);
    });
  });
}

// ── Submit Dispute ────────────────────────
function initSubmit() {
  submitBtn.addEventListener('click', () => {
    const description = descriptionEl.value.trim();

    if (!selectedIssue) {
      showToast('Please select an issue type', 'danger');
      return;
    }

    if (description.length < 5) {
      showToast('Description must be at least 5 characters', 'danger');
      return;
    }

    const txn = transactions[selectedTxnIndex];

    // Add to local dispute history for immediate UI update
    const newDispute = {
      id: `D${String(disputeHistory.length + 1).padStart(3, '0')}`,
      name: txn.recipient,
      email: txn.email,
      reason: selectedIssue === 'Other' ? description : selectedIssue,
      categoryTag: txn.type === 'debit' ? 'Transaction Issue' : 'Account Issue',
      amount: txn.amount,
      date: 'Today',
      txnDate: txn.date,
      txnTime: txn.time,
      txnId: txn.id,
      bank: txn.bank,
      description,
      resolution: 'Your dispute has been submitted successfully. Our team will review it and update you shortly.',
      status: 'pending',
      statusLabel: 'Pending',
      statusIcon: '•'
    };

    disputeHistory.unshift(newDispute);

    // Also POST to backend API for server-side persistence
    api.post('/disputes', {
      txnId: txn.id,
      customer: getCurrentUser().name || 'Rajesh Kumar',
      merchant: txn.recipient,
      amount: txn.amount,
      reason: selectedIssue === 'Other' ? description : selectedIssue,
      priority: 'Medium',
      description: description,
    }).catch(err => console.warn('Failed to persist dispute to API:', err.message));

    // Reset form
    descriptionEl.value = '';
    const options = issueOptionsEl.querySelectorAll('.issue-option');
    options.forEach(o => o.classList.remove('selected'));
    options[0].classList.add('selected');
    options[0].querySelector('input').checked = true;
    selectedIssue = options[0].querySelector('input').value;

    // Re-render history
    renderHistory(activeFilter);

    showToast('Dispute submitted successfully!', 'success');
  });
}

// ── Modal Functions ───────────────────────
function openDisputeModal(disputeId) {
  const dispute = disputeHistory.find((item) => item.id === disputeId);
  if (!dispute) return;

  document.getElementById('disputeModalTag').textContent = dispute.categoryTag || 'Issue';
  document.getElementById('disputeModalId').textContent = `ID: ${dispute.id}`;
  document.getElementById('disputeModalStatusIcon').textContent = getStatusIcon(dispute.status);
  document.getElementById('disputeModalStatusText').textContent = dispute.statusLabel;
  document.getElementById('disputeModalStatusWrap').className = `dispute-modal-status ${getStatusClass(dispute.status)}`;
  document.getElementById('disputeModalSubmitted').textContent = `Submitted: ${dispute.date}`;
  document.getElementById('disputeModalRecipient').textContent = dispute.name;
  document.getElementById('disputeModalRecipientEmail').textContent = dispute.email;
  document.getElementById('disputeModalAmount').textContent = formatCurrency(dispute.amount);
  document.getElementById('disputeModalDateTime').textContent = `${dispute.txnDate || 'N/A'} • ${dispute.txnTime || 'N/A'}`;
  document.getElementById('disputeModalTxnId').textContent = dispute.txnId;
  document.getElementById('disputeModalMethod').textContent = dispute.bank;
  document.getElementById('disputeModalReason').textContent = dispute.reason;
  document.getElementById('disputeModalDescription').textContent = dispute.description;
  document.getElementById('disputeModalResolution').textContent = dispute.resolution || 'Waiting for resolution';

  const resolutionWrap = document.getElementById('disputeModalResolutionWrap');
  if(resolutionWrap) resolutionWrap.style.display = dispute.status === 'resolved' ? 'block' : 'none';

  disputeModalBackdropEl.classList.add('open');
  disputeModalBackdropEl.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeDisputeModal() {
  disputeModalBackdropEl.classList.remove('open');
  disputeModalBackdropEl.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function handleHistoryItemKeydown(event, disputeId) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openDisputeModal(disputeId);
  }
}

function initDisputeModal() {
  disputeModalCloseEl.addEventListener('click', closeDisputeModal);
  disputeModalBackdropEl.addEventListener('click', (event) => {
    if (event.target === disputeModalBackdropEl) {
      closeDisputeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && disputeModalBackdropEl.classList.contains('open')) {
      closeDisputeModal();
    }
  });
}

// ── Toast Notifications ───────────────────
function showToast(message, type = '') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastWrapEl.appendChild(toast);
  addNotification(message, type || 'info');

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Search Listener ───────────────────────
txnSearchEl.addEventListener('input', (e) => {
  renderTransactions(e.target.value);
});

// ── Init ──────────────────────────────────
async function init() {
  initNotifications();
  // Load transactions from backend API before rendering
  await loadDisputeTransactions();
  renderTransactions();
  updateDetails();
  initIssueOptions();
  renderHistory();
  initHistoryTabs();
  initDisputeModal();
  initSubmit();
}

document.addEventListener('DOMContentLoaded', init);
