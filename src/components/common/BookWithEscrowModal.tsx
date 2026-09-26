import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  X,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Smartphone,
  CreditCard,
  Building,
  KeyRound,
} from 'lucide-react';

export const BookWithEscrowModal: React.FC = () => {
  const {
    isEscrowBookingModalOpen,
    setIsEscrowBookingModalOpen,
    selectedWorkerForEscrow,
    setSelectedWorkerForEscrow,
    selectedJobIdForEscrow,
    bookWorkerWithEscrow,
    setActiveTab,
    setActiveConversationId,
    startOrGetConversation,
    currentUser,
  } = useApp();

  const [days, setDays] = useState(1);
  const [scheduledDate, setScheduledDate] = useState('Kal Subah (Tomorrow 8:30 AM)');
  const [dailyWage, setDailyWage] = useState(
    selectedWorkerForEscrow ? selectedWorkerForEscrow.dailyWageMin : 700
  );
  const [workNotes, setWorkNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedHiring, setBookedHiring] = useState<any>(null);

  if (!isEscrowBookingModalOpen || !selectedWorkerForEscrow) return null;

  const totalAmount = (Number(dailyWage) || selectedWorkerForEscrow.dailyWageMin) * days;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const hiring = bookWorkerWithEscrow({
        workerId: selectedWorkerForEscrow.id,
        jobId: selectedJobIdForEscrow,
        wage: Number(dailyWage) || selectedWorkerForEscrow.dailyWageMin,
        days,
        scheduledDate,
        notes: workNotes,
      });

      setBookedHiring(hiring);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleClose = () => {
    setIsEscrowBookingModalOpen(false);
    setSelectedWorkerForEscrow(null);
    setIsSuccess(false);
    setBookedHiring(null);
  };

  const handleGoToChat = () => {
    const convId = startOrGetConversation(selectedWorkerForEscrow.id, currentUser.id);
    setActiveConversationId(convId);
    setActiveTab('chat');
    handleClose();
  };

  const handleGoToDashboard = () => {
    setActiveTab('dashboard');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden text-stone-900 animate-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner flex-shrink-0">
              <Lock className="w-6 h-6 text-orange-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/30 text-orange-200 px-2 py-0.5 rounded-full">
                  100% Protected
                </span>
                <span className="text-[10px] font-bold text-orange-100 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" /> Dihadi Suraksha
                </span>
              </div>
              <h2 className="text-lg font-black text-white leading-tight mt-0.5">
                Worker Booking & Payment Lock
              </h2>
              <p className="text-xs text-orange-100 mt-0.5">
                Kaam complete hone tak payment surakshit lock rahegi
              </p>
            </div>
          </div>
        </div>

        {/* Success View */}
        {isSuccess && bookedHiring ? (
          <div className="p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                Booking Confirmed & Payment Locked 🔒
              </span>
              <h3 className="text-xl font-black text-stone-900 mt-2">
                ₹{bookedHiring.amount} Dihadi Suraksha me Lock Ho Gaye!
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                Worker <strong>{bookedHiring.workerName}</strong> ko booking notice bhej diya gaya hai. Jab worker kaam pura kare, tab app se <strong>"Done"</strong> dabayein tabhi payment transfer hogi.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Escrow Transaction ID:</span>
                <span className="font-mono font-bold text-stone-800">{bookedHiring.escrowTransactionId}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Scheduled Work Time:</span>
                <span className="font-bold text-stone-800">{bookedHiring.scheduledDate}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Total Locked Amount:</span>
                <span className="font-bold text-emerald-700 text-sm">₹{bookedHiring.amount}</span>
              </div>
              <div className="flex justify-between text-stone-500 pt-2 border-t border-stone-200">
                <span>Completion OTP (Worker ko kaam shuru par dikhayein):</span>
                <span className="font-mono font-black text-orange-600 text-sm bg-orange-100 px-2 py-0.5 rounded">
                  {bookedHiring.completionOtp}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleGoToChat}
                className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                Worker se Chat Karein 💬
              </button>
              <button
                onClick={handleGoToDashboard}
                className="py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                Dashboard me Dekhein →
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleConfirmBooking} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Worker Summary Card */}
            <div className="flex items-center gap-3 p-3 bg-orange-50/70 border border-orange-200/80 rounded-2xl">
              <img
                src={selectedWorkerForEscrow.avatar}
                alt={selectedWorkerForEscrow.name}
                className="w-12 h-12 rounded-xl object-cover border border-orange-300"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-stone-900 truncate">
                    {selectedWorkerForEscrow.name}
                  </h4>
                  {selectedWorkerForEscrow.isVerified && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600">
                  {selectedWorkerForEscrow.categoryName} • ★ {selectedWorkerForEscrow.rating} ({selectedWorkerForEscrow.completedJobsCount} Kaam)
                </p>
                <p className="text-[11px] text-orange-700 font-bold">
                  Standard Rate: ₹{selectedWorkerForEscrow.dailyWageMin} - ₹{selectedWorkerForEscrow.dailyWageMax}/din
                </p>
              </div>
            </div>

            {/* How Escrow Works (Trust Banner) */}
            <div className="bg-stone-900 text-white rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <Shield className="w-4 h-4" />
                <span>Dihadi Escrow Lock Kaise Kaam Karta Hai?</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-stone-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-orange-400 font-bold">1.</span>
                  <span>Aap payment abhi lock karenge, par paise worker ko <strong>kaam pura hone ke baad hi</strong> milenge.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-orange-400 font-bold">2.</span>
                  <span>Worker ko payment lock hone ka guarantee notification jayega, isliye wo <strong>samay par aayega</strong>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-orange-400 font-bold">3.</span>
                  <span>Jab aap app se <strong>"Kaam Done & Release"</strong> dabayenge, tabhi payment transfer hogi.</span>
                </li>
              </ul>
            </div>

            {/* Booking Schedule & Wage Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Kaam ki Date & Time
                </label>
                <select
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="Kal Subah (Tomorrow 8:30 AM)">Kal Subah (Tomorrow 8:30 AM)</option>
                  <option value="Aaj Dopahar (Today 1:00 PM)">Aaj Dopahar (Today 1:00 PM)</option>
                  <option value="Somwar Subah (Monday 8:30 AM)">Somwar Subah (Monday 8:30 AM)</option>
                  <option value="Agle 2 Din me (In next 2 days)">Agle 2 Din me (Flexible)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Kitne Din ka Kaam?
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDays(d)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        days === d
                          ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {d} Din
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Wage Negotiated / Agreed */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Tai Dihadi (Agreed Daily Wage per Day)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-stone-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={dailyWage}
                  onChange={(e) => setDailyWage(Number(e.target.value))}
                  min={300}
                  max={10000}
                  className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            {/* Work description / notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Kaam ka Vivran (Site Location & Notes)
              </label>
              <input
                type="text"
                placeholder="e.g. Sector 14, Plot 42 - Chinai & plaster ka kaam"
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Lock Payment Method (पेमेंट का माध्यम)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    paymentMethod === 'upi'
                      ? 'border-orange-500 bg-orange-50 text-orange-800 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                  <span className="text-[11px] block">UPI / GPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50 text-orange-800 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <span className="text-[11px] block">Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    paymentMethod === 'netbanking'
                      ? 'border-orange-500 bg-orange-50 text-orange-800 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  <Building className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  <span className="text-[11px] block">NetBanking</span>
                </button>
              </div>

              {paymentMethod === 'upi' && (
                <div className="flex items-center gap-2 mt-2">
                  {(['gpay', 'phonepe', 'paytm'] as const).map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiApp(app)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold capitalize transition ${
                        upiApp === app
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-stone-200 text-stone-500 hover:bg-stone-50'
                      }`}
                    >
                      {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : 'Paytm'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Total Calculation & Lock Banner */}
            <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200 space-y-1.5">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Dihadi Rate (₹{dailyWage} x {days} Din):</span>
                <span className="font-bold text-stone-900">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-600">
                <span>Dihadi Escrow Protection Fee:</span>
                <span className="font-bold text-emerald-600">FREE (₹0)</span>
              </div>
              <div className="flex justify-between text-sm font-black text-stone-900 pt-1.5 border-t border-stone-200">
                <span>Total Amount to Lock:</span>
                <span className="text-orange-600 text-base">₹{totalAmount}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-950/20 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Locking ₹{totalAmount} in Dihadi Suraksha...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Lock ₹{totalAmount} & Book {selectedWorkerForEscrow.name.split(' ')[0]} 🔒</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
