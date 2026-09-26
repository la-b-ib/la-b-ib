import React, { useState, useEffect, useRef, useMemo } from 'react';
import { soundEngine } from '../utils/soundEngine';
import {
 EDUCATION_DATA,
 PUBLICATIONS_DATA,
 ORGANIZATIONS_DATA,
 ACADEMIC_PORTALS_DATA,
} from '../data/portfolioData';
import { PgpCryptoSandbox } from './PgpCryptoSandbox';
import { CyberAttackMapSection } from './CyberAttackMapSection';

type IntelTab = 'academic' | 'dossier' | 'portals' | 'radar' | 'crypto';

const ABOUT_BIO_TEXT = "I’m a developer who loves building & exploring tech.";

export const AboutSection: React.FC = () => {
 const [activeTab, setActiveTab] = useState<IntelTab>('academic');
 const [copiedPgp, setCopiedPgp] = useState(false);
 const [toastMsg, setToastMsg] = useState<string | null>(null);
 const [elapsed, setElapsed] = useState({ y: 0, m: 0, w: 0, d: 0, h: 0 });
  const [expandedPubs, setExpandedPubs] = useState<Record<string, boolean>>({});
  const [typedBio, setTypedBio] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageWidth, setImageWidth] = useState<number>(120);

  useEffect(() => {
    if (!imgRef.current) return;
    const updateSize = () => {
      if (imgRef.current) {
        const w = imgRef.current.getBoundingClientRect().width;
        if (w > 0) setImageWidth(w);
      }
    };
    updateSize();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
        if (w > 0) {
          setImageWidth(w);
        }
      }
    });

    observer.observe(imgRef.current);
  return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout | null = null;
    let isCancelled = false;

    const tick = () => {
      if (isCancelled) return;
      if (!isDeleting) {
        index++;
        setTypedBio(ABOUT_BIO_TEXT.slice(0, index));
        if (index >= ABOUT_BIO_TEXT.length) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            tick();
          }, 4000);
          return;
        }
        timeoutId = setTimeout(tick, 45);
      } else {
        index -= 2;
        if (index <= 0) {
          index = 0;
          setTypedBio('');
          isDeleting = false;
          timeoutId = setTimeout(tick, 800);
          return;
        }
        setTypedBio(ABOUT_BIO_TEXT.slice(0, index));
        timeoutId = setTimeout(tick, 15);
      }
    };

    setTypedBio('');
    timeoutId = setTimeout(tick, 300);

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

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

  const currentTabMeta = useMemo(() => {
    switch (activeTab) {
      case "academic":
        return {
          icon: "ri-graduation-cap-line",
          typeName: "Academic Stack",
          typeBadge: "ACADEMIC RECORDS",
          colorClass: "text-[#a8c7fa]",
          total: 5,
        };
      case "dossier":
        return {
          icon: "ri-article-line",
          typeName: "Research Publications",
          typeBadge: "PEER-REVIEWED PUBLICATIONS",
          colorClass: "text-[#c2e7ff]",
          total: PUBLICATIONS_DATA.length,
        };
      case "portals":
        return {
          icon: "ri-user-shared-line",
          typeName: "Research Portals",
          typeBadge: "RESEARCH PORTALS",
          colorClass: "text-[#a8e6cf]",
          total: ACADEMIC_PORTALS_DATA.length,
        };
      case "radar":
        return {
          icon: "ri-radar-line",
          typeName: "Threat Radar Ops",
          typeBadge: "GLOBAL THREAT RADAR",
          colorClass: "text-[#a8c7fa]",
          total: 1,
        };
      case "crypto":
        return {
          icon: "ri-key-2-line",
          typeName: "Cryptographic Engine",
          typeBadge: "PKI-LAB",
          colorClass: "text-[#a8c7fa]",
          total: 1,
        };
      default:
        return {
          icon: "ri-user-search-line",
          typeName: "Strategic Brief",
          typeBadge: "INTEL & STRATEGIC DOSSIER",
          colorClass: "text-[#a8c7fa]",
          total: 10,
        };
    }
  }, [activeTab]);

 return (
    <section id="about" className="pt-0 px-0 pb-0 border-b-0 bg-transparent relative scroll-mt-28 font-mono text-white" style={{ paddingTop: '0px' }}>
 <div className="max-w-7xl mx-auto px-[8px] space-y-8" style={{ paddingLeft: "8px", paddingRight: "8px" }}>
 
 {/* TOP COMMAND HUD HEADER */}
 <div className="border-b border-[#44474f]/30 pb-6 space-y-4">
 <div className="flex flex-col justify-between gap-4">
 <div className="space-y-2">
 <div>
 <div className="flex items-center space-x-2 text-[13px] leading-[16px] font-mono text-[#a8c7fa] uppercase tracking-widest">
 <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
 <span className="text-[12px]" style={{ fontSize: "12px" }}>STRAT-ACAD</span>
 </div>
 <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3 leading-[24px]" style={{ lineHeight: "24px" }}>
 Intel Brief
 </h2>
 </div>
              {/* Intel Brief: Image direct in bg, side items in container */}
              <div className="flex flex-row items-center gap-0 my-2 w-full">
                {/* Image directly on background */}
                <img
                  ref={imgRef}
                  src="https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/intel/intel.JPG"
                  alt="Intel Brief"
                  className="w-[120px] h-[127px] object-cover rounded-l-[16px] rounded-r-none block border-0 shrink-0"
                />

                {/* Side Items Container */}
                <div
                  className="bg-[#21232b] border-0 rounded-r-[16px] rounded-l-none p-2 flex-1 min-w-0 font-sans flex flex-col justify-between h-[127px]"
                  style={{ width: `calc(100% - ${imageWidth}px)`, paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
                >
                  <p className="text-[16px] font-bold text-white leading-[16px] h-[20px] mb-0" style={{ fontSize: '16px', lineHeight: '16px' }}>
                    Hi, I’m Labib 👋
                  </p>
                  {/* Typed Effect text directly on background */}
                  <p className="text-[#c4c6d0] text-[12px] font-mono leading-[15px] h-[40px] mt-0 mb-1" style={{ fontSize: "12px", lineHeight: "15px" }}>
                    {typedBio}
                    <span className="inline-block w-1.5 h-3.5 bg-[#a8c7fa] ml-0.5 animate-pulse align-middle" />
                  </p>
                  {/* Social media buttons row matching Contact Section buttons */}
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <a
                      href="https://github.com/la-b-ib"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="w-8 h-8 shrink-0 rounded-lg bg-[#000000] text-white flex items-center justify-center text-base shadow-sm cursor-pointer hover:opacity-85 transition-opacity"
                      title="GitHub"
                      aria-label="GitHub"
                    >
                      <i className="ri-github-line"></i>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/la-b-ib?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="w-8 h-8 shrink-0 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center text-base shadow-sm cursor-pointer hover:opacity-85 transition-opacity"
                      title="LinkedIn"
                      aria-label="LinkedIn"
                    >
                      <i className="ri-linkedin-box-line"></i>
                    </a>
                    <a
                      href="https://x.com/la_b_ib_?s=11"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="w-8 h-8 shrink-0 rounded-lg bg-[#1da1f2] text-white flex items-center justify-center text-base shadow-sm cursor-pointer hover:opacity-85 transition-opacity"
                      title="Twitter"
                      aria-label="Twitter"
                    >
                      <i className="ri-twitter-line"></i>
                    </a>
                    <a
                      href="https://wa.me/@la.b.ib"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="w-8 h-8 shrink-0 rounded-lg bg-[#25d366] text-white flex items-center justify-center text-base shadow-sm cursor-pointer hover:opacity-85 transition-opacity"
                      title="WhatsApp"
                      aria-label="WhatsApp"
                    >
                      <i className="ri-whatsapp-line"></i>
                    </a>
                  </div>
                </div>
              </div>
 </div>
 </div>

 {/* PRIMARY INTEL NAVIGATION TABS - SLIDER CAPSULE IDENTICAL TO LIVE INCIDENT */}
 <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] mb-[15px] max-w-2xl w-full">
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
              setActiveTab('portals');
              soundEngine.play('click');
            }}
            title="Academic & Research Portals"
            aria-label="Academic & Research Portals"
            className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center ${
              activeTab === 'portals'
                ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
                : 'text-[#c4c6d0] hover:text-white'
            }`}
          >
            <i className="ri-user-shared-line text-lg"></i>
          </button>

          <button
            onClick={() => {
              setActiveTab('radar');
              soundEngine.play('click');
            }}
            title="Threat Radar"
            aria-label="Threat Radar"
            className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center ${
              activeTab === 'radar'
                ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
                : 'text-[#c4c6d0] hover:text-white'
            }`}
          >
            <i className="ri-radar-line text-lg"></i>
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

          {/* FEED METRICS BAR & SHOWING COUNT - DYNAMIC FOR INTEL BRIEF */}
          <div
            className="bg-[#21232b] rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 text-[12px] leading-[12px] text-[#8e9199] font-mono border-0 mb-[15px]"
            style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "12px", lineHeight: "12px" }}>
                SHOWING{" "}
                <strong className={currentTabMeta.colorClass}>
                  {currentTabMeta.total > 0 ? 1 : 0}-{currentTabMeta.total}
                </strong>{" "}
                OF <strong className="text-white">{currentTabMeta.total}</strong>{" "}
                <strong className={currentTabMeta.colorClass}>{currentTabMeta.typeBadge}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] leading-[11px] text-[#8e9199]">
                <i className={`${currentTabMeta.icon} ${currentTabMeta.colorClass}`}></i>
                TYPE: <strong className="text-white uppercase">{currentTabMeta.typeName}</strong>
              </span>
            </div>
          </div>

 {/* WORKSTATION VIEW CONTAINER: ONLY THE ACTIVE TAB ITEM IS SHOWN FULL-WIDTH */}
          <div className="w-full">
 
 {/* TAB 1: ACADEMIC EXCELLENCE & RESEARCH DOSSIER */}
 {activeTab === 'academic' && (
 <div className="space-y-10 animate-fadeIn font-mono">
 
 {/* 1. BRAC University Degree Header Container */}
 <div>
 <div
                style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
                className="h-[56.9792px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex items-center"
              >
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
 <h3
                        style={{ lineHeight: "16px" }}
                        className="text-[16px] leading-[16px] font-bold text-white break-words"
                      >
 {EDUCATION_DATA.institution}
 </h3>
 <a
                        href="https://maps.app.goo.gl/nZ5RtyffRvahbgH39"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "12px", lineHeight: "12px" }}
                        className="text-[12px] leading-[12px] text-[#a8c7fa] hover:text-white no-underline transition-colors shrink-0 font-mono"
                        title="View BRAC University on Google Maps"
                      >
                        23°46′N 90°25′E
                      </a>
 </div>
 
 <div className="flex items-center justify-between gap-2 text-[13px] leading-[16px] flex-wrap">
                  <span className="text-[16px] leading-[16px] font-semibold text-[#a8c7fa] break-words">
 {EDUCATION_DATA.degree}
 </span>

 {/* Live Timer on the same line at the right */}
                      <div
                        style={{ fontSize: "12px", lineHeight: "12px" }}
                        className="flex items-center text-[12px] leading-[12px] text-[#9CA3AF] font-mono font-medium tracking-wide shrink-0"
                      >
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
  <div
    style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "95px" }}
    className="h-[95px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between"
  >
    <div className="h-[30px] flex items-center justify-between">
      <div className="flex items-center gap-2 text-[13px] leading-[16px] font-bold text-[#fdd663]">
        <div
          style={{ width: "32.9948px", height: "32.9948px" }}
          className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center text-base font-bold shadow-sm"
          title="CGPA Metrics"
        >
          <i className="ri-trophy-line"></i>
        </div>
        <span
          style={{ fontSize: "12px", lineHeight: "12px" }}
          className="text-[12px] leading-[12px]"
        >
          CGPA
        </span>
      </div>
      <span
        style={{ fontSize: "16px" }}
        className="text-[16px] leading-[16px] text-[#8e9199] font-sans font-medium"
      >
        US Scale
      </span>
    </div>
    <div
      style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", backgroundColor: "#000000" }}
      className="h-[38px] bg-black border border-[#44474f]/30 rounded-xl p-2 flex items-center gap-1.5"
    >
      <span
        style={{ fontSize: "24px", lineHeight: "24px" }}
        className="text-[24px] leading-[24px] font-bold text-[#fdd663] font-mono tracking-tight"
      >
        3.12
      </span>
      <span
        style={{ fontSize: "12px", lineHeight: "12px" }}
        className="text-[12px] leading-[12px] text-[#8e9199] font-mono"
      >
        / 4.00
      </span>
    </div>
  </div>

  {/* Card 2: LANGUAGES */}
  <div
    style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "95px" }}
    className="h-[95px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between"
  >
    <div className="h-[30px] flex items-center justify-between">
      <div className="flex items-center gap-2 text-[13px] leading-[16px] font-bold text-[#d0bcff]">
        <div
          style={{ width: "32.9948px", height: "32.9948px" }}
          className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#d0bcff] text-[#381e72] flex items-center justify-center text-base font-bold shadow-sm"
          title="Languages"
        >
          <i className="ri-java-line"></i>
        </div>
        <span
          style={{ fontSize: "16px", lineHeight: "16px" }}
          className="text-[16px] leading-[16px]"
        >
          LANG
        </span>
      </div>
      <span
        style={{ fontSize: "12px", lineHeight: "12px" }}
        className="text-[12px] leading-[12px] text-[#8e9199] font-sans font-medium"
      >
        CORE
      </span>
    </div>
    <div
      style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", fontSize: "12px", lineHeight: "12px", backgroundColor: "#000000" }}
      className="h-[38px] bg-black border border-[#44474f]/30 rounded-xl p-2 text-[12px] text-[#c4c6d0] font-mono leading-[12px] truncate flex items-center"
    >
      Java, Python, C++
    </div>
  </div>

  {/* Card 3: DFIR */}
  <div
    style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "95px" }}
    className="h-[95px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between"
  >
    <div className="h-[30px] flex items-center justify-between">
      <div className="flex items-center gap-2 text-[13px] leading-[16px] font-bold text-[#a8c7fa]">
        <div
          style={{ width: "32.9948px", height: "32.9948px" }}
          className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm"
          title="DFIR"
        >
          <i className="ri-git-repository-private-line"></i>
        </div>
        <span
          style={{ fontSize: "16px", lineHeight: "16px" }}
          className="truncate text-[16px] leading-[16px]"
        >
          DFIR
        </span>
      </div>
      <span
        style={{ fontSize: "12px", lineHeight: "12px" }}
        className="text-[12px] leading-[12px] text-[#8e9199] font-sans font-medium"
      >
        SEC
      </span>
    </div>
    <div
      style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", fontSize: "12px", lineHeight: "12px", backgroundColor: "#000000" }}
      className="h-[38px] bg-black border border-[#44474f]/30 rounded-xl p-2 text-[12px] text-[#c4c6d0] font-mono leading-[12px] truncate flex items-center"
    >
      Wireshark, eBPF
    </div>
  </div>

  {/* Card 4: ARCH */}
  <div
    style={{ paddingLeft: "8px", paddingTop: "8px", paddingRight: "8px", paddingBottom: "8px", height: "95px" }}
    className="h-[95px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between"
  >
    <div className="h-[30px] flex items-center justify-between">
      <div className="flex items-center gap-2 text-[13px] leading-[16px] font-bold text-[#ffb4ab]">
        <div
          style={{ width: "32.9948px", height: "32.9948px" }}
          className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#ffb4ab] text-[#561e18] flex items-center justify-center text-base font-bold shadow-sm"
          title="Architecture"
        >
          <i className="ri-pass-expired-line"></i>
        </div>
        <span
          style={{ fontSize: "16px", lineHeight: "16px" }}
          className="truncate text-[16px] leading-[16px]"
        >
          ARCH
        </span>
      </div>
      <span
        style={{ fontSize: "12px", lineHeight: "12px" }}
        className="text-[12px] leading-[12px] text-[#8e9199] font-sans font-medium"
      >
        SYS
      </span>
    </div>
    <div
      style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", fontSize: "12px", lineHeight: "12px", backgroundColor: "#000000" }}
      className="h-[38px] bg-black border border-[#44474f]/30 rounded-xl p-2 text-[12px] text-[#c4c6d0] font-mono leading-[12px] truncate flex items-center"
    >
      mTLS, Redis L2
    </div>
  </div>

  {/* Card 5: ORGS, SOCS. & CLUBS (Row 3 - Full Width) */}
  <div
    style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "93.98445px" }}
    className="col-span-2 min-h-0 h-[93.98445px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between gap-2.5"
  >
    <div className="h-[30px] flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 text-[13px] leading-[16px] font-bold text-[#a8e6cf]">
        <div
          className="w-[32px] h-[32px] shrink-0 rounded-lg bg-[#a8e6cf] text-[#003923] flex items-center justify-center text-base font-bold shadow-sm"
          title="Organizations, Societies & Clubs"
        >
          <i className="ri-team-line"></i>
        </div>
        <span
          style={{ fontSize: "16px", lineHeight: "16px" }}
          className="truncate text-[16px] leading-[16px]"
        >
          ORGS & CLUBS
        </span>
      </div>
      <span
        style={{ fontSize: "12px", lineHeight: "12px" }}
        className="text-[12px] leading-[12px] text-[#8e9199] font-sans font-medium"
      >
        AFFIL
      </span>
    </div>
    <div 
      style={{ backgroundColor: "#000000", fontSize: "12px", lineHeight: "12px", height: "37.9948px" }}
      className="h-[37.9948px] bg-black border border-[#44474f]/30 rounded-xl px-3 py-2 text-[12px] text-[#c4c6d0] font-mono leading-[12px] whitespace-normal break-words flex items-center"
      title="3Zero, IEEE, BRACU Express & BUEEC"
    >
      3Zero, IEEE, BRACU Express & BUEEC
    </div>
  </div>

  </div>
            </div>

          </div>
        )}

        {/* TAB 2: RESEARCH & PEER-REVIEWED PUBLICATIONS - Exact style as Information Security Analyst in Credentials */}
        {activeTab === 'dossier' && (
          <div className="flex flex-col gap-[15px] animate-fadeIn font-mono">
            <div className="grid grid-cols-1 gap-3.5">
              {PUBLICATIONS_DATA.map((pub) => {
                const isExpanded = !!expandedPubs[pub.id];
                return (
                  <div
                    key={pub.id}
                    className="h-auto bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col shadow-md"
                    style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
                  >
                    {/* Clickable Header matching Credentials cert cards */}
                    <div
                      onClick={() => togglePub(pub.id)}
                      className="h-auto flex flex-col cursor-pointer select-none group"
                    >
                      <div className="flex items-center justify-between gap-2 shrink-0 min-h-[33px]">
                        <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#a8c7fa] min-w-0 flex-1">
                          <div
                            className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#042e60] flex items-center justify-center font-bold shadow-sm"
                            style={{ width: "33px", height: "33px" }}
                            title={pub.conference}
                          >
                            <i className={pub.icon || 'ri-shield-star-line'}></i>
                          </div>
                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <span
                              className="font-mono font-bold text-white text-[16px] leading-[16.5px] break-words text-left line-clamp-2"
                              style={{ fontSize: "16px", lineHeight: "16.5px" }}
                            >
                              {pub.conference}
                            </span>
                            <span
                              style={{ fontSize: "12px", lineHeight: "12px" }}
                              className="text-[12px] leading-[12px] text-[#a8c7fa] font-mono font-medium tracking-wider break-words text-left select-none mt-0.5"
                            >
                              {pub.headerDate || pub.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <i
                            className={`text-base text-[#a8c7fa] transition-all shrink-0 ${
                              isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
                            }`}
                            title={isExpanded ? 'Collapse details' : 'Expand details'}
                          ></i>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content Drawer matching Credentials cert cards */}
                    {isExpanded && (
                      <div
                        className="mt-[15px] min-h-[38px] h-auto bg-[#13141a] border border-[#44474f]/30 rounded-xl p-2 text-[12px] leading-[16.5px] text-[#a8aab3] font-sans space-y-2 animate-fadeIn"
                        style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0 text-[12px] leading-[16px]">
                            <div className="flex flex-row items-start gap-2">
                              <span className="font-semibold text-[#8e9199] leading-[16px] shrink-0 w-16" style={{ width: "64px" }}>
                                TITLE
                              </span>
                              <span className="text-[#8e9199] shrink-0 leading-[16px]">:</span>
                              <span className="font-bold text-white leading-[16px] break-words text-justify flex-1">
                                {pub.title}
                              </span>
                            </div>
                            <div className="flex flex-row items-start gap-2">
                              <span className="font-semibold text-[#8e9199] leading-[16px] shrink-0 w-16" style={{ width: "64px" }}>
                                CONF
                              </span>
                              <span className="text-[#8e9199] shrink-0 leading-[16px]">:</span>
                              <span className="text-[#c2e7ff] font-medium leading-[16px] break-words text-justify flex-1">
                                {pub.venueFull || pub.conference}
                              </span>
                            </div>
                            <div className="flex flex-row items-start gap-2">
                              <span className="font-semibold text-[#8e9199] leading-[16px] shrink-0 w-16" style={{ width: "64px" }}>
                                LOC
                              </span>
                              <span className="text-[#8e9199] shrink-0 leading-[16px]">:</span>
                              <span className="text-white font-medium leading-[16px] break-words flex-1">
                                {pub.location}
                              </span>
                            </div>
                            <div className="flex flex-row items-start gap-2">
                              <span className="font-semibold text-[#8e9199] leading-[16px] shrink-0 w-16" style={{ width: "64px" }}>
                                DATE
                              </span>
                              <span className="text-[#8e9199] shrink-0 leading-[16px]">:</span>
                              <span className="text-white font-medium leading-[16px] break-words flex-1">
                                {pub.date}
                              </span>
                            </div>
                            <div className="flex flex-row items-start gap-2">
                              <span className="font-semibold text-[#8e9199] leading-[16px] shrink-0 w-16" style={{ width: "64px" }}>
                                DOI
                              </span>
                              <span className="text-[#8e9199] shrink-0 leading-[16px]">:</span>
                              <a
                                href={pub.doi}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  soundEngine.play('click');
                                }}
                                className="text-[#a8c7fa] hover:underline break-all leading-[16px] flex-1 text-justify"
                              >
                                {pub.doi}
                              </a>
                            </div>
                            <div className="flex flex-row items-start gap-2">
                              <span className="font-semibold text-[#8e9199] leading-[16px] shrink-0 w-16" style={{ width: "64px" }}>
                                E-ISBN
                              </span>
                              <span className="text-[#8e9199] shrink-0 leading-[16px]">:</span>
                              <span className="text-white font-mono leading-[16px] flex-1">
                                {pub.isbn}
                              </span>
                            </div>
                          </div>

                          {/* View Paper action button matching Credentials verify button */}
                          <a
                            href={pub.doi}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundEngine.play('click');
                            }}
                            title="View IEEE Xplore Publication"
                            className="w-[33px] h-[33px] rounded-lg bg-[#a8c7fa] hover:bg-[#c2e7ff] text-[#00325b] flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer"
                            style={{ width: "33px", height: "33px" }}
                          >
                            <i className="ri-link-unlink-m text-[27px]" style={{ fontSize: "27px" }}></i>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ACADEMIC & RESEARCH PORTALS (Xplore, Scholar, ORCIDiD, ResGate) - Exact style as H.Rank in Credentials */}
        {activeTab === 'portals' && (
          <div className="animate-fadeIn font-mono">
            {/* 2-column side by side layout on all screens matching Credentials Section */}
            <div className="grid grid-cols-2 gap-[15px]" style={{ gap: "15px" }}>
              {ACADEMIC_PORTALS_DATA.map((portal) => {
                return (
                  <div
                    key={portal.name}
                    style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
                    className="h-auto bg-[#21232b] border-0 p-2 rounded-2xl flex flex-col shadow-md"
                  >
                    {/* Card Header (Expanded by default, matching H.Rank card architecture) */}
                    <div className="h-auto flex flex-col select-none">
                      {/* Top Bar: Icon, Title, Status tag, and Right Visit Profile Link Icon */}
                      <div className="flex items-center justify-between gap-2 shrink-0 min-h-[33px]">
                        <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#a8c7fa] min-w-0 flex-1">
                          {/* Button before text like credly bg color #a8c7fa */}
                          <div
                            className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm"
                            style={{ width: "33px", height: "33px" }}
                            title={portal.name}
                          >
                            <i className={portal.icon || 'ri-external-link-line'}></i>
                          </div>
                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <span
                              style={{ fontSize: "16px" }}
                              className="font-mono font-bold text-white text-[16px] leading-tight break-words text-left line-clamp-2"
                            >
                              {portal.name}
                            </span>
                            {/* Status subtitle in #a8c7fa */}
                            <span
                              style={{ fontSize: "12px", lineHeight: "12px" }}
                              className="text-[12px] leading-[12px] text-[#a8c7fa] font-mono font-medium tracking-wider break-words text-left select-none"
                            >
                              {portal.status}
                            </span>
                          </div>
                        </div>

                        {/* Right action button: remix icon ri-link-unlink in #a8c7fa colour, tap to visit */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <a
                            href={portal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundEngine.play('click');
                            }}
                            title={`Visit ${portal.name} profile`}
                            aria-label={`Visit ${portal.name} profile`}
                            className="flex items-center justify-center text-[#a8c7fa] cursor-pointer p-0.5"
                          >
                            <i className="ri-link-unlink text-base text-[#a8c7fa]"></i>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Permanently expanded description container identical to H.Rank in Credentials */}
                    {portal.description && (
                      <div
                        style={{ paddingLeft: "8px", paddingTop: "8px", paddingRight: "8px", paddingBottom: "8px" }}
                        className="mt-[15px] min-h-[38px] h-auto bg-[#13141a] border border-[#44474f]/30 rounded-xl p-2 text-[12px] leading-[16px] text-[#a8aab3] font-sans space-y-2"
                      >
                        <div
                          style={{ paddingTop: "0px", fontSize: "12px", lineHeight: "16px" }}
                          className="pt-0 text-[#a8aab3] text-justify text-[12px] leading-[16px]"
                        >
                          {portal.description}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: THREAT RADAR */}
        {activeTab === 'radar' && (
          <div className="animate-fadeIn font-mono">
            <CyberAttackMapSection />
          </div>
        )}

        {/* TAB 5: CRYPTO SANDBOX */}
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
 <div className="sticky bottom-4 right-4 ml-auto w-fit z-[9999] bg-[#1a1b21] border border-[#a8c7fa] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-[13px] leading-[16px] font-mono animate-fadeIn">
 <i className="ri-checkbox-circle-fill text-[#a8e6cf] text-sm"></i>
 <span>{toastMsg}</span>
 </div>
 )}
 </section>
 );
};
