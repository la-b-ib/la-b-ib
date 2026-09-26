import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface HeroSectionProps {
 onOpenTerminal: () => void;
 onNavigate?: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTerminal, onNavigate }) => {
 // Action capsule selection state
 const [selectedAction, setSelectedAction] = useState<'cli' | 'case' | 'radar'>('cli');

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
 { time: '14:27:01', tag: 'OK', tagClass: 'text-teal-400 bg-teal-500/10 border-teal-500/30', msg: 'Zero-Trust policy active: 100% compliant.' },
 { time: '14:27:04', tag: 'SEC', tagClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30', msg: 'Port scan payload blocked by WAF filter.' },
 { time: '14:27:08', tag: 'INFO', tagClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', msg: 'eBPF probe captured sys_execve() PID 4092.' },
 { time: '14:27:11', tag: 'INFO', tagClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', msg: 'mTLS handshake verified for node-02.' },
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
 <section id="hero" className="relative pt-0 pb-0 border-b-0 overflow-hidden scroll-mt-28 bg-transparent px-[8px]" style={{ paddingLeft: "8px", paddingRight: "8px" }}>
 {/* Hero Visual GIF - Restored rounded corners and side padding, but no top padding to remove the black gap under header */}
 <div className="w-full pt-0 px-0 mb-[15px] overflow-hidden" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
 <img
 src="https://raw.githubusercontent.com/la-b-ib/la-b-ib/main/website%20assets/hero/hero.GIF"
 alt="Labib Bin Shahed - Hero Visual"
            className="w-full h-auto object-cover rounded-none block px-0"
            style={{ paddingLeft: "0px", paddingRight: "0px" }}
 />
 </div>

      <div
        className="max-w-7xl mx-auto px-0 relative z-10 pb-0 mb-0 pt-0"
        style={{ paddingLeft: "0px", paddingRight: "0px" }}
      >
 <div className="grid grid-cols-1 gap-[15px] items-start pb-0 mb-0">
 
 {/* Left Column: Dossier Header & Title */}
 <div className="space-y-[15px]">
              {/* Main Name with Geist Mono Black 900 Typography & Decipher Effect */}
              <h1 className="text-2xl font-mono font-black tracking-tight text-slate-100 leading-[24px]" style={{ fontSize: "24px", lineHeight: "24px" }}>
 Labib{' '}
 <span
 onMouseEnter={() => {
 runDecipher();
 soundEngine.play('terminal_key');
 }}
 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 cursor-pointer text-2xl leading-[24px]" style={{ fontSize: "24px", lineHeight: "24px" }}
 >
 {displayText}
 </span>
 </h1>

 {/* Typewriter Subheading */}
 <div className="font-jetbrains text-xs text-teal-300/90 flex items-center space-x-2 bg-[#21232b] px-2 rounded-lg border-0 h-[45px] max-w-[346px] w-full min-h-0 shadow-none" style={{ paddingLeft: "8px", paddingRight: "8px" }}>
 <span className="text-teal-400 font-bold">&gt;</span>
            <span className="leading-snug truncate text-[12px] leading-[16px]" style={{ fontSize: "12px", lineHeight: "16px" }}>{phrases[phraseIdx].substring(0, charIdx)}</span>
 <span className="w-1.5 h-3.5 bg-teal-400 animate-pulse inline-block shrink-0"></span>
 </div>

 {/* Core Summary Paragraph */}
 <div className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all shadow-md" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
          <p
            className="text-[#c4c6d0] font-sans max-w-2xl text-[12px] leading-[16px]"
            style={{ fontSize: "12px", lineHeight: "16px" }}
          >
 Bridging the gap between <strong className="text-white font-semibold">high-performance full-stack engineering</strong>, <strong className="text-[#a8e6cf] font-semibold">offensive penetration testing</strong>, and <strong className="text-[#a8c7fa] font-semibold">digital forensic investigation</strong>. Building resilient zero-trust architectures, isolating kernel rootkits, and auditing critical infrastructure.
 </p>
 </div>

 {/* Quick Metrics Grid - Material Design 3 Expressive Tonal Cards */}
 <div className="grid grid-cols-2 gap-3 pt-0 mb-[15px]">
 {/* Card 1: Vulnerabilities Disclosed - M3 Google Green */}
 <div
 role="button" tabIndex={0} onClick={() => {
 soundEngine.play('click');
 setActiveMetricCard(activeMetricCard === 'VULNS' ? null : 'VULNS');
 }}
 className="p-2 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group border-0 bg-[#21232b] hover:opacity-90 shadow-md"
 style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-[33px] h-[33px] rounded-[8px] bg-[#a8e6cf] text-[#00391c] border-0 shadow-md flex items-center justify-center shrink-0" style={{ width: "33px", height: "33px" }}>
 <i className="ri-bug-2-line text-[27px]" style={{ fontSize: "27px" }}></i>
 </div>
 <span className="text-2xl font-extrabold font-mono text-[#a8e6cf] tracking-tight leading-[24px]" style={{ lineHeight: "24px" }}>25+</span>
 </div>
 <i className="ri-arrow-right-up-box-line text-xs text-[#8e9199] group-hover:text-[#a8e6cf] transition-colors"></i>
 </div>
            <div className="font-medium text-[#c4c6d0] mt-2 leading-tight text-[13px]" style={{ fontSize: "13px" }}>
 Disclosed Vulns
 </div>
 <div className="w-full bg-transparent h-[6px] rounded-full mt-2.5 overflow-hidden flex items-center border-0">
 <div className="bg-[#a8e6cf] h-[4px] w-[85%] rounded-full"></div>
 </div>
 </div>

 {/* Card 2: RAM Dumps Analyzed - M3 Google Blue */}
 <div
 role="button" tabIndex={0} onClick={() => {
 soundEngine.play('click');
 setActiveMetricCard(activeMetricCard === 'RAM' ? null : 'RAM');
 }}
 className="p-2 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group border-0 bg-[#21232b] hover:opacity-90 shadow-md"
 style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-[33px] h-[33px] rounded-[8px] bg-[#a8c7fa] text-[#042f5d] border-0 shadow-md flex items-center justify-center shrink-0" style={{ width: "33px", height: "33px" }}>
 <i className="ri-ram-line text-[27px]" style={{ fontSize: "27px" }}></i>
 </div>
 <span className="text-2xl font-extrabold font-mono text-[#a8c7fa] tracking-tight leading-[24px]" style={{ lineHeight: "24px" }}>15+</span>
 </div>
 <i className="ri-arrow-right-up-box-line text-xs text-[#8e9199] group-hover:text-[#a8c7fa] transition-colors"></i>
 </div>
            <div className="font-medium text-[#c4c6d0] mt-2 leading-tight text-[13px]" style={{ fontSize: "13px" }}>
 RAM Dumps Analyzed
 </div>
 <div className="w-full bg-transparent h-[6px] rounded-full mt-2.5 overflow-hidden flex items-center border-0">
 <div className="bg-[#a8c7fa] h-[4px] w-[90%] rounded-full"></div>
 </div>
 </div>

 {/* Card 3: Zero-Trust Uptime - M3 Google Amber/Yellow */}
 <div
 role="button" tabIndex={0} onClick={() => {
 soundEngine.play('click');
 setActiveMetricCard(activeMetricCard === 'UPTIME' ? null : 'UPTIME');
 }}
 className="p-2 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group border-0 bg-[#21232b] hover:opacity-90 shadow-md"
 style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-[33px] h-[33px] rounded-[8px] bg-[#fdd663] text-[#3f2e00] border-0 shadow-md flex items-center justify-center shrink-0" style={{ width: "33px", height: "33px" }}>
 <i className="ri-swap-3-line text-[27px]" style={{ fontSize: "27px" }}></i>
 </div>
 <span className="text-2xl font-extrabold font-mono text-[#fdd663] tracking-tight leading-[24px]" style={{ lineHeight: "24px" }}>98%</span>
 </div>
 <i className="ri-arrow-right-up-box-line text-xs text-[#8e9199] group-hover:text-[#fdd663] transition-colors"></i>
 </div>
 <div className="text-xs font-medium text-[#c4c6d0] mt-2 leading-tight">
 Zero-Trust Uptime
 </div>
 <div className="w-full bg-transparent h-[6px] rounded-full mt-2.5 overflow-hidden flex items-center border-0">
 <div className="bg-[#fdd663] h-[4px] w-[98%] rounded-full"></div>
 </div>
 </div>

 {/* Card 4: Sec & DFIR Certs - M3 Google Purple */}
 <div
 role="button" tabIndex={0} onClick={() => {
 soundEngine.play('click');
 setActiveMetricCard(activeMetricCard === 'CERTS' ? null : 'CERTS');
 }}
 className="p-2 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group border-0 bg-[#21232b] hover:opacity-90 shadow-md"
 style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-[33px] h-[33px] rounded-[8px] bg-[#d0bcff] text-[#381e72] border-0 shadow-md flex items-center justify-center shrink-0" style={{ width: "33px", height: "33px" }}>
 <i className="ri-certificate-line text-[27px]" style={{ fontSize: "27px" }}></i>
 </div>
 <span className="text-2xl font-extrabold font-mono text-[#d0bcff] tracking-tight leading-[24px]" style={{ lineHeight: "24px" }}>10+</span>
 </div>
 <i className="ri-arrow-right-up-box-line text-xs text-[#8e9199] group-hover:text-[#d0bcff] transition-colors"></i>
 </div>
 <div className="text-xs font-medium text-[#c4c6d0] mt-2 leading-tight">
 Sec & DFIR Certs
 </div>
 <div className="w-full bg-transparent h-[6px] rounded-full mt-2.5 overflow-hidden flex items-center border-0">
 <div className="bg-[#d0bcff] h-[4px] w-[92%] rounded-full"></div>
 </div>
 </div>
 </div>

 {/* Expandable M3 Detail Drawer when a metric card is tapped */}
 {activeMetricCard && (
          <div className="bg-[#21232b] border-0 rounded-2xl p-2 shadow-xl animate-fadeIn font-mono text-xs space-y-3 mb-[15px]" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <div className="flex items-center justify-between pb-0 border-0">
 <div className="flex items-center space-x-2">
 <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-ping"></span>
 <span className="font-bold text-white uppercase tracking-wider text-[16px]">
 {activeMetricCard === 'VULNS' && 'CVE/VD Index'}
 {activeMetricCard === 'RAM' && 'Vol3 MFC'}
 {activeMetricCard === 'UPTIME' && 'ZTA-SLA Log'}
 {activeMetricCard === 'CERTS' && 'Cyber/DFIR Creds'}
 </span>
 </div>
 <button
 onClick={() => {
 soundEngine.play('click');
 setActiveMetricCard(null);
 }}
 className="text-[#690005] hover:opacity-90 p-1 rounded-[20px] bg-[#ffb4ab] transition-colors flex items-center justify-center cursor-pointer"
 title="Close details"
 >
 <i className="ri-close-line text-lg"></i>
 </button>
 </div>

 {activeMetricCard === 'VULNS' && (
 <div className="space-y-2 text-xs">
            <div className="bg-[#000000] p-2 rounded-xl border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <span className="text-[#8e9199] block text-xs">CRITICAL CVE DISCLOSURES</span>
              <span className="text-[#a8e6cf] font-bold text-[12px] leading-[16px]" style={{ fontSize: "12px", lineHeight: "16px" }}>13 Disclosed</span>
 </div>
            <p className="text-[#c4c6d0] text-xs leading-[16px]" style={{ lineHeight: "16px" }}>
 Responsible disclosure across Web3 protocols, Linux kernel modules, and cloud microservices. Verified by HackerOne and Bugcrowd.
 </p>
 </div>
 )}

 {activeMetricCard === 'RAM' && (
 <div className="space-y-2 text-xs">
 <div className="grid grid-cols-2 gap-2">
 <div className="bg-[#000000] p-2 rounded-xl border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <span className="text-[#8e9199] block text-xs">MEMORY DUMPS SCAN</span>
 <span className="text-[#a8c7fa] font-bold text-[12px] leading-[16px]" style={{ fontSize: "12px", lineHeight: "16px" }}>15 Full Dumps</span>
 </div>
 <div className="bg-[#000000] p-2 rounded-xl border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <span className="text-[#8e9199] block text-xs">TOOLING USED</span>
 <span className="text-[#d0bcff] font-bold text-[12px] leading-[16px]" style={{ fontSize: "12px", lineHeight: "16px" }}>Volatility 3 & Rekall</span>
 </div>
 </div>
 <p className="text-[#c4c6d0] text-xs leading-[16px]" style={{ lineHeight: "16px" }}>
 Deep-dive physical RAM memory extraction identifying injected DLLs, unhooked SSDT tables, and stealth rootkits in Windows/Linux kernels.
 </p>
 </div>
 )}

 {activeMetricCard === 'UPTIME' && (
 <div className="space-y-2 text-xs">
 <div className="grid grid-cols-2 gap-2">
 <div className="bg-[#000000] p-2 rounded-xl border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <span className="text-[#8e9199] block text-xs">SYSTEM SLA</span>
 <span className="text-[#fdd663] font-bold text-[12px] leading-[16px]" style={{ fontSize: "12px", lineHeight: "16px" }}>98% Availability</span>
 </div>
 <div className="bg-[#000000] p-2 rounded-xl border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <span className="text-[#8e9199] block text-xs">ZT ENFORCEMENT</span>
 <span className="text-[#a8e6cf] font-bold text-[12px] leading-[16px]" style={{ fontSize: "12px", lineHeight: "16px" }}>mTLS + SPIFFE/SPIRE</span>
 </div>
 </div>
 <p className="text-[#c4c6d0] text-xs leading-[16px]" style={{ lineHeight: "16px" }}>
 Continuous identity validation with zero implicit trust across multi-cloud infrastructure and kubernetes worker nodes.
 </p>
 </div>
 )}

 {activeMetricCard === 'CERTS' && (
 <div className="space-y-2 text-xs">
 <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
 <span className="px-2 py-0.5 rounded-full bg-[#d0bcff] text-[#381e72] font-bold text-xs">EC-Council ISA</span>
 <span className="px-2 py-0.5 rounded-full bg-[#fdd663] text-[#3f2e00] font-bold text-xs">CompTIA Sec+</span>
 <span className="px-2 py-0.5 rounded-full bg-[#a8e6cf] text-[#00391c] font-bold text-xs">FCA</span>
 </div>
 <p className="text-[#c4c6d0] text-xs leading-[16px]" style={{ lineHeight: "16px" }}>
 Certified in EC-Council InfoSec Analyst, CompTIA Security+, Fortinet Certified Associate, and Certified Ethical Hacker (CEH).
 </p>
 </div>
 )}
 </div>
 )}

 {/* Action Buttons - Capsule Container */}
 <div className="bg-[#21232b] p-1 rounded-full border-0 h-[45px] w-full flex items-center gap-1">
 <button
 onClick={() => {
 setSelectedAction('cli');
 onOpenTerminal();
 soundEngine.play('click');
 }}
 className={`flex-1 h-[35px] flex items-center justify-center space-x-1.5 rounded-full transition-all cursor-pointer text-xs font-semibold border-0 ${
 selectedAction === 'cli'
 ? 'bg-[#a8c7fa] text-[#001d35] shadow-sm'
 : 'bg-black text-[#c4c6d0] hover:text-white'
 }`}
 >
 <i className="ri-terminal-box-line text-sm"></i>
 <span className="truncate">CLI</span>
 </button>

 <button
 onClick={() => {
 setSelectedAction('case');
 soundEngine.play('click');
 onNavigate?.('projects');
 }}
 className={`flex-1 h-[35px] flex items-center justify-center space-x-1.5 rounded-full transition-all cursor-pointer text-xs font-semibold border-0 ${
 selectedAction === 'case'
 ? 'bg-[#a8c7fa] text-[#001d35] shadow-sm'
 : 'bg-black text-[#c4c6d0] hover:text-white'
 }`}
 >
 <i className="ri-folder-shield-2-line text-sm"></i>
 <span className="truncate">Case</span>
 </button>

 <button
 onClick={() => {
 setSelectedAction('radar');
 soundEngine.play('click');
 onNavigate?.('threat-map');
 }}
 className={`flex-1 h-[35px] flex items-center justify-center space-x-1.5 rounded-full transition-all cursor-pointer text-xs font-semibold border-0 ${
 selectedAction === 'radar'
 ? 'bg-[#a8c7fa] text-[#001d35] shadow-sm'
 : 'bg-black text-[#c4c6d0] hover:text-white'
 }`}
 >
 <i className="ri-radar-line text-sm"></i>
 <span className="truncate">Radar</span>
 </button>
 </div>
 </div>

 {/* Right Column: Cryptographic & Telemetry Items Directly on Background */}
 <div className="space-y-[15px] pb-0 mb-0">
 {/* Crypto & Telemetry Status Container */}
        <div className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all shadow-md space-y-3" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 {/* Header */}
 <div className="flex items-center gap-3">
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] text-[#001d35] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">
 <i className="ri-secure-payment-line"></i>
 </div>
 <div className="flex flex-col justify-center font-mono font-bold text-[#e3e2e6] tracking-wider text-[16px] leading-[20px]">
              <span className="leading-[16px]" style={{ lineHeight: "16px" }}>CRYPTO &</span>
              <span className="leading-[16px]" style={{ lineHeight: "16px" }}>TELEMETRY</span>
 </div>
 </div>

 {/* Node Status Info */}
 <div className="grid grid-cols-2 gap-2 text-xs leading-[12.6667px]">
 <div>
 <span className="text-[#8e9199] text-xs">NODE:</span>{' '}
 <span className="text-[#a8e6cf] font-bold text-xs">SEC-NODE-01</span>
 </div>
 <div>
 <span className="text-[#8e9199] text-xs">KERN:</span>{' '}
 <span className="text-[#e3e2e6] text-xs">LNX 6.8 [eBPF]</span>
 </div>
 <div>
 <span className="text-[#8e9199] text-xs">CIPHER:</span>{' '}
 <span className="text-[#a8c7fa] font-bold text-xs">AES-256-GCM</span>
 </div>
 <div>
 <span className="text-[#8e9199] text-xs">DEFENSES:</span>{' '}
 <span className="text-[#d0bcff] font-bold text-xs">YARA + WAF</span>
 </div>
 </div>
 </div>

 {/* Interactive Hash Calculator */}
        <div className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all shadow-md space-y-3" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <div className="text-[#e3e2e6] font-semibold flex items-center justify-between text-xs">
 <div className="flex items-center gap-3">
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] text-[#001d35] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">
 <i className="ri-safe-3-line"></i>
 </div>
 <div className="flex flex-col justify-center font-mono">
                <span className="text-[16px] leading-[16px] font-bold text-[#e3e2e6] tracking-wider" style={{ lineHeight: "16px" }}>
 Hash Generator
 </span>
                <span className="text-[12px] text-[#8e9199] leading-[12px]" style={{ lineHeight: "12px" }}>WebCrypto API</span>
 </div>
 </div>
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
                  className="w-full bg-[#000000] border-0 rounded-lg px-3 h-[45px] text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#a8c7fa]"
                  style={{ backgroundColor: '#000000' }}
                />
 </div>

 <div className="space-y-1 text-xs leading-[13.6667px]">
 <div className="flex items-center justify-between text-[#8e9199] text-xs">
 <span className="text-xs">SHA-256:</span>
 <span className="text-[#a8e6cf] truncate max-w-[210px] font-mono text-xs"title={sha256Hash}>
 {sha256Hash}
 </span>
 </div>
 <div className="flex items-center justify-between text-[#8e9199] text-xs">
 <span className="text-xs">Base64:</span>
 <span className="text-[#a8c7fa] truncate max-w-[210px] font-mono text-xs"title={base64Val}>
 {base64Val || '---'}
 </span>
 </div>
 </div>
 </div>

 {/* Real-Time Telemetry Stream Log Section */}
 <div className="space-y-[15px]">
 {/* Telemetry Logs Header Container (Identical to Threat Radar Header Container architecture) */}
 <div className="h-[56.9792px] bg-[#21232b] border-0 px-2 rounded-2xl transition-all flex items-center shadow-md" style={{ paddingLeft: "8px", paddingRight: "8px" }}>
 <div className="flex items-center gap-3 min-w-0">
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] text-[#001d35] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">
 <i className="ri-base-station-line"></i>
 </div>
 <div className="flex-1 min-w-0 flex flex-col justify-center">
 <h3 className="text-[16px] leading-[20px] font-bold text-white truncate font-mono">
 TELEMETRY LOGS
 </h3>
 <div className="text-[12px] leading-[15px] text-[#a8c7fa] font-semibold mt-0.5 flex items-center gap-1.5 font-mono">
 <span className="w-1.5 h-1.5 rounded-full bg-[#a8c7fa] animate-pulse"></span>
 <span>LIVE STREAM</span>
 </div>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-[15px] h-[205px] max-h-[205px] overflow-y-auto font-mono text-xs px-0 custom-scrollbar" style={{ paddingLeft: "0px", paddingRight: "0px", gap: "15px", height: "205px", maxHeight: "205px" }}>
 {streamLogs.map((log, idx) => {
 const isOk = log.tag === 'OK';
 const isSec = log.tag === 'SEC';

 const badgeStyle = isOk
 ? 'bg-[#a8e6cf] text-[#003824]'
 : isSec
 ? 'bg-[#ffb4ab] text-[#60000e]'
 : 'bg-[#a8c7fa] text-[#00325b]';

 const tagTextColor = isOk
 ? 'text-[#a8e6cf]'
 : isSec
 ? 'text-[#ffb4ab]'
 : 'text-[#a8c7fa]';

 const tagIcon = isOk
 ? 'ri-thumb-up-line'
 : isSec
 ? 'ri-shield-keyhole-line'
 : 'ri-information-2-line';

 return (
 <div
 key={idx}
 className="h-[95px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between shadow-sm"
 style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "95px" }}
 >
 {/* Top Section: Button and Time */}
 <div className="h-[30px] flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-base font-bold shadow-sm ${badgeStyle}`}>
 <i className={tagIcon}></i>
 </div>
 <span className="font-bold font-mono text-[#e3e2e6] tracking-wide text-[16px]" style={{ fontSize: "16px", lineHeight: "16px" }}>
 {log.time}
 </span>
 </div>
 </div>

 {/* Bottom Section: Inner text block matching format "INFO : mTLS handshake verified for node-02." */}
 <div className="h-[38px] bg-[#13141a] border-0 rounded-xl p-2 flex items-center" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <span className="text-[11px] leading-[13px] text-[#e3e2e6] font-mono line-clamp-2 break-words" style={{ fontSize: "11px", lineHeight: "13px" }}>
 <span className={`font-bold ${tagTextColor}`}>{log.tag} : </span>
 {log.msg}
 </span>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 </div>

 </div>
 </div>
 </section>
 );
};
