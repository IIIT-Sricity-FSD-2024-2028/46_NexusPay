import React, { createContext, useContext, useState, useEffect } from 'react';
import { orgData as initialData } from '../data/orgData';

const OrgContext = createContext();

const STORAGE_KEY = 'nexuspay_org_state_v1';

export function OrgProvider({ children }) {
  // Load persisted state or fallback to initialData
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load org state from localStorage', e);
    }
    return {
      info: { ...initialData.info },
      instructors: [...initialData.instructors],
      instructorRequests: [...initialData.instructorRequests],
      learners: [...initialData.learners],
      courses: [...initialData.courses],
      enrollments: [...initialData.enrollments],
      transactions: [...initialData.transactions],
      reports: [...initialData.reports],
      notifications: [...initialData.notifications],
      settings: {
        autoApproveEnrollments: true,
        emailAlerts: true,
        royaltyAlerts: true,
        weeklyDigest: false,
        requireTwoFactor: true,
        defaultCurrency: 'USD',
        defaultAccessType: 'Paid Masterclass'
      }
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist org state', e);
    }
  }, [state]);

  // Derived Dynamic Statistics
  const stats = {
    totalInstructors: state.instructors.length,
    totalLearners: state.learners.length,
    activeCourses: state.courses.length,
    totalEnrollments: state.enrollments.length,
    pendingRequests: state.instructorRequests.filter(r => r.status === 'Invite Sent' || r.status === 'Pending').length,
    unreadNotifications: state.notifications.filter(n => !n.read).length,
    annualRevenue: state.courses.reduce((sum, c) => sum + (c.revenue || (c.price * (c.enrolledCount || 10))), 0),
    monthlyRevenue: Math.round(state.courses.reduce((sum, c) => sum + (c.revenue || (c.price * (c.enrolledCount || 10))), 0) * 0.3)
  };

  // --- ACTIONS ---

  // 1. Organization Profile Actions
  const updateOrgInfo = (newInfo) => {
    setState(prev => ({
      ...prev,
      info: { ...prev.info, ...newInfo }
    }));
  };

  // 2. Course Management Actions
  const addCourse = (courseData) => {
    const newId = `crs-${Date.now()}`;
    const instructor = state.instructors.find(i => i.id === courseData.instructorId) || state.instructors[0];

    const newCourse = {
      id: newId,
      title: courseData.title,
      category: courseData.category || 'Cloud Architecture',
      level: courseData.level || 'Advanced',
      instructorId: instructor.id,
      instructorName: instructor.name,
      enrolledCount: 0,
      price: parseFloat(courseData.price) || 89.99,
      revenue: 0,
      rating: 5.0,
      totalHours: '18h 30m',
      lessonsCount: (courseData.modules || []).reduce((sum, m) => sum + (m.lessons || 3), 0) || 12,
      status: 'Published',
      thumbnail: courseData.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80",
      description: courseData.description || 'Newly authored curriculum track on enterprise architecture and cloud engineering.',
      modules: courseData.modules || [
        { id: 'mod-1', title: 'Module 1: Architecture Foundations', lessons: 4, duration: '3h 15m' },
        { id: 'mod-2', title: 'Module 2: High Throughput Replication', lessons: 5, duration: '4h 00m' }
      ]
    };

    setState(prev => ({
      ...prev,
      courses: [newCourse, ...prev.courses]
    }));

    return newCourse;
  };

  const updateCourse = (courseId, updatedData) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === courseId ? { ...c, ...updatedData, price: parseFloat(updatedData.price) || c.price } : c)
    }));
  };

  const deleteCourse = (courseId) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== courseId)
    }));
  };

  // 3. Faculty Invitations (Outreach sent by Organization)
  const addInvitation = (inviteData) => {
    const newId = `req-${Date.now()}`;
    const newInvite = {
      id: newId,
      name: inviteData.name,
      email: inviteData.email,
      avatar: inviteData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      specialization: inviteData.specialization,
      expertise: [inviteData.specialization.split(' ')[0], "Enterprise", "Architecture"],
      qualification: inviteData.qualification || "Academic Researcher / Specialist",
      experience: inviteData.experience || "Senior Practitioner",
      submittedDate: "Just now",
      sentDate: "Just now",
      status: "Invite Sent",
      outreachMethod: "Sent request by mail",
      mailSubject: `Invitation to lead ${inviteData.specialization} at NexusPay Academy`,
      description: `Organization has sent an official invitation request by mail to ${inviteData.name} (${inviteData.email}) to lead the ${inviteData.specialization} track.`,
      bio: inviteData.bio || "Invited faculty prospect.",
      sampleSyllabus: inviteData.sampleSyllabus || "Masterclass curriculum track",
      proposedTerms: inviteData.proposedTerms || "70/30 gross royalty distribution + authoring stipend",
      trackingStatus: "Dispatched via Mail • Awaiting educator acceptance",
      adminNotes: "Dispatched via official NexusPay mail server."
    };

    setState(prev => ({
      ...prev,
      instructorRequests: [newInvite, ...prev.instructorRequests]
    }));

    return newInvite;
  };

  const updateInvitationStatus = (id, status, trackingStatus) => {
    setState(prev => ({
      ...prev,
      instructorRequests: prev.instructorRequests.map(inv => {
        if (inv.id === id) {
          return {
            ...inv,
            status,
            trackingStatus: trackingStatus || (status === 'Accepted' ? 'Accepted by educator • Onboarded' : 'Invitation withdrawn')
          };
        }
        return inv;
      })
    }));
  };

  // 4. Enrollments & Course Assignment Action
  const assignCoursesToLearners = (courseIds, learnerIds) => {
    const newEnrollments = [];
    const newTransactions = [];
    const dateStr = "Just now";

    courseIds.forEach(cId => {
      const course = state.courses.find(c => c.id === cId);
      if (!course) return;

      learnerIds.forEach(lId => {
        const learner = state.learners.find(l => l.id === lId);
        if (!learner) return;

        const enrId = `ENR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        newEnrollments.push({
          id: enrId,
          learnerId: learner.id,
          learnerName: learner.name,
          learnerAvatar: learner.avatar,
          courseId: course.id,
          courseTitle: course.title,
          enrolledDate: dateStr,
          progress: 0,
          status: 'Active',
          lastAccessed: dateStr
        });

        // Add corresponding transaction ledger entry
        newTransactions.push({
          id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          payer: learner.name,
          course: course.title,
          amount: course.price,
          type: "Payment",
          method: "NexusPay Enterprise Billing",
          date: dateStr,
          status: "Completed"
        });
      });
    });

    // Update state: add enrollments, transactions, update course enrolled counts, and update learner counts
    setState(prev => {
      // Update courses with new enrolled counts
      const updatedCourses = prev.courses.map(c => {
        if (courseIds.includes(c.id)) {
          const addedSeats = learnerIds.length;
          return {
            ...c,
            enrolledCount: (c.enrolledCount || 0) + addedSeats,
            revenue: (c.revenue || 0) + (c.price * addedSeats)
          };
        }
        return c;
      });

      // Update learners with new enrolled course count
      const updatedLearners = prev.learners.map(l => {
        if (learnerIds.includes(l.id)) {
          return {
            ...l,
            enrolledCourses: (l.enrolledCourses || 0) + courseIds.length
          };
        }
        return l;
      });

      return {
        ...prev,
        courses: updatedCourses,
        learners: updatedLearners,
        enrollments: [...newEnrollments, ...prev.enrollments],
        transactions: [...newTransactions, ...prev.transactions]
      };
    });

    return { totalAssigned: newEnrollments.length };
  };

  // 5. Reports Actions
  const generateReport = (reportTitle, reportType) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      title: reportTitle,
      type: reportType || 'Analytics Audit',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: '2.4 MB',
      format: 'CSV'
    };

    setState(prev => ({
      ...prev,
      reports: [newReport, ...prev.reports]
    }));

    return newReport;
  };

  // 6. Notifications Actions
  const markNotificationRead = (id) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const markAllNotificationsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  // 7. Settings Actions
  const updateSettings = (newSettings) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  // Reset to default factory state
  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      info: { ...initialData.info },
      instructors: [...initialData.instructors],
      instructorRequests: [...initialData.instructorRequests],
      learners: [...initialData.learners],
      courses: [...initialData.courses],
      enrollments: [...initialData.enrollments],
      transactions: [...initialData.transactions],
      reports: [...initialData.reports],
      notifications: [...initialData.notifications],
      settings: {
        autoApproveEnrollments: true,
        emailAlerts: true,
        royaltyAlerts: true,
        weeklyDigest: false,
        requireTwoFactor: true,
        defaultCurrency: 'USD',
        defaultAccessType: 'Paid Masterclass'
      }
    });
  };

  return (
    <OrgContext.Provider
      value={{
        info: state.info,
        instructors: state.instructors,
        instructorRequests: state.instructorRequests,
        learners: state.learners,
        courses: state.courses,
        enrollments: state.enrollments,
        transactions: state.transactions,
        reports: state.reports,
        notifications: state.notifications,
        settings: state.settings,
        stats,
        // Actions
        updateOrgInfo,
        addCourse,
        updateCourse,
        deleteCourse,
        addInvitation,
        updateInvitationStatus,
        assignCoursesToLearners,
        generateReport,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        resetToDefault
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
}
