import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Laptop,
} from 'lucide-react';

export const AdminLoginPortalModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    isAdminAuthenticated,
    loginAdmin,
    setIsDedicatedAdminPortal,
    setIsAdminOpen,
  } = useApp();

  const [emailOrId, setEmailOrId] = useState('shivomchauhan9@gmail.com');
  const [passcode, setPasscode] = useState('9876');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [portalLaunchMode, setPortalLaunchMode] = useState<'app' | 'modal'>('app');

  useEffect(() => {
    if (isAdminLoginModalOpen) {
      setErrorMsg('');
      setPasscode('9876'); // Pre-fill default master pin for convenient test
    }
  }, [isAdminLoginModalOpen]);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginAdmin(passcode, emailOrId);
      setIsSubmitting(false);

      if (res.success) {
        setIsAdminLoginModalOpen(false);
        if (portalLaunchMode === 'app') {
          setIsDedicatedAdminPortal(true);
          // Set hash to bookmarkable admin portal
          window.location.hash = 'admin-portal';
        } else {
          setIsAdminOpen(true);
        }
      } else {
        setErrorMsg(res.message);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-white animate-in zoom-in-95">
        {/* Top security header banner */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 p-5 relative">
          <button
            onClick={() => setIsAdminLoginModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white/90 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <ShieldAlert className="w-6 h-6 text-orange-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-200 bg-black/30 px-2 py-0.5 rounded-full">
                  Restricted Gateway
                </span>
                <span className="text-[10px] font-bold text-orange-100/80">
                  Level-1 Auth
                </span>
              </div>
              <h2 className="text-lg font-black text-white leading-tight mt-0.5">
                Dihadi Official Admin Portal
              </h2>
              <p className="text-xs text-orange-100/90 mt-0.5">
                समस्या निवारण एवं प्रबंधन डेस्क (Management Login)
              </p>
            </div>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="bg-stone-950 px-5 py-2.5 border-b border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-orange-400" />
            <span>Unauthorized access is strictly prohibited.</span>
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/70 border border-red-700/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Helper Banner */}
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-stone-300">
              <span className="font-bold text-orange-300">Master Admin Credentials:</span>
              <p className="text-[11px] text-stone-300 mt-0.5">
                Default Master PIN: <span className="font-mono font-bold text-white bg-black/40 px-1.5 py-0.5 rounded border border-orange-500/40">9876</span> (Pre-filled for app owner convenience).
              </p>
            </div>
          </div>

          {/* Email / Officer ID */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5 uppercase tracking-wide">
              Official Email / Officer ID
            </label>
            <input
              type="text"
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              placeholder="e.g. shivomchauhan9@gmail.com ya admin@dihadi.in"
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-orange-500 transition font-medium"
              required
            />
          </div>

          {/* Security PIN */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                Master Security PIN / Password
              </label>
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1"
              >
                {showPasscode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPasscode ? 'Chhupayein' : 'Dekhein'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                maxLength={20}
                placeholder="Enter 4-digit Master PIN (e.g. 9876)"
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm font-mono tracking-wider focus:outline-none focus:border-orange-500 transition pl-10"
                required
              />
              <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Portal Experience Option: Dedicated Separate App vs Overlay Modal */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5 uppercase tracking-wide">
              Portal Open Mode (अनुभव चुनें)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPortalLaunchMode('app')}
                className={`p-2.5 rounded-xl border text-left transition text-xs ${
                  portalLaunchMode === 'app'
                    ? 'border-orange-500 bg-orange-500/15 text-white font-bold'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-orange-400 font-bold text-xs mb-0.5">
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Alag App Portal</span>
                </div>
                <div className="text-[10px] text-stone-400 leading-tight">
                  Full standalone screen control room
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPortalLaunchMode('modal')}
                className={`p-2.5 rounded-xl border text-left transition text-xs ${
                  portalLaunchMode === 'modal'
                    ? 'border-orange-500 bg-orange-500/15 text-white font-bold'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-stone-200 font-bold text-xs mb-0.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Quick Popup Modal</span>
                </div>
                <div className="text-[10px] text-stone-400 leading-tight">
                  In-app overlay window
                </div>
              </button>
            </div>
          </div>

          {/* Remember session */}
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded accent-orange-600 w-4 h-4 bg-stone-950 border-stone-700"
              />
              <span>Remember Officer Session on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-950/50 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Login to Admin Portal (प्रवेश करें)</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-stone-950 border-t border-stone-800/80 text-[11px] text-stone-500 flex items-center justify-between">
          <span>Dihadi Grievance & Arbitration Cell</span>
          <span className="text-stone-400">Ver 2.4 Enterprise</span>
        </div>
      </div>
    </div>
  );
};
