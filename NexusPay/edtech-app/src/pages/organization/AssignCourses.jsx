import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Search,
  Check,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Send,
  Calendar,
  Mail,
  DollarSign
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { useOrg } from '../../context/OrgContext';
import { useToast } from '../../components/common/Toast';

export default function AssignCourses() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { instructors, courses, sendCourseTeachingRequest } = useOrg();

  // Read preselected instructor or course from URL if provided
  const queryParams = new URLSearchParams(location.search);
  const preselectedInstId = queryParams.get('instructorId') || instructors[0]?.id || 'inst-1';
  const preselectedCourseId = queryParams.get('courseId') || courses[0]?.id || 'crs-1';

  const [selectedInstructorId, setSelectedInstructorId] = useState(preselectedInstId);
  const [selectedCourseIds, setSelectedCourseIds] = useState([preselectedCourseId]);
  const [semester, setSemester] = useState('Fall 2026');
  const [creditHours, setCreditHours] = useState('4 Academic Credits / 45 Lecture Hours');
  const [proposedTerms, setProposedTerms] = useState('Departmental faculty honorarium + 70/30 course royalties');
  const [customMessage, setCustomMessage] = useState(
    'The College Academic Committee requests you to instruct this course for the upcoming academic term. Please confirm your availability.'
  );

  const [instructorSearch, setInstructorSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  const selectedInstructor = instructors.find(i => i.id === selectedInstructorId) || instructors[0];

  const toggleCourse = (id) => {
    setSelectedCourseIds(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(cId => cId !== id) : prev // keep at least 1
        : [...prev, id]
    );
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedInstructor) {
      addToast('Please select a faculty instructor', 'error');
      return;
    }
    if (selectedCourseIds.length === 0) {
      addToast('Please select at least one course to assign', 'error');
      return;
    }

    // Send course teaching request for each selected course
    selectedCourseIds.forEach(cId => {
      const course = courses.find(c => c.id === cId);
      sendCourseTeachingRequest({
        instructorId: selectedInstructor.id,
        courseTitle: course ? course.title : 'Specialized Engineering Track',
        semester: semester,
        creditHours: creditHours,
        proposedTerms: proposedTerms,
        message: customMessage
      });
    });

    addToast(
      `Course teaching request dispatched by mail to ${selectedInstructor.name} (${selectedInstructor.email})!`,
      'success'
    );
    navigate('/instructor-requests');
  };

  const filteredInstructors = instructors.filter(i =>
    i.name.toLowerCase().includes(instructorSearch.toLowerCase()) ||
    i.specialization.toLowerCase().includes(instructorSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <OrgLayout
      breadcrumbs={[
        { label: 'Courses', path: '/courses' },
        { label: 'Assign Course to Instructor' }
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-on-surface">Assign Course to Faculty Instructor</h1>
          <p className="text-xs text-on-surface-variant mt-0.5 max-w-2xl">
            The college assigns academic courses to its existing faculty. Select a professor and the target curriculum course. The formal teaching request will be dispatched by mail to the instructor.
          </p>
        </div>

        <form onSubmit={handleAssignSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Step 1: Select Faculty Instructor (5 cols) */}
            <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">1</span>
                  <h2 className="text-sm font-bold text-on-surface">Select Faculty Professor</h2>
                </div>
                <span className="text-[11px] text-outline font-semibold">{instructors.length} Available</span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search faculty by name or domain..."
                  value={instructorSearch}
                  onChange={(e) => setInstructorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                />
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {filteredInstructors.map((inst) => {
                  const isSelected = selectedInstructorId === inst.id;
                  return (
                    <div
                      key={inst.id}
                      onClick={() => setSelectedInstructorId(inst.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                          : 'border-outline-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={inst.avatar} alt={inst.name} className="w-10 h-10 rounded-2xl object-cover" />
                        <div>
                          <h3 className="font-bold text-xs text-on-surface">{inst.name}</h3>
                          <p className="text-[10px] text-primary font-semibold">{inst.specialization}</p>
                          <span className="text-[10px] text-outline flex items-center gap-1 mt-0.5">
                            <Mail className="w-2.5 h-2.5" /> {inst.email}
                          </span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-primary border-primary text-white' : 'border-outline-variant bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Target Course(s) (7 cols) */}
            <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">2</span>
                  <h2 className="text-sm font-bold text-on-surface">Select Course(s) to Assign</h2>
                </div>
                <span className="text-xs text-primary font-bold">{selectedCourseIds.length} Course(s) Selected</span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search course catalog..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                />
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {filteredCourses.map((c) => {
                  const isSelected = selectedCourseIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleCourse(c.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                          : 'border-outline-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-primary border-primary text-white' : 'border-outline-variant bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <img src={c.thumbnail} alt={c.title} className="w-12 h-9 rounded-xl object-cover flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-xs text-on-surface line-clamp-1">{c.title}</h3>
                          <p className="text-[10px] text-outline">{c.category} • {c.totalHours} • Currently: {c.instructorName}</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-emerald-700">${c.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Step 3: Semester, Compensation, and Invitation Letter */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1 space-y-4">
            <h2 className="text-sm font-bold text-on-surface pb-3 border-b border-outline-variant flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">3</span>
              <span>Teaching Assignment Terms & Formal Mail Letter</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Academic Term / Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
                >
                  <option>Fall 2026 (Aug – Dec)</option>
                  <option>Spring 2027 (Jan – May)</option>
                  <option>Summer Intensive 2027 (Jun – Jul)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Course Credits & Lecture Hours</label>
                <input
                  type="text"
                  value={creditHours}
                  onChange={(e) => setCreditHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Faculty Honorarium & Compensation Terms</label>
              <input
                type="text"
                value={proposedTerms}
                onChange={(e) => setProposedTerms(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Dean's Official Assignment Letter</label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3 text-xs bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-medium"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <span>
                When confirmed, the college mail server dispatches the formal teaching request to <strong>{selectedInstructor?.email}</strong>. The instructor will review and make their choice. When accepted, the college is automatically notified.
              </span>
            </div>
          </div>

          {/* Submission Bar */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-outline font-medium">Assignment Overview:</span>
              <p className="text-sm font-bold text-on-surface">
                Assigning <strong className="text-primary">{selectedCourseIds.length} course(s)</strong> to professor <strong className="text-primary">{selectedInstructor?.name}</strong>
              </p>
              <p className="text-xs text-outline mt-0.5">
                Target Term: {semester} • Recipient: {selectedInstructor?.email}
              </p>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#255ea6] hover:bg-[#356ea8] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Assign Course & Dispatch Mail</span>
            </button>
          </div>
        </form>

      </div>
    </OrgLayout>
  );
}
