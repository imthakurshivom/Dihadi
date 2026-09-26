import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserMode } from '../../types';
import {
  ShieldCheck,
  Phone,
  CheckCircle,
  Lock,
  X,
  FileBadge,
  ArrowRight,
  Sparkles,
  RefreshCw,
  User as UserIcon,
  Mail,
  Check,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    loginWithOtp,
    loginWithGoogle,
    verifyAadhaar,
    setUserMode,
    t,
  } = useApp();

  // Active tab: 'google' | 'phone'
  const [activeTab, setActiveTab] = useState<'google' | 'phone'>('google');
  // Sub-step for phone flow: 'input' | 'otp'
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  // General step: 'auth' | 'kyc' | 'success'
  const [step, setStep] = useState<'auth' | 'kyc' | 'success'>('auth');

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('98125 12345');
  const [fullName, setFullName] = useState('Suresh Kumar Mistri');
  const [googleEmail, setGoogleEmail] = useState('shivomchauhan9@gmail.com');
  const [googleName, setGoogleName] = useState('Shivom Chauhan');
  const [selectedRole, setSelectedRole] = useState<UserMode>('worker');
  const [otpInput, setOtpInput] = useState('1234');
  const [otpTimer, setOtpTimer] = useState(30);
  const [aadhaarInput, setAadhaarInput] = useState('5432 8901 2345');
  const [aadhaarSuccess, setAadhaarSuccess] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethodSuccess, setLoginMethodSuccess] = useState<'google' | 'phone'>('google');

  // Reset states when opening
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('auth');
      setPhoneStep('input');
      setOtpInput('1234');
      setOtpError('');
      setAadhaarSuccess(false);
    }
  }, [isAuthModalOpen]);

  // OTP Timer countdown
  useEffect(() => {
    let interval: any;
    if (phoneStep === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneStep, otpTimer]);

  if (!isAuthModalOpen) return null;

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle(
        googleName || 'Shivom Chauhan',
        googleEmail || 'shivomchauhan9@gmail.com',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        selectedRole
      );
      setUserMode(selectedRole);
      setIsLoading(false);
      setLoginMethodSuccess('google');
      setStep('kyc');
    }, 600);
  };

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length >= 10) {
      setPhoneStep('otp');
      setOtpInput('1234'); // Pre-fill 1234 for seamless test
      setOtpTimer(30);
      setOtpError('');
    } else {
      setOtpError('Kripya 10-digit ka valid mobile number dalein');
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length >= 4) {
      setIsLoading(true);
      setTimeout(() => {
        loginWithOtp(phoneNumber, otpInput, fullName || 'Suresh Kumar', selectedRole);
        setUserMode(selectedRole);
        setIsLoading(false);
        setLoginMethodSuccess('phone');
        setStep('kyc');
      }, 500);
    } else {
      setOtpError('Kripya 4-digit ka OTP darj karein');
    }
  };

  // Handle Aadhaar verification
  const handleVerifyAadhaar = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarInput.replace(/\s/g, '').length >= 12) {
      verifyAadhaar(aadhaarInput);
      setAadhaarSuccess(true);
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: AUTH SELECTION (GOOGLE OR PHONE) */}
        {step === 'auth' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-md shadow-orange-500/20">
                <img
                  src="/pwa-192x192.png"
                  alt="Dihadi"
                  className="w-full h-full rounded-2xl object-cover bg-white"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900 leading-tight">
                  Dihadi Par Login / Register
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Google ya Mobile Number se turant shuru karein
                </p>
              </div>
            </div>

            {/* TAB TOGGLE: GOOGLE VS PHONE */}
            <div className="p-1 bg-stone-100 rounded-2xl grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('google');
                  setOtpError('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'google'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('phone');
                  setOtpError('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'phone'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-orange-600" />
                <span>Phone / OTP Login</span>
              </button>
            </div>

            {/* ROLE SELECTOR (Both modes need to know their intent) */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Aap Dihadi par kya karna chahte hain?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('worker')}
                  className={`p-3 rounded-2xl border text-left transition ${
                    selectedRole === 'worker'
                      ? 'border-orange-500 bg-orange-50/90 text-orange-950 font-bold shadow-xs ring-1 ring-orange-500'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-sm font-black mb-0.5">👷 Majdoor / Karigar</div>
                  <div className="text-[11px] text-stone-500 font-medium">Kaam chahiye</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('employer')}
                  className={`p-3 rounded-2xl border text-left transition ${
                    selectedRole === 'employer'
                      ? 'border-amber-500 bg-amber-50/90 text-amber-950 font-bold shadow-xs ring-1 ring-amber-500'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-sm font-black mb-0.5">🏗️ Thekedaar / Malik</div>
                  <div className="text-[11px] text-stone-500 font-medium">Majdoor chahiye</div>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: GOOGLE SIGN-IN */}
            {activeTab === 'google' && (
              <div className="space-y-3 pt-1">
                {/* Google Account Profile Card */}
                <div className="border border-stone-200 rounded-2xl p-3.5 bg-stone-50/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Google Account Se Judi Jankari
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                      1-Tap Fast Login
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80"
                      alt="Google User"
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-900 truncate">
                        {googleName}
                      </p>
                      <p className="text-xs text-stone-500 truncate flex items-center gap-1">
                        <Mail className="w-3 h-3 text-stone-400" />
                        {googleEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl border-2 border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm shadow-sm flex items-center justify-center gap-3 transition active:scale-98 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 text-stone-600 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>
                    {isLoading ? 'Google Se Connect Ho Raha Hai...' : 'Continue with Google'}
                  </span>
                </button>

                {/* Option to switch or use Phone */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('phone')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                  >
                    Ya Mobile Number & OTP se login karein →
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PHONE NUMBER & OTP */}
            {activeTab === 'phone' && (
              <div className="space-y-3 pt-1">
                {phoneStep === 'input' && (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Aapka Pura Naam
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Jaise: Ramesh Mistri"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Mobile Number
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

                    {otpError && (
                      <p className="text-xs text-red-600 font-medium">{otpError}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/30 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>OTP Bhejein (Send OTP)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="pt-1 text-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('google')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
                      >
                        ← Ya Google Account se login karein
                      </button>
                    </div>
                  </form>
                )}

                {/* OTP SUB-STEP */}
                {phoneStep === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl text-xs text-orange-900">
                      <div className="flex items-center justify-between font-bold">
                        <span>OTP Sent to +91 {phoneNumber}</span>
                        <button
                          type="button"
                          onClick={() => setPhoneStep('input')}
                          className="text-[11px] text-orange-700 underline"
                        >
                          Badlein
                        </button>
                      </div>
                      <p className="text-[11px] text-orange-700 mt-0.5">
                        Test demo OTP <strong className="font-bold underline">1234</strong> auto-fill hai.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        4-Digit OTP Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => {
                          setOtpInput(e.target.value);
                          setOtpError('');
                        }}
                        className="w-full tracking-widest text-center text-2xl font-black py-3 rounded-2xl border-2 border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
                        placeholder="1234"
                        required
                      />
                      {otpError && (
                        <p className="text-xs text-red-600 mt-1 text-center font-medium">
                          {otpError}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                      <span>OTP nahi mila?</span>
                      {otpTimer > 0 ? (
                        <span className="font-medium text-stone-400">
                          Resend in {otpTimer}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setOtpTimer(30)}
                          className="font-bold text-orange-600 hover:text-orange-700 underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setPhoneStep('input')}
                        className="w-1/3 py-3 rounded-2xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50"
                      >
                        Pichhe
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-2/3 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/30 active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span>Verify & Login</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Trust Footer */}
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-500 flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <span>
                Aapka data surakshit hai. Kisi ko bina ijazat personal number nahi dikhaya jayega.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: OPTIONAL AADHAAR KYC / VERIFIED BADGE */}
        {step === 'kyc' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileBadge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900 leading-tight">
                  Login Safal! Aadhaar Verification
                </h3>
                <p className="text-xs text-stone-500">
                  {loginMethodSuccess === 'google'
                    ? 'Google Account se safaltapoorvak login hua'
                    : 'Mobile OTP se safaltapoorvak login hua'}
                </p>
              </div>
            </div>

            {aadhaarSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-base">Aadhaar Verified!</h4>
                <p className="text-xs text-stone-500">
                  Aapke profile par Verified Green Badge lag gaya hai.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVerifyAadhaar} className="space-y-4 mt-3">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-800">
                  <p className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Govt. ID Verification (Recommended)
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Verified badge se contractors aur employers ka vishwas 3x badhta hai.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Aadhaar Card Number (12 Digits)
                  </label>
                  <input
                    type="text"
                    value={aadhaarInput}
                    onChange={(e) => setAadhaarInput(e.target.value)}
                    placeholder="5432 8901 2345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold tracking-wider focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Demo ke liye koi bhi 12-digit number chalega.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="w-1/2 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
                  >
                    Baad Me Karein (Skip)
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition cursor-pointer"
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
