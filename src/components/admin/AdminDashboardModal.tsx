import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CITIES_DATA } from '../../data/mockData';
import {
  ShieldCheck,
  AlertTriangle,
  Users,
  Briefcase,
  Trash2,
  Check,
  X,
  Building,
  DollarSign,
  Phone,
  MessageCircle,
  Megaphone,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Search,
  LogOut,
  Laptop,
} from 'lucide-react';
import { ReportItem } from '../../types';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    adminSession,
    logoutAdmin,
    setIsDedicatedAdminPortal,
    jobs,
    workers,
    reports,
    hirings,
    toggleWorkerVerificationAdmin,
    removeJobAdmin,
    resolveReportAdmin,
    updateReportStatus,
    toggleEmployerVerificationAdmin,
    broadcastNotice,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'disputes' | 'employers' | 'workers' | 'jobs' | 'broadcast'>('disputes');
  const [disputeFilter, setDisputeFilter] = useState<'all' | 'worker' | 'employer' | 'job' | 'pending' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resolutionInput, setResolutionInput] = useState<{ id: string; note: string } | null>(null);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    if (isAdminOpen && !isAdminAuthenticated) {
      setIsAdminOpen(false);
      setIsAdminLoginModalOpen(true);
    }
  }, [isAdminOpen, isAdminAuthenticated, setIsAdminOpen, setIsAdminLoginModalOpen]);

  if (!isAdminOpen || !isAdminAuthenticated) return null;

  // Derive unique employers from jobs and hirings
  const employerMap = new Map<string, {
    id: string;
    name: string;
    phone: string;
    rating: number;
    isVerified: boolean;
    jobsCount: number;
    disputesCount: number;
  }>();

  jobs.forEach((job) => {
    const existing = employerMap.get(job.employerName);
    const disputesForEmployer = reports.filter(
      (r) => r.reportedTargetId === job.employerId || r.targetTitle.toLowerCase().includes(job.employerName.toLowerCase())
    ).length;

    if (existing) {
      existing.jobsCount += 1;
    } else {
      employerMap.set(job.employerName, {
        id: job.employerId,
        name: job.employerName,
        phone: job.employerPhone,
        rating: job.employerRating,
        isVerified: job.isEmployerVerified,
        jobsCount: 1,
        disputesCount: disputesForEmployer,
      });
    }
  });

  const employersList = Array.from(employerMap.values());

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const resolvedReports = reports.filter((r) => r.status === 'resolved');
  const workerReports = reports.filter((r) => r.reporterRole === 'worker' || r.targetType === 'worker');
  const employerReports = reports.filter((r) => r.reporterRole === 'employer' || r.targetType === 'employer');

  const filteredReports = reports.filter((r) => {
    if (disputeFilter === 'worker' && r.reporterRole !== 'worker' && r.targetType !== 'worker') return false;
    if (disputeFilter === 'employer' && r.reporterRole !== 'employer' && r.targetType !== 'employer') return false;
    if (disputeFilter === 'job' && r.targetType !== 'job') return false;
    if (disputeFilter === 'pending' && r.status !== 'pending') return false;
    if (disputeFilter === 'resolved' && r.status !== 'resolved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTarget = r.targetTitle?.toLowerCase().includes(q);
      const matchReason = r.reason?.toLowerCase().includes(q);
      const matchReporter = r.reporterName?.toLowerCase().includes(q);
      const matchDetails = r.details?.toLowerCase().includes(q);
      return matchTarget || matchReason || matchReporter || matchDetails;
    }
    return true;
  });

  const handleResolveWithNote = (reportId: string) => {
    const note = resolutionInput?.note.trim() || 'Admin dwara dono parties se baat karke mamla suljha liya gaya.';
    resolveReportAdmin(reportId, note);
    setResolutionInput(null);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    broadcastNotice(broadcastTitle.trim(), broadcastMessage.trim());
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastTitle('');
      setBroadcastMessage('');
      setBroadcastSent(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-stone-800">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Dihadi Admin & Dispute Resolution Hub
                </h2>
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Officer: <strong className="text-orange-300">{adminSession?.officerName || 'Shivom Chauhan'}</strong> • Online Arbitration Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Launch Standalone Dedicated App Mode */}
            <button
              onClick={() => {
                setIsAdminOpen(false);
                setIsDedicatedAdminPortal(true);
                window.location.hash = 'admin-portal';
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition active:scale-95 shadow-md cursor-pointer"
              title="Open as Standalone App View"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Alag App Portal</span>
            </button>

            {/* Logout Admin */}
            <button
              onClick={() => {
                logoutAdmin();
                setIsAdminOpen(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-red-950/60 text-stone-300 hover:text-red-300 border border-stone-700 text-xs font-bold transition cursor-pointer"
              title="Lock Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              title="Close Admin Panel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100 overflow-x-auto text-xs font-bold text-stone-600 no-scrollbar">
          <button
            onClick={() => setActiveTab('disputes')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'disputes'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Problems & Disputes (समस्या निवारण)</span>
            {pendingReports.length > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                {pendingReports.length} Naye
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('employers')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'employers'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Building className="w-4 h-4 text-orange-600" />
            <span>Vendors / Thekedaar ({employersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('workers')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'workers'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Users className="w-4 h-4 text-orange-600" />
            <span>Workers / Karigar ({workers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'jobs'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Briefcase className="w-4 h-4 text-orange-600" />
            <span>Manage Jobs ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`py-3.5 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'broadcast'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Megaphone className="w-4 h-4 text-stone-700" />
            <span>Notice Board & Stats</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-stone-50/60 space-y-4">

          {/* TAB 1: DISPUTES & PROBLEMS RESOLUTION */}
          {activeTab === 'disputes' && (
            <div className="space-y-4">
              {/* Top Banner with Quick Summary */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Vendor aur Worker Samasya Resolution Desk</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Yahan se aap dono parties ko direct call/WhatsApp karke payment aur site disputes suljha sakte hain.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-xl">
                    Pending: <strong>{pendingReports.length}</strong>
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-xl">
                    Resolved: <strong>{resolvedReports.length}</strong>
                  </span>
                </div>
              </div>

              {/* Filter pills & search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                  <button
                    onClick={() => setDisputeFilter('all')}
                    className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      disputeFilter === 'all'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    Sabhi Problems ({reports.length})
                  </button>
                  <button
                    onClick={() => setDisputeFilter('worker')}
                    className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      disputeFilter === 'worker'
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    👷 Worker Problems ({workerReports.length})
                  </button>
                  <button
                    onClick={() => setDisputeFilter('employer')}
                    className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      disputeFilter === 'employer'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    🏗️ Vendor / Thekedar Problems ({employerReports.length})
                  </button>
                  <button
                    onClick={() => setDisputeFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      disputeFilter === 'pending'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    ⚠️ Pending ({pendingReports.length})
                  </button>
                  <button
                    onClick={() => setDisputeFilter('resolved')}
                    className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      disputeFilter === 'resolved'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    ✓ Resolved ({resolvedReports.length})
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search problem..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500 w-full sm:w-48 font-medium"
                  />
                </div>
              </div>

              {/* List of Disputes */}
              <div className="space-y-3">
                {filteredReports.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center text-stone-400 border border-stone-200 text-xs">
                    Koi problem ya report match nahi hui.
                  </div>
                ) : (
                  filteredReports.map((rep) => {
                    const isWorkerReport = rep.reporterRole === 'worker';
                    const isPending = rep.status === 'pending';

                    return (
                      <div
                        key={rep.id}
                        className={`bg-white rounded-2xl p-4 sm:p-5 border transition shadow-xs space-y-3 ${
                          isPending ? 'border-red-200 ring-1 ring-red-100' : 'border-stone-200 bg-stone-50/40'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                isWorkerReport
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {isWorkerReport ? '👷 Worker Report' : '🏗️ Vendor Report'}
                            </span>

                            <h4 className="font-bold text-stone-900 text-sm">
                              {rep.targetTitle}
                            </h4>

                            {rep.disputeAmount && rep.disputeAmount > 0 && (
                              <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-black px-2 py-0.5 rounded-full">
                                Disputed Amount: ₹{rep.disputeAmount}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-stone-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {rep.timestamp}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                rep.status === 'resolved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : rep.status === 'in_progress'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}
                            >
                              {rep.status === 'resolved' ? '✓ Resolved' : rep.status === 'in_progress' ? '⏳ In Progress' : '⚠️ Pending'}
                            </span>
                          </div>
                        </div>

                        {/* Reason and Description */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 mb-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Karan (Issue):</span>
                            <span className="text-red-700">{rep.reason}</span>
                          </div>
                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-xs text-stone-700 leading-relaxed">
                            "{rep.details || 'No additional details provided.'}"
                          </div>
                        </div>

                        {/* Reporter & Target contact boxes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Reporter Box */}
                          <div className="p-2.5 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-orange-800 uppercase">
                                Shikayatkarta (Reporter):
                              </p>
                              <p className="font-bold text-stone-900 mt-0.5">
                                {rep.reporterName || 'Registered User'}
                              </p>
                              <p className="text-[11px] text-stone-500 font-mono">
                                📞 {rep.reporterPhone || '+91 98124 55891'}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <a
                                href={`tel:${rep.reporterPhone || '9812455891'}`}
                                className="p-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-2xs cursor-pointer"
                                title="Call Reporter"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${(rep.reporterPhone || '9812455891').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Namaste ${rep.reporterName || ''}, Dihadi Admin Team se hum aapki shikayat (${rep.reason}) ke sambhandh me sampark kar rahe hain.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
                                title="WhatsApp Reporter"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          {/* Accused / Target Box */}
                          <div className="p-2.5 rounded-xl bg-stone-100/70 border border-stone-200 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-stone-600 uppercase">
                                Jiske Khilaf Shikayat Hai (Target):
                              </p>
                              <p className="font-bold text-stone-900 mt-0.5">
                                {rep.targetName || rep.targetTitle}
                              </p>
                              <p className="text-[11px] text-stone-500 font-mono">
                                📞 {rep.targetPhone || '+91 98120 77610'}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <a
                                href={`tel:${rep.targetPhone || '9812077610'}`}
                                className="p-1.5 rounded-lg bg-stone-800 hover:bg-black text-white shadow-2xs cursor-pointer"
                                title="Call Target"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${(rep.targetPhone || '9812077610').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Namaste, Dihadi Dispute Team se message. Aapke khilaf complaint aayi hai: "${rep.reason}". Kripya turant is mamle ko clear karein.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
                                title="WhatsApp Target"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Resolution Note if resolved */}
                        {rep.resolutionNote && (
                          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Samadhan Vivaran (Resolution Note):</span>
                              <p className="text-[11px] text-emerald-800 mt-0.5">
                                {rep.resolutionNote}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Admin Action Buttons */}
                        {isPending ? (
                          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-stone-100">
                            {resolutionInput?.id === rep.id ? (
                              <div className="w-full flex items-center gap-2">
                                <input
                                  type="text"
                                  value={resolutionInput.note}
                                  onChange={(e) =>
                                    setResolutionInput({ id: rep.id, note: e.target.value })
                                  }
                                  placeholder="Samadhan note likhein (jaise: payment online kra di)"
                                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                                />
                                <button
                                  onClick={() => handleResolveWithNote(rep.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  Confirm Settle
                                </button>
                                <button
                                  onClick={() => setResolutionInput(null)}
                                  className="px-2 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    setResolutionInput({
                                      id: rep.id,
                                      note: rep.disputeAmount
                                        ? `Thekedar dwara ₹${rep.disputeAmount} ka hisab chukta kiya gaya.`
                                        : 'Dono parties ke beech samjhota kara diya gaya.',
                                    })
                                  }
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Settle & Mark Resolved (समस्या हल)</span>
                                </button>

                                <button
                                  onClick={() => {
                                    updateReportStatus(
                                      rep.id,
                                      'in_progress',
                                      'Admin team dono pakshon se call par baat kar rahi hai.'
                                    );
                                  }}
                                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                                >
                                  ⏳ Mark In-Investigation
                                </button>

                                {rep.targetType === 'job' && (
                                  <button
                                    onClick={() => {
                                      removeJobAdmin(rep.reportedTargetId);
                                      resolveReportAdmin(rep.id, 'Job listing remove karke scammer ko block kiya gaya.');
                                    }}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Remove Fraud Job Listing</span>
                                  </button>
                                )}

                                <button
                                  onClick={() =>
                                    updateReportStatus(
                                      rep.id,
                                      'dismissed',
                                      'Janch ke baad shikayat asatya / irrelevant payi gayi.'
                                    )
                                  }
                                  className="px-2.5 py-1.5 text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer"
                                >
                                  Dismiss Report
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="pt-1 flex items-center justify-between text-xs text-stone-400">
                            <span>Status: Solution closed by Admin</span>
                            <button
                              onClick={() => updateReportStatus(rep.id, 'pending')}
                              className="text-stone-500 hover:text-orange-600 underline text-[11px]"
                            >
                              Re-open Problem
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VENDORS & THEKEDAARS */}
          {activeTab === 'employers' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4 border border-stone-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Registered Contractors, Thekedaar & Vendors
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Aap kisi bhi thekedar ko Verified Badge de sakte hain ya unki complaint aane par warning issue kar sakte hain.
                  </p>
                </div>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-xl">
                  Total: {employersList.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {employersList.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-stone-900 text-sm">{emp.name}</h5>
                            {emp.isVerified && (
                              <span className="text-emerald-600" title="Verified Contractor">
                                <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">📞 {emp.phone}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-amber-600">
                            ⭐ {emp.rating} Rating
                          </span>
                          <p className="text-[10px] text-stone-400">{emp.jobsCount} Live Jobs</p>
                        </div>
                      </div>

                      {emp.disputesCount > 0 ? (
                        <div className="mt-2 text-[11px] bg-red-50 text-red-700 px-2 py-0.5 rounded-lg border border-red-100 font-bold inline-block">
                          ⚠️ {emp.disputesCount} Reported Complaint(s)
                        </div>
                      ) : (
                        <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 font-semibold inline-block">
                          ✓ No Active Complaints
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${emp.phone}`}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </a>
                        <a
                          href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
                        </a>
                      </div>

                      <button
                        onClick={() => toggleEmployerVerificationAdmin(emp.name)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          emp.isVerified
                            ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {emp.isVerified ? 'Revoke Verified' : 'Grant Verified Badge'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WORKERS & KARIGARS */}
          {activeTab === 'workers' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4 border border-stone-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Registered Workers & Craftsmen (कारीगर व मजदूर)
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Aadhaar aur hunar verification manage karein taaki fraud profiles na rahein.
                  </p>
                </div>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-xl">
                  Total: {workers.length}
                </span>
              </div>

              <div className="space-y-2">
                {workers.map((worker) => (
                  <div
                    key={worker.id}
                    className="p-3.5 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-stone-900 text-sm">{worker.name}</h5>
                          <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            {worker.categoryName}
                          </span>
                        </div>
                        <p className="text-stone-500 mt-0.5">
                          📞 {worker.phone} • 📍 {worker.area}, {worker.city} • ₹{worker.dailyWageMin}-{worker.dailyWageMax}/day
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-stone-600 mt-1">
                          <span>⭐ {worker.rating} ({worker.totalReviews} reviews)</span>
                          <span>•</span>
                          <span>{worker.completedJobsCount} jobs completed</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <a
                        href={`tel:${worker.phone}`}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                        title="Call Worker"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${worker.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                        title="WhatsApp Worker"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => toggleWorkerVerificationAdmin(worker.id)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                          worker.isVerified
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {worker.isVerified ? '✓ Verified Worker' : '+ Verify Badge Dein'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JOBS MODERATION */}
          {activeTab === 'jobs' && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4 border border-stone-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Live Kaam (Job Postings Moderation)
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Fake jobs, advance mangne wali listing ya expired kaam ko turant delete karein.
                  </p>
                </div>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-xl">
                  {jobs.length} Active Listings
                </span>
              </div>

              <div className="space-y-2">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 bg-white rounded-2xl border border-stone-200 flex items-center justify-between text-xs shadow-2xs hover:border-orange-200 transition"
                  >
                    <div className="pr-3">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-stone-900 text-sm">{job.title}</h5>
                        {job.isUrgent && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-stone-600 mt-0.5">
                        <strong className="text-stone-900 font-bold">₹{job.dailyWage}/day</strong> • {job.locationArea}, {job.locationCity} • By{' '}
                        <span className="font-semibold text-stone-800">{job.employerName}</span> (📞 {job.employerPhone})
                      </p>
                      <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                        "{job.description}"
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a
                        href={`tel:${job.employerPhone}`}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                        title="Call Employer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => removeJobAdmin(job.id)}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete this Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BROADCAST NOTICE & PLATFORM STATS */}
          {activeTab === 'broadcast' && (
            <div className="space-y-4">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                  <span className="text-[11px] font-bold text-orange-800 uppercase block">Active Workers</span>
                  <div className="text-2xl font-black text-orange-950 mt-1">{workers.length}</div>
                  <span className="text-[10px] text-orange-700">Verified karigars</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800 uppercase block">Live Kaam (Jobs)</span>
                  <div className="text-2xl font-black text-amber-950 mt-1">{jobs.length}</div>
                  <span className="text-[10px] text-amber-700">Active postings</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total Hirings</span>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{hirings.length}</div>
                  <span className="text-[10px] text-emerald-700">Completed & active</span>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                  <span className="text-[11px] font-bold text-red-800 uppercase block">Disputes / Reports</span>
                  <div className="text-2xl font-black text-red-950 mt-1">{reports.length}</div>
                  <span className="text-[10px] text-red-700">{pendingReports.length} pending review</span>
                </div>
              </div>

              {/* Broadcast Notice to All App Users */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      Broadcast Notice to All Workers & Vendors (नोटिस जारी करें)
                    </h4>
                    <p className="text-xs text-stone-500">
                      Yahan se bheja gaya sandesh sabhi app users ko instant alert/notification ke roop mein dikhega.
                    </p>
                  </div>
                </div>

                {broadcastSent && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Notice safaltapoorvak sabhi users ke notification bar me bhej diya gaya hai!</span>
                  </div>
                )}

                <form onSubmit={handleSendBroadcast} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Notice Title (शीर्षक):
                    </label>
                    <input
                      type="text"
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="e.g. Suraksha Alert: Kisi ko bhi advance fee na dein!"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Message Content (पूरा संदेश):
                    </label>
                    <textarea
                      rows={3}
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      placeholder="e.g. Sabhi thekedaar aur majdoor dhyaan dein: payment hamesha kaam poora hone par dijiye. Koi samasya aane par Admin se 24x7 sahayata lein."
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Publish Broadcast to App</span>
                  </button>
                </form>
              </div>

              {/* Anti-fraud & Security Guidelines */}
              <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1.5">
                <h5 className="font-bold text-stone-800 uppercase tracking-wide text-[11px]">
                  🛡️ Admin Resolution SOP (मानक संचालन प्रक्रिया):
                </h5>
                <p>1. <strong>Payment Dispute:</strong> Pehle worker se kaam ka proof aur din confirm karein, phir thekedar ko WhatsApp/Call par UPI settlement karwayein.</p>
                <p>2. <strong>No-Show Complaint:</strong> Agar worker bina bataye absent hota hai, toh thekedar ko alternative verified worker suggest karein.</p>
                <p>3. <strong>Advance Fraud:</strong> Kisi bhi job listing me registration/interview fees maangne par turant listing delete karein aur user ko ban karein.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
