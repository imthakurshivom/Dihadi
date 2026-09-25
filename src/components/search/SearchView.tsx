import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA } from '../../data/mockData';
import { JobCard } from '../jobs/JobCard';
import { WorkerCard } from '../workers/WorkerCard';
import { DistanceFilter, Job, WorkerProfile } from '../../types';
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Check,
  Star,
  ShieldCheck,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

export const SearchView: React.FC = () => {
  const {
    t,
    jobs,
    workers,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    distanceFilter,
    setDistanceFilter,
    currentCity,
    currentArea,
    setSelectedJobForDetail,
    setSelectedWorkerForDetail,
  } = useApp();

  const [activeSearchTab, setActiveSearchTab] = useState<'jobs' | 'workers'>('jobs');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [sortBy, setSortBy] = useState<'nearest' | 'newest' | 'rating' | 'wage_low' | 'wage_high'>('nearest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [maxWageFilter, setMaxWageFilter] = useState<number>(2000);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCat = job.categoryName.toLowerCase().includes(q);
          const matchSkill = job.skills.some((s) => s.toLowerCase().includes(q));
          const matchArea = job.locationArea.toLowerCase().includes(q);
          if (!matchTitle && !matchCat && !matchSkill && !matchArea) return false;
        }

        // Category
        if (selectedCategory && job.categoryId !== selectedCategory) return false;

        // Distance
        if (distanceFilter !== 999 && job.distanceKm > distanceFilter) return false;

        // Verified
        if (verifiedOnly && !job.isEmployerVerified) return false;

        // Max Wage
        if (job.dailyWage > maxWageFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
        if (sortBy === 'wage_low') return a.dailyWage - b.dailyWage;
        if (sortBy === 'wage_high') return b.dailyWage - a.dailyWage;
        if (sortBy === 'rating') return b.employerRating - a.employerRating;
        return 0; // Newest by default
      });
  }, [jobs, searchQuery, selectedCategory, distanceFilter, verifiedOnly, maxWageFilter, sortBy]);

  // Filtered Workers
  const filteredWorkers = useMemo(() => {
    return workers
      .filter((worker) => {
        // Query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = worker.name.toLowerCase().includes(q);
          const matchCat = worker.categoryName.toLowerCase().includes(q);
          const matchSkill = worker.skills.some((s) => s.toLowerCase().includes(q));
          const matchArea = worker.area.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchSkill && !matchArea) return false;
        }

        // Category
        if (selectedCategory && worker.categoryId !== selectedCategory) return false;

        // Distance
        if (distanceFilter !== 999 && worker.distanceKm > distanceFilter) return false;

        // Verified
        if (verifiedOnly && !worker.isVerified) return false;

        // Available Today
        if (availableTodayOnly && worker.availability !== 'today') return false;

        // Max Wage
        if (worker.dailyWageMin > maxWageFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'wage_low') return a.dailyWageMin - b.dailyWageMin;
        if (sortBy === 'wage_high') return b.dailyWageMax - a.dailyWageMax;
        return 0;
      });
  }, [workers, searchQuery, selectedCategory, distanceFilter, verifiedOnly, availableTodayOnly, maxWageFilter, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setDistanceFilter(10);
    setVerifiedOnly(false);
    setAvailableTodayOnly(false);
    setMaxWageFilter(2000);
    setSortBy('nearest');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedCategory) ||
    verifiedOnly ||
    availableTodayOnly ||
    maxWageFilter < 2000;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 pb-24">
      {/* Search Input Bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Mason, Electrician, Painter, Helper..."
            className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white border border-stone-200 text-sm font-semibold shadow-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className={`p-3 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition ${
            hasActiveFilters
              ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Target Tabs: Kaam (Jobs) vs Majdoor (Workers) */}
      <div className="flex rounded-2xl bg-stone-100 p-1 mb-3 text-xs font-bold">
        <button
          onClick={() => setActiveSearchTab('jobs')}
          className={`flex-1 py-2 rounded-xl transition ${
            activeSearchTab === 'jobs'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          🏗️ Kaam / Jobs ({filteredJobs.length})
        </button>
        <button
          onClick={() => setActiveSearchTab('workers')}
          className={`flex-1 py-2 rounded-xl transition ${
            activeSearchTab === 'workers'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          👷 Majdoor / Workers ({filteredWorkers.length})
        </button>
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            selectedCategory === null
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          Sabhi Categories
        </button>
        {CATEGORIES_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white font-bold shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Filter Drawer / Accordion */}
      {showFilterDrawer && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-md mb-4 space-y-4 animate-in fade-in zoom-in-98 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-orange-600" />
              Advanced Filters & Sort
            </span>
            <button
              onClick={clearAllFilters}
              className="text-xs text-orange-600 font-bold hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
              Sort Karein (Ordering)
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: 'nearest', label: '📍 Sabse Pass (Nearest)' },
                { id: 'rating', label: '⭐ Highest Rated' },
                { id: 'wage_low', label: '💰 Lowest Wage' },
                { id: 'wage_high', label: '💰 Highest Wage' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id as any)}
                  className={`px-3 py-1.5 rounded-xl border font-semibold transition ${
                    sortBy === s.id
                      ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
              Doori (Distance): {distanceFilter === 999 ? 'Whole City' : `${distanceFilter} km`}
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
              {[1, 5, 10, 25, 999].map((dist) => (
                <button
                  key={dist}
                  onClick={() => setDistanceFilter(dist as DistanceFilter)}
                  className={`py-1.5 rounded-xl border text-center transition ${
                    distanceFilter === dist
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {dist === 999 ? 'City' : `${dist} km`}
                </button>
              ))}
            </div>
          </div>

          {/* Wage Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
              <span>Max Dihadi / Day:</span>
              <span className="text-orange-600 font-extrabold text-sm">₹{maxWageFilter}</span>
            </div>
            <input
              type="range"
              min={500}
              max={2000}
              step={50}
              value={maxWageFilter}
              onChange={(e) => setMaxWageFilter(Number(e.target.value))}
              className="w-full accent-orange-600"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>₹500</span>
              <span>₹1,000</span>
              <span>₹1,500</span>
              <span>₹2,000</span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                verifiedOnly
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-stone-200 text-stone-600'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Sirf Verified Users
              </span>
              <span>{verifiedOnly ? '✓ Haan' : 'Nahi'}</span>
            </button>

            {activeSearchTab === 'workers' && (
              <button
                onClick={() => setAvailableTodayOnly(!availableTodayOnly)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                  availableTodayOnly
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                <span>🟢 Sirf Aaj Available</span>
                <span>{availableTodayOnly ? '✓ Haan' : 'Nahi'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Search & Filter Info Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-3 px-1">
        <span>
          <strong>
            {activeSearchTab === 'jobs' ? filteredJobs.length : filteredWorkers.length}
          </strong>{' '}
          {activeSearchTab === 'jobs' ? 'kaam mile' : 'workers mile'} ({currentCity},{' '}
          {distanceFilter === 999 ? 'Whole City' : `${distanceFilter} km`})
        </span>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-orange-600 font-semibold hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Content */}
      {activeSearchTab === 'jobs' ? (
        filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-500">
            <p className="text-base font-bold text-stone-800">
              Aapke filters ke hisaab se koi kaam nahi mila.
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Doori (Distance) ka daayra badha kar ya category hata kar dobara check karein.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onOpenDetail={(j) => setSelectedJobForDetail(j)}
              />
            ))}
          </div>
        )
      ) : filteredWorkers.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-500">
          <p className="text-base font-bold text-stone-800">
            Is category me koi worker nahi mila.
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Distance badhayein ya search term change karein.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onOpenDetail={(w) => setSelectedWorkerForDetail(w)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
