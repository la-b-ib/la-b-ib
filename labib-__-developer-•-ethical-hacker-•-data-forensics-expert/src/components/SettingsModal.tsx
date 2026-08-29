import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sfxActive: boolean;
  onToggleSfx: () => void;
  crtActive: boolean;
  onToggleCrt: () => void;
  onOpenTerminal: () => void;
  onOpenCtf: () => void;
  onOpenSearch: () => void;
  latency?: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  sfxActive,
  onToggleSfx,
  crtActive,
  onToggleCrt,
  onOpenTerminal,
  onOpenCtf,
  onOpenSearch,
  latency = 14,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('oled');
  const [resetNotice, setResetNotice] = useState<string>('');

  if (!isOpen) return null;

  const handleSoundTest = (soundName: 'click' | 'terminal_key' | 'success' | 'access_granted' | 'error' | 'alert') => {
    soundEngine.play(soundName);
  };

  const handleResetDefaults = () => {
    soundEngine.play('click');
    setResetNotice('System settings restored to factory defaults.');
    setTimeout(() => {
      setResetNotice('');
    }, 3000);
  };

  return (
    <section className="w-full flex-1 flex flex-col bg-[#0f0e13] min-h-full border-t border-white/10 text-white font-sans animate-fadeIn">
      {/* Settings Section Header Bar */}
      <div className="bg-[#1a1b21] px-4 py-3 border-b border-[#44474f]/30 flex items-center justify-between select-none">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-semibold text-white flex items-center space-x-2">
            <i className="ri-settings-4-line text-[#a8c7fa] text-base animate-spin-slow"></i>
            <span className="tracking-widest uppercase">SYSTEM SETTINGS & PREFERENCES</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#004a77] text-[#c2e7ff] border border-[#a8c7fa]/30">
            CONFIG v2.4
          </span>
        </div>

        <button
          onClick={() => {
            soundEngine.play('click');
            onClose();
          }}
          className="text-gray-400 hover:text-white bg-[#2b2930] hover:bg-[#36343b] px-3 py-1 rounded-full text-xs font-mono border border-[#49454f]/40 flex items-center space-x-1 transition-all cursor-pointer"
        >
          <span>CLOSE</span>
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      {/* Main Settings Content Area */}
      <div className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto pb-24">
        {/* Intro Banner */}
        <div className="bg-[#141218] border border-[#49454f]/40 rounded-2xl p-4 flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#004a77]/50 border border-[#a8c7fa]/40 flex items-center justify-center shrink-0 text-[#a8c7fa]">
            <i className="ri-sliders-line text-xl"></i>
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#e3e2e6]">Control Panel & Environment Toggles</h2>
            <p className="text-xs text-[#8e9199] mt-0.5">
              Customize audio feedback, visual overlays, security telemetry, and quick diagnostic tools.
            </p>
          </div>
        </div>

        {resetNotice && (
          <div className="bg-[#00522b]/40 border border-[#2dd4bf]/40 text-[#c6f6d5] p-3 rounded-xl text-xs font-mono flex items-center space-x-2 animate-fadeIn">
            <i className="ri-checkbox-circle-line text-base text-[#2dd4bf]"></i>
            <span>{resetNotice}</span>
          </div>
        )}

        {/* Setting Group 1: Audio & Sound System */}
        <div className="bg-[#18161d] border border-[#49454f]/30 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#49454f]/20 pb-3">
            <div className="flex items-center space-x-2">
              <i className="ri-volume-up-line text-lg text-[#a8c7fa]"></i>
              <h3 className="text-xs font-mono font-bold uppercase text-[#e3e2e6]">Audio & Sound Effects</h3>
            </div>
            <button
              onClick={() => {
                onToggleSfx();
                soundEngine.play('click');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                sfxActive
                  ? 'bg-[#004a77] text-[#c2e7ff] border border-[#a8c7fa]/50'
                  : 'bg-[#2b2930] text-[#8e9199] border border-[#49454f]/40'
              }`}
            >
              <i className={sfxActive ? 'ri-toggle-fill text-lg text-[#2dd4bf]' : 'ri-toggle-line text-lg'}></i>
              <span>{sfxActive ? 'ENABLED' : 'DISABLED'}</span>
            </button>
          </div>

          <p className="text-xs text-[#a5a7b0]">
            Synthesizer audio feedback for UI button clicks, error alerts, and security validation cues.
          </p>

          {/* Sound Test Panel */}
          <div className="bg-[#100f14] p-3 rounded-xl border border-[#49454f]/20 space-y-2">
            <div className="text-[11px] font-mono text-[#8e9199] uppercase tracking-wider">Test Audio Signals:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSoundTest('click')}
                className="px-3 py-1.5 rounded-lg bg-[#2b2930] hover:bg-[#36343b] border border-[#49454f]/40 text-xs text-[#e3e2e6] font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <i className="ri-play-circle-line text-xs text-[#a8c7fa]"></i>
                <span>Click Pulse</span>
              </button>
              <button
                onClick={() => handleSoundTest('access_granted')}
                className="px-3 py-1.5 rounded-lg bg-[#2b2930] hover:bg-[#36343b] border border-[#49454f]/40 text-xs text-[#e3e2e6] font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <i className="ri-checkbox-circle-line text-xs text-[#2dd4bf]"></i>
                <span>Access Granted</span>
              </button>
              <button
                onClick={() => handleSoundTest('error')}
                className="px-3 py-1.5 rounded-lg bg-[#2b2930] hover:bg-[#36343b] border border-[#49454f]/40 text-xs text-[#e3e2e6] font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <i className="ri-error-warning-line text-xs text-[#ff8383]"></i>
                <span>Security Alert</span>
              </button>
            </div>
          </div>
        </div>

        {/* Setting Group 2: Visual Overlay & CRT FX */}
        <div className="bg-[#18161d] border border-[#49454f]/30 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#49454f]/20 pb-3">
            <div className="flex items-center space-x-2">
              <i className="ri-tv-2-line text-lg text-[#2dd4bf]"></i>
              <h3 className="text-xs font-mono font-bold uppercase text-[#e3e2e6]">CRT Threat Overlay</h3>
            </div>
            <button
              onClick={() => {
                onToggleCrt();
                soundEngine.play('click');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                crtActive
                  ? 'bg-[#004a77] text-[#c2e7ff] border border-[#a8c7fa]/50'
                  : 'bg-[#2b2930] text-[#8e9199] border border-[#49454f]/40'
              }`}
            >
              <i className={crtActive ? 'ri-toggle-fill text-lg text-[#2dd4bf]' : 'ri-toggle-line text-lg'}></i>
              <span>{crtActive ? 'ACTIVE' : 'INACTIVE'}</span>
            </button>
          </div>

          <p className="text-xs text-[#a5a7b0]">
            Toggles retro scanline shader effects on interactive telemetry displays such as the Cyber Threat Map.
          </p>

          {/* Theme Palette Selectors */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-[#8e9199] uppercase tracking-wider">HUD Palette Preset:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'oled', label: 'Tactical OLED', color: 'bg-[#9c88ff]' },
                { id: 'matrix', label: 'Matrix Emerald', color: 'bg-[#2dd4bf]' },
                { id: 'cyan', label: 'Sub-Zero Cyan', color: 'bg-[#00c6ff]' },
                { id: 'amber', label: 'Solar Amber', color: 'bg-[#f59e0b]' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    soundEngine.play('click');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedTheme === theme.id
                      ? 'bg-[#211f26] border-[#a8c7fa] text-white'
                      : 'bg-[#100f14] border-[#49454f]/30 text-[#8e9199] hover:bg-[#1a1820]'
                  }`}
                >
                  <span className="text-xs font-mono font-medium">{theme.label}</span>
                  <span className={`w-3 h-3 rounded-full ${theme.color}`}></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Setting Group 3: Quick Terminal & Tools Shortcuts */}
        <div className="bg-[#18161d] border border-[#49454f]/30 rounded-2xl p-4 space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#49454f]/20 pb-3">
            <i className="ri-terminal-box-line text-lg text-[#ffb870]"></i>
            <h3 className="text-xs font-mono font-bold uppercase text-[#e3e2e6]">Quick Security Tools</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                soundEngine.play('click');
                onOpenTerminal();
              }}
              className="p-3 bg-[#100f14] hover:bg-[#1a1820] border border-[#49454f]/30 hover:border-[#a8c7fa]/60 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <i className="ri-terminal-line text-lg text-[#a8c7fa]"></i>
                <i className="ri-arrow-right-up-line text-xs text-gray-500 group-hover:text-white"></i>
              </div>
              <div className="mt-2 text-xs font-mono font-bold text-[#e3e2e6]">CLI Terminal</div>
              <div className="text-[11px] text-[#8e9199]">Shell commands & CTF hints</div>
            </button>

            <button
              onClick={() => {
                soundEngine.play('click');
                onOpenCtf();
              }}
              className="p-3 bg-[#100f14] hover:bg-[#1a1820] border border-[#49454f]/30 hover:border-[#ffb870]/60 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <i className="ri-flag-2-line text-lg text-[#ffb870]"></i>
                <i className="ri-arrow-right-up-line text-xs text-gray-500 group-hover:text-white"></i>
              </div>
              <div className="mt-2 text-xs font-mono font-bold text-[#e3e2e6]">CTF Challenge</div>
              <div className="text-[11px] text-[#8e9199]">Decrypt flag & test skills</div>
            </button>

            <button
              onClick={() => {
                soundEngine.play('click');
                onOpenSearch();
              }}
              className="p-3 bg-[#100f14] hover:bg-[#1a1820] border border-[#49454f]/30 hover:border-[#2dd4bf]/60 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <i className="ri-search-line text-lg text-[#2dd4bf]"></i>
                <i className="ri-arrow-right-up-line text-xs text-gray-500 group-hover:text-white"></i>
              </div>
              <div className="mt-2 text-xs font-mono font-bold text-[#e3e2e6]">Command Search</div>
              <div className="text-[11px] text-[#8e9199]">Query index & casefiles</div>
            </button>
          </div>
        </div>

        {/* Setting Group 4: System Telemetry & Factory Reset */}
        <div className="bg-[#18161d] border border-[#49454f]/30 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#49454f]/20 pb-3">
            <div className="flex items-center space-x-2">
              <i className="ri-[#2dd4bf] ri-shield-check-line text-lg text-[#34a853]"></i>
              <h3 className="text-xs font-mono font-bold uppercase text-[#e3e2e6]">System Status & Telemetry</h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00522b]/40 text-[#c6f6d5] border border-[#34a853]/40">
              HEALTHY
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-[#100f14] p-3 rounded-xl border border-[#49454f]/20">
              <span className="text-[#8e9199] block text-[10px] uppercase">Latency</span>
              <span className="text-[#c2e7ff] font-bold">{latency} ms</span>
            </div>
            <div className="bg-[#100f14] p-3 rounded-xl border border-[#49454f]/20">
              <span className="text-[#8e9199] block text-[10px] uppercase">Protocol</span>
              <span className="text-[#34a853] font-bold">Zero Trust L5</span>
            </div>
            <div className="bg-[#100f14] p-3 rounded-xl border border-[#49454f]/20 col-span-2 sm:col-span-1">
              <span className="text-[#8e9199] block text-[10px] uppercase">Encryption</span>
              <span className="text-[#a8c7fa] font-bold">AES-GCM-256</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-xl bg-[#211f26] hover:bg-[#2b2930] text-[#ff8383] border border-[#ff8383]/30 text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer"
            >
              <i className="ri-refresh-line text-sm"></i>
              <span>Restore Default Config</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
