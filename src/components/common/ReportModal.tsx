import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, CheckCircle, ShieldAlert } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { reportTarget, setReportTarget, submitReport } = useApp();
  const [reason, setReason] = useState('Payment nahi kiya / Dihadi baaki hai (Payment Dispute)');
  const [details, setDetails] = useState('');
  const [disputeAmount, setDisputeAmount] = useState('');
  const [targetPhone, setTargetPhone] = useState('');
  const [targetName, setTargetName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!reportTarget) return null;

  const reasons = [
    'Payment nahi kiya / Dihadi baaki hai (Payment Dispute)',
    'Worker time par nahi aaya ya kaam chhod diya (No-show)',
    'Advance paise ya registration fee maang raha hai (Fraud Warning)',
    'Kaam/Job fake ya expired lag raha hai',
    'Phone pick nahi kar raha / Bad behavior / Gaali-galoch',
    'Galat location ya fake profile',
    'Overtime karwaya par paise nahi diye',
    'Koi aur dikkat (Other problem)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(
      reportTarget.id,
      reportTarget.title,
      reportTarget.type,
      reason,
      details,
      disputeAmount ? Number(disputeAmount) : undefined,
      targetPhone.trim() || undefined,
      targetName.trim() || reportTarget.title
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportTarget(null);
      setDetails('');
      setDisputeAmount('');
      setTargetPhone('');
      setTargetName('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
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
            <h4 className="font-bold text-stone-900 text-lg">Shikayat / Problem Darj Ho Gayi</h4>
            <p className="text-xs text-stone-600">
              Dihadi Admin Dispute Team is mamle ki janch karegi aur dono parties se sampark karke samadhan karegi.
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
                  Problem Report / Sahayata Desk
                </h3>
                <p className="text-xs text-stone-500 truncate max-w-[260px]">
                  Target: {reportTarget.title}
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 p-2.5 rounded-xl text-xs text-red-800 mb-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Admin Guarantee:</strong> Aapki samasya Admin Dashboard me darj ho jayegi aur hum turant call karke solution karwayenge.
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

              {/* Dispute Amount if applicable */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Dispute Rashi / Baki Paise (₹): (Optional)
                </label>
                <input
                  type="number"
                  value={disputeAmount}
                  onChange={(e) => setDisputeAmount(e.target.value)}
                  placeholder="e.g. 1500 (Agar payment ka masla hai)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-red-500 font-medium"
                />
              </div>

              {/* Target contact */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Thekedar / Worker Phone:
                  </label>
                  <input
                    type="text"
                    value={targetPhone}
                    onChange={(e) => setTargetPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Naam / Firm (Optional):
                  </label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    placeholder="Thekedar / Karigar ka naam"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Samasya ka pura vivaran likhein:
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Kya hua tha? Kab kaam kiya tha? Kitne paise baki hain?"
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-red-500 font-medium"
                  required
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
                  className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
                >
                  Submit to Admin
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
