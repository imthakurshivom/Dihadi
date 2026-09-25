import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  MapPin,
  Globe,
  Bell,
  Shield,
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
    setIsAdminOpen,
    setIsPlayStoreModalOpen,
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

          {/* Play Store Packaging Button */}
          <button
            onClick={() => setIsPlayStoreModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-stone-900 text-white hover:bg-black text-xs font-semibold active:scale-95 transition"
            title="Google Play Store Release & Packaging"
          >
            <span className="text-[11px]">▶</span>
            <span>Play Store</span>
          </button>

          {/* Admin shortcut */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition"
            title="Admin Dashboard"
          >
            <Shield className="w-4 h-4 text-stone-500" />
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
