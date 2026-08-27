import React, { useState } from 'react';
import {
  Search,
  Download
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function Transactions() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredTransactions = orgData.transactions.filter(t => {
    const matchesType = typeFilter === 'All' || t.type === typeFilter;
    const matchesSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
                          t.payer.toLowerCase().includes(search.toLowerCase()) ||
                          t.course.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalCredits = filteredTransactions.filter(t => t.type === 'Payment').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = filteredTransactions.filter(t => t.type === 'Payout' || t.type === 'Refund').reduce((sum, t) => sum + t.amount, 0);

  return (
    <OrgLayout
      breadcrumbs={[{ label: 'Transactions' }]}
      actions={
        <button
          onClick={() => addToast('Exporting transaction ledger as CSV...', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all border border-outline-variant"
        >
          <Download className="w-4 h-4" />
          <span>Export Ledger CSV</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Financial Ledger & Invoices</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Comprehensive double-entry transaction trail across learner tuition and faculty royalties.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
              Total Inflow: +${totalCredits.toFixed(2)}
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-red-50 text-red-900 border border-red-200 text-xs font-bold">
              Total Outflow: -${totalDebits.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-4 shadow-elevation-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Payment', 'Payout', 'Refund'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTypeFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  typeFilter === tab
                    ? 'bg-[#255ea6] text-white shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
            />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-outline uppercase text-[10px] tracking-wider border-b border-outline-variant">
                  <th className="pb-3 font-bold">Transaction Reference</th>
                  <th className="pb-3 font-bold">Type</th>
                  <th className="pb-3 font-bold">Counterparty</th>
                  <th className="pb-3 font-bold">Description</th>
                  <th className="pb-3 font-bold">Channel</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 font-mono font-bold text-on-surface">{tx.id}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.type === 'Payment' ? 'bg-emerald-100 text-emerald-800' :
                        tx.type === 'Payout' ? 'bg-blue-100 text-blue-900' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-on-surface">{tx.payer}</td>
                    <td className="py-4 text-on-surface-variant max-w-[200px] truncate">{tx.course}</td>
                    <td className="py-4 text-outline">{tx.method}</td>
                    <td className={`py-4 font-bold ${tx.type === 'Refund' || tx.type === 'Payout' ? 'text-red-600' : 'text-emerald-700'}`}>
                      {tx.type === 'Refund' || tx.type === 'Payout' ? '-' : '+'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OrgLayout>
  );
}
