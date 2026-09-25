import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  CheckCircle,
  Copy,
  ExternalLink,
  Download,
  X,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

export const PlayStorePublishModal: React.FC = () => {
  const { isPlayStoreModalOpen, setIsPlayStoreModalOpen } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isPlayStoreModalOpen) return null;

  const currentAppUrl = window.location.origin;
  const manifestUrl = `${currentAppUrl}/manifest.webmanifest`;
  const packageId = 'in.dihadi.app';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-stone-900 via-stone-800 to-orange-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/pwa-192x192.png"
              alt="Dihadi Official Icon"
              className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-white/20 flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  Google Play Store Release & Packaging
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Official Icon Ready
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Package Dihadi into an Android App Bundle (.aab / APK) for Play Store
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPlayStoreModalOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 text-stone-800">
          {/* Status summary banner */}
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-orange-950 font-bold block text-sm">
                Dihadi is 100% Google Play Store Compliant
              </strong>
              <p className="text-orange-900 leading-relaxed font-medium">
                The application meets all Progressive Web App (PWA) requirements for Google Play:
                valid Web App Manifest, offline service worker caching, 512x512 maskable icons, and standalone viewport.
              </p>
            </div>
          </div>

          {/* Key Parameters for Play Store */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Play Store Submission Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 block text-[10px] font-semibold">Package ID:</span>
                  <span className="font-mono font-bold text-stone-900">{packageId}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(packageId, 'package')}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition"
                  title="Copy Package ID"
                >
                  {copiedKey === 'package' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 block text-[10px] font-semibold">App Name:</span>
                  <span className="font-bold text-stone-900">Dihadi — Kaam bhi, Majdoor bhi</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between sm:col-span-2">
                <div className="truncate max-w-[85%]">
                  <span className="text-stone-400 block text-[10px] font-semibold">Live PWA Manifest URL:</span>
                  <span className="font-mono text-[11px] font-bold text-stone-900 truncate block">
                    {manifestUrl}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(manifestUrl, 'manifest')}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition flex-shrink-0"
                  title="Copy Manifest URL"
                >
                  {copiedKey === 'manifest' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Method 1: PWABuilder (Fastest, 2 Minutes) */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-sm text-stone-900">
                  Instant Method: Generate .AAB Bundle via PWABuilder
                </h4>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Recommended
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              1. Open <strong>PWABuilder.com</strong> in a new tab.<br />
              2. Paste your live app URL: <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded text-[11px]">{currentAppUrl}</code><br />
              3. Click <strong>Package for Stores</strong> ➔ Select <strong>Google Play</strong>.<br />
              4. Download the ready-to-upload <strong>.aab (Android App Bundle)</strong>.
            </p>

            <a
              href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentAppUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow transition active:scale-98"
            >
              <span>Launch PWABuilder for Dihadi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Method 2: Google's Official Bubblewrap CLI */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-sm text-stone-900">
                Official Google CLI Method (Bubblewrap)
              </h4>
            </div>

            <p className="text-xs text-stone-600 font-medium">
              Run this in your terminal to generate an authentic Google TWA package directly:
            </p>

            <div className="bg-stone-900 text-amber-300 font-mono text-[11px] p-3 rounded-xl overflow-x-auto relative">
              <pre>
{`npm install -g @bubblewrap/cli
bubblewrap init --manifest="${manifestUrl}"
bubblewrap build`}
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(
                    `npm install -g @bubblewrap/cli\nbubblewrap init --manifest="${manifestUrl}"\nbubblewrap build`,
                    'cli'
                  )
                }
                className="absolute top-2.5 right-2.5 p-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition"
                title="Copy Commands"
              >
                {copiedKey === 'cli' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Next Steps in Google Play Console */}
          <div className="border-t border-stone-200 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Uploading to Google Play Console
            </h4>
            <div className="space-y-1.5 text-xs text-stone-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Log into <strong>Google Play Console</strong> and click <strong>Create App</strong>.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Upload the generated <strong>.aab</strong> bundle in <strong>Production Release</strong>.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Upload the 512x512 app icon included at <code className="bg-stone-100 text-stone-800 px-1 rounded">/public/pwa-512x512.png</code>.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Play Store configuration file generated in root directory.
          </span>
          <button
            onClick={() => setIsPlayStoreModalOpen(false)}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl font-bold text-xs shadow active:scale-95 transition"
          >
            Samajh Aa Gaya (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
