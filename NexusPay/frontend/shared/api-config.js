/**
 * NexusPay — Shared API Configuration
 * Central configuration for all frontend-to-backend API calls.
 * Include this script in every HTML page BEFORE other JS files.
 */
const API_BASE = 'http://localhost:3000/api';

/**
 * Get the current user context.
 * Checks multiple storage keys used by different parts of the app:
 *   1. localStorage 'nexuspay_user'      — set by login pages after API call
 *   2. sessionStorage 'nexuspay_session' — set by customer auth.js module
 *   3. localStorage 'nexuspay_admin_session' — legacy admin session
 * Falls back to a guest customer context if nothing is found.
 */
function getCurrentUser() {
  try {
    // Primary store (set by all login pages after API validation)
    const primary = localStorage.getItem('nexuspay_user');
    if (primary) return JSON.parse(primary);
  } catch (e) { /* ignore */ }

  try {
    // Customer pages use sessionStorage via auth.js module
    const session = sessionStorage.getItem('nexuspay_session');
    if (session) {
      const parsed = JSON.parse(session);
      // Normalise: auth.js stores {userId, role, name, email}
      return {
        id: parsed.userId || parsed.id || 1,
        name: parsed.name || 'Customer',
        email: parsed.email || '',
        role: parsed.role || 'customer',
      };
    }
  } catch (e) { /* ignore */ }

  try {
    // Admin / SuperUser pages set this key before api-config was unified
    const adminSession = localStorage.getItem('nexuspay_admin_session');
    if (adminSession) {
      const parsed = JSON.parse(adminSession);
      const role = localStorage.getItem('nexuspay_current_role') || 'admin';
      return {
        id: parsed.id || 19,
        name: parsed.name || 'Admin User',
        email: parsed.email || parsed.adminId || '',
        role: role,
      };
    }
  } catch (e) { /* ignore */ }

  // Default fallback — guest customer (unauthenticated pages)
  return { id: 1, name: 'Rajesh Kumar', email: 'rajesh@nexuspay.com', role: 'customer' };
}

/**
 * Set the current user context in localStorage (called after login).
 * Also writes to sessionStorage so auth.js picks it up in customer pages.
 */
function setCurrentUser(user) {
  localStorage.setItem('nexuspay_user', JSON.stringify(user));
  // Keep sessionStorage in sync for customer pages that use auth.js
  try {
    sessionStorage.setItem('nexuspay_session', JSON.stringify({
      userId: user.id,
      role: user.role,
      email: user.email,
    }));
  } catch (e) { /* ignore */ }
}

/**
 * Build standard headers for API requests.
 */
function getApiHeaders() {
  const user = getCurrentUser();
  return {
    'Content-Type': 'application/json',
    'x-user-role': user.role || 'customer',
    'x-user-email': user.email || '',
  };
}

/**
 * Centralized fetch wrapper with error handling.
 * @param {string} endpoint - API endpoint (e.g., '/users' or '/transactions?status=Completed')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<any>} Parsed JSON response
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  // Merge custom headers with default API headers
  const mergedHeaders = { ...getApiHeaders(), ...(options.headers || {}) };
  const config = {
    ...options,
    headers: mergedHeaders,
  };

  // If body is an object, stringify it
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

// Convenience methods
const api = {
  get: (endpoint) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint, body, extraHeaders) => apiFetch(endpoint, { method: 'POST', body, headers: extraHeaders }),
  put: (endpoint, body) => apiFetch(endpoint, { method: 'PUT', body }),
  patch: (endpoint, body) => apiFetch(endpoint, { method: 'PATCH', body }),
  delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
};
