export type UserMode = 'worker' | 'employer';

export type LanguageCode = 'hi' | 'hinglish' | 'en';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserMode;
  avatar: string;
  city: string;
  state: string;
  area: string;
  pincode: string;
  isPhoneVerified: boolean;
  isAadhaarVerified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  city: string;
  state: string;
  area: string;
  pincode: string;
  categoryId: string;
  categoryName: string;
  skills: string[];
  experienceYears: number;
  dailyWageMin: number;
  dailyWageMax: number;
  availability: 'today' | 'tomorrow' | 'busy';
  preferredDistanceKm: number;
  languages: string[];
  about: string;
  previousWork: string;
  completedJobsCount: number;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  distanceKm: number;
  isFeatured?: boolean;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  name: string;
  companyOrContractorName: string;
  avatar: string;
  phone: string;
  city: string;
  state: string;
  area: string;
  pincode: string;
  rating: number;
  totalJobsPosted: number;
  isVerified: boolean;
}

export type JobType = 'daily_wage' | 'temporary' | 'contract' | 'full_time' | 'part_time';

export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  employerPhone: string;
  employerRating: number;
  isEmployerVerified: boolean;
  title: string;
  categoryId: string;
  categoryName: string;
  workersRequired: number;
  workersHiredCount: number;
  skills: string[];
  locationCity: string;
  locationArea: string;
  locationPincode: string;
  distanceKm: number;
  date: string;
  startTime: string;
  expectedDuration: string;
  dailyWage: number;
  totalPayment?: number;
  foodProvided: boolean;
  accommodationProvided: boolean;
  description: string;
  contactPreference: 'call' | 'chat' | 'both';
  jobType: JobType;
  status: JobStatus;
  createdAt: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
}

export type ApplicationStatus =
  | 'applied'
  | 'shortlisted'
  | 'accepted'
  | 'rejected'
  | 'hired'
  | 'work_started'
  | 'work_completed';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  jobCategory: string;
  jobLocation: string;
  workerId: string;
  workerName: string;
  workerSkill: string;
  workerPhone: string;
  workerDailyWage: number;
  workerRating: number;
  workerAvatar: string;
  employerId: string;
  status: ApplicationStatus;
  appliedAt: string;
  wageExpectation?: number;
  note?: string;
}

export type HiringStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'payment_pending'
  | 'paid';

export interface Hiring {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  workerAvatar: string;
  workerPhone: string;
  employerId: string;
  employerName: string;
  wagePerDay: number;
  scheduledDate: string;
  duration: string;
  status: HiringStatus;
  paymentMethod: 'cash' | 'upi' | 'pending';
  paymentStatus: 'pending' | 'paid' | 'disputed';
  amount: number;
  createdAt: string;
  completedAt?: string;
  workerRated?: boolean;
  employerRated?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserMode;
  text: string;
  timestamp: string;
  quickReply?: boolean;
  jobId?: string;
  jobTitle?: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantWorkerId: string;
  participantWorkerName: string;
  participantWorkerAvatar: string;
  participantWorkerPhone: string;
  participantEmployerId: string;
  participantEmployerName: string;
  participantEmployerAvatar: string;
  participantEmployerPhone: string;
  jobId?: string;
  jobTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Review {
  id: string;
  targetUserId: string;
  targetType: 'worker' | 'employer';
  reviewerId: string;
  reviewerName: string;
  reviewerRole: UserMode;
  rating: number;
  tags: string[];
  comment: string;
  date: string;
  jobTitle?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job_alert' | 'application' | 'hire' | 'message' | 'payment' | 'rating' | 'system';
  read: boolean;
  timestamp: string;
  relatedId?: string;
}

export interface PaymentRecord {
  id: string;
  hiringId: string;
  jobTitle: string;
  workerName: string;
  employerName: string;
  amount: number;
  method: 'cash' | 'upi' | 'online';
  status: 'pending' | 'paid' | 'disputed' | 'cancelled';
  transactionRef?: string;
  date: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reportedTargetId: string;
  targetTitle: string;
  targetType: 'job' | 'worker' | 'employer';
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  hindiName: string;
  hinglishName: string;
  icon: string;
  description: string;
  avgWage: string;
  commonSkills: string[];
}

export interface LocationArea {
  city: string;
  state: string;
  areas: string[];
  pincode: string;
}

export type DistanceFilter = 1 | 5 | 10 | 25 | 999; // 999 = whole city
