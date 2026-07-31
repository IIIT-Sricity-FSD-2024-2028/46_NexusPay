/**
 * auth.js — Role Management & Permissions
 * Two roles: Super User (full access), Admin (limited access).
 */

const ROLES = Object.freeze({
  SUPER_USER: 'super_user',
  ADMIN: 'admin'
});

const ROLE_LABELS = Object.freeze({
  [ROLES.SUPER_USER]: 'Super User',
  [ROLES.ADMIN]: 'Admin'
});

const PERMISSIONS = Object.freeze({
  [ROLES.SUPER_USER]: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canViewAnalytics: true,
    canViewLogs: true,
    canManageUsers: true,
    canExport: true
  },
  [ROLES.ADMIN]: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false,
    canViewAnalytics: true,
    canViewLogs: true,
    canManageUsers: false,
    canExport: true
  }
});

const STORAGE_KEY = 'nexuspay_current_role';

function getCurrentRole() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && Object.values(ROLES).includes(stored)) {
    return stored;
  }
  // Default to admin
  setRole(ROLES.ADMIN);
  return ROLES.ADMIN;
}

function setRole(role) {
  if (!Object.values(ROLES).includes(role)) {
    console.error(`Invalid role: ${role}`);
    return false;
  }
  localStorage.setItem(STORAGE_KEY, role);
  return true;
}

function getRoleLabel(role) {
  return ROLE_LABELS[role] || 'Admin';
}

function getPermissions(role) {
  return PERMISSIONS[role] || PERMISSIONS[ROLES.ADMIN];
}

function hasPermission(permission) {
  const role = getCurrentRole();
  const perms = getPermissions(role);
  return perms[permission] === true;
}

function canCreate() { return hasPermission('canCreate'); }
function canUpdate() { return hasPermission('canUpdate'); }
function canDelete() { return hasPermission('canDelete'); }
function canRead()   { return hasPermission('canRead'); }

// Export for use across modules
window.Auth = {
  ROLES,
  ROLE_LABELS,
  getCurrentRole,
  setRole,
  getRoleLabel,
  getPermissions,
  hasPermission,
  canCreate,
  canUpdate,
  canDelete,
  canRead
};
