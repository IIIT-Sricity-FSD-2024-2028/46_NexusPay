/**
 * transactions.js — API-Backed Transaction History
 * Fetches transaction data from the NestJS backend.
 * Requires: ../../../shared/api-config.js to be loaded first.
 */

// Fallback transactions in case API is unavailable
const defaultTransactions = [
    { id: 1, name: "Domino's Pizza", category: "Food & Dining", amount: -800, date: "Mar 9, 2026", time: "2:30 PM", icon: "🍕", type: "P2M", vpa: "dominos@nexuspay" },
    { id: 2, name: "Priya Sharma", category: "Friends & Family", amount: 1500, date: "Mar 9, 2026", time: "1:15 PM", icon: "👤", type: "P2P", vpa: "priya.s@nexuspay" },
    { id: 3, name: "Starbucks", category: "Food & Dining", amount: -420, date: "Mar 9, 2026", time: "10:00 AM", icon: "☕", type: "P2M", vpa: "starbucks@nexuspay" },
    { id: 4, name: "Amazon Shopping", category: "Shopping", amount: -1250, date: "Mar 8, 2026", time: "3:20 PM", icon: "🛍️", type: "P2M", vpa: "amazon@nexuspay" },
    { id: 5, name: "Rent Payment", category: "Housing", amount: -15000, date: "Mar 1, 2026", time: "9:00 AM", icon: "🏠", type: "Scheduled", vpa: "landlord@nexuspay" },
];

// Mutable array — loadTransactions() populates it in-place
export const transactions = [...defaultTransactions];

/**
 * Load transactions from the API. Mutates the exported `transactions` array in-place.
 */
export async function loadTransactions() {
    try {
        const user = getCurrentUser();
        const txns = await api.get(`/transactions?user=${encodeURIComponent(user.email)}`);
        if (txns && txns.length > 0) {
            // Clear and replace in-place so all references stay valid
            transactions.length = 0;
            txns.forEach((t, i) => {
                transactions.push({
                    id: i + 1,
                    name: t.sender === user.email ? t.receiver : t.sender,
                    category: t.category || 'General',
                    amount: t.sender === user.email ? -t.amount : t.amount,
                    date: t.date,
                    time: '',
                    icon: getIconForType(t.type),
                    type: t.type || 'P2P',
                    vpa: `${(t.sender === user.email ? t.receiver : t.sender).toLowerCase().replace(/\s+/g, '.')}@nexuspay`,
                });
            });
        }
    } catch (e) {
        console.warn('Using fallback transaction data:', e.message);
    }
    return transactions;
}

function getIconForType(type) {
    const icons = { Transfer: '👤', Payment: '🛍️', Refund: '💸', Split: '🔀', Scheduled: '📅' };
    return icons[type] || '💳';
}