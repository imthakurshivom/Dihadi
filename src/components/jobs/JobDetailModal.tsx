import React, { useState } from 'react';
import { Job } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Phone,
  MessageSquare,
  Share2,
  Utensils,
  Home,
  ShieldAlert,
  X,
  Heart,
  Check,
  Building,
  Navigation,
} from 'lucide-react';

interface Props {
  job: Job;
  onClose: () => void;
}

export const JobDetailModal: React.FC<Props> = ({ job, onClose }) => {
  const {
    savedJobIds,
    toggleSaveJob,
    applyForJob,
    startOrGetConversation,
    setActiveConversationId,
    setActiveTab,
    setReportTarget,
  } = useApp();

  const [showApplyBox, setShowApplyBox] = useState(false);
  const [customWage, setCustomWage] = useState(job.dailyWage.toString());
  const [applyNote, setApplyNote] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState(false);

  const isSaved = savedJobIds.includes(job.id);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyForJob(job.id, applyNote, Number(customWage) || job.dailyWage);
    if (res.success) {
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setShowApplyBox(false);
      }, 1500);
    }
  };

  const handleStartChat = () => {
    const convId = startOrGetConversation('worker-1', job.employerId, job.id);
    setActiveConversationId(convId);
    setActiveTab('chat');
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Dihadi: ${job.title}`,
        text: `${job.title} - ${job.locationArea}, ₹${job.dailyWage}/day. Apply now on Dihadi!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Dihadi Kaam: ${job.title} at ${job.locationArea}, ₹${job.dailyWage}/day`
      );
      alert('Details copy ho gayi hain!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-stone-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="bg-orange-50 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-200/60">
              {job.categoryName}
            </span>
            <span className="text-xs text-stone-500 font-medium">📍 {job.distanceKm} km away</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveJob(job.id)}
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
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Title & Timing */}
          <div>
            <h1 className="text-xl font-extrabold text-stone-900 leading-snug">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-600 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {job.locationArea}, {job.locationCity} ({job.locationPincode})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {job.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {job.startTime}
              </span>
            </div>
          </div>

          {/* Highlights Banner */}
          <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/60">
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-800/70 block">Dihadi Rate</span>
              <div className="text-lg font-extrabold text-orange-950">
                ₹{job.dailyWage}
                <span className="text-xs font-semibold text-orange-800">/din</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-800/70 block">Workers Needed</span>
              <div className="text-sm font-bold text-stone-800 mt-1 flex items-center gap-1">
                <Users className="w-4 h-4 text-orange-600" />
                <span>{job.workersRequired} Majdoor</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-800/70 block">Duration</span>
              <div className="text-sm font-bold text-stone-800 mt-1">
                {job.expectedDuration}
              </div>
            </div>
          </div>

          {/* Perks Bar */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {job.foodProvided && (
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                Dopahar ka Khana Free Milega
              </span>
            )}
            {job.accommodationProvided && (
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-xl border border-blue-200">
                <Home className="w-3.5 h-3.5 text-blue-600" />
                Site par Rehna Free
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-stone-100 text-stone-800 px-3 py-1.5 rounded-xl">
              Type: {job.jobType.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Kaam Ka Vivaran (Job Description)
            </h4>
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-sm text-stone-800 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Zaroori Skills / Hunar
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((s) => (
                <span
                  key={s}
                  className="bg-white border border-stone-200 text-stone-800 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Hyperlocal Visual Map Mockup */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Site Location Pin ({job.distanceKm} km door)
            </h4>
            <div className="h-32 rounded-2xl bg-stone-100 border border-stone-200 relative overflow-hidden flex items-center justify-center p-3 text-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                  <Navigation className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-stone-800 mt-1.5">
                  {job.locationArea}, {job.locationCity}
                </p>
                <p className="text-[11px] text-stone-500">
                  Exact address worker confirm hone ke baad chat par milta hai.
                </p>
              </div>
            </div>
          </div>

          {/* Employer Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-base">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-stone-900">{job.employerName}</h4>
                  {job.isEmployerVerified && (
                    <span title="Verified Employer" className="text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                  <span>⭐ {job.employerRating} Rating</span>
                  <span>•</span>
                  <span>Verified Contractor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Dihadi Suraksha Guarantee:</span>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                Kisi bhi halat me advance entry fees ya security deposit na dein. Dihadi par sabhi aavedan bilkul free hain.
              </p>
            </div>
          </div>

          {/* Report Button */}
          <div className="text-center pt-1">
            <button
              onClick={() =>
                setReportTarget({
                  id: job.id,
                  title: job.title,
                  type: 'job',
                })
              }
              className="text-xs text-stone-400 hover:text-red-600 transition underline"
            >
              Is kaam ki shikayat / report karein (Fake or Advance Scam)
            </button>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 p-4 pb-safe flex items-center gap-2.5 z-10 shadow-lg">
          {showApplyBox ? (
            <form onSubmit={handleSubmitApplication} className="w-full space-y-3">
              {applySuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Aavedan bhej diya gaya hai! Contractor aapse jaldi contact karega.</span>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Aapki Expected Dihadi (₹/day):
                      </label>
                      <input
                        type="number"
                        value={customWage}
                        onChange={(e) => setCustomWage(e.target.value)}
                        className="w-full px-3 py-2 text-xs border rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Short Message (Optional):
                      </label>
                      <input
                        type="text"
                        value={applyNote}
                        onChange={(e) => setApplyNote(e.target.value)}
                        placeholder="Tools sath launga..."
                        className="w-full px-3 py-2 text-xs border rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowApplyBox(false)}
                      className="w-1/3 py-2 text-xs font-bold text-stone-600 border rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 text-xs font-bold text-white bg-orange-600 rounded-xl shadow"
                    >
                      Aavedan Submit Karein
                    </button>
                  </div>
                </>
              )}
            </form>
          ) : (
            <>
              {/* Primary Apply Button */}
              <button
                onClick={() => setShowApplyBox(true)}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/30 active:scale-98 transition flex items-center justify-center gap-1.5"
              >
                <span>Kaam ke liye Apply Karein</span>
              </button>

              {/* Call Button */}
              {revealedPhone ? (
                <a
                  href={`tel:${job.employerPhone}`}
                  className="py-3 px-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Phone className="w-4 h-4" />
                  <span>{job.employerPhone}</span>
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

              {/* Chat Button */}
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
