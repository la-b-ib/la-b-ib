import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import {
  EDUCATION_DATA,
  PUBLICATIONS_DATA,
  ORGANIZATIONS_DATA,
} from '../data/portfolioData';
import { PgpCryptoSandbox } from './PgpCryptoSandbox';

type IntelTab = 'academic' | 'dossier' | 'crypto';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IntelTab>('academic');
  const [copiedPgp, setCopiedPgp] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState({ d: 0, w: 0, m: 0, y: 0 });

  useEffect(() => {
    const updateCounter = () => {
      const startDate = new Date(2024, 5, 1); // June 1, 2024
      const now = new Date();

      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonthDays;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const weeks = Math.floor(days / 7);
      const remDays = days % 7;

      setElapsed({
        d: Math.max(0, remDays),
        w: Math.max(0, weeks),
        m: Math.max(0, months),
        y: Math.max(0, years),
      });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 60000);
    return () => clearInterval(interval);
  }, []);

  const pgpFingerprint = '4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2';

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyPgp = () => {
    navigator.clipboard.writeText(pgpFingerprint);
    setCopiedPgp(true);
    soundEngine.play('click');
    showNotification('PGP Public Key Fingerprint copied to clipboard');
    setTimeout(() => setCopiedPgp(false), 2500);
  };

  return (
    <section id="about" className="pt-[15px] px-[15px] pb-0 border-b-0 bg-[#0f0e13] relative scroll-mt-28 font-mono text-white">
      <div className="max-w-7xl mx-auto px-0 space-y-8">
        
        {/* TOP COMMAND HUD HEADER */}
        <div className="border-b border-[#44474f]/30 pb-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-[#a8c7fa] uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
                <span>STRAT-ACAD</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                Intel Brief
              </h2>
              <p className="text-xs sm:text-sm text-[#c4c6d0] max-w-3xl font-sans leading-relaxed">
                Anchored in rigorous computer science theory from BRAC University, published peer-reviewed IEEE research, and industry-grade systems security architecture.
              </p>
            </div>
          </div>

          {/* Academic & Operational Metrics Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="bg-[#1a1b21] border border-[#44474f]/30 p-2.5 rounded-xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00522b]/30 border border-[#a8e6cf]/30 flex items-center justify-center text-[#a8e6cf] text-sm shrink-0">
                <i className="ri-graduation-cap-line"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-[#8e9199] uppercase truncate">Academic Standing</div>
                <div className="text-xs font-bold text-[#a8e6cf] truncate">B.Sc. CSE (3.12 GPA)</div>
              </div>
            </div>

            <div className="bg-[#1a1b21] border border-[#44474f]/30 p-2.5 rounded-xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#381e72]/30 border border-[#d0bcff]/30 flex items-center justify-center text-[#d0bcff] text-sm shrink-0">
                <i className="ri-article-line"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-[#8e9199] uppercase truncate">IEEE Research</div>
                <div className="text-xs font-bold text-[#d0bcff] truncate">Xplore Published</div>
              </div>
            </div>

            <div className="bg-[#1a1b21] border border-[#44474f]/30 p-2.5 rounded-xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#004a77]/30 border border-[#a8c7fa]/30 flex items-center justify-center text-[#a8c7fa] text-sm shrink-0">
                <i className="ri-building-line"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-[#8e9199] uppercase truncate">Secretariat Leadership</div>
                <div className="text-xs font-bold text-[#a8c7fa] truncate">IEEE CS President</div>
              </div>
            </div>

            <div className="bg-[#1a1b21] border border-[#44474f]/30 p-2.5 rounded-xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#60000e]/40 border border-[#ffb4ab]/30 flex items-center justify-center text-[#ffb4ab] text-sm shrink-0">
                <i className="ri-shield-check-line"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-[#8e9199] uppercase truncate">Global Honor</div>
                <div className="text-xs font-bold text-[#ffb4ab] truncate">Duke of Edinburgh Gold</div>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY INTEL NAVIGATION TABS - SLIDER CAPSULE IDENTICAL TO LIVE INCIDENT */}
        <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] w-full">
          <button
            onClick={() => {
              setActiveTab('academic');
              soundEngine.play('click');
            }}
            title="Academic & Executive"
            aria-label="Academic & Executive"
            className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center ${
              activeTab === 'academic'
                ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
                : 'text-[#c4c6d0] hover:text-white'
            }`}
          >
            <i className="ri-graduation-cap-line text-lg"></i>
          </button>

          <button
            onClick={() => {
              setActiveTab('dossier');
              soundEngine.play('click');
            }}
            title="Research"
            aria-label="Research"
            className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center ${
              activeTab === 'dossier'
                ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
                : 'text-[#c4c6d0] hover:text-white'
            }`}
          >
            <i className="ri-article-line text-lg"></i>
          </button>

          <button
            onClick={() => {
              setActiveTab('crypto');
              soundEngine.play('click');
            }}
            title="PGP Sandbox"
            aria-label="PGP Sandbox"
            className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center ${
              activeTab === 'crypto'
                ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
                : 'text-[#c4c6d0] hover:text-white'
            }`}
          >
            <i className="ri-key-2-line text-lg"></i>
          </button>
        </div>

        {/* WORKSTATION VIEW CONTAINER: ONLY THE ACTIVE TAB ITEM IS SHOWN FULL-WIDTH */}
        <div className="w-full">
          
          {/* TAB 1: ACADEMIC EXCELLENCE & RESEARCH DOSSIER */}
          {activeTab === 'academic' && (
            <div className="space-y-10 animate-fadeIn font-mono pt-2">
              
              {/* 1. BRAC University Degree Header */}
              <div className="space-y-6">
                <div className="h-[45px] border-b border-[#44474f]/30 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-[45px] h-[45px] rounded-[14px] bg-[#d0bcff] text-[#381e72] border-0 shadow-md flex items-center justify-center text-xl font-bold shrink-0">
                      <i className="ri-community-line"></i>
                    </div>
                    <div className="flex-1 min-w-0 -ml-[5px]">
                      <h3 className="text-xl sm:text-2xl font-bold text-white truncate leading-[25px]">
                        {EDUCATION_DATA.institution}
                      </h3>
                      <div className="flex items-center justify-between gap-4 mt-1">
                        <span className="text-[12px] leading-[18px] font-semibold text-[#a8c7fa] truncate">
                          {EDUCATION_DATA.degree}
                        </span>
                        <div className="flex items-center text-xs sm:text-sm text-[#9CA3AF] font-mono font-medium tracking-wide shrink-0">
                          <span>{elapsed.y}y</span>
                          <span className="mx-1 opacity-70">:</span>
                          <span>{elapsed.m}m</span>
                          <span className="mx-1 opacity-70">:</span>
                          <span>{elapsed.w}w</span>
                          <span className="mx-1 opacity-70">:</span>
                          <span>{elapsed.d}d</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Key Academic & Technical Cards Grid (2 cards side by side in a row) */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                  
                  {/* Card 1: CGPA */}
                  <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
                    <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#fdd663]">
                        <div
                          className="w-[28px] h-[28px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center text-base font-bold shadow-sm"
                          title="CGPA Metrics"
                        >
                          <i className="ri-trophy-line"></i>
                        </div>
                        <span>CGPA</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">US Scale</span>
                    </div>
                    <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                      <span className="text-xl sm:text-2xl font-bold text-[#fdd663] font-mono tracking-tight">3.12</span>
                      <span className="text-xs sm:text-sm text-[#8e9199] font-mono">/ 4.00</span>
                    </div>
                  </div>

                  {/* Card 2: LANGUAGES */}
                  <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
                    <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#d0bcff]">
                        <div
                          className="w-[28px] h-[28px] shrink-0 rounded-lg bg-[#d0bcff] text-[#381e72] flex items-center justify-center text-base font-bold shadow-sm"
                          title="Languages"
                        >
                          <i className="ri-java-line"></i>
                        </div>
                        <span>LANGUAGES</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">CORE</span>
                    </div>
                    <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-1.5 text-[11px] sm:text-xs text-[#c4c6d0] font-mono leading-relaxed truncate flex items-center">
                      Java, Python, C++
                    </div>
                  </div>

                  {/* Card 3: DFIR */}
                  <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
                    <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#a8c7fa]">
                        <div
                          className="w-[28px] h-[28px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm"
                          title="DFIR"
                        >
                          <i className="ri-git-repository-private-line"></i>
                        </div>
                        <span className="truncate">DFIR</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">SEC</span>
                    </div>
                    <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-1.5 text-[11px] sm:text-xs text-[#c4c6d0] font-mono leading-relaxed truncate flex items-center">
                      Wireshark, eBPF
                    </div>
                  </div>

                  {/* Card 4: ARCH */}
                  <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
                    <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#ffb4ab]">
                        <div
                          className="w-[28px] h-[28px] shrink-0 rounded-lg bg-[#ffb4ab] text-[#561e18] flex items-center justify-center text-base font-bold shadow-sm"
                          title="Architecture"
                        >
                          <i className="ri-pass-expired-line"></i>
                        </div>
                        <span className="truncate">ARCH</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">SYS</span>
                    </div>
                    <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-1.5 text-[11px] sm:text-xs text-[#c4c6d0] font-mono leading-relaxed truncate flex items-center">
                      mTLS 1.3, Redis L2
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: RESEARCH & PEER-REVIEWED PUBLICATIONS */}
          {activeTab === 'dossier' && (
            <div className="space-y-8 animate-fadeIn font-mono pt-2">
              
              {/* Published Conference Papers & Research Indexing */}
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#381e72]/40 border border-[#d0bcff]/40 flex items-center justify-center text-[#d0bcff] text-lg shrink-0">
                      <i className="ri-article-line"></i>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#d0bcff] font-bold uppercase tracking-wider">
                        PEER-REVIEWED PUBLICATIONS
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        Published Conference Papers & IEEE DOIs
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Publications Grid */}
                <div className="grid grid-cols-1 gap-3.5">
                  {PUBLICATIONS_DATA.map((pub) => (
                    <div
                      key={pub.id}
                      className="p-5 rounded-2xl border border-[#44474f]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#a8c7fa] bg-[#1a1b21]/40 hover:bg-[#1a1b21]/80 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#004a77]/40 text-[#c2e7ff] text-[9px] font-bold border border-[#a8c7fa]/30">
                            {pub.conference}
                          </span>
                          <span className="text-[10px] text-[#8e9199]">{pub.date}</span>
                        </div>
                        <h6 className="text-sm sm:text-base font-bold text-white">
                          {pub.title}
                        </h6>
                        <div className="text-xs text-[#8e9199]">
                          ISBN: <span className="text-white font-mono">{pub.isbn}</span> • Location: {pub.location}
                        </div>
                      </div>

                      <a
                        href={pub.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEngine.play('click')}
                        className="px-5 py-2.5 rounded-xl bg-[#004a77] hover:bg-[#005a91] text-[#c2e7ff] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#a8c7fa]/30 transition-all shrink-0 cursor-pointer"
                      >
                        <i className="ri-external-link-line text-xs"></i>
                        <span>VIEW IEEE XPLORE PAPER</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CRYPTO SANDBOX */}
          {activeTab === 'crypto' && (
            <div className="animate-fadeIn">
              <PgpCryptoSandbox />
            </div>
          )}

        </div>

      </div>

      {/* Global Section Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-[#1a1b21] border border-[#a8c7fa] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-mono animate-fadeIn">
          <i className="ri-checkbox-circle-fill text-[#a8e6cf] text-sm"></i>
          <span>{toastMsg}</span>
        </div>
      )}
    </section>
  );
};
