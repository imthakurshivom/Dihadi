import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, CheckCircle, ShieldAlert } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { reportTarget, setReportTarget, submitReport } = useApp();
  const [reason, setReason] = useState('Advance paise maang raha hai (Advance fee scam)');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!reportTarget) return null;

  const reasons = [
    'Advance paise ya registration fee maang raha hai (Fraud Warning)',
    'Kaam/Job fake ya expired lag raha hai',
    'Phone pick nahi kar raha / Bad behavior',
    'Galat location ya fake profile',
    'Payment nahi kiya kaam ke baad',
    'Koi aur dikkat (Other)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(reportTarget.id, reportTarget.title, reportTarget.type, reason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportTarget(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setReportTarget(null)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-stone-900 text-lg">Report Darj Ho Gayi</h4>
            <p className="text-xs text-stone-600">
              Dihadi Suraksha Team is listing ki janch karegi. Surakshit rehne ke liye dhanyawad.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-red-600">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 leading-tight">
                  Report Karein / Shikayat Darj Karein
                </h3>
                <p className="text-xs text-stone-500 truncate max-w-[260px]">
                  Target: {reportTarget.title}
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 p-2.5 rounded-xl text-xs text-red-800 mb-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Zaroori Note:</strong> Dihadi platform par kabhi kisi ko advance entry ya appointment fees na dein.
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Karan (Reason) Chunein:
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-medium focus:outline-none focus:border-red-500"
                >
                  {reasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Kuchh aur details likhein (Optional):
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Jaise: Call karne par ₹500 advance maang raha tha..."
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportTarget(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow hover:bg-red-700 active:scale-98"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
