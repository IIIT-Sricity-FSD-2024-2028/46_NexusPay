/**
 * auth.js — Authentication & Role-Based Access Control
 * Uses sessionStorage for the current session.
 * getCurrentUser() is synchronous — reads directly from sessionStorage.
 */

import { findUserByEmail } from './data.js';

const SESSION_KEY = 'nexuspay_session';

/* ====== SESSION ====== */

export async function login(email, password) {
    const user = await findUserByEmail(email);
    if (!user) return { success: false, error: 'No account found with this email.' };
    if (user.password !== password) return { success: false, error: 'Incorrect password.' };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, role: user.role, email: user.email }));
    return { success: true, user };
}

export function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = '../../Public_Pages/Signin.html?role=customer';
}

/**
 * Synchronous — reads session data directly from sessionStorage.
 * Does NOT call the API; user info is stored at login time.
 */
export function getCurrentUser() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function isLoggedIn() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return !!raw;
}

export function getCurrentRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}

/* ====== PERMISSIONS ====== */

const PERMISSIONS = {
    superuser: {
        viewSchedules: true,
        addSchedule: true,
        editAny: true,
        editOwn: true,
        deleteAny: true,
        deleteOwn: true,
        managePending: true,
    },
    admin: {
        viewSchedules: true,
        addSchedule: true,
        editAny: false,
        editOwn: true,
        deleteAny: false,
        deleteOwn: true,
        managePending: true,
    },
    customer: {
        viewSchedules: true,
        addSchedule: true,
        editAny: false,
        editOwn: true,
        deleteAny: false,
        deleteOwn: true,
        managePending: true,
    },
};

/**
 * Check if the current user can perform an action.
 * @param {'viewSchedules'|'addSchedule'|'editAny'|'editOwn'|'deleteAny'|'deleteOwn'|'managePending'} action
 */
export function can(action) {
    const role = getCurrentRole();
    if (!role || !PERMISSIONS[role]) return false;
    return !!PERMISSIONS[role][action];
}

/**
 * Check if the current user can edit a specific schedule.
 */
export function canEditSchedule(schedule) {
    const user = getCurrentUser();
    if (!user) return false;
    if (can('editAny')) return true;
    if (can('editOwn') && schedule.type === 'outgoing' && schedule.userId === user.userId) return true;
    return false;
}

/**
 * Check if the current user can delete a specific schedule.
 */
export function canDeleteSchedule(schedule) {
    const user = getCurrentUser();
    if (!user) return false;
    if (can('deleteAny')) return true;
    if (can('deleteOwn') && schedule.type === 'outgoing' && schedule.userId === user.userId) return true;
    return false;
}

/**
 * Returns a human-readable role label.
 */
export function getRoleLabel(role) {
    const labels = { superuser: 'Super User', admin: 'Admin', customer: 'Customer' };
    return labels[role] || role;
}
