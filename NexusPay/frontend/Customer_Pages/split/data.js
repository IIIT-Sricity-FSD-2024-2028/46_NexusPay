/**
 * split/data.js — Split Expense Data
 * Requires: ../../shared/api-config.js (loaded before this file)
 *
 * Defines:
 *   - transactions   (used by script.js to show the "Select Transaction" list)
 *   - allPeople      (used by script.js for the "Add Person" modal)
 *   - splitHistoryData (used by script.js for the "Split History" section)
 *   - loadSplitData() (async fetch helper called in init())
 */

// ── Transaction list (left panel) ──────────────────
let transactions = [
  { id: 1, name: "Starbucks Coffee",       category: "Food & Dining",      amount: -420,   date: "Mar 11, 2026", time: "10:30 AM", icon: "☕" },
  { id: 2, name: "Amazon Purchase",        category: "Shopping",            amount: -2999,  date: "Mar 10, 2026", time: "09:15 AM", icon: "📦" },
  { id: 3, name: "Uber Ride",              category: "Transport",           amount: -350,   date: "Mar 9, 2026",  time: "02:30 PM", icon: "🚗" },
  { id: 4, name: "Swiggy Delivery",        category: "Food & Dining",      amount: -560,   date: "Mar 9, 2026",  time: "08:45 PM", icon: "🍔" },
  { id: 5, name: "Netflix Subscription",   category: "Entertainment",       amount: -649,   date: "Mar 8, 2026",  time: "12:00 PM", icon: "🎬" },
  { id: 6, name: "Electricity Bill",       category: "Utilities",           amount: -1200,  date: "Mar 7, 2026",  time: "11:00 AM", icon: "⚡" },
  { id: 7, name: "Dinner at Olive",        category: "Food & Dining",      amount: -1850,  date: "Mar 6, 2026",  time: "09:00 PM", icon: "🍷" },
  { id: 8, name: "Airbnb Split",           category: "Travel",             amount: -6000,  date: "Mar 5, 2026",  time: "03:00 PM", icon: "🏠" },
  { id: 9, name: "Grocery Store",          category: "Groceries",           amount: -890,   date: "Mar 4, 2026",  time: "06:30 PM", icon: "🛒" },
  { id: 10, name: "Movie Tickets",         category: "Entertainment",       amount: -800,   date: "Mar 3, 2026",  time: "07:15 PM", icon: "🎥" },
];

// ── People list for the "Add Person" modal ─────────
const allPeople = [
  { id: "p1", name: "Rahul Kumar",    handle: "rahul.k@nexuspay",   color: "#6c3bff", emoji: "👨" },
  { id: "p2", name: "Priya Sharma",   handle: "priya.s@nexuspay",   color: "#ff6b9d", emoji: "👩" },
  { id: "p3", name: "Anjali Mehta",   handle: "anjali.m@nexuspay",  color: "#ff9f43", emoji: "👩" },
  { id: "p4", name: "Sneha Patel",    handle: "sneha.p@nexuspay",   color: "#26de81", emoji: "👩" },
  { id: "p5", name: "Vikram Singh",   handle: "vikram.s@nexuspay",  color: "#3867d6", emoji: "👨" },
  { id: "p6", name: "Kavita Joshi",   handle: "kavita.j@nexuspay",  color: "#f7b731", emoji: "👩" },
  { id: "p7", name: "Arjun Nair",     handle: "arjun.n@nexuspay",   color: "#8854d0", emoji: "👨" },
  { id: "p8", name: "Meera Reddy",    handle: "meera.r@nexuspay",   color: "#eb3b5a", emoji: "👩" },
];

// ── Split History data ─────────────────────────────
let splitHistoryData = [
  {
    id: 1,
    type: "sent",
    title: "Starbucks Coffee",
    icon: "☕",
    people: 4,
    comment: "Coffee catch-up!",
    total: 420,
    yourShare: 105,
    status: "pending",
    date: "Today",
    participants: [
      { name: "You (Suhaas)", vpa: "you@nexuspay",      amount: 105, status: "paid",    isYou: true },
      { name: "Rahul Kumar",  vpa: "rahul.k@nexuspay",  amount: 105, status: "paid",    isYou: false },
      { name: "Priya Sharma", vpa: "priya.s@nexuspay",  amount: 105, status: "pending", isYou: false },
      { name: "Anjali Mehta", vpa: "anjali.m@nexuspay",  amount: 105, status: "pending", isYou: false },
    ]
  },
  {
    id: 2,
    type: "sent",
    title: "Dinner at Olive",
    icon: "🍷",
    people: 3,
    comment: "Birthday dinner 🎂",
    total: 1850,
    yourShare: 617,
    status: "pending",
    date: "Mar 6",
    participants: [
      { name: "You (Suhaas)",  vpa: "you@nexuspay",       amount: 617, status: "paid",    isYou: true },
      { name: "Vikram Singh",  vpa: "vikram.s@nexuspay",  amount: 617, status: "paid",    isYou: false },
      { name: "Kavita Joshi",  vpa: "kavita.j@nexuspay",  amount: 616, status: "pending", isYou: false },
    ]
  },
  {
    id: 3,
    type: "received",
    title: "Airbnb Split",
    icon: "🏠",
    people: 3,
    comment: "Goa trip stay",
    total: 6000,
    yourShare: 2000,
    status: "completed",
    date: "Mar 5",
    participants: [
      { name: "You (Suhaas)", vpa: "you@nexuspay",      amount: 2000, status: "paid", isYou: true },
      { name: "Arjun Nair",   vpa: "arjun.n@nexuspay",  amount: 2000, status: "paid", isYou: false },
      { name: "Meera Reddy",  vpa: "meera.r@nexuspay",  amount: 2000, status: "paid", isYou: false },
    ]
  },
  {
    id: 4,
    type: "received",
    title: "Movie Tickets",
    icon: "🎥",
    people: 4,
    comment: "",
    total: 800,
    yourShare: 200,
    status: "completed",
    date: "Mar 3",
    participants: [
      { name: "You (Suhaas)", vpa: "you@nexuspay",      amount: 200, status: "paid", isYou: true },
      { name: "Rahul Kumar",  vpa: "rahul.k@nexuspay",  amount: 200, status: "paid", isYou: false },
      { name: "Sneha Patel",  vpa: "sneha.p@nexuspay",  amount: 200, status: "paid", isYou: false },
      { name: "Priya Sharma", vpa: "priya.s@nexuspay",  amount: 200, status: "paid", isYou: false },
    ]
  },
];

// ── API-backed data loading ────────────────────────
async function loadSplitData() {
  try {
    const user = getCurrentUser();
    const splits = await api.get(`/split-expenses?userId=${user.userId}`);
    if (splits && splits.length > 0) {
      // Merge API splits into local history (API splits first)
      const apiFormatted = splits.map(s => ({
        id: s.id,
        type: s.createdBy === user.userId ? 'sent' : 'received',
        title: s.name || s.title || 'Split Payment',
        icon: '👥',
        people: s.members ? s.members.length : 2,
        comment: s.description || '',
        total: s.totalAmount || 0,
        yourShare: s.members ? Math.round(s.totalAmount / s.members.length) : 0,
        status: s.status || 'pending',
        date: s.date || 'Today',
        participants: (s.members || []).map(m => ({
          name: m.name,
          vpa: m.name.toLowerCase().replace(/\s+/g, '.') + '@nexuspay',
          amount: m.share || 0,
          status: m.paid ? 'paid' : 'pending',
          isYou: m.name === user.email,
        })),
      }));
      splitHistoryData = [...apiFormatted, ...splitHistoryData];
    }
  } catch (e) {
    console.warn('Using fallback split data:', e.message);
  }

  // Also try to load recent transactions from API
  try {
    const apiTxns = await api.get('/transactions');
    if (apiTxns && apiTxns.length > 0) {
      const formatted = apiTxns.slice(0, 10).map((t, i) => ({
        id: 'api-' + (t.id || i),
        name: t.receiver || t.sender || 'Unknown',
        category: t.category || t.type || 'General',
        amount: -(t.amount || 0),
        date: t.date || 'Today',
        time: '',
        icon: t.type === 'Payment' ? '🛍️' : t.type === 'Transfer' ? '👤' : '💸',
      }));
      // Merge API transactions (don't duplicate existing default ones)
      formatted.forEach(ft => {
        if (!transactions.some(t => t.name === ft.name && Math.abs(t.amount) === Math.abs(ft.amount))) {
          transactions.push(ft);
        }
      });
    }
  } catch (e) {
    console.warn('Using fallback transaction data for splits:', e.message);
  }
}

async function createSplit(data) {
  try {
    const user = getCurrentUser();
    return await api.post('/split-expenses', { ...data, userId: user.userId });
  } catch (e) {
    console.error('createSplit error:', e);
    return null;
  }
}

async function updateSplit(id, data) {
  try {
    return await api.put(`/split-expenses/${id}`, data);
  } catch (e) {
    console.error('updateSplit error:', e);
    return null;
  }
}
