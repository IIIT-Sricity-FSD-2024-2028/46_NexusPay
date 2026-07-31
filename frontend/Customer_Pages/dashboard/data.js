// ── PIE CHART DATA (fallback, will be overridden from API) ──
const pieColors = ['#6366f1','#10b981','#a855f7','#f59e0b','#ec4899','#94a3b8'];
let pieData   = [2400,2100,1800,1500,1200,800];
let pieLabels = ['Food & Dining','Shopping','Entertainment','Transport','Retail','Others'];

// ── LINE CHART DATA (fallback) ──
let months   = ['Oct','Nov','Dec','Jan','Feb','Mar'];
let spending = [9800, 10200, 12800, 8200, 8900, 9500];

// ── TRANSACTION LIST (API-backed) ──
let transactions = [];

/**
 * Fetch dashboard data from the API
 */
async function loadDashboardData() {
    try {
        const user = getCurrentUser();

        // Fetch transactions for this user
        const txns = await api.get(`/transactions?user=${encodeURIComponent(user.email)}`);
        if (txns && txns.length > 0) {
            transactions = txns.map((t, i) => ({
                id: i + 1,
                name: t.sender === user.email ? t.receiver : t.sender,
                category: t.category || 'General',
                amount: t.sender === user.email ? -t.amount : t.amount,
                date: t.date,
                time: '',
                icon: t.type === 'Payment' ? '\ud83d\udecd\ufe0f' : t.type === 'Refund' ? '\ud83d\udcb8' : '\ud83d\udc64',
                type: t.type === 'Transfer' ? 'P2P' : 'P2M',
                vpa: `${(t.sender === user.email ? t.receiver : t.sender).toLowerCase().replace(/\s+/g, '.')}@nexuspay`,
            }));
        } else {
            // No transactions for this user — use fallback
            loadFallbackTransactions();
        }

        // Fetch spending breakdown
        const spendingData = await api.get(`/analytics/spending?userId=${user.userId || user.id}`);
        if (spendingData && spendingData.categories) {
            pieLabels = spendingData.categories.map(c => c.name);
            pieData = spendingData.categories.map(c => c.amount);
        }

    } catch (e) {
        console.warn('Using fallback dashboard data:', e.message);
        loadFallbackTransactions();
    }
}

function loadFallbackTransactions() {
    transactions = [
        { id: 1, name: "Domino's Pizza", category: "Food & Dining", amount: -800, date: "Mar 9, 2026", time: "2:30 PM", icon: "\ud83c\udf55", type: "P2M", vpa: "dominos@nexuspay" },
        { id: 2, name: "Priya Sharma", category: "Friends & Family", amount: 1500, date: "Mar 9, 2026", time: "1:15 PM", icon: "\ud83d\udc64", type: "P2P", vpa: "priya.s@nexuspay" },
        { id: 3, name: "Starbucks", category: "Food & Dining", amount: -420, date: "Mar 9, 2026", time: "10:00 AM", icon: "\u2615", type: "P2M", vpa: "starbucks@nexuspay" },
        { id: 4, name: "Amit Patel", category: "Friends & Family", amount: 2500, date: "Mar 8, 2026", time: "8:45 PM", icon: "\ud83d\udc64", type: "P2P", vpa: "amit.p@nexuspay" },
        { id: 5, name: "Amazon Shopping", category: "Shopping", amount: -1250, date: "Mar 8, 2026", time: "3:20 PM", icon: "\ud83d\udecd\ufe0f", type: "P2M", vpa: "amazon@nexuspay" },
    ];
}
