import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserMode } from '../../types';
import { ShieldCheck, Phone, CheckCircle, Lock, X, FileBadge, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    loginWithOtp,
    verifyAadhaar,
    setUserMode,
    t,
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'kyc'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('98125 12345');
  const [fullName, setFullName] = useState('Suresh Kumar Mistri');
  const [selectedRole, setSelectedRole] = useState<UserMode>('worker');
  const [otpInput, setOtpInput] = useState('');
  const [aadhaarInput, setAadhaarInput] = useState('5432 8901 2345');
  const [aadhaarSuccess, setAadhaarSuccess] = useState(false);
  const [otpError, setOtpError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length >= 10) {
      setStep('otp');
      setOtpInput('1234'); // Quick fill convenience
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length >= 4) {
      loginWithOtp(phoneNumber, otpInput, fullName, selectedRole);
      setUserMode(selectedRole);
      setStep('kyc');
    } else {
      setOtpError('Kripya 4-digit ka OTP darj karein');
    }
  };

  const handleVerifyAadhaar = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarInput.replace(/\s/g, '').length >= 12) {
      verifyAadhaar(aadhaarInput);
      setAadhaarSuccess(true);
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'phone' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 leading-tight">
                  Dihadi Login / Register
                </h3>
                <p className="text-xs text-stone-500">Sirf 30 seconds me account banayein</p>
              </div>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Aapka Pura Naam
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jaise: Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Mobile Number (OTP aayega)
                </label>
                <div className="flex rounded-xl border border-stone-300 overflow-hidden focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
                  <span className="bg-stone-100 px-3 py-2.5 text-sm font-bold text-stone-700 border-r border-stone-200 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98123 45678"
                    className="w-full px-3 py-2.5 text-sm font-semibold text-stone-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Aap Dihadi par kya hain?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('worker')}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedRole === 'worker'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 font-bold shadow-xs'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-base mb-1">👷 Majdoor / Karigar</div>
                    <div className="text-[11px] text-stone-500">Kaam dhundhna hai</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('employer')}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedRole === 'employer'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-base mb-1">🏗️ Thekedaar / Malik</div>
                    <div className="text-[11px] text-stone-500">Majdoor chahiye</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-600/30 hover:bg-orange-700 active:scale-98 transition flex items-center justify-center gap-1.5"
              >
                <span>OTP Bhejein</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-500 flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <span>Aapka phone number surakshit hai aur bina ijazat kisi ko nahi dikhega.</span>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2 font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">OTP Enter Karein</h3>
              <p className="text-xs text-stone-500 mt-1">
                +91 {phoneNumber} par 4-digit ka code bheja gaya hai
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => {
                    setOtpInput(e.target.value);
                    setOtpError('');
                  }}
                  className="w-full tracking-widest text-center text-2xl font-bold py-3 rounded-2xl border-2 border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
                  placeholder="1234"
                  required
                />
                {otpError && <p className="text-xs text-red-600 mt-1 text-center">{otpError}</p>}
                <p className="text-[11px] text-stone-400 text-center mt-1">
                  (Demo OTP: <strong className="text-stone-700">1234</strong> auto-filled)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-600/30 hover:bg-orange-700 active:scale-98 transition"
              >
                Verify & Aage Badhein
              </button>
            </form>
          </div>
        )}

        {step === 'kyc' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileBadge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 leading-tight">
                  Aadhaar / ID Verification
                </h3>
                <p className="text-xs text-stone-500">Verified badge se 3x zyada kaam milta hai</p>
              </div>
            </div>

            {aadhaarSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-stone-900 text-base">Aadhaar Verified!</h4>
                <p className="text-xs text-stone-500">
                  Aapke profile par Verified Green Badge lag gaya hai.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVerifyAadhaar} className="space-y-4 mt-3">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-800">
                  <p className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Govt. ID Verification (Optional but Recommended)
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Dihadi platform par vishwas badhane ke liye apna 12-digit Aadhaar number darj karein.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Aadhaar Card Number
                  </label>
                  <input
                    type="text"
                    value={aadhaarInput}
                    onChange={(e) => setAadhaarInput(e.target.value)}
                    placeholder="5432 8901 2345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold tracking-wider focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Demo ke liye koi bhi 12-digit number chalega.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="w-1/2 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50"
                  >
                    Baad Me Karein (Skip)
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/30 hover:bg-emerald-700"
                  >
                    Verify Karein
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
