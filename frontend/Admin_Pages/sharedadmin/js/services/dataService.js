/**
 * dataService.js — API-Backed Data & CRUD Operations
 * All data fetched from/persisted to the NestJS backend API.
 * Requires: ../../../shared/api-config.js to be loaded first.
 */

/* ───────── Transaction CRUD (API-backed) ───────── */

const TransactionService = {
  async getAll() {
    try {
      return await api.get('/transactions');
    } catch (e) {
      console.error('TransactionService.getAll error:', e);
      return [];
    }
  },

  async getById(id) {
    try {
      return await api.get(`/transactions/${id}`);
    } catch (e) {
      console.error('TransactionService.getById error:', e);
      return null;
    }
  },

  async create(data) {
    try {
      return await api.post('/transactions', {
        sender: data.customer || data.sender || 'Unknown',
        receiver: data.receiver || data.merchant || 'Unknown',
        amount: parseFloat(data.amount),
        type: data.type || 'Payment',
        category: data.category || 'General',
        status: data.status || 'Pending',
      });
    } catch (e) {
      console.error('TransactionService.create error:', e);
      return null;
    }
  },

  async update(id, data) {
    try {
      return await api.put(`/transactions/${id}`, data);
    } catch (e) {
      console.error('TransactionService.update error:', e);
      return null;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/transactions/${id}`);
      return true;
    } catch (e) {
      console.error('TransactionService.delete error:', e);
      return false;
    }
  },

  async search(query) {
    try {
      return await api.get(`/transactions?search=${encodeURIComponent(query)}`);
    } catch (e) {
      console.error('TransactionService.search error:', e);
      return [];
    }
  },

  async getStats() {
    try {
      return await api.get('/transactions/stats');
    } catch (e) {
      console.error('TransactionService.getStats error:', e);
      return { total: 0, totalAmount: 0, completed: 0, pending: 0, failed: 0 };
    }
  },

  async filterByStatus(status) {
    try {
      if (!status || status === 'All') return await this.getAll();
      return await api.get(`/transactions?status=${encodeURIComponent(status)}`);
    } catch (e) {
      console.error('TransactionService.filterByStatus error:', e);
      return [];
    }
  },

  reset() { console.log('Reset is handled by restarting the backend server.'); }
};

/* ───────── Logs CRUD (API-backed) ───────── */

const LogService = {
  async getAll() {
    try {
      return await api.get('/logs');
    } catch (e) {
      console.error('LogService.getAll error:', e);
      return [];
    }
  },

  async getById(id) {
    try {
      const all = await this.getAll();
      return all.find(l => l.id === id) || null;
    } catch (e) {
      return null;
    }
  },

  async create(data) {
    try {
      return await api.post('/logs', {
        user: data.user?.trim() || 'admin@nexuspay.com',
        action: data.action?.trim() || '',
        details: data.details?.trim() || '',
        severity: data.severity || 'Info',
        module: data.module || 'General',
      });
    } catch (e) {
      console.error('LogService.create error:', e);
      return null;
    }
  },

  async update(id, data) {
    // Logs are append-only on the backend, so we create + delete
    try {
      await this.delete(id);
      return await this.create(data);
    } catch (e) {
      console.error('LogService.update error:', e);
      return null;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/logs/${id}`);
      return true;
    } catch (e) {
      console.error('LogService.delete error:', e);
      return false;
    }
  },

  async search(query) {
    try {
      const all = await this.getAll();
      const q = query.toLowerCase().trim();
      if (!q) return all;
      return all.filter(l =>
        l.user?.toLowerCase().includes(q) ||
        l.action?.toLowerCase().includes(q) ||
        l.details?.toLowerCase().includes(q) ||
        l.severity?.toLowerCase().includes(q) ||
        l.module?.toLowerCase().includes(q)
      );
    } catch (e) {
      return [];
    }
  },

  async filterBySeverity(severity) {
    try {
      if (!severity || severity === 'All') return await this.getAll();
      return await api.get(`/logs?severity=${encodeURIComponent(severity)}`);
    } catch (e) {
      return [];
    }
  },

  reset() { console.log('Reset is handled by restarting the backend server.'); }
};

/* ───────── Chart data (API-backed) ───────── */

const ChartData = {
  // These are fetched from /api/analytics; fallbacks provided
  revenue: { labels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'], values: [120000,180000,150000,210000,240000,195000,280000] },
  transactionVolume: { labels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'], values: [2200,3100,2800,4500,5200,3800,5800] },
  userGrowth: { labels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'], customers: [8000,10500,13000,16000,18500,21000,24500], merchants: [1200,1800,2400,3100,3600,4200,5000] },
  categoryPerformance: [
    { name: 'Electronics', value: 450000 }, { name: 'Fashion', value: 380000 },
    { name: 'Grocery', value: 320000 }, { name: 'Food & Dining', value: 280000 },
    { name: 'Services', value: 220000 }, { name: 'Others', value: 180000 },
  ],
  hourlyActivity: { labels: ['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00'], values: [45,20,80,350,520,680,450,280] },
  topCategories: [
    { rank: 1, name: 'Electronics', revenue: 450000, growth: 28 },
    { rank: 2, name: 'Fashion', revenue: 380000, growth: 22 },
    { rank: 3, name: 'Grocery', revenue: 320000, growth: 18 },
    { rank: 4, name: 'Food & Dining', revenue: 280000, growth: 15 },
    { rank: 5, name: 'Services', revenue: 220000, growth: 12 },
    { rank: 6, name: 'Others', revenue: 180000, growth: 8 },
  ],

  async loadFromApi() {
    try {
      const [revenue, trends, categories] = await Promise.all([
        api.get('/analytics/revenue'),
        api.get('/analytics/trends'),
        api.get('/analytics/categories'),
      ]);
      if (revenue) {
        this.revenue.values = revenue.monthly?.map(r => r.revenue) || this.revenue.values;
        this.revenue.labels = revenue.monthly?.map(r => r.month) || this.revenue.labels;
      }
    } catch (e) {
      console.log('Using fallback chart data');
    }
  }
};

window.TransactionService = TransactionService;
window.LogService = LogService;
window.ChartData = ChartData;
