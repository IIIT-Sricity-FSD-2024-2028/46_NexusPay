import React, { useState } from 'react';
import {
  Star,
  TrendingUp,
  BookOpen,
  Users,
  Award,
  DollarSign
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('30d');

  return (
    <OrgLayout breadcrumbs={[{ label: 'Analytics' }]}>
      <div className="space-y-6">
        
        {/* Header & Timeframe Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Organization Intelligence & Analytics</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Comprehensive telemetry on learner engagement, course completion velocities, and domain revenue.
            </p>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-container-low border border-outline-variant">
            {['7d', '30d', '90d', '1y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === tf ? 'bg-[#255ea6] text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 shadow-elevation-1">
            <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">New Enrollments</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-on-surface">234</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                +12.4%
              </span>
            </div>
            <p className="text-[11px] text-outline mt-1">vs 208 in previous 30 days</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 shadow-elevation-1">
            <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">Completion Rate</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-primary">72%</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                +4.1%
              </span>
            </div>
            <p className="text-[11px] text-outline mt-1">Above enterprise benchmark (65%)</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 shadow-elevation-1">
            <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">Average Course Rating</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-amber-600 flex items-center gap-1">
                <Star className="w-5 h-5 fill-current" /> 4.8
              </span>
              <span className="text-xs font-bold text-outline">1,245 reviews</span>
            </div>
            <p className="text-[11px] text-outline mt-1">98% positive satisfaction score</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 shadow-elevation-1">
            <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">Monthly Net Revenue</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-emerald-700">${orgData.stats.monthlyRevenue.toLocaleString()}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                +18.4%
              </span>
            </div>
            <p className="text-[11px] text-outline mt-1">Record institutional billing</p>
          </div>
        </div>

        {/* Row 1: Charts (Enrollment Trends Line Chart + Revenue by Category Donut Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Enrollment Trends Line/Area Chart (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div>
                <h2 className="text-base font-bold text-on-surface">Enrollment Trends</h2>
                <p className="text-xs text-on-surface-variant">Monthly student acquisition progression</p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                +24% YTD Growth
              </span>
            </div>

            {/* Chart Area with HTML Y-Axis and Responsive SVG Curve */}
            <div className="relative flex gap-3 h-44 pt-1">
              {/* Left Y-Axis Labels */}
              <div className="flex flex-col justify-between text-[10px] font-semibold text-outline pb-5 select-none text-right w-8">
                <span>250</span>
                <span>180</span>
                <span>100</span>
                <span>0</span>
              </div>

              {/* Main SVG Graph Container */}
              <div className="flex-1 flex flex-col justify-between relative">
                <svg viewBox="0 0 460 130" className="w-full h-36 overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="enrAreaGrad" x1="0" y1="0" x2="0" y2="1">
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
                    d="M 15,105 C 75,92 120,78 175,65 C 230,52 285,38 340,26 C 390,18 425,12 450,8 L 450,125 L 15,125 Z"
                    fill="url(#enrAreaGrad)"
                  />

                  {/* Primary Trend Curve */}
                  <path
                    d="M 15,105 C 75,92 120,78 175,65 C 230,52 285,38 340,26 C 390,18 425,12 450,8"
                    fill="none"
                    stroke="#255ea6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points on Curve */}
                  {[
                    { cx: 15, cy: 105, month: "May", val: "105" },
                    { cx: 102, cy: 85, month: "Jun", val: "142" },
                    { cx: 189, cy: 68, month: "Jul", val: "178" },
                    { cx: 276, cy: 45, month: "Aug", val: "204" },
                    { cx: 363, cy: 26, month: "Sep", val: "218" },
                    { cx: 450, cy: 8, month: "Oct", val: "234" }
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
                        <rect x={pt.cx - 20} y={pt.cy - 28} width="40" height="18" rx="4" fill="#0B1E36" />
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

          {/* Revenue by Category (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-4">
            <h2 className="text-base font-bold text-on-surface pb-2 border-b border-outline-variant">
              Revenue by Category
            </h2>

            {/* Visual Ring Donut Chart Representation */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-36 h-36 -rotate-90">
                  {/* Circle 1: Cloud 40% */}
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#255ea6" strokeWidth="3.8" strokeDasharray="40 60" strokeDashoffset="0" />
                  {/* Circle 2: ML 30% */}
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#006d37" strokeWidth="3.8" strokeDasharray="30 70" strokeDashoffset="-40" />
                  {/* Circle 3: Security 17% */}
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#b45309" strokeWidth="3.8" strokeDasharray="17 83" strokeDashoffset="-70" />
                  {/* Circle 4: DevOps 13% */}
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#64748b" strokeWidth="3.8" strokeDasharray="13 87" strokeDashoffset="-87" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-[10px] text-outline uppercase font-bold block">Monthly</span>
                  <span className="text-sm font-black text-on-surface">$42.5k</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#255ea6]"></span>
                <span className="font-semibold text-on-surface">Cloud (40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006d37]"></span>
                <span className="font-semibold text-on-surface">Machine Learning (30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]"></span>
                <span className="font-semibold text-on-surface">Security (17%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#64748b]"></span>
                <span className="font-semibold text-on-surface">DevOps (13%)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Top Performing Courses & Top Faculty Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Performing Courses */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-4">
            <h2 className="text-base font-bold text-on-surface pb-2 border-b border-outline-variant">
              Top Performing Courses
            </h2>
            <div className="divide-y divide-outline-variant/40">
              {orgData.courses.slice(0, 4).map((c, rank) => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-surface-container text-outline font-bold text-xs flex items-center justify-center">
                      #{rank + 1}
                    </span>
                    <img src={c.thumbnail} alt={c.title} className="w-10 h-8 rounded-lg object-cover" />
                    <div>
                      <h3 className="font-bold text-xs text-on-surface line-clamp-1">{c.title}</h3>
                      <p className="text-[10px] text-outline">{c.instructorName} • {c.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700">${c.revenue.toLocaleString()}</span>
                    <span className="text-[10px] text-outline block">{c.enrolledCount} learners</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Instructors */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-4">
            <h2 className="text-base font-bold text-on-surface pb-2 border-b border-outline-variant">
              Top Faculty Instructors
            </h2>
            <div className="divide-y divide-outline-variant/40">
              {orgData.instructors.slice(0, 4).map((inst, rank) => (
                <div key={inst.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-surface-container text-outline font-bold text-xs flex items-center justify-center">
                      #{rank + 1}
                    </span>
                    <img src={inst.avatar} alt={inst.name} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-xs text-on-surface">{inst.name}</h3>
                      <p className="text-[10px] text-outline">{inst.specialization}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700">${inst.revenueGenerated.toLocaleString()}</span>
                    <span className="text-[10px] text-outline block">{inst.enrolledStudents} students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </OrgLayout>
  );
}
