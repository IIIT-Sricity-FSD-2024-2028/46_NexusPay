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
  Sparkles
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { useOrg } from '../../context/OrgContext';
import { useToast } from '../../components/common/Toast';

export default function InstructorRequests() {
  const { addToast } = useToast();
  const { instructorRequests, addInvitation, updateInvitationStatus } = useOrg();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // New Invitation Form State
  const [newInvite, setNewInvite] = useState({
    name: '',
    email: '',
    specialization: 'Cloud Architecture & Distributed Systems',
    sampleSyllabus: 'Advanced High-Throughput Settlement Architectures',
    proposedTerms: '70/30 gross royalty distribution + authoring stipend',
    customMessage: 'We would be honored to invite you to join the NexusPay Enterprise Academy faculty as Lead Instructor for our enterprise payment engineering cohort.'
  });

  const filteredInvitations = instructorRequests.filter(inv => {
    const matchesFilter = filter === 'All' || inv.status === filter;
    const matchesSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
                          inv.specialization.toLowerCase().includes(search.toLowerCase()) ||
                          inv.email.toLowerCase().includes(search.toLowerCase()) ||
                          (inv.description && inv.description.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleSendInviteSubmit = (e) => {
    e.preventDefault();
    if (!newInvite.name || !newInvite.email) {
      addToast('Please provide both the educator name and email address', 'error');
      return;
    }

    addInvitation(newInvite);
    setShowInviteModal(false);
    setNewInvite({
      name: '',
      email: '',
      specialization: 'Cloud Architecture & Distributed Systems',
      sampleSyllabus: 'Advanced High-Throughput Settlement Architectures',
      proposedTerms: '70/30 gross royalty distribution + authoring stipend',
      customMessage: ''
    });

    addToast(`Organization sent invitation request by mail to ${newInvite.email}!`, 'success');
  };

  const handleResendMail = (id, name, email) => {
    addToast(`Resent invitation request email to ${email}!`, 'info');
  };

  const handleWithdraw = (id, name) => {
    updateInvitationStatus(id, 'Declined', 'Invitation withdrawn by organization');
    addToast(`Withdrew invitation sent to ${name}`, 'error');
  };

  const handleMarkAccepted = (id, name) => {
    updateInvitationStatus(id, 'Accepted', 'Accepted by educator • Onboarded');
    addToast(`${name} confirmed and accepted faculty invitation!`, 'success');
  };

  return (
    <OrgLayout
      breadcrumbs={[{ label: 'Instructor Invitations' }]}
      actions={
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Send Faculty Request by Mail</span>
        </button>
      }
    >
      <div className="space-y-6">
        
        {/* Header & Status Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Faculty Invitations & Outreach</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Official requests sent by NexusPay Organization by mail to prospective educators and track acceptance status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Acceptance: {invitations.filter(r => r.status === 'Invite Sent').length}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Accepted: {invitations.filter(r => r.status === 'Accepted').length}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
              <span>Declined / Withdrawn: {invitations.filter(r => r.status === 'Declined').length}</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-4 shadow-elevation-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Invite Sent', 'Accepted', 'Declined'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filter === tab
                    ? 'bg-[#255ea6] text-white shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {tab === 'Invite Sent' ? 'Awaiting Acceptance' : tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invited educator, email, track..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
            />
          </div>
        </div>

        {/* Invitations Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-outline uppercase text-[10px] tracking-wider border-b border-outline-variant">
                  <th className="pb-3 font-bold">Target Educator</th>
                  <th className="pb-3 font-bold">Organization Request Description</th>
                  <th className="pb-3 font-bold">Proposed Curriculum Track</th>
                  <th className="pb-3 font-bold">Dispatch Date</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredInvitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-container-low/50 transition-colors">
                    
                    {/* Educator Column */}
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={inv.avatar} alt={inv.name} className="w-10 h-10 rounded-2xl object-cover" />
                        <div>
                          <p className="font-bold text-sm text-on-surface">{inv.name}</p>
                          <span className="text-[11px] text-outline flex items-center gap-1">
                            <Mail className="w-3 h-3 text-primary" />
                            <span>{inv.email}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Description Column */}
                    <td className="py-4 max-w-xs">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold">
                          <Mail className="w-2.5 h-2.5 text-primary" />
                          <span>Sent request by mail</span>
                        </span>
                        <p className="text-[11px] text-on-surface font-medium line-clamp-2 leading-relaxed">
                          {inv.description || `Organization sent formal invitation request by mail to ${inv.name}.`}
                        </p>
                        <span className="text-[10px] text-outline block">
                          {inv.trackingStatus}
                        </span>
                      </div>
                    </td>

                    {/* Track Column */}
                    <td className="py-4">
                      <span className="font-semibold text-primary block">{inv.specialization}</span>
                      <span className="text-[11px] text-on-surface-variant line-clamp-1">{inv.sampleSyllabus}</span>
                    </td>

                    {/* Date Column */}
                    <td className="py-4 text-outline whitespace-nowrap">
                      {inv.sentDate || inv.submittedDate}
                    </td>

                    {/* Status Column */}
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        inv.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'Invite Sent' ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-800'
                      }`}>
                        {inv.status === 'Invite Sent' ? 'Awaiting Acceptance' : inv.status}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status === 'Invite Sent' && (
                          <>
                            <button
                              title="Resend invitation request email"
                              onClick={() => handleResendMail(inv.id, inv.name, inv.email)}
                              className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Mark as accepted by educator"
                              onClick={() => handleMarkAccepted(inv.id, inv.name)}
                              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Withdraw invitation"
                              onClick={() => handleWithdraw(inv.id, inv.name)}
                              className="p-2 rounded-xl bg-surface-container hover:bg-red-50 text-red-600 border border-outline-variant transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/instructor-requests/${inv.id}`}
                          className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </Link>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Send New Faculty Request by Mail */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-elevation-3 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Send Faculty Request by Mail</h2>
                    <p className="text-xs text-on-surface-variant">Dispatch an official invitation to a prospective educator</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 rounded-xl hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendInviteSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Educator Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Alan Turing"
                    value={newInvite.name}
                    onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Official Academic / Professional Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. a.turing@cambridge.ac.uk"
                    value={newInvite.email}
                    onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">Specialization Domain</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Distributed Consensus Systems"
                      value={newInvite.specialization}
                      onChange={(e) => setNewInvite({ ...newInvite, specialization: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">Proposed Track Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Masterclass in High Throughput Consensus"
                      value={newInvite.sampleSyllabus}
                      onChange={(e) => setNewInvite({ ...newInvite, sampleSyllabus: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Proposed Terms / Grant Stipend</label>
                  <input
                    type="text"
                    value={newInvite.proposedTerms}
                    onChange={(e) => setNewInvite({ ...newInvite, proposedTerms: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Invitation Letter / Email Body</label>
                  <textarea
                    rows={3}
                    value={newInvite.customMessage}
                    onChange={(e) => setNewInvite({ ...newInvite, customMessage: e.target.value })}
                    placeholder="We would be delighted to invite you to join the NexusPay Enterprise Academy faculty..."
                    className="w-full p-3 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>The organization will dispatch this request directly by mail to the educator with a personalized onboarding token.</span>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
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
