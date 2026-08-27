import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  Search,
  Check,
  X,
  Eye,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function InstructorRequests() {
  const { addToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState(orgData.instructorRequests);

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === 'All' || r.status === filter;
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.specialization.toLowerCase().includes(search.toLowerCase()) ||
                          r.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (id, name) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    addToast(`Approved instructor application for ${name}!`, 'success');
  };

  const handleDecline = (id, name) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Declined' } : r));
    addToast(`Declined instructor application for ${name}`, 'error');
  };

  return (
    <OrgLayout breadcrumbs={[{ label: 'Instructor Requests' }]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Instructor Applications & Requests</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Review, verify qualifications, and onboard educators to the NexusPay academic faculty.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending: {requests.filter(r => r.status === 'Pending').length}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Approved: {requests.filter(r => r.status === 'Approved').length}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
              <span>Declined: {requests.filter(r => r.status === 'Declined').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-4 shadow-elevation-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Pending', 'Approved', 'Declined'].map((tab) => (
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
              placeholder="Search by name, email..."
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
                  <th className="pb-3 font-bold">Applicant</th>
                  <th className="pb-3 font-bold">Academic Focus</th>
                  <th className="pb-3 font-bold">Credentials</th>
                  <th className="pb-3 font-bold">Submitted Date</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-2xl object-cover" />
                        <div>
                          <p className="font-bold text-sm text-on-surface">{req.name}</p>
                          <p className="text-[11px] text-outline">{req.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-semibold text-primary block">{req.specialization}</span>
                      <span className="text-[11px] text-on-surface-variant line-clamp-1">{req.expertise.join(', ')}</span>
                    </td>
                    <td className="py-4">
                      <p className="font-medium text-on-surface">{req.qualification}</p>
                      <p className="text-[10px] text-outline">{req.experience}</p>
                    </td>
                    <td className="py-4 text-outline">{req.submittedDate}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Pending' ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id, req.name)}
                              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDecline(req.id, req.name)}
                              className="p-2 rounded-xl bg-surface-container hover:bg-red-50 text-red-600 border border-outline-variant"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/instructor-requests/${req.id}`}
                          className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </Link>
                      </div>
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
