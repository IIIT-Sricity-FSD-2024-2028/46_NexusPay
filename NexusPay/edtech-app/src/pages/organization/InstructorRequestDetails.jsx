import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Mail,
  Send,
  Check,
  X,
  RotateCcw,
  Bell,
  Calendar,
  BookOpen
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { useOrg } from '../../context/OrgContext';
import { useToast } from '../../components/common/Toast';

export default function InstructorRequestDetails() {
  const { id } = useParams();
  const { addToast } = useToast();
  const { instructorRequests, respondToTeachingRequest } = useOrg();

  const request = instructorRequests.find(r => r.id === id) || instructorRequests[0];
  const [adminNotes, setAdminNotes] = useState(request?.adminNotes || '');

  const isAccepted = request?.status?.includes('Accepted');
  const isPending = request?.status?.includes('Pending');

  const handleProfessorResponse = (decision) => {
    const res = respondToTeachingRequest(request.id, decision);
    if (decision === 'Accepted') {
      addToast(`Professor ${res.instructorName} accepted to teach "${res.courseName}"! College notification dispatched.`, 'success');
    } else {
      addToast(`Professor ${res.instructorName} declined. College notification dispatched.`, 'info');
    }
  };

  const handleResendMail = () => {
    addToast(`Resent teaching request email to ${request.email}!`, 'info');
  };

  return (
    <OrgLayout
      breadcrumbs={[
        { label: 'Course Teaching Requests', path: '/instructor-requests' },
        { label: request.name }
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/instructor-requests" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Teaching Requests</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-outline-variant">
                <img src={request.avatar} alt={request.name} className="w-20 h-20 rounded-3xl object-cover shadow-sm flex-shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl md:text-2xl font-bold text-on-surface">{request.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isAccepted ? 'bg-emerald-100 text-emerald-800' :
                      isPending ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-xs text-primary font-bold">{request.specialization}</p>
                  <p className="text-xs text-outline">
                    Dispatched on {request.sentDate || request.submittedDate} • Recipient: {request.email}
                  </p>
                </div>
              </div>

              {/* Sent by Mail Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#255ea6] text-white flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    College Teaching Request: Sent request by mail
                  </span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed pl-9">
                  {request.description}
                </p>
                <div className="pl-9 flex flex-wrap gap-4 text-[11px] text-blue-800 pt-1 font-medium">
                  <span>Professor Email: <strong>{request.email}</strong></span>
                  <span>Semester: <strong>{request.semester || 'Fall 2026'}</strong></span>
                  <span>Tracking: <strong>{request.trackingStatus}</strong></span>
                </div>
              </div>

              {/* Course Details Requested */}
              <div className="py-6 border-b border-outline-variant space-y-4">
                <h2 className="text-xs font-bold text-outline uppercase tracking-wider">Course Assignment Specification</h2>
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-2">
                  <h3 className="text-sm font-bold text-on-surface">{request.courseTitle || request.sampleSyllabus}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {request.sampleSyllabus}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-semibold pt-1">
                    <span className="text-primary">{request.creditHours || '4 Credits'}</span>
                    <span className="text-emerald-700">{request.proposedTerms}</span>
                  </div>
                </div>
              </div>

              {/* Faculty Bio */}
              <div className="pt-6 space-y-2">
                <h2 className="text-xs font-bold text-outline uppercase tracking-wider">College Faculty Profile</h2>
                <p className="text-xs text-on-surface leading-relaxed">{request.bio}</p>
              </div>

            </div>
          </div>

          {/* Right Action Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-5">
              <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
                Professor's Decision Controls
              </h2>

              <p className="text-xs text-on-surface-variant">
                The professor receives this request by mail and decides whether to teach. You can simulate the professor's decision here to see college notifications in action:
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={() => handleProfessorResponse('Accepted')}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Professor Accepts (Notify College)</span>
                </button>

                <button
                  onClick={() => handleProfessorResponse('Declined')}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-red-50 text-red-600 font-bold text-xs border border-outline-variant flex items-center justify-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Professor Declines (Notify College)</span>
                </button>

                <button
                  onClick={handleResendMail}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs border border-outline-variant flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Resend Request by Mail</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-[11px] text-outline space-y-1">
                <span className="font-bold text-on-surface block">Notification Protocol:</span>
                <span>When the professor accepts, a high-priority notification is dispatched to the college admin notification drawer.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </OrgLayout>
  );
}
