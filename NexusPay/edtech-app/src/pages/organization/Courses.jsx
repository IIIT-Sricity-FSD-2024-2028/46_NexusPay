import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Eye,
  Users
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';

export default function Courses() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredCourses = orgData.courses.filter(c => {
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.instructorName.toLowerCase().includes(search.toLowerCase()) ||
                          c.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <OrgLayout
      breadcrumbs={[{ label: 'Courses' }]}
      actions={
        <Link
          to="/courses/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Organization Course Catalog</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Managing 47 masterclasses, curriculum modules, and enterprise training tracks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs font-semibold text-on-surface">
              Published: <strong>38</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs font-semibold text-on-surface">
              Drafts: <strong>9</strong>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-4 shadow-elevation-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Cloud Architecture', 'Machine Learning', 'Cybersecurity', 'DevOps'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-[#255ea6] text-white shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
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
                  <th className="pb-3 font-bold">Course Title</th>
                  <th className="pb-3 font-bold">Category</th>
                  <th className="pb-3 font-bold">Faculty Member</th>
                  <th className="pb-3 font-bold">Enrolled</th>
                  <th className="pb-3 font-bold">Price</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={c.thumbnail} alt={c.title} className="w-14 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-sm text-on-surface">{c.title}</p>
                          <p className="text-[10px] text-outline">{c.totalHours} • {c.lessonsCount} lessons</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-primary">{c.category}</td>
                    <td className="py-4 text-on-surface font-medium">{c.instructorName}</td>
                    <td className="py-4 font-bold text-on-surface">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-outline" />
                        <span>{c.enrolledCount}</span>
                      </span>
                    </td>
                    <td className="py-4 font-bold text-emerald-700">${c.price}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/courses/${c.id}/edit`}
                          className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/courses/${c.id}`}
                          className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
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
