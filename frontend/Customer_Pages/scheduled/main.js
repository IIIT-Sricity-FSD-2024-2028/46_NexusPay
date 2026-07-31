/**
 * main.js — Application Entry Point
 * Bootstraps the app: initialises data, checks auth, wires event listeners, renders UI.
 */

import { initData, getSchedules, getHistory, getPendingRequests, addSchedule, updateSchedule, deleteSchedule, getScheduleById, acceptPending, rejectPending, resetAllData, getNotifications, markAllNotificationsRead } from '../customershared/js/data.js';
import { logout, isLoggedIn, getCurrentUser, can } from '../customershared/js/auth.js';
import { validateScheduleForm, showFieldError, clearFieldErrors } from '../customershared/js/validation.js';
import { renderPendingCards, renderScheduleCards, renderHistoryRows, showScheduleModal, hideScheduleModal, updateHeaderForUser, showToast, toggleDropdown, closeAllDropdowns, refreshIcons } from '../customershared/js/ui.js';

/* ====== BOOTSTRAP ====== */

document.addEventListener('DOMContentLoaded', () => {
    // Reset data only on a fresh session (e.g. Go Live opens a new tab)
    if (!sessionStorage.getItem('nexuspay_initialized')) {
        resetAllData();
        sessionStorage.setItem('nexuspay_initialized', 'true');
    }
    initData();

    // Auto-set default user session (no login required)
    let session = sessionStorage.getItem('nexuspay_session');
    if (!session) {
        sessionStorage.setItem('nexuspay_session', JSON.stringify({ userId: 'CUST001', name: 'Rajesh Kumar', email: 'john@example.com', role: 'customer' }));
    } else {
        try {
            let sData = JSON.parse(session);
            if (sData.userId === 1) {
                sData.userId = 'CUST001';
                sessionStorage.setItem('nexuspay_session', JSON.stringify(sData));
            }
        } catch (e) {}
    }
    renderApp();

    wireScheduleForm();
    wireFAB();
    wirePendingActions();
    wireScheduleActions();
    wireFilterTabs();
    wirePendingFilterTabs();
    wireLogout();
    wireModalClose();
    wireHeaderPopovers();
    wireGlobalClickClose();
    wireDeleteScheduleModal();
    wireReceiptModal();
});

/* ====== RECEIPT MODAL ====== */

function wireReceiptModal() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    // Event delegation for arrow clicks
    historyList.addEventListener('click', (e) => {
        const arrow = e.target.closest('.receipt-arrow-btn');
        if (!arrow) return;

        const title = arrow.dataset.receiptTitle;
        const amount = Number(arrow.dataset.receiptAmount);
        const date = arrow.dataset.receiptDate;
        const status = arrow.dataset.receiptStatus;
        const id = arrow.dataset.receiptId;
        const contact = arrow.dataset.receiptContact || 'N/A';
        const scheduledDate = arrow.dataset.receiptScheduled || '';
        const completedDate = arrow.dataset.receiptCompleted || '';

        // Format amount
        const formattedAmount = '₹' + amount.toLocaleString('en-IN');

        // Generate a fake transaction ID
        const dateClean = date.replace(/\s/g, '');
        const txnId = 'TXN' + new Date().getFullYear() + dateClean.toUpperCase() + id.replace(/[^0-9]/g, '').slice(-5).padStart(5, '0');

        // Status label & class
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
        const statusBadgeClass = status === 'paid' ? 'receipt-status-paid'
            : status === 'received' ? 'receipt-status-received'
            : 'receipt-status-cancelled';

        // Populate modal
        document.getElementById('receipt-amount-display').textContent = formattedAmount;
        document.getElementById('receipt-title-val').textContent = title;
        document.getElementById('receipt-recipient-val').textContent = contact;
        document.getElementById('receipt-date-val').textContent = scheduledDate || (date + ', 2026');
        document.getElementById('receipt-completed-val').textContent = completedDate || (date + ', 2026');
        document.getElementById('receipt-txn-val').textContent = txnId;
        document.getElementById('receipt-status-val').textContent = status === 'cancelled' ? 'Cancelled' : 'Completed';

        const badge = document.getElementById('receipt-status-badge');
        badge.textContent = statusLabel;
        badge.className = 'receipt-status-badge ' + statusBadgeClass;

        // Show modal
        document.getElementById('receipt-modal')?.classList.remove('hidden');
        refreshIcons();
    });

    // Close button
    document.getElementById('receipt-close-btn')?.addEventListener('click', () => {
        document.getElementById('receipt-modal')?.classList.add('hidden');
    });

    // Click outside to close
    document.getElementById('receipt-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'receipt-modal') {
            document.getElementById('receipt-modal')?.classList.add('hidden');
        }
    });
}

/* ====== DELETE SCHEDULE MODAL ====== */

let pendingDeleteScheduleId = null;

function showDeleteScheduleModal(id) {
    pendingDeleteScheduleId = id;
    document.getElementById('delete-schedule-modal')?.classList.remove('hidden');
}

function hideDeleteScheduleModal() {
    pendingDeleteScheduleId = null;
    document.getElementById('delete-schedule-modal')?.classList.add('hidden');
}

function wireDeleteScheduleModal() {
    document.getElementById('delete-sched-cancel')?.addEventListener('click', hideDeleteScheduleModal);
    document.getElementById('delete-sched-confirm')?.addEventListener('click', async () => {
        if (pendingDeleteScheduleId) {
            await deleteSchedule(pendingDeleteScheduleId);
            showToast('Schedule deleted.', 'info');
            await renderApp();
        }
        hideDeleteScheduleModal();
    });
    document.getElementById('delete-schedule-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'delete-schedule-modal') hideDeleteScheduleModal();
    });
}

/* ====== RENDER ALL ====== */

let globalPendingFilter = 'all';

async function renderApp() {
    updateHeaderForUser();

    const allPending = await getPendingRequests();
    const filteredPending = allPending.filter(req => {
        if (globalPendingFilter === 'all') return true;
        if (globalPendingFilter === 'incoming') return req.actionType === 'accept_reject';
        if (globalPendingFilter === 'outgoing') return req.actionType === 'waiting';
        return true;
    });

    renderPendingCards(filteredPending);
    renderScheduleCards(await getSchedules());
    renderHistoryRows(await getHistory());
    await renderNotifications();
    refreshIcons();
    wireScheduleActions();
    wirePendingActions();
}

async function renderNotifications() {
    const notifs = await getNotifications();
    const body = document.querySelector('#popover-notif .popover-body');
    const sub = document.querySelector('#popover-notif .ph-sub');
    const dot = document.querySelector('.red-dot');
    const markReadBtn = document.querySelector('.mark-read-btn');
    
    if (!body) return;

    const unread = notifs.filter(n => !n.read);
    
    if (sub) sub.textContent = `You have ${unread.length} unread notification${unread.length !== 1 ? 's' : ''}`;
    if (dot) dot.style.display = unread.length > 0 ? 'block' : 'none';
    if (markReadBtn) markReadBtn.style.display = unread.length > 0 ? 'inline-block' : 'none';

    if (notifs.length === 0) {
        body.innerHTML = '<div class="empty-state" style="padding:32px 0;text-align:center;color:#94a3b8;"><i data-lucide="bell-off"></i><span style="display:block;margin-top:8px;">No notifications</span></div>';
        return;
    }

    body.innerHTML = notifs.map(n => {
        let iconHtml = '';
        if (n.type.includes('payment')) iconHtml = '<div class="notif-icon" style="color:#10b981; background:#ecfdf5;"><i data-lucide="indian-rupee"></i></div>';
        else if (n.type.includes('request') || n.type.includes('split')) iconHtml = '<div class="notif-icon" style="color:#a855f7; background:#faf5ff;"><i data-lucide="calendar"></i></div>';
        else iconHtml = '<div class="notif-icon" style="color:#4f46e5; background:#eef2ff;"><i data-lucide="bell"></i></div>';
        
        const dotHtml = !n.read ? '<span class="blue-dot"></span>' : '';
        
        return `
            <div class="notif-card ${n.read ? 'read' : 'unread'}">
                ${iconHtml}
                <div class="notif-content">
                    <div class="notif-title">${n.type.replace(/_/g, ' ').toUpperCase()} ${dotHtml}</div>
                    <div class="notif-desc">${n.message}</div>
                    <div class="notif-time">${n.date ? new Date(n.date).toLocaleString() : 'Just now'}</div>
                </div>
            </div>
        `;
    }).join('');
    
    if (window.lucide) lucide.createIcons({ nodes: [body] });
}



/* ====== SCHEDULE FORM (Add/Edit) ====== */

function wireScheduleForm() {
    const form = document.getElementById('schedule-form');
    if (!form) return;

    // Recipient tab toggle
    document.querySelectorAll('.r-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.r-tab').forEach(t => t.classList.remove('r-tab-active'));
            tab.classList.add('r-tab-active');
            const target = tab.dataset.tab;
            document.getElementById('panel-saved').classList.toggle('hidden', target !== 'saved');
            document.getElementById('panel-manual').classList.toggle('hidden', target !== 'manual');
        });
    });

    // Category card selection
    document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('cat-card-active'));
            card.classList.add('cat-card-active');
            
            // Auto-fill schedule name
            const label = card.querySelector('.cat-label');
            const titleInput = document.getElementById('field-title');
            if (label && titleInput) {
                // Only overwrite if it matches another category or is empty
                titleInput.value = label.textContent.trim();
            }
        });
    });

    // Frequency radio highlight
    document.querySelectorAll('.freq-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.freq-option').forEach(o => o.classList.remove('freq-option-active'));
            radio.closest('.freq-option').classList.add('freq-option-active');
        });
    });

    // Date constraints: Start Date min = today, End Date min = Start Date
    const startDateInput = document.getElementById('field-start-date');
    const endDateInput = document.getElementById('field-end-date');
    if (startDateInput) {
        const today = new Date().toISOString().split('T')[0];
        startDateInput.min = today;
        if (!startDateInput.value) startDateInput.value = today;
        if (endDateInput) {
            endDateInput.min = startDateInput.value || today;
            if (!endDateInput.value) endDateInput.value = today;
        }
        startDateInput.addEventListener('change', () => {
            if (endDateInput) {
                endDateInput.min = startDateInput.value;
                // If end date is now before start date, reset it
                if (endDateInput.value && endDateInput.value < startDateInput.value) {
                    endDateInput.value = startDateInput.value;
                }
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearFieldErrors(form);

        // Determine contact from saved or manual
        const isManualTab = document.querySelector('.r-tab[data-tab="manual"]').classList.contains('r-tab-active');
        let contact = '';
        if (isManualTab) {
            contact = form.querySelector('#field-contact')?.value || '';
        } else {
            const checked = form.querySelector('input[name="saved-contact"]:checked');
            contact = checked ? checked.value : '';
        }

        // Get selected category emoji
        const catChecked = form.querySelector('input[name="payment-cat"]:checked');
        const emoji = catChecked ? catChecked.value : 'ðŸ ';

        // Get frequency
        const freqChecked = form.querySelector('input[name="frequency"]:checked');
        const frequency = freqChecked ? freqChecked.value : '';

        const data = {
            title: form.querySelector('#field-title').value,
            contact,
            amount: form.querySelector('#field-amount').value,
            frequency,
            nextPayment: form.querySelector('#field-start-date').value,
        };

        const v = validateScheduleForm(data);
        if (!v.valid) {
            const fieldMap = {
                title: '#field-title',
                contact: isManualTab ? '#field-contact' : null,
                amount: '#field-amount',
                nextPayment: '#field-start-date',
            };

            Object.keys(v.errors).forEach(field => {
                if (field === 'contact' && !isManualTab && !contact) {
                    showToast('Please select a recipient.', 'error');
                    return;
                }
                const el = fieldMap[field] ? form.querySelector(fieldMap[field]) : null;
                if (el) showFieldError(el, v.errors[field]);
            });
            return;
        }

        const mode = form.dataset.mode;
        const editId = form.dataset.editId;

        const scheduleData = {
            emoji,
            title: data.title.trim(),
            contact: data.contact.trim(),
            contactType: 'to',
            amount: Number(data.amount),
            frequency: data.frequency,
            nextPayment: data.nextPayment,
            type: 'outgoing',
            status: 'active',
        };

        if (mode === 'edit' && editId) {
            await updateSchedule(editId, scheduleData);
            showToast('Schedule updated successfully!', 'success');
        } else {
            const user = getCurrentUser();
            scheduleData.createdBy = user ? user.userId : 'CUST001';
            await addSchedule(scheduleData);

            showToast(
                `Request sent to ${scheduleData.contact}. The schedule will become active once they accept.`,
                'success',
                'Schedule request sent!'
            );
        }

        hideScheduleModal();
        await renderApp();
    });
}

/* ====== FAB BUTTON ====== */

function wireFAB() {
    const fab = document.querySelector('.button-9');
    if (!fab) return;
    fab.addEventListener('click', () => {
        if (!can('addSchedule')) {
            showToast('You do not have permission to add schedules.', 'error');
            return;
        }
        showScheduleModal('add');
        refreshIcons();
    });
}

/* ====== PENDING REQUEST ACTIONS (Accept/Reject) ====== */

function wirePendingActions() {
    const grid = document.getElementById('pending-grid');
    if (!grid) return;

    // Use event delegation
    grid.onclick = async (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === 'accept') {
            await acceptPending(id);
            showToast('Request accepted and added to schedules!', 'success');
            await renderApp();
        } else if (action === 'reject') {
            await rejectPending(id);
            showToast('Request rejected.', 'info');
            await renderApp();
        } else if (action === 'cancel') {
            await rejectPending(id);
            showToast('Request cancelled.', 'info');
            await renderApp();
        }
    };
}

/* ====== SCHEDULE CARD ACTIONS (Edit/Delete/Menu) ====== */

function wireScheduleActions() {
    const grid = document.getElementById('schedules-grid');
    if (!grid) return;

    grid.onclick = (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === 'menu') {
            e.stopPropagation();
            toggleDropdown(id);
            refreshIcons();
            return;
        }

        if (action === 'edit') {
            getScheduleById(id).then(schedule => {
                if (schedule) {
                    showScheduleModal('edit', schedule);
                    refreshIcons();
                }
            });
            closeAllDropdowns();
            return;
        }

        if (action === 'delete') {
            showDeleteScheduleModal(id);
            closeAllDropdowns();
        }
    };
}

/* ====== PENDING FILTER TABS ====== */

function wirePendingFilterTabs() {
    const tabs = document.getElementById('pending-filter-tabs');
    if (!tabs) return;

    tabs.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-p-filter]');
        if (!btn) return;

        globalPendingFilter = btn.dataset.pFilter;

        const allBtn = tabs.querySelector('[data-p-filter="all"]');
        const inBtn = tabs.querySelector('[data-p-filter="incoming"]');
        const outBtn = tabs.querySelector('[data-p-filter="outgoing"]');

        if (allBtn) allBtn.className = globalPendingFilter === 'all' ? 'tab-item active' : 'tab-item';
        if (inBtn) inBtn.className = globalPendingFilter === 'incoming' ? 'tab-item active' : 'tab-item';
        if (outBtn) outBtn.className = globalPendingFilter === 'outgoing' ? 'tab-item active' : 'tab-item';

        await renderApp();
    });
}

/* ====== FILTER TABS (All / Outgoing / Incoming) ====== */

function wireFilterTabs() {
    const tabs = document.getElementById('schedule-filter-tabs');
    if (!tabs) return;

    tabs.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-filter]');
        if (!btn) return;

        const filter = btn.dataset.filter;

        // Update active tab styling with proper active/inactive states
        tabs.querySelectorAll('[data-filter]').forEach(t => {
            const f = t.dataset.filter;
            const isActive = (f === filter);

            if (f === 'all') {
                t.className = isActive ? 'tab-item active' : 'tab-item';
            } else if (f === 'outgoing') {
                t.className = isActive ? 'tab-item active' : 'tab-item';
            } else if (f === 'incoming') {
                t.className = isActive ? 'tab-item active' : 'tab-item';
            }
        });

        // Filter schedules
        let schedules = await getSchedules();
        if (filter === 'outgoing') schedules = schedules.filter(s => s.type === 'outgoing');
        else if (filter === 'incoming') schedules = schedules.filter(s => s.type === 'incoming');

        renderScheduleCards(schedules);
        refreshIcons();
        wireScheduleActions();
    });
}

/* ====== LOGOUT ====== */

function wireLogout() {
    const btn = document.getElementById('logout-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        logout();
        showToast('Logged out successfully.', 'info');
    });
}

/* ====== MODAL CLOSE ====== */

function wireModalClose() {
    // Close schedule modal
    document.getElementById('modal-close-btn')?.addEventListener('click', hideScheduleModal);
    document.getElementById('modal-cancel-btn')?.addEventListener('click', hideScheduleModal);

    // Click outside modal content to close
    document.getElementById('schedule-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'schedule-modal') hideScheduleModal();
    });
}

/* ====== HEADER POPOVERS ====== */

function wireHeaderPopovers() {
    const bellIcon = document.getElementById('bell-icon');
    const profileIcon = document.getElementById('profile-icon');
    const overlay = document.getElementById('drawer-overlay');
    
    function closeDrawers() {
        document.getElementById('popover-notif')?.classList.add('hidden');
        document.getElementById('popover-profile')?.classList.add('hidden');
        overlay?.classList.add('hidden');
    }

    // Toggle Notifications
    if (bellIcon) {
        bellIcon.addEventListener('click', (e) => {
            if (e.target.closest('.popover-panel')) return;
            const notif = document.getElementById('popover-notif');
            
            document.getElementById('popover-profile')?.classList.add('hidden');
            notif?.classList.toggle('hidden');
            
            if (notif && !notif.classList.contains('hidden')) {
                overlay?.classList.remove('hidden');
            } else {
                overlay?.classList.add('hidden');
            }
        });
    }

    // Toggle Profile
    if (profileIcon) {
        profileIcon.addEventListener('click', (e) => {
            if (e.target.closest('.popover-panel')) return;
            const prof = document.getElementById('popover-profile');
            
            document.getElementById('popover-notif')?.classList.add('hidden');
            prof?.classList.toggle('hidden');
            
            if (prof && !prof.classList.contains('hidden')) {
                overlay?.classList.remove('hidden');
            } else {
                overlay?.classList.add('hidden');
            }
        });
    }

    // Close buttons inside popovers
    document.querySelectorAll('.close-popover').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeDrawers();
        });
    });

    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', closeDrawers);
    }

    // Logout from popover
    const popLogout = document.getElementById('popover-logout');
    if (popLogout) {
        popLogout.addEventListener('click', (e) => {
            e.stopPropagation();
            logout();
            showToast('Logged out successfully.', 'info');
            closeDrawers();
        });
    }

    // Mark all as read — clear notifications
    const markReadBtn = document.querySelector('.mark-read-btn');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', async () => {
            await markAllNotificationsRead();
            await renderNotifications();
        });
    }
}

/* ====== GLOBAL CLICK: close dropdowns & popovers ====== */

function wireGlobalClickClose() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-action="menu"]') && !e.target.closest('.card-dropdown')) {
            closeAllDropdowns();
        }
    });
}
