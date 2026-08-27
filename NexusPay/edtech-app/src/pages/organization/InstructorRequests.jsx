import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Send,
  Search,
  Check,
  X,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Calendar,
  Sparkles,
  Bell
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { useOrg } from '../../context/OrgContext';
import { useToast } from '../../components/common/Toast';

export default function InstructorRequests() {
  const { addToast } = useToast();
  const { instructors, instructorRequests, sendCourseTeachingRequest, respondToTeachingRequest } = useOrg();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New Course Teaching Request Form (targeting EXISTING college instructors)
  const [requestForm, setRequestForm] = useState({
    instructorId: instructors[0]?.id || 'inst-1',
    courseTitle: 'Distributed High-Throughput Settlement Engines',
    semester: 'Fall 2026',
    creditHours: '4 Academic Credits',
    proposedTerms: 'Academic Honorarium + 70/30 faculty course royalty',
    message: 'The Academic Council requests you to lead and teach this course for the upcoming term.'
  });

  const filteredRequests = instructorRequests.filter(req => {
    const matchesFilter = filter === 'All' ||
      (filter === 'Pending' && req.status.includes('Pending')) ||
      (filter === 'Accepted' && req.status.includes('Accepted')) ||
      (filter === 'Declined' && req.status.includes('Declined'));

    const matchesSearch = req.name.toLowerCase().includes(search.toLowerCase()) ||
                          (req.courseTitle && req.courseTitle.toLowerCase().includes(search.toLowerCase())) ||
                          req.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSendRequest = (e) => {
    e.preventDefault();
    const created = sendCourseTeachingRequest(requestForm);
    setShowModal(false);
    addToast(`College sent course teaching request by mail to ${created.name} for "${created.courseTitle}"!`, 'success');
  };

  const handleProfessorResponse = (id, decision) => {
    const res = respondToTeachingRequest(id, decision);
    if (decision === 'Accepted') {
      addToast(`Professor ${res.instructorName} accepted to teach "${res.courseName}"! College has been notified.`, 'success');
    } else {
      addToast(`Professor ${res.instructorName} declined to teach "${res.courseName}". College has been notified.`, 'info');
    }
  };

  const handleResendMail = (email, courseTitle) => {
    addToast(`Resent teaching request email to ${email} for "${courseTitle}"!`, 'info');
  };

  const pendingCount = instructorRequests.filter(r => r.status.includes('Pending')).length;
  const acceptedCount = instructorRequests.filter(r => r.status.includes('Accepted')).length;
  const declinedCount = instructorRequests.filter(r => r.status.includes('Declined')).length;

  return (
    <OrgLayout
      breadcrumbs={[{ label: 'Course Teaching Requests' }]}
      actions={
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Send Course Teaching Request by Mail</span>
        </button>
      }
    >
      <div className="space-y-6">
        
        {/* Header & Status Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Faculty Course Teaching Requests</h1>
            <p className="text-xs text-on-surface-variant mt-0.5 max-w-2xl">
              The college manages its existing faculty instructors. Send formal requests to professors to teach courses. When a professor accepts, the college is immediately notified.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Professor Choice: {pendingCount}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Accepted & Assigned: {acceptedCount}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
              <span>Declined: {declinedCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-4 shadow-elevation-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Pending', 'Accepted', 'Declined'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filter === tab
                    ? 'bg-[#255ea6] text-white shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {tab === 'Pending' ? 'Pending Professor Choice' : tab === 'Accepted' ? 'Accepted by Professor' : tab === 'Declined' ? 'Declined by Professor' : 'All Requests'}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty professor, course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
            />
          </div>
        </div>

        {/* Table of Course Teaching Requests */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-outline uppercase text-[10px] tracking-wider border-b border-outline-variant">
                  <th className="pb-3 font-bold">College Faculty Member</th>
                  <th className="pb-3 font-bold">Requested Course to Teach</th>
                  <th className="pb-3 font-bold">College Request Description</th>
                  <th className="pb-3 font-bold">Semester / Term</th>
                  <th className="pb-3 font-bold">Professor's Choice</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredRequests.map((req) => {
                  const isPending = req.status.includes('Pending');
                  const isAccepted = req.status.includes('Accepted');
                  const isDeclined = req.status.includes('Declined');

                  return (
                    <tr key={req.id} className="hover:bg-surface-container-low/50 transition-colors">
                      
                      {/* Faculty Member */}
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-2xl object-cover" />
                          <div>
                            <p className="font-bold text-sm text-on-surface">{req.name}</p>
                            <span className="text-[11px] text-outline flex items-center gap-1">
                              <Mail className="w-3 h-3 text-primary" />
                              <span>{req.email}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Requested Course */}
                      <td className="py-4 max-w-xs">
                        <span className="font-bold text-primary block leading-snug">
                          {req.courseTitle || req.sampleSyllabus}
                        </span>
                        <span className="text-[10px] text-outline block mt-0.5">
                          {req.creditHours || '4 Credits'} • {req.specialization}
                        </span>
                      </td>

                      {/* College Request Description */}
                      <td className="py-4 max-w-xs">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold">
                            <Mail className="w-2.5 h-2.5 text-primary" />
                            <span>Sent request by mail</span>
                          </span>
                          <p className="text-[11px] text-on-surface font-medium line-clamp-2 leading-relaxed">
                            {req.description}
                          </p>
                          <span className="text-[10px] text-outline block">
                            {req.trackingStatus}
                          </span>
                        </div>
                      </td>

                      {/* Semester */}
                      <td className="py-4 whitespace-nowrap font-medium text-on-surface">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-outline" />
                          <span>{req.semester || 'Fall 2026'}</span>
                        </span>
                      </td>

                      {/* Status / Professor's Choice */}
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          isAccepted ? 'bg-emerald-100 text-emerald-800' :
                          isPending ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-800'
                        }`}>
                          {isAccepted ? 'Accepted & Assigned' : isPending ? 'Pending Professor Choice' : 'Declined by Professor'}
                        </span>
                        {isAccepted && (
                          <span className="text-[9px] text-emerald-700 font-bold block mt-1 flex items-center gap-1">
                            <Bell className="w-2.5 h-2.5" /> College Notified
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                title="Professor Accepts Teaching Request (Simulate acceptance & notify college)"
                                onClick={() => handleProfessorResponse(req.id, 'Accepted')}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept</span>
                              </button>
                              <button
                                title="Professor Declines Teaching Request"
                                onClick={() => handleProfessorResponse(req.id, 'Declined')}
                                className="p-1.5 rounded-xl bg-surface-container hover:bg-red-50 text-red-600 border border-outline-variant transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <button
                                title="Resend course teaching request email to professor"
                                onClick={() => handleResendMail(req.email, req.courseTitle)}
                                className="p-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <Link
                            to={`/instructor-requests/${req.id}`}
                            className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </Link>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Send Course Teaching Request to Existing Instructor */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-elevation-3 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Send Course Teaching Request by Mail</h2>
                    <p className="text-xs text-on-surface-variant">Request an existing college professor to teach a course</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-xl hover:bg-surface-container text-outline"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendRequest} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Select College Faculty Member</label>
                  <select
                    value={requestForm.instructorId}
                    onChange={(e) => setRequestForm({ ...requestForm, instructorId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
                  >
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} — {inst.specialization} ({inst.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Target Course to Teach</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed High-Throughput Settlement Engines"
                    value={requestForm.courseTitle}
                    onChange={(e) => setRequestForm({ ...requestForm, courseTitle: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Academic Term / Semester</label>
                    <select
                      value={requestForm.semester}
                      onChange={(e) => setRequestForm({ ...requestForm, semester: e.target.value })}
                      className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
                    >
                      <option>Fall 2026</option>
                      <option>Spring 2027</option>
                      <option>Summer Intensive 2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Academic Credits</label>
                    <input
                      type="text"
                      value={requestForm.creditHours}
                      onChange={(e) => setRequestForm({ ...requestForm, creditHours: e.target.value })}
                      className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Honorarium & Teaching Royalty Terms</label>
                  <input
                    type="text"
                    value={requestForm.proposedTerms}
                    onChange={(e) => setRequestForm({ ...requestForm, proposedTerms: e.target.value })}
                    className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Invitation Letter / Mail Body</label>
                  <textarea
                    rows={3}
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                    className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>The college mail server will dispatch this course assignment request to the professor. The instructor can choose to accept or decline. When accepted, the college will be notified.</span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white font-bold flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Request by Mail</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </OrgLayout>
  );
}
