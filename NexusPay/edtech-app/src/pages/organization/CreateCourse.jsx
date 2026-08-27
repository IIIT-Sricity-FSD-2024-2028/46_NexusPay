import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  BookOpen
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { useOrg } from '../../context/OrgContext';
import { useToast } from '../../components/common/Toast';

export default function CreateCourse() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { instructors, addCourse } = useOrg();

  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'Cloud Architecture',
    level: 'Advanced',
    instructorId: instructors[0]?.id || 'inst-1',
    price: '89.99',
    description: '',
    modules: [
      { id: 1, title: 'Module 1: Introduction to Architecture Patterns', lessons: 3, duration: '2h 15m' },
      { id: 2, title: 'Module 2: High Throughput Consensus & Failover', lessons: 4, duration: '3h 30m' }
    ]
  });

  const handleAddModule = () => {
    const nextId = courseForm.modules.length + 1;
    setCourseForm({
      ...courseForm,
      modules: [
        ...courseForm.modules,
        { id: nextId, title: `Module ${nextId}: Advanced Implementation`, lessons: 3, duration: '2h 00m' }
      ]
    });
  };

  const handleRemoveModule = (id) => {
    setCourseForm({
      ...courseForm,
      modules: courseForm.modules.filter(m => m.id !== id)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      addToast('Please enter a course title', 'error');
      return;
    }

    const created = addCourse(courseForm);
    addToast(`Course "${created.title}" successfully authored & published into the catalog!`, 'success');
    navigate('/courses');
  };

  return (
    <OrgLayout
      breadcrumbs={[
        { label: 'Courses', path: '/courses' },
        { label: 'Create New Course' }
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-on-surface">Author & Publish New Course</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Configure curriculum metadata, assign verified instructors, and structure lesson modules.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Basic Details */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1 space-y-4">
            <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
              1. Basic Course Details
            </h2>
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1.5">Course Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Consensus & High-Frequency Trading Systems"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1.5">Category</label>
                <select
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                >
                  <option>Cloud Architecture</option>
                  <option>Machine Learning</option>
                  <option>Cybersecurity</option>
                  <option>DevOps</option>
                  <option>Data Engineering</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1.5">Skill Level</label>
                <select
                  value={courseForm.level}
                  onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1.5">Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1.5">Course Summary & Syllabus Overview</label>
              <textarea
                rows={3}
                required
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Comprehensive technical breakdown of the course syllabus and hands-on lab projects..."
                className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
              />
            </div>
          </div>

          {/* 2. Assign Instructor */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1 space-y-4">
            <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
              2. Assign Primary Faculty Member
            </h2>
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1.5">Lead Instructor</label>
              <select
                value={courseForm.instructorId}
                onChange={(e) => setCourseForm({ ...courseForm, instructorId: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
              >
                {instructors.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Curriculum Modules */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <h2 className="text-base font-bold text-on-surface">3. Curriculum Modules</h2>
              <button
                type="button"
                onClick={handleAddModule}
                className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Module</span>
              </button>
            </div>
            <div className="space-y-3">
              {courseForm.modules.map((m, idx) => (
                <div key={m.id || idx} className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => {
                      const updated = [...courseForm.modules];
                      updated[idx].title = e.target.value;
                      setCourseForm({ ...courseForm, modules: updated });
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-outline-variant rounded-xl focus:outline-none focus:border-primary font-medium"
                  />
                  {courseForm.modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(m.id)}
                      className="p-2 text-outline hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submission Bar */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Publish Course to Catalog</span>
            </button>
          </div>

        </form>
      </div>
    </OrgLayout>
  );
}
