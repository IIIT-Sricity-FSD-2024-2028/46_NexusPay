/* ── DATA (API-backed with fallback) ── */
const months = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

let USERS = [
  {id:'arjun1_npc',   name:'arjun',   email:'arjun@nexuspay.com',  role:'Customer',        joined:'12 Sep 2024', txns:84,  status:'Active'},
  {id:'priya1_npm',   name:'priya',   email:'priya@nexuspay.com',  role:'Merchant',        joined:'18 Sep 2024', txns:312, status:'Active'},
  {id:'ravi1_npc',    name:'ravi',    email:'ravi@nexuspay.com',   role:'Customer',        joined:'01 Oct 2024', txns:27,  status:'Active'},
  {id:'sneha1_npa',   name:'sneha',   email:'sneha@nexuspay.com',  role:'NexusPay Admin',  joined:'05 Oct 2024', txns:0,   status:'Active'},
  {id:'vikram2_npa',  name:'vikram',  email:'vikram@nexuspay.com', role:'NexusPay Admin',  joined:'10 Nov 2024', txns:0,   status:'Active'},
  {id:'meera2_npc',   name:'meera',   email:'meera@nexuspay.com',  role:'Customer',        joined:'20 Nov 2024', txns:51,  status:'Frozen'},
  {id:'aditya2_npm',  name:'aditya',  email:'aditya@nexuspay.com', role:'Merchant',        joined:'02 Dec 2024', txns:178, status:'Active'},
  {id:'kavya3_npc',   name:'kavya',   email:'kavya@nexuspay.com',  role:'Customer',        joined:'14 Dec 2024', txns:9,   status:'Suspended'},
  {id:'nikhil4_npc',  name:'nikhil',  email:'nikhil@nexuspay.com', role:'Customer',        joined:'05 Jan 2025', txns:42,  status:'Active'},
  {id:'divya3_npa',   name:'divya',   email:'divya@nexuspay.com',  role:'NexusPay Admin',  joined:'11 Jan 2025', txns:0,   status:'Active'},
];

const USERS_STORAGE_KEY = 'nexuspay-superuser-users';

let TXNS = [
  {id:'TXN7291', payer:'arjun1_npc',  payee:'priya1_npm',   amount:'₹4,500', type:'P2P',       status:'Successful', date:'26 Mar 2025'},
  {id:'TXN7290', payer:'ravi1_npc',   payee:'aditya2_npm',  amount:'₹12,000',type:'P2M',       status:'Successful', date:'26 Mar 2025'},
  {id:'TXN7289', payer:'meera2_npc',  payee:'nexuspay',     amount:'₹800',   type:'Split',     status:'Pending',    date:'25 Mar 2025'},
  {id:'TXN7288', payer:'nikhil4_npc', payee:'priya1_npm',   amount:'₹6,300', type:'Scheduled', status:'Successful', date:'25 Mar 2025'},
  {id:'TXN7287', payer:'kavya3_npc',  payee:'aditya2_npm',  amount:'₹2,100', type:'P2P',       status:'Failed',     date:'24 Mar 2025'},
  {id:'TXN7286', payer:'arjun1_npc',  payee:'divya3_npa',   amount:'₹9,800', type:'P2M',       status:'Successful', date:'24 Mar 2025'},
  {id:'TXN7285', payer:'ravi1_npc',   payee:'nexuspay',     amount:'₹1,500', type:'Split',     status:'Pending',    date:'23 Mar 2025'},
  {id:'TXN7284', payer:'nikhil4_npc', payee:'priya1_npm',   amount:'₹3,200', type:'P2P',       status:'Successful', date:'23 Mar 2025'},
  {id:'TXN7283', payer:'meera2_npc',  payee:'aditya2_npm',  amount:'₹7,700', type:'Scheduled', status:'Failed',     date:'22 Mar 2025'},
  {id:'TXN7282', payer:'divya3_npa',  payee:'ravi1_npc',    amount:'₹500',   type:'P2P',       status:'Successful', date:'22 Mar 2025'},
];

let DISPUTES = [
  {
    id:'DSP001',
    customer:'arjun1_npc',
    txn:'TXN7280',
    reason:'Duplicate charge',
    amount:'₹4,500',
    raised:'20 Mar 2025',
    assignedAdmin:'sneha1_npa',
    status:'Pending'
  },
  {
    id:'DSP002',
    customer:'ravi1_npc',
    txn:'TXN7271',
    reason:'Payment not received',
    amount:'₹12,000',
    raised:'18 Mar 2025',
    assignedAdmin:'vikram2_npa',
    status:'In Review'
  },
  {
    id:'DSP003',
    customer:'nikhil4_npc',
    txn:'TXN7265',
    reason:'Unauthorized txn',
    amount:'₹6,300',
    raised:'15 Mar 2025',
    assignedAdmin:'divya3_npa',
    status:'Resolved'
  },
  {
    id:'DSP004',
    customer:'kavya3_npc',
    txn:'TXN7258',
    reason:'Wrong amount deducted',
    amount:'₹2,100',
    raised:'12 Mar 2025',
    assignedAdmin:'sneha1_npa',
    status:'In Review'
  },
  {
    id:'DSP005',
    customer:'meera2_npc',
    txn:'TXN7249',
    reason:'Merchant did not deliver',
    amount:'₹9,800',
    raised:'10 Mar 2025',
    assignedAdmin:'vikram2_npa',
    status:'Pending'
  },

  {
    id:'DSP006',
    customer:'arjun1_npc',
    txn:'TXN7281',
    reason:'Incorrect refund',
    amount:'₹1,200',
    raised:'09 Mar 2025',
    assignedAdmin:'divya3_npa',
    status:'Resolved'
  },
  {
    id:'DSP007',
    customer:'ravi1_npc',
    txn:'TXN7282',
    reason:'Delay in settlement',
    amount:'₹3,400',
    raised:'08 Mar 2025',
    assignedAdmin:'sneha1_npa',
    status:'In Review'
  },
  {
    id:'DSP008',
    customer:'nikhil4_npc',
    txn:'TXN7283',
    reason:'Wrong merchant charged',
    amount:'₹2,700',
    raised:'07 Mar 2025',
    assignedAdmin:'vikram2_npa',
    status:'Pending'
  },
  {
    id:'DSP009',
    customer:'kavya3_npc',
    txn:'TXN7284',
    reason:'Transaction timeout but debited',
    amount:'₹5,600',
    raised:'06 Mar 2025',
    assignedAdmin:'divya3_npa',
    status:'In Review'
  },
  {
    id:'DSP010',
    customer:'meera2_npc',
    txn:'TXN7285',
    reason:'Duplicate payment',
    amount:'₹2,300',
    raised:'05 Mar 2025',
    assignedAdmin:'vikram2_npa',
    status:'Resolved'
  },
  {
    id:'DSP011',
    customer:'arjun1_npc',
    txn:'TXN7286',
    reason:'Failed txn but amount deducted',
    amount:'₹8,900',
    raised:'04 Mar 2025',
    assignedAdmin:'sneha1_npa',
    status:'Pending'
  },
  {
    id:'DSP012',
    customer:'ravi1_npc',
    txn:'TXN7287',
    reason:'Refund not processed',
    amount:'₹1,800',
    raised:'03 Mar 2025',
    assignedAdmin:'divya3_npa',
    status:'In Review'
  },
  {
    id:'DSP013',
    customer:'nikhil4_npc',
    txn:'TXN7288',
    reason:'Unauthorized subscription',
    amount:'₹999',
    raised:'02 Mar 2025',
    assignedAdmin:'vikram2_npa',
    status:'Resolved'
  },
  {
    id:'DSP014',
    customer:'kavya3_npc',
    txn:'TXN7289',
    reason:'Amount debited twice',
    amount:'₹4,200',
    raised:'01 Mar 2025',
    assignedAdmin:'sneha1_npa',
    status:'Pending'
  },
  {
    id:'DSP015',
    customer:'meera2_npc',
    txn:'TXN7290',
    reason:'Merchant fraud claim',
    amount:'₹11,500',
    raised:'28 Feb 2025',
    assignedAdmin:'divya3_npa',
    status:'In Review'
  }
];

let ROLES_DATA = [
  {user:'Arjun Mehta',  role:'Customer',       perms:['R'],       assignedBy:'System'},
  {user:'Priya Sharma', role:'Merchant',       perms:['R','C'],   assignedBy:'System'},
  {user:'Sneha Nair',   role:'NexusPay Admin', perms:['R','U'],   assignedBy:'Super Admin'},
  {user:'Vikram Singh', role:'NexusPay Admin',     perms:['R'],       assignedBy:'Super Admin'},
  {user:'Divya Menon',  role:'NexusPay Admin', perms:['R','U'],   assignedBy:'Super Admin'},
];

const ROLE_MATRIX = {
  'Customer':       ['R','—','—','—','—','—','—'],
  'Merchant':       ['R','—','—','R','—','—','—'],
  'NexusPay Admin': ['RU','R','CRUD','R','—','—','R'],
  'Super User':     ['CRUD','CRUD','CRUD','CRUD','CRUD','CRUD','CRUD'],
};

let notifications = [
  {
    id: 'notif-disputes',
    title: '5 disputes need review',
    body: 'Pending and in-review disputes are waiting for super admin attention.',
    type: 'warn',
    time: '2 min ago',
    actionLabel: 'Open Disputes',
    action: { kind: 'page', page: 'disputes' }
  },
  {
    id: 'notif-fraud',
    title: '3 flagged accounts detected',
    body: 'Risk engine marked suspicious activity and frozen affected accounts.',
    type: 'danger',
    time: '8 min ago',
    actionLabel: 'View Fraud Queue',
    action: { kind: 'page', page: 'fraud' }
  },
  {
    id: 'notif-transactions',
    title: '12 transactions need attention',
    body: 'Recent failed and pending transactions were flagged for manual follow-up.',
    type: 'warn',
    time: '14 min ago',
    actionLabel: 'Check Transactions',
    action: { kind: 'page', page: 'transactions' }
  },
  {
    id: 'notif-audit',
    title: 'System config was updated',
    body: 'A recent rules change was logged and added to the audit trail.',
    type: 'success',
    time: '31 min ago',
    actionLabel: 'Open Audit Logs',
    action: { kind: 'page', page: 'audit' }
  }
];
let editingRoleName = null;

let FRAUD_DATA = [
  {user:'Meera Patel', score:88, reason:'Velocity breach — 23 txns in 10 min',  status:'Frozen',  date:'24 Mar 2025'},
  {user:'Kavya Reddy', score:72, reason:'Multiple failed auth attempts',          status:'Frozen',  date:'23 Mar 2025'},
  {user:'Unknown IP',  score:95, reason:'Bot-like payment pattern detected',      status:'Blocked', date:'26 Mar 2025'},
];

let AUDIT_DATA = [
  {dot:'green', action:'Dispute DSP003 resolved',         by:'Super Admin', time:'Today 10:42 AM'},
  {dot:'red',    action:'Account frozen: Meera Patel (fraud flag)',           by:'Super Admin', time:'Today 09:15 AM'},
  {dot:'green',  action:'Dispute DSP001 force-approved & refund issued',      by:'Super Admin', time:'Yesterday 04:30 PM'},
  {dot:'orange', action:'System config updated: daily limit ₹2,00,000',      by:'Super Admin', time:'Yesterday 02:10 PM'},
  {dot:'purple', action:'New user created: Nikhil Joshi (Customer)',          by:'Super Admin', time:'25 Mar 2025 11:05 AM'},
  {dot:'red',    action:'Account suspended: Kavya Reddy (5 failed attempts)', by:'System',      time:'24 Mar 2025 08:55 AM'},
  {dot:'green',  action:'Dispute DSP543 rejected — insufficient evidence',    by:'Super Admin', time:'23 Mar 2025 03:45 PM'},
  {dot:'purple', action:'Feature flag toggled: Split payments → enabled',     by:'Super Admin', time:'22 Mar 2025 12:00 PM'},
  {dot:'orange', action:'Gateway credentials rotated: Razorpay',              by:'Super Admin', time:'20 Mar 2025 09:30 AM'},
  {dot:'green',  action:'Manual reconciliation cycle completed',               by:'System',      time:'19 Mar 2025 06:00 AM'},
];

async function loadSuperUserData() {
  try {
    const users = await api.get('/users');
    if (users && users.length) {
      USERS = users.map(u => ({
        id: u.id || u.email.split('@')[0], name: u.email, email: u.email,
        role: u.role === 'admin' ? 'NexusPay Admin' : u.role === 'superuser' ? 'Super User' : u.role === 'merchant' ? 'Merchant' : 'Customer',
        joined: u.joined || 'N/A', txns: u.txns || 0, status: u.status || 'Active',
      }));
    }
    const txns = await api.get('/transactions');
    if (txns && txns.length) {
      TXNS = txns.map(t => ({
        id: t.id, payer: t.sender, payee: t.receiver,
        amount: '₹' + t.amount.toLocaleString('en-IN'),
        type: t.type || 'P2P', status: t.status === 'Completed' ? 'Successful' : t.status, date: t.date,
      }));
    }
    const dsp = await api.get('/disputes');
    if (dsp && dsp.length) {
      DISPUTES = dsp.map(d => ({
        id: d.id, customer: d.customer, txn: d.txnId, reason: d.reason,
        amount: '₹' + d.amount.toLocaleString('en-IN'), raised: d.date,
        assignedAdmin: 'Admin', status: d.status,
      }));
    }
    ROLES_DATA = USERS.filter(u => u.role !== 'Customer').map(u => ({
      user: u.name, role: u.role,
      perms: u.role === 'Super User' ? ['C','R','U','D'] : u.role === 'NexusPay Admin' ? ['R','U'] : ['R'],
      assignedBy: u.role === 'NexusPay Admin' ? 'Super Admin' : 'System',
    }));
    const logs = await api.get('/logs');
    if (logs && logs.length) {
      const dotMap = { Info: 'purple', Success: 'green', Warning: 'orange', Error: 'red' };
      AUDIT_DATA = logs.map(l => ({
        dot: dotMap[l.severity] || 'green', action: l.action + ' — ' + l.details,
        by: l.user, time: l.timestamp,
      }));
    }
  } catch (e) {
    console.warn('SuperUser API loading failed, using fallback data:', e.message);
  }
}

/* ── HELPERS ── */
const avatarColors = ['#6C5DD3','#10C98F','#FF6B9D','#FF9F43','#4EAFF0','#FF5B5B'];
function avatarColor(name){ return avatarColors[name.charCodeAt(0) % avatarColors.length]; }
function initials(name){ return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }

function notificationTime(){
  return new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function auditTime(){
  return new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function logAudit(action, dot = 'purple', by = 'Super Admin'){
  if (!action || /^Navigated to\b/i.test(action)) return;
  AUDIT_DATA.unshift({ action, dot, by, time: auditTime() });
  if (AUDIT_DATA.length > 50) AUDIT_DATA.length = 50;
  renderAudit();
}

function getDisputeCounts(){
  return DISPUTES.reduce((acc, dispute) => {
    acc[dispute.status] = (acc[dispute.status] || 0) + 1;
    return acc;
  }, { Pending: 0, 'In Review': 0, Resolved: 0 });
}

function updateDashboardDisputesSummary(){
  const counts = getDisputeCounts();
  const total = DISPUTES.length;
  const open = counts.Pending + counts['In Review'];
  const countEl = document.getElementById('dashboardDisputesCount');
  const metaEl = document.getElementById('dashboardDisputesMeta');
  const disputeNavBadge = document.querySelector('.nav-item[onclick*="disputes"] .nav-badge');

  if (countEl) countEl.textContent = total;
  if (metaEl) metaEl.textContent = `${open} open`;
  if (disputeNavBadge) disputeNavBadge.textContent = total;
}

function renderNotifications(){
  const list = document.getElementById('notifList');
  const dot = document.querySelector('.notif-dot');
  if (!list || !dot) return;

  if (!notifications.length) {
    list.innerHTML = '<div class="notif-empty">No notifications yet</div>';
    dot.classList.add('hidden');
    return;
  }

  list.innerHTML = notifications.map(item => `
    <div class="notif-entry ${item.action ? 'notif-entry-clickable' : ''}" ${item.action ? `onclick="handleNotificationAction('${item.id}')"` : ''}>
      <div class="notif-entry-dot ${item.type || ''}"></div>
      <div class="notif-entry-content">
        <div class="notif-entry-title">${item.title}</div>
        <div class="notif-entry-body">${item.body}</div>
        <div class="notif-entry-time">${item.time}</div>
        ${item.actionLabel ? `<button class="notif-entry-link" type="button">${item.actionLabel}</button>` : ''}
      </div>
    </div>
  `).join('');

  dot.classList.remove('hidden');
}

function addNotification(title, body, type = ''){
  notifications.unshift({
    id: `notif-${Date.now()}`,
    title,
    body,
    type,
    time: notificationTime()
  });
  notifications = notifications.slice(0, 20);
  renderNotifications();
}

function handleNotificationAction(notificationId){
  const notification = notifications.find(item => item.id === notificationId);
  if (!notification?.action) return;

  toggleNotifications(false);

  if (notification.action.kind === 'page') {
    const navItem = document.querySelector(`.nav-item[onclick*="${notification.action.page}"]`);
    navigate(notification.action.page, navItem);
    showToast(`${notification.title} opened`, 'success');
  }
}

function toggleNotifications(forceOpen){
  const popover = document.getElementById('notifPopover');
  if (!popover) return;
  toggleProfileMenu(false);
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !popover.classList.contains('open');
  popover.classList.toggle('open', shouldOpen);
  popover.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
}

function toggleProfileMenu(forceOpen){
  const popover = document.getElementById('profilePopover');
  const btn = document.getElementById('profileBtn');
  if (!popover || !btn) return;

  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !popover.classList.contains('open');
  if (shouldOpen) toggleNotifications(false);
  popover.classList.toggle('open', shouldOpen);
  popover.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  btn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
}

function initProfileMenu(){
  const btn = document.getElementById('profileBtn');
  const popover = document.getElementById('profilePopover');
  if (!btn || !popover) return;

  btn.addEventListener('click', event => {
    event.stopPropagation();
    toggleProfileMenu();
  });

  popover.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', event => {
    if (!popover.contains(event.target) && !btn.contains(event.target)) toggleProfileMenu(false);
  });
}

function clearNotifications(){
  notifications = [];
  renderNotifications();
}

function initNotifications(){
  const btn = document.getElementById('notifBtn');
  const popover = document.getElementById('notifPopover');
  if (!btn || !popover) return;

  renderNotifications();

  btn.addEventListener('click', event => {
    event.stopPropagation();
    toggleNotifications();
  });

  popover.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', event => {
    if (!popover.contains(event.target) && !btn.contains(event.target)) toggleNotifications(false);
  });
}

function loadUsers(){
  const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (!savedUsers) return;

  try {
    const parsedUsers = JSON.parse(savedUsers);
    if (!Array.isArray(parsedUsers)) return;

    USERS.splice(0, USERS.length, ...parsedUsers);
  } catch (error) {
    console.warn('Unable to load saved users state', error);
  }
}

function saveUsers(){
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(USERS));
}

function updateUserStatus(name, status){
  const user = USERS.find(u => u.name === name);
  if (!user) return false;

  user.status = status;
  saveUsers();
  renderUsers();
  return true;
}

function statusBadge(s){
  const map = {Successful:'badge-success', Pending:'badge-warning', Failed:'badge-danger',
               Active:'badge-success', Frozen:'badge-info', Suspended:'badge-danger', Blocked:'badge-danger',
               'In Review':'badge-info', Resolved:'badge-success'};
  return `<span class="badge ${map[s] || 'badge-gray'}">${s}</span>`;
}

function getUserLabel(userId){
  const user = USERS.find(u => u.id === userId);
  return user ? user.email : userId;
}

/* ── RENDER: DASHBOARD TRANSACTIONS ── */
function renderDashTxns(){
  const tbody = document.getElementById('dashTxnBody');
  tbody.innerHTML = TXNS.slice(0, 5).map(t => `
    <tr>
      <td class="mono">${t.id}</td>
      <td>${t.payer}</td>
      <td class="bold">${t.amount}</td>
      <td><span class="badge badge-gray">${t.type}</span></td>
      <td>${statusBadge(t.status)}</td>
      <td style="color:var(--text-muted)">${t.date}</td>
    </tr>`).join('');
}

/* ── RENDER: USERS ── */
let usersFilter = {q:'', role:'', status:''};
function renderUsers(){
  const tbody = document.getElementById('usersBody');
  let data = USERS.filter(u => {
    if (usersFilter.q && !u.name.toLowerCase().includes(usersFilter.q) && !u.email.includes(usersFilter.q)) return false;
    if (usersFilter.role && u.role !== usersFilter.role) return false;
    if (usersFilter.status && u.status !== usersFilter.status) return false;
    return true;
  });
  tbody.innerHTML = data.map(u => `
    <tr>
      <td>
        <div class="avatar-cell">
          <div class="avatar" style="background:${avatarColor(u.name)};color:#fff">${initials(u.name)}</div>
          <div><div class="avatar-name">${u.id}</div><div class="avatar-sub">${u.email}</div></div>
        </div>
      </td>
      <td><span class="badge ${u.role === 'Super User' ? 'badge-purple' : u.role.includes('Admin') ? 'badge-warning' : 'badge-gray'}">${u.role}</span></td>
      <td style="color:var(--text-muted)">${u.joined}</td>
      <td>${statusBadge(u.status)}</td>
      <td>
        <div style="display:flex;gap:6px">

          ${u.status === 'Active'
            ? `<button class="btn btn-sm btn-danger" onclick="freezeUser('${u.name}')">Freeze</button>`
            : `<button class="btn btn-sm btn-success" onclick="unfreezeUser('${u.name}')">Unfreeze</button>`}

        </div>
      </td>
    </tr>`).join('');
}

function filterUsers(q){ usersFilter.q = q.toLowerCase(); renderUsers(); }
function filterUserRole(r){ usersFilter.role = r; renderUsers(); }
function filterUserStatus(s){ usersFilter.status = s; renderUsers(); }
function freezeUser(n){
  if (updateUserStatus(n, 'Frozen')) {
    logAudit(`User frozen: ${n}`, 'red');
    showToast(`${n} account frozen`, 'warn');
  }
}
function unfreezeUser(n){
  if (updateUserStatus(n, 'Active')) {
    logAudit(`User unfrozen: ${n}`, 'green');
    showToast(`${n} account unfrozen`, 'success');
  }
}

/* ── RENDER: TRANSACTIONS ── */
let txnFilter = {q:'', status:'', type:''};

function renderTxns(){
  const tbody = document.getElementById('txnBody');
  let data = TXNS.filter(t => {
    if (txnFilter.q && !t.id.toLowerCase().includes(txnFilter.q) && !t.payer.toLowerCase().includes(txnFilter.q) && !t.payee.toLowerCase().includes(txnFilter.q)) return false;
    if (txnFilter.type && t.type !== txnFilter.type) return false;
    if (txnFilter.status && t.status !== txnFilter.status) return false;
    return true;
  });
  tbody.innerHTML = data.map(t => {
    const txnData = JSON.stringify(t).replace(/"/g, '&quot;');
    return `
      <tr onclick="showTxnDetails(${txnData})" style="cursor:pointer">
        <td class="mono">${t.id}</td>
        <td>${t.payer}</td>
        <td>${t.payee}</td>
        <td style="font-weight:600">${t.amount}</td>
        <td><span class="badge badge-gray">${t.type}</span></td>
        <td>${statusBadge(t.status)}</td>
        <td style="color:var(--text-muted)">${t.date}</td>
      </tr>`;
  }).join('');
}

function filterTxn(q){ txnFilter.q = q.toLowerCase(); renderTxns(); }
function filterTxnStatus(s){ txnFilter.status = s; renderTxns(); }
function filterTXNtype(t) {txnFilter.type = t; renderTxns()}

/* ── TXN DETAIL MODAL ── */
function showTxnDetails(t){
  const el = document.getElementById('txnDetailContent');
  el.innerHTML = `
    <div class="config-row"><span>Transaction ID</span><span class="mono">${t.id}</span></div>
    <div class="config-row"><span>Payer</span><span>${t.payer}</span></div>
    <div class="config-row"><span>Payee</span><span>${t.payee}</span></div>
    <div class="config-row"><span>Amount</span><span style="font-weight:600">${t.amount}</span></div>
    <div class="config-row"><span>Type</span><span><span class="badge badge-gray">${t.type}</span></span></div>
    <div class="config-row"><span>Status</span><span>${statusBadge(t.status)}</span></div>
    <div class="config-row"><span>Date</span><span style="color:var(--text-muted)">${t.date}</span></div>
  `;
  openModal('txnDetailModal');
}

/* ── RENDER: DISPUTES ── */
let disputeFilter = 'All';

function updateDisputeTabCounts(){
  const counts = getDisputeCounts();

  const allTab = document.getElementById('dispute-tab-all');
  const pendingTab = document.getElementById('dispute-tab-pending');
  const reviewTab = document.getElementById('dispute-tab-review');
  const resolvedTab = document.getElementById('dispute-tab-resolved');

  if (allTab) allTab.textContent = `All (${DISPUTES.length})`;
  if (pendingTab) pendingTab.textContent = `Pending (${counts.Pending})`;
  if (reviewTab) reviewTab.textContent = `In Review (${counts['In Review']})`;
  if (resolvedTab) resolvedTab.textContent = `Resolved (${counts.Resolved})`;
}

function renderDisputes(){
  updateDisputeTabCounts();
  updateDashboardDisputesSummary();
  const tbody = document.getElementById('disputeBody');
  const data = disputeFilter === 'All'
    ? DISPUTES
    : DISPUTES.filter(d => d.status === disputeFilter);
  tbody.innerHTML = data.map(d => `
    <tr>
      <td class="mono">${d.id}</td>
      <td>${d.customer}</td>
      <td class="mono">${d.txn}</td>
      <td>${d.reason}</td>
      <td style="font-weight:600">${d.amount}</td>
      <td style="color:var(--text-muted)">${d.raised}</td>
      <td>${d.assignedAdmin}</td>
      <td>${statusBadge(d.status)}</td>
    </tr>`).join('');
}

function filterDisputes(el, status){
  disputeFilter = status;
  el.parentNode.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderDisputes();
}

/* ── RENDER: ROLES ── */
let detectionRulesEditing = false;

function toggleDetectionRulesEdit(){
  const card = document.getElementById('detectionRulesCard');
  const button = document.getElementById('editDetectionRulesBtn');
  if (!card || !button) return;

  card.querySelectorAll('.config-row-val').forEach((node, index) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'config-input';
    input.disabled = true;
    input.value = node.textContent.trim();
    if (index === 0) input.id = 'ruleMaxTxnLimit';
    node.replaceWith(input);
  });

  const inputs = card.querySelectorAll('.config-input');
  detectionRulesEditing = !detectionRulesEditing;
  inputs.forEach(input => {
    input.disabled = !detectionRulesEditing;
  });

  if (detectionRulesEditing) {
    button.textContent = 'Save Rules';
    if (inputs[0]) inputs[0].focus();
  } else {
    logAudit('Detection rules updated', 'orange');
    button.textContent = 'Edit Rules';
    showToast('Detection rules updated', 'success');
  }
}

function renderRoles(){
  /* Permission matrix */
  const modules = ['Transactions','Users','Disputes','Analytics','Config','Roles','Audit Logs'];
  const roles   = Object.keys(ROLE_MATRIX);
  const mt = document.getElementById('roleMatrix');
  mt.innerHTML = `<thead><tr><th>Module</th>${roles.map(r => `<th>${r}</th>`).join('')}</tr></thead>
    <tbody>${modules.map((m, i) => `<tr><td>${m}</td>${roles.map(r => {
      const v = (ROLE_MATRIX[r] || [])[i] || '—';
      return `<td>${
        v === 'CRUD' ? '<span style="color:var(--purple);font-weight:600">CRUD</span>' :
        v === '—'    ? '<span style="color:var(--border)">—</span>' :
                       `<span style="color:var(--blue)">${v}</span>`
      }</td>`;
    }).join('')}</tr>`).join('')}</tbody>`;

  renderRoleManager();
}

/* ── RENDER: FRAUD ── */
function renderFraud(){
  const tbody = document.getElementById('fraudBody');
  tbody.innerHTML = FRAUD_DATA.map(f => {
    const cls = f.score >= 85 ? 'risk-high' : f.score >= 60 ? 'risk-mid' : 'risk-low';
    return `<tr>
      <td>
        <div class="avatar-cell">
          <div class="avatar" style="background:${avatarColor(f.user)};color:#fff">${initials(f.user)}</div>
          <div class="avatar-name">${f.user}</div>
        </div>
      </td>
      <td>
        <div class="risk-score ${cls}">
          <span style="font-weight:600;min-width:28px">${f.score}</span>
          <div class="risk-bar"><div class="risk-fill" style="width:${f.score}%"></div></div>
        </div>
      </td>
      <td style="color:var(--text-muted);font-size:12px">${f.reason}</td>
      <td>${statusBadge(f.status)}</td>
      <td style="color:var(--text-muted)">${f.date}</td>
      <td>
        <div style="display:flex;gap:5px">
          <button class="btn btn-sm btn-success" onclick="unfreezeFlaggedUser('${f.user}')">Unfreeze</button>
          <button class="btn btn-sm btn-danger" onclick="blockFlaggedUser('${f.user}')">Block</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

/* ── RENDER: AUDIT ── */
function renderAudit(){
  const el = document.getElementById('auditList');
  el.innerHTML = AUDIT_DATA.map(a => `
    <div class="audit-entry">
      <div class="audit-dot ${a.dot}"></div>
      <div>
        <div class="audit-action">${a.action}</div>
        <div class="audit-meta">By ${a.by} &nbsp;·&nbsp; ${a.time}</div>
      </div>
    </div>`).join('');
}

/* ── RENDER: PERM CHECKBOXES ── */
function renderPermCheckboxes(){
  const wrap = document.getElementById('permCheckboxes');
  if (!wrap) return;
  const perms = ['View Users','Edit Users','Manage Transactions','Approve Disputes','View Analytics','Modify Config','Manage Roles','View Audit Logs'];
  wrap.innerHTML = perms.map(p => `
    <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;background:var(--bg);padding:4px 10px;border-radius:6px;border:1px solid var(--border)">
      <input type="checkbox" value="${p}"> ${p}
    </label>`).join('');
}

function getPermissionsFromMatrix(roleName){
  const matrix = ROLE_MATRIX[roleName] || [];
  const permissions = [];
  if (['R','RU','CRUD'].includes(matrix[0])) permissions.push('Manage Transactions');
  if (matrix[1] === 'R' || matrix[1] === 'RU' || matrix[1] === 'CRUD') permissions.push('View Users');
  if (matrix[1] === 'RU' || matrix[1] === 'CRUD') permissions.push('Edit Users');
  if (matrix[2] === 'CRUD') permissions.push('Approve Disputes');
  if (matrix[3] === 'R' || matrix[3] === 'CRUD') permissions.push('View Analytics');
  if (matrix[4] === 'CRUD') permissions.push('Modify Config');
  if (matrix[5] === 'CRUD') permissions.push('Manage Roles');
  if (matrix[6] === 'R' || matrix[6] === 'CRUD') permissions.push('View Audit Logs');
  return permissions;
}

function renderRoleManager(){
  const wrap = document.getElementById('roleManagerList');
  if (!wrap) return;

  wrap.innerHTML = Object.keys(ROLE_MATRIX).map(roleName => `
    <div class="role-manager-row">
      <div>
        <div class="role-manager-name">${roleName}</div>
        <div class="role-manager-meta">${getPermissionsFromMatrix(roleName).length || 0} mapped permission groups</div>
      </div>
      <div class="role-manager-actions">
        <button class="btn btn-sm" onclick="openEditRoleModal('${roleName}')">Edit Role</button>
        <button class="btn btn-sm btn-danger" onclick="removeRoleAction('${roleName}')">Remove</button>
      </div>
    </div>
  `).join('');
}

function resetRoleModal(){
  editingRoleName = null;
  document.getElementById('roleModalTitle').textContent = 'Create New Role';
  document.getElementById('roleModalActionBtn').textContent = 'Create Role';
  document.getElementById('roleNameInput').value = '';
  document.getElementById('roleDescriptionInput').value = '';
  document.querySelectorAll('#permCheckboxes input').forEach(input => { input.checked = false; });
}

function openEditRoleModal(roleName){
  editingRoleName = roleName;
  openModal('addRoleModal');
  document.getElementById('roleModalTitle').textContent = `Edit ${roleName}`;
  document.getElementById('roleModalActionBtn').textContent = 'Save Changes';
  document.getElementById('roleNameInput').value = roleName;
  document.getElementById('roleDescriptionInput').value = '';
  const permissions = getPermissionsFromMatrix(roleName);
  document.querySelectorAll('#permCheckboxes input').forEach(input => {
    input.checked = permissions.includes(input.value);
  });
}

function removeRoleAction(roleName){
  for (let i = ROLES_DATA.length - 1; i >= 0; i -= 1) {
    if (ROLES_DATA[i].role === roleName) ROLES_DATA.splice(i, 1);
  }
  delete ROLE_MATRIX[roleName];
  renderRoles();
  logAudit(`Role removed: ${roleName}`, 'red');
  addNotification('Role Removed', `${roleName} was removed from Roles & Permissions and the permission matrix.`, 'warn');
  showToast(`${roleName} role removed`, 'warn');
}

function unfreezeFlaggedUser(userName){
  logAudit(`Flagged account unfrozen: ${userName}`, 'green');
  showToast(`${userName} unfrozen`, 'success');
}

function blockFlaggedUser(userName){
  logAudit(`Flagged account blocked: ${userName}`, 'red');
  showToast(`${userName} permanently blocked`, 'warn');
}

/* ── CHARTS ── */
const chartDefaults = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans', size: 11 }, color: '#8A8FA8' } },
    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans', size: 11 }, color: '#8A8FA8' } }
  }
};

function initCharts(){
  new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: { labels: months, datasets: [{
      data: [160000,170000,190000,215000,195000,225000,295000],
      borderColor: '#6C5DD3', backgroundColor: 'rgba(108,93,211,0.1)',
      fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#6C5DD3'
    }]},
    options: { ...chartDefaults }
  });

  new Chart(document.getElementById('volumeChart'), {
    type: 'bar',
    data: { labels: months, datasets: [{
      data: [1900,2800,2600,3100,2900,3200,4000],
      backgroundColor: '#10C98F', borderRadius: 6, borderSkipped: false
    }]},
    options: { ...chartDefaults }
  });

  new Chart(document.getElementById('methodChart'), {
    type: 'doughnut',
    data: {
      labels: ['UPI','Net Banking','Wallet','Card','Others'],
      datasets: [{ data: [45,25,15,10,5], backgroundColor: ['#6C5DD3','#10C98F','#FF9F43','#4EAFF0','#FF6B9D'], borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { font: { family:'DM Sans', size:11 }, color:'#8A8FA8', boxWidth:10 } } },
      cutout: '65%'
    }
  });

  new Chart(document.getElementById('usersChart'), {
    type: 'bar',
    data: { labels: months, datasets: [{
      data: [2100,2800,3200,3800,3400,4100,4900],
      backgroundColor: '#FF6B9D', borderRadius: 6, borderSkipped: false
    }]},
    options: { ...chartDefaults }
  });

  new Chart(document.getElementById('catChart'), {
    type: 'bar',
    data: {
      labels: ['Food','Transport','Shopping','Utilities','Entertainment','Others'],
      datasets: [{ data: [28,18,24,12,10,8], backgroundColor: '#6C5DD3', borderRadius: 6, borderSkipped: false }]
    },
    options: { ...chartDefaults, indexAxis: 'y' }
  });

  new Chart(document.getElementById('hourlyTxnChart'), {
    type: 'line',
    data: {
      labels: ['12 AM','2 AM','4 AM','6 AM','8 AM','10 AM','12 PM','2 PM','4 PM','6 PM','8 PM','10 PM'],
      datasets: [{
        label: 'Transactions',
        data: [42, 28, 19, 37, 86, 124, 168, 151, 139, 182, 133, 74],
        borderColor: '#10C98F',
        backgroundColor: 'rgba(16,201,143,0.14)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: '#10C98F',
        pointBorderWidth: 0
      }]
    },
    options: {
      ...chartDefaults,
      plugins: {
        legend: {
          display: true,
          labels: { font: { family:'DM Sans', size:11 }, color:'#8A8FA8', boxWidth:10 }
        }
      }
    }
  });

  new Chart(document.getElementById('dauChart'), {
    type: 'line',
    data: {
      labels: Array.from({length:26}, (_, i) => i % 5 === 0 ? String(26 - i) : ' ').reverse(),
      datasets: [{ data: Array.from({length:26}, () => Math.floor(800 + Math.random() * 400)),
        borderColor:'#4EAFF0', backgroundColor:'rgba(78,175,240,0.08)', fill:true, tension:0.4, pointRadius:0 }]
    },
    options: { ...chartDefaults }
  });
}

/* ── NAVIGATION ── */
function navigate(page, el){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  const titles = {
    dashboard:'Dashboard', users:'Users', transactions:'Transactions',
    disputes:'Disputes', roles:'Roles & Permissions', fraud:'Fraud & Risk',
    analytics:'Analytics', audit:'Audit Logs', config:'System Config'
  };
  document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';
}

/* ── TABS ── */
function switchTab(el, pane){
  el.parentNode.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
  document.getElementById(pane).style.display = 'block';
}

/* ── MODALS ── */
function openModal(id){
  document.getElementById(id).classList.add('open');
  if (id === 'addRoleModal') {
    renderPermCheckboxes();
    if (!editingRoleName) resetRoleModal();
  }
}
function closeModal(id){
  document.getElementById(id).classList.remove('open');
  if (id === 'addRoleModal') resetRoleModal();
}
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); }));

function confirmAction(msg, cb){
  document.getElementById('confirmText').textContent = msg;
  document.getElementById('confirmOkBtn').onclick = () => { closeModal('confirmModal'); cb(); };
  openModal('confirmModal');
}

function addUserAction(){
  closeModal('addUserModal');
  logAudit('Created a new user', 'green');
  showToast('New user created successfully', 'success');
}

/* ── TOAST ── */
function buildRoleMatrixFromPermissions(selectedPermissions){
  return [
    selectedPermissions.includes('Manage Transactions') ? 'CRUD' : '—',
    selectedPermissions.includes('Edit Users') ? 'RU' : selectedPermissions.includes('View Users') ? 'R' : '—',
    selectedPermissions.includes('Approve Disputes') ? 'CRUD' : '—',
    selectedPermissions.includes('View Analytics') ? 'R' : '—',
    selectedPermissions.includes('Modify Config') ? 'CRUD' : '—',
    selectedPermissions.includes('Manage Roles') ? 'CRUD' : '—',
    selectedPermissions.includes('View Audit Logs') ? 'R' : '—',
  ];
}

function addRoleAction(){
  const roleNameInput = document.getElementById('roleNameInput');
  const roleDescriptionInput = document.getElementById('roleDescriptionInput');
  const selectedPermissions = Array.from(document.querySelectorAll('#permCheckboxes input:checked')).map(input => input.value);
  const roleName = roleNameInput.value.trim();

  if (!roleName) {
    showToast('Enter a role name', 'warn');
    return;
  }

  if (!editingRoleName && ROLE_MATRIX[roleName]) {
    showToast('Role already exists', 'warn');
    return;
  }

  if (editingRoleName && roleName !== editingRoleName && ROLE_MATRIX[roleName]) {
    showToast('Role already exists', 'warn');
    return;
  }

  if (editingRoleName && roleName !== editingRoleName) {
    ROLES_DATA.forEach(entry => {
      if (entry.role === editingRoleName) entry.role = roleName;
    });
    ROLE_MATRIX[roleName] = ROLE_MATRIX[editingRoleName];
    delete ROLE_MATRIX[editingRoleName];
  }

  const wasEditing = !!editingRoleName;
  ROLE_MATRIX[roleName] = buildRoleMatrixFromPermissions(selectedPermissions);
  renderRoles();
  closeModal('addRoleModal');
  if (wasEditing) {
    logAudit(`Role updated: ${roleName}`, 'green');
    addNotification('Role Updated', `${roleName} was updated in Roles & Permissions and the permission matrix was refreshed.`, 'success');
    showToast(`${roleName} role updated`, 'success');
  } else {
    logAudit(`Role created: ${roleName}`, 'green');
    addNotification('Role Added', `${roleName} was added to the permission matrix and is now available in Roles & Permissions.`, 'success');
    showToast(`${roleName} role created`, 'success');
  }
  roleNameInput.value = '';
  roleDescriptionInput.value = '';
  document.querySelectorAll('#permCheckboxes input').forEach(input => { input.checked = false; });
}

function toggleSetting(toggleEl, label){
  toggleEl.classList.toggle('on');
  const state = toggleEl.classList.contains('on') ? 'enabled' : 'disabled';
  logAudit(`Setting ${state}: ${label}`, state === 'enabled' ? 'green' : 'orange');
}

function logoutAction(){
  confirmAction('Are you sure you want to log out and return to the sign-in page?', () => {
    logAudit('Logged out of Super User Panel', 'red');
    window.location.href = 'auth/Signin.html';
  });
}

function saveLimitsAction(){
  closeModal('editLimitsModal');
  logAudit('Transaction limits updated', 'orange');
  showToast('Limits updated', 'success');
}

function openProfileSettings(){
  toggleProfileMenu(false);
  const configNav = document.querySelector('.nav-item[onclick*="config"]');
  navigate('config', configNav);
}

function showToast(msg, type = ''){
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 2800);
}

/* ── INIT (API-backed) ── */
(async function initAll() {
  await loadSuperUserData();
  renderDashTxns();
  loadUsers();
  renderUsers();
  renderTxns();
  renderDisputes();
  renderRoles();
  renderFraud();
  renderAudit();
  initCharts();
  initNotifications();
  initProfileMenu();
})();

window.onload = () => {
  const activeNav = document.querySelector('.nav-item.active');
  if (activeNav) navigate('dashboard', activeNav);
};
