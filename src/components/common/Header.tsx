import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  MapPin,
  Globe,
  Bell,
  Shield,
  Lock,
  ChevronDown,
  Check,
  HardHat,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react';
import { LanguageCode } from '../../types';

export const Header: React.FC = () => {
  const {
    t,
    userMode,
    setUserMode,
    language,
    setLanguage,
    currentCity,
    currentArea,
    distanceFilter,
    setIsLocationModalOpen,
    notifications,
    reports,
    isAdminAuthenticated,
    openAdminPortal,
    setIsPlayStoreModalOpen,
    setIsAuthModalOpen,
    currentUser,
    isAuthenticated,
    setActiveTab,
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const languages: { code: LanguageCode; label: string; sub: string }[] = [
    { code: 'hi', label: 'हिन्दी', sub: 'सरल हिंदी' },
    { code: 'hinglish', label: 'Hinglish', sub: 'हिंदी + English' },
    { code: 'en', label: 'English', sub: 'Standard' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Banner / Location & Quick Settings Bar */}
      <div className="max-w-5xl mx-auto px-3 py-2 flex items-center justify-between border-b border-stone-100 text-xs text-stone-600">
        {/* Hyperlocal location trigger */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-1.5 font-medium text-stone-800 hover:text-orange-600 bg-stone-100/80 hover:bg-orange-50 px-2.5 py-1 rounded-full transition"
        >
          <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
          <span className="font-semibold">{currentCity}</span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-600 truncate max-w-[110px] sm:max-w-none">{currentArea}</span>
          <span className="bg-orange-100 text-orange-700 font-bold px-1.5 py-0.2 rounded text-[10px]">
            {distanceFilter === 999 ? 'City' : `${distanceFilter} km`}
          </span>
          <ChevronDown className="w-3 h-3 text-stone-400" />
        </button>

        {/* Right side controls: Language, Admin, PWA */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-stone-100 transition font-medium text-stone-700"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span className="uppercase text-[11px] font-bold">
                {language === 'hi' ? 'हिन्दी' : language === 'hinglish' ? 'Hing' : 'EN'}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-stone-100 p-1 z-50 animate-in fade-in zoom-in-95">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg text-xs transition ${
                        language === item.code
                          ? 'bg-orange-50 text-orange-700 font-bold'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-[10px] text-stone-400">{item.sub}</div>
                      </div>
                      {language === item.code && <Check className="w-3.5 h-3.5 text-orange-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Login with Google or Phone Trigger */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-stone-200 hover:border-orange-300 bg-white hover:bg-orange-50/60 text-stone-700 text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs"
            title="Google ya Phone se Login Karein"
          >
            {currentUser?.authProvider === 'google' ? (
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
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
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            )}
            <span className="truncate max-w-[70px] sm:max-w-[100px]">
              {currentUser ? currentUser.name.split(' ')[0] : 'Login'}
            </span>
            <span className="hidden sm:inline text-[9px] text-orange-700 bg-orange-100 font-bold px-1.5 py-0.5 rounded">
              {currentUser?.authProvider === 'google' ? 'Google' : 'Phone'}
            </span>
          </button>

          {/* Play Store Packaging Button */}
          <button
            onClick={() => setIsPlayStoreModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-stone-900 text-white hover:bg-black text-xs font-semibold active:scale-95 transition"
            title="Google Play Store Release & Packaging"
          >
            <span className="text-[11px]">▶</span>
            <span>Play Store</span>
          </button>

          {/* Admin / Officer Portal shortcut (Secured) */}
          <button
            onClick={openAdminPortal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer ${
              isAdminAuthenticated
                ? 'bg-stone-900 hover:bg-stone-800 border border-emerald-500/50'
                : 'bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 text-stone-300'
            }`}
            title={
              isAdminAuthenticated
                ? 'Officer Portal Active • Problem Resolution Desk'
                : 'Staff / Officer Portal (Login Required)'
            }
          >
            {isAdminAuthenticated ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <Lock className="w-3 h-3 text-orange-400" />
            )}
            <Shield className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">
              {isAdminAuthenticated ? 'Officer Portal' : 'Staff Portal'}
            </span>
            {reports.filter((r) => r.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                {reports.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-stone-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotifOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-stone-100 p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="font-bold text-sm text-stone-800">Notifications</span>
                    <span className="text-[11px] text-orange-600 font-medium">
                      {unreadCount} naye alerts
                    </span>
                  </div>
                  <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto mt-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-stone-400 text-xs">
                        Koi naya alert nahi hai
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="py-2.5 text-xs">
                          <p className="font-semibold text-stone-900 leading-snug">{notif.title}</p>
                          <p className="text-stone-500 text-[11px] mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-stone-400 block mt-1">{notif.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand & Role Switcher Bar */}
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand logo & tagline */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <img
            src="/pwa-192x192.png"
            alt="Dihadi Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-md shadow-orange-500/20 border border-stone-200/80 flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold tracking-tight text-stone-900 leading-none">
                DIHADI
              </h1>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-md">
                Local
              </span>
            </div>
            <p className="text-[11px] font-medium text-stone-500 leading-tight">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Dual Mode Switcher: 👷 Mujhe Kaam Chahiye vs 🏗️ Mujhe Majdoor Chahiye */}
        <div className="bg-stone-100 p-1 rounded-2xl flex items-center shadow-inner">
          <button
            onClick={() => setUserMode('worker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              userMode === 'worker'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>👷</span>
            <span className="hidden sm:inline">
              {language === 'hi' ? 'काम चाहिए' : language === 'hinglish' ? 'Kaam Chahiye' : 'Need Work'}
            </span>
          </button>
          <button
            onClick={() => setUserMode('employer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              userMode === 'employer'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🏗️</span>
            <span className="hidden sm:inline">
              {language === 'hi' ? 'मजदूर चाहिए' : language === 'hinglish' ? 'Majdoor Chahiye' : 'Need Workers'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
