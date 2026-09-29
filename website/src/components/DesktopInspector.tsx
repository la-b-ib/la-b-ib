import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface DesktopInspectorProps {
  latency?: number;
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenTerminal: () => void;
  onOpenCtf: () => void;
  sfxActive: boolean;
  onToggleSfx: () => void;
  crtActive: boolean;
  onToggleCrt: () => void;
}

const SECTIONS = [
  { id: 'hero', label: 'HERO', num: '01', icon: 'ri-radar-line' },
  { id: 'about', label: 'ABOUT', num: '02', icon: 'ri-user-search-line' },
  { id: 'threat-map', label: 'THREAT MAP', num: '03', icon: 'ri-global-line' },
  { id: 'experience', label: 'MISSIONS', num: '04', icon: 'ri-briefcase-4-line' },
  { id: 'skills', label: 'ARSENAL', num: '05', icon: 'ri-tools-line' },
  { id: 'projects', label: 'CASEFILES', num: '06', icon: 'ri-folder-keyhole-line' },
  { id: 'certificates', label: 'CERTS', num: '07', icon: 'ri-award-line' },
  { id: 'dispatch', label: 'DISPATCH', num: '08', icon: 'ri-newspaper-line' },
  { id: 'contact', label: 'CONTACT', num: '09', icon: 'ri-mail-send-line' },
];

export const DesktopInspector: React.FC<DesktopInspectorProps> = ({
  latency = 14,
  activeSection,
  onNavigate,
  onOpenTerminal,
  onOpenCtf,
  sfxActive,
  onToggleSfx,
  crtActive,
  onToggleCrt,
}) => {
  const [logs, setLogs] = useState<string[]>([
    'mTLS handshake established with node-02.',
    'Zero-Trust Heuristics verified.',
    'PGP RSA-4096 signature intact.',
    'Telemetry stream sync OK.',
  ]);

  useEffect(() => {
    const feed = [
      'Encrypted socket heartbeat acknowledged.',
      'Memory bounds check: 0 buffer anomalies.',
      'Threat Radar query: 0 active infiltrations.',
      'DFIR audit ledger synchronized.',
      'Subsystem latency nominal.',
      'SHA-256 payload checksum confirmed.',
    ];

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextMsg = feed[Math.floor(Math.random() * feed.length)];
        return [nextMsg, ...prev.slice(0, 4)];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      aria-label="Desktop SOC Operations Inspector"
      className="hidden xl:flex flex-col justify-between w-[370px] 2xl:w-[400px] h-[824px] xl:h-[836px] max-h-[90dvh] bg-[#13141a]/95 border border-[#44474f]/40 rounded-3xl p-5 shadow-2xl backdrop-blur-xl font-mono text-[#e3e2e6] select-none shrink-0"
    >
      {/* Top Header: System Spec & Node Health */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#a8e6cf] animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-[#a8e6cf]">
              SOC_OPS_ONLINE
            </span>
          </div>
          <span className="text-[11px] text-[#8e9199]">
            DEVICE: <span className="text-[#a8c7fa] font-bold">IPHONE_15_PRO</span>
          </span>
        </div>

        {/* Remote Command Matrix Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#a8e6cf]/10 text-[#a8e6cf] text-[10.5px] font-bold border border-[#a8e6cf]/20 tracking-wider">
            <i className="ri-remote-control-line text-sm"></i>
            FIELD TERMINAL CONTROLLER
          </div>
          <h2 className="text-sm font-bold text-white font-sans tracking-tight">
            Live Section Remote Switcher
          </h2>
          <p className="text-[11px] text-[#8e9199] leading-snug">
            Click any section below to drive the iPhone display instantly.
          </p>
        </div>

        {/* Section Remote Grid */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  soundEngine.play('click');
                  onNavigate(sec.id);
                }}
                className={`h-11 px-2 rounded-xl border text-left flex flex-col justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#a8c7fa] text-[#00325b] border-[#a8c7fa] shadow-md font-bold'
                    : 'bg-[#21232b] text-[#c4c7c5] border-[#44474f]/40 hover:border-[#a8c7fa]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] opacity-75">
                  <span>{sec.num}</span>
                  <i className={`${sec.icon} text-[10px]`}></i>
                </div>
                <span className="text-[10px] leading-tight font-bold truncate">
                  {sec.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Operations Actions */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold tracking-wider text-[#8e9199] block">
            QUICK OPERATIONS
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundEngine.play('click');
                onOpenTerminal();
              }}
              className="h-10 bg-[#21232b] hover:bg-[#2b2d36] border border-[#44474f]/50 hover:border-[#a8c7fa]/60 rounded-xl px-2.5 flex items-center justify-between text-[11px] text-white transition-all cursor-pointer shadow-sm group"
            >
              <span className="flex items-center gap-1.5 text-[#a8c7fa] group-hover:text-white">
                <i className="ri-terminal-box-line text-sm"></i>
                <span>CLI TERMINAL</span>
              </span>
              <span className="text-[9px] text-[#8e9199] font-mono group-hover:text-[#a8c7fa]">
                [&gt;_]
              </span>
            </button>

            <button
              onClick={() => {
                soundEngine.play('click');
                onOpenCtf();
              }}
              className="h-10 bg-[#21232b] hover:bg-[#2b2d36] border border-[#44474f]/50 hover:border-[#ffb4ab]/60 rounded-xl px-2.5 flex items-center justify-between text-[11px] text-white transition-all cursor-pointer shadow-sm group"
            >
              <span className="flex items-center gap-1.5 text-[#ffb4ab] group-hover:text-white">
                <i className="ri-flag-line text-sm"></i>
                <span>CTF CRACK</span>
              </span>
              <span className="text-[9px] text-[#8e9199] font-mono group-hover:text-[#ffb4ab]">
                [KEY]
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Center/Bottom: Live Telemetry Stream & System Toggles */}
      <div className="space-y-3 pt-3 border-t border-[#44474f]/30">
        {/* Hardware & Environment Toggles */}
        <div className="flex items-center justify-between bg-[#090b10] border border-[#44474f]/30 rounded-xl p-2 text-[10px]">
          <button
            onClick={() => {
              soundEngine.play('click');
              onToggleSfx();
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#21232b] text-[#8e9199] hover:text-white transition-colors cursor-pointer"
          >
            <i className={`ri-volume-${sfxActive ? 'up' : 'mute'}-line text-xs ${sfxActive ? 'text-[#a8e6cf]' : 'text-[#ffb4ab]'}`}></i>
            <span>SFX: <strong className={sfxActive ? 'text-[#a8e6cf]' : 'text-[#ffb4ab]'}>{sfxActive ? 'ON' : 'OFF'}</strong></span>
          </button>

          <button
            onClick={() => {
              soundEngine.play('click');
              onToggleCrt();
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#21232b] text-[#8e9199] hover:text-white transition-colors cursor-pointer"
          >
            <i className={`ri-tv-line text-xs ${crtActive ? 'text-[#a8c7fa]' : 'text-[#8e9199]'}`}></i>
            <span>CRT: <strong className={crtActive ? 'text-[#a8c7fa]' : 'text-[#8e9199]'}>{crtActive ? 'ON' : 'OFF'}</strong></span>
          </button>

          <span className="text-[#8e9199] px-2 py-1 font-bold">
            LATENCY: <strong className="text-[#a8c7fa]">{latency}ms</strong>
          </span>
        </div>

        {/* Live Heuristic Logs Stream */}
        <div className="bg-[#090b10] border border-[#44474f]/30 rounded-2xl p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[9px] text-[#8e9199] border-b border-[#44474f]/20 pb-1">
            <span className="flex items-center gap-1 text-[#a8c7fa]">
              <i className="ri-shield-check-line"></i>
              <span>HEURISTIC EVENT LOG</span>
            </span>
            <span className="font-mono">ENCRYPTED</span>
          </div>
          <div className="space-y-1 text-[10px] leading-tight font-mono text-[#8e9199]">
            {logs.map((log, idx) => (
              <div key={idx} className="truncate flex items-center gap-1">
                <span className="text-[#a8c7fa] select-none">›</span>
                <span className={idx === 0 ? 'text-white' : 'opacity-80'}>{log}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#8e9199] pt-1">
          <span>ARCH: ZERO-TRUST 2026</span>
          <span className="text-[#a8c7fa] font-bold">LABIB B. SHAHED</span>
        </div>
      </div>
    </aside>
  );
};
