import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Check,
  X,
  Clock
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function InstructorRequestDetails() {
  const { id } = useParams();
  const { addToast } = useToast();

  const request = orgData.instructorRequests.find(r => r.id === id) || orgData.instructorRequests[0];
  const [adminNotes, setAdminNotes] = useState(request.adminNotes || '');
  const [status, setStatus] = useState(request.status);

  const handleApprove = () => {
    setStatus('Approved');
    addToast(`Successfully approved ${request.name} as an Organization Instructor!`, 'success');
  };

  const handleDecline = () => {
    setStatus('Declined');
    addToast(`Application for ${request.name} marked as declined.`, 'error');
  };

  return (
    <OrgLayout
      breadcrumbs={[
        { label: 'Instructor Requests', path: '/instructor-requests' },
        { label: request.name }
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/instructor-requests" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Applications</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-outline-variant">
                <img src={request.avatar} alt={request.name} className="w-20 h-20 rounded-3xl object-cover shadow-sm" />
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl md:text-2xl font-bold text-on-surface">{request.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      status === 'Pending' ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-800'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-xs text-primary font-bold">{request.specialization}</p>
                  <p className="text-xs text-outline">{request.email} • Submitted on {request.submittedDate}</p>
                </div>
              </div>

              <div className="py-6 border-b border-outline-variant space-y-4">
                <h2 className="text-xs font-bold text-outline uppercase tracking-wider">Candidate Biography & Research Focus</h2>
                <p className="text-xs text-on-surface leading-relaxed">{request.bio}</p>
                <h3 className="text-xs font-bold text-outline uppercase tracking-wider pt-2">Specialized Skill Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {request.expertise.map((exp, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-surface-container-high text-xs font-semibold text-on-surface">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <h2 className="text-xs font-bold text-outline uppercase tracking-wider">Proposed Curriculum Track</h2>
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60">
                  <p className="text-xs font-bold text-on-surface">{request.sampleSyllabus}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Structured with practical lab assignments, automated test suites, and cryptographic verification modules.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-5">
              <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
                Administrative Decision
              </h2>
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1.5">Internal Verification Notes</label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add background check notes or academic committee comments..."
                  className="w-full p-3 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                />
              </div>
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleApprove}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Application</span>
                </button>
                <button
                  onClick={handleDecline}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-red-50 text-red-600 font-bold text-xs border border-outline-variant flex items-center justify-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Decline Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrgLayout>
  );
}
