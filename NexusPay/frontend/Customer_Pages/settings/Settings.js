/* ═══════════════════════════════════════════
   NexusPay — Settings  (JavaScript)
   ═══════════════════════════════════════════ */

// ── DOM References ────────────────────────
// ── Menu Navigation ───────────────────────
function initMenu() {
  const settingsMenu = document.getElementById('settingsMenu');
  if (!settingsMenu) return;
  
  const menuItems = settingsMenu.querySelectorAll('.settings-menu-item');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionName = item.dataset.section;
      if (!sectionName) return;

      // Update menu active state
      menuItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      // Show corresponding section
      const allSections = document.querySelectorAll('.settings-section');
      allSections.forEach(s => s.classList.remove('active'));

      const targetSection = document.getElementById(`section-${sectionName}`);
      if (targetSection) {
        targetSection.classList.add('active');
        console.log(`Switched to section: section-${sectionName}`);
      }
    });
  });
}

// ── Language Selection ────────────────────
function initLanguage() {
  const langGrid = document.getElementById('langGrid');
  if (!langGrid) return;

  const options = langGrid.querySelectorAll('.lang-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;

      const lang = opt.dataset.lang;
      showToast(`Language changed to ${lang.charAt(0).toUpperCase() + lang.slice(1)}`, 'success');
    });
  });
}

// ── PIN Toggle ────────────────────────────
function initPinToggle() {
  const pinToggle = document.getElementById('pinToggle');
  if (!pinToggle) return;

  let pinVisible = false;
  const pinDots = pinToggle.previousElementSibling;

  pinToggle.addEventListener('click', () => {
    pinVisible = !pinVisible;
    pinDots.textContent = pinVisible ? '1234' : '••••';
  });
}

// ── 2FA Toggle ────────────────────────────
function init2FA() {
  const btn2FA = document.getElementById('btn2FA');
  if (!btn2FA) return;

  btn2FA.addEventListener('click', () => {
    if (btn2FA.textContent === 'Enable') {
      btn2FA.textContent = 'Disable';
      btn2FA.style.background = 'var(--green-bg)';
      btn2FA.style.color = 'var(--green)';
      showToast('Two-Factor Authentication enabled', 'success');
    } else {
      btn2FA.textContent = 'Enable';
      btn2FA.style.background = 'var(--red-bg)';
      btn2FA.style.color = 'var(--red)';
      showToast('Two-Factor Authentication disabled', 'danger');
    }
  });
}

// ── Edit Profile ──────────────────────────
function initEditProfile() {
  const editBtn = document.getElementById('editProfileBtn');
  if (!editBtn) return;

  editBtn.addEventListener('click', () => {
    showToast('Profile editor coming soon!', 'success');
  });
}

// ── Logout ────────────────────────────────
function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('nexuspay_session');
    window.location.href = '../../Public_Pages/Signin.html?role=customer';
  });
}

// ── Add Bank Account ──────────────────────
function initAddBank() {
  const addBankBtn = document.getElementById('addBankBtn');
  if (!addBankBtn) return;

  addBankBtn.addEventListener('click', () => {
    showToast('Bank account linking flow will open here', 'success');
  });
}

// ── Toast Notifications ───────────────────
function showToast(message, type = '') {
  const toastWrapEl = document.getElementById('toastWrap');
  if (!toastWrapEl) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastWrapEl.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Init ──────────────────────────────────
function init() {
  initMenu();
  initLanguage();
  initPinToggle();
  init2FA();
  initEditProfile();
  initLogout();
  initAddBank();

  // Check query params for section
  const urlParams = new URLSearchParams(window.location.search);
  const section = urlParams.get('section');
  if (section) {
    const targetItem = document.querySelector(`.settings-menu-item[data-section="${section}"]`);
    if (targetItem) {
        targetItem.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
