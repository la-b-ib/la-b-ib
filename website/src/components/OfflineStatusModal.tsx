import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface OfflineStatusModalProps {
  onStatusChange?: (isOnline: boolean) => void;
}

export const OfflineStatusModal: React.FC<OfflineStatusModalProps> = ({ onStatusChange }) => {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
      setCheckResult(null);
      soundEngine.play('access_granted');
      onStatusChange?.(true);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
      setCheckResult(null);
      soundEngine.play('click');
      onStatusChange?.(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
      onStatusChange?.(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onStatusChange]);

  const handleCheckConnection = async () => {
    setIsChecking(true);
    setCheckResult(null);
    soundEngine.play('terminal_key');

    try {
      // Ping check with cache buster
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      await fetch(`/favicon.ico?_ping=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        mode: 'no-cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setIsOffline(false);
      setDismissed(false);
      setCheckResult('Online! Connection restored.');
      soundEngine.play('access_granted');
      onStatusChange?.(true);
    } catch {
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        // navigator says online, clear
        setIsOffline(false);
        setDismissed(false);
        soundEngine.play('access_granted');
        onStatusChange?.(true);
      } else {
        setIsOffline(true);
        setCheckResult('Still unreachable. Please check your network.');
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleDismiss = () => {
    soundEngine.play('terminal_key');
    setDismissed(true);
  };

  if (!isOffline || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="No Internet Connection"
      className="fixed left-0 right-0 bottom-0 z-50 bg-transparent flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn font-mono overflow-y-auto"
      style={{
        top: 'calc(55px + env(safe-area-inset-top, 0px))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="w-full max-w-md bg-[#21232b] text-[#e3e2e6] rounded-3xl p-2 shadow-2xl border-0 flex flex-col relative overflow-hidden my-auto"
        style={{
          paddingLeft: '8px',
          paddingRight: '8px',
          paddingTop: '8px',
          paddingBottom: '8px',
          borderWidth: '0px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-[33px] h-[33px] rounded-[8px] bg-[#ffb4ab] flex items-center justify-center text-lg shrink-0 border border-[#ffb4ab]/30"
              style={{
                backgroundColor: '#ffb4ab',
                width: '32.9948px',
                height: '32.9948px',
                borderRadius: '8px',
              }}
            >
              <i className="ri-global-off-line text-[#690005]" style={{ color: '#690005' }}></i>
            </div>
            <div>
              <div
                className="text-[12px] text-[#ffb4ab] tracking-wider uppercase font-semibold leading-none"
                style={{ fontSize: '12px' }}
              >
                TELEMETRY STATUS
              </div>
              <h2
                className="text-[16px] font-bold text-white tracking-tight mt-0.5 leading-[16px]"
                style={{ fontSize: '16px', lineHeight: '16px' }}
              >
                No Internet Connection
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCheckConnection}
              disabled={isChecking}
              title="Test Uplink Connection"
              aria-label="Test Uplink Connection"
              className="w-[33px] h-[33px] rounded-full bg-[#a8c7fa] hover:bg-[#96bef8] text-[#001d35] flex items-center justify-center cursor-pointer transition-colors shadow-sm active:scale-95 disabled:opacity-60"
            >
              <i className={`ri-loop-left-ai-line text-base ${isChecking ? 'animate-spin' : ''}`}></i>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              title="Dismiss Alert"
              aria-label="Dismiss Alert"
              className="w-[33px] h-[33px] rounded-full bg-[#ffb4ab] hover:opacity-90 flex items-center justify-center cursor-pointer transition-opacity active:scale-95"
              style={{ backgroundColor: '#ffb4ab' }}
            >
              <i className="ri-close-circle-line text-base text-[#690005]" style={{ color: '#690005' }}></i>
            </button>
          </div>
        </div>

        {/* Description Body */}
        <div className="space-y-2.5 text-[12px] leading-[17px] text-[#c4c6d0]">
          <p>
            Workstation telemetry detects that your internet uplink is severed. Cloudflare edge synchronization, live threat maps, and interactive terminal sockets are currently paused.
          </p>

          {/* Breakdown Box */}
          <div
            className="bg-[#13141a] rounded-2xl p-2 border border-[#44474f]/25 space-y-2 text-[11px] leading-[15px]"
            style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
          >
            <div className="flex items-start gap-2">
              <i className="ri-network-off-line text-[#ffb4ab] text-xs mt-0.5 shrink-0"></i>
              <div>
                <span className="text-white font-semibold block text-[16px]" style={{ fontSize: '16px' }}>
                  Gateway Unreachable
                </span>
                <span className="text-[#8e9199] text-[12px]" style={{ fontSize: '12px' }}>
                  Network interface is offline. Cached terminal operations remain available.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2 pt-1 border-t border-[#44474f]/20">
              <i className="ri-radar-line text-[#a8c7fa] text-xs mt-0.5 shrink-0" style={{ color: '#a8c7fa' }}></i>
              <div>
                <span className="text-white font-semibold block text-[16px]" style={{ fontSize: '16px' }}>
                  Auto-Reconnection Active
                </span>
                <span className="text-[#8e9199] text-[12px]" style={{ fontSize: '12px' }}>
                  Continuous background telemetry monitors heartbeat; clears automatically upon uplink restoration.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status / Warning Banner */}
        <div
          className="mt-3 rounded-xl bg-[#ba1a1a]/20 border-0 text-[#ffb4ab] flex items-start gap-2 animate-fadeIn"
          style={{
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '8px',
            paddingBottom: '8px',
            borderWidth: '0px',
          }}
        >
          <i className="ri-alert-line text-sm shrink-0 mt-0.5"></i>
          <div style={{ fontSize: '12px' }} className="text-[12px] leading-[16px]">
            <strong className="block font-semibold" style={{ fontSize: '16px' }}>
              {checkResult || 'UPLINK OFFLINE'}
            </strong>
            Verify your Wi-Fi, Ethernet, or mobile hotspot to resume live operations.
          </div>
        </div>
      </div>
    </div>
  );
};
