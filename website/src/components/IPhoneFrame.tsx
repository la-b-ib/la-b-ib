import React, { useState, useEffect } from 'react';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full sm:w-[275px] sm:min-w-[275px] sm:max-w-[275px] h-[var(--visual-viewport-height,100dvh)] sm:h-[598px] sm:min-h-[598px] sm:max-h-[598px] shrink-0 flex flex-col items-center justify-center">
      {/* Precision Titanium Hardware Buttons (Pro Layout scaled to 275x598) */}
      {/* Action Button (Top Left) */}
      <div
        className="hidden sm:block absolute -left-[2.5px] top-[50px] w-[2.5px] h-[16px] bg-[#3a3f4c] rounded-l-sm border-l border-[#6b7280] shadow-sm pointer-events-none"
        title="Action Button"
      />
      {/* Volume Up */}
      <div
        className="hidden sm:block absolute -left-[2.5px] top-[76px] w-[2.5px] h-[28px] bg-[#3a3f4c] rounded-l-sm border-l border-[#6b7280] shadow-sm pointer-events-none"
        title="Volume Up"
      />
      {/* Volume Down */}
      <div
        className="hidden sm:block absolute -left-[2.5px] top-[112px] w-[2.5px] h-[28px] bg-[#3a3f4c] rounded-l-sm border-l border-[#6b7280] shadow-sm pointer-events-none"
        title="Volume Down"
      />
      {/* Power / Side Button (Right) */}
      <div
        className="hidden sm:block absolute -right-[2.5px] top-[80px] w-[2.5px] h-[36px] bg-[#3a3f4c] rounded-r-sm border-r border-[#6b7280] shadow-sm pointer-events-none"
        title="Side Button"
      />

      {/* Main iPhone Pro Chassis: Exact 275px x 598px geometry with thin 4px titanium border */}
      <div className="w-full h-full bg-[#000000] border-0 sm:border-[4px] sm:border-[#1d1f24] sm:ring-1 sm:ring-[#525765]/80 sm:rounded-[36px] shadow-[0_0_40px_rgba(0,0,0,0.95),0_15px_30px_rgba(0,0,0,0.85)] relative flex flex-col justify-start overflow-hidden z-10">
        
        {/* Subtle Inner Glass Screen Bezel */}
        <div className="hidden sm:block absolute inset-0 rounded-[32px] pointer-events-none ring-1 ring-white/10 z-50" />

        {/* Compact iPhone Pro Status Bar with Centered Dynamic Island */}
        <div className="hidden sm:flex items-center justify-between px-3.5 pt-1.5 pb-0.5 bg-[#000000] sticky top-0 z-[60] border-0 shrink-0 select-none font-sans text-white text-[10px] font-semibold tracking-tight h-[22px]">
          {/* Time Display */}
          <span className="w-12 text-left font-mono text-[10px] font-bold text-white/90">
            {currentTime}
          </span>

          {/* Compact Pro Dynamic Island */}
          <div className="w-[72px] h-[18px] bg-[#000000] rounded-full border border-[#2b2d33] flex items-center justify-between px-1.5 shadow-sm">
            {/* Front Camera Lens with Blue Anti-reflective Glare */}
            <div className="w-2 h-2 rounded-full bg-[#0b0e14] border border-[#1b2333] flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-[#1e3a63] shadow-inner" />
            </div>
            {/* TrueDepth / Face ID Sensor Dot */}
            <div className="w-1 h-1 rounded-full bg-[#08090d]" />
          </div>

          {/* iOS Status Indicators */}
          <div className="w-12 flex items-center justify-end gap-1 text-white/80">
            {/* Cellular Signal Bars */}
            <span className="flex items-end gap-0.5 h-2">
              <span className="w-0.5 h-0.5 bg-white/90 rounded-full" />
              <span className="w-0.5 h-1 bg-white/90 rounded-full" />
              <span className="w-0.5 h-1.5 bg-white/90 rounded-full" />
              <span className="w-0.5 h-2 bg-white/90 rounded-full" />
            </span>

            {/* 5G Label */}
            <span className="text-[8px] font-bold tracking-tighter text-white/90 leading-none">5G</span>

            {/* Battery Indicator with Level Gauge */}
            <div className="w-3.5 h-2 border border-white/70 rounded-[2px] p-0.5 flex items-center relative ml-0.5">
              <div className="h-full w-full bg-[#34c759] rounded-[0.5px]" />
              <div className="w-0.5 h-1 bg-white/70 absolute -right-[1.5px] rounded-r-full" />
            </div>
          </div>
        </div>

        {/* Inner Mobile Screen Content */}
        <div className="w-full flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* iPhone Pro Bottom Home Bar Indicator */}
        <div className="hidden sm:flex justify-center items-center py-1 bg-[#000000] shrink-0 pointer-events-none select-none z-50">
          <div className="w-20 h-[3px] bg-white/45 rounded-full shadow-sm" />
        </div>
      </div>
    </div>
  );
};
