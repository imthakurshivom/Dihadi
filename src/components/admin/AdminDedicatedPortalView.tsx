import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  Briefcase,
  Building,
  Phone,
  MessageCircle,
  Megaphone,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Lock,
  LogOut,
  ArrowLeft,
  KeyRound,
  FileText,
  DollarSign,
  AlertCircle,
  History,
  Check,
  X,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { ReportItem } from '../../types';

export const AdminDedicatedPortalView: React.FC = () => {
  const {
    adminSession,
    logoutAdmin,
    setIsDedicatedAdminPortal,
    adminPasscode,
    updateAdminPasscode,
    jobs,
    workers,
    reports,
    toggleWorkerVerificationAdmin,
    removeJobAdmin,
    resolveReportAdmin,
    updateReportStatus,
    toggleEmployerVerificationAdmin,
    broadcastNotice,
    adminAuditLogs,
    addAdminAuditLog,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'disputes' | 'employers' | 'workers' | 'jobs' | 'broadcast' | 'audit' | 'settings'>('disputes');
  const [disputeFilter, setDisputeFilter] = useState<'all' | 'worker' | 'employer' | 'job' | 'pending' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resolutionInput, setResolutionInput] = useState<{ id: string; note: string; action: string } | null>(null);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Settings states
  const [newPin, setNewPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');

  // Employers derivation
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
  const inProgressReports = reports.filter((r) => r.status === 'in_progress');
  const resolvedReports = reports.filter((r) => r.status === 'resolved');

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
      const matchDetails = r.details?.toLowerCase().includes(q);
      const matchReporter = r.reporterName?.toLowerCase().includes(q);
      return matchTarget || matchReason || matchDetails || matchReporter;
    }
    return true;
  });

  const handleResolveSubmit = (reportId: string) => {
    if (!resolutionInput) return;
    updateReportStatus(
      reportId,
      'resolved',
      resolutionInput.note || 'Resolved by Grievance Officer after telephonic mediation.',
      resolutionInput.action || 'Mediation completed'
    );
    addAdminAuditLog(
      'Dispute Resolved',
      `Report #${reportId.slice(-6)} resolved. Note: ${resolutionInput.note || 'Mediation successful'}`
    );
    setResolutionInput(null);
  };

  const handleBroadcastSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    broadcastNotice(broadcastTitle, broadcastMessage);
    addAdminAuditLog('Emergency Broadcast', `Title: ${broadcastTitle}`);
    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSuccess(false), 3500);
  };

  const handlePinUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      updateAdminPasscode(newPin.trim());
      setPinChangeMsg('सुरक्षा पिन सफलतापूर्वक अपडेट हो गया!');
      setNewPin('');
      setTimeout(() => setPinChangeMsg(''), 4000);
    } else {
      setPinChangeMsg('कृपया कम से कम 4 अंकों का पिन दर्ज करें');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      {/* Top Standalone Header */}
      <header className="bg-stone-900/90 backdrop-blur-md border-b border-stone-800 sticky top-0 z-40 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand & Officer info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-950/40 font-black">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white tracking-wide">
                  Dihadi Admin & Grievance Portal
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE ENCLAVE
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Officer: <span className="text-orange-300 font-bold">{adminSession?.officerName || 'Shivom Chauhan'}</span> • Role: <span className="text-stone-300">{adminSession?.role || 'Super Admin'}</span>
              </p>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2">
            {/* Switch to Public App */}
            <button
              onClick={() => {
                setIsDedicatedAdminPortal(false);
                window.location.hash = '';
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition active:scale-95 cursor-pointer border border-stone-700"
              title="Return to the public worker / contractor view"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-stone-400" />
              <span>Public App Dekhein</span>
            </button>

            {/* Logout Admin */}
            <button
              onClick={() => {
                logoutAdmin();
                window.location.hash = '';
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/40 text-xs font-bold transition active:scale-95 cursor-pointer"
              title="Lock Admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Portal Body */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 flex-1 flex flex-col gap-6">
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Unresolved Disputes
              </span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-red-400">{pendingReports.length}</span>
              <span className="text-[11px] text-stone-400">Needs action</span>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Total Solved
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{resolvedReports.length}</span>
              <span className="text-[11px] text-stone-400">Resolved cases</span>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Active Contractors
              </span>
              <Building className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-400">{employersList.length}</span>
              <span className="text-[11px] text-stone-400">In directory</span>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Registered Workers
              </span>
              <Users className="w-4 h-4 text-orange-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-orange-400">{workers.length}</span>
              <span className="text-[11px] text-stone-400">With KYC badges</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'disputes'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Disputes & Grievance Desk</span>
            {pendingReports.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {pendingReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('employers')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'employers'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Contractors & Vendors ({employersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'workers'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Workers & Aadhaar KYC ({workers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Jobs Moderation ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'broadcast'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Emergency Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Security PIN Settings</span>
          </button>
        </div>

        {/* Tab 1: DISPUTES & GRIEVANCE DESK */}
        {activeTab === 'disputes' && (
          <div className="space-y-4">
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900 p-3 rounded-2xl border border-stone-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Thekedar, worker, ticket reason se search karein..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(
                  [
                    { id: 'all', label: 'Sabhi Tickets' },
                    { id: 'pending', label: 'Likhit / Pending' },
                    { id: 'worker', label: 'Worker ne ki' },
                    { id: 'employer', label: 'Contractor ne ki' },
                    { id: 'resolved', label: 'Resolved' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setDisputeFilter(f.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      disputeFilter === f.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket items */}
            {filteredReports.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-400">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">Koi Samasya / Ticket Nahi Mili</h3>
                <p className="text-xs text-stone-400 mt-1">Sabhi tickets resolve ho chuki hain ya filter match nahi hua.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className={`bg-stone-900 border rounded-2xl p-4 lg:p-5 transition ${
                      report.status === 'pending'
                        ? 'border-red-900/60 shadow-lg shadow-red-950/20'
                        : report.status === 'in_progress'
                        ? 'border-amber-800/60'
                        : 'border-stone-800 opacity-90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              report.status === 'pending'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : report.status === 'in_progress'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            ● {report.status.toUpperCase()}
                          </span>

                          <span className="text-[10px] font-bold text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full">
                            Category: {report.reason}
                          </span>

                          {report.disputeAmount && report.disputeAmount > 0 && (
                            <span className="text-[10px] font-black bg-red-900/60 text-red-200 border border-red-700/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <DollarSign className="w-3 h-3" /> ₹{report.disputeAmount} Dispute Amount
                            </span>
                          )}

                          <span className="text-[10px] text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {report.timestamp}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white mt-2">
                          Target: <span className="text-orange-400">{report.targetTitle}</span> ({report.targetType})
                        </h3>

                        <p className="text-xs text-stone-300 mt-1 bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                          {report.details}
                        </p>
                      </div>

                      {/* Direct Communication Buttons */}
                      <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                        {report.targetPhone && (
                          <a
                            href={`tel:${report.targetPhone.replace(/\s+/g, '')}`}
                            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Target ({report.targetPhone})</span>
                          </a>
                        )}

                        {report.targetPhone && (
                          <a
                            href={`https://wa.me/${report.targetPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Namaste, Dihadi Grievance Desk se sampark kar rahe hain. Aapki report #${report.id.slice(-5)} ke bare mein bat cheet karni hai.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Target</span>
                          </a>
                        )}

                        {report.reporterPhone && (
                          <a
                            href={`tel:${report.reporterPhone.replace(/\s+/g, '')}`}
                            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Reporter ({report.reporterName || report.reporterPhone})</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Resolution details if already solved */}
                    {report.status === 'resolved' && (
                      <div className="mt-3 pt-3 border-t border-stone-800 text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-900/40">
                        <span className="font-bold">✓ Resolution Note:</span> {report.resolutionNote || 'Resolved by Grievance Officer.'}
                        {report.actionTaken && (
                          <div className="text-[11px] text-emerald-400/80 mt-0.5">
                            Action Taken: {report.actionTaken}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action form if pending or in progress */}
                    {report.status !== 'resolved' && (
                      <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateReportStatus(report.id, 'in_progress', 'Officer investigating with both parties.')}
                            className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 text-xs font-bold transition active:scale-95"
                          >
                            Mark In Investigation
                          </button>

                          <button
                            onClick={() =>
                              setResolutionInput(
                                resolutionInput?.id === report.id
                                  ? null
                                  : { id: report.id, note: '', action: 'Payment Released & Confirmed' }
                              )
                            }
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Samasya Solve Karein (Resolve)</span>
                          </button>

                          <button
                            onClick={() => updateReportStatus(report.id, 'dismissed', 'Found false or already resolved outside.')}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-xs font-bold transition"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Inline Resolution Box */}
                    {resolutionInput && resolutionInput.id === report.id && (
                      <div className="mt-3 p-3 rounded-xl bg-stone-950 border border-emerald-500/40 space-y-2 animate-in fade-in">
                        <label className="block text-xs font-bold text-emerald-300">
                          Samadhan ka Vivran (Resolution Notes for Records):
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Contractor ne worker ko Google Pay se ₹500 bheja, dono santusht hain."
                          value={resolutionInput.note}
                          onChange={(e) =>
                            setResolutionInput({ ...resolutionInput, note: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setResolutionInput(null)}
                            className="px-3 py-1 rounded-lg text-xs text-stone-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleResolveSubmit(report.id)}
                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                          >
                            Confirm Ticket Resolution ✓
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: CONTRACTORS & VENDORS */}
        {activeTab === 'employers' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employersList.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{emp.name}</h3>
                          {emp.isVerified && (
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" /> Verified Contractor
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5 font-mono">{emp.phone}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-400">★ {emp.rating}</span>
                        <div className="text-[10px] text-stone-400">{emp.jobsCount} Jobs Posted</div>
                      </div>
                    </div>

                    {emp.disputesCount > 0 && (
                      <div className="mt-3 p-2 bg-red-950/40 border border-red-800/40 rounded-xl text-red-300 text-xs flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        <span>Is vendor ke khilaf <strong>{emp.disputesCount} complaints</strong> darj hain!</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${emp.phone.replace(/\s+/g, '')}`}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </a>
                      <a
                        href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-xs font-bold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        toggleEmployerVerificationAdmin(emp.name);
                        addAdminAuditLog(
                          'Contractor Verification Toggled',
                          `${emp.name} verification status changed to ${!emp.isVerified}`
                        );
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        emp.isVerified
                          ? 'bg-amber-600/20 text-amber-300 border border-amber-600/40 hover:bg-amber-600/30'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {emp.isVerified ? 'Remove Verified Badge' : '✓ Give Verified Badge'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: WORKERS & AADHAAR KYC */}
        {activeTab === 'workers' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workers.map((w) => (
                <div
                  key={w.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{w.name}</h3>
                          {w.isVerified && (
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" /> Aadhaar KYC Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {w.categoryName} • {w.city}, {w.area}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400">₹{w.dailyWageMin} - ₹{w.dailyWageMax}/din</span>
                        <div className="text-[10px] text-stone-400">★ {w.rating} ({w.completedJobsCount} Kaam)</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${w.phone.replace(/\s+/g, '')}`}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Call Worker
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        toggleWorkerVerificationAdmin(w.id);
                        addAdminAuditLog(
                          'Worker Verification Toggled',
                          `${w.name} verification status changed to ${!w.isVerified}`
                        );
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        w.isVerified
                          ? 'bg-amber-600/20 text-amber-300 border border-amber-600/40 hover:bg-amber-600/30'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {w.isVerified ? 'Revoke KYC Badge' : '✓ Approve Aadhaar KYC'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: JOBS MODERATION */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-white text-sm">{job.title}</h3>
                        <p className="text-xs text-stone-400 mt-0.5">
                          By: <strong className="text-stone-200">{job.employerName}</strong> • {job.locationCity}, {job.locationArea}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-orange-400">₹{job.dailyWage}/din</span>
                    </div>

                    <p className="text-xs text-stone-300 mt-2 line-clamp-2">{job.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">Required: {job.workersRequired} workers</span>
                    <button
                      onClick={() => {
                        removeJobAdmin(job.id);
                        addAdminAuditLog('Job Removed', `Listing "${job.title}" removed by admin.`);
                      }}
                      className="px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/40 text-xs font-bold transition active:scale-95"
                    >
                      Hataayein (Remove Spam / Fake)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: EMERGENCY BROADCAST */}
        {activeTab === 'broadcast' && (
          <div className="max-w-2xl mx-auto w-full bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Emergency Broadcast Board (सूचना प्रसार)</h3>
                <p className="text-xs text-stone-400">Sabhi workers aur thekedaron ke mobile par tatkal notification bhejein</p>
              </div>
            </div>

            {broadcastSuccess && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-600/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Notice sabhi upbhoktaon tak safalta-purvak bhej diya gaya hai!</span>
              </div>
            )}

            <form onSubmit={handleBroadcastSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Notice Title (शीर्षक)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dihaadi payment dispute redressal helpline chalu hai"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Notice Sandesh (विस्तृत सन्देश)
                </label>
                <textarea
                  rows={4}
                  placeholder="Sabhi shramik dhyan dein: Kisi bhi thekedar se payment samasya ho to tatkal Admin desk par complain karein..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                Broadcast Notice Sabhi Ko Bhejein 📢
              </button>
            </form>
          </div>
        )}

        {/* Tab 6: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-orange-400" />
              <span>Grievance Officer Activity & Audit Trail</span>
            </h3>

            <div className="divide-y divide-stone-800">
              {adminAuditLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-xs text-white">{log.action}</span>
                    <p className="text-xs text-stone-400 mt-0.5">{log.details}</p>
                    <span className="text-[10px] text-stone-500">By: {log.officerName}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 self-start sm:self-center font-mono">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: SECURITY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-md mx-auto w-full bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Security & Master PIN (पासकोड बदलें)</h3>
                <p className="text-xs text-stone-400">Admin portal ko surakshit rakhne ke liye apna PIN badlein</p>
              </div>
            </div>

            {pinChangeMsg && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-600/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{pinChangeMsg}</span>
              </div>
            )}

            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-400 mb-4">
              Current Master PIN: <strong className="text-orange-300 font-mono">{adminPasscode}</strong>
            </div>

            <form onSubmit={handlePinUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Naya 4-Digit Master PIN Banayein
                </label>
                <input
                  type="password"
                  maxLength={10}
                  placeholder="e.g. 5432"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-100 font-mono focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                Update Master PIN (पिन सुरक्षित करें)
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
