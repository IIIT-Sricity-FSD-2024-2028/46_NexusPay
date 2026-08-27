import React from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Download,
  Receipt,
  Building2
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function Payments() {
  const { addToast } = useToast();

  return (
    <OrgLayout
      breadcrumbs={[{ label: 'Payments & Revenue' }]}
      actions={
        <button
          onClick={() => addToast('Downloading financial statement...', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all border border-outline-variant"
        >
          <Download className="w-4 h-4" />
          <span>Download Financial Statement</span>
        </button>
      }
    >
      <div className="space-y-6">
        <section className="bg-gradient-to-r from-[#0B1E36] via-[#163B66] to-[#1E4E8C] text-white rounded-3xl p-6 md:p-8 shadow-elevation-2 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Total Gross Revenue YTD</span>
              <h1 className="text-3xl md:text-5xl font-black mt-1 tracking-tight">
                ${orgData.stats.annualRevenue.toLocaleString()}
              </h1>
              <p className="text-xs text-white/80 mt-1">Automatic nightly settlement via NexusPay Gateway</p>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="text-[10px] text-white/60 uppercase block font-semibold">This Month</span>
                <span className="text-lg font-bold text-white">${orgData.stats.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 uppercase block font-semibold">Pending Royalties</span>
                <span className="text-lg font-bold text-amber-300">$3,200.00</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 uppercase block font-semibold">Refund Rate</span>
                <span className="text-lg font-bold text-emerald-300">0.3%</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 shadow-elevation-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-on-surface">Credit / Debit Cards</span>
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-on-surface">$98,420.00</p>
            <p className="text-[11px] text-outline mt-1">69% of all transactions</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 shadow-elevation-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-on-surface">NexusPay Balance Vault</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">$32,160.00</p>
            <p className="text-[11px] text-outline mt-1">23% zero-fee payments</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 shadow-elevation-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-on-surface">PayPal & Invoicing</span>
              <Receipt className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-on-surface">$12,000.00</p>
            <p className="text-[11px] text-outline mt-1">8% wire transfers</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant mb-4">
            <div>
              <h2 className="text-base font-bold text-on-surface">Recent Payment Inflows & Payouts</h2>
              <p className="text-xs text-on-surface-variant">Authenticated gateway records</p>
            </div>
            <Link to="/transactions" className="text-xs font-bold text-primary hover:underline">
              View Full Ledger →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-outline uppercase text-[10px] tracking-wider border-b border-outline-variant">
                  <th className="pb-3 font-bold">Transaction ID</th>
                  <th className="pb-3 font-bold">Payer / Beneficiary</th>
                  <th className="pb-3 font-bold">Course</th>
                  <th className="pb-3 font-bold">Method</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {orgData.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 font-mono font-bold text-on-surface">{tx.id}</td>
                    <td className="py-4 font-bold text-on-surface">{tx.payer}</td>
                    <td className="py-4 text-on-surface-variant max-w-[200px] truncate">{tx.course}</td>
                    <td className="py-4 text-outline">{tx.method}</td>
                    <td className="py-4 text-outline">{tx.date}</td>
                    <td className={`py-4 font-bold ${tx.type === 'Refund' ? 'text-red-600' : 'text-emerald-700'}`}>
                      {tx.type === 'Refund' ? '-' : '+'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        tx.status === 'Pending' ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-800'
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
