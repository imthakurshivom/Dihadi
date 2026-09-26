import React, { useState } from 'react';
import { WorkerProfile } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  CheckCircle,
  Phone,
  MessageSquare,
  Heart,
  Star,
  Briefcase,
  X,
  Share2,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  Award,
  Lock,
} from 'lucide-react';

interface Props {
  worker: WorkerProfile;
  onClose: () => void;
}

export const WorkerDetailModal: React.FC<Props> = ({ worker, onClose }) => {
  const {
    savedWorkerIds,
    toggleSaveWorker,
    hireWorker,
    startOrGetConversation,
    setActiveConversationId,
    setActiveTab,
    reviews,
    setReportTarget,
    setIsEscrowBookingModalOpen,
    setSelectedWorkerForEscrow,
  } = useApp();

  const [showHireBox, setShowHireBox] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('Kal Subah (Tomorrow 8:30 AM)');
  const [agreedWage, setAgreedWage] = useState(worker.dailyWageMin.toString());
  const [hireSuccess, setHireSuccess] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState(false);

  const isSaved = savedWorkerIds.includes(worker.id);

  // Relevant reviews for this worker
  const workerReviews = reviews.filter((r) => r.targetUserId === worker.id || r.targetType === 'worker');

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hireWorker(worker.id, undefined, Number(agreedWage) || worker.dailyWageMin, scheduledDate);
    setHireSuccess(true);
    setTimeout(() => {
      setHireSuccess(false);
      setShowHireBox(false);
      setActiveTab('dashboard');
      onClose();
    }, 1500);
  };

  const handleStartChat = () => {
    const convId = startOrGetConversation(worker.id, 'u-user-current');
    setActiveConversationId(convId);
    setActiveTab('chat');
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Dihadi Worker: ${worker.name} (${worker.categoryName})`,
        text: `${worker.name}, ${worker.categoryName} with ${worker.experienceYears} yrs experience in ${worker.area}, ${worker.city}. Hire on Dihadi!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Dihadi Worker: ${worker.name}, ${worker.categoryName} - Rate: ₹${worker.dailyWageMin}/day`
      );
      alert('Worker profile link copy ho gaya hai!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-stone-100 flex items-center justify-between z-10">
          <span className="text-xs font-bold text-stone-500">Worker Profile</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveWorker(worker.id)}
              className="p-2 rounded-full text-stone-400 hover:text-red-500 hover:bg-stone-50 transition"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-50"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Top Profile Card */}
          <div className="flex items-start gap-4">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-stone-200 shadow-md flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xl font-extrabold text-stone-900">{worker.name}</h1>
                {worker.isVerified && (
                  <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Karigar
                  </span>
                )}
              </div>

              <div className="text-sm font-bold text-orange-700 mt-0.5">
                {worker.categoryName} • {worker.experienceYears} Saal Tajurba
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {worker.area}, {worker.city} ({worker.distanceKm} km door)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Dihadi Rate</span>
              <div className="text-base font-extrabold text-stone-900">
                ₹{worker.dailyWageMin}–{worker.dailyWageMax}
              </div>
              <span className="text-[10px] text-stone-500 font-medium">per day</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Rating</span>
              <div className="text-base font-extrabold text-amber-600 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{worker.rating}</span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium">
                {worker.totalReviews} Reviews
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Kaam Poore</span>
              <div className="text-base font-extrabold text-emerald-700">
                {worker.completedJobsCount}+
              </div>
              <span className="text-[10px] text-stone-500 font-medium">Jobs Done</span>
            </div>
          </div>

          {/* Availability Status */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-emerald-900">
                {worker.availability === 'today'
                  ? 'Aaj Kaam Ke Liye Uplabdh Hai (Available Today)'
                  : 'Kal Se Kaam Ke Liye Uplabdh Hai'}
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              Max Doori: {worker.preferredDistanceKm} km
            </span>
          </div>

          {/* About Me */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Worker Ke Baare Me (About)
            </h4>
            <p className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-800 leading-relaxed whitespace-pre-line font-medium">
              {worker.about}
            </p>
          </div>

          {/* Skills Checklist */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Hunar & Kaam (Skills)
            </h4>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-white border border-stone-200 text-stone-800 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Past Work */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Pehle Ka Kaam (Previous Experience)
            </h4>
            <p className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 leading-relaxed font-medium">
              {worker.previousWork}
            </p>
          </div>

          {/* Customer Reviews & Feedback */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Grahakon Ke Reviews ({worker.totalReviews})
              </h4>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                ⭐ {worker.rating} / 5.0
              </span>
            </div>

            <div className="space-y-2.5">
              {workerReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900">{rev.reviewerName}</span>
                    <span className="text-[10px] text-stone-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rev.rating)
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-stone-700 ml-1">
                      {rev.rating}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {rev.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-amber-100/60 text-amber-900 text-[10px] font-semibold px-2 py-0.2 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-stone-700 leading-snug">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Report Link */}
          <div className="text-center pt-2">
            <button
              onClick={() =>
                setReportTarget({
                  id: worker.id,
                  title: `${worker.name} (${worker.categoryName})`,
                  type: 'worker',
                })
              }
              className="text-xs text-stone-400 hover:text-red-600 transition underline"
            >
              Is worker profile ki shikayat / report karein
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 p-4 pb-safe flex items-center gap-2.5 z-10 shadow-lg">
          {showHireBox ? (
            <form onSubmit={handleHireSubmit} className="w-full space-y-3">
              {hireSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Worker ko kaam schedule ho gaya hai! Dashboard me track karein.</span>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Dihadi (₹ / Day):
                      </label>
                      <input
                        type="number"
                        value={agreedWage}
                        onChange={(e) => setAgreedWage(e.target.value)}
                        className="w-full px-3 py-2 text-xs border rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Kab Se Kaam Hai?:
                      </label>
                      <input
                        type="text"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs border rounded-xl font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowHireBox(false)}
                      className="w-1/3 py-2 text-xs font-bold text-stone-600 border rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 text-xs font-bold text-white bg-stone-900 rounded-xl shadow"
                    >
                      Kaam Confirm Karein
                    </button>
                  </div>
                </>
              )}
            </form>
          ) : (
            <>
              {/* Escrow Booking CTA */}
              <button
                onClick={() => {
                  setSelectedWorkerForEscrow(worker);
                  setIsEscrowBookingModalOpen(true);
                  onClose();
                }}
                className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-md active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
                title="Book worker with guaranteed escrow payment lock"
              >
                <Lock className="w-4 h-4" />
                <span>Book & Lock Payment 🔒</span>
              </button>

              {/* Call button */}
              {revealedPhone ? (
                <a
                  href={`tel:${worker.phone}`}
                  className="py-3 px-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Phone className="w-4 h-4" />
                  <span>{worker.phone}</span>
                </a>
              ) : (
                <button
                  onClick={() => setRevealedPhone(true)}
                  className="py-3.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Call</span>
                </button>
              )}

              {/* Chat button */}
              <button
                onClick={handleStartChat}
                className="p-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-orange-600 transition"
                title="Chat Karein"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
