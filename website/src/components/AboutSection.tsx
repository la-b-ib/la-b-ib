import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import {
 EDUCATION_DATA,
 PUBLICATIONS_DATA,
 ORGANIZATIONS_DATA,
 ACADEMIC_PORTALS_DATA,
} from '../data/portfolioData';
import { PgpCryptoSandbox } from './PgpCryptoSandbox';

type IntelTab = 'academic' | 'dossier' | 'crypto';

export const AboutSection: React.FC = () => {
 const [activeTab, setActiveTab] = useState<IntelTab>('academic');
 const [copiedPgp, setCopiedPgp] = useState(false);
 const [toastMsg, setToastMsg] = useState<string | null>(null);
 const [elapsed, setElapsed] = useState({ y: 0, m: 0, w: 0, d: 0, h: 0 });
 const [expandedPubs, setExpandedPubs] = useState<Record<string, boolean>>({});

 const togglePub = (pubId: string) => {
 setExpandedPubs((prev) => ({
 ...prev,
 [pubId]: !prev[pubId],
 }));
 };

 useEffect(() => {
 const updateCounter = () => {
 const startDate = new Date(2024, 5, 1, 0, 0, 0); // June 1, 2024
 const now = new Date();

 let years = now.getFullYear() - startDate.getFullYear();
 let months = now.getMonth() - startDate.getMonth();
 let days = now.getDate() - startDate.getDate();
 let hours = now.getHours() - startDate.getHours();

 if (hours < 0) {
 days -= 1;
 hours += 24;
 }
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
 y: Math.max(0, years),
 m: Math.max(0, months),
 w: Math.max(0, weeks),
 d: Math.max(0, remDays),
 h: Math.max(0, hours),
 });
 };

 updateCounter();
 const interval = setInterval(updateCounter, 1000);
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
 <div className="flex flex-col justify-between gap-4">
 <div className="space-y-2">
 <div>
 <div className="flex items-center space-x-2 text-[12px] leading-[13px] font-mono text-[#a8c7fa] uppercase tracking-widest">
 <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
 <span>STRAT-ACAD</span>
 </div>
 <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
 Intel Brief
 </h2>
 </div>
 <p className="text-xs text-[#c4c6d0] max-w-3xl font-sans leading-relaxed">
 Anchored in rigorous computer science theory from BRAC University, published peer-reviewed IEEE research, and industry-grade systems security architecture.
 </p>
 </div>
 </div>

 {/* Academic & Operational Metrics Ticker */}
 <div className="grid grid-cols-2 gap-2.5 pt-2">
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

 {/* TABS + WORKSTATION SECTION WITH EXACT 15PX GAP */}
 <div className="space-y-[15px]">
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
 <div className="space-y-10 animate-fadeIn font-mono">
 
 {/* 1. BRAC University Degree Header Container */}
 <div>
 <div className="h-[56.9792px] bg-[#21232b] border-0 px-3.5 rounded-2xl transition-all flex items-center">
 <div className="flex items-center gap-3 min-w-0 w-full">
 {/* Single Badge Button linked to BRAC University */}
 <a
 href="https://www.bracu.ac.bd/"
 target="_blank"
 rel="noopener noreferrer"
 className="w-[32px] h-[32px] rounded-[8px] bg-[#d0bcff] text-[#381e72] hover:bg-[#e8def8] transition-colors border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0 cursor-pointer"
 title="Visit BRAC University Website"
 >
 <i className="ri-community-line"></i>
 </a>

 {/* Texts beside the button: 1st row institution + coords (right), 2nd row degree + timer (right) */}
 <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
 <div className="flex items-center justify-between gap-2 min-w-0 flex-wrap">
 <h3 className="text-[16px] leading-[20px] font-bold text-white break-words">
 {EDUCATION_DATA.institution}
 </h3>
 <a
 href="https://maps.app.goo.gl/nZ5RtyffRvahbgH39"
 target="_blank"
 rel="noopener noreferrer"
 className="text-[12px] leading-[15px] text-[#a8c7fa] hover:text-white no-underline transition-colors shrink-0 font-mono"
 title="View BRAC University on Google Maps"
 >
 23°46′N 90°25′E
 </a>
 </div>
 
 <div className="flex items-center justify-between gap-2 text-[12px] leading-[15px] flex-wrap">
                  <span className="text-[16px] leading-[16px] font-semibold text-[#a8c7fa] break-words">
 {EDUCATION_DATA.degree}
 </span>

 {/* Live Timer on the same line at the right */}
 <div className="flex items-center text-[#9CA3AF] font-mono font-medium tracking-wide shrink-0">
 <span>{elapsed.y}y</span>
 <span className="mx-0.5 opacity-70">:</span>
 <span>{elapsed.m}m</span>
 <span className="mx-0.5 opacity-70">:</span>
 <span>{elapsed.w}w</span>
 <span className="mx-0.5 opacity-70">:</span>
 <span>{elapsed.d}d</span>
 <span className="mx-0.5 opacity-70">:</span>
 <span>{elapsed.h}h</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* 2. Key Academic & Technical Cards Grid (2 cards side by side in a row) */}
 <div className="grid grid-cols-2 gap-3 mt-[15px]">
 
 {/* Card 1: CGPA */}
 <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
 <div className="h-[30px] flex items-center justify-between">
 <div className="flex items-center gap-2 text-[11px] font-bold text-[#fdd663]">
 <div
                    className="w-[32px] h-[32px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center text-base font-bold shadow-sm"
 title="CGPA Metrics"
 >
 <i className="ri-trophy-line"></i>
 </div>
                  <span className="text-[16px]">CGPA</span>
 </div>
                <span className="text-[12px] text-[#8e9199] font-sans font-medium">US Scale</span>
 </div>
 <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
 <span className="text-xl font-bold text-[#fdd663] font-mono tracking-tight">3.12</span>
 <span className="text-xs text-[#8e9199] font-mono">/ 4.00</span>
 </div>
 </div>

 {/* Card 2: LANGUAGES */}
 <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
 <div className="h-[30px] flex items-center justify-between">
 <div className="flex items-center gap-2 text-[11px] font-bold text-[#d0bcff]">
 <div
                    className="w-[32px] h-[32px] shrink-0 rounded-lg bg-[#d0bcff] text-[#381e72] flex items-center justify-center text-base font-bold shadow-sm"
 title="Languages"
 >
 <i className="ri-java-line"></i>
 </div>
                  <span className="text-[16px]">LANG</span>
 </div>
                <span className="text-[12px] text-[#8e9199] font-sans font-medium">CORE</span>
 </div>
              <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-1.5 text-[12px] text-[#c4c6d0] font-mono leading-relaxed truncate flex items-center">
 Java, Python, C++
 </div>
 </div>

 {/* Card 3: DFIR */}
 <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
 <div className="h-[30px] flex items-center justify-between">
 <div className="flex items-center gap-2 text-[11px] font-bold text-[#a8c7fa]">
                  <div
                    className="w-[32px] h-[32px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm"
 title="DFIR"
 >
 <i className="ri-git-repository-private-line"></i>
 </div>
                  <span className="truncate text-[16px]">DFIR</span>
 </div>
                <span className="text-[12px] text-[#8e9199] font-sans font-medium">SEC</span>
 </div>
              <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-1.5 text-[12px] text-[#c4c6d0] font-mono leading-relaxed truncate flex items-center">
 Wireshark, eBPF
 </div>
 </div>

 {/* Card 4: ARCH */}
 <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
 <div className="h-[30px] flex items-center justify-between">
 <div className="flex items-center gap-2 text-[11px] font-bold text-[#ffb4ab]">
                  <div
                    className="w-[32px] h-[32px] shrink-0 rounded-lg bg-[#ffb4ab] text-[#561e18] flex items-center justify-center text-base font-bold shadow-sm"
 title="Architecture"
 >
 <i className="ri-pass-expired-line"></i>
 </div>
                  <span className="truncate text-[16px]">ARCH</span>
 </div>
                <span className="text-[12px] text-[#8e9199] font-sans font-medium">SYS</span>
 </div>
              <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-1.5 text-[12px] text-[#c4c6d0] font-mono leading-relaxed truncate flex items-center">
                mTLS, Redis L2
 </div>
 </div>

 {/* Card 5: ORGS, SOCS. & CLUBS (Row 3 - Full Width) */}
 <div className="col-span-2 min-h-[105px] h-auto bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between gap-2.5">
 <div className="h-[30px] flex items-center justify-between shrink-0">
 <div className="flex items-center gap-2 text-[11px] font-bold text-[#a8e6cf]">
 <div
                    className="w-[32px] h-[32px] shrink-0 rounded-lg bg-[#a8e6cf] text-[#003923] flex items-center justify-center text-base font-bold shadow-sm"
 title="Organizations, Societies & Clubs"
 >
 <i className="ri-team-line"></i>
 </div>
                  <span className="truncate text-[16px]">ORGS & CLUBS</span>
 </div>
                <span className="text-[12px] text-[#8e9199] font-sans font-medium">AFFIL</span>
 </div>
 <div 
                className="min-h-[38px] h-auto bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-2 text-[12px] text-[#c4c6d0] font-mono leading-relaxed whitespace-normal break-words flex items-center"
 title="3Zero, IEEE, BRACU Express & BUEEC"
 >
 3Zero, IEEE, BRACU Express & BUEEC
 </div>
 </div>

 {/* Card 6: RESEARCH (Row 4 - Full Width) */}
 <div className="col-span-2 min-h-[105px] h-auto bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between gap-2.5">
 <div className="h-[30px] flex items-center justify-between shrink-0">
 <div className="flex items-center gap-2 text-[11px] font-bold text-[#c2e7ff]">
 <div
                    className="w-[32px] h-[32px] shrink-0 rounded-lg bg-[#c2e7ff] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm"
 title="Research Publications"
 >
 <i className="ri-book-open-line"></i>
 </div>
                  <span className="truncate text-[16px]">RESEARCH</span>
 </div>
                <span className="text-[12px] text-[#8e9199] font-sans font-medium">PUBS</span>
 </div>
              <div className="min-h-[38px] h-auto bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-2 text-[12px] text-[#c4c6d0] font-mono leading-relaxed space-y-1">
 <div className="flex items-start gap-1.5">
 <span className="text-[#c2e7ff] font-bold shrink-0">1.</span>
 <span>Blockchain in PM {`{ICEIC-25}`}</span>
 </div>
 <div className="flex items-start gap-1.5">
 <span className="text-[#c2e7ff] font-bold shrink-0">2.</span>
 <span>Crop Prediction Using ML {`{ICRPSET-24}`}</span>
 </div>
 </div>
 </div>

 </div>
 </div>

 </div>
 )}

 {/* TAB 2: RESEARCH & PEER-REVIEWED PUBLICATIONS */}
 {activeTab === 'dossier' && (
 <div className="space-y-4 animate-fadeIn font-mono">
 
 {/* Published Conference Papers & Research Indexing */}
 <div className="space-y-3.5">
 {/* Header Container */}
 <div className="h-[56.9792px] bg-[#21232b] border-0 px-3.5 rounded-2xl transition-all flex items-center">
 <div className="flex items-center gap-3 min-w-0">
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#c2e7ff] text-[#00325b] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">
 <i className="ri-microscope-line"></i>
 </div>
 <div className="flex-1 min-w-0 flex flex-col justify-center">
 <h3 className="text-[16px] leading-[20px] font-bold text-white truncate">
 Conference Paper
 </h3>
 <div className="text-[12px] leading-[15px] text-[#a8c7fa] font-semibold mt-0.5">
 IEEE Indexed : {PUBLICATIONS_DATA.length}
 </div>
 </div>
 </div>
 </div>

 {/* Publications Cards Grid (Identical to RESEARCH/PUBS card architecture) */}
 <div className="grid grid-cols-1 gap-3.5">
 {PUBLICATIONS_DATA.map((pub) => {
 const isExpanded = !!expandedPubs[pub.id];
 return (
 <div
 key={pub.id}
 className="h-auto bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between gap-2.5"
 >
 {/* Card Header */}
 <div className="h-auto min-h-[30px] flex items-center justify-between gap-2 shrink-0">
 <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#c2e7ff] min-w-0 flex-1">
 <div
 className="w-[32px] h-[32px] shrink-0 rounded-[8px] bg-[#c2e7ff] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm"
 title={pub.conference}
 >
 <i className={pub.icon || 'ri-book-open-line'}></i>
 </div>
 <div className="flex flex-col justify-center min-w-0">
 <span className="break-words font-mono font-bold text-white text-[16px] leading-tight">
 {pub.conference}
 </span>
 <span className="text-[12px] text-[#a8c7fa] font-mono font-medium tracking-wider leading-tight mt-0.5">
 {pub.headerDate || pub.date}
 </span>
 </div>
 </div>

 {/* Action Buttons: Expand/Collapse & External Link */}
 <div className="flex items-center gap-1.5 shrink-0">
 <button
 type="button"
 onClick={() => {
 soundEngine.play('click');
 togglePub(pub.id);
 }}
 className="w-[32px] h-[32px] rounded-[8px] bg-[#13141a] hover:bg-[#2c2f38] text-[#a8c7fa] hover:text-white flex items-center justify-center text-base font-bold shadow-sm transition-all cursor-pointer border border-[#44474f]/30"
 title={isExpanded ?"Collapse metadata":"Expand metadata"}
 aria-expanded={isExpanded}
 >
 <i className={isExpanded ?"ri-arrow-up-s-line":"ri-arrow-down-s-line"}></i>
 </button>

 <a
 href={pub.doi}
 target="_blank"
 rel="noopener noreferrer"
 onClick={() => soundEngine.play('click')}
 title="View IEEE Xplore Paper"
 className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] hover:bg-[#c2e7ff] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm transition-all shrink-0 cursor-pointer"
 >
 <i className="ri-link-unlink-m"></i>
 </a>
 </div>
 </div>

 {/* Collapsible Card Content Capsule Box */}
 {isExpanded && (
 <div className="h-auto bg-[#13141a] border border-[#44474f]/30 rounded-xl p-3.5 text-[12px] leading-[19px] text-[#c4c6d0] font-mono space-y-2.5 animate-fadeIn">
 <div className="space-y-1.5 text-justify">
 <div className="flex flex-row items-start gap-2">
 <span className="text-[#8e9199] font-bold shrink-0 w-16">TITLE</span>
 <span className="text-[#8e9199] shrink-0">:</span>
 <span className="font-bold text-white leading-snug break-words flex-1 text-justify">{pub.title}</span>
 </div>

 <div className="flex flex-row items-start gap-2">
 <span className="text-[#8e9199] font-bold shrink-0 w-16">CONF</span>
 <span className="text-[#8e9199] shrink-0">:</span>
 <span className="text-[#c2e7ff] break-words flex-1 text-justify">{pub.venueFull || pub.conference}</span>
 </div>

 <div className="flex flex-row items-start gap-2">
 <span className="text-[#8e9199] font-bold shrink-0 w-16">LOC</span>
 <span className="text-[#8e9199] shrink-0">:</span>
 <span className="text-white break-words flex-1 text-justify">{pub.location}</span>
 </div>

 <div className="flex flex-row items-start gap-2">
 <span className="text-[#8e9199] font-bold shrink-0 w-16">DATE</span>
 <span className="text-[#8e9199] shrink-0">:</span>
 <span className="text-white break-words flex-1 text-justify">{pub.date}</span>
 </div>

 <div className="flex flex-row items-start gap-2">
 <span className="text-[#8e9199] font-bold shrink-0 w-16">DOI</span>
 <span className="text-[#8e9199] shrink-0">:</span>
 <a
 href={pub.doi}
 target="_blank"
 rel="noopener noreferrer"
 className="text-[#a8c7fa] no-underline hover:no-underline break-all flex-1 text-justify"
 >
 {pub.doi}
 </a>
 </div>

 <div className="flex flex-row items-start gap-2">
 <span className="text-[#8e9199] font-bold shrink-0 w-16">E-ISBN</span>
 <span className="text-[#8e9199] shrink-0">:</span>
 <span className="text-white font-mono break-words flex-1 text-justify">{pub.isbn}</span>
 </div>
 </div>
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>

 {/* Verified Research Portals */}
 <div className="space-y-3.5 pt-2">
 {/* Portals Header Container */}
 <div className="h-[56.9792px] bg-[#21232b] border-0 px-3.5 rounded-2xl transition-all flex items-center">
 <div className="flex items-center gap-3 min-w-0">
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#a8e6cf] text-[#003923] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">
 <i className="ri-user-shared-line"></i>
 </div>
 <div className="flex-1 min-w-0 flex flex-col justify-center">
 <h3 className="text-[16px] leading-[20px] font-bold text-white truncate">
 Portals
 </h3>
 <div className="text-[12px] leading-[15px] text-[#a8e6cf] font-semibold mt-0.5">
 Verified Academic Profiles : 4
 </div>
 </div>
 </div>
 </div>

 {/* 4 Research Portals Grid (2 per row side by side) */}
 <div className="grid grid-cols-2 gap-2.5">
 {ACADEMIC_PORTALS_DATA.map((portal) => (
 <div
 key={portal.name}
 className="h-[56.9792px] bg-[#21232b] border-0 px-2.5 rounded-2xl transition-all flex items-center justify-between gap-2"
 >
 {/* Portal Header */}
 <div className="flex items-center gap-2 min-w-0 flex-1">
 <div
 className="w-[32px] h-[32px] shrink-0 rounded-[8px] bg-[#a8c7fa] text-[#003258] flex items-center justify-center text-base font-bold shadow-sm"
 title={portal.name}
 >
 <i className={portal.icon || 'ri-external-link-line'}></i>
 </div>
 <div className="flex flex-col justify-center min-w-0">
 <span className="truncate font-mono font-bold text-white text-base leading-tight">
 {portal.name}
 </span>
 <span className="truncate text-xs text-[#a8c7fa] font-mono font-medium tracking-wider leading-tight mt-0.5">
 {portal.status}
 </span>
 </div>
 </div>

 {/* View Button */}
 <a
 href={portal.url}
 target="_blank"
 rel="noopener noreferrer"
 onClick={() => soundEngine.play('click')}
 title={`Visit ${portal.name}`}
 className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] hover:bg-[#c2e7ff] text-[#003258] flex items-center justify-center text-base font-bold shadow-sm transition-all shrink-0 cursor-pointer"
 >
 <i className="ri-link-unlink-m"></i>
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

 </div>

 {/* Global Section Toast Notification */}
 {toastMsg && (
 <div className="sticky bottom-4 right-4 ml-auto w-fit z-[9999] bg-[#1a1b21] border border-[#a8c7fa] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-mono animate-fadeIn">
 <i className="ri-checkbox-circle-fill text-[#a8e6cf] text-sm"></i>
 <span>{toastMsg}</span>
 </div>
 )}
 </section>
 );
};
