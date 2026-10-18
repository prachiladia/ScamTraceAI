import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const NetworkStatusBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
        isOffline
          ? 'bg-amber-600 text-white'
          : 'bg-emerald-600 text-white'
      }`}
    >
      {isOffline ? (
        <>
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>You are currently offline. Lexical analysis and cached Academy guides remain accessible.</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 shrink-0" />
          <span>Network connection restored. Online analysis active.</span>
        </>
      )}
    </div>
  );
};
