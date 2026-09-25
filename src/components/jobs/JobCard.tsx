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
  Heart,
  Share2,
  Utensils,
  Home,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface Props {
  job: Job;
  onOpenDetail: (job: Job) => void;
}

export const JobCard: React.FC<Props> = ({ job, onOpenDetail }) => {
  const {
    t,
    savedJobIds,
    toggleSaveJob,
    applyForJob,
    startOrGetConversation,
    setActiveConversationId,
    setActiveTab,
    setReportTarget,
  } = useApp();

  const [showPhone, setShowPhone] = useState(false);
  const [applyState, setApplyState] = useState<'idle' | 'applied'>('idle');

  const isSaved = savedJobIds.includes(job.id);

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = applyForJob(job.id);
    if (res.success) {
      setApplyState('applied');
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPhone(true);
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    const convId = startOrGetConversation('worker-1', job.employerId, job.id);
    setActiveConversationId(convId);
    setActiveTab('chat');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Dihadi Kaam: ${job.title}`,
        text: `Sonipat me kaam available hai: ${job.title}, ₹${job.dailyWage}/day. Dihadi app par apply karein!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Dihadi Kaam: ${job.title} at ${job.locationArea}, ₹${job.dailyWage}/day`
      );
      alert('Kaam ki details copy ho gayi hain! WhatsApp par share karein.');
    }
  };

  return (
    <div
      onClick={() => onOpenDetail(job)}
      className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer relative group flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Category + Distance + Save button */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-orange-50 text-orange-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-orange-200/60">
              {job.categoryName}
            </span>
            {job.isUrgent && (
              <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-red-200/60">
                <Flame className="w-3 h-3 text-red-600 animate-pulse" />
                Urgent
              </span>
            )}
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
              📍 {job.distanceKm} km
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
            className="p-1.5 rounded-full text-stone-400 hover:text-red-500 hover:bg-stone-50 transition"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-stone-900 leading-snug group-hover:text-orange-600 transition">
          {job.title}
        </h3>

        {/* Location & Time */}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1 text-stone-700">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            {job.locationArea}, {job.locationCity}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            {job.date} ({job.startTime})
          </span>
        </div>

        {/* Wage & Requirements Pill Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Dihadi (Wage)</span>
            <div className="text-base font-extrabold text-stone-900">
              ₹{job.dailyWage}
              <span className="text-xs font-semibold text-stone-500"> / din</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Zaroorat (Need)</span>
            <div className="text-xs font-bold text-stone-800 flex items-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              <span>{job.workersRequired} Majdoor</span>
              <span className="text-[10px] text-stone-400 font-normal">({job.expectedDuration})</span>
            </div>
          </div>
        </div>

        {/* Perks & Tags */}
        <div className="flex items-center gap-2 mt-2.5 text-[11px] text-stone-600">
          {job.foodProvided && (
            <span className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-medium border border-amber-200/50">
              <Utensils className="w-3 h-3 text-amber-600" /> Khana Free
            </span>
          )}
          {job.accommodationProvided && (
            <span className="flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-medium border border-blue-200/50">
              <Home className="w-3 h-3 text-blue-600" /> Rehna Free
            </span>
          )}
          <span className="text-stone-400 text-[10px] ml-auto">
            {job.createdAt}
          </span>
        </div>
      </div>

      {/* Employer Info & Direct Action CTAs */}
      <div className="mt-3.5 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-800">{job.employerName}</span>
            {job.isEmployerVerified && (
              <span title="Verified Employer" className="text-emerald-600">
                <CheckCircle className="w-3.5 h-3.5" />
              </span>
            )}
            <span className="text-[11px] text-stone-500 font-medium">
              ⭐ {job.employerRating}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1"
          >
            <Share2 className="w-3 h-3" />
            <span>Share</span>
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          {/* Apply button */}
          <button
            onClick={handleApply}
            disabled={applyState === 'applied'}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm ${
              applyState === 'applied'
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {applyState === 'applied' ? '✓ Applied' : 'Apply Karein'}
          </button>

          {/* Call button */}
          {showPhone ? (
            <a
              href={`tel:${job.employerPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm animate-in zoom-in-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{job.employerPhone}</span>
            </a>
          ) : (
            <button
              onClick={handleCall}
              className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call</span>
            </button>
          )}

          {/* Chat button */}
          <button
            onClick={handleChat}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            title="Chat Karein"
          >
            <MessageSquare className="w-4 h-4 text-orange-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
