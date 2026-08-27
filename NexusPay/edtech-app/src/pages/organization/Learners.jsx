import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Download,
  Eye
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { LinearProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';

export default function Learners() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredLearners = orgData.learners.filter(lrn => {
    const matchesFilter = filter === 'All' || lrn.status === filter || lrn.learnerType === filter;
    const matchesSearch = lrn.name.toLowerCase().includes(search.toLowerCase()) ||
                          lrn.email.toLowerCase().includes(search.toLowerCase()) ||
                          lrn.university.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <OrgLayout
      breadcrumbs={[{ label: 'Learners' }]}
      actions={
        <button
          onClick={() => addToast('Exporting student roster data as CSV...', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all border border-outline-variant"
        >
          <Download className="w-4 h-4" />
          <span>Export Student CSV</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Organization Learners & Students</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Tracking {orgData.learners.length} enrolled student profiles, progress milestones, and certificate awards.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs font-semibold text-on-surface">
              Active: <strong>{orgData.learners.filter(l => l.status === 'Active').length}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs font-semibold text-on-surface">
              Completed: <strong>{orgData.learners.filter(l => l.status === 'Completed').length}</strong>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-4 shadow-elevation-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Active', 'Completed', 'Student', 'Professional'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  filter === tab
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
              placeholder="Search learners..."
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
                  <th className="pb-3 font-bold">Learner</th>
                  <th className="pb-3 font-bold">Type / University</th>
                  <th className="pb-3 font-bold">Enrolled</th>
                  <th className="pb-3 font-bold">Overall Progress</th>
                  <th className="pb-3 font-bold">Avg Score</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredLearners.map((lrn) => (
                  <tr key={lrn.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={lrn.avatar} alt={lrn.name} className="w-9 h-9 rounded-2xl object-cover" />
                        <div>
                          <p className="font-bold text-sm text-on-surface">{lrn.name}</p>
                          <p className="text-[11px] text-outline">{lrn.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-semibold text-primary block">{lrn.learnerType}</span>
                      <span className="text-[11px] text-outline">{lrn.university}</span>
                    </td>
                    <td className="py-4 font-bold text-on-surface">{lrn.enrolledCourses} courses</td>
                    <td className="py-4 w-40">
                      <LinearProgressBar progress={lrn.overallProgress} showLabel={true} height="h-2" />
                    </td>
                    <td className="py-4 font-bold text-on-surface">{lrn.avgScore}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        lrn.status === 'Completed' ? 'bg-blue-100 text-blue-900' :
                        lrn.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lrn.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        to={`/learners/${lrn.id}`}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </Link>
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
