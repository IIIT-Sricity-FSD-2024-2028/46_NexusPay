import React from 'react';
import {
  Download,
  Users,
  DollarSign,
  TrendingUp,
  GraduationCap,
  BarChart3,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function Reports() {
  const { addToast } = useToast();

  const reportCategories = [
    { id: 1, title: "Enrollment & Completion Audit", icon: Users, desc: "Detailed breakdown of learner signups and progress thresholds across courses." },
    { id: 2, title: "Gross Revenue & Royalty Statement", icon: DollarSign, desc: "Institutional revenue and instructor royalty settlement tables." },
    { id: 3, title: "Course Quality & Student CSAT", icon: TrendingUp, desc: "Aggregated 5-star ratings, student reviews, and module quiz pass percentages." },
    { id: 4, title: "Faculty Teaching Performance", icon: GraduationCap, desc: "Educator engagement metrics, active enrolled student counts, and recency." },
    { id: 5, title: "Learner Competency & Certifications", icon: BarChart3, desc: "Cohort skill verification matrices and cryptographic certificate logs." },
    { id: 6, title: "SOC2 Compliance & Admin Audit Log", icon: ShieldCheck, desc: "Security activity records and admin role access logs." }
  ];

  return (
    <OrgLayout breadcrumbs={[{ label: 'Reports & Exports' }]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Institutional Reports & Data Exports</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Generate and export accredited compliance, financial, and academic analytics reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map((rep) => {
            const Icon = rep.icon;
            return (
              <div
                key={rep.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 flex flex-col justify-between space-y-4 hover:shadow-elevation-2 transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-on-surface">{rep.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{rep.desc}</p>
                </div>
                <button
                  onClick={() => addToast(`Generating report: ${rep.title}`, 'info')}
                  className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Generate Report</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1">
          <h2 className="text-base font-bold text-on-surface pb-4 border-b border-outline-variant mb-4">Recently Generated Reports</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-outline uppercase text-[10px] tracking-wider border-b border-outline-variant/60">
                  <th className="pb-3 font-bold">Report Title</th>
                  <th className="pb-3 font-bold">Category</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold">Size</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {orgData.reports.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 font-bold text-on-surface">{r.title}</td>
                    <td className="py-4 font-semibold text-primary">{r.type}</td>
                    <td className="py-4 text-outline">{r.date}</td>
                    <td className="py-4 font-mono text-outline">{r.size} ({r.format})</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => addToast(`Downloading ${r.title}`, 'success')}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
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
