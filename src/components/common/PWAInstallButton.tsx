import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

interface Props {
  variant?: 'header' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone, don't show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'banner') {
      return (
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-3 rounded-2xl shadow-md flex items-center justify-between gap-3 my-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Dihadi App Install Karein</p>
              <p className="text-[11px] text-white/90">Tez chalega aur offline bhi kaam karega</p>
            </div>
          </div>
          <button
            onClick={install}
            className="bg-white text-orange-700 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow hover:bg-orange-50 active:scale-95 transition flex-shrink-0"
          >
            Install
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs font-semibold active:scale-95 transition"
        title="Dihadi App Install Karein"
      >
        <Download className="w-3.5 h-3.5 text-orange-600" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-medium"
        >
          <Download className="w-3.5 h-3.5 text-orange-600" />
          <span className="hidden sm:inline">Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    D
                  </div>
                  <h3 className="font-bold text-base">iPhone / iPad par Install</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-stone-600">
                <div className="flex items-start gap-3 bg-stone-50 p-3 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <p className="leading-snug">
                    1. Safari browser ke neeche wale toolbar me <strong className="text-stone-900">Share</strong> icon par tap karein.
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-stone-50 p-3 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <p className="leading-snug">
                    2. List ko scroll karke <strong className="text-stone-900">Add to Home Screen</strong> select karein.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-orange-600 text-white py-2.5 text-sm font-bold shadow hover:bg-orange-700 active:scale-98 transition"
              >
                Samajh Aa Gaya (OK)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
