import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Search,
  Check,
  CheckCircle2
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function AssignCourses() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [selectedCourses, setSelectedCourses] = useState(['crs-1']);
  const [selectedLearners, setSelectedLearners] = useState(['lrn-1', 'lrn-2']);
  const [courseSearch, setCourseSearch] = useState('');
  const [learnerSearch, setLearnerSearch] = useState('');

  const toggleCourse = (id) => {
    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const toggleLearner = (id) => {
    setSelectedLearners(prev =>
      prev.includes(id) ? prev.filter(lId => lId !== id) : [...prev, id]
    );
  };

  const totalCourseCost = selectedCourses.reduce((sum, cId) => {
    const course = orgData.courses.find(c => c.id === cId);
    return sum + (course ? course.price : 0);
  }, 0) * selectedLearners.length;

  const handleAssign = () => {
    if (selectedCourses.length === 0 || selectedLearners.length === 0) {
      addToast('Please select at least 1 course and 1 learner', 'error');
      return;
    }
    addToast(`Successfully assigned ${selectedCourses.length} course(s) to ${selectedLearners.length} student(s)!`, 'success');
    navigate('/enrollments');
  };

  return (
    <OrgLayout
      breadcrumbs={[
        { label: 'Enrollments', path: '/enrollments' },
        { label: 'Assign Courses' }
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <Link to="/enrollments" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Enrollments</span>
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-on-surface">Bulk Course Seat Assignment</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Select courses and student cohorts for automated institutional enrollment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <h2 className="text-base font-bold text-on-surface">1. Select Target Courses</h2>
              <span className="text-xs text-primary font-bold">{selectedCourses.length} Selected</span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter courses..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
              />
            </div>
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {orgData.courses.filter(c => c.title.toLowerCase().includes(courseSearch.toLowerCase())).map((course) => {
                const isSelected = selectedCourses.includes(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => toggleCourse(course.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-outline-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        isSelected ? 'bg-primary border-primary text-white' : 'border-outline-variant bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-on-surface line-clamp-1">{course.title}</h3>
                        <p className="text-[10px] text-outline">{course.instructorName} • {course.level}</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-emerald-700">${course.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <h2 className="text-base font-bold text-on-surface">2. Select Student Cohort</h2>
              <span className="text-xs text-primary font-bold">{selectedLearners.length} Selected</span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter students..."
                value={learnerSearch}
                onChange={(e) => setLearnerSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
              />
            </div>
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {orgData.learners.filter(l => l.name.toLowerCase().includes(learnerSearch.toLowerCase()) || l.email.toLowerCase().includes(learnerSearch.toLowerCase())).map((learner) => {
                const isSelected = selectedLearners.includes(learner.id);
                return (
                  <div
                    key={learner.id}
                    onClick={() => toggleLearner(learner.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-outline-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        isSelected ? 'bg-primary border-primary text-white' : 'border-outline-variant bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <img src={learner.avatar} alt={learner.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <h3 className="font-bold text-xs text-on-surface">{learner.name}</h3>
                        <p className="text-[10px] text-outline">{learner.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-bold text-on-surface-variant">
                      {learner.learnerType}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-outline font-medium">Assignment Summary:</span>
            <p className="text-sm font-bold text-on-surface">
              Assigning <strong className="text-primary">{selectedCourses.length} course(s)</strong> to <strong className="text-primary">{selectedLearners.length} learner(s)</strong>
            </p>
            <p className="text-xs text-emerald-700 font-bold mt-0.5">
              Total Organization Cost: ${totalCourseCost.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleAssign}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#255ea6] hover:bg-[#356ea8] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Provision Enrollments</span>
          </button>
        </div>
      </div>
    </OrgLayout>
  );
}
