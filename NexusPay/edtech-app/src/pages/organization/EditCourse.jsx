import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Trash2
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const course = orgData.courses.find(c => c.id === id) || orgData.courses[0];
  const [courseForm, setCourseForm] = useState({
    title: course.title,
    category: course.category,
    level: course.level,
    price: course.price.toString(),
    description: course.description
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast(`Course "${courseForm.title}" updated successfully!`, 'success');
    navigate('/courses');
  };

  const handleDelete = () => {
    addToast(`Course archived and removed from active catalog`, 'error');
    navigate('/courses');
  };

  return (
    <OrgLayout
      breadcrumbs={[
        { label: 'Courses', path: '/courses' },
        { label: `Edit: ${course.title}` }
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Edit Course: {course.title}</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">Modify curriculum syllabus and metadata</p>
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Archive Course</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1 space-y-5">
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1.5">Course Title</label>
            <input
              type="text"
              required
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
              <label className="text-xs font-bold text-on-surface block mb-1.5">Level</label>
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
            <label className="text-xs font-bold text-on-surface block mb-1.5">Description</label>
            <textarea
              rows={3}
              required
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/60">
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Update Course</span>
            </button>
          </div>
        </form>
      </div>
    </OrgLayout>
  );
}
