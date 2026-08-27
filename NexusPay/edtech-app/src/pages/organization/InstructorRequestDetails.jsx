import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Mail,
  Send,
  Check,
  X,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function InstructorRequestDetails() {
  const { id } = useParams();
  const { addToast } = useToast();

  const request = orgData.instructorRequests.find(r => r.id === id) || orgData.instructorRequests[0];
  const [adminNotes, setAdminNotes] = useState(request.adminNotes || '');
  const [status, setStatus] = useState(request.status || 'Invite Sent');

  const handleResendMail = () => {
    addToast(`Resent invitation request email to ${request.email}!`, 'info');
  };

  const handleMarkAccepted = () => {
    setStatus('Accepted');
    addToast(`Marked invitation as accepted by ${request.name}! Onboarding activated.`, 'success');
  };

  const handleWithdraw = () => {
    setStatus('Declined');
    addToast(`Withdrew recruitment invitation for ${request.name}.`, 'error');
  };

  return (
    <OrgLayout
      breadcrumbs={[
        { label: 'Instructor Invitations', path: '/instructor-requests' },
        { label: request.name }
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link to="/instructor-requests" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Invitations</span>
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Outreach Details & Candidate Profile */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-outline-variant">
                <img src={request.avatar} alt={request.name} className="w-20 h-20 rounded-3xl object-cover shadow-sm flex-shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl md:text-2xl font-bold text-on-surface">{request.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                      status === 'Invite Sent' ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-800'
                    }`}>
                      {status === 'Invite Sent' ? 'Awaiting Educator Acceptance' : status}
                    </span>
                  </div>
                  <p className="text-xs text-primary font-bold">{request.specialization}</p>
                  <p className="text-xs text-outline">
                    Recruitment request dispatched on {request.sentDate || request.submittedDate}
                  </p>
                </div>
              </div>

              {/* Sent by Mail Highlight Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#255ea6] text-white flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Organization Outreach Status: Sent request by mail
                  </span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed pl-9">
                  {request.description || `Organization has sent an official invitation request by mail to ${request.name} to lead the ${request.specialization} track.`}
                </p>
                <div className="pl-9 flex flex-wrap gap-4 text-[11px] text-blue-800 pt-1 font-medium">
                  <span>Recipient: <strong>{request.email}</strong></span>
                  <span>Method: <strong>Direct SMTP Mail Dispatch</strong></span>
                  <span>Tracking: <strong>{request.trackingStatus || 'Delivered via Mail'}</strong></span>
                </div>
              </div>

              {/* Bio & Academic Credentials */}
              <div className="py-6 border-b border-outline-variant space-y-4">
                <h2 className="text-xs font-bold text-outline uppercase tracking-wider">Candidate Background & Experience</h2>
                <p className="text-xs text-on-surface leading-relaxed">{request.bio}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                    <span className="text-[10px] text-outline uppercase font-bold block">Academic Qualification</span>
                    <span className="font-semibold text-on-surface">{request.qualification}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                    <span className="text-[10px] text-outline uppercase font-bold block">Industry & Teaching Tenure</span>
                    <span className="font-semibold text-on-surface">{request.experience}</span>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-outline uppercase tracking-wider pt-2">Specialized Skill Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {request.expertise.map((exp, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-surface-container-high text-xs font-semibold text-on-surface">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Proposed Track & Compensation Offer */}
              <div className="pt-6 space-y-3">
                <h2 className="text-xs font-bold text-outline uppercase tracking-wider">Proposed Curriculum Track & Terms</h2>
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-on-surface">{request.sampleSyllabus}</h3>
                    <span className="text-xs font-bold text-emerald-700">{request.proposedTerms || '70/30 Revenue Share'}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Subject to institutional faculty standards, quarterly royalty settlement, and full courseware authoring permissions.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (4 cols): Dispatch Controls & Internal Notes */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-5">
              <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
                Outreach Management
              </h2>

              <div className="space-y-2">
                <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">Email Subject</span>
                <p className="text-xs font-medium text-on-surface bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/60">
                  {request.mailSubject || `NexusPay Academy: Invitation to lead ${request.specialization}`}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1.5">Administrative Outreach Notes</label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal faculty committee notes or follow-up timelines..."
                  className="w-full p-3 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleResendMail}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs border border-outline-variant flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Resend Request by Mail</span>
                </button>

                {status === 'Invite Sent' && (
                  <>
                    <button
                      onClick={handleMarkAccepted}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm Accepted by Educator</span>
                    </button>
                    <button
                      onClick={handleWithdraw}
                      className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-red-50 text-red-600 font-bold text-xs border border-outline-variant flex items-center justify-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Withdraw Invitation</span>
                    </button>
                  </>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </OrgLayout>
  );
}
