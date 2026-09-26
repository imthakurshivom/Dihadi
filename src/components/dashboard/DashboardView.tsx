import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus, HiringStatus } from '../../types';
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  QrCode,
  DollarSign,
  Heart,
  Star,
  ShieldCheck,
  FileBadge,
  Phone,
  ChevronRight,
  Check,
  X,
  Plus,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Laptop,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    userMode,
    setUserMode,
    currentUser,
    jobs,
    workers,
    applications,
    hirings,
    reports,
    savedJobIds,
    savedWorkerIds,
    updateHiringStatus,
    addReview,
    setIsPostJobOpen,
    setIsAuthModalOpen,
    setIsPlayStoreModalOpen,
    isAdminAuthenticated,
    openAdminPortal,
    setIsDedicatedAdminPortal,
    adminSession,
    setReportTarget,
    setSelectedJobForDetail,
    setSelectedWorkerForDetail,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hirings' | 'applications' | 'saved' | 'profile'>('hirings');
  const [selectedHiringForPayment, setSelectedHiringForPayment] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<{ hiringId: string; targetName: string; targetId: string } | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingTag, setRatingTag] = useState('Punctual & Hardworking');
  const [reviewComment, setReviewComment] = useState('');

  // Calculations
  const myPostedJobs = jobs.filter((j) => j.employerId === currentUser.id || j.employerId === 'emp-101');
  const savedJobsList = jobs.filter((j) => savedJobIds.includes(j.id));
  const savedWorkersList = workers.filter((w) => savedWorkerIds.includes(w.id));

  const totalEarnings = hirings
    .filter((h) => h.paymentStatus === 'paid')
    .reduce((sum, h) => sum + h.amount, 12500);

  const handleConfirmCashPayment = (hiringId: string) => {
    updateHiringStatus(hiringId, 'paid', 'cash');
    const hiring = hirings.find((h) => h.id === hiringId);
    if (hiring) {
      setShowRatingModal({
        hiringId,
        targetName: userMode === 'employer' ? hiring.workerName : hiring.employerName,
        targetId: hiring.workerId,
      });
    }
  };

  const handleConfirmUpiPayment = (hiringId: string) => {
    updateHiringStatus(hiringId, 'paid', 'upi');
    setSelectedHiringForPayment(null);
    const hiring = hirings.find((h) => h.id === hiringId);
    if (hiring) {
      setShowRatingModal({
        hiringId,
        targetName: userMode === 'employer' ? hiring.workerName : hiring.employerName,
        targetId: hiring.workerId,
      });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRatingModal) return;

    addReview({
      targetUserId: showRatingModal.targetId,
      targetType: userMode === 'employer' ? 'worker' : 'employer',
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerRole: userMode,
      rating: ratingStars,
      tags: [ratingTag],
      comment: reviewComment || 'Kaam bahut achha aur samay par kiya. Recommended!',
    });

    setShowRatingModal(null);
    setReviewComment('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-100 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg font-extrabold text-stone-900">{currentUser.name}</h2>
                {currentUser.isAadhaarVerified ? (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Aadhaar Verified
                  </span>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 hover:bg-amber-100 transition"
                  >
                    + Aadhaar Verify Karein
                  </button>
                )}
              </div>

              <p className="text-xs text-stone-500 font-medium mt-0.5">
                📞 {currentUser.phone} • 📍 {currentUser.area}, {currentUser.city}
              </p>

              <div className="flex items-center gap-2 mt-1.5 text-xs">
                <span className="font-bold text-amber-600 flex items-center gap-0.5">
                  ⭐ {currentUser.rating} ({currentUser.totalReviews} reviews)
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-500 font-semibold">
                  Mode: <strong className="text-stone-900">{userMode === 'worker' ? '👷 Majdoor / Karigar' : '🏗️ Thekedaar / Malik'}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setUserMode(userMode === 'worker' ? 'employer' : 'worker')}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[11px] font-bold text-stone-700 transition"
          >
            Switch Mode
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-100 text-center">
          <div className="p-2 rounded-xl bg-stone-50">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              {userMode === 'worker' ? 'Total Earnings' : 'Total Hires'}
            </span>
            <span className="text-base font-extrabold text-stone-900">
              {userMode === 'worker' ? `₹${totalEarnings.toLocaleString('en-IN')}` : `${hirings.length} Workers`}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Active Kaam</span>
            <span className="text-base font-extrabold text-orange-600">
              {hirings.filter((h) => h.status !== 'paid').length}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-stone-50">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Completed</span>
            <span className="text-base font-extrabold text-emerald-700">
              {hirings.filter((h) => h.status === 'paid' || h.status === 'completed').length + 8}
            </span>
          </div>
        </div>

        {/* Play Store Release Action Banner */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <div>
              <p className="text-xs font-bold text-stone-900 leading-tight">Google Play Store Ready</p>
              <p className="text-[11px] text-stone-500">Package ID: in.dihadi.app • TWA Compliant</p>
            </div>
          </div>
          <button
            onClick={() => setIsPlayStoreModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-xs hover:bg-orange-700 active:scale-95 transition"
          >
            Post to Play Store →
          </button>
        </div>
      </div>

      {/* Account & Login Options (Google ya Phone) */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs mb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
              🔐
            </div>
            <div>
              <h3 className="text-xs font-black text-stone-900 uppercase tracking-wide">
                Login Options (Google ya Phone)
              </h3>
              <p className="text-[11px] text-stone-500">
                Abhi login hai:{' '}
                <strong className="text-stone-800 font-bold">
                  {currentUser.authProvider === 'google' ? 'Google Account' : 'Phone Number & OTP'}
                </strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs transition cursor-pointer"
          >
            Badlein / Switch
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Google Login Option */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
              currentUser.authProvider === 'google'
                ? 'border-blue-400 bg-blue-50/60 ring-1 ring-blue-400'
                : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <div>
                <p className="text-xs font-bold text-stone-900 leading-snug">Google Account</p>
                <p className="text-[10px] text-stone-500 truncate max-w-[140px]">
                  {currentUser.email || 'shivomchauhan9@gmail.com'}
                </p>
              </div>
            </div>
            {currentUser.authProvider === 'google' ? (
              <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            ) : (
              <span className="text-[10px] text-stone-500 font-semibold">Switch</span>
            )}
          </button>

          {/* Phone Login Option */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
              currentUser.authProvider === 'phone'
                ? 'border-orange-400 bg-orange-50/60 ring-1 ring-orange-400'
                : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Phone className="w-3 h-3" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 leading-snug">Mobile & OTP</p>
                <p className="text-[10px] text-stone-500">{currentUser.phone}</p>
              </div>
            </div>
            {currentUser.authProvider === 'phone' ? (
              <span className="text-[10px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            ) : (
              <span className="text-[10px] text-stone-500 font-semibold">Switch</span>
            )}
          </button>
        </div>
      </div>

      {/* Admin & Dispute Resolution Panel Card (Secured) */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 border border-stone-800 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Official Grievance & Dispute Desk
                </h3>
                {isAdminAuthenticated ? (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    OFFICER LOGGED IN
                  </span>
                ) : (
                  <span className="bg-stone-800 text-orange-400 border border-stone-700 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> RESTRICTED PORTAL
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                {isAdminAuthenticated
                  ? `Officer: ${adminSession?.officerName || 'Shivom Chauhan'} • Vendors aur Workers ke vivad suljhayein.`
                  : 'Kevel authorized Grievance Officers & App Owner ke liye surakshit login portal (Master PIN aavashyak).'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setIsDedicatedAdminPortal(true);
                  window.location.hash = 'admin-portal';
                }}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition flex items-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap"
                title="Open Dedicated Fullscreen App Portal"
              >
                <Laptop className="w-3.5 h-3.5 text-orange-400" />
                <span>Alag App Portal ↗</span>
              </button>
            )}

            <button
              onClick={openAdminPortal}
              className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap ${
                isAdminAuthenticated
                  ? 'bg-orange-600 hover:bg-orange-500 text-white'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white'
              }`}
            >
              {!isAdminAuthenticated && <Lock className="w-3.5 h-3.5" />}
              <span>{isAdminAuthenticated ? 'Open Admin Desk →' : 'Officer Login Portal 🔐'}</span>
              {reports.filter((r) => r.status === 'pending').length > 0 && (
                <span className="bg-white text-orange-700 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {reports.filter((r) => r.status === 'pending').length} Disputes
                </span>
              )}
            </button>
          </div>
        </div>

        {/* User Help & Problem reporting option */}
        <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
            <span>Kisi thekedar ya worker se koi samasya hai?</span>
          </span>
          <button
            onClick={() =>
              setReportTarget({
                id: 'custom-problem',
                title: userMode === 'worker' ? 'Worker Problem / Dispute' : 'Employer / Site Problem',
                type: userMode === 'worker' ? 'employer' : 'worker',
              })
            }
            className="text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer text-xs"
          >
            + Problem Report Karein
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-stone-100 p-1 mb-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('hirings')}
          className={`flex-1 py-2 rounded-xl transition ${
            activeTab === 'hirings' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
          }`}
        >
          Work / Hirings ({hirings.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-2 rounded-xl transition ${
            activeTab === 'applications' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
          }`}
        >
          {userMode === 'worker' ? 'My Applications' : 'Posted Jobs'} ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-2 rounded-xl transition ${
            activeTab === 'saved' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
          }`}
        >
          ❤️ Saved ({savedJobIds.length + savedWorkerIds.length})
        </button>
      </div>

      {/* Tab: Hirings & Work Progress State Machine */}
      {activeTab === 'hirings' && (
        <div className="space-y-3">
          {hirings.map((hiring) => {
            const isCompleted = hiring.status === 'completed' || hiring.status === 'paid';
            const isPaid = hiring.status === 'paid';

            return (
              <div
                key={hiring.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : hiring.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {hiring.status === 'scheduled'
                        ? '📅 Scheduled'
                        : hiring.status === 'in_progress'
                        ? '🔨 Work In Progress'
                        : hiring.status === 'completed'
                        ? '✓ Work Done'
                        : '💰 Paid & Completed'}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1.5 leading-snug">
                      {hiring.jobTitle}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      Worker: <strong className="text-stone-800">{hiring.workerName}</strong> • Date: {hiring.scheduledDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Dihadi</span>
                    <span className="text-base font-extrabold text-stone-900">
                      ₹{hiring.amount}
                    </span>
                  </div>
                </div>

                {/* Status Progression Stepper */}
                <div className="grid grid-cols-4 gap-1 text-center py-2 border-y border-stone-100">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                      ✓
                    </div>
                    <span className="text-[10px] font-semibold text-stone-700 mt-1">Scheduled</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        hiring.status === 'in_progress' || isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {hiring.status === 'in_progress' || isCompleted ? '✓' : '2'}
                    </div>
                    <span className="text-[10px] font-semibold text-stone-700 mt-1">In Progress</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isCompleted ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {isCompleted ? '✓' : '3'}
                    </div>
                    <span className="text-[10px] font-semibold text-stone-700 mt-1">Completed</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isPaid ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {isPaid ? '✓' : '4'}
                    </div>
                    <span className="text-[10px] font-semibold text-stone-700 mt-1">Paid</span>
                  </div>
                </div>

                {/* Interactive Action Controls according to state */}
                <div className="flex flex-wrap gap-2 items-center justify-end">
                  {hiring.status === 'scheduled' && (
                    <button
                      onClick={() => updateHiringStatus(hiring.id, 'in_progress')}
                      className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow hover:bg-amber-700"
                    >
                      Kaam Shuru Hua (Start Work)
                    </button>
                  )}

                  {hiring.status === 'in_progress' && (
                    <button
                      onClick={() => updateHiringStatus(hiring.id, 'completed')}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700"
                    >
                      Kaam Khatam Hua (Mark Complete)
                    </button>
                  )}

                  {hiring.status === 'completed' && !isPaid && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedHiringForPayment(hiring.id)}
                        className="px-3.5 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow flex items-center gap-1.5"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>UPI QR Payment</span>
                      </button>

                      <button
                        onClick={() => handleConfirmCashPayment(hiring.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Cash Payment Given</span>
                      </button>
                    </div>
                  )}

                  {isPaid && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle className="w-4 h-4" /> Payment Complete ({hiring.paymentMethod.toUpperCase()})
                      </span>

                      <button
                        onClick={() =>
                          setShowRatingModal({
                            hiringId: hiring.id,
                            targetName: hiring.workerName,
                            targetId: hiring.workerId,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50"
                      >
                        ⭐ Rate & Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 uppercase">
                    Status: {app.status}
                  </span>
                  <h3 className="font-bold text-base text-stone-900 mt-1.5 leading-snug">
                    {app.jobTitle}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    📍 {app.jobLocation} • Applied: {app.appliedAt}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 font-bold block">Rate</span>
                  <span className="text-sm font-extrabold text-stone-900">
                    ₹{app.workerDailyWage}/day
                  </span>
                </div>
              </div>

              {app.note && (
                <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 font-medium">
                  "{app.note}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Saved Items */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Saved Kaam (Jobs) ({savedJobsList.length})
            </h4>
            {savedJobsList.length === 0 ? (
              <p className="text-xs text-stone-400">Koi saved job nahi hai</p>
            ) : (
              <div className="space-y-2">
                {savedJobsList.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobForDetail(job)}
                    className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between cursor-pointer hover:border-orange-500"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-stone-900">{job.title}</h5>
                      <span className="text-xs text-stone-500">
                        ₹{job.dailyWage}/day • {job.locationArea}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Saved Workers ({savedWorkersList.length})
            </h4>
            {savedWorkersList.length === 0 ? (
              <p className="text-xs text-stone-400">Koi saved worker nahi hai</p>
            ) : (
              <div className="space-y-2">
                {savedWorkersList.map((worker) => (
                  <div
                    key={worker.id}
                    onClick={() => setSelectedWorkerForDetail(worker)}
                    className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between cursor-pointer hover:border-orange-500"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h5 className="font-bold text-sm text-stone-900">{worker.name}</h5>
                        <span className="text-xs text-stone-500">
                          {worker.categoryName} • ₹{worker.dailyWageMin}/day
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPI QR Payment Modal Simulation */}
      {selectedHiringForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                UPI QR Scanner
              </span>
              <button
                onClick={() => setSelectedHiringForPayment(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-base font-bold text-stone-900">Worker ko UPI Se Pay Karein</h3>
            <p className="text-xs text-stone-500 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>

            {/* QR Mockup */}
            <div className="w-48 h-48 mx-auto my-4 bg-stone-100 rounded-2xl p-3 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center">
              <QrCode className="w-32 h-32 text-stone-800" />
              <span className="text-[10px] font-bold text-stone-500 mt-1">Scan & Pay ₹900</span>
            </div>

            <div className="bg-orange-50 p-2.5 rounded-xl text-xs text-orange-900 font-bold mb-4">
              UPI ID: <span className="font-mono text-stone-900">dihadi.worker@okhdfcbank</span>
            </div>

            <button
              onClick={() => handleConfirmUpiPayment(selectedHiringForPayment)}
              className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow hover:bg-emerald-700"
            >
              ✓ Payment Done (Confirm Karein)
            </button>
          </div>
        </div>
      )}

      {/* Mutual Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-stone-900 text-center">
              {showRatingModal.targetName} ko Rating Dein
            </h3>
            <p className="text-xs text-stone-500 text-center mt-0.5">
              Kaam kaisa raha? Aapka review community ke kaam aayega.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4 mt-4">
              {/* Star rating selector */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingStars(star)}
                    className="p-1 text-2xl transition hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= ratingStars ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Quick Tag */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Sabse achhi baat kya thi?
                </label>
                <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                  {[
                    'Punctual (Time par aaya)',
                    'Safai se kaam kiya',
                    'Turant payment di',
                    'Achha vyavahar',
                    'Tajurbe-kaar mistri',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setRatingTag(tag)}
                      className={`px-3 py-1 rounded-full border transition ${
                        ratingTag === tag
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                          : 'bg-stone-50 text-stone-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Kuchh shabd likhein (Review):
                </label>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Kaam bilkul theek kiya..."
                  className="w-full p-2.5 text-xs border rounded-xl"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(null)}
                  className="w-1/3 py-2.5 text-xs font-bold text-stone-600 border rounded-xl"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 text-xs font-bold text-white bg-orange-600 rounded-xl shadow"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
