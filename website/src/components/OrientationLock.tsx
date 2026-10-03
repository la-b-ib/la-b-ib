import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface OrientationLockProps {
  onOverride?: () => void;
}

const ORIENTATION_NOTICE =
  'Hardware sensor detected horizontal landscape orientation. This website is strictly engineered for vertical portrait layout.';

export const OrientationLock: React.FC<OrientationLockProps> = ({ onOverride }) => {
  const [timestamp, setTimestamp] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  });
  const [rayId] = useState<string>(() => {
    const chars = '0123456789abcdef';
    let res = '';
    for (let i = 0; i < 16; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
  });

  useEffect(() => {
    soundEngine.play('error');
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimestamp(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="alertdialog"
      aria-label="Device Orientation Locked"
      className="fixed top-[55px] inset-x-0 bottom-0 z-40 bg-[#000000] text-[#e3e2e6] flex flex-col items-center justify-start select-none overflow-y-auto font-mono [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '0px',
        paddingBottom: '8px',
      }}
    >
      <div className="w-full flex flex-col items-stretch space-y-2 pt-1">
        {/* Section Header */}
        <div className="mb-[2px] shrink-0">
          <div className="flex items-center space-x-2 leading-[12px] text-[12px]" style={{ lineHeight: '12px', fontSize: '12px' }}>
            <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse" style={{ backgroundColor: '#a8c7fa' }}></span>
            <span className="text-[12px] leading-[12px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold" style={{ lineHeight: '12px' }}>
              SYS: DISPLAY-GUARD
            </span>
          </div>
          <h2
            className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3 leading-[24px]"
            style={{ fontSize: '24px', lineHeight: '24px', marginTop: '0px', marginBottom: '8px' }}
          >
            Portrait Mode Required
          </h2>
        </div>

        {/* Side by side row container for Card 1 & Card 2 */}
        <div className="w-full grid grid-cols-2 gap-[15px] items-stretch">
          {/* Card 1: GYRO SENSOR ORIENTATION */}
          <div
            className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between shadow-md space-y-2.5 h-full"
            style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
          >
            <div className="space-y-2.5 flex-1 flex flex-col">
              {/* Top Bar Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm"
                    style={{ width: '33px', height: '33px' }}
                    title="Device Sensor"
                  >
                    <i
                      className="ri-rotate-lock-line text-[24px] flex items-center justify-center"
                      style={{ width: '24px', height: '24px', fontSize: '24px' }}
                    ></i>
                  </div>
                  <div className="flex flex-col font-mono text-[#a8c7fa] font-bold">
                    <span className="text-[16px] leading-[16px] tracking-tight">GYRO SENSOR</span>
                    <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">ORIENTATION</span>
                  </div>
                </div>
                <div
                  className="flex items-center space-x-1.5 bg-[#000000] px-2.5 h-[18.4375px] rounded-full border border-[#44474f]/30 text-[12px]"
                  style={{ fontSize: '12px' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a8c7fa] animate-pulse" style={{ backgroundColor: '#a8c7fa' }}></span>
                  <span className="text-[12px] leading-none font-mono text-[#a8c7fa] uppercase" style={{ color: '#a8c7fa' }}>LANDSCAPE</span>
                </div>
              </div>

              {/* Inner Text Capsule - Static text without typing animation */}
              <div
                className="bg-[#000000] border border-[#44474f]/30 rounded-xl p-2 text-[12px] leading-[16px] font-mono flex-1 overflow-hidden flex items-start"
                style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
              >
                <p
                  className="bg-[#000000] text-[#c4c6d0] text-[12px] leading-[16px] font-mono w-full"
                  style={{ fontSize: '12px', lineHeight: '16px' }}
                >
                  {ORIENTATION_NOTICE}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: TURN DEVICE ROTATE 90° */}
          <div
            className="bg-[#21232b] rounded-2xl border-0 p-2 shadow-md flex flex-col justify-between space-y-2.5 h-full"
            style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
          >
            {/* Top Bar Header with Override Icon on right corner */}
            <div className="flex items-center justify-between pb-0.5">
              <div className="flex items-center gap-2.5 shrink-0">
                <div
                  className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm"
                  style={{ width: '33px', height: '33px' }}
                >
                  <i
                    className="ri-loop-left-ai-line text-[24px] flex items-center justify-center"
                    style={{ width: '24px', height: '24px', fontSize: '24px' }}
                  ></i>
                </div>
                <div className="flex flex-col font-mono text-[#a8c7fa] font-bold shrink-0">
                  <span className="text-[16px] leading-[16px] tracking-tight">TURN DEVICE</span>
                  <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">ROTATE 90°</span>
                </div>
              </div>

              {/* Override Icon Button in Right Corner */}
              {onOverride && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.play('click');
                    onOverride();
                  }}
                  className="w-7 h-7 rounded-lg bg-[#21232b] border border-[#44474f]/30 text-[#a8c7fa] flex items-center justify-center cursor-pointer text-base shadow-sm"
                  style={{ backgroundColor: '#21232b', color: '#a8c7fa' }}
                  title="Override and view landscape anyway"
                  aria-label="Override and view landscape anyway"
                >
                  <i className="ri-eye-2-line" style={{ color: '#a8c7fa' }}></i>
                </button>
              )}
            </div>

            {/* Telemetry text block */}
            <div
              className="bg-[#000000] rounded-xl p-2 flex flex-col space-y-1 text-white border border-[#44474f]/30 font-mono text-xs flex-1 justify-center"
              style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[#8e9199] text-[12px] leading-[15px]" style={{ fontSize: '12px', lineHeight: '15px' }}>
                  REFERENCE
                </span>
                <span className="text-[#a8c7fa] text-[12px] leading-[15px] font-mono" style={{ fontSize: '12px', lineHeight: '15px' }}>
                  ROT-{rayId.substring(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e9199] text-[12px] leading-[15px]" style={{ fontSize: '12px', lineHeight: '15px' }}>
                  TIMESTAMP
                </span>
                <span className="text-[#a8c7fa] text-[12px] leading-[15px] font-mono" style={{ fontSize: '12px', lineHeight: '15px' }}>
                  {timestamp}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
