import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  ArrowRight, 
  Clock, 
  Flame, 
  BookOpen, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Target
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import CourseCard from '../components/common/CourseCard';
import Badge from '../components/common/Badge';
import { LinearProgressBar } from '../components/common/ProgressBar';
import { coursesData } from '../data/coursesData';
import { userData } from '../data/userData';

export default function Dashboard() {
  const activeCourse = coursesData.find(c => c.id === 'aws-solutions-architect') || coursesData[1];
  const inProgressCourses = coursesData.filter(c => c.progress && c.id !== 'aws-solutions-architect');
  const recommendedCourses = coursesData.slice(0, 4);

  return (
    <PageLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Welcome Banner & Quick Stats (Soft Muted Blue Gradient) */}
        <section className="bg-gradient-to-r from-[#205295] via-[#2C66A9] to-[#173F74] text-white rounded-3xl p-6 md:p-8 shadow-elevation-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold mb-3 text-primary-fixed border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-tertiary-fixed" />
              <span>NexusPay Enterprise Academy</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
              Welcome back, {userData.name.split(' ')[0]}!
            </h1>
            <p className="text-on-primary-container text-xs md:text-sm leading-relaxed mb-6 font-normal">
              You are making steady progress this week. Continue your cloud architecture and distributed payment systems specialization.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/player"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary text-xs font-bold hover:bg-surface-container-low shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Lesson 2.3</span>
              </Link>
              <Link
                to="/my-learning"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all backdrop-blur-sm"
              >
                <span>Enrolled Tracks ({userData.stats.enrolledCourses})</span>
              </Link>
            </div>
          </div>

          {/* Stat Badges Row inside Hero */}
          <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl backdrop-blur-xs border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-tertiary-fixed fill-current" />
              </div>
              <div>
                <p className="text-base font-bold">{userData.streakDays} Days</p>
                <p className="text-[11px] text-primary-fixed">Daily Streak</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl backdrop-blur-xs border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-secondary-fixed" />
              </div>
              <div>
                <p className="text-base font-bold">{userData.completedHoursThisWeek} / {userData.weeklyGoalHours}h</p>
                <p className="text-[11px] text-primary-fixed">Weekly Goal</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl backdrop-blur-xs border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold">{userData.stats.enrolledCourses} Tracks</p>
                <p className="text-[11px] text-primary-fixed">Active Study</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl backdrop-blur-xs border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-tertiary-fixed-dim" />
              </div>
              <div>
                <p className="text-base font-bold">{userData.stats.certificatesEarned} Earned</p>
                <p className="text-[11px] text-primary-fixed">Certificates</p>
              </div>
            </div>
          </div>
        </section>

        {/* Continue Learning Featured Card */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Continue Learning</h2>
              <p className="text-xs text-on-surface-variant">Your current active professional specialization track</p>
            </div>
            <Link
              to="/course-progress"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Milestones</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 md:p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-all">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              
              <div className="w-full lg:w-80 h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container relative shadow-sm">
                <img
                  src={activeCourse.thumbnail}
                  alt={activeCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-bold text-white">
                    {activeCourse.currentModule}
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="primary" size="sm">{activeCourse.category}</Badge>
                    <span className="text-xs text-outline font-medium">{activeCourse.institution}</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-on-surface mb-1">
                    {activeCourse.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {activeCourse.subtitle}
                  </p>
                </div>

                <div className="space-y-3">
                  <LinearProgressBar 
                    progress={activeCourse.progress || 72} 
                    showLabel={true}
                    color="bg-primary"
                    height="h-2"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/60">
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                      <span className="flex items-center gap-1.5 text-on-surface font-semibold">
                        <Clock className="w-3.5 h-3.5 text-primary" /> Next Up: 2.3 State Management in NexusPay (10m)
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Link
                        to="/quiz"
                        className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                      >
                        Take Module Quiz
                      </Link>
                      <Link
                        to="/player"
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-xs transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Resume Lesson</span>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* In Progress Grid (3 Columns) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-on-surface">In Progress</h2>
              <p className="text-xs text-on-surface-variant">Pick up where you left off across enrolled tracks</p>
            </div>
            <Link to="/my-learning" className="text-xs font-bold text-primary hover:underline">
              View All Enrolled ({inProgressCourses.length + 1}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => (
              <CourseCard key={course.id} course={course} variant="in-progress" />
            ))}
          </div>
        </section>

        {/* Recommended For You Section (4 Columns) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Recommended For You</h2>
              <p className="text-xs text-on-surface-variant">Based on your fintech architecture and cloud specialization</p>
            </div>
            <Link to="/explore" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>Explore All Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course} variant="explore" />
            ))}
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
