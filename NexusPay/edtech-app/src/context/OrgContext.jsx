import React, { createContext, useContext, useState, useEffect } from 'react';
import { orgData as initialData } from '../data/orgData';

const OrgContext = createContext();

const STORAGE_KEY = 'nexuspay_college_state_v2';

export function OrgProvider({ children }) {
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
      instructorRequests: [
        {
          id: "req-101",
          instructorId: "inst-2",
          name: "Dr. Sarah Mitchell",
          email: "s.mitchell@stanford.edu",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
          specialization: "Machine Learning & FinTech AI",
          courseTitle: "Transformers in Quantitative Finance & Fraud Detection",
          semester: "Fall 2026",
          creditHours: "4 Academic Credits",
          sentDate: "August 20, 2026",
          status: "Pending Professor Response",
          outreachMethod: "Sent request by mail",
          mailSubject: "College Teaching Assignment: Transformers in Quantitative Finance",
          description: "College administration sent formal course teaching request by mail to Dr. Sarah Mitchell to instruct 'Transformers in Quantitative Finance' for Fall 2026.",
          bio: "Lead AI Researcher and PhD from MIT. Leads fintech fraud detection AI algorithms and predictive market analytics.",
          sampleSyllabus: "12-week intensive masterclass on Transformers in Quantitative Finance",
          proposedTerms: "Academic Honorarium + 70/30 faculty course royalty",
          trackingStatus: "Awaiting professor decision • Dispatched to s.mitchell@stanford.edu",
          adminNotes: "Dispatched by Dean of Computer Science. Awaiting professor acceptance."
        },
        {
          id: "req-102",
          instructorId: "inst-1",
          name: "Prof. James Wilson",
          email: "j.wilson@nexuspay.edu",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
          specialization: "Cloud Architecture & AWS",
          courseTitle: "AWS Solutions Architect & High-Throughput Settlement Engines",
          semester: "Fall 2026",
          creditHours: "4 Academic Credits",
          sentDate: "August 22, 2026",
          status: "Pending Professor Response",
          outreachMethod: "Sent request by mail",
          mailSubject: "College Teaching Assignment: AWS Solutions Architect Masterclass",
          description: "College administration sent formal course teaching request by mail to Prof. James Wilson to instruct 'AWS Solutions Architect' for Fall 2026.",
          bio: "Former Principal Cloud Architect at AWS with 14+ years designing high-throughput transaction engines.",
          sampleSyllabus: "Enterprise AWS cloud architecture with active-active multi-region failover",
          proposedTerms: "Standard departmental faculty appointment",
          trackingStatus: "Awaiting professor decision • Dispatched to j.wilson@nexuspay.edu",
          adminNotes: "Teaching syllabus approved by College Academic Council."
        },
        {
          id: "req-103",
          instructorId: "inst-3",
          name: "Marcus Vance",
          email: "m.vance@nexuspay.edu",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
          specialization: "Cybersecurity & PCI-DSS",
          courseTitle: "Post-Quantum Cryptography & Banking Ledger Defense",
          semester: "Fall 2026",
          creditHours: "3 Academic Credits",
          sentDate: "August 24, 2026",
          status: "Pending Professor Response",
          outreachMethod: "Sent request by mail",
          mailSubject: "College Teaching Assignment: Post-Quantum Cryptography & Banking Defense",
          description: "College administration sent formal course teaching request by mail to Marcus Vance to instruct 'Post-Quantum Cryptography' for Fall 2026.",
          bio: "CISSP certified security executive overseeing institutional banking security and cryptographic key management.",
          sampleSyllabus: "Zero-trust banking security, hardware security modules, and PCI-DSS 4.0",
          proposedTerms: "Departmental research stipend + lab grant",
          trackingStatus: "Awaiting professor decision • Dispatched to m.vance@nexuspay.edu",
          adminNotes: "Sent by Academic Committee on Aug 24, 2026."
        },
        {
          id: "req-104",
          instructorId: "inst-4",
          name: "Elena Rostova",
          email: "e.rostova@nexuspay.edu",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
          specialization: "DevOps & CI/CD Pipelines",
          courseTitle: "Zero-Downtime Microservices & Kubernetes Payments Cluster",
          semester: "Fall 2026",
          creditHours: "4 Academic Credits",
          sentDate: "August 10, 2026",
          status: "Accepted by Professor",
          outreachMethod: "Sent request by mail",
          mailSubject: "College Teaching Assignment: Zero-Downtime Microservices",
          description: "College sent course teaching request by mail on Aug 10. Elena Rostova accepted the teaching assignment. College received notification and course is assigned.",
          bio: "DevOps lead with 10 years experience automating resilient payment gateways and zero-downtime microservice clusters.",
          sampleSyllabus: "Automated GitOps, ArgoCD pipelines, and high-availability Kubernetes",
          proposedTerms: "Accepted 70/30 faculty agreement",
          trackingStatus: "Accepted by Professor • Official Notification Sent to College",
          adminNotes: "Elena accepted on Aug 14; College notified and class scheduled."
        },
        {
          id: "req-105",
          instructorId: "inst-5",
          name: "David Kalu",
          email: "d.kalu@nexuspay.edu",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
          specialization: "Blockchain & Smart Contracts",
          courseTitle: "Programmable Settlement Smart Contracts & DeFi Rails",
          semester: "Fall 2026",
          creditHours: "3 Academic Credits",
          sentDate: "July 28, 2026",
          status: "Declined by Professor",
          outreachMethod: "Sent request by mail",
          mailSubject: "College Teaching Assignment: Programmable Settlement Smart Contracts",
          description: "College sent course teaching request by mail. David Kalu declined due to academic research leave / sabbatical.",
          bio: "Pioneer in decentralized payment protocols, liquidity pools, and programmable settlement smart contracts.",
          sampleSyllabus: "Solidity settlement contracts and multi-sig asset custody",
          proposedTerms: "Standard faculty honorarium",
          trackingStatus: "Declined by Professor (Sabbatical leave)",
          adminNotes: "Declined politely citing ongoing fellowship abroad."
        }
      ],
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

  // Save to localStorage
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
    pendingRequests: state.instructorRequests.filter(r => r.status === 'Pending Professor Response' || r.status === 'Invite Sent' || r.status === 'Pending').length,
    unreadNotifications: state.notifications.filter(n => !n.read).length,
    annualRevenue: state.courses.reduce((sum, c) => sum + (c.revenue || (c.price * (c.enrolledCount || 10))), 0),
    monthlyRevenue: Math.round(state.courses.reduce((sum, c) => sum + (c.revenue || (c.price * (c.enrolledCount || 10))), 0) * 0.3)
  };

  // --- ACTIONS ---

  // 1. Organization Profile
  const updateOrgInfo = (newInfo) => {
    setState(prev => ({ ...prev, info: { ...prev.info, ...newInfo } }));
  };

  // 2. Course Management
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
      description: courseData.description || 'Newly authored curriculum track on enterprise architecture.',
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

  // 3. College Course Teaching Requests (Sent by College to Existing Instructors)
  const sendCourseTeachingRequest = ({ instructorId, courseTitle, semester, creditHours, proposedTerms, message }) => {
    const instructor = state.instructors.find(i => i.id === instructorId) || state.instructors[0];
    const newId = `req-${Date.now()}`;
    const dateStr = "Just now";

    const newRequest = {
      id: newId,
      instructorId: instructor.id,
      name: instructor.name,
      email: instructor.email,
      avatar: instructor.avatar,
      specialization: instructor.specialization,
      courseTitle: courseTitle || "Advanced Distributed Systems",
      semester: semester || "Fall 2026",
      creditHours: creditHours || "4 Credits",
      sentDate: dateStr,
      status: "Pending Professor Response",
      outreachMethod: "Sent request by mail",
      mailSubject: `College Teaching Request: ${courseTitle} (${semester || "Fall 2026"})`,
      description: `College administration sent formal course teaching request by mail to ${instructor.name} to teach '${courseTitle}' for ${semester || "Fall 2026"}.`,
      bio: instructor.bio,
      sampleSyllabus: `Curriculum and lab syllabus for ${courseTitle}`,
      proposedTerms: proposedTerms || "Departmental faculty honorarium + course royalties",
      trackingStatus: `Awaiting professor decision • Dispatched to ${instructor.email}`,
      adminNotes: "Dispatched by Academic Dean via college mail server."
    };

    setState(prev => ({
      ...prev,
      instructorRequests: [newRequest, ...prev.instructorRequests]
    }));

    return newRequest;
  };

  // Instructor responds: Accept or Decline. If accepted, NOTIFY COLLEGE!
  const respondToTeachingRequest = (requestId, decision) => {
    let instructorName = "Faculty Member";
    let courseName = "Assigned Course";
    let semesterName = "upcoming semester";

    setState(prev => {
      const updatedRequests = prev.instructorRequests.map(req => {
        if (req.id === requestId) {
          instructorName = req.name;
          courseName = req.courseTitle || req.sampleSyllabus;
          semesterName = req.semester || "Fall 2026";
          const newStatus = decision === 'Accepted' ? 'Accepted by Professor' : 'Declined by Professor';
          const tracking = decision === 'Accepted'
            ? 'Accepted by Professor • Official Notification Sent to College'
            : 'Declined by Professor (Sabbatical/Schedule conflict)';
          return {
            ...req,
            status: newStatus,
            trackingStatus: tracking
          };
        }
        return req;
      });

      // Create official notification sent to college
      const newNotification = {
        id: `notif-${Date.now()}`,
        title: decision === 'Accepted'
          ? `Professor ${instructorName} Accepted Course Assignment`
          : `Teaching Request Declined: ${instructorName}`,
        desc: decision === 'Accepted'
          ? `Great news! ${instructorName} has accepted the college request to teach "${courseName}" for ${semesterName}. The course is now officially scheduled.`
          : `${instructorName} declined the college teaching request for "${courseName}" due to semester scheduling constraints.`,
        time: 'Just now',
        read: false
      };

      // If accepted, update the course in catalog to assign this instructor!
      let updatedCourses = prev.courses;
      if (decision === 'Accepted') {
        updatedCourses = prev.courses.map(c => {
          if (c.title.toLowerCase() === courseName.toLowerCase()) {
            return { ...c, instructorName: instructorName };
          }
          return c;
        });
      }

      return {
        ...prev,
        instructorRequests: updatedRequests,
        courses: updatedCourses,
        notifications: [newNotification, ...prev.notifications]
      };
    });

    return { instructorName, courseName, decision };
  };

  // 4. Enrollments & Course Assignment
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

    setState(prev => {
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

  // 5. Reports
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

  // 6. Notifications
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

  // 7. Settings
  const updateSettings = (newSettings) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  // Reset
  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
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
        sendCourseTeachingRequest,
        respondToTeachingRequest,
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
