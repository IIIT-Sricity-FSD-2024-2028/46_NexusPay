/**
 * profile.js — Admin Profile Page (Redesigned)
 * Premium glassmorphism hero, horizontal stats, personal info, timeline
 */

const PROFILE_SETTINGS_KEY = 'nexuspay_admin_settings';

const PROFILE_DEFAULTS = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@nexuspay.com',
  role: 'Admin',
  avatarImage: null
};

function loadProfileData() {
  try {
    const saved = localStorage.getItem(PROFILE_SETTINGS_KEY);
    if (saved) return { ...PROFILE_DEFAULTS, ...JSON.parse(saved) };
  } catch (e) { /* ignore */ }
  return { ...PROFILE_DEFAULTS };
}

const ProfileUI = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const p = loadProfileData();
    const initials = ((p.firstName?.charAt(0) || '') + (p.lastName?.charAt(0) || '')).toUpperCase() || 'AA';
    const fullName = `${p.firstName} ${p.lastName}`;
    const role = Auth ? Auth.getRoleLabel(Auth.getCurrentRole()) : p.role;
    const joinDate = 'January 2024';

    const avatarInner = p.avatarImage
      ? `<img src="${p.avatarImage}" alt="Avatar" />`
      : initials;
    const avatarBg = p.avatarImage ? 'background:transparent;' : '';

    container.innerHTML = `
      <div class="profile-page">

        <!-- ─── Hero Banner ─── -->
        <div class="profile-hero">
          <div class="profile-hero-inner">
            <div class="profile-avatar-ring">
              <div class="profile-avatar" style="${avatarBg}">${avatarInner}</div>
              <div class="profile-avatar-status"></div>
            </div>
            <div class="profile-hero-info">
              <h2 class="profile-hero-name">${fullName}</h2>
              <div class="profile-hero-role-badge">
                <i data-lucide="shield" style="width:14px;height:14px;"></i> ${role}
              </div>
              <div class="profile-hero-meta">
                <span class="profile-hero-meta-item">
                  <i data-lucide="mail"></i> ${p.email}
                </span>
                <span class="profile-hero-meta-item">
                  <i data-lucide="calendar"></i> Joined ${joinDate}
                </span>
                <span class="profile-hero-meta-item">
                  <i data-lucide="map-pin"></i> India
                </span>
              </div>
            </div>
            <div class="profile-hero-edit">
              <a href="../settings/index.html" class="btn" id="btn-edit-profile">
                <i data-lucide="pencil"></i> Edit Profile
              </a>
            </div>
          </div>
        </div>


        <!-- ─── Personal Information (full width) ─── -->
        <div class="profile-card">
          <div class="profile-card-header">
            <div class="profile-card-icon" style="background:linear-gradient(135deg,#eef2ff,#e0e7ff);color:#4f46e5;">
              <i data-lucide="user"></i>
            </div>
            <h3 class="profile-card-title">Personal Information</h3>
          </div>
          <div class="profile-card-body">
            <div class="profile-info-grid-full">
              <div class="profile-info-cell">
                <span class="profile-info-key">First Name</span>
                <span class="profile-info-val">${p.firstName}</span>
              </div>
              <div class="profile-info-cell">
                <span class="profile-info-key">Last Name</span>
                <span class="profile-info-val">${p.lastName}</span>
              </div>
              <div class="profile-info-cell">
                <span class="profile-info-key">Email Address</span>
                <span class="profile-info-val">${p.email}</span>
              </div>
              <div class="profile-info-cell">
                <span class="profile-info-key">Role</span>
                <span class="profile-info-val"><span class="category-badge">${role}</span></span>
              </div>
              <div class="profile-info-cell">
                <span class="profile-info-key">Member Since</span>
                <span class="profile-info-val">${joinDate}</span>
              </div>
              <div class="profile-info-cell">
                <span class="profile-info-key">Status</span>
                <span class="profile-info-val"><span class="status-completed">Active</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── Recent Activity Timeline ─── -->
        <div class="profile-card profile-timeline">
          <div class="profile-card-header">
            <div class="profile-card-icon" style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);color:#8b5cf6;">
              <i data-lucide="activity"></i>
            </div>
            <h3 class="profile-card-title">Recent Activity</h3>
          </div>
          <div class="profile-card-body">
            <div class="profile-timeline-list">
              ${this.renderTimeline()}
            </div>
            <div style="text-align:center;padding-top:20px;">
              <a href="../logs/index.html" class="btn btn-secondary">
                <i data-lucide="file-text"></i> View All Logs
              </a>
            </div>
          </div>
        </div>

      </div>
    `;

    lucide.createIcons({ nodes: [container] });
  },

  renderTimeline() {
    const items = [
      { icon: 'user-check', color: '#10b981', bg: '#ecfdf5', dot: '#10b981', title: 'Updated profile information', time: '2 hours ago' },
      { icon: 'shield-alert', color: '#f59e0b', bg: '#fffbeb', dot: '#f59e0b', title: 'Reviewed flagged transaction #xn_004', time: '5 hours ago' },
      { icon: 'check-circle', color: '#4f46e5', bg: '#eef2ff', dot: '#4f46e5', title: 'Approved 3 pending transactions', time: 'Yesterday' },
      { icon: 'users', color: '#3b82f6', bg: '#eff6ff', dot: '#3b82f6', title: 'Added new admin user', time: '2 days ago' },
      { icon: 'download', color: '#8b5cf6', bg: '#f5f3ff', dot: '#8b5cf6', title: 'Exported monthly analytics report', time: '3 days ago' }
    ];

    return items.map(a => `
      <div class="profile-timeline-item">
        <div class="profile-timeline-dot" style="background:${a.dot};"></div>
        <div class="profile-timeline-icon" style="color:${a.color};background:${a.bg};">
          <i data-lucide="${a.icon}"></i>
        </div>
        <div class="profile-timeline-content">
          <span class="profile-timeline-title">${a.title}</span>
          <span class="profile-timeline-time">${a.time}</span>
        </div>
      </div>
    `).join('');
  }
};

window.ProfileUI = ProfileUI;
