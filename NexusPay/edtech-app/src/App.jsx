import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ================= ORGANIZATION ADMIN PAGES =================
import OrgDashboard from './pages/organization/Dashboard';
import OrgProfile from './pages/organization/Profile';
import OrgInstructorRequests from './pages/organization/InstructorRequests';
import OrgInstructorRequestDetails from './pages/organization/InstructorRequestDetails';
import OrgInstructors from './pages/organization/Instructors';
import OrgInstructorDetails from './pages/organization/InstructorDetails';
import OrgLearners from './pages/organization/Learners';
import OrgLearnerDetails from './pages/organization/LearnerDetails';
import OrgCourses from './pages/organization/Courses';
import OrgCourseDetails from './pages/organization/CourseDetails';
import OrgCreateCourse from './pages/organization/CreateCourse';
import OrgEditCourse from './pages/organization/EditCourse';
import OrgEnrollments from './pages/organization/Enrollments';
import OrgAssignCourses from './pages/organization/AssignCourses';
import OrgPayments from './pages/organization/Payments';
import OrgTransactions from './pages/organization/Transactions';
import OrgReports from './pages/organization/Reports';
import OrgAnalytics from './pages/organization/Analytics';
import OrgNotifications from './pages/organization/Notifications';
import OrgSettings from './pages/organization/Settings';

// ================= STUDENT / LEARNER PAGES =================
import StudentDashboard from './pages/student/Dashboard';
import StudentExplore from './pages/student/ExploreCourses';
import StudentCourseDetails from './pages/student/CourseDetails';
import StudentCheckout from './pages/student/Checkout';
import StudentPaymentSuccess from './pages/student/PaymentSuccess';
import StudentMyLearning from './pages/student/MyLearning';
import StudentCourseProgress from './pages/student/CourseProgress';
import StudentLearningPlayer from './pages/student/LearningPlayer';
import StudentQuiz from './pages/student/Quiz';
import StudentCertificates from './pages/student/Certificates';
import StudentProfile from './pages/student/Profile';

export default function App() {
  return (
    <Routes>
      {/* ================= PRIMARY APP: ORGANIZATION ADMIN ================= */}
      {/* 1. Dashboard (Default Root Route) */}
      <Route path="/" element={<OrgDashboard />} />
      <Route path="/dashboard" element={<OrgDashboard />} />
      <Route path="/org" element={<OrgDashboard />} />
      <Route path="/org/dashboard" element={<OrgDashboard />} />
      <Route path="/organization" element={<OrgDashboard />} />

      {/* 2. Organization Profile */}
      <Route path="/org/profile" element={<OrgProfile />} />
      <Route path="/org-profile" element={<OrgProfile />} />

      {/* 3. Instructor Requests */}
      <Route path="/org/instructor-requests" element={<OrgInstructorRequests />} />
      <Route path="/org/instructor-requests/:id" element={<OrgInstructorRequestDetails />} />
      <Route path="/instructor-requests" element={<OrgInstructorRequests />} />
      <Route path="/instructor-requests/:id" element={<OrgInstructorRequestDetails />} />

      {/* 4. Instructors Directory & Details */}
      <Route path="/org/instructors" element={<OrgInstructors />} />
      <Route path="/org/instructors/:id" element={<OrgInstructorDetails />} />
      <Route path="/instructors" element={<OrgInstructors />} />
      <Route path="/instructors/:id" element={<OrgInstructorDetails />} />

      {/* 5. Learners Directory & Details */}
      <Route path="/org/learners" element={<OrgLearners />} />
      <Route path="/org/learners/:id" element={<OrgLearnerDetails />} />
      <Route path="/learners" element={<OrgLearners />} />
      <Route path="/learners/:id" element={<OrgLearnerDetails />} />

      {/* 6. Courses Catalog, Create & Edit */}
      <Route path="/org/courses" element={<OrgCourses />} />
      <Route path="/org/courses/create" element={<OrgCreateCourse />} />
      <Route path="/org/courses/:id" element={<OrgCourseDetails />} />
      <Route path="/org/courses/:id/edit" element={<OrgEditCourse />} />
      <Route path="/courses" element={<OrgCourses />} />

      {/* 7. Enrollments & Course Assignment */}
      <Route path="/org/enrollments" element={<OrgEnrollments />} />
      <Route path="/org/assign-courses" element={<OrgAssignCourses />} />
      <Route path="/enrollments" element={<OrgEnrollments />} />
      <Route path="/assign-courses" element={<OrgAssignCourses />} />

      {/* 8. Payments & Financial Transactions */}
      <Route path="/org/payments" element={<OrgPayments />} />
      <Route path="/org/transactions" element={<OrgTransactions />} />
      <Route path="/payments" element={<OrgPayments />} />
      <Route path="/transactions" element={<OrgTransactions />} />

      {/* 9. Reports & Exports */}
      <Route path="/org/reports" element={<OrgReports />} />
      <Route path="/reports" element={<OrgReports />} />

      {/* 10. Analytics & Telemetry */}
      <Route path="/org/analytics" element={<OrgAnalytics />} />
      <Route path="/analytics" element={<OrgAnalytics />} />

      {/* 11. Notifications & Settings */}
      <Route path="/org/notifications" element={<OrgNotifications />} />
      <Route path="/org/settings" element={<OrgSettings />} />
      <Route path="/notifications" element={<OrgNotifications />} />
      <Route path="/settings" element={<OrgSettings />} />

      {/* ================= STUDENT / LEARNER MODULE ================= */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/explore" element={<StudentExplore />} />
      <Route path="/student/course-details" element={<StudentCourseDetails />} />
      <Route path="/student/course/:id" element={<StudentCourseDetails />} />
      <Route path="/student/checkout" element={<StudentCheckout />} />
      <Route path="/student/payment-success" element={<StudentPaymentSuccess />} />
      <Route path="/student/my-learning" element={<StudentMyLearning />} />
      <Route path="/student/course-progress" element={<StudentCourseProgress />} />
      <Route path="/student/player" element={<StudentLearningPlayer />} />
      <Route path="/student/quiz" element={<StudentQuiz />} />
      <Route path="/student/certificates" element={<StudentCertificates />} />
      <Route path="/student/profile" element={<StudentProfile />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
