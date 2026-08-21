/**
 * bank.js — Bank Accounts Page Logic
 * Handles rendering, balance toggle, add account, set primary, delete, and drawer popovers.
 * Now uses backend API for persistence instead of localStorage.
 */

import { logout, isLoggedIn, getCurrentUser, getCurrentRole, getRoleLabel, can } from '../customershared/js/auth.js';
import { initData } from '../customershared/js/data.js';
import { updateHeaderForUser, showToast, refreshIcons } from '../customershared/js/ui.js';

/* ====== BANK DATA (API-backed) ====== */

const BANK_COLORS = {
    'HDFC Bank': '#1a3c7b',
    'ICICI Bank': '#f37021',
    'State Bank of India': '#2c5aa0',
    'Axis Bank': '#97144d',
    'Kotak Mahindra Bank': '#ed1c24',
    'Punjab National Bank': '#0b3d91',
    'Bank of Baroda': '#f15a22',
    'Canara Bank': '#ffd700',
};

const BANK_SHORT = {
    'HDFC Bank': 'HDFC',
    'ICICI Bank': 'ICICI',
    'State Bank of India': 'SBI',
    'Axis Bank': 'AXIS',
    'Kotak Mahindra Bank': 'KMB',
    'Punjab National Bank': 'PNB',
    'Bank of Baroda': 'BOB',
    'Canara Bank': 'CNB',
};

// In-memory cache, synced with API
let accountsCache = [];

async function loadAccounts() {
    try {
        const data = await api.get('/bank-accounts');
        accountsCache = data || [];
    } catch (e) {
        console.warn('Failed to load bank accounts from API, using cache:', e.message);
    }
    return accountsCache;
}

async function saveAccountToApi(account) {
    try {
        const saved = await api.post('/bank-accounts', account);
        return saved;
    } catch (e) {
        console.warn('Failed to save bank account:', e.message);
        return account;
    }
}

/* ====== STATE ====== */

let balanceVisible = false;
let openDropdownId = null;

/* ====== FORMAT ====== */

function formatCurrency(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ====== RENDER ACCOUNTS ====== */

function renderAccounts() {
    const accounts = accountsCache;
    const list = document.getElementById('ba-cards-list');
    const totalEl = document.getElementById('ba-total-amount');
    const countEl = document.getElementById('ba-account-count');
    if (!list) return;

    if (accounts.length === 0) {
        list.innerHTML = `<div class="ba-empty"><i data-lucide="landmark"></i><span>No bank accounts linked yet</span></div>`;
        if (totalEl) totalEl.textContent = '₹ 0.00';
        if (countEl) countEl.textContent = '0';
        refreshIcons();
        return;
    }

    list.innerHTML = accounts.map(acc => {
        const color = BANK_COLORS[acc.bankName] || '#615fff';
        const short = BANK_SHORT[acc.bankName] || acc.bankName.substring(0, 3).toUpperCase();
        const balanceDisplay = balanceVisible ? formatCurrency(acc.balance) : '₹ ●●●●●●';
        const isPrimary = acc.primary;

        return `
        <div class="ba-card" data-id="${acc.id}">
            <div class="ba-card-top">
                <div class="ba-bank-logo" style="background:${color};">${short}</div>
                <div class="ba-bank-info">
                    <div class="ba-bank-name-row">
                        <span class="ba-bank-name">${acc.bankName}</span>
                        ${isPrimary ? '<span class="ba-primary-badge">Primary</span>' : ''}
                    </div>
                    <span class="ba-account-num">····${acc.accountNum}</span>
                </div>
                ${!isPrimary ? `
                <button class="ba-card-menu-btn" data-menu-id="${acc.id}">
                    <i data-lucide="more-vertical"></i>
                </button>
                ` : ''}
            </div>
            <div class="ba-balance-section">
                <span class="ba-balance-label">Available Balance</span>
                <span class="ba-balance-amount">${balanceDisplay}</span>
            </div>
            ${openDropdownId === acc.id ? `
            <div class="ba-dropdown">
                <div class="ba-dropdown-item" data-action="set-primary" data-id="${acc.id}">
                    <i data-lucide="star"></i> Set as Primary
                </div>
                <div class="ba-dropdown-item ba-dropdown-danger" data-action="delete-account" data-id="${acc.id}">
                    <i data-lucide="trash-2"></i> Delete Account
                </div>
            </div>
            ` : ''}
        </div>`;
    }).join('');

    // Total
    const total = accounts.reduce((sum, a) => sum + a.balance, 0);
    if (totalEl) totalEl.textContent = balanceVisible ? formatCurrency(total) : '₹ ●●●●●●';
    if (countEl) countEl.textContent = accounts.length;

    refreshIcons();
}

/* ====== BOOTSTRAP ====== */

document.addEventListener('DOMContentLoaded', async () => {
    // Init data store (seeds defaults on first load)
    initData();

    // Auto-set default user session (no login required)
    if (!isLoggedIn()) {
        sessionStorage.setItem('nexuspay_session', JSON.stringify({ userId: 1, name: 'Rajesh Kumar', email: 'rajesh@nexuspay.com', role: 'customer' }));
    }
    updateHeaderForUser();

    // Load accounts from API
    await loadAccounts();
    renderAccounts();

    // Wire balance toggle
    document.getElementById('toggle-balance-btn')?.addEventListener('click', () => {
        balanceVisible = !balanceVisible;
        const iconEl = document.getElementById('eye-icon');
        if (iconEl) {
            iconEl.setAttribute('data-lucide', balanceVisible ? 'eye' : 'eye-off');
        }
        renderAccounts();
        refreshIcons();
    });

    // Wire FAB (add account)
    document.getElementById('add-account-btn')?.addEventListener('click', () => {
        const panel = document.getElementById('ba-link-panel');
        panel?.classList.toggle('hidden');
    });

    // Wire close panel
    document.getElementById('ba-link-close')?.addEventListener('click', () => {
        document.getElementById('ba-link-panel')?.classList.add('hidden');
    });

    // Wire card actions (event delegation)
    document.getElementById('ba-cards-list')?.addEventListener('click', async (e) => {
        // Menu toggle
        const menuBtn = e.target.closest('[data-menu-id]');
        if (menuBtn) {
            e.stopPropagation();
            const id = menuBtn.dataset.menuId;
            openDropdownId = openDropdownId === id ? null : id;
            renderAccounts();
            return;
        }

        // Set primary
        const setPrimary = e.target.closest('[data-action="set-primary"]');
        if (setPrimary) {
            e.stopPropagation();
            const id = setPrimary.dataset.id;
            // Update via API
            try {
                await api.put(`/bank-accounts/${id}`, { primary: true });
                await loadAccounts();
            } catch (err) {
                // Fallback: update locally
                accountsCache.forEach(a => a.primary = (a.id === id));
            }
            openDropdownId = null;
            renderAccounts();
            showToast('Primary account updated!', 'success');
            return;
        }

        // Delete
        const delBtn = e.target.closest('[data-action="delete-account"]');
        if (delBtn) {
            e.stopPropagation();
            const id = delBtn.dataset.id;
            openDropdownId = null;
            renderAccounts();
            showDeleteModal(id);
            return;
        }
    });

    // Wire link account form
    document.getElementById('link-account-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;

        // Clear previous errors
        form.querySelectorAll('.ba-field-error').forEach(el => el.remove());
        form.querySelectorAll('.ba-input-error').forEach(el => el.classList.remove('ba-input-error'));

        const holderName = form.querySelector('#holder-name').value.trim();
        const bankName = form.querySelector('#bank-name').value;
        const accountNumber = form.querySelector('#account-number').value.trim();
        const confirmAccount = form.querySelector('#confirm-account').value.trim();
        const ifsc = form.querySelector('#ifsc-code').value.trim();

        let hasError = false;
        function showError(fieldId, msg) {
            hasError = true;
            const input = form.querySelector(`#${fieldId}`);
            input.classList.add('ba-input-error');
            const err = document.createElement('span');
            err.className = 'ba-field-error';
            err.textContent = msg;
            input.parentElement.appendChild(err);
        }

        if (!holderName) showError('holder-name', 'Name is required');
        if (!bankName) showError('bank-name', 'Please select a bank');
        if (!accountNumber) showError('account-number', 'Account number is required');
        else if (accountNumber.length < 4) showError('account-number', 'Must be at least 4 digits');
        if (!confirmAccount) showError('confirm-account', 'Please confirm account number');
        else if (accountNumber !== confirmAccount) showError('confirm-account', 'Account numbers do not match');
        if (!ifsc) showError('ifsc-code', 'IFSC code is required');

        if (hasError) return;

        // Post to backend API
        const newAcc = await saveAccountToApi({
            bankName,
            holderName,
            accountNum: accountNumber,
            balance: Math.round((Math.random() * 50000 + 10000) * 100) / 100,
            primary: accountsCache.length === 0,
            ifsc,
        });

        // Reload from API
        await loadAccounts();

        form.reset();
        document.getElementById('ba-link-panel')?.classList.add('hidden');
        renderAccounts();
        showToast('Bank account linked successfully!', 'success', 'Account Added');
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-menu-id]') && !e.target.closest('.ba-dropdown')) {
            if (openDropdownId !== null) {
                openDropdownId = null;
                renderAccounts();
            }
        }
    });

    // Wire header popovers
    wireHeaderPopovers();
    // Wire logout
    wireLogoutBtn();
    wireDeleteModal();
});

/* ====== DELETE CONFIRM MODAL ====== */

let pendingDeleteId = null;

function showDeleteModal(accountId) {
    pendingDeleteId = accountId;
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) {
        modal.classList.remove('hidden');
        refreshIcons();
    }
}

function hideDeleteModal() {
    pendingDeleteId = null;
    document.getElementById('delete-confirm-modal')?.classList.add('hidden');
}

function wireDeleteModal() {
    document.getElementById('delete-cancel-btn')?.addEventListener('click', hideDeleteModal);
    document.getElementById('delete-confirm-btn')?.addEventListener('click', async () => {
        if (pendingDeleteId) {
            // Delete via API
            try {
                await api.delete(`/bank-accounts/${pendingDeleteId}`);
            } catch (err) {
                console.warn('Failed to delete bank account from API:', err.message);
            }
            await loadAccounts();
            renderAccounts();
            showToast('Bank account removed.', 'info');
        }
        hideDeleteModal();
    });
    // Click outside modal to close
    document.getElementById('delete-confirm-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'delete-confirm-modal') hideDeleteModal();
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

    document.querySelectorAll('.close-popover').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); closeDrawers(); });
    });

    if (overlay) overlay.addEventListener('click', closeDrawers);

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
        markReadBtn.addEventListener('click', () => {
            const body = document.querySelector('#popover-notif .popover-body');
            if (body) body.innerHTML = '<div class="empty-state" style="padding:32px 0;text-align:center;color:#94a3b8;"><i data-lucide="bell-off"></i><span style="display:block;margin-top:8px;">No notifications</span></div>';
            const sub = document.querySelector('#popover-notif .ph-sub');
            if (sub) sub.textContent = 'You have 0 unread notifications';
            const dot = document.querySelector('.red-dot');
            if (dot) dot.style.display = 'none';
            markReadBtn.style.display = 'none';
            refreshIcons();
        });
    }
}

function wireLogoutBtn() {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        logout();
        showToast('Signed out.', 'info');
    });
}
