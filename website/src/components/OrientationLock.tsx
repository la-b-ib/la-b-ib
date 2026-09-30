import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

export const OrientationLock: React.FC = () => {
  const [isLandscapeMobile, setIsLandscapeMobile] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // Attempt standard Screen Orientation API lock to portrait
    const lockScreenOrientation = async () => {
      try {
        const orientation =
          screen.orientation || (screen as any).mozOrientation || (screen as any).msOrientation;
        if (orientation && 'lock' in orientation) {
          await (orientation as any).lock('portrait-primary').catch(async () => {
            await (orientation as any).lock('portrait').catch(() => {});
          });
        } else if ((screen as any).lockOrientation) {
          (screen as any).lockOrientation('portrait');
        }
      } catch {
        // Handled silently if browser requires fullscreen or user gesture
      }
    };

    lockScreenOrientation();
    window.addEventListener('fullscreenchange', lockScreenOrientation);
    window.addEventListener('touchstart', lockScreenOrientation, { once: true });
    window.addEventListener('click', lockScreenOrientation, { once: true });

    // Check if viewport is in horizontal/landscape mode on mobile or small devices
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerHeight <= 600 || window.innerWidth <= 960;

      // Only lock on mobile/touch handheld devices in landscape mode
      if (isLandscape && (isTouch || isSmallScreen) && window.innerHeight < 650) {
        setIsLandscapeMobile(true);
      } else {
        setIsLandscapeMobile(false);
        setDismissed(false); // Reset dismissal when rotated back to portrait
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('fullscreenchange', lockScreenOrientation);
      window.removeEventListener('touchstart', lockScreenOrientation);
      window.removeEventListener('click', lockScreenOrientation);
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isLandscapeMobile || dismissed) {
    return null;
  }

  return (
    <div
      role="alertdialog"
      aria-label="Screen orientation lock"
      className="mobile-orientation-lock fixed inset-0 z-[99999] bg-[#090b10] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
    >
      {/* Background Matrix/Grid Aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,199,250,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Main Lock Card */}
      <div className="relative z-10 max-w-sm w-full bg-[#13141a] border border-[#44474f]/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center space-y-4">
        {/* Animated Phone Rotation Icon */}
        <div className="relative w-16 h-16 rounded-2xl bg-[#21232b] flex items-center justify-center text-[#a8c7fa] border border-[#a8c7fa]/20 shadow-inner">
          <i className="ri-smartphone-line text-3xl animate-rotate-phone"></i>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ffb4ab] text-[#60000e] text-[10px] font-bold flex items-center justify-center shadow">
            <i className="ri-lock-fill"></i>
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-1.5 font-mono">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#a8c7fa]/10 text-[#a8c7fa] text-[11px] font-bold border border-[#a8c7fa]/20 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a8c7fa] animate-pulse"></span>
            ORIENTATION LOCKED
          </div>
          <h2 className="text-white text-base font-bold tracking-tight">
            Please Rotate Your Device
          </h2>
          <p className="text-[#8e9199] text-xs leading-relaxed max-w-[260px] mx-auto">
            This terminal is optimized strictly for portrait orientation. Rotate your phone vertically to continue.
          </p>
        </div>

        {/* Status Pill & Override */}
        <div className="w-full pt-1 flex flex-col items-center gap-2">
          <div className="w-full bg-[#21232b] rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-[#8e9199]">
            <span className="flex items-center gap-1.5">
              <i className="ri-shield-keyhole-line text-[#a8e6cf]"></i>
              LOCK_STATE
            </span>
            <span className="text-[#a8e6cf] font-bold">PORTRAIT_ONLY</span>
          </div>

          <button
            onClick={() => {
              soundEngine.play('click');
              setDismissed(true);
            }}
            className="text-[11px] text-[#8e9199]/70 hover:text-white underline font-mono tracking-tight cursor-pointer pt-1 transition-colors"
          >
            Override and view landscape anyway
          </button>
        </div>
      </div>
    </div>
  );
};
