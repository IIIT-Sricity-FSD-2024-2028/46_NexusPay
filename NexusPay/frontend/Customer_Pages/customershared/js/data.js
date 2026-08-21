/**
 * data.js — API-Backed Data Store & CRUD Helpers
 * All data fetched from/persisted to the NestJS backend API.
 * Requires: ../../../shared/api-config.js to be loaded first.
 */

/* ====== INIT ====== */

export function initData() {
    // No need to seed localStorage — backend has seed data
    console.log('NexusPay data initialized (API-backed)');
}

/* ====== USERS ====== */

export async function getUsers() {
    try {
        return await api.get('/users');
    } catch (e) {
        console.error('getUsers error:', e);
        return [];
    }
}

export async function getUserById(id) {
    try {
        return await api.get(`/users/${id}`);
    } catch (e) {
        return null;
    }
}

export async function findUserByEmail(email) {
    try {
        const users = await api.get('/users');
        return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (e) {
        return null;
    }
}

function resolveUserEmail(identifier, users) {
    if (!identifier) return 'N/A';

    const user = users.find(u => u.id === identifier || u.email === identifier);
    return user?.email || identifier;
}

/* ====== SCHEDULES (CRUD) ====== */

export async function getSchedules() {
    try {
        const user = getCurrentUser();
        const [res, users] = await Promise.all([
            api.get(`/scheduled-payments?userId=${user.userId || user.id}`),
            getUsers(),
        ]);
        return res
            .filter(s => s.status === 'active')
            .map(s => ({
                ...s,
                displayReceiver: resolveUserEmail(s.receiverId || s.contact, users),
            }));
    } catch (e) {
        console.error('getSchedules error:', e);
        return [];
    }
}

export async function getScheduleById(id) {
    try {
        return await api.get(`/scheduled-payments/${id}`);
    } catch (e) {
        return null;
    }
}

export async function addSchedule(data) {
    try {
        const user = getCurrentUser();
        return await api.post('/scheduled-payments', {
            'schedule name': data.title,
            'recipient id': data.contact,
            'payment for': data.category || 'Payment',
            amount: data.amount,
            frequency: data.frequency || 'monthly',
            'start date': data.nextPayment || new Date().toISOString().split('T')[0],
            'end date': data.endDate || new Date().toISOString().split('T')[0],
            userId: user.userId || user.id,
        });
    } catch (e) {
        console.error('addSchedule error:', e);
        return null;
    }
}

export async function updateSchedule(id, updates) {
    try {
        return await api.put(`/scheduled-payments/${id}`, updates);
    } catch (e) {
        console.error('updateSchedule error:', e);
        return null;
    }
}

export async function deleteSchedule(id) {
    try {
        await api.delete(`/scheduled-payments/${id}`);
        return true;
    } catch (e) {
        console.error('deleteSchedule error:', e);
        return false;
    }
}

/* ====== HISTORY (from scheduled payments history) ====== */

export async function getHistory() {
    try {
        const user = getCurrentUser();
        const txns = await api.get(`/transactions?user=${encodeURIComponent(user.userId || user.id)}`);
        return txns.map(t => ({
            id: t.id,
            title: t.receiverId || t.senderId,
            icon: 'credit-card',
            iconColor: t.status === 'Completed' ? '#10b981' : '#ef4444',
            date: t.date,
            amount: t.amount,
            status: t.status.toLowerCase(),
        }));
    } catch (e) {
        return [];
    }
}

/* ====== PENDING REQUESTS ====== */

export async function getPendingRequests() {
    try {
        const user = getCurrentUser();
        // Get all schedules including pending
        const allSchedules = await api.get(`/scheduled-payments?userId=${user.userId || user.id}`);
        const pendingSchedules = allSchedules.filter(s => s.status === 'pending');
        const users = await getUsers();
        
        return pendingSchedules.map(s => {
            const isIncoming = s.type === 'incoming';
            const fromId = isIncoming ? s.receiverId : s.userId;
            return {
                id: s.id,
                emoji: s.emoji || '💳',
                title: s.title,
                from: resolveUserEmail(fromId, users),
                fromId,
                amount: s.amount,
                frequency: s.frequency,
                startDate: s.nextPayment,
                badge: isIncoming ? '⚠️ Needs Action' : '⏱️ Waiting',
                badgeType: isIncoming ? 'warning' : 'info',
                actionType: isIncoming ? 'accept_reject' : 'waiting',
            };
        });
    } catch (e) {
        console.error('getPendingRequests error:', e);
        return [];
    }
}

export async function acceptPending(id) {
    try {
        await api.patch(`/scheduled-payments/${id}/accept`);
        return true;
    } catch (e) {
        return false;
    }
}

export async function rejectPending(id) {
    try {
        await api.patch(`/scheduled-payments/${id}/reject`);
        return true;
    } catch (e) {
        return false;
    }
}

export async function addPending(data) {
    // No longer needed as backend creates pending schedules automatically
    return null;
}

/* ====== NOTIFICATIONS ====== */

export async function getNotifications() {
    try {
        const user = getCurrentUser();
        return await api.get(`/notifications?userId=${user.userId || user.id}`);
    } catch (e) {
        console.error('getNotifications error:', e);
        return [];
    }
}

export async function markAllNotificationsRead() {
    try {
        const user = getCurrentUser();
        await api.patch(`/notifications/read-all?userId=${user.userId || user.id}`);
        return true;
    } catch (e) {
        console.error('markAllNotificationsRead error:', e);
        return false;
    }
}
export async function markNotificationRead(id) {
    try {
        await api.patch(`/notifications/${id}/read`);
        return true;
    } catch (e) {
        console.error('markNotificationRead error:', e);
        return false;
    }
}
/* ====== RESET (for testing) ====== */

export function resetAllData() {
    console.log('Reset is handled by restarting the backend server.');
}
