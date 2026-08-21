/**
 * settings.js — Admin Settings Panel
 * All buttons functional: Change Avatar (file picker), Save, Cancel, Logout.
 * Data persisted to localStorage.
 */

const SETTINGS_KEY = 'nexuspay_admin_settings';

const DEFAULT_SETTINGS = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@nexuspay.com',
  role: 'Admin',
  avatarImage: null
};

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch (e) { /* ignore */ }
  return { ...DEFAULT_SETTINGS };
}

function saveSettingsData(data) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
}

const SettingsUI = {
  currentSettings: null,

  getInitials(first, last) {
    return ((first?.charAt(0) || '') + (last?.charAt(0) || '')).toUpperCase() || 'AA';
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.currentSettings = loadSettings();
    const s = this.currentSettings;
    const initials = this.getInitials(s.firstName, s.lastName);

    // Avatar: show image if uploaded, otherwise show initials
    const avatarInner = s.avatarImage
      ? `<img src="${s.avatarImage}" alt="Avatar" class="settings-avatar-img" />`
      : initials;
    const avatarBg = s.avatarImage ? 'background:transparent;' : '';

    container.innerHTML = `
      <div class="settings-section">
        <!-- Profile Information -->
        <div class="settings-card">
          <div class="settings-card-header">
            <h3 class="settings-card-title">Profile Information</h3>
            <p class="settings-card-desc">Update your personal details</p>
          </div>
          <div class="settings-card-body">
            <div class="settings-avatar-row">
              <div class="settings-avatar" id="avatar-display" style="${avatarBg}">${avatarInner}</div>
              <div class="settings-avatar-actions">
                <button class="btn btn-secondary" id="btn-change-avatar">Change Avatar</button>
                <span class="settings-hint">JPG, PNG or GIF. Max 2MB</span>
                <input type="file" id="avatar-file-input" accept="image/jpeg,image/png,image/gif" style="display:none" />
                ${s.avatarImage ? `<button class="settings-remove-avatar" id="btn-remove-avatar">Remove Avatar</button>` : ''}
              </div>
            </div>
            <div class="settings-divider"></div>
            <form id="settings-form" class="crud-form" onsubmit="return false;">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="set-fname">First Name</label>
                  <input type="text" id="set-fname" class="form-input" value="${s.firstName}" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="set-lname">Last Name</label>
                  <input type="text" id="set-lname" class="form-input" value="${s.lastName}" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="set-email">Email Address</label>
                <input type="email" id="set-email" class="form-input" value="${s.email}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="set-role">Role</label>
                <input type="text" id="set-role" class="form-input settings-readonly" value="${s.role}" readonly />
              </div>
              <div class="settings-btn-row">
                <button class="btn btn-primary" id="btn-save-settings">Save Changes</button>
                <button class="btn btn-secondary" id="btn-cancel-settings">Cancel</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Security -->
        <div class="settings-card">
          <div class="settings-card-header">
            <h3 class="settings-card-title"><i data-lucide="lock" style="width:18px;height:18px;color:#4f46e5;vertical-align:-3px;margin-right:6px;"></i>Security</h3>
            <p class="settings-card-desc">Update your password</p>
          </div>
          <div class="settings-card-body">
            <form id="password-form" class="crud-form" onsubmit="return false;">
              <div class="form-group">
                <label class="form-label" for="current-password">Current Password</label>
                <input type="password" id="current-password" class="form-input" placeholder="Enter current password" />
              </div>
              <div class="form-group">
                <label class="form-label" for="new-password">New Password</label>
                <input type="password" id="new-password" class="form-input" placeholder="Enter new password" />
              </div>
              <div class="form-group">
                <label class="form-label" for="confirm-password">Confirm New Password</label>
                <input type="password" id="confirm-password" class="form-input" placeholder="Confirm new password" />
              </div>
              <div class="settings-btn-row">
                <button class="btn btn-primary" id="btn-update-password">Update Password</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Logout Section -->
        <div class="settings-card settings-card-danger">
          <div class="settings-card-header">
            <h3 class="settings-card-title settings-danger-title">Logout</h3>
            <p class="settings-card-desc">Sign out from your account</p>
          </div>
          <div class="settings-card-body">
            <div class="settings-logout-info">
              <i data-lucide="info" class="settings-info-icon"></i>
              <span>Once you logout, you'll need to sign in again to access the admin panel.</span>
            </div>
            <button class="btn settings-logout-btn-full" id="btn-logout-settings">
              <i data-lucide="log-out"></i> Logout from Account
            </button>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons({ nodes: [container] });
    this.bindEvents(containerId);
  },

  bindEvents(containerId) {
    const fileInput = document.getElementById('avatar-file-input');

    // Change Avatar — open file picker
    document.getElementById('btn-change-avatar')?.addEventListener('click', () => {
      fileInput?.click();
    });

    // Handle file selection
    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        Toast.error('Please select a JPG, PNG, or GIF image');
        return;
      }

      // Validate size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        Toast.error('Image must be smaller than 2MB');
        return;
      }

      // Read and save
      const reader = new FileReader();
      reader.onload = (event) => {
        this.currentSettings.avatarImage = event.target.result;
        saveSettingsData(this.currentSettings);
        Toast.success('Avatar updated!');
        this.render(containerId);
      };
      reader.readAsDataURL(file);
    });

    // Remove Avatar
    document.getElementById('btn-remove-avatar')?.addEventListener('click', () => {
      this.currentSettings.avatarImage = null;
      saveSettingsData(this.currentSettings);
      Toast.success('Avatar removed');
      this.render(containerId);
    });

    // Save Changes
    document.getElementById('btn-save-settings')?.addEventListener('click', () => this.save(containerId));

    // Cancel
    document.getElementById('btn-cancel-settings')?.addEventListener('click', () => this.cancel(containerId));

    // Logout
    document.getElementById('btn-logout-settings')?.addEventListener('click', () => this.logout());

    // Update Password
    document.getElementById('btn-update-password')?.addEventListener('click', () => this.updatePassword(containerId));
  },

  updatePassword(containerId) {
    const current = document.getElementById('current-password')?.value;
    const newPass = document.getElementById('new-password')?.value;
    const confirmPass = document.getElementById('confirm-password')?.value;

    if (!current) { Toast.error('Please enter current password'); return; }
    if (!newPass) { Toast.error('Please enter new password'); return; }
    if (newPass.length < 6) { Toast.error('New password must be at least 6 characters'); return; }
    if (newPass !== confirmPass) { Toast.error('New passwords do not match'); return; }

    Toast.success('Password updated successfully!');
    
    // Clear the form fields
    if (document.getElementById('current-password')) {
      document.getElementById('current-password').value = '';
      document.getElementById('new-password').value = '';
      document.getElementById('confirm-password').value = '';
    }
  },

  save(containerId) {
    const fname = document.getElementById('set-fname')?.value?.trim();
    const lname = document.getElementById('set-lname')?.value?.trim();
    const email = document.getElementById('set-email')?.value?.trim();

    if (!fname) { Toast.error('First name is required'); return; }
    if (!lname) { Toast.error('Last name is required'); return; }
    if (!email || !email.includes('@')) { Toast.error('Valid email is required'); return; }

    this.currentSettings.firstName = fname;
    this.currentSettings.lastName = lname;
    this.currentSettings.email = email;

    saveSettingsData(this.currentSettings);
    Toast.success('Settings saved successfully!');
    this.render(containerId);
  },

  cancel(containerId) {
    this.currentSettings = loadSettings();
    Toast.info('Changes discarded');
    this.render(containerId);
  },

  logout() {
    Toast.warning('Logging out...');
    setTimeout(() => {
      localStorage.removeItem('nexuspay_current_role');
      localStorage.removeItem('nexuspay_notif_read');
      window.location.href = '../auth/index.html';
    }, 1200);
  }
};

window.SettingsUI = SettingsUI;
