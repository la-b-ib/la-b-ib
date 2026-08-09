import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface HeroSectionProps {
  onOpenTerminal: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTerminal, onNavigate }) => {
  // Metric Card Interactive State
  const [activeMetricCard, setActiveMetricCard] = useState<'VULNS' | 'RAM' | 'UPTIME' | 'CERTS' | null>(null);

  // Decipher / Scramble animation state
  const targetText = 'Bin Shahed';
  const [displayText, setDisplayText] = useState(targetText);

  const runDecipher = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!_';
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < iteration) return targetText[idx];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 35);
  };

  useEffect(() => {
    runDecipher();
  }, []);

  // Typewriter effect state
  const phrases = [
    'Architecting Zero-Trust Cloud Platforms',
    'Reverse Engineering Kernel Rootkits & Ransomware',
    'Performing Physical RAM Memory Forensics',
    'Conducting Red Team Penetration Testing',
    'Building High-Throughput Go, Rust & React Backends',
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIdx < currentPhrase.length) {
      timeout = setTimeout(() => setCharIdx(charIdx + 1), 50);
    } else if (!isDeleting && charIdx === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(charIdx - 1), 30);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhraseIdx((phraseIdx + 1) % phrases.length);
      timeout = setTimeout(() => {}, 400);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx, phrases]);

  // Live Hash Generator state
  const [hashInput, setHashInput] = useState("2bORnot2beThat'stHE?");
  const [sha256Hash, setSha256Hash] = useState('Calculating...');
  const [base64Val, setBase64Val] = useState('');

  const computeHashes = async (text: string) => {
    if (!text) {
      setSha256Hash('--------------------------------');
      setBase64Val('');
      return;
    }
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setSha256Hash(hex);
      setBase64Val(btoa(text));
    } catch {
      setSha256Hash('Crypto Unavailable');
    }
  };

  useEffect(() => {
    computeHashes(hashInput);
  }, [hashInput]);

  // Telemetry stream logs
  const [streamLogs, setStreamLogs] = useState([
    { time: '10:00:01', tag: 'OK', tagClass: 'text-teal-400 bg-teal-500/10 border-teal-500/30', msg: 'Zero-Trust policy active: 100% compliant.' },
    { time: '10:00:04', tag: 'SEC', tagClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30', msg: 'Port scan payload blocked by WAF filter.' },
    { time: '10:00:08', tag: 'INFO', tagClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', msg: 'eBPF probe captured sys_execve() PID 4092.' },
    { time: '10:00:12', tag: 'OK', tagClass: 'text-teal-400 bg-teal-500/10 border-teal-500/30', msg: 'mTLS handshake verified for node-02.' },
    { time: '10:00:15', tag: 'SEC', tagClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30', msg: 'Unauthorized bearer token rejected on /api/v1/vault.' },
  ]);

  useEffect(() => {
    const sampleEvents = [
      { tag: 'OK', tagClass: 'text-teal-400 bg-teal-500/10 border-teal-500/30', msg: 'Memory RAM dump scan complete: 0 rootkits detected.' },
      { tag: 'SEC', tagClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30', msg: 'Unauthorized bearer token rejected on /api/v1/vault.' },
      { tag: 'INFO', tagClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', msg: 'mTLS handshake verified for node-02.' },
      { tag: 'OK', tagClass: 'text-teal-400 bg-teal-500/10 border-teal-500/30', msg: 'FIDO2 passkey signature verified successfully.' },
      { tag: 'INFO', tagClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', msg: 'YARA scanner indexed 150 threat signatures.' },
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      const ev = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];

      setStreamLogs((prev) => [...prev.slice(-7), { time: timeStr, ...ev }]);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative pt-6 pb-0 border-b border-slate-800/80 overflow-hidden scroll-mt-28 bg-black">
      <div className="max-w-7xl mx-auto px-[15px] relative z-10 pb-0 mb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start pb-0 mb-0">
          
          {/* Left Column: Dossier Header & Title */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Name with Source Code Pro Black Typography & Decipher Effect */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-source-code-black tracking-tight text-slate-100 leading-tight">
              Labib{' '}
              <span
                onMouseEnter={() => {
                  runDecipher();
                  soundEngine.play('terminal_key');
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 cursor-pointer"
              >
                {displayText}
              </span>
            </h1>

            {/* Typewriter Subheading */}
            <div className="font-jetbrains text-xs sm:text-base md:text-lg text-teal-300/90 flex items-center space-x-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 min-h-[44px]">
              <span className="text-teal-400 font-bold">&gt;</span>
              <span className="leading-snug">{phrases[phraseIdx].substring(0, charIdx)}</span>
              <span className="w-2 h-5 bg-teal-400 animate-pulse inline-block shrink-0"></span>
            </div>

            {/* Core Summary Paragraph */}
            <p className="text-[#c4c6d0] text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
              Bridging the gap between <strong className="text-white font-semibold">high-performance full-stack engineering</strong>, <strong className="text-[#a8e6cf] font-semibold">offensive penetration testing</strong>, and <strong className="text-[#a8c7fa] font-semibold">digital forensic investigation</strong>. Building resilient zero-trust architectures, isolating kernel rootkits, and auditing critical infrastructure.
            </p>

            {/* Quick Metrics Grid - Material Design 3 Expressive Tonal Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {/* Card 1: Vulnerabilities Disclosed - M3 Google Green */}
              <div
                onClick={() => {
                  soundEngine.play('click');
                  setActiveMetricCard(activeMetricCard === 'VULNS' ? null : 'VULNS');
                }}
                className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group border ${
                  activeMetricCard === 'VULNS'
                    ? 'bg-[#00522b]/60 border-[#a8e6cf] ring-2 ring-[#a8e6cf]/30 shadow-lg'
                    : 'bg-[#1a1b21] hover:bg-[#21232b] border-[#44474f]/40 hover:border-[#a8e6cf]/60 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-xl bg-[#a8e6cf]/15 text-[#a8e6cf] border border-[#a8e6cf]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ri-bug-line text-sm"></i>
                  </div>
                  <span className="w-[72px] h-5 text-[9px] font-mono font-bold rounded bg-[#00522b]/80 text-[#a8e6cf] border border-[#a8e6cf]/30 inline-flex items-center justify-center shrink-0 uppercase">
                    CVE FEED
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-[#a8e6cf] mt-2 tracking-tight flex items-baseline justify-between">
                  <span>120+</span>
                  <i className="ri-arrow-right-up-line text-xs text-[#8e9199] group-hover:text-[#a8e6cf] transition-colors"></i>
                </div>
                <div className="text-[11px] font-medium text-[#c4c6d0] mt-1 leading-tight">
                  Vulnerabilities Disclosed
                </div>
                <div className="w-full bg-[#0f0e13] h-1 rounded-full mt-2 overflow-hidden flex border border-[#2f3640]">
                  <div className="bg-[#a8e6cf] h-full w-[85%] animate-pulse"></div>
                </div>
              </div>

              {/* Card 2: RAM Dumps Analyzed - M3 Google Blue */}
              <div
                onClick={() => {
                  soundEngine.play('click');
                  setActiveMetricCard(activeMetricCard === 'RAM' ? null : 'RAM');
                }}
                className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group border ${
                  activeMetricCard === 'RAM'
                    ? 'bg-[#004a77]/60 border-[#a8c7fa] ring-2 ring-[#a8c7fa]/30 shadow-lg'
                    : 'bg-[#1a1b21] hover:bg-[#21232b] border-[#44474f]/40 hover:border-[#a8c7fa]/60 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-xl bg-[#a8c7fa]/15 text-[#a8c7fa] border border-[#a8c7fa]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ri-cpu-line text-sm"></i>
                  </div>
                  <span className="w-[72px] h-5 text-[9px] font-mono font-bold rounded bg-[#004a77]/80 text-[#a8c7fa] border border-[#a8c7fa]/30 inline-flex items-center justify-center shrink-0 uppercase">
                    VOLATILITY
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-[#a8c7fa] mt-2 tracking-tight flex items-baseline justify-between">
                  <span>65+</span>
                  <i className="ri-arrow-right-up-line text-xs text-[#8e9199] group-hover:text-[#a8c7fa] transition-colors"></i>
                </div>
                <div className="text-[11px] font-medium text-[#c4c6d0] mt-1 leading-tight">
                  RAM Dumps Analyzed
                </div>
                <div className="w-full bg-[#0f0e13] h-1 rounded-full mt-2 overflow-hidden flex border border-[#2f3640]">
                  <div className="bg-[#a8c7fa] h-full w-[90%] animate-pulse"></div>
                </div>
              </div>

              {/* Card 3: Zero-Trust Uptime - M3 Google Amber/Yellow */}
              <div
                onClick={() => {
                  soundEngine.play('click');
                  setActiveMetricCard(activeMetricCard === 'UPTIME' ? null : 'UPTIME');
                }}
                className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group border ${
                  activeMetricCard === 'UPTIME'
                    ? 'bg-[#5a4300]/60 border-[#fdd663] ring-2 ring-[#fdd663]/30 shadow-lg'
                    : 'bg-[#1a1b21] hover:bg-[#21232b] border-[#44474f]/40 hover:border-[#fdd663]/60 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-xl bg-[#fdd663]/15 text-[#fdd663] border border-[#fdd663]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ri-shield-check-line text-sm"></i>
                  </div>
                  <span className="w-[72px] h-5 text-[9px] font-mono font-bold rounded bg-[#5a4300]/80 text-[#fdd663] border border-[#fdd663]/30 inline-flex items-center justify-center shrink-0 uppercase">
                    SLA
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-[#fdd663] mt-2 tracking-tight flex items-baseline justify-between">
                  <span>99.99%</span>
                  <i className="ri-arrow-right-up-line text-xs text-[#8e9199] group-hover:text-[#fdd663] transition-colors"></i>
                </div>
                <div className="text-[11px] font-medium text-[#c4c6d0] mt-1 leading-tight">
                  Zero-Trust Uptime
                </div>
                <div className="w-full bg-[#0f0e13] h-1 rounded-full mt-2 overflow-hidden flex border border-[#2f3640]">
                  <div className="bg-[#fdd663] h-full w-[99.99%]"></div>
                </div>
              </div>

              {/* Card 4: Sec & DFIR Certs - M3 Google Purple */}
              <div
                onClick={() => {
                  soundEngine.play('click');
                  setActiveMetricCard(activeMetricCard === 'CERTS' ? null : 'CERTS');
                }}
                className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group border ${
                  activeMetricCard === 'CERTS'
                    ? 'bg-[#381e72]/60 border-[#d0bcff] ring-2 ring-[#d0bcff]/30 shadow-lg'
                    : 'bg-[#1a1b21] hover:bg-[#21232b] border-[#44474f]/40 hover:border-[#d0bcff]/60 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-xl bg-[#d0bcff]/15 text-[#d0bcff] border border-[#d0bcff]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ri-award-line text-sm"></i>
                  </div>
                  <span className="w-[72px] h-5 text-[9px] font-mono font-bold rounded bg-[#381e72]/80 text-[#d0bcff] border border-[#d0bcff]/30 inline-flex items-center justify-center shrink-0 uppercase">
                    VERIFIED
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-[#d0bcff] mt-2 tracking-tight flex items-baseline justify-between">
                  <span>12+</span>
                  <i className="ri-arrow-right-up-line text-xs text-[#8e9199] group-hover:text-[#d0bcff] transition-colors"></i>
                </div>
                <div className="text-[11px] font-medium text-[#c4c6d0] mt-1 leading-tight">
                  Sec & DFIR Certs
                </div>
                <div className="w-full bg-[#0f0e13] h-1 rounded-full mt-2 overflow-hidden flex border border-[#2f3640]">
                  <div className="bg-[#d0bcff] h-full w-[92%] animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Expandable M3 Detail Drawer when a metric card is tapped */}
            {activeMetricCard && (
              <div className="bg-[#141218] border border-[#49454f]/50 rounded-2xl p-4 shadow-xl animate-fadeIn font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#49454f]/30 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-ping"></span>
                    <span className="font-bold text-white uppercase tracking-wider">
                      {activeMetricCard === 'VULNS' && 'CVE & Vulnerability Disclosure Index'}
                      {activeMetricCard === 'RAM' && 'Volatility 3 RAM Memory Forensics Catalog'}
                      {activeMetricCard === 'UPTIME' && 'Zero-Trust Architecture SLA & Telemetry Log'}
                      {activeMetricCard === 'CERTS' && 'Verified Cybersecurity & DFIR Credentials'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.play('click');
                      setActiveMetricCard(null);
                    }}
                    className="text-[#8e9199] hover:text-white p-1 rounded-lg hover:bg-[#21232b] transition-colors"
                  >
                    <i className="ri-close-line text-lg"></i>
                  </button>
                </div>

                {activeMetricCard === 'VULNS' && (
                  <div className="space-y-2 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#0f0e13] p-2.5 rounded-xl border border-[#a8e6cf]/30">
                        <span className="text-[#8e9199] block text-[10px]">CRITICAL CVE DISCLOSURES</span>
                        <span className="text-[#a8e6cf] font-bold text-sm">42 Disclosed</span>
                      </div>
                      <div className="bg-[#0f0e13] p-2.5 rounded-xl border border-[#a8c7fa]/30">
                        <span className="text-[#8e9199] block text-[10px]">BOUNTIES AWARDED</span>
                        <span className="text-[#a8c7fa] font-bold text-sm">$85,000+ Total</span>
                      </div>
                    </div>
                    <p className="text-[#c4c6d0] text-[11px] leading-relaxed">
                      Responsible disclosure across Web3 protocols, Linux kernel modules, and cloud microservices. Verified by HackerOne and Bugcrowd.
                    </p>
                  </div>
                )}

                {activeMetricCard === 'RAM' && (
                  <div className="space-y-2 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#0f0e13] p-2.5 rounded-xl border border-[#a8c7fa]/30">
                        <span className="text-[#8e9199] block text-[10px]">MEMORY DUMPS SCAN</span>
                        <span className="text-[#a8c7fa] font-bold text-sm">65 Full Dumps</span>
                      </div>
                      <div className="bg-[#0f0e13] p-2.5 rounded-xl border border-[#d0bcff]/30">
                        <span className="text-[#8e9199] block text-[10px]">TOOLING USED</span>
                        <span className="text-[#d0bcff] font-bold text-sm">Volatility 3 & Rekall</span>
                      </div>
                    </div>
                    <p className="text-[#c4c6d0] text-[11px] leading-relaxed">
                      Deep-dive physical RAM memory extraction identifying injected DLLs, unhooked SSDT tables, and stealth rootkits in Windows/Linux kernels.
                    </p>
                  </div>
                )}

                {activeMetricCard === 'UPTIME' && (
                  <div className="space-y-2 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#0f0e13] p-2.5 rounded-xl border border-[#fdd663]/30">
                        <span className="text-[#8e9199] block text-[10px]">SYSTEM SLA</span>
                        <span className="text-[#fdd663] font-bold text-sm">99.99% Availability</span>
                      </div>
                      <div className="bg-[#0f0e13] p-2.5 rounded-xl border border-[#a8e6cf]/30">
                        <span className="text-[#8e9199] block text-[10px]">ZERO-TRUST ENFORCEMENT</span>
                        <span className="text-[#a8e6cf] font-bold text-sm">mTLS + SPIFFE/SPIRE</span>
                      </div>
                    </div>
                    <p className="text-[#c4c6d0] text-[11px] leading-relaxed">
                      Continuous identity validation with zero implicit trust across multi-cloud infrastructure and kubernetes worker nodes.
                    </p>
                  </div>
                )}

                {activeMetricCard === 'CERTS' && (
                  <div className="space-y-2 text-[11px]">
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#381e72] text-[#d0bcff] border border-[#d0bcff]/40 font-bold">OSCP</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#004a77] text-[#a8c7fa] border border-[#a8c7fa]/40 font-bold">CISSP</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#00522b] text-[#a8e6cf] border border-[#a8e6cf]/40 font-bold">GIAC GCFA</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#5a4300] text-[#fdd663] border border-[#fdd663]/40 font-bold">CEH Master</span>
                    </div>
                    <p className="text-[#c4c6d0] text-[11px] leading-relaxed">
                      Certified in Offensive Security Web Expert (OSWE), Practical Network Penetration Tester (PNPT), and AWS Certified Security Specialty.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons - Material 3 Expressive Pill Buttons (Single Row Layout) */}
            <div className="grid grid-cols-3 gap-2 pt-4 w-full">
              <button
                onClick={() => {
                  onOpenTerminal();
                  soundEngine.play('click');
                }}
                className="m3-btn-primary cursor-pointer justify-center !px-2 sm:!px-4 !py-2 !text-xs sm:!text-sm flex items-center space-x-1"
              >
                <i className="ri-terminal-box-line text-sm sm:text-lg"></i>
                <span className="truncate">CLI</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.play('click');
                  onNavigate?.('projects');
                }}
                className="m3-btn-tonal cursor-pointer justify-center !px-2 sm:!px-4 !py-2 !text-xs sm:!text-sm flex items-center space-x-1"
              >
                <i className="ri-folder-shield-2-line text-sm sm:text-lg text-[#a8c7fa]"></i>
                <span className="truncate">Case</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.play('click');
                  onNavigate?.('threat-map');
                }}
                className="m3-btn-outlined cursor-pointer justify-center !px-2 sm:!px-4 !py-2 !text-xs sm:!text-sm flex items-center space-x-1"
              >
                <i className="ri-radar-line text-sm sm:text-lg text-[#a8c7fa]"></i>
                <span className="truncate">Auditor</span>
              </button>
            </div>
          </div>

          {/* Right Column: Cryptographic & Telemetry Items Directly on Background */}
          <div className="lg:col-span-5 space-y-3 pb-0 mb-0">
            {/* Header directly on bg */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono font-bold text-[#e3e2e6] tracking-wider flex items-center gap-2">
                <i className="ri-shield-keyhole-line text-[#a8c7fa]"></i>
                CRYPTO & TELEMETRY
              </span>
              <span className="m3-badge m3-badge-green">
                LIVE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs pb-0 mb-0">
              {/* Node Status Info */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-transparent border-b border-[#44474f]/30 pb-3">
                <div>
                  <span className="text-[#8e9199]">HOST_NODE:</span>{' '}
                  <span className="text-[#a8e6cf] font-bold">SEC-NODE-01</span>
                </div>
                <div>
                  <span className="text-[#8e9199]">KERNEL:</span>{' '}
                  <span className="text-[#e3e2e6]">Linux 6.8 (eBPF)</span>
                </div>
                <div>
                  <span className="text-[#8e9199]">ENCRYPTION:</span>{' '}
                  <span className="text-[#a8c7fa] font-bold">AES-256-GCM</span>
                </div>
                <div>
                  <span className="text-[#8e9199]">DEFENSES:</span>{' '}
                  <span className="text-[#d0bcff] font-bold">YARA + WAF</span>
                </div>
              </div>

              {/* Interactive Hash Calculator */}
              <div className="space-y-2 border-b border-[#44474f]/30 pb-3">
                <div className="text-[#e3e2e6] font-semibold flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-[#a8e6cf]">
                    <i className="ri-key-2-line text-sm"></i> CRYPTOGRAPHIC HASH CALCULATOR
                  </span>
                  <span className="text-[10px] text-[#8e9199]">WebCrypto API</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={hashInput}
                    onChange={(e) => {
                      setHashInput(e.target.value);
                      soundEngine.play('terminal_key');
                    }}
                    placeholder="Type string to hash live..."
                    className="w-full bg-[#1a1b21] border border-[#44474f]/50 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#a8c7fa]"
                  />
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-[#8e9199]">
                    <span>SHA-256:</span>
                    <span className="text-[#a8e6cf] truncate max-w-[210px] font-mono" title={sha256Hash}>
                      {sha256Hash}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#8e9199]">
                    <span>Base64:</span>
                    <span className="text-[#a8c7fa] truncate max-w-[210px] font-mono" title={base64Val}>
                      {base64Val || '---'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-Time Telemetry Stream Log */}
              <div className="space-y-2.5 pt-2 pb-0 mb-0">
                <div className="text-[#8e9199] font-semibold text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#a8c7fa] font-mono">
                    <i className="ri-radar-line text-sm text-[#a8c7fa] animate-pulse"></i> REAL-TIME TELEMETRY LOGS
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#00e676] bg-[#005231]/50 border border-[#00e676]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-ping"></span>
                    LIVE STREAM
                  </span>
                </div>

                <div className="space-y-1.5 max-h-64 sm:max-h-72 overflow-y-auto font-mono text-[11px] pr-1 custom-scrollbar pb-0 mb-0">
                  {streamLogs.map((log, idx) => {
                    const badgeStyle =
                      log.tag === 'OK'
                        ? 'bg-[#005231]/60 text-[#00e676] border-[#00e676]/40'
                        : log.tag === 'SEC'
                        ? 'bg-[#601410]/70 text-[#ffb4ab] border-[#ff897d]/40'
                        : 'bg-[#004a77]/60 text-[#a8c7fa] border-[#a8c7fa]/40';

                    return (
                      <div
                        key={idx}
                        className="py-1.5 border-b border-[#49454f]/20 last:border-b-0 last:pb-0 flex items-start gap-2 leading-relaxed text-[11px]"
                      >
                        {/* Timestamp & Badge Column */}
                        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                          <span className="text-[#8e9199] text-[10px] font-mono shrink-0">
                            [{log.time}]
                          </span>
                          <span
                            className={`w-12 h-4 text-[9px] font-bold tracking-wider border rounded inline-flex items-center justify-center shrink-0 uppercase ${badgeStyle}`}
                          >
                            [{log.tag}]
                          </span>
                        </div>

                        {/* Log Message Column (Wraps cleanly after the badge) */}
                        <div className="flex-1 min-w-0 text-[#e3e2e6] font-mono break-words leading-snug">
                          {log.msg}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
