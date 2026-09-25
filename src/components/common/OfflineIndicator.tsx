import React from 'react';
import { useOnlineStatus } from '../../hooks/usePWAInstall';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-stone-900/95 text-amber-300 px-4 py-1.5 text-xs font-semibold shadow-xl border border-stone-700 backdrop-blur-xs">
      <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      <span>Offline Mode — Cached local data dikh raha hai</span>
    </div>
  );
};
