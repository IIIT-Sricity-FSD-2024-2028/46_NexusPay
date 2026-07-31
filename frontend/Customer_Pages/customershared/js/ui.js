/**
 * ui.js — DOM Rendering & UI State Management
 * Builds HTML using the same class names as styles.css to preserve the visual design.
 */

import { can, canEditSchedule, canDeleteSchedule, getCurrentUser, getCurrentRole, getRoleLabel } from './auth.js';

/* ====== FORMAT HELPERS ====== */

function formatCurrency(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const EMOJI_OPTIONS = ['🏠', '💳', '💼', '🔑', '📶', '🎓', '🏥', '🚗', '🛒', '📱'];

/* ====== RENDER: PENDING REQUEST CARDS ====== */

export function renderPendingCards(requests) {
    const container = document.getElementById('pending-grid');
    if (!container) return;

    if (!requests || requests.length === 0) {
        container.innerHTML = renderEmptyState('No pending requests');
        return;
    }

    const canManage = can('managePending');

    container.innerHTML = requests.map(req => {
        const badgeClass = req.badgeType === 'warning' ? 'badge-warning' : 'badge-info';

        let actionHTML = '';
        if (req.actionType === 'accept_reject' && canManage) {
            actionHTML = `
                <div class="action-buttons">
                    <button class="btn-primary" data-action="accept" data-id="${req.id}">
                        <i data-lucide="check"></i> Accept
                    </button>
                    <button class="btn-secondary" data-action="reject" data-id="${req.id}">
                        <i data-lucide="x"></i> Reject
                    </button>
                </div>`;
        } else if (req.actionType === 'accept_reject' && !canManage) {
            actionHTML = `
                <div class="action-status">
                    <span>Requires higher access</span>
                </div>`;
        } else {
            actionHTML = `
                <div class="action-status">
                    <i data-lucide="clock"></i> <span>Waiting for approval...</span>
                </div>
                <div class="action-buttons" style="margin-top:8px;">
                    <button class="btn-secondary w-full" data-action="cancel" data-id="${req.id}">
                        <i data-lucide="x"></i> Cancel Request
                    </button>
                </div>`;
        }

        return `
            <div class="pending-card" data-pending-id="${req.id}">
                <div class="pc-icon">${req.emoji}</div>
                <div class="pc-main">
                    <div class="pc-header">
                        <h4>${req.title}</h4>
                        <span class="badge ${badgeClass}">${req.badge}</span>
                    </div>
                    <div class="pc-from">From: ${req.from}</div>
                    <div class="pc-meta">
                        <span class="pc-amt">${formatCurrency(req.amount)}</span>
                        <span class="dot">•</span>
                        <span>${req.frequency}</span>
                        <span class="dot">•</span>
                        <span>Starts ${req.startDate}</span>
                    </div>
                    ${actionHTML}
                </div>
            </div>`;
    }).join('');
}

/* ====== RENDER: ACTIVE SCHEDULE CARDS ====== */

export function renderScheduleCards(schedules) {
    const container = document.getElementById('schedules-grid');
    if (!container) return;

    if (!schedules || schedules.length === 0) {
        container.innerHTML = renderEmptyState('No active schedules');
        return;
    }

    container.innerHTML = schedules.map(s => {
        const dirBadge = s.type === 'outgoing'
            ? '<span class="badge badge-outgoing">Outgoing</span>'
            : '<span class="badge badge-incoming">Incoming</span>';
        const contactLabel = s.type === 'outgoing' ? 'To' : 'From';
        const contactValue = s.displayReceiver || s.receiverEmail || s.receiverId || s.contact || 'N/A';

        let actionsHTML = '<button class="btn-icon-only" data-action="menu" data-id="' + s.id + '"><i data-lucide="more-vertical"></i></button>';

        // Build dropdown for edit/delete based on RBAC
        const showEdit = canEditSchedule(s);
        const showDelete = canDeleteSchedule(s);
        let dropdownHTML = '';
        if (showEdit || showDelete) {
            dropdownHTML = `<div class="card-dropdown hidden" data-dropdown="${s.id}">`;
            if (showEdit) dropdownHTML += `<div class="dropdown-item" data-action="edit" data-id="${s.id}"><i data-lucide="pencil"></i> Edit</div>`;
            if (showDelete) dropdownHTML += `<div class="dropdown-item dropdown-item-danger" data-action="delete" data-id="${s.id}"><i data-lucide="trash-2"></i> Delete</div>`;
            dropdownHTML += `</div>`;
        }

        return `
            <div class="sched-card" data-schedule-id="${s.id}">
                <div class="sc-top">
                    <div class="sc-info-wrapper">
                        <div class="sc-icon">${s.emoji || '💳'}</div>
                        <div class="sc-info">
                            <h4>${s.title}</h4>
                            <span>${contactLabel}: ${contactValue}</span>
                        </div>
                    </div>
                    <div class="sc-actions">
                        ${dirBadge}
                        <span class="badge badge-active">Active</span>
                        <div style="position:relative">
                            ${actionsHTML}
                            ${dropdownHTML}
                        </div>
                    </div>
                </div>
                <div class="sc-stats">
                    <div class="sc-stat">
                        <label>Amount</label>
                        <span class="sc-amt">${formatCurrency(s.amount)}</span>
                    </div>
                    <div class="sc-stat">
                        <label>Frequency</label>
                        <span>${s.frequency}</span>
                    </div>
                    <div class="sc-stat">
                        <label>Next Payment</label>
                        <span>${formatDate(s.nextPayment)}</span>
                    </div>
                </div>
            </div>`;
    }).join('');
}

/* ====== RENDER: HISTORY ROWS ====== */

export function renderHistoryRows(history) {
    const container = document.getElementById('history-list');
    if (!container) return;

    if (!history || history.length === 0) {
        container.innerHTML = renderEmptyState('No transaction history');
        return;
    }

    container.innerHTML = history.map(h => {
        const statusClass = h.status === 'paid' ? 'hist-status-paid'
            : h.status === 'received' ? 'hist-status-received'
            : 'hist-status-cancelled';
        const statusLabel = h.status.charAt(0).toUpperCase() + h.status.slice(1);

        return `
            <div class="history-row">
                <div class="hr-icon" style="color:${h.iconColor}; background:${h.iconColor}15;">
                    <i data-lucide="${h.icon}"></i>
                </div>
                <div class="hr-info">
                    <h4>${h.title}</h4>
                    ${h.contact ? `<span>To: ${h.contact}</span>` : ''}
                </div>
                <div class="hr-amount">
                    <span class="hr-amt">${formatCurrency(h.amount)}</span>
                    <span class="hr-badge ${statusClass}">${statusLabel}</span>
                </div>
                <button class="hr-arrow receipt-arrow-btn" data-receipt-id="${h.id}" data-receipt-title="${h.title}" data-receipt-amount="${h.amount}" data-receipt-date="${h.date}" data-receipt-status="${h.status}" data-receipt-icon="${h.icon}" data-receipt-contact="${h.contact || ''}" data-receipt-scheduled="${h.scheduledDate || ''}" data-receipt-completed="${h.completedDate || ''}">
                    <i data-lucide="chevron-right"></i>
                </button>
            </div>`;
    }).join('');
}

/* ====== RENDER: EMPTY STATE ====== */

function renderEmptyState(message) {
    return `<div class="empty-state"><i data-lucide="inbox"></i><span>${message}</span></div>`;
}

/* ====== LOGIN OVERLAY ====== */

export function showLoginOverlay() {
    document.getElementById('login-overlay')?.classList.remove('hidden');
}

export function hideLoginOverlay() {
    document.getElementById('login-overlay')?.classList.add('hidden');
}

/* ====== SCHEDULE MODAL ====== */

export function showScheduleModal(mode, data = null) {
    const modal = document.getElementById('schedule-modal');
    const title = document.getElementById('modal-title');
    const submitBtn = document.getElementById('modal-submit-btn');
    const form = document.getElementById('schedule-form');

    if (!modal || !form) return;

    title.textContent = mode === 'edit' ? 'Edit Schedule' : 'Create Schedule';
    submitBtn.textContent = mode === 'edit' ? 'Save Changes' : 'Send Request';
    form.dataset.mode = mode;
    form.dataset.editId = data ? data.id : '';

    // Standard text inputs
    form.querySelector('#field-title').value = data ? data.title : '';
    form.querySelector('#field-amount').value = data ? data.amount : '';
    form.querySelector('#field-start-date').value = data ? data.nextPayment : '';
    form.querySelector('#field-end-date').value = '';

    // Contact logic (Saved vs Manual)
    const contact = data ? data.contact : '';
    let foundSaved = false;
    document.querySelectorAll('.contact-radio').forEach(radio => {
        if (contact && radio.value === contact) {
            radio.checked = true;
            foundSaved = true;
        } else {
            radio.checked = false;
        }
    });

    // Trigger tab toggle logic
    const tabSaved = document.querySelector('.r-tab[data-tab="saved"]');
    const tabManual = document.querySelector('.r-tab[data-tab="manual"]');
    if (tabSaved && tabManual) {
        if (contact && !foundSaved) {
            tabManual.click();
            form.querySelector('#field-contact').value = contact;
        } else {
            tabSaved.click();
            form.querySelector('#field-contact').value = '';
            // If new schedule, ensure nothing is checked by default
            if (!data) {
                document.querySelectorAll('.contact-radio').forEach(r => r.checked = false);
            }
        }
    }

    // Category Emoji
    const emoji = data ? data.emoji : null;
    document.querySelectorAll('input[name="payment-cat"]').forEach(radio => {
        if (emoji && radio.value === emoji) {
            radio.checked = true;
            radio.closest('.cat-card')?.classList.add('cat-card-active');
        } else {
            radio.checked = false;
            radio.closest('.cat-card')?.classList.remove('cat-card-active');
        }
    });

    // Frequency
    const freq = data ? data.frequency : 'Monthly';
    document.querySelectorAll('input[name="frequency"]').forEach(radio => {
        if (radio.value === freq) {
            radio.checked = true;
            radio.closest('.freq-option')?.classList.add('freq-option-active');
        } else {
            radio.checked = false;
            radio.closest('.freq-option')?.classList.remove('freq-option-active');
        }
    });

    modal.classList.remove('hidden');
}

export function hideScheduleModal() {
    document.getElementById('schedule-modal')?.classList.add('hidden');
}

/* ====== ROLE BADGE & USER INFO ====== */

export function updateHeaderForUser() {
    const user = getCurrentUser();
    const role = getCurrentRole();

    // Hide role badge always
    const badge = document.getElementById('role-badge');
    if (badge) badge.classList.add('hidden');

    if (user) {
        // Update profile popover data dynamically
        const profName = document.querySelector('.prof-name');
        const profEmail = document.querySelector('.prof-email');
        const pcVals = document.querySelectorAll('.prof-body .pc-val');
        
        if (profName) profName.textContent = user.email;
        if (profEmail) profEmail.textContent = user.userId || user.id;
        if (pcVals.length >= 2) {
            pcVals[0].textContent = user.email;
            pcVals[1].textContent = user.userId || user.id;
        }
    }

    // Show/hide FAB based on addSchedule permission
    const fab = document.querySelector('.button-9');
    if (fab) {
        fab.classList.toggle('hidden', !can('addSchedule'));
    }
}

/* ====== TOAST NOTIFICATIONS ====== */

export function showToast(message, type = 'success', title = null) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} ${title ? 'toast-rich' : ''}`;

    const icons = { success: 'check-circle-2', error: 'alert-circle', info: 'info' };
    
    if (title) {
        toast.innerHTML = `
            <div class="toast-icon"><i data-lucide="${icons[type] || 'info'}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-body">${message}</div>
            </div>
        `;
    } else {
        toast.innerHTML = `<i data-lucide="${icons[type] || 'info'}"></i><span>${message}</span>`;
    }

    container.appendChild(toast);

    // Re-initialize lucide for the new icon
    if (window.lucide) lucide.createIcons({ nodes: [toast] });

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ====== DROPDOWN TOGGLE ====== */

export function toggleDropdown(scheduleId) {
    // Close all other dropdowns first
    document.querySelectorAll('.card-dropdown').forEach(d => {
        if (d.dataset.dropdown !== scheduleId) d.classList.add('hidden');
    });
    const dd = document.querySelector(`.card-dropdown[data-dropdown="${scheduleId}"]`);
    if (dd) dd.classList.toggle('hidden');
}

export function closeAllDropdowns() {
    document.querySelectorAll('.card-dropdown').forEach(d => d.classList.add('hidden'));
}

/* ====== RE-INIT LUCIDE ICONS ====== */

export function refreshIcons() {
    if (window.lucide) lucide.createIcons();
}

/* ====== EXPORT EMOJI OPTIONS FOR FORM ====== */

export { EMOJI_OPTIONS };
