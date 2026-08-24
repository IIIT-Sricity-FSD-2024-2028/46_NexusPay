import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 11 Desktop Pages from Stitch
import Dashboard from './pages/Dashboard';
import ExploreCourses from './pages/ExploreCourses';
import CourseDetails from './pages/CourseDetails';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import MyLearning from './pages/MyLearning';
import CourseProgress from './pages/CourseProgress';
import LearningPlayer from './pages/LearningPlayer';
import Quiz from './pages/Quiz';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      {/* 1. Dashboard */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 2. Explore Courses */}
      <Route path="/explore" element={<ExploreCourses />} />
      <Route path="/browse" element={<ExploreCourses />} />
      <Route path="/courses" element={<ExploreCourses />} />

      {/* 3. Course Details */}
      <Route path="/course-details" element={<CourseDetails />} />
      <Route path="/course/:id" element={<CourseDetails />} />

      {/* 4. Checkout */}
      <Route path="/checkout" element={<Checkout />} />

      {/* 5. Payment Success */}
      <Route path="/payment-success" element={<PaymentSuccess />} />

      {/* 6. My Learning */}
      <Route path="/my-learning" element={<MyLearning />} />

      {/* 7. Course Progress */}
      <Route path="/course-progress" element={<CourseProgress />} />
      <Route path="/progress" element={<CourseProgress />} />

      {/* 8. Learning Player */}
      <Route path="/player" element={<LearningPlayer />} />
      <Route path="/learn" element={<LearningPlayer />} />

      {/* 9. Quiz */}
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/assessment" element={<Quiz />} />

      {/* 10. Certificates */}
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/certifications" element={<Certificates />} />

      {/* 11. Profile */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Profile />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
