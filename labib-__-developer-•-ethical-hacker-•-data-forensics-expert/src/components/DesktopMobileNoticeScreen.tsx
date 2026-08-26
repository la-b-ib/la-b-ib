import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface DesktopMobileNoticeScreenProps {
  onLaunchSimulator: () => void;
}

export const DesktopMobileNoticeScreen: React.FC<DesktopMobileNoticeScreenProps> = ({
  onLaunchSimulator,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DEVTOOLS' | 'QR'>('OVERVIEW');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev.run.app';

  const handleCopyLink = () => {
    soundEngine.play('click');
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#09080c] text-[#e3e2e6] font-sans antialiased relative flex flex-col justify-between overflow-x-hidden selection:bg-[#9c88ff]/30 selection:text-white">
      {/* Background Ambient Radial Glows */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#9c88ff]/15 via-[#0f0e13]/90 to-[#09080c]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#00a8ff]/10 via-transparent to-transparent" />

      {/* TOP DESKTOP M3 BAR */}
      <header className="relative z-20 w-full bg-[#141218]/90 backdrop-blur-md border-b border-[#49454f]/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#9c88ff]/20 text-[#9c88ff] border border-[#9c88ff]/40 flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(156,136,255,0.2)]">
            <i className="ri-shield-keyhole-line"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white text-base tracking-tight">
                CYBER SOC PORTFOLIO
              </span>
              <span className="text-[10px] font-mono font-bold text-[#4cd137] bg-[#005231]/50 border border-[#4cd137]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd137] animate-ping"></span>
                MOBILE OPTIMIZED
              </span>
            </div>
            <p className="text-xs text-[#8e9199] font-mono">
              Material Design 3 Mobile Viewport Enforcement System
            </p>
          </div>
        </div>

        {/* Action Button on Header */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-full bg-[#1a1b21] hover:bg-[#21232b] text-[#e3e2e6] border border-[#49454f]/50 font-mono text-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <i className={copied ? 'ri-check-line text-[#4cd137]' : 'ri-share-line text-[#00a8ff]'}></i>
            <span>{copied ? 'LINK COPIED' : 'SHARE TO PHONE'}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.play('click');
              onLaunchSimulator();
            }}
            className="px-5 py-2 rounded-full bg-[#9c88ff] hover:bg-[#8c7ae6] text-[#09080c] font-bold text-xs tracking-wide shadow-lg shadow-[#9c88ff]/20 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <i className="ri-smartphone-line text-base"></i>
            <span>LAUNCH SIMULATOR</span>
          </button>
        </div>
      </header>

      {/* MAIN FULL-SCREEN DESKTOP CONTENT */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: NOTICE & VALUE PROPOSITION */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#192a56]/80 border border-[#9c88ff]/30 text-[#9c88ff] text-xs font-mono font-bold tracking-wider uppercase">
            <i className="ri-cellphone-line text-sm"></i>
            <span>MOBILE VIEWPORT REQUIRED</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Crafted Exclusively for <br />
              <span className="bg-gradient-to-r from-[#9c88ff] via-[#00a8ff] to-[#4cd137] bg-clip-text text-transparent">
                Mobile Touch Experience
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#c4c6d0] leading-relaxed max-w-2xl">
              This SOC Security Operations System and Cyber Portfolio is specifically architected with Material Design 3 guidelines for mobile devices, featuring gesture controls, thumb-accessible docks, and high-density haptic response.
            </p>
          </div>

          {/* FEATURE CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="bg-[#141218] p-4 rounded-2xl border border-[#49454f]/40 space-y-2 hover:border-[#9c88ff]/50 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-[#9c88ff]/15 text-[#9c88ff] flex items-center justify-center">
                <i className="ri-radar-line text-lg"></i>
              </div>
              <h4 className="font-bold text-white text-xs">Sub-Second Telemetry</h4>
              <p className="text-[11px] text-[#8e9199]">Real-time eBPF threat map optimized for touch screen rotation.</p>
            </div>

            <div className="bg-[#141218] p-4 rounded-2xl border border-[#49454f]/40 space-y-2 hover:border-[#00a8ff]/50 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-[#00a8ff]/15 text-[#00a8ff] flex items-center justify-center">
                <i className="ri-shield-keyhole-line text-lg"></i>
              </div>
              <h4 className="font-bold text-white text-xs">PGP Cryptography</h4>
              <p className="text-[11px] text-[#8e9199]">RSA-4096 keypair sandbox with interactive cipher tools.</p>
            </div>

            <div className="bg-[#141218] p-4 rounded-2xl border border-[#49454f]/40 space-y-2 hover:border-[#4cd137]/50 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-[#4cd137]/15 text-[#4cd137] flex items-center justify-center">
                <i className="ri-[#4cd137] ri-terminal-box-line text-lg"></i>
              </div>
              <h4 className="font-bold text-white text-xs">Cyber CTF Terminal</h4>
              <p className="text-[11px] text-[#8e9199]">Mobile virtual shell with tactical keyboard shortcuts.</p>
            </div>
          </div>

          {/* TABS FOR INSTRUCTIONS */}
          <div className="bg-[#141218] border border-[#49454f]/40 rounded-2xl p-5 space-y-4">
            <div className="flex border-b border-[#49454f]/30 pb-3 gap-2">
              <button
                onClick={() => {
                  soundEngine.play('click');
                  setActiveTab('OVERVIEW');
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-[#9c88ff] text-[#09080c] shadow'
                    : 'text-[#8e9199] hover:text-white'
                }`}
              >
                1. RECOMMENDED OPTIONS
              </button>
              <button
                onClick={() => {
                  soundEngine.play('click');
                  setActiveTab('DEVTOOLS');
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'DEVTOOLS'
                    ? 'bg-[#00a8ff] text-[#09080c] shadow'
                    : 'text-[#8e9199] hover:text-white'
                }`}
              >
                2. DESKTOP BROWSER DEVTOOLS
              </button>
            </div>

            {activeTab === 'OVERVIEW' && (
              <div className="space-y-3 font-mono text-xs">
                <p className="text-[#c4c6d0]">
                  Select how you would like to experience the portfolio:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      soundEngine.play('click');
                      onLaunchSimulator();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#9c88ff] hover:bg-[#8c7ae6] text-[#09080c] font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                  >
                    <i className="ri-smartphone-line text-lg"></i>
                    <span>Launch Mobile Simulator Frame</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#1a1b21] hover:bg-[#21232b] text-[#e3e2e6] border border-[#49454f]/50 font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <i className="ri-qr-code-line text-lg text-[#00a8ff]"></i>
                    <span>{copied ? 'Link Copied!' : 'Copy URL for Phone'}</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'DEVTOOLS' && (
              <div className="space-y-2.5 font-mono text-xs animate-fadeIn">
                <div className="text-[#fbc531] font-bold flex items-center space-x-2">
                  <i className="ri-terminal-box-line"></i>
                  <span>Toggle Device Emulation in Chrome / Edge / Firefox / Safari:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="bg-[#0f0e13] p-3 rounded-xl border border-[#2f3640]">
                    <span className="text-[#9c88ff] font-bold block mb-1">STEP 1</span>
                    Press <span className="text-white bg-[#1a1b21] px-1.5 py-0.5 rounded border border-[#49454f]/40 font-bold">F12</span> or <span className="text-white bg-[#1a1b21] px-1.5 py-0.5 rounded border border-[#49454f]/40 font-bold">Ctrl+Shift+I</span>
                  </div>
                  <div className="bg-[#0f0e13] p-3 rounded-xl border border-[#2f3640]">
                    <span className="text-[#00a8ff] font-bold block mb-1">STEP 2</span>
                    Press <span className="text-white bg-[#1a1b21] px-1.5 py-0.5 rounded border border-[#49454f]/40 font-bold">Ctrl+Shift+M</span> (Device Toolbar)
                  </div>
                  <div className="bg-[#0f0e13] p-3 rounded-xl border border-[#2f3640]">
                    <span className="text-[#4cd137] font-bold block mb-1">STEP 3</span>
                    Choose <span className="text-white font-bold">iPhone 14</span> or screen width &lt; 640px
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE SMARTPHONE FRAME PREVIEW MOCKUP */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[340px] aspect-[9/19] bg-[#141218] border-[8px] border-[#2b2930] rounded-[48px] shadow-[0_0_60px_rgba(156,136,255,0.25)] p-4 flex flex-col justify-between overflow-hidden group">
            
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-[#09080c] rounded-full mx-auto flex items-center justify-center space-x-2 border border-[#49454f]/30 z-20">
              <div className="w-2 h-2 rounded-full bg-[#1a1b21]"></div>
              <div className="w-10 h-1.5 rounded-full bg-[#1a1b21]"></div>
            </div>

            {/* Screen Content Preview */}
            <div className="flex-1 my-3 bg-[#0f0e13] rounded-[32px] p-4 border border-[#49454f]/30 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8e9199] border-b border-[#49454f]/20 pb-2">
                  <span>M3 MOBILE SOC</span>
                  <span className="text-[#4cd137] font-bold">ONLINE</span>
                </div>

                <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#9c88ff]/30 text-center space-y-1">
                  <i className="ri-radar-line text-2xl text-[#9c88ff] animate-pulse inline-block"></i>
                  <h5 className="text-xs font-bold text-white">Live Telemetry Feed</h5>
                  <p className="text-[10px] text-[#8e9199] font-mono">0.42s Mean Time to Detect</p>
                </div>

                <div className="bg-[#1a1b21] p-2.5 rounded-xl border border-[#00a8ff]/30 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8e9199]">SLA RATE</span>
                  <span className="text-[#4cd137] font-bold">98% MITIGATED</span>
                </div>

                <div className="bg-[#1a1b21] p-2.5 rounded-xl border border-[#fbc531]/30 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8e9199]">KERNEL eBPF</span>
                  <span className="text-[#fbc531] font-bold">ACTIVE DROPS</span>
                </div>
              </div>

              {/* Overlay Prompt on Phone Preview */}
              <div className="relative z-10 pt-3">
                <button
                  onClick={() => {
                    soundEngine.play('click');
                    onLaunchSimulator();
                  }}
                  className="w-full py-2.5 rounded-full bg-[#9c88ff] hover:bg-[#8c7ae6] text-[#09080c] font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
                >
                  <span>TAP TO OPEN MOBILE FRAME</span>
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>

              {/* Background Radar Animation */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#9c88ff]/20 via-transparent to-transparent pointer-events-none animate-pulse"></div>
            </div>

            {/* Home Indicator Pill */}
            <div className="w-28 h-1 bg-[#49454f] rounded-full mx-auto z-20"></div>
          </div>
        </div>

      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-20 w-full bg-[#141218]/90 border-t border-[#49454f]/30 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#8e9199] gap-2">
        <div className="flex items-center space-x-2">
          <i className="ri-shield-check-line text-[#4cd137]"></i>
          <span>SOC COMMAND & CONTROL PORTFOLIO • MATERIAL DESIGN 3</span>
        </div>
        <div>
          <span>RESIZE WINDOW BELOW 640PX OR TOGGLE DEVTOOLS DEVICE MODE</span>
        </div>
      </footer>
    </div>
  );
};
