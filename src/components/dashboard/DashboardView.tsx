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
    savedJobIds,
    savedWorkerIds,
    updateHiringStatus,
    addReview,
    setIsPostJobOpen,
    setIsAuthModalOpen,
    setIsPlayStoreModalOpen,
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
