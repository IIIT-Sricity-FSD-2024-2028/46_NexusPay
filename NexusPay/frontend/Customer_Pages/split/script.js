
// Original Split Data (from data.js if exists, if not defined here)
// Note: Assuming transactions and allPeople are in data.js or defined globally.

let state = {
  selectedTxn: null,
  splitType: "equal",
  beneficiaries: [
    { id: "you", name: "You", handle: "you@nexuspay", color: "#6c3bff", emoji: "👤", isYou: true, customAmount: 0 }
  ]
};



let notifCount = 0;
let currentPayingRow = null;
let currentPin = '';
const PIN_LENGTH = 4;

function getActiveHistoryFilter() {
  return document.querySelector('.pill-tab.active')?.dataset.filter || 'all';
}

function prependTransaction(txn) {
  const existingIndex = transactions.findIndex(existing => String(existing.id) === String(txn.id));
  if (existingIndex !== -1) {
    transactions.splice(existingIndex, 1);
  }
  transactions.unshift(txn);

  // Persist to backend API instead of localStorage
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : { name: 'Rajesh Kumar' };
  api.post('/transactions', {
    sender: currentUser.name,
    receiver: txn.name || 'Split Payment',
    amount: Math.abs(txn.amount),
    type: 'Split',
    category: txn.category || 'Transfer',
    status: txn.status || 'Completed',
  }).catch(err => console.warn('Failed to persist split transaction:', err.message));
}

function prependSplitHistoryEntry(entry) {
  const existingIndex = splitHistoryData.findIndex(existing => String(existing.id) === String(entry.id));
  if (existingIndex !== -1) {
    splitHistoryData.splice(existingIndex, 1);
  }
  splitHistoryData.unshift(entry);
}

// ─── INIT ───
async function init() {
  lucide.createIcons();

  // Load split data from API
  if (typeof loadSplitData === 'function') {
    await loadSplitData();
  }

  renderTxnList();
  renderSplitHistory('all');
  
  notifCount = document.querySelectorAll('.notif-row.unread').length;
  updateBadge();
  
  bindEvents();
}

document.addEventListener("DOMContentLoaded", init);

// ─── RENDER TRANSACTIONS ───
function renderTxnList(filter = "") {
  const list = document.getElementById("txnList");
  if (!list) return;
  const filtered = transactions.filter(t =>
    t.name.toLowerCase().includes(filter.toLowerCase()) ||
    t.category.toLowerCase().includes(filter.toLowerCase())
  );
  list.innerHTML = filtered.map(t => `
    <div class="txn-item ${state.selectedTxn?.id === t.id ? 'selected' : ''}"
         onclick="selectTxn('${t.id}')">
      <div class="txn-icon">${t.icon}</div>
      <div class="txn-info">
        <div class="txn-name">${t.name}</div>
        <div class="txn-cat">${t.category}</div>
      </div>
      <div class="txn-right">
        <div class="txn-amount">₹${Math.abs(t.amount).toLocaleString('en-IN')}</div>
        <div class="txn-date">${t.date}</div>
      </div>
    </div>
  `).join("");
}

document.getElementById("txnSearch")?.addEventListener("input", e => renderTxnList(e.target.value));

// ─── SELECT TXN ───
function selectTxn(id) {
  state.selectedTxn = transactions.find(t => String(t.id) === String(id));
  state.beneficiaries.forEach(b => b.customAmount = 0);
  renderTxnList(document.getElementById("txnSearch")?.value || "");
  document.getElementById("splitPanel").classList.add("visible");
  renderSelectedCard();
  renderBeneficiaries();
  updateSummary();
}

function renderSelectedCard() {
  const t = state.selectedTxn;
  document.getElementById("selectedTxnCard").innerHTML = `
    <div class="selected-txn-icon">${t.icon}</div>
    <div class="selected-txn-info">
      <div class="selected-txn-name">${t.name}</div>
      <div class="selected-txn-badge">${t.category} ${t.icon}</div>
    </div>
    <div class="selected-txn-amount">
      <div class="amt">₹${Math.abs(t.amount).toLocaleString('en-IN')}</div>
      <div class="date-lbl">${t.date}</div>
    </div>
  `;
}

function setSplitType(type) {
  state.splitType = type;
  document.getElementById("equalBtn").classList.toggle("active", type === "equal");
  document.getElementById("customBtn").classList.toggle("active", type === "custom");
  if (type === "equal") {
    state.beneficiaries.forEach(b => b.customAmount = 0);
  }
  renderBeneficiaries();
  updateSummary();
}

function renderBeneficiaries() {
  const n = state.beneficiaries.length;
  document.getElementById("beneCountLabel").textContent = `Beneficiaries (${n})`;
  const list = document.getElementById("beneList");
  const amt = state.selectedTxn ? state.selectedTxn.amount : 0;
  const perPerson = state.splitType === "equal" ? (amt / n).toFixed(2) : null;

  list.innerHTML = state.beneficiaries.map((b, i) => {
    const isYou = b.isYou;
    const amountCell = state.splitType === "equal"
      ? `<span class="bene-amount-eq">₹${perPerson}</span>`
      : `<input type="number" class="bene-amount-input" value="${b.customAmount || ''}" min="0"
           placeholder="₹0" oninput="updateCustom(${i}, this.value)"
           style="color: var(--text-dark);">`;
    const removeBtn = !isYou
      ? `<button class="remove-btn" onclick="removeBene(${i})">✕</button>`
      : '';
    return `
      <div class="bene-item">
        <div class="bene-avatar ${isYou ? 'you' : ''}" style="${!isYou ? 'background:' + b.color : ''}">${b.emoji}</div>
        <div class="bene-info">
          <div class="bene-name">${b.name}</div>
          <div class="bene-handle">${b.handle}</div>
        </div>
        ${amountCell}
        ${removeBtn}
      </div>
    `;
  }).join("");
}

function removeBene(i) {
  state.beneficiaries.splice(i, 1);
  renderBeneficiaries();
  updateSummary();
}

function updateCustom(i, val) {
  state.beneficiaries[i].customAmount = parseFloat(val) || 0;
  updateSummary();
}

function updateSummary() {
  if (!state.selectedTxn) return;
  const total = Math.abs(state.selectedTxn.amount);
  const n = state.beneficiaries.length;
  const summaryEl = document.getElementById("splitSummary");
  const contribBanner = document.getElementById("contribBanner");
  const contribAmount = document.getElementById("contribAmount");
  const proceedBtn = document.getElementById("proceedBtn");

  const hasOthers = n > 1;

  if (state.splitType === "equal") {
    const each = (total / n).toFixed(2);
    summaryEl.innerHTML = `
      <div class="summary-label">Equal split preview</div>
      <div class="summary-formula">₹${total} / ${n} = ₹${each} each</div>
      ${!hasOthers ? `<div class="summary-error" style="color:var(--text-mid); font-weight:500;">Please add people to split this bill</div>` : ''}
    `;
    contribBanner.classList.remove("disabled");
    contribAmount.textContent = `₹${each}`;
    proceedBtn.disabled = !hasOthers;
  } else {
    const entered = state.beneficiaries.reduce((s, b) => s + (b.customAmount || 0), 0);
    const diff = (total - entered).toFixed(2);
    const youContrib = (state.beneficiaries[0]?.customAmount || 0).toFixed(2);
    const isValid = Math.abs(parseFloat(diff)) < 0.01;
    summaryEl.innerHTML = `
      <div class="summary-label">Custom split summary</div>
      <div class="summary-formula">Total: ₹${entered.toFixed(2)} / ₹${total}</div>
      ${!hasOthers ? `<div class="summary-error" style="color:var(--text-mid); font-weight:500;">Please add people to split this bill</div>` : (!isValid ? `<div class="summary-error">Amount doesn't match! Difference: ₹${Math.abs(diff).toFixed(2)}</div>` : '')}
    `;
    contribAmount.textContent = `₹${youContrib}`;
    if (isValid && hasOthers) {
      contribBanner.classList.remove("disabled");
      proceedBtn.disabled = false;
    } else {
      if (!isValid) contribBanner.classList.add("disabled");
      proceedBtn.disabled = true;
    }
  }
}

function proceed() {
  const proceedBtn = document.getElementById("proceedBtn");
  const originalText = proceedBtn.textContent;
  proceedBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Processing...';
  const totalAmount = `\u20B9${Math.abs(state.selectedTxn.amount).toLocaleString('en-IN')}`;
  const total = Math.abs(state.selectedTxn.amount);
  const splitCount = state.beneficiaries.length;
  const equalShare = splitCount ? (total / splitCount) : 0;
  const payers = state.beneficiaries
    .filter(b => !b.isYou)
    .map(b => ({
      name: b.name,
      amount: state.splitType === "equal" ? equalShare.toFixed(2) : (b.customAmount || 0).toFixed(2)
    }));
  proceedBtn.disabled = true;
  
  setTimeout(() => {
    proceedBtn.textContent = originalText;
    proceedBtn.disabled = false;
    
    const numPeople = state.beneficiaries.filter(b => !b.isYou).length;
    showStatusPopup('split_sent', {
      totalAmount,
      payers,
      recipient: `${numPeople} participant${numPeople !== 1 ? 's' : ''}`
    });
    showToast('Split request sent successfully', 'success');
  }, 1000);
}

// ─── SPLIT HISTORY LOGIC ───
function renderSplitHistory(filter) {
  const list = document.getElementById('splitHistoryList');
  if (!list) return;
  const filtered = splitHistoryData.filter(item => filter === 'all' || item.type === filter);
  list.innerHTML = filtered.map(item => `
    <div class="split-card" onclick="openSplitDetail(${item.id})">
      <div class="direction-badge ${item.type}">
        <i data-lucide="${item.type === 'sent' ? 'arrow-up-right' : 'arrow-down-left'}"></i>
      </div>
      <div class="split-icon-box">${item.icon}</div>
      <div class="split-main">
        <div class="split-title">${item.title}</div>
        <div class="split-details">${item.type === 'sent' ? 'You sent' : 'You received'} • ${item.people} people</div>
        ${item.comment ? `<div class="split-comment">"${item.comment}"</div>` : ''}
      </div>
      <div class="split-amount-info">
        <div class="total-amt">₹${item.total}</div>
        <div class="share-lbl">Your share: <b>₹${item.yourShare}</b></div>
        <div class="status-row">
          <div class="status-pill ${item.status}">
            <i data-lucide="${item.status === 'pending' ? 'clock' : 'check-circle'}"></i>
            ${item.status === 'pending' ? 'Pending' : 'Completed'}
          </div>
          <span class="date-text">${item.date}</span>
        </div>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

function openSplitDetail(id) {
  const split = splitHistoryData.find(s => s.id === id);
  if (!split) return;
  document.getElementById('modalIcon').textContent = split.icon;
  document.getElementById('modalTitle').textContent = split.title;
  document.getElementById('modalSubTitle').textContent = `₹${split.total} • ${split.people} people`;
  document.getElementById('modalComment').textContent = split.comment ? `"${split.comment}"` : '';
  document.getElementById('modalComment').style.display = split.comment ? 'block' : 'none';
  
  const marker = document.querySelector('.status-marker');
  marker.className = `status-marker ${split.status}`;
  marker.innerHTML = `<i data-lucide="${split.status === 'pending' ? 'clock' : 'check-circle'}"></i> <span>${split.status === 'pending' ? 'Pending payments' : 'All settled'}</span>`;
  document.querySelector('.status-time').textContent = split.date;

  const participantList = document.getElementById('participantList');
  participantList.innerHTML = split.participants.map(p => `
    <div class="participant-item">
      <div class="p-avatar">${p.name.split(' ').map(n => n[0]).join('')}</div>
      <div class="p-info">
        <div class="p-name">${p.name}</div>
        <div class="p-vpa">${p.vpa}</div>
      </div>
      <div class="p-amt">₹${p.amount}</div>
      <div class="p-status ${p.status}">
         ${p.status === 'paid' ? 'Paid' : 'Pending'}
      </div>
      ${p.status === 'pending' && !p.isYou ? `<button class="remind-btn" onclick="remind('${p.name}')">Remind</button>` : ''}
    </div>
  `).join('');

  document.getElementById('modalYourShare').textContent = `₹${split.yourShare}`;
  document.getElementById('splitDetailModalOverlay').classList.add('open');
  lucide.createIcons();
}

function remind(name) { showToast(`Reminder sent to ${name}!`, 'success'); }

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  if (window.lucide) lucide.createIcons({ nodes: [toast] });

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── NOTIFICATION && PIN HANDLING ───
function updateBadge() {
  const notifBadge = document.getElementById('notifBadge');
  if (notifCount > 0) {
    notifBadge.textContent = notifCount;
    notifBadge.style.display = 'flex';
  } else {
    notifBadge.style.display = 'none';
  }
}

function showStatusPopup(type, data) {
  const popup = document.getElementById('status-popup');
  const successView = document.getElementById('status-success-view');
  const failureView = document.getElementById('status-failure-view');
  const amountCard = document.querySelector('#status-success-view .amount-paid-card');
  const splitRequestCard = document.getElementById('split-request-card');
  const splitRequestList = document.getElementById('split-request-list');
  
  const txnId = 'TXN' + Math.random().toString(36).substring(2, 12).toUpperCase();
  const now = new Date();
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedDateTime = now.toLocaleDateString('en-US', options).replace(',', ' •');
  
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const transactionAmount = type === 'split_sent' ? (data.totalAmount || data.amount) : data.amount;
  const parsedAmount = parseFloat(transactionAmount.replace(/[^0-9.-]+/g,""));
  const newTxn = {
      id: txnId.replace('TXN', ''),
      name: type === 'split_sent' ? 'Split Request Created' : data.recipient,
      category: type === 'split_sent' ? "Transfer" : "Food & Dining",
      amount: type === 'split_sent' ? parsedAmount : -parsedAmount,
      date: dateStr,
      time: timeStr,
      icon: type === 'split_sent' ? "👥" : "👤",
      type: "Split",
      vpa: type === 'split_sent' ? "split@nexuspay" : data.recipient.toLowerCase().replace(/\\s/g, '') + "@nexuspay",
      status: type === 'failure' ? "Failed" : "Completed"
  };

  if (type === 'split_sent') {
    prependTransaction(newTxn);
    renderTxnList(document.getElementById("txnSearch")?.value || "");

    const message = document.getElementById('messageInput')?.value.trim() || '';
    const participants = state.beneficiaries.map(person => {
      const amount = state.splitType === 'equal'
        ? parsedAmount / state.beneficiaries.length
        : (person.customAmount || 0);

      return {
        name: person.isYou ? 'You (Suhaas)' : person.name,
        vpa: person.handle,
        amount: Number(amount.toFixed(2)),
        status: person.isYou ? 'paid' : 'pending',
        isYou: Boolean(person.isYou)
      };
    });

    prependSplitHistoryEntry({
      id: Date.now(),
      type: 'sent',
      title: state.selectedTxn?.name || 'Split Payment',
      icon: state.selectedTxn?.icon || '👥',
      people: state.beneficiaries.length,
      comment: message,
      total: parsedAmount,
      yourShare: Number((participants.find(person => person.isYou)?.amount || 0).toFixed(2)),
      status: 'pending',
      date: 'Today',
      participants
    });

    renderSplitHistory(getActiveHistoryFilter());
  } else if (type === 'success') {
    prependTransaction(newTxn);
    renderTxnList(document.getElementById("txnSearch")?.value || "");
  }

  if (type === 'success' || type === 'split_sent') {
    successView.style.display = 'block';
    failureView.style.display = 'none';
    
    document.querySelector('#status-success-view h2').textContent = 
        type === 'split_sent' ? 'Split Request Sent' : 'Payment Successful!';
    document.querySelector('#status-success-view p').textContent = 
        type === 'split_sent' ? 'Your split request has been sent successfully.' : 'Your transaction has been completed.';

    amountCard.style.display = type === 'split_sent' ? 'none' : 'block';
    splitRequestCard.style.display = type === 'split_sent' ? 'block' : 'none';
    document.getElementById('success-amount-display').textContent = data.amount || data.totalAmount || '₹0.00';
    if (type === 'split_sent') {
      splitRequestList.innerHTML = (data.payers?.length ? data.payers : [{ name: 'No participants', amount: '0.00' }]).map(payer => `
        <div class="split-request-row">
          <span class="split-request-name">${payer.name}</span>
          <span class="split-request-amount">₹${payer.amount}</span>
        </div>
      `).join('');
    } else {
      splitRequestList.innerHTML = '';
    }
    document.querySelector('#status-success-view .detail-row:nth-child(1) .detail-label').textContent = 
        type === 'split_sent' ? 'Split Request Sent To' : 'Paid to';
    document.getElementById('success-recipient-name').textContent = data.recipient;
    document.getElementById('success-txn-id').textContent = txnId;
    document.getElementById('success-date-time').textContent = formattedDateTime;
    
  } else if (type === 'failure') {
    successView.style.display = 'none';
    failureView.style.display = 'block';
    
    document.getElementById('failure-amount-display').textContent = data.amount;
    document.getElementById('failure-recipient-name').textContent = data.recipient;
    document.getElementById('failure-txn-id').textContent = txnId;
    document.getElementById('failure-date-time').textContent = formattedDateTime;
  }
  
  popup.classList.add('open');
  lucide.createIcons();
}

function acceptSplit(btn) {
  currentPayingRow = btn.closest('.notif-row');
  
  // Set recipient and amount from the notification
  const recipientName = currentPayingRow.querySelector('.notif-content b:nth-of-type(1)')?.textContent || "Unknown";
  const amountStr = currentPayingRow.querySelector('.notif-content b:nth-of-type(2)')?.textContent || "₹0";
  
  document.getElementById('summary-recipient-name').textContent = recipientName;
  document.getElementById('summary-amount').textContent = amountStr;

  // Reset digits
  const pinDigits = document.querySelectorAll('.pin-digit');
  pinDigits.forEach(input => {
    input.value = '';
    input.classList.remove('filled');
  });

  document.getElementById('pin-popup').classList.add('open');
  setTimeout(() => pinDigits[0]?.focus(), 100);
}

function declineSplit(btn) {
  const row = btn.closest('.notif-row');
  removeNotification(row);
}

function removeNotification(row) {
  if (row.classList.contains('unread')) {
    notifCount--;
    updateBadge();
  }
  row.style.transition = 'opacity 0.2s';
  row.style.opacity = '0';
  setTimeout(() => row.remove(), 200);
}

// ─── BIND EVENTS ───
function bindEvents() {
  // Tabs
  document.querySelectorAll('.pill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pill-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSplitHistory(tab.dataset.filter);
    });
  });

  // Notif Panel
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');
  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = notifPanel.style.display === 'block';
      notifPanel.style.display = isVisible ? 'none' : 'block';
    });
    document.addEventListener('click', (e) => {
      if (!notifPanel.contains(e.target) && e.target !== notifBtn) {
        notifPanel.style.display = 'none';
      }
    });
  }

  document.getElementById('markAllRead')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.notif-row.unread').forEach(row => row.classList.remove('unread'));
    notifCount = 0;
    updateBadge();
  });

  // PIN Inputs Handling
  const pinDigits = document.querySelectorAll('.pin-digit');
  pinDigits.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value) {
        input.classList.add('filled');
        if (index < PIN_LENGTH - 1) {
          pinDigits[index + 1].focus();
        } else {
          // Process payment when all 4 digits are entered
          pinDigits.forEach(i => i.blur());
          setTimeout(() => {
            document.getElementById('pin-popup').classList.remove('open');
            
            const isSuccess = Math.random() > 0.2; // 80% success
            const amtStr = document.getElementById('summary-amount').textContent;
            const recName = document.getElementById('summary-recipient-name').textContent;
            
            showStatusPopup(isSuccess ? 'success' : 'failure', {
              amount: amtStr,
              recipient: recName
            });
            
            if (isSuccess && currentPayingRow) {
              removeNotification(currentPayingRow);
              currentPayingRow = null;
            }
          }, 800); // Small processing delay
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        pinDigits[index - 1].focus();
      }
    });
  });

  // Modal Closers
  document.getElementById('closeDetailModal')?.addEventListener('click', () => {
    document.getElementById('splitDetailModalOverlay').classList.remove('open');
  });

  document.getElementById('close-pin-popup')?.addEventListener('click', () => {
    document.getElementById('pin-popup').classList.remove('open');
  });

  // Message Input
  const messageRow = document.getElementById('messageRow');
  const messageLabel = document.getElementById('messageLabel');
  const messageInput = document.getElementById('messageInput');

  if (messageRow && messageLabel && messageInput) {
    messageRow.addEventListener('click', () => {
      messageLabel.style.display = 'none';
      messageInput.style.display = 'block';
      messageInput.focus();
    });
    messageInput.addEventListener('blur', () => {
      if (!messageInput.value.trim()) {
        messageInput.style.display = 'none';
        messageLabel.style.display = 'inline';
      }
    });
  }
}

function openModal() { document.getElementById("modalOverlay").classList.add("open"); filterPeople(""); }
function closeModal() { document.getElementById("modalOverlay").classList.remove("open"); }
function handleOverlayClick(e) { if (e.target === document.getElementById("modalOverlay")) closeModal(); }

function filterPeople(query) {
  const added = state.beneficiaries.map(b => b.id);
  const filtered = allPeople.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.handle.toLowerCase().includes(query.toLowerCase()));
  const list = document.getElementById("peopleList");
  list.innerHTML = filtered.map(p => {
    const isAdded = added.includes(p.id);
    return `
      <div class="person-item ${isAdded ? 'already-added' : ''}" onclick="${isAdded ? '' : `addPerson('${p.id}')`}">
        <div class="person-avatar" style="background:${p.color}">${p.emoji}</div>
        <div class="person-info">
          <div class="person-name">${p.name}</div>
          <div class="person-handle">${p.handle}</div>
        </div>
        <div class="person-add-icon">${isAdded ? '✓' : '+'}</div>
      </div>
    `;
  }).join("");
}

function addPerson(id) {
  const person = allPeople.find(p => p.id === id);
  if (!person) return;
  state.beneficiaries.push({ ...person, isYou: false, customAmount: 0 });
  closeModal();
  renderBeneficiaries();
  updateSummary();
}
