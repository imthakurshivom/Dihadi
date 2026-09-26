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
  ShieldCheck,
  Check,
  Lock,
} from 'lucide-react';

interface Props {
  worker: WorkerProfile;
  onOpenDetail: (worker: WorkerProfile) => void;
}

export const WorkerCard: React.FC<Props> = ({ worker, onOpenDetail }) => {
  const {
    t,
    savedWorkerIds,
    toggleSaveWorker,
    hireWorker,
    setIsEscrowBookingModalOpen,
    setSelectedWorkerForEscrow,
    startOrGetConversation,
    setActiveConversationId,
    setActiveTab,
  } = useApp();

  const [revealedPhone, setRevealedPhone] = useState(false);
  const [hiredState, setHiredState] = useState<'idle' | 'hired'>('idle');

  const isSaved = savedWorkerIds.includes(worker.id);

  const handleHire = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWorkerForEscrow(worker);
    setIsEscrowBookingModalOpen(true);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedPhone(true);
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    const convId = startOrGetConversation(worker.id, 'u-user-current');
    setActiveConversationId(convId);
    setActiveTab('chat');
  };

  return (
    <div
      onClick={() => onOpenDetail(worker)}
      className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer relative group flex flex-col justify-between"
    >
      <div>
        {/* Top: Avatar, Name, Category & Verified */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-stone-100 shadow-xs"
              />
              {/* Availability dot */}
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                  worker.availability === 'today'
                    ? 'bg-emerald-500'
                    : worker.availability === 'tomorrow'
                    ? 'bg-amber-500'
                    : 'bg-stone-400'
                }`}
                title={
                  worker.availability === 'today'
                    ? 'Available Today'
                    : worker.availability === 'tomorrow'
                    ? 'Available Tomorrow'
                    : 'Currently Busy'
                }
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-stone-900 group-hover:text-orange-600 transition">
                  {worker.name}
                </h3>
                {worker.isVerified && (
                  <span title="Aadhaar / Mobile Verified Worker" className="text-emerald-600">
                    <CheckCircle className="w-4 h-4 fill-emerald-100" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/50">
                  {worker.categoryName}
                </span>
                <span className="text-[11px] font-medium text-stone-500">
                  📍 {worker.distanceKm} km
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveWorker(worker.id);
            }}
            className="p-1.5 rounded-full text-stone-400 hover:text-red-500 hover:bg-stone-50 transition"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Status Pill & Location */}
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span
            className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
              worker.availability === 'today'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : worker.availability === 'tomorrow'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-stone-100 text-stone-700'
            }`}
          >
            {worker.availability === 'today'
              ? '🟢 Available Today'
              : worker.availability === 'tomorrow'
              ? '🟡 Available Kal'
              : '🔴 Abhi Busy'}
          </span>

          <span className="flex items-center gap-1 text-stone-600 text-[11px] font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <strong className="text-stone-900">{worker.rating}</strong>
            <span className="text-stone-400">({worker.totalReviews})</span>
          </span>

          <span className="text-stone-500 text-[11px] ml-auto">
            {worker.experienceYears} Saal Exp
          </span>
        </div>

        {/* Wage Highlight */}
        <div className="mt-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Dihadi Rate</span>
            <span className="text-sm font-extrabold text-stone-900">
              ₹{worker.dailyWageMin} – ₹{worker.dailyWageMax}
              <span className="text-xs font-semibold text-stone-500"> / din</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Completed</span>
            <span className="text-xs font-bold text-emerald-700">
              ✓ {worker.completedJobsCount} Kaam Done
            </span>
          </div>
        </div>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {worker.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[10px] bg-white border border-stone-200 text-stone-700 font-medium px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="text-[10px] text-stone-400 font-medium px-1 py-0.5">
              +{worker.skills.length - 3} aur
            </span>
          )}
        </div>
      </div>

      {/* Action Row */}
      <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center gap-2">
        {/* Book & Lock Payment Button */}
        <button
          onClick={handleHire}
          className="flex-1 py-2 px-2.5 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white flex items-center justify-center gap-1 cursor-pointer"
          title="Book with guaranteed escrow payment lock"
        >
          <Lock className="w-3 h-3" />
          <span>Book & Lock 🔒</span>
        </button>

        {/* Call button */}
        {revealedPhone ? (
          <a
            href={`tel:${worker.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm animate-in zoom-in-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{worker.phone}</span>
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
  );
};
