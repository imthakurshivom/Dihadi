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
  GitBranch,
  Terminal,
  Laptop,
  Play,
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

          {/* Method 1: GitHub Actions APK Workflow (Direct Phone APK & AAB) */}
          <div className="border-2 border-stone-900 rounded-2xl p-4 bg-stone-900 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-orange-400" />
                    GitHub Actions: Automatic APK & AAB Build
                  </h4>
                  <p className="text-[11px] text-stone-300">
                    Direct phone installable .apk and Play Store .aab generated automatically on GitHub
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 rounded-full">
                Configured & Committed
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed font-medium">
              A pre-configured CI/CD workflow is ready in <code className="bg-stone-800 text-orange-300 px-1 py-0.5 rounded text-[11px]">.github/workflows/build-apk.yml</code>.
              Push this repository to your GitHub account to trigger automatic Android compilation:
            </p>

            <div className="bg-black/80 text-emerald-300 font-mono text-[11px] p-3 rounded-xl overflow-x-auto relative border border-stone-800">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap">
{`# 1. Add your GitHub repository remote
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git branch -M main
git push -u origin main

# 2. To auto-publish a GitHub Release with APK:
git tag v1.0.0
git push origin v1.0.0`}
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(
                    `git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git\ngit branch -M main\ngit push -u origin main`,
                    'git-push'
                  )
                }
                className="absolute top-2.5 right-2.5 p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition text-[10px] font-sans flex items-center gap-1 font-semibold"
                title="Copy Git Push Commands"
              >
                {copiedKey === 'git-push' ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-2.5 bg-stone-800/80 rounded-xl text-xs space-y-1 text-stone-300 border border-stone-700/60">
              <span className="text-stone-400 font-semibold text-[10px] uppercase tracking-wider block">Where to find your APK after push:</span>
              <p className="text-[11px]">
                👉 Open your repo on GitHub ➔ click <strong>Actions</strong> tab ➔ Click latest build ➔ Download <strong>Dihadi-Android-App-APK</strong> (contains both <code className="text-amber-300">dihadi-release.apk</code> and <code className="text-amber-300">dihadi-playstore-bundle.aab</code>).
              </p>
            </div>
          </div>

          {/* Method 2: Android Studio Direct Clone & Run */}
          <div className="border border-emerald-500/40 rounded-2xl p-4 bg-emerald-50/50 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-emerald-600" />
                    Android Studio: Direct Clone & Run
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    Pre-configured Native Gradle project ready to open in Android Studio
                  </p>
                </div>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Play className="w-3 h-3 fill-emerald-700" />
                Studio Ready
              </span>
            </div>

            <div className="text-xs text-stone-700 space-y-2 bg-white p-3 rounded-xl border border-emerald-200">
              <p className="font-semibold text-emerald-950">Android Studio me kaise kholein:</p>
              <ol className="list-decimal list-inside space-y-1 text-stone-600 font-medium text-[11px]">
                <li><strong>Android Studio</strong> kholein ➔ Welcome screen par <strong>"Get from VCS"</strong> par click karein.</li>
                <li>Apne GitHub repo ka URL paste karein aur <strong>Clone</strong> dabayein.</li>
                <li>Android Studio <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">settings.gradle</code> aur <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">app/</code> module ko automatically sync kar lega.</li>
                <li>Apna phone USB se lagayein (ya Emulator chunein) aur green <strong>Run (▶)</strong> button dabayein!</li>
              </ol>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>Includes offline bundled web assets in <code className="bg-stone-100 px-1 rounded text-stone-700">app/src/main/assets/web/</code></span>
              <span className="text-emerald-700 font-bold">Guide: ANDROID_STUDIO_GUIDE.md</span>
            </div>
          </div>

          {/* Method 3: PWABuilder (Fastest, 2 Minutes) */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-sm text-stone-900">
                  Alternative: Instant .AAB via PWABuilder
                </h4>
              </div>
              <span className="text-[11px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-full">
                No Terminal
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

          {/* Method 3: Google's Official Bubblewrap CLI */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-sm text-stone-900">
                Local CLI Method (Bubblewrap)
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
