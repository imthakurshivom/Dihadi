import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA, CITIES_DATA } from '../../data/mockData';
import {
  ShieldCheck,
  Users,
  Briefcase,
  AlertTriangle,
  Trash2,
  Check,
  X,
  Building,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    jobs,
    workers,
    reports,
    hirings,
    verifyUserAdmin,
    removeJobAdmin,
    resolveReportAdmin,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'reports' | 'jobs' | 'verify'>('stats');

  if (!isAdminOpen) return null;

  const totalWorkers = workers.length;
  const totalJobs = jobs.length;
  const totalHirings = hirings.length;
  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Dihadi Admin & Moderation Panel</h2>
              <p className="text-[11px] text-stone-400">
                Suraksha, User Verification & Job Moderation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 text-xs font-bold text-stone-600">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'stats'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Dashboard Stats
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-red-600 text-red-600'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <span>Shikayat / Reports</span>
            {pendingReports.length > 0 && (
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                {pendingReports.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'jobs'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Manage Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'verify'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Verify Workers ({workers.length})
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                  <span className="text-[11px] font-bold text-orange-800 uppercase">
                    Active Workers
                  </span>
                  <div className="text-2xl font-extrabold text-orange-950 mt-1">
                    {totalWorkers}
                  </div>
                  <span className="text-[10px] text-orange-700">Verified craftsmen</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800 uppercase">
                    Live Kaam (Jobs)
                  </span>
                  <div className="text-2xl font-extrabold text-amber-950 mt-1">
                    {totalJobs}
                  </div>
                  <span className="text-[10px] text-amber-700">In 7 cities</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">
                    Hirings / Work
                  </span>
                  <div className="text-2xl font-extrabold text-emerald-950 mt-1">
                    {totalHirings}
                  </div>
                  <span className="text-[10px] text-emerald-700">Scheduled & active</span>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                  <span className="text-[11px] font-bold text-red-800 uppercase">
                    Reported Fraud / Flags
                  </span>
                  <div className="text-2xl font-extrabold text-red-950 mt-1">
                    {reports.length}
                  </div>
                  <span className="text-[10px] text-red-700">Pending review: {pendingReports.length}</span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-800 uppercase">
                    Covered Cities
                  </span>
                  <div className="text-2xl font-extrabold text-blue-950 mt-1">
                    {CITIES_DATA.length}
                  </div>
                  <span className="text-[10px] text-blue-700">Haryana, Delhi, UP</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-700 uppercase">
                    Categories
                  </span>
                  <div className="text-2xl font-extrabold text-stone-900 mt-1">
                    {CATEGORIES_DATA.length}
                  </div>
                  <span className="text-[10px] text-stone-600">Mistri, Helper, Welder...</span>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider mb-2">
                  System Health & Anti-Spam Status
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  ✓ Geolocation filtering active (1–25km radius).<br />
                  ✓ Phone numbers privacy masked until caller initiation.<br />
                  ✓ Duplicate job posting rate limit active.<br />
                  ✓ Advance fee warning displayed across all job detail pages.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  Koi reported listing nahi hai. Sab surakshit hai!
                </div>
              ) : (
                reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3.5 bg-red-50/60 rounded-2xl border border-red-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-900 text-sm">{rep.targetTitle}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rep.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-stone-700 font-semibold">
                      Reason: <span className="text-red-700">{rep.reason}</span>
                    </p>
                    {rep.details && (
                      <p className="text-stone-600 bg-white p-2 rounded-lg border border-red-100">
                        "{rep.details}"
                      </p>
                    )}
                    {rep.status === 'pending' && (
                      <div className="pt-1 flex gap-2">
                        <button
                          onClick={() => resolveReportAdmin(rep.id)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]"
                        >
                          Resolve & Clear
                        </button>
                        <button
                          onClick={() => {
                            if (rep.targetType === 'job') removeJobAdmin(rep.reportedTargetId);
                            resolveReportAdmin(rep.id);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold text-[11px]"
                        >
                          Remove Listing / Block
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-stone-900">{job.title}</h5>
                    <p className="text-stone-500">
                      ₹{job.dailyWage}/day • {job.locationArea}, {job.locationCity} • By {job.employerName}
                    </p>
                  </div>
                  <button
                    onClick={() => removeJobAdmin(job.id)}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50"
                    title="Remove fake job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'verify' && (
            <div className="space-y-2">
              {workers.map((worker) => (
                <div
                  key={worker.id}
                  className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-stone-900">{worker.name}</h5>
                      <p className="text-stone-500">
                        {worker.categoryName} • {worker.area}, {worker.city}
                      </p>
                    </div>
                  </div>

                  {worker.isVerified ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => verifyUserAdmin(worker.id)}
                      className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                    >
                      Grant Verified Badge
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
