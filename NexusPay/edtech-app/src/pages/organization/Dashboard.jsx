import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ArrowRight,
  UserCheck,
  Check,
  X,
  Plus,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Mail,
  Send,
  RotateCcw
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function OrgDashboard() {
  const { addToast } = useToast();

  const handleResendMail = (email) => {
    addToast(`Resent invitation request email to ${email}!`, 'info');
  };

  const handleWithdrawInvitation = (name) => {
    addToast(`Withdrew recruitment invitation for ${name}`, 'error');
  };

  const handleMarkAccepted = (name) => {
    addToast(`${name} confirmed and accepted faculty invitation!`, 'success');
  };

  return (
    <OrgLayout
      breadcrumbs={[{ label: 'Dashboard' }]}
      actions={
        <Link
          to="/courses/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </Link>
      }
    >
      {/* Hero Stats Banner with Glassmorphism Cards */}
      <section className="w-full bg-gradient-to-r from-[#0B1E36] via-[#163B66] to-[#1E4E8C] text-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-elevation-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold mb-3 text-primary-fixed border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Organization Executive Overview</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {orgData.info.name}
          </h1>
          <p className="text-white/80 text-xs md:text-sm mt-1">
            Monitoring active faculty instructors, enterprise learners, course catalog enrollments, and real-time revenue settlement.
          </p>
        </div>

        {/* 4 Glassmorphism Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/70 font-semibold">Total Instructors</span>
              <GraduationCap className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-2xl font-black">{orgData.stats.totalInstructors}</p>
            <p className="text-[11px] text-emerald-300 font-medium mt-1">6 Specializations</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/70 font-semibold">Total Learners</span>
              <Users className="w-4 h-4 text-blue-300" />
            </div>
            <p className="text-2xl font-black">{orgData.stats.totalLearners.toLocaleString()}</p>
            <p className="text-[11px] text-blue-300 font-medium mt-1">+12% this month</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/70 font-semibold">Active Courses</span>
              <BookOpen className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-2xl font-black">{orgData.stats.activeCourses}</p>
            <p className="text-[11px] text-amber-300 font-medium mt-1">38 Published / 9 Draft</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/70 font-semibold">Monthly Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black">${orgData.stats.monthlyRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-300 font-medium mt-1">+18.4% vs last month</p>
          </div>
        </div>
      </section>

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Enrollments (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant mb-4">
            <div>
              <h2 className="text-base font-bold text-on-surface">Recent Course Enrollments</h2>
              <p className="text-xs text-on-surface-variant">Live feed of student course registrations</p>
            </div>
            <Link to="/enrollments" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>View All ({orgData.enrollments.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-outline uppercase text-[10px] tracking-wider border-b border-outline-variant/60">
                  <th className="pb-3 font-bold">Learner</th>
                  <th className="pb-3 font-bold">Enrolled Course</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {orgData.enrollments.slice(0, 5).map((enr) => (
                  <tr key={enr.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 flex items-center gap-2.5">
                      <img src={enr.learnerAvatar} alt={enr.learnerName} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-bold text-on-surface">{enr.learnerName}</span>
                    </td>
                    <td className="py-3 text-on-surface-variant max-w-[200px] truncate">{enr.courseTitle}</td>
                    <td className="py-3 text-outline text-[11px]">{enr.enrolledDate}</td>
                    <td className="py-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {enr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Revenue Overview Interactive Line Graph Widget (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 flex flex-col justify-between">
          <div>
            {/* Header with Title, Growth Pill and Timeframe Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-4">
              <div>
                <h2 className="text-base font-bold text-on-surface">Revenue Overview</h2>
                <p className="text-xs text-on-surface-variant">Monthly settlement progression</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  +18.4%
                </span>
                <div className="flex items-center p-0.5 rounded-lg bg-surface-container-low border border-outline-variant text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded-md bg-[#255ea6] text-white">6M</span>
                  <span className="px-2 py-0.5 text-outline hover:text-on-surface cursor-pointer">1Y</span>
                </div>
              </div>
            </div>

            {/* Current Month Figure & Legend */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
              <div>
                <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">Oct 2026 Inflow</span>
                <p className="text-2xl font-black text-on-surface">${orgData.stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-outline">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#255ea6]"></span>
                  <span className="text-on-surface font-medium">Direct Sales (66%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006d37]"></span>
                  <span className="text-on-surface font-medium">Enterprise (26%)</span>
                </span>
              </div>
            </div>

            {/* Chart Area with HTML Y-Axis and Responsive SVG Curve */}
            <div className="relative flex gap-3 h-44 pt-1">
              {/* Left Y-Axis Labels */}
              <div className="flex flex-col justify-between text-[10px] font-semibold text-outline pb-5 select-none text-right w-8">
                <span>$45k</span>
                <span>$30k</span>
                <span>$15k</span>
                <span>$0</span>
              </div>

              {/* Main SVG Graph Container */}
              <div className="flex-1 flex flex-col justify-between relative">
                <svg viewBox="0 0 460 130" className="w-full h-36 overflow-visible" preserveAspectRatio="none">
                  <defs>
                    {/* Primary Blue Area Gradient */}
                    <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#255ea6" stopOpacity="0.28" />
                      <stop offset="80%" stopColor="#255ea6" stopOpacity="0.04" />
                      <stop offset="100%" stopColor="#255ea6" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Guidelines */}
                  <line x1="0" y1="5" x2="460" y2="5" stroke="#c3c6d6" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
                  <line x1="0" y1="45" x2="460" y2="45" stroke="#c3c6d6" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
                  <line x1="0" y1="85" x2="460" y2="85" stroke="#c3c6d6" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
                  <line x1="0" y1="125" x2="460" y2="125" stroke="#c3c6d6" strokeWidth="1" strokeOpacity="0.7" />

                  {/* Smooth Area Fill */}
                  <path
                    d="M 15,108 C 75,98 120,88 175,76 C 230,64 285,48 340,36 C 390,26 425,18 450,10 L 450,125 L 15,125 Z"
                    fill="url(#revAreaGrad)"
                  />

                  {/* Primary Trend Curve */}
                  <path
                    d="M 15,108 C 75,98 120,88 175,76 C 230,64 285,48 340,36 C 390,26 425,18 450,10"
                    fill="none"
                    stroke="#255ea6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Secondary Enterprise Curve */}
                  <path
                    d="M 15,116 C 75,110 120,102 175,94 C 230,86 285,76 340,68 C 390,62 425,56 450,48"
                    fill="none"
                    stroke="#006d37"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />

                  {/* Data Points on Curve */}
                  {[
                    { cx: 15, cy: 108, month: "May", val: "$18.2k" },
                    { cx: 102, cy: 92, month: "Jun", val: "$23.5k" },
                    { cx: 189, cy: 74, month: "Jul", val: "$28.9k" },
                    { cx: 276, cy: 50, month: "Aug", val: "$34.1k" },
                    { cx: 363, cy: 30, month: "Sep", val: "$38.4k" },
                    { cx: 450, cy: 10, month: "Oct", val: "$42.5k" }
                  ].map((pt, i) => (
                    <g key={i} className="group cursor-pointer">
                      <circle
                        cx={pt.cx}
                        cy={pt.cy}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#255ea6"
                        strokeWidth="3"
                        className="transition-transform group-hover:scale-150"
                      />
                      {/* Tooltip on hover */}
                      <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <rect x={pt.cx - 24} y={pt.cy - 28} width="48" height="18" rx="4" fill="#0B1E36" />
                        <text x={pt.cx} y={pt.cy - 16} fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">
                          {pt.val}
                        </text>
                      </g>
                    </g>
                  ))}
                </svg>

                {/* Month X-Axis Labels */}
                <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-wider pt-1 px-1">
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Total Settlement Row */}
          <div className="pt-4 border-t border-outline-variant/60 mt-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-outline uppercase font-bold tracking-wider">Total Net Settlement YTD</span>
              <p className="text-xl font-black text-primary">${orgData.stats.annualRevenue.toLocaleString()}</p>
            </div>
            <Link
              to="/payments"
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors flex items-center gap-1"
            >
              <span>View Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Outbound Faculty Invitations Sent by Organization */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant mb-6">
          <div>
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <span>Faculty Invitations Sent by Organization</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                {orgData.instructorRequests.filter(r => r.status === 'Invite Sent').length} Awaiting Acceptance
              </span>
            </h2>
            <p className="text-xs text-on-surface-variant">Recruitment requests sent by mail to prospective educators</p>
          </div>
          <Link to="/instructor-requests" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            <span>Manage All Invitations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {orgData.instructorRequests.filter(r => r.status === 'Invite Sent').map((inv) => (
            <div key={inv.id} className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img src={inv.avatar} alt={inv.name} className="w-12 h-12 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">{inv.name}</h3>
                    <p className="text-[11px] text-outline">{inv.email}</p>
                    <span className="inline-block text-[10px] font-bold text-primary mt-0.5">{inv.specialization}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/60 mb-2">
                  <span className="text-[10px] font-bold text-blue-900 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-primary" />
                    <span>Sent request by mail</span>
                  </span>
                  <p className="text-[11px] text-blue-950 font-medium line-clamp-2 mt-0.5">
                    {inv.description}
                  </p>
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {inv.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/60 flex items-center gap-2">
                <button
                  title="Resend invitation request email"
                  onClick={() => handleResendMail(inv.email)}
                  className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMarkAccepted(inv.name)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Accepted</span>
                </button>
                <button
                  title="Withdraw invitation"
                  onClick={() => handleWithdrawInvitation(inv.name)}
                  className="py-2 px-3 rounded-xl bg-surface-container hover:bg-red-50 text-red-600 text-xs font-bold border border-outline-variant transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <Link
                  to={`/instructor-requests/${inv.id}`}
                  className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </OrgLayout>
  );
}
