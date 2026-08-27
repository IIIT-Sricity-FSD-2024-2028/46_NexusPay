import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Plus,
  Star,
  ChevronRight,
  Mail
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function Instructors() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');

  const filteredInstructors = orgData.instructors.filter(inst =>
    inst.name.toLowerCase().includes(search.toLowerCase()) ||
    inst.specialization.toLowerCase().includes(search.toLowerCase()) ||
    inst.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <OrgLayout
      breadcrumbs={[{ label: 'Instructors' }]}
      actions={
        <button
          onClick={() => addToast('Faculty invitation modal opened', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Faculty Member</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Organization Faculty & Instructors</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Managing {orgData.instructors.length} accredited educators across engineering & fintech domains.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty by name, topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((inst) => (
            <div
              key={inst.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={inst.avatar} alt={inst.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                    <div>
                      <h3 className="font-bold text-sm text-on-surface">{inst.name}</h3>
                      <p className="text-[11px] text-primary font-semibold">{inst.educatorType}</p>
                      <span className="text-[10px] text-outline flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {inst.email}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {inst.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-surface-container text-[11px] font-bold text-on-surface">
                    {inst.specialization}
                  </span>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {inst.bio}
                  </p>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-outline-variant/60 text-center text-xs my-2">
                  <div>
                    <span className="text-[10px] text-outline uppercase block font-medium">Courses</span>
                    <span className="font-bold text-on-surface">{inst.coursesCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline uppercase block font-medium">Learners</span>
                    <span className="font-bold text-on-surface">{inst.enrolledStudents}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline uppercase block font-medium">Rating</span>
                    <span className="font-bold text-amber-600 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" /> {inst.avgRating}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/instructors/${inst.id}`}
                  className="w-full mt-2 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Educator Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OrgLayout>
  );
}
