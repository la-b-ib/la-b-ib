import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface HudTopbarProps {
  sfxActive: boolean;
  onToggleSfx: () => void;
  crtActive?: boolean;
  onToggleCrt?: () => void;
  onOpenTerminal: () => void;
  terminalOpen?: boolean;
  onToggleTerminal?: () => void;
  searchOpen?: boolean;
  onToggleSearch?: () => void;
  ctfOpen?: boolean;
  onToggleCtf?: () => void;
  onOpenCtf: () => void;
  latency?: number;
}

export const HudTopbar: React.FC<HudTopbarProps> = ({
  sfxActive,
  onToggleSfx,
  crtActive = true,
  onToggleCrt,
  onOpenTerminal,
  terminalOpen = false,
  onToggleTerminal,
  searchOpen = false,
  onToggleSearch,
  ctfOpen = false,
  onToggleCtf,
  onOpenCtf,
  latency: propsLatency,
}) => {
  const [internalLatency, setInternalLatency] = useState(14);

  useEffect(() => {
    if (propsLatency !== undefined) return;
    const interval = setInterval(() => {
      setInternalLatency(12 + Math.floor(Math.random() * 6));
    }, 4000);
    return () => clearInterval(interval);
  }, [propsLatency]);

  const currentLatency = propsLatency !== undefined ? propsLatency : internalLatency;

  return (
    <div className="hidden md:block w-full bg-[#141218] text-xs px-4 sm:px-6 lg:px-8 select-none py-2 border-b border-[#49454f]/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Google Workspace / Security Console Status Badge */}
        <div className="flex items-center space-x-2 text-[11px] font-medium text-[#c4c6d0]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8e6cf] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34a853]"></span>
          </span>
          <span className="tracking-wide">Google Security Workspace • Operational</span>
        </div>

        {/* HUD Controls with Material 3 Expressive Tonal Style */}
        <div className="flex items-center space-x-2">
          {/* Latency Indicator Badge */}
          <div
            className="px-3 py-1 rounded-full border border-[#00522b]/50 bg-[#00522b]/30 text-[#c6f6d5] text-[11px] font-mono font-medium flex items-center space-x-1.5"
            title="Current Network Latency"
          >
            <i className="ri-router-line text-sm text-[#a8e6cf]"></i>
            <span>{currentLatency}ms</span>
          </div>

          {/* SFX Button */}
          <button
            onClick={() => {
              onToggleSfx();
              soundEngine.play('click');
            }}
            className={`m3-btn-sm cursor-pointer transition-all ${
              sfxActive ? 'm3-btn-tonal' : 'm3-btn-outlined'
            }`}
            title={`Toggle Audio SFX (${sfxActive ? 'ON' : 'OFF'})`}
          >
            <i className={`${sfxActive ? 'ri-volume-up-line' : 'ri-volume-mute-line'} text-sm`}></i>
            <span className="hidden sm:inline">SFX</span>
          </button>

          {/* CTF Challenge Button */}
          <button
            onClick={() => {
              if (onToggleCtf) {
                onToggleCtf();
              } else {
                onOpenCtf();
              }
              soundEngine.play('click');
            }}
            className={`m3-btn-sm cursor-pointer transition-all ${
              ctfOpen ? 'm3-btn-tonal' : 'm3-btn-outlined'
            }`}
            title={ctfOpen ? "Turn Off CTF Challenge" : "Turn On CTF Challenge"}
          >
            <i className={`${ctfOpen ? 'ri-flag-2-line' : 'ri-flag-off-line'} text-sm`}></i>
            <span className="hidden sm:inline">CTF</span>
          </button>

          {/* Search Toggle Button */}
          <button
            onClick={() => {
              if (onToggleSearch) {
                onToggleSearch();
              }
              soundEngine.play('click');
            }}
            className={`m3-btn-sm cursor-pointer transition-all ${
              searchOpen ? 'm3-btn-tonal' : 'm3-btn-outlined'
            }`}
            title={searchOpen ? "Turn Off Search (⌘K)" : "Turn On Search (⌘K)"}
          >
            <i className="ri-search-line text-sm"></i>
            <span className="hidden sm:inline">Search (⌘K)</span>
          </button>

          {/* Terminal Toggle Button */}
          <button
            onClick={() => {
              if (onToggleTerminal) {
                onToggleTerminal();
              } else {
                onOpenTerminal();
              }
              soundEngine.play('click');
            }}
            className={`m3-btn-sm cursor-pointer transition-all ${
              terminalOpen ? 'm3-btn-tonal' : 'm3-btn-outlined'
            }`}
            title={terminalOpen ? "Turn Off Terminal (~)" : "Turn On Terminal (~)"}
          >
            <i className="ri-terminal-box-line text-sm"></i>
            <span className="hidden sm:inline">Terminal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
