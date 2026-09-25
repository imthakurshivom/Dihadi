import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA } from '../../data/mockData';
import { JobCard } from '../jobs/JobCard';
import { WorkerCard } from '../workers/WorkerCard';
import { DistanceFilter } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  Search,
  MapPin,
  ShieldAlert,
  ArrowRight,
  HardHat,
  Briefcase,
  Users,
  Compass,
  Sparkles,
  Flame,
  CheckCircle,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    t,
    userMode,
    setUserMode,
    currentCity,
    currentArea,
    distanceFilter,
    setDistanceFilter,
    setIsLocationModalOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    jobs,
    workers,
    setSelectedJobForDetail,
    setSelectedWorkerForDetail,
    setActiveTab,
    setIsPostJobOpen,
  } = useApp();

  // Filter jobs by current distance
  const nearbyJobs = jobs.filter(
    (j) => distanceFilter === 999 || j.distanceKm <= distanceFilter
  );

  // Filter workers by current distance
  const nearbyWorkers = workers.filter(
    (w) => distanceFilter === 999 || w.distanceKm <= distanceFilter
  );

  const distanceChips: { value: DistanceFilter; label: string }[] = [
    { value: 1, label: '1 km' },
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
    { value: 999, label: 'Whole City' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 pb-24 space-y-5">
      {/* PWA In-App Banner if installable */}
      <PWAInstallButton variant="banner" />

      {/* Hyperlocal Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            // If user types or clicks search bar, jump to search tab
            setActiveTab('search');
          }}
          placeholder={t.searchPlaceholder}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-stone-200 text-sm font-semibold shadow-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder:text-stone-400"
        />
      </div>

      {/* TWO PROMINENT HERO CARDS (Core Requirement 2 & 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* OPTION A: 👷 Mujhe Kaam Chahiye */}
        <div
          onClick={() => {
            setUserMode('worker');
            setActiveTab('search');
          }}
          className={`p-5 rounded-3xl cursor-pointer transition-all duration-200 active:scale-98 border-2 relative overflow-hidden group ${
            userMode === 'worker'
              ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white border-orange-500 shadow-lg shadow-orange-600/25'
              : 'bg-white text-stone-900 border-stone-200/90 hover:border-orange-400 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl mb-2 flex-shrink-0">
              👷
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                userMode === 'worker' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-800'
              }`}
            >
              <span>{nearbyJobs.length} Kaam Live</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight leading-tight mt-1">
            {t.workerMode}
          </h2>
          <p
            className={`text-xs mt-1 leading-snug font-medium ${
              userMode === 'worker' ? 'text-orange-100' : 'text-stone-500'
            }`}
          >
            {t.workerSub}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold">
            <span
              className={`px-3 py-1.5 rounded-xl ${
                userMode === 'worker'
                  ? 'bg-white text-orange-700'
                  : 'bg-orange-600 text-white'
              }`}
            >
              Jobs Dekhein →
            </span>
          </div>
        </div>

        {/* OPTION B: 🏗️ Mujhe Majdoor Chahiye */}
        <div
          onClick={() => {
            setUserMode('employer');
            setActiveTab('search');
          }}
          className={`p-5 rounded-3xl cursor-pointer transition-all duration-200 active:scale-98 border-2 relative overflow-hidden group ${
            userMode === 'employer'
              ? 'bg-gradient-to-br from-amber-700 to-orange-700 text-white border-amber-600 shadow-lg shadow-amber-700/25'
              : 'bg-white text-stone-900 border-stone-200/90 hover:border-amber-400 shadow-xs'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl mb-2 flex-shrink-0">
              🏗️
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                userMode === 'employer' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span>{nearbyWorkers.length} Available</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight leading-tight mt-1">
            {t.employerMode}
          </h2>
          <p
            className={`text-xs mt-1 leading-snug font-medium ${
              userMode === 'employer' ? 'text-amber-100' : 'text-stone-500'
            }`}
          >
            {t.employerSub}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold">
            <span
              className={`px-3 py-1.5 rounded-xl ${
                userMode === 'employer'
                  ? 'bg-white text-amber-800'
                  : 'bg-amber-600 text-white'
              }`}
            >
              Workers Dhundhein →
            </span>
          </div>
        </div>
      </div>

      {/* Aapke Aas-Paas Hyperlocal Distance Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              {t.nearYou} ({currentArea}, {currentCity})
            </h3>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-xs text-orange-600 font-bold hover:underline"
          >
            {t.changeLocation}
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {distanceChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setDistanceFilter(chip.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                distanceFilter === chip.value
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Work Categories Horizontal Carousel */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            {t.category}
          </h3>
          <button
            onClick={() => setActiveTab('search')}
            className="text-xs text-orange-600 font-bold hover:underline"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
              selectedCategory === null
                ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            Sabhi
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveTab('search');
              }}
              className="px-3.5 py-2 rounded-2xl bg-white border border-stone-200 hover:border-orange-400 text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95"
            >
              <span className="text-base">{cat.icon}</span>
              <span className="text-stone-800">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong className="block text-amber-950 font-bold">Dihadi Suraksha Tip:</strong>
          {t.safetyWarning}
        </div>
      </div>

      {/* SECTION 1: Nearby Jobs Feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
              {t.nearbyJobs}
            </h2>
            <span className="bg-orange-100 text-orange-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {nearbyJobs.length} Available
            </span>
          </div>

          <button
            onClick={() => {
              setUserMode('worker');
              setActiveTab('search');
            }}
            className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-0.5"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {nearbyJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500">
            <p className="font-bold text-stone-800">{t.noJobsFound}</p>
            <button
              onClick={() => setDistanceFilter(999)}
              className="mt-2 text-xs text-orange-600 font-bold underline"
            >
              Poora Shehar (Whole City) Search Karein
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {nearbyJobs.slice(0, 4).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onOpenDetail={(j) => setSelectedJobForDetail(j)}
              />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Available Workers Near You Feed */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
              {t.availableWorkers}
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {nearbyWorkers.length} Karigar
            </span>
          </div>

          <button
            onClick={() => {
              setUserMode('employer');
              setActiveTab('search');
            }}
            className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-0.5"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {nearbyWorkers.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500">
            <p className="font-bold text-stone-800">{t.noWorkersFound}</p>
            <button
              onClick={() => setDistanceFilter(999)}
              className="mt-2 text-xs text-orange-600 font-bold underline"
            >
              Poora Shehar Search Karein
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {nearbyWorkers.slice(0, 4).map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onOpenDetail={(w) => setSelectedWorkerForDetail(w)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky Quick Job Post Bar on mobile */}
      <div className="p-4 rounded-3xl bg-stone-900 text-white flex items-center justify-between shadow-lg">
        <div>
          <h4 className="font-bold text-sm">Apne Kaam Ke Liye Worker Chahiye?</h4>
          <p className="text-xs text-stone-400">1 minute me free job post karein</p>
        </div>
        <button
          onClick={() => setIsPostJobOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow transition active:scale-95 flex-shrink-0"
        >
          {t.postJobCTA}
        </button>
      </div>
    </div>
  );
};
