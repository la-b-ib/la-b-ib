import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface FooterProps {
  onNavigate?: (section: string) => void;
  onOpenTerminal?: () => void;
  onOpenCtf?: () => void;
  latency?: number;
  activeSection?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTerminal,
  onOpenCtf,
  latency = 14,
  activeSection,
}) => {
  const [copiedPgp, setCopiedPgp] = useState(false);
  const pgpFingerprint = '4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2';

  const scrollToTop = () => {
    soundEngine.play('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (sectionId: string) => {
    soundEngine.play('click');
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyPgpKey = () => {
    navigator.clipboard.writeText(pgpFingerprint);
    soundEngine.play('click');
    setCopiedPgp(true);
    setTimeout(() => setCopiedPgp(false), 3000);
  };

  return (
    <footer className={`w-full bg-[#0a0a0e] border-0 ${activeSection === 'hero' ? 'pt-[15px]' : 'pt-6 sm:pt-8'} pb-[81px] lg:pb-8 text-xs font-mono text-[#8e9199] relative z-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* M3 Expressive Container for Operations & Telemetry */}
        <div className="bg-[#141218] p-4 sm:p-6 rounded-2xl border border-[#44474f]/40 space-y-6 text-[11px] font-mono">
          
          {/* Row 1: SOC NODE : ONLINE & BUILD */}
          <div className="flex items-center justify-between gap-3 text-[#c4c6d0]">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#00522b]/40 text-[#a8e6cf] border border-[#a8e6cf]/30 font-bold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a8e6cf] animate-pulse"></span>
              <span>SOC NODE : ONLINE</span>
            </span>

            <div className="flex items-center space-x-2 text-[#8e9199] shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-ping"></span>
              <span>BUILD: v8.2.4</span>
            </div>
          </div>

          {/* Copyright Line */}
          <div>
            <span className="text-white font-bold tracking-tight flex items-center gap-1">
              <i className="ri-copyright-line text-xs"></i>
              <span>2026 LABIB BIN SHAHED • ALL RIGHTS RESERVED.</span>
            </span>
          </div>

          {/* Row 2: Latency & PGP */}
          <div className="grid grid-cols-2 max-w-sm gap-x-6 gap-y-2 text-xs text-[#8e9199] pb-4 border-b border-[#44474f]/30">
            <span className="flex items-center space-x-1">
              <i className="ri-router-line text-[#a8e6cf] text-sm"></i>
              <strong className="text-[#a8e6cf]">{latency}ms</strong>
            </span>
            <button
              onClick={copyPgpKey}
              className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer text-left"
              title={copiedPgp ? 'PGP Public Key Copied!' : 'Click to Copy PGP Public Key (0x9E8C41A2)'}
            >
              <i className={`${copiedPgp ? 'ri-clipboard-line text-[#a8e6cf]' : 'ri-key-2-line text-[#a8e6cf]'} text-sm`}></i>
              <span>{copiedPgp ? <span className="text-[#a8e6cf] font-bold">COPIED!</span> : <>PGP: <span className="text-[#a8c7fa]">0x9E8C41A2</span></>}</span>
            </button>
          </div>

          {/* Bottom Row inside Container: Core Operations Nav */}
          <div>
            <div className="space-y-2.5 font-sans">
              <div className="text-xs font-mono font-bold text-[#a8c7fa] uppercase tracking-wider flex items-center space-x-1.5">
                <i className="ri-compass-3-line"></i>
                <span>CORE OPERATIONS</span>
              </div>
              <ul className="grid grid-cols-2 max-w-sm gap-x-6 gap-y-2 text-xs">
                <li>
                  <button
                    onClick={() => handleNav('hero')}
                    className="hover:text-white text-[#c4c6d0] transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-[#a8c7fa] shrink-0"></i>
                    <span>Mission Control</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('about')}
                    className="hover:text-white text-[#c4c6d0] transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-[#a8c7fa] shrink-0"></i>
                    <span>Briefing</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('threat-map')}
                    className="hover:text-white text-[#c4c6d0] transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-[#a8c7fa] shrink-0"></i>
                    <span>Threat Radar</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('contact')}
                    className="hover:text-white text-[#c4c6d0] transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-[#a8c7fa] shrink-0"></i>
                    <span>Contact</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
