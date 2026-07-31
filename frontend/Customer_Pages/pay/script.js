

// DOM elements
const amountChips = document.querySelectorAll('#amount-chips button');
const amountInput = document.querySelector('.amount-input input');
const payToInput = document.querySelector('#pay-to');
const popup = document.getElementById('user-popup');
const searchInput = document.getElementById('search-input');
const userList = document.getElementById('user-list');
const closeBtn = document.getElementById('close-popup');
const sideUserItems = document.querySelectorAll('.side-lists .user-item');

// Add beneficiary controls
const addBeneficiaryBtn = document.querySelector('.btn-secondary');
const addBeneficiaryPopup = document.getElementById('add-beneficiary-popup');
const closeAddPopupBtn = document.getElementById('close-add-popup');
const addBeneficiaryForm = document.getElementById('add-beneficiary-form');
const beneficiaryName = document.getElementById('beneficiary-name');
const beneficiaryId = document.getElementById('beneficiary-id');
const beneficiaryNick = document.getElementById('beneficiary-nick');
const beneficiaryNameError = document.getElementById('beneficiary-name-error');
const beneficiaryIdError = document.getElementById('beneficiary-id-error');
const beneficiaryNamePattern = /^[A-Za-z\s]+$/;

// Amount chips functionality
amountChips.forEach(chip => {
  chip.addEventListener('click', () => {
    amountChips.forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    const amount = chip.getAttribute('data-amount');
    amountInput.value = amount;
  });
});

// Custom amount input functionality
amountInput.addEventListener('input', () => {
  amountChips.forEach(c => c.classList.remove('selected'));
});

// Pay To input functionality
const payToWrapper = document.querySelector('.pay-to-input') || document.querySelector('.input-wrapper.pay-to-input');

function openUserPopup() {
  if (!popup) return;
  popup.style.display = 'flex';
  if (searchInput) searchInput.focus();
  renderUsers(users);
}

if (payToInput) {
  payToInput.addEventListener('click', openUserPopup);
} else if (payToWrapper) {
  payToWrapper.addEventListener('click', openUserPopup);
} else {
  console.warn('Pay To input not found; user popup may not open.');
}

// Add Beneficiary button
addBeneficiaryBtn.addEventListener('click', () => {
  addBeneficiaryPopup.style.display = 'flex';
  beneficiaryName.value = '';
  beneficiaryId.value = '';
  beneficiaryNick.value = '';
  clearBeneficiaryErrors();
  beneficiaryName.focus();
});

// Close Add Beneficiary popup
closeAddPopupBtn.addEventListener('click', () => {
  addBeneficiaryPopup.style.display = 'none';
});

addBeneficiaryPopup.addEventListener('click', (e) => {
  if (e.target === addBeneficiaryPopup) {
    addBeneficiaryPopup.style.display = 'none';
  }
});

function setBeneficiaryFieldError(input, errorEl, message) {
  input.classList.add('input-error');
  errorEl.textContent = message;
}

function clearBeneficiaryFieldError(input, errorEl) {
  input.classList.remove('input-error');
  errorEl.textContent = '';
}

function clearBeneficiaryErrors() {
  clearBeneficiaryFieldError(beneficiaryName, beneficiaryNameError);
  clearBeneficiaryFieldError(beneficiaryId, beneficiaryIdError);
}

function validateBeneficiaryForm() {
  const name = beneficiaryName.value.trim();
  const id = beneficiaryId.value.trim();
  let isValid = true;

  clearBeneficiaryErrors();

  if (!name) {
    setBeneficiaryFieldError(beneficiaryName, beneficiaryNameError, 'Beneficiary name is required.');
    isValid = false;
  } else if (!beneficiaryNamePattern.test(name)) {
    setBeneficiaryFieldError(beneficiaryName, beneficiaryNameError, 'Beneficiary name can contain letters only.');
    isValid = false;
  }

  if (!id) {
    setBeneficiaryFieldError(beneficiaryId, beneficiaryIdError, 'NexusPay ID is required.');
    isValid = false;
  } else if (users.some(u => u.id.toLowerCase() === id.toLowerCase())) {
    setBeneficiaryFieldError(beneficiaryId, beneficiaryIdError, 'This NexusPay ID already exists.');
    isValid = false;
  }

  return isValid;
}

beneficiaryName.addEventListener('input', () => {
  const value = beneficiaryName.value.trim();
  if (!value || beneficiaryNamePattern.test(value)) {
    clearBeneficiaryFieldError(beneficiaryName, beneficiaryNameError);
  }
});

beneficiaryId.addEventListener('input', () => {
  if (beneficiaryId.value.trim()) {
    clearBeneficiaryFieldError(beneficiaryId, beneficiaryIdError);
  }
});

addBeneficiaryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = beneficiaryName.value.trim();
  const id = beneficiaryId.value.trim();
  if (!validateBeneficiaryForm()) return;

  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const newUser = { name, id, initials };
  users.push(newUser);

  // Also persist to backend
  const currentUser = getCurrentUser();
  api.post('/beneficiaries', {
    userId: currentUser.userId || 'CUST001',
    name: name,
    vpa: id,
  }).catch(err => console.warn('Failed to persist beneficiary:', err.message));

  renderUsers(users);
  payToInput.value = id;
  addBeneficiaryPopup.style.display = 'none';

  const newItem = document.createElement('div');
  newItem.className = 'user-item';
  newItem.innerHTML = `
    <div class="avatar gradient-blue">${initials}</div>
    <div class="user-info"><strong>${name}</strong><br><span>${id}</span></div>
    <div class="dropdown-container">
        <button class="icon-btn dropdown-trigger"><i data-lucide="more-vertical" class="icon-muted"></i></button>
        <div class="dropdown-menu">
            <button class="dropdown-item" data-action="add-favorite">
                <i data-lucide="star" class="icon-sm"></i>
                Add to Favorites
            </button>
            <button class="dropdown-item" data-action="view-profile">
                <i data-lucide="user" class="icon-sm"></i>
                View Profile
            </button>
            <button class="dropdown-item" data-action="send-money">
                <i data-lucide="send" class="icon-sm"></i>
                Send Money
            </button>
        </div>
    </div>
  `;
  newItem.addEventListener('click', () => {
    payToInput.value = id;
  });
  document.querySelector('.side-lists .card:last-of-type').appendChild(newItem);
  lucide.createIcons();

  showBeneficiarySuccessPopup(name);
});

// Side lists user items functionality
sideUserItems.forEach(item => {
  item.addEventListener('click', () => {
    const name = item.querySelector('strong').textContent;
    const user = users.find(u => u.name === name);
    if (user) {
      payToInput.value = user.id;
    }
  });
});

// Close popup
closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

// Click outside to close
popup.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.style.display = 'none';
  }
});

// Search functionality
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.id.toLowerCase().includes(query)
  );
  renderUsers(filteredUsers);
});

// Render users in popup
function renderUsers(userArray) {
  userList.innerHTML = '';
  if (userArray.length === 0) {
    userList.innerHTML = '<div class="no-results">No users found</div>';
  } else {
    userArray.forEach(user => {
      const userItem = document.createElement('div');
      userItem.className = 'user-item-popup';
      userItem.innerHTML = `
        <div class="avatar ${user.initials === 'AM' || user.initials === 'SP' ? 'gradient-purple' : 'gradient-blue'}">${user.initials}</div>
        <div class="user-info">
          <strong>${user.name}</strong><br><span>${user.id}</span>
        </div>
      `;
      userItem.addEventListener('click', () => {
        payToInput.value = user.id;
        popup.style.display = 'none';
      });
      userList.appendChild(userItem);
    });
  }
}

// Payment flow functionality
const headerPayBtn = document.getElementById('header-pay-btn') || document.querySelector('.btn-primary');
const sendMoneyBtn = document.getElementById('send-money-btn');
const pinPopup = document.getElementById('pin-popup');
const closePinPopup = document.getElementById('close-pin-popup');
const pinDigits = document.querySelectorAll('.pin-digit');
const amountError = document.getElementById('amount-error');

const statusPopup = document.getElementById('status-popup');
const successView = document.getElementById('status-success-view');
const failureView = document.getElementById('status-failure-view');
const doneBtn = document.getElementById('done-btn');
const failureDoneBtn = document.getElementById('failure-done-btn');
const tryAgainBtn = document.getElementById('try-again-btn');

const PIN_LENGTH = 4;

function validateForm() {
  const amount = Number(amountInput.value);
  const recipient = payToInput.value.trim();
  let isValid = true;

  if (!amount || amount <= 0) {
    amountError.style.display = 'block';
    amountInput.parentElement.style.borderColor = '#ef4444';
    isValid = false;
  } else {
    amountError.style.display = 'none';
    amountInput.parentElement.style.borderColor = '';
  }

  if (!recipient) {
    payToInput.parentElement.style.borderColor = '#ef4444';
    isValid = false;
  } else {
    payToInput.parentElement.style.borderColor = '';
  }

  return isValid;
}

function openPinPopup() {
  if (!validateForm()) return;

  const amount = Number(amountInput.value);
  const recipientId = payToInput.value.trim();
  const user = users.find(u => u.id === recipientId) || { name: recipientId, email: recipientId };

  document.getElementById('summary-recipient-name').textContent = user.name;
  document.getElementById('summary-amount').textContent = `₹${amount.toLocaleString('en-IN')}`;

  pinDigits.forEach(input => {
    input.value = '';
    input.classList.remove('filled');
  });

  pinPopup.style.display = 'flex';
  setTimeout(() => pinDigits[0].focus(), 100);
}

// PIN digit input handling
pinDigits.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    if (e.target.value) {
      input.classList.add('filled');
      if (index < PIN_LENGTH - 1) {
        pinDigits[index + 1].focus();
      } else {
        processPayment();
      }
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      pinDigits[index - 1].focus();
    }
  });
});

function processPayment() {
  pinDigits.forEach(input => input.blur());

  setTimeout(() => {
    pinPopup.style.display = 'none';
    const isSuccess = Math.random() > 0.01; // 99% success
    showStatusPopup(isSuccess);
  }, 1000);
}

function showStatusPopup(isSuccess) {
  const amount = Number(amountInput.value);
  const recipientId = payToInput.value.trim();
  const user = users.find(u => u.id === recipientId) || { name: recipientId, id: recipientId, email: recipientId };

  const now = new Date();
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedDateTime = now.toLocaleDateString('en-US', options).replace(',', ' •');

  let txnId = 'TXN' + Math.random().toString(36).substring(2, 12).toUpperCase();

  // Post transaction to backend API (persisted to JSON files on server)
  // This replaces the old localStorage approach — the transaction is now stored
  // server-side and will appear in transaction history, dashboard, admin pages, etc.
  const currentUser = getCurrentUser();
  const senderName = currentUser.email || 'john@example.com';

  api.post('/transactions', {
    sender: senderName,
    receiver: user.name,
    amount: amount,
    type: 'Transfer',
    category: 'Friends & Family',
    status: isSuccess ? 'Completed' : 'Failed',
  }).then(txn => {
    if (txn && txn.id) {
      txnId = txn.id;
      const successTxnEl = document.getElementById('success-txn-id');
      const failureTxnEl = document.getElementById('failure-txn-id');
      if (successTxnEl) successTxnEl.textContent = txnId;
      if (failureTxnEl) failureTxnEl.textContent = txnId;
    }
  }).catch(err => {
    console.warn('Failed to persist transaction to API:', err.message);
  });

  if (isSuccess) {
    successView.style.display = 'block';
    failureView.style.display = 'none';

    document.getElementById('success-amount-display').textContent = `₹${amount.toLocaleString('en-IN')}`;
    document.getElementById('success-recipient-name').textContent = user.name;
    document.getElementById('success-recipient-id').textContent = user.id;
    document.getElementById('success-txn-id').textContent = txnId;
    document.getElementById('success-date-time').textContent = formattedDateTime;
  } else {
    successView.style.display = 'none';
    failureView.style.display = 'block';

    document.getElementById('failure-amount-display').textContent = `₹${amount.toLocaleString('en-IN')}`;
    document.getElementById('failure-recipient-name').textContent = user.name;
    document.getElementById('failure-recipient-id').textContent = user.id;
    document.getElementById('failure-txn-id').textContent = txnId;
    document.getElementById('failure-date-time').textContent = formattedDateTime;
  }

  statusPopup.style.display = 'flex';
  lucide.createIcons();
}

if(headerPayBtn) headerPayBtn.addEventListener('click', openPinPopup);
if(sendMoneyBtn) sendMoneyBtn.addEventListener('click', openPinPopup);

closePinPopup.addEventListener('click', () => {
  pinPopup.style.display = 'none';
});

pinPopup.addEventListener('click', (e) => {
  if (e.target === pinPopup) {
    pinPopup.style.display = 'none';
  }
});

const resetForm = () => {
  amountInput.value = '';
  payToInput.value = '';
  const textarea = document.querySelector('textarea');
  if (textarea) textarea.value = '';
  amountChips.forEach(c => c.classList.remove('selected'));
  const defaultChip = document.querySelector('[data-amount="500"]');
  if (defaultChip) defaultChip.classList.add('selected');
};

if (doneBtn) doneBtn.addEventListener('click', () => {
  statusPopup.style.display = 'none';
  resetForm();
});

if (failureDoneBtn) failureDoneBtn.addEventListener('click', () => {
  statusPopup.style.display = 'none';
});

if (tryAgainBtn) tryAgainBtn.addEventListener('click', () => {
  statusPopup.style.display = 'none';
  openPinPopup();
});

function showBeneficiarySuccessPopup(name) {
  successView.style.display = 'block';
  failureView.style.display = 'none';

  document.querySelector('.amount-paid-card').style.display = 'none';
  document.querySelector('.transaction-details-box').style.display = 'none';

  const headerText = successView.querySelector('h2');
  const subText = successView.querySelector('p');

  headerText.textContent = 'Beneficiary Added!';
  subText.textContent = `${name} has been successfully added to your beneficiaries.`;

  statusPopup.style.display = 'flex';
  lucide.createIcons();

  const originalDone = doneBtn.onclick;
  doneBtn.onclick = () => {
    statusPopup.style.display = 'none';
    document.querySelector('.amount-paid-card').style.display = 'block';
    document.querySelector('.transaction-details-box').style.display = 'block';
    headerText.textContent = 'Payment Successful!';
    subText.textContent = 'Your transaction has been completed';
    doneBtn.onclick = originalDone;
  };
}

// Side lists user items functionality (duplicate removed - already bound above)

// Dropdown functionality for three dots
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown-container')) {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
    });
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.dropdown-trigger')) {
    e.stopPropagation();
    const container = e.target.closest('.dropdown-container');
    const menu = container.querySelector('.dropdown-menu');
    const isShown = menu.classList.contains('show');

    document.querySelectorAll('.dropdown-menu.show').forEach(m => {
      m.classList.remove('show');
    });

    if (!isShown) {
      menu.classList.add('show');
    }
  }
});

// Handle dropdown item clicks
document.addEventListener('click', (e) => {
  if (e.target.closest('.dropdown-item')) {
    e.stopPropagation();
    const item = e.target.closest('.dropdown-item');
    const action = item.getAttribute('data-action');
    const userItem = item.closest('.user-item');
    const userName = userItem ? userItem.querySelector('strong').textContent : '';
    const userId = userItem ? userItem.querySelector('span').textContent : '';

    item.closest('.dropdown-menu').classList.remove('show');

    switch (action) {
      case 'remove-favorite':
        userItem.remove();
        break;
      case 'add-favorite':
        const favoritesCard = document.querySelector('.side-lists .card:first-of-type');
        if (favoritesCard && userItem) {
          const clonedItem = userItem.cloneNode(true);
          const dropdownMenu = clonedItem.querySelector('.dropdown-menu');
          dropdownMenu.innerHTML = `
            <button class="dropdown-item" data-action="remove-favorite">
              <i data-lucide="star-off" class="icon-sm"></i>
              Remove from Favorites
            </button>
            <button class="dropdown-item" data-action="view-profile">
              <i data-lucide="user" class="icon-sm"></i>
              View Profile
            </button>
            <button class="dropdown-item" data-action="send-money">
              <i data-lucide="send" class="icon-sm"></i>
              Send Money
            </button>
          `;
          favoritesCard.appendChild(clonedItem);
          userItem.remove();
          lucide.createIcons();
        }
        break;
      case 'view-profile':
        break;
      case 'send-money':
        payToInput.value = userId;
        break;
    }
  }
});

// Initialize Lucide icons
lucide.createIcons();
