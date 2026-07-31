/**
 * crud.js — Full CRUD Module with Modal Forms & Table
 * Role-aware: shows/hides buttons based on permissions.
 */

/* ───────── Transaction CRUD UI ───────── */

function renderTransactionTable(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const role = Auth.getCurrentRole();
  const perms = Auth.getPermissions(role);
  const transactions = TransactionService.getAll();

  let html = `
    <div class="crud-section">
      <div class="crud-header">
        <div class="crud-title-row">
          <h2 class="crud-title">
            <i data-lucide="arrow-left-right" class="crud-title-icon"></i>
            Manage Transactions
          </h2>
          <span class="crud-count">${transactions.length} records</span>
        </div>
        <div class="crud-actions">
          <div class="search-box">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="txn-search" class="search-input" placeholder="Search transactions..." />
          </div>
          ${perms.canCreate ? `
            <button class="btn btn-primary" id="btn-add-txn" onclick="CrudUI.openAddTransaction()">
              <i data-lucide="plus"></i> Add Transaction
            </button>
          ` : ''}
        </div>
      </div>
      <div class="table-wrapper" id="txn-table-body">
        ${buildTransactionRows(transactions, perms)}
      </div>
      ${transactions.length === 0 ? '<div class="empty-state"><i data-lucide="inbox" class="empty-icon"></i><p>No transactions found</p></div>' : ''}
    </div>
  `;

  container.innerHTML = html;
  lucide.createIcons({ nodes: [container] });

  // Search binding
  const searchInput = document.getElementById('txn-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const results = TransactionService.search(e.target.value);
      const tbody = document.getElementById('txn-table-body');
      tbody.innerHTML = buildTransactionRows(results, perms);
      lucide.createIcons({ nodes: [tbody] });
    });
  }
}

function buildTransactionRows(transactions, perms) {
  if (transactions.length === 0) {
    return '<div class="empty-state"><i data-lucide="inbox" class="empty-icon"></i><p>No matching transactions</p></div>';
  }

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  transactions.forEach(txn => {
    html += `
      <tr>
        <td class="td-id">${txn.id.slice(-6)}</td>
        <td>${Helpers.formatDate(txn.date)}</td>
        <td>
          <div class="td-customer">
            <span class="customer-name">${txn.customer}</span>
            <span class="customer-email">${txn.email}</span>
          </div>
        </td>
        <td class="td-amount">${Helpers.formatCurrency(txn.amount)}</td>
        <td><span class="category-badge">${txn.category}</span></td>
        <td><span class="status-badge ${Helpers.getStatusClass(txn.status)}">${txn.status}</span></td>
        <td class="td-actions">
          <button class="btn-icon btn-view" onclick="CrudUI.viewTransaction('${txn.id}')" title="View">
            <i data-lucide="eye"></i>
          </button>
          ${perms.canUpdate ? `
            <button class="btn-icon btn-edit" onclick="CrudUI.openEditTransaction('${txn.id}')" title="Edit">
              <i data-lucide="pencil"></i>
            </button>
          ` : ''}
          ${perms.canDelete ? `
            <button class="btn-icon btn-delete" onclick="CrudUI.confirmDeleteTransaction('${txn.id}')" title="Delete">
              <i data-lucide="trash-2"></i>
            </button>
          ` : ''}
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  return html;
}

/* ───────── Log CRUD UI ───────── */

function renderLogTable(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const role = Auth.getCurrentRole();
  const perms = Auth.getPermissions(role);
  const logs = LogService.getAll();

  let html = `
    <div class="crud-section">
      <div class="crud-header">
        <div class="crud-title-row">
          <h2 class="crud-title">
            <i data-lucide="file-text" class="crud-title-icon"></i>
            Activity Logs
          </h2>
          <span class="crud-count">${logs.length} entries</span>
        </div>
        <div class="crud-actions">
          <div class="search-box">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="log-search" class="search-input" placeholder="Search logs..." />
          </div>
          <div class="filter-group">
            <select id="log-severity-filter" class="filter-select">
              <option value="All">All Severities</option>
              <option value="Error">Error</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
              <option value="Success">Success</option>
            </select>
          </div>
        </div>
      </div>
      <div class="table-wrapper" id="log-table-body">
        ${buildLogRows(logs, perms)}
      </div>
    </div>
  `;

  container.innerHTML = html;
  lucide.createIcons({ nodes: [container] });

  // Search binding
  const searchInput = document.getElementById('log-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => filterLogs(perms));
  }
  const severityFilter = document.getElementById('log-severity-filter');
  if (severityFilter) {
    severityFilter.addEventListener('change', () => filterLogs(perms));
  }
}

function filterLogs(perms) {
  const query = (document.getElementById('log-search')?.value || '').trim();
  const severity = document.getElementById('log-severity-filter')?.value || 'All';
  let results = LogService.search(query);
  if (severity !== 'All') {
    results = results.filter(l => l.severity === severity);
  }
  const tbody = document.getElementById('log-table-body');
  tbody.innerHTML = buildLogRows(results, perms);
  lucide.createIcons({ nodes: [tbody] });
}

function buildLogRows(logs, perms) {
  if (logs.length === 0) {
    return '<div class="empty-state"><i data-lucide="inbox" class="empty-icon"></i><p>No matching logs</p></div>';
  }

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>User</th>
          <th>Action</th>
          <th>Module</th>
          <th>Severity</th>
          <th>Details</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  logs.forEach(log => {
    html += `
      <tr>
        <td class="td-time">${Helpers.formatDateTime(log.timestamp)}</td>
        <td class="td-user">${log.user}</td>
        <td>${log.action}</td>
        <td><span class="module-badge">${log.module}</span></td>
        <td><span class="severity-badge ${Helpers.getSeverityClass(log.severity)}">${log.severity}</span></td>
        <td class="td-details">${log.details}</td>
        <td class="td-actions">
          <button class="btn-icon btn-view" onclick="CrudUI.viewLog('${log.id}')" title="View">
            <i data-lucide="eye"></i>
          </button>

          ${perms.canDelete ? `
            <button class="btn-icon btn-delete" onclick="CrudUI.confirmDeleteLog('${log.id}')" title="Delete">
              <i data-lucide="trash-2"></i>
            </button>
          ` : ''}
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  return html;
}

/* ───────── Modals ───────── */

function openModal(title, bodyHtml, footerHtml = '') {
  closeModal();
  const modal = Helpers.createElement('div', { className: 'modal-overlay', id: 'crud-modal' });
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" onclick="CrudUI.closeModal()">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    </div>
  `;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('modal-open'));
  lucide.createIcons({ nodes: [modal] });

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function closeModal() {
  const modal = document.getElementById('crud-modal');
  if (modal) {
    modal.classList.remove('modal-open');
    setTimeout(() => modal.remove(), 200);
  }
}

/* ───────── Transaction Forms ───────── */

function openAddTransaction() {
  const body = buildTransactionForm({});
  const footer = `
    <button class="btn btn-secondary" onclick="CrudUI.closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="CrudUI.saveTransaction()">
      <i data-lucide="save"></i> Save
    </button>
  `;
  openModal('Add New Transaction', body, footer);
}

function openEditTransaction(id) {
  const txn = TransactionService.getById(id);
  if (!txn) return Toast.error('Transaction not found');
  const body = buildTransactionForm(txn);
  const footer = `
    <button class="btn btn-secondary" onclick="CrudUI.closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="CrudUI.updateTransaction('${id}')">
      <i data-lucide="save"></i> Update
    </button>
  `;
  openModal('Edit Transaction', body, footer);
}

function viewTransaction(id) {
  const txn = TransactionService.getById(id);
  if (!txn) return Toast.error('Transaction not found');
  const body = `
    <div class="view-details">
      <div class="detail-row"><span class="detail-label">ID</span><span class="detail-value">${txn.id}</span></div>
      <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${Helpers.formatDate(txn.date)}</span></div>
      <div class="detail-row"><span class="detail-label">Customer</span><span class="detail-value">${txn.customer}</span></div>
      <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${txn.email}</span></div>
      <div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value td-amount">${Helpers.formatCurrency(txn.amount)}</span></div>
      <div class="detail-row"><span class="detail-label">Category</span><span class="detail-value"><span class="category-badge">${txn.category}</span></span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="status-badge ${Helpers.getStatusClass(txn.status)}">${txn.status}</span></span></div>
    </div>
  `;
  openModal('Transaction Details', body, `<button class="btn btn-secondary" onclick="CrudUI.closeModal()">Close</button>`);
}

function buildTransactionForm(txn) {
  return `
    <form id="txn-form" class="crud-form" onsubmit="return false;">
      <div class="form-group">
        <label class="form-label" for="txn-customer">Customer Name *</label>
        <input type="text" id="txn-customer" class="form-input" value="${txn.customer || ''}" placeholder="e.g. Rahul Sharma" />
      </div>
      <div class="form-group">
        <label class="form-label" for="txn-email">Email *</label>
        <input type="email" id="txn-email" class="form-input" value="${txn.email || ''}" placeholder="e.g. rahul@gmail.com" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="txn-amount">Amount (₹) *</label>
          <input type="number" id="txn-amount" class="form-input" value="${txn.amount || ''}" placeholder="e.g. 15000" min="0" step="100" />
        </div>
        <div class="form-group">
          <label class="form-label" for="txn-date">Date</label>
          <input type="date" id="txn-date" class="form-input" value="${txn.date || new Date().toISOString().split('T')[0]}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="txn-category">Category *</label>
          <select id="txn-category" class="form-input">
            ${['Electronics', 'Fashion', 'Grocery', 'Food & Dining', 'Services', 'Others']
              .map(c => `<option value="${c}" ${txn.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="txn-status">Status *</label>
          <select id="txn-status" class="form-input">
            ${['Pending', 'Completed', 'Failed', 'Processing']
              .map(s => `<option value="${s}" ${txn.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>
    </form>
  `;
}

function getTransactionFormData() {
  return {
    customer: document.getElementById('txn-customer').value,
    email: document.getElementById('txn-email').value,
    amount: document.getElementById('txn-amount').value,
    date: document.getElementById('txn-date').value,
    category: document.getElementById('txn-category').value,
    status: document.getElementById('txn-status').value
  };
}

function validateTransactionForm(data) {
  const { isValid, errors } = Helpers.validateForm([
    { value: data.customer, name: 'Customer Name', validators: [Helpers.validateRequired, (v, n) => Helpers.validateMinLength(v, 2, n)] },
    { value: data.email, name: 'Email', validators: [Helpers.validateEmail] },
    { value: data.amount, name: 'Amount', validators: [Helpers.validateAmount] },
    { value: data.category, name: 'Category', validators: [Helpers.validateRequired] }
  ]);

  // Show errors next to fields
  Helpers.clearAllFieldErrors(document.getElementById('txn-form'));
  if (!isValid) {
    if (errors['Customer Name']) Helpers.showFieldError(document.getElementById('txn-customer'), errors['Customer Name']);
    if (errors['Email']) Helpers.showFieldError(document.getElementById('txn-email'), errors['Email']);
    if (errors['Amount']) Helpers.showFieldError(document.getElementById('txn-amount'), errors['Amount']);
  }

  return isValid;
}

function saveTransaction() {
  const data = getTransactionFormData();
  if (!validateTransactionForm(data)) return;
  TransactionService.create(data);
  closeModal();
  Toast.success('Transaction added successfully');
  renderTransactionTable('crud-container');
}

function updateTransaction(id) {
  const data = getTransactionFormData();
  if (!validateTransactionForm(data)) return;
  TransactionService.update(id, data);
  closeModal();
  Toast.success('Transaction updated successfully');
  renderTransactionTable('crud-container');
}

function confirmDeleteTransaction(id) {
  const txn = TransactionService.getById(id);
  if (!txn) return Toast.error('Transaction not found');
  const body = `
    <div class="confirm-delete">
      <i data-lucide="alert-triangle" class="confirm-icon"></i>
      <p>Are you sure you want to delete this transaction?</p>
      <div class="confirm-details">
        <strong>${txn.customer}</strong> — ${Helpers.formatCurrency(txn.amount)}
      </div>
      <p class="confirm-warning">This action cannot be undone.</p>
    </div>
  `;
  const footer = `
    <button class="btn btn-secondary" onclick="CrudUI.closeModal()">Cancel</button>
    <button class="btn btn-danger" onclick="CrudUI.deleteTransaction('${id}')">
      <i data-lucide="trash-2"></i> Delete
    </button>
  `;
  openModal('Confirm Delete', body, footer);
}

function deleteTransaction(id) {
  TransactionService.delete(id);
  closeModal();
  Toast.success('Transaction deleted');
  renderTransactionTable('crud-container');
}

/* ───────── Log Forms ───────── */

function openAddLog() {
  const body = buildLogForm({});
  const footer = `
    <button class="btn btn-secondary" onclick="CrudUI.closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="CrudUI.saveLog()">
      <i data-lucide="save"></i> Save
    </button>
  `;
  openModal('Add New Log Entry', body, footer);
}

function openEditLog(id) {
  const log = LogService.getById(id);
  if (!log) return Toast.error('Log not found');
  const body = buildLogForm(log);
  const footer = `
    <button class="btn btn-secondary" onclick="CrudUI.closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="CrudUI.updateLog('${id}')">
      <i data-lucide="save"></i> Update
    </button>
  `;
  openModal('Edit Log Entry', body, footer);
}

function viewLog(id) {
  const log = LogService.getById(id);
  if (!log) return Toast.error('Log not found');
  const body = `
    <div class="view-details">
      <div class="detail-row"><span class="detail-label">ID</span><span class="detail-value">${log.id}</span></div>
      <div class="detail-row"><span class="detail-label">Timestamp</span><span class="detail-value">${Helpers.formatDateTime(log.timestamp)}</span></div>
      <div class="detail-row"><span class="detail-label">User</span><span class="detail-value">${log.user}</span></div>
      <div class="detail-row"><span class="detail-label">Action</span><span class="detail-value">${log.action}</span></div>
      <div class="detail-row"><span class="detail-label">Module</span><span class="detail-value"><span class="module-badge">${log.module}</span></span></div>
      <div class="detail-row"><span class="detail-label">Severity</span><span class="detail-value"><span class="severity-badge ${Helpers.getSeverityClass(log.severity)}">${log.severity}</span></span></div>
      <div class="detail-row"><span class="detail-label">Details</span><span class="detail-value">${log.details}</span></div>
    </div>
  `;
  openModal('Log Details', body, `<button class="btn btn-secondary" onclick="CrudUI.closeModal()">Close</button>`);
}

function buildLogForm(log) {
  return `
    <form id="log-form" class="crud-form" onsubmit="return false;">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="log-user">User *</label>
          <input type="text" id="log-user" class="form-input" value="${log.user || ''}" placeholder="e.g. admin@nexuspay.com" />
        </div>
        <div class="form-group">
          <label class="form-label" for="log-action">Action *</label>
          <input type="text" id="log-action" class="form-input" value="${log.action || ''}" placeholder="e.g. Login, Transaction Approved" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="log-details">Details *</label>
        <textarea id="log-details" class="form-input form-textarea" placeholder="Describe the event...">${log.details || ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="log-module">Module *</label>
          <select id="log-module" class="form-input">
            ${['Auth', 'Transactions', 'Payments', 'Users', 'Security', 'System', 'Disputes', 'Settings', 'Reports', 'API', 'General']
              .map(m => `<option value="${m}" ${log.module === m ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="log-severity">Severity *</label>
          <select id="log-severity" class="form-input">
            ${['Info', 'Success', 'Warning', 'Error']
              .map(s => `<option value="${s}" ${log.severity === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>
    </form>
  `;
}

function getLogFormData() {
  return {
    user: document.getElementById('log-user').value,
    action: document.getElementById('log-action').value,
    details: document.getElementById('log-details').value,
    module: document.getElementById('log-module').value,
    severity: document.getElementById('log-severity').value
  };
}

function validateLogForm(data) {
  const { isValid, errors } = Helpers.validateForm([
    { value: data.user, name: 'User', validators: [Helpers.validateRequired] },
    { value: data.action, name: 'Action', validators: [Helpers.validateRequired, (v, n) => Helpers.validateMinLength(v, 2, n)] },
    { value: data.details, name: 'Details', validators: [Helpers.validateRequired, (v, n) => Helpers.validateMinLength(v, 5, n)] }
  ]);

  Helpers.clearAllFieldErrors(document.getElementById('log-form'));
  if (!isValid) {
    if (errors['User']) Helpers.showFieldError(document.getElementById('log-user'), errors['User']);
    if (errors['Action']) Helpers.showFieldError(document.getElementById('log-action'), errors['Action']);
    if (errors['Details']) Helpers.showFieldError(document.getElementById('log-details'), errors['Details']);
  }

  return isValid;
}

function saveLog() {
  const data = getLogFormData();
  if (!validateLogForm(data)) return;
  LogService.create(data);
  closeModal();
  Toast.success('Log entry added successfully');
  renderLogTable('crud-container');
}

function updateLog(id) {
  const data = getLogFormData();
  if (!validateLogForm(data)) return;
  LogService.update(id, data);
  closeModal();
  Toast.success('Log entry updated');
  renderLogTable('crud-container');
}

function confirmDeleteLog(id) {
  const log = LogService.getById(id);
  if (!log) return Toast.error('Log entry not found');
  const body = `
    <div class="confirm-delete">
      <i data-lucide="alert-triangle" class="confirm-icon"></i>
      <p>Are you sure you want to delete this log entry?</p>
      <div class="confirm-details">
        <strong>${log.action}</strong> by ${log.user}
      </div>
      <p class="confirm-warning">This action cannot be undone.</p>
    </div>
  `;
  const footer = `
    <button class="btn btn-secondary" onclick="CrudUI.closeModal()">Cancel</button>
    <button class="btn btn-danger" onclick="CrudUI.deleteLog('${id}')">
      <i data-lucide="trash-2"></i> Delete
    </button>
  `;
  openModal('Confirm Delete', body, footer);
}

function deleteLog(id) {
  LogService.delete(id);
  closeModal();
  Toast.success('Log entry deleted');
  renderLogTable('crud-container');
}

/* ───────── Export global API ───────── */

window.CrudUI = {
  renderTransactionTable,
  renderLogTable,
  openAddTransaction,
  openEditTransaction,
  viewTransaction,
  saveTransaction,
  updateTransaction,
  confirmDeleteTransaction,
  deleteTransaction,
  openAddLog,
  openEditLog,
  viewLog,
  saveLog,
  updateLog,
  confirmDeleteLog,
  deleteLog,
  openModal,
  closeModal
};
