import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserMode,
  LanguageCode,
  User,
  WorkerProfile,
  Job,
  Application,
  Hiring,
  Conversation,
  Message,
  Review,
  NotificationItem,
  ReportItem,
  DistanceFilter,
  HiringStatus,
} from '../types';
import { translations } from '../i18n/translations';
import {
  CITIES_DATA,
  CATEGORIES_DATA,
  INITIAL_WORKERS,
  INITIAL_JOBS,
  INITIAL_REVIEWS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  // Mode & Language
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof translations.hi;

  // Location & Filters
  currentCity: string;
  currentArea: string;
  distanceFilter: DistanceFilter;
  setDistanceFilter: (dist: DistanceFilter) => void;
  setLocation: (city: string, area: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;

  // Auth & Profile
  isAuthenticated: boolean;
  currentUser: User;
  loginWithOtp: (phone: string, otp: string, name?: string, role?: UserMode) => boolean;
  logout: () => void;
  verifyAadhaar: (aadhaarNumber: string) => boolean;

  // Data Collections
  jobs: Job[];
  workers: WorkerProfile[];
  applications: Application[];
  hirings: Hiring[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  reviews: Review[];
  notifications: NotificationItem[];
  reports: ReportItem[];
  savedJobIds: string[];
  savedWorkerIds: string[];

  // User Actions
  toggleSaveJob: (id: string) => void;
  toggleSaveWorker: (id: string) => void;
  applyForJob: (jobId: string, note?: string, wageExpectation?: number) => { success: boolean; message: string };
  postJob: (job: Omit<Job, 'id' | 'createdAt' | 'status' | 'workersHiredCount'>) => Job;
  createWorkerProfile: (profile: Partial<WorkerProfile>) => void;
  hireWorker: (workerId: string, jobId?: string, wage?: number, date?: string) => Hiring;
  updateHiringStatus: (hiringId: string, status: HiringStatus, paymentMethod?: 'cash' | 'upi', amount?: number) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  sendMessage: (conversationId: string, text: string) => void;
  startOrGetConversation: (workerId: string, employerId: string, jobId?: string) => string;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  submitReport: (targetId: string, targetTitle: string, targetType: 'job' | 'worker' | 'employer', reason: string, details: string) => void;

  // Admin Actions
  verifyUserAdmin: (userId: string) => void;
  removeJobAdmin: (jobId: string) => void;
  resolveReportAdmin: (reportId: string) => void;

  // UI Modals
  isPostJobOpen: boolean;
  setIsPostJobOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isPlayStoreModalOpen: boolean;
  setIsPlayStoreModalOpen: (open: boolean) => void;
  selectedJobForDetail: Job | null;
  setSelectedJobForDetail: (job: Job | null) => void;
  selectedWorkerForDetail: WorkerProfile | null;
  setSelectedWorkerForDetail: (worker: WorkerProfile | null) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  activeTab: 'home' | 'search' | 'post' | 'chat' | 'dashboard';
  setActiveTab: (tab: 'home' | 'search' | 'post' | 'chat' | 'dashboard') => void;
  reportTarget: { id: string; title: string; type: 'job' | 'worker' | 'employer' } | null;
  setReportTarget: (target: { id: string; title: string; type: 'job' | 'worker' | 'employer' } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dihadi_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial preferences
  const [userMode, setUserMode] = useState<UserMode>('worker');
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [currentCity, setCurrentCity] = useState<string>('Sonipat');
  const [currentArea, setCurrentArea] = useState<string>('Sector 14');
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u-user-current',
    name: 'Suresh Kumar',
    phone: '+91 98125 12345',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
    city: 'Sonipat',
    state: 'Haryana',
    area: 'Sector 14',
    pincode: '131001',
    isPhoneVerified: true,
    isAadhaarVerified: false,
    rating: 4.8,
    totalReviews: 24,
    createdAt: '2026-01-10',
  });

  // Data Collections
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [workers, setWorkers] = useState<WorkerProfile[]>(INITIAL_WORKERS);
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'app-init-1',
      jobId: 'job-1',
      jobTitle: '2 Mason (Rajmistri) Chahiye Boundary Wall ke liye',
      jobCategory: 'Mason / Mistri',
      jobLocation: 'Sector 14, Sonipat',
      workerId: 'worker-1',
      workerName: 'Ramesh Kumar',
      workerSkill: 'Brick Work & Plaster',
      workerPhone: '+91 98124 55891',
      workerDailyWage: 900,
      workerRating: 4.8,
      workerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      employerId: 'emp-101',
      status: 'shortlisted',
      appliedAt: '2 ghante pehle',
      wageExpectation: 900,
      note: 'Mere paas pura tools set hai aur kal 8:30 baje reach kar sakta hoon.',
    },
  ]);

  const [hirings, setHirings] = useState<Hiring[]>([
    {
      id: 'hire-1',
      jobId: 'job-1',
      jobTitle: '2 Mason Chahiye Boundary Wall ke liye',
      workerId: 'worker-1',
      workerName: 'Ramesh Kumar',
      workerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      workerPhone: '+91 98124 55891',
      employerId: 'emp-101',
      employerName: 'Gupta Contractor',
      wagePerDay: 900,
      scheduledDate: 'Kal Subah (Tomorrow)',
      duration: '5 Days',
      status: 'scheduled',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      amount: 4500,
      createdAt: 'Aaj Subah',
    },
  ]);

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'conv-1': [
      {
        id: 'm-1',
        conversationId: 'conv-1',
        senderId: 'emp-101',
        senderName: 'Gupta Contractor',
        senderRole: 'employer',
        text: 'Namaste Ramesh ji. Kal subah boundary wall ke liye 2 mason chahiye, 8:30 baje aa sakte ho?',
        timestamp: '10:30 AM',
        isRead: true,
      },
      {
        id: 'm-2',
        conversationId: 'conv-1',
        senderId: 'worker-1',
        senderName: 'Ramesh Kumar',
        senderRole: 'worker',
        text: 'Haan theek hai Gupta ji, kal subah 8:30 baje Sector 14 chowk par milte hain.',
        timestamp: '10:45 AM',
        isRead: true,
      },
    ],
    'conv-2': [
      {
        id: 'm-3',
        conversationId: 'conv-2',
        senderId: 'emp-103',
        senderName: 'Aggarwal Timber',
        senderRole: 'employer',
        text: 'Wardrobe laminate pasting aur modular fittings ka kaam hai. Tools aapke paas hain?',
        timestamp: 'Yesterday',
        isRead: true,
      },
      {
        id: 'm-4',
        conversationId: 'conv-2',
        senderId: 'worker-4',
        senderName: 'Joginder Singh',
        senderRole: 'worker',
        text: 'Aap rate confirm kar dijiye ₹1,000/day, main kal hi start kar sakta hoon.',
        timestamp: 'Yesterday',
        isRead: true,
      },
    ],
  });

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job-1', 'job-3']);
  const [savedWorkerIds, setSavedWorkerIds] = useState<string[]>(['worker-1', 'worker-3']);

  // Modals & Navigation
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedWorkerForDetail, setSelectedWorkerForDetail] = useState<WorkerProfile | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'post' | 'chat' | 'dashboard'>('home');
  const [reportTarget, setReportTarget] = useState<{ id: string; title: string; type: 'job' | 'worker' | 'employer' } | null>(null);

  // Sync mode with user profile
  const handleSetUserMode = (mode: UserMode) => {
    setUserMode(mode);
    setCurrentUser((prev) => ({ ...prev, role: mode }));
  };

  // Translations
  const t = translations[language] || translations.hi;

  // Location handler
  const setLocation = (city: string, area: string) => {
    setCurrentCity(city);
    setCurrentArea(area);
  };

  // Toggle Saves
  const toggleSaveJob = (id: string) => {
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSaveWorker = (id: string) => {
    setSavedWorkerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Apply for Job
  const applyForJob = (jobId: string, note?: string, wageExpectation?: number) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Kaam nahi mila.' };

    const alreadyApplied = applications.some((a) => a.jobId === jobId && a.workerId === currentUser.id);
    if (alreadyApplied) {
      return { success: false, message: 'Aap is kaam ke liye pehle hi apply kar chuke hain!' };
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      jobCategory: job.categoryName,
      jobLocation: `${job.locationArea}, ${job.locationCity}`,
      workerId: currentUser.id,
      workerName: currentUser.name,
      workerSkill: 'Skilled Craftsman',
      workerPhone: currentUser.phone,
      workerDailyWage: wageExpectation || job.dailyWage,
      workerRating: currentUser.rating,
      workerAvatar: currentUser.avatar,
      employerId: job.employerId,
      status: 'applied',
      appliedAt: 'Abhi (Just now)',
      wageExpectation: wageExpectation || job.dailyWage,
      note: note || 'Main ye kaam poori imaandari aur samay par karunga.',
    };

    setApplications((prev) => [newApp, ...prev]);

    // Add alert notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Aavedan (Application) Bheja Gaya',
      message: `Aapne "${job.title}" ke liye safaltapoorvak apply kar diya hai. Employer se jald call ya chat aayegi.`,
      type: 'application',
      read: false,
      timestamp: 'Just now',
      relatedId: job.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return { success: true, message: 'Badhai! Aapka application contractor ke paas pahunch gaya hai.' };
  };

  // Post a Job
  const postJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'status' | 'workersHiredCount'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: 'Just now',
      status: 'open',
      workersHiredCount: 0,
      isFeatured: false,
    };

    setJobs((prev) => [newJob, ...prev]);

    // Send notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Naya Kaam Live Ho Gaya!',
      message: `"${newJob.title}" ab aapke area ke workers ko dikh raha hai.`,
      type: 'job_alert',
      read: false,
      timestamp: 'Just now',
      relatedId: newJob.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newJob;
  };

  // Create Worker Profile
  const createWorkerProfile = (profile: Partial<WorkerProfile>) => {
    const newWorker: WorkerProfile = {
      id: `worker-${Date.now()}`,
      userId: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      phone: currentUser.phone,
      age: profile.age || 30,
      gender: profile.gender || 'male',
      city: currentCity,
      state: 'Haryana',
      area: currentArea,
      pincode: '131001',
      categoryId: profile.categoryId || 'cat-mason',
      categoryName: profile.categoryName || 'Mason / Mistri',
      skills: profile.skills || ['General Construction'],
      experienceYears: profile.experienceYears || 5,
      dailyWageMin: profile.dailyWageMin || 700,
      dailyWageMax: profile.dailyWageMax || 900,
      availability: 'today',
      preferredDistanceKm: 15,
      languages: ['Hindi'],
      about: profile.about || 'Mehanti aur imaandar karigar.',
      previousWork: profile.previousWork || 'Local area me 5 saal ka anubhav.',
      completedJobsCount: 0,
      rating: 5.0,
      totalReviews: 1,
      isVerified: true,
      distanceKm: 0.8,
    };

    setWorkers((prev) => [newWorker, ...prev]);
  };

  // Hire a Worker
  const hireWorker = (workerId: string, jobId?: string, wage?: number, date?: string): Hiring => {
    const targetWorker = workers.find((w) => w.id === workerId) || workers[0];
    const relatedJob = jobId ? jobs.find((j) => j.id === jobId) : undefined;

    const newHiring: Hiring = {
      id: `hire-${Date.now()}`,
      jobId: relatedJob?.id || 'direct-hire',
      jobTitle: relatedJob?.title || `${targetWorker.categoryName} Work Request`,
      workerId: targetWorker.id,
      workerName: targetWorker.name,
      workerAvatar: targetWorker.avatar,
      workerPhone: targetWorker.phone,
      employerId: currentUser.id,
      employerName: currentUser.name,
      wagePerDay: wage || targetWorker.dailyWageMin,
      scheduledDate: date || 'Kal Subah 8:30 AM',
      duration: '1-3 Days',
      status: 'scheduled',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      amount: wage || targetWorker.dailyWageMin,
      createdAt: 'Just now',
    };

    setHirings((prev) => [newHiring, ...prev]);

    // Send notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Worker Hire Ho Gaya!',
      message: `${targetWorker.name} ko kaam schedule kar diya gaya hai. Unka number & chat ab active hai.`,
      type: 'hire',
      read: false,
      timestamp: 'Just now',
      relatedId: newHiring.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newHiring;
  };

  // Update Hiring Status & Payments
  const updateHiringStatus = (
    hiringId: string,
    status: HiringStatus,
    paymentMethod?: 'cash' | 'upi',
    amount?: number
  ) => {
    setHirings((prev) =>
      prev.map((h) => {
        if (h.id !== hiringId) return h;
        return {
          ...h,
          status,
          paymentMethod: paymentMethod || h.paymentMethod,
          paymentStatus: status === 'paid' ? 'paid' : h.paymentStatus,
          amount: amount || h.amount,
          completedAt: status === 'completed' || status === 'paid' ? 'Aaj' : h.completedAt,
        };
      })
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: status === 'paid' ? 'Payment Confirm Ho Gaya!' : `Kaam Status: ${status}`,
      message:
        status === 'paid'
          ? `₹${amount || 900} ka bhugtaan safal raha. Kripya apna review aur rating dein.`
          : `Kaam ka status update ho gaya hai.`,
      type: status === 'paid' ? 'payment' : 'hire',
      read: false,
      timestamp: 'Just now',
      relatedId: hiringId,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Add Review
  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Abhi',
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update target rating
    if (review.targetType === 'worker') {
      setWorkers((prev) =>
        prev.map((w) => {
          if (w.id === review.targetUserId) {
            const newTotal = w.totalReviews + 1;
            const newAvg = Number(((w.rating * w.totalReviews + review.rating) / newTotal).toFixed(1));
            return { ...w, rating: newAvg, totalReviews: newTotal };
          }
          return w;
        })
      );
    }
  };

  // Start or get conversation
  const startOrGetConversation = (workerId: string, employerId: string, jobId?: string): string => {
    const existing = conversations.find(
      (c) =>
        (c.participantWorkerId === workerId && c.participantEmployerId === employerId) ||
        (c.jobId && c.jobId === jobId)
    );

    if (existing) {
      return existing.id;
    }

    const worker = workers.find((w) => w.id === workerId);
    const job = jobId ? jobs.find((j) => j.id === jobId) : undefined;
    const newConvId = `conv-${Date.now()}`;

    const newConv: Conversation = {
      id: newConvId,
      participantWorkerId: workerId,
      participantWorkerName: worker?.name || 'Worker',
      participantWorkerAvatar: worker?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      participantWorkerPhone: worker?.phone || '+91 98124 55891',
      participantEmployerId: employerId,
      participantEmployerName: currentUser.name,
      participantEmployerAvatar: currentUser.avatar,
      participantEmployerPhone: currentUser.phone,
      jobId: job?.id,
      jobTitle: job?.title,
      lastMessage: 'Chat shuru hui',
      lastMessageTime: 'Just now',
      unreadCount: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newConvId]: [
        {
          id: `msg-${Date.now()}`,
          conversationId: newConvId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: userMode,
          text: `Namaste! ${job?.title ? `Maine "${job.title}" ke baare me baat karni hai.` : 'Kaam ke baare me baat karni hai.'}`,
          timestamp: 'Just now',
          isRead: true,
        },
      ],
    }));

    return newConvId;
  };

  // Send message
  const sendMessage = (conversationId: string, text: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: userMode,
      text,
      timestamp: 'Just now',
      isRead: true,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          lastMessage: text,
          lastMessageTime: 'Just now',
        };
      })
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Reports
  const submitReport = (
    targetId: string,
    targetTitle: string,
    targetType: 'job' | 'worker' | 'employer',
    reason: string,
    details: string
  ) => {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      reportedTargetId: targetId,
      targetTitle,
      targetType,
      reason,
      details,
      status: 'pending',
      timestamp: 'Abhi',
    };
    setReports((prev) => [newReport, ...prev]);
  };

  // Admin moderation
  const verifyUserAdmin = (userId: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.userId === userId || w.id === userId ? { ...w, isVerified: true } : w))
    );
  };

  const removeJobAdmin = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const resolveReportAdmin = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
  };

  // Auth functions
  const loginWithOtp = (phone: string, otp: string, name?: string, role?: UserMode) => {
    if (otp.length >= 4) {
      setIsAuthenticated(true);
      setCurrentUser((prev) => ({
        ...prev,
        phone,
        name: name || prev.name,
        role: role || prev.role,
        isPhoneVerified: true,
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const verifyAadhaar = (aadhaarNumber: string) => {
    if (aadhaarNumber.length === 12 || aadhaarNumber.length === 14) {
      setCurrentUser((prev) => ({
        ...prev,
        isAadhaarVerified: true,
      }));
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        userMode,
        setUserMode: handleSetUserMode,
        language,
        setLanguage,
        t,
        currentCity,
        currentArea,
        distanceFilter,
        setDistanceFilter,
        setLocation,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isAuthenticated,
        currentUser,
        loginWithOtp,
        logout,
        verifyAadhaar,
        jobs,
        workers,
        applications,
        hirings,
        conversations,
        messages,
        reviews,
        notifications,
        reports,
        savedJobIds,
        savedWorkerIds,
        toggleSaveJob,
        toggleSaveWorker,
        applyForJob,
        postJob,
        createWorkerProfile,
        hireWorker,
        updateHiringStatus,
        addReview,
        sendMessage,
        startOrGetConversation,
        markNotificationRead,
        markAllNotificationsRead,
        submitReport,
        verifyUserAdmin,
        removeJobAdmin,
        resolveReportAdmin,
        isPostJobOpen,
        setIsPostJobOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminOpen,
        setIsAdminOpen,
        isPlayStoreModalOpen,
        setIsPlayStoreModalOpen,
        selectedJobForDetail,
        setSelectedJobForDetail,
        selectedWorkerForDetail,
        setSelectedWorkerForDetail,
        activeConversationId,
        setActiveConversationId,
        activeTab,
        setActiveTab,
        reportTarget,
        setReportTarget,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
