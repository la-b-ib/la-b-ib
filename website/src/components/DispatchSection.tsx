import React, { useState, useMemo } from 'react';
import { DISPATCHES_DATA } from '../data/portfolioData';
import { Dispatch } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface DispatchSectionProps {
 onInspectDispatch?: (dispatch: Dispatch) => void;
}

type CategoryTab = 'all' | 'kernel' | 'offsec' | 'dfir' | 'architecture';


interface FilterOption {
 id: CategoryTab;
 label: string;
 icon: string;
 count: number;
}

export const DispatchSection: React.FC<DispatchSectionProps> = () => {
 const [activeTab, setActiveTab] = useState<CategoryTab>('all');
 const [copiedPocId, setCopiedPocId] = useState<string | null>(null);
 const [copiedIocId, setCopiedIocId] = useState<string | null>(null);
 const [copiedPathsId, setCopiedPathsId] = useState<string | null>(null);
 const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
 const [likedIds, setLikedIds] = useState<Record<string, boolean>>(() => {
 try {
 const saved = localStorage.getItem('sec_ops_liked_dispatches');
 return saved ? JSON.parse(saved) : {};
 } catch {
 return {};
 }
 });
 const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 6;

 const MONTH_MAP: Record<string, number> = {
 JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
 JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
 };

 const getBaseLikes = (id: string, dateStr: string = 'AUG 2026'): number => {
 let hash = 0;
 for (let i = 0; i < id.length; i++) {
 hash = (hash << 5) - hash + id.charCodeAt(i);
 hash |= 0;
 }
 const absHash = Math.abs(hash);
 // Monthly growth rate strictly between 10 and 25 likes per month
 const monthlyRate = 10 + (absHash % 16);
 const seedLikes = 18 + (absHash % 17);

 const parts = dateStr.trim().split(/\s+/);
 const pubMonth = MONTH_MAP[parts[0]?.toUpperCase()] ?? 7;
 const pubYear = parseInt(parts[1], 10) || 2026;

 const now = new Date();
 const currentYear = now.getFullYear();
 const currentMonth = now.getMonth();
 const currentDay = now.getDate();
 const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

 const elapsedMonths = Math.max(0, (currentYear - pubYear) * 12 + (currentMonth - pubMonth));
 const currentMonthFraction = Math.floor((currentDay / daysInMonth) * monthlyRate);

 return seedLikes + (elapsedMonths * monthlyRate) + currentMonthFraction;
 };

 const getLikeCount = (id: string, dateStr?: string): number => {
 const base = getBaseLikes(id, dateStr);
 return likedIds[id] ? base + 1 : base;
 };

 const handleLike = (dispatch: Dispatch, e: React.MouseEvent) => {
 e.stopPropagation();
 soundEngine.play('click');
 const isNowLiked = !likedIds[dispatch.id];
 setLikedIds((prev) => {
 const updated = { ...prev, [dispatch.id]: isNowLiked };
 try {
 localStorage.setItem('sec_ops_liked_dispatches', JSON.stringify(updated));
 } catch {
 // ignore
 }
 return updated;
 });

 try {
 fetch(`/api/dispatches/likes/${dispatch.id}`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ action: isNowLiked ? 'like' : 'unlike', date: dispatch.date }),
 }).catch(() => {});
 } catch {
 // ignore
 }
 };

 const handleShare = async (dispatch: Dispatch, e: React.MouseEvent) => {
 e.stopPropagation();
 soundEngine.play('click');
 const shareUrl = `${window.location.origin}${window.location.pathname}#dispatch`;
 if (navigator.share) {
 try {
 await navigator.share({
 title: dispatch.title,
 text: `Security Advisory: ${dispatch.title} [${dispatch.targetSystem}]`,
 url: shareUrl,
 });
 return;
 } catch {
 // cancelled or failed, fallback to copy
 }
 }
 try {
 await navigator.clipboard.writeText(`${dispatch.title}\n${shareUrl}`);
 setCopiedShareId(dispatch.id);
 setTimeout(() => setCopiedShareId(null), 2000);
 } catch {
 // ignore
 }
 };

 const toggleExpand = (id: string) => {
 soundEngine.play('click');
 setExpandedIds((prev) => ({
 ...prev,
 [id]: !prev[id],
 }));
 };

 // Compute category counts
 const categoryCounts = useMemo(() => {
 return {
 all: DISPATCHES_DATA.length,
 kernel: DISPATCHES_DATA.filter((d) => d.category === 'kernel').length,
 offsec: DISPATCHES_DATA.filter((d) => d.category === 'offsec').length,
 dfir: DISPATCHES_DATA.filter((d) => d.category === 'dfir').length,
 architecture: DISPATCHES_DATA.filter((d) => d.category === 'architecture').length,
 critical: DISPATCHES_DATA.filter((d) => d.severity === 'CRITICAL').length,
 };
 }, []);

 const filterTabs: FilterOption[] = [
    { id: 'all', label: 'ALL DISPATCHES', icon: 'ri-apps-2-line', count: categoryCounts.all },
    { id: 'kernel', label: 'KERNEL & eBPF', icon: 'ri-database-line', count: categoryCounts.kernel },
    { id: 'offsec', label: 'OFFSEC & EXPLOITS', icon: 'ri-shield-keyhole-line', count: categoryCounts.offsec },
    { id: 'dfir', label: 'DFIR & INCIDENTS', icon: 'ri-search-eye-line', count: categoryCounts.dfir },
    { id: 'architecture', label: 'ZERO-TRUST ARCH', icon: 'ri-git-repository-private-line', count: categoryCounts.architecture },
  ];

 // Filtered dispatches
  const filteredDispatches = useMemo(() => {
    return DISPATCHES_DATA.filter((item) => {
      if (activeTab !== 'all' && item.category !== activeTab) {
        return false;
      }
      return true;
    });
  }, [activeTab]);

  // Paginated dispatches
  const totalPages = Math.ceil(filteredDispatches.length / itemsPerPage) || 1;
  const paginatedDispatches = useMemo(() => {
 const startIndex = (currentPage - 1) * itemsPerPage;
 return filteredDispatches.slice(startIndex, startIndex + itemsPerPage);
 }, [filteredDispatches, currentPage, itemsPerPage]);

 const handleTabChange = (tabId: CategoryTab) => {
 soundEngine.play('click');
 setActiveTab(tabId);
 setCurrentPage(1);
 };


 const handleCopyPoc = (e: React.MouseEvent, dispatch: Dispatch) => {
 e.stopPropagation();
 if (!dispatch.pocCommand) return;
 navigator.clipboard.writeText(dispatch.pocCommand);
 setCopiedPocId(dispatch.id);
 soundEngine.play('terminal_key');
 setTimeout(() => setCopiedPocId(null), 2000);
 };

 const handleCopyIoc = (e: React.MouseEvent, sha256: string, dispatchId: string) => {
 e.stopPropagation();
 navigator.clipboard.writeText(sha256);
 setCopiedIocId(dispatchId);
 soundEngine.play('terminal_key');
 setTimeout(() => setCopiedIocId(null), 2000);
 };

 const handleCopyPaths = (e: React.MouseEvent, paths: string[], dispatchId: string) => {
 e.stopPropagation();
 navigator.clipboard.writeText(paths.join('\n'));
 setCopiedPathsId(dispatchId);
 soundEngine.play('terminal_key');
 setTimeout(() => setCopiedPathsId(null), 2000);
 };

 const getSeverityBadge = (severity: Dispatch['severity']) => {
 switch (severity) {
 case 'CRITICAL':
 return {
 bg: 'bg-[#ffb4ab] text-[#60000e]',
 border: 'border-0',
 dot: 'bg-[#60000e]',
 };
 case 'HIGH':
 return {
 bg: 'bg-[#ffdcc2] text-[#4a2800]',
 border: 'border-0',
 dot: 'bg-[#4a2800]',
 };
 case 'MEDIUM':
 return {
 bg: 'bg-[#d0bcff] text-[#381e72]',
 border: 'border-0',
 dot: 'bg-[#381e72]',
 };
 default:
 return {
 bg: 'bg-[#a8c7fa] text-[#00325b]',
 border: 'border-0',
 dot: 'bg-[#00325b]',
 };
 }
 };

 return (
    <section id="dispatch" className="pt-0 px-[8px] pb-0 border-b-0 bg-transparent relative scroll-mt-28 font-mono" style={{ paddingTop: "0px", paddingLeft: "8px", paddingRight: "8px" }}>
 <div className="max-w-7xl mx-auto px-0 flex flex-col gap-[15px]">
 
 {/* TOP SECTION HEADER & METRICS */}
 <div className="space-y-4">
 <div>
 <div className="flex items-center space-x-2 text-[13px] leading-[16px] font-mono text-[#a8c7fa] uppercase tracking-widest">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8c7fa] opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a8c7fa] shadow-[0_0_8px_rgba(168,199,250,0.8)]"></span>
 </span>
 <span>FSR - TSB</span>
 </div>
 <h2 className="text-2xl font-bold text-white mt-1">
 Dispatches & Intel
 </h2>
 </div>

 {/* 4 Metric Cards */}
 <div className="grid grid-cols-2 gap-3 font-mono">
 {/* Card 1: TOTAL DISPATCHES */}
 <div className="h-[95px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between" style={{ height: "95px", paddingLeft: "8px", paddingTop: "8px", paddingRight: "8px", paddingBottom: "8px" }}>
              <div className="h-[30px] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[16px] font-bold text-[#a8c7fa]">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-shake-hands-line"></i>
                  </div>
                  <span style={{ lineHeight: "16px" }}>BULLETINS</span>
                </div>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl p-2 flex items-center gap-1.5" style={{ paddingLeft: "8px", paddingTop: "8px", paddingRight: "8px", paddingBottom: "8px" }}>
                <span className="text-2xl font-bold text-[#a8c7fa] font-mono tracking-tight leading-[24px]" style={{ fontSize: "24px", lineHeight: "24px" }}>{DISPATCHES_DATA.length}</span>
                <span className="text-[12px] leading-[12px] text-[#8e9199] font-mono" style={{ fontSize: "12px", lineHeight: "12px" }}>PUBLISHED</span>
              </div>
            </div>

 {/* Card 2: CRITICAL FINDINGS */}
 <div className="h-[95px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between" style={{ height: "95px", paddingLeft: "8px", paddingTop: "8px", paddingRight: "8px", paddingBottom: "8px" }}>
              <div className="h-[30px] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[16px] font-bold text-[#ffb4ab]">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-bug-2-line"></i>
                  </div>
                  <span style={{ lineHeight: "16px" }}>CRITICAL</span>
                </div>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl p-2 flex items-center gap-1.5" style={{ paddingLeft: "8px", paddingTop: "8px", paddingRight: "8px", paddingBottom: "8px" }}>
                <span className="text-2xl font-bold text-[#ffb4ab] font-mono tracking-tight leading-[24px]" style={{ fontSize: "24px", lineHeight: "24px" }}>{categoryCounts.critical}</span>
                <span className="text-[12px] leading-[12px] text-[#8e9199] font-mono" style={{ fontSize: "12px", lineHeight: "12px" }}>ZERO-DAYS</span>
              </div>
            </div>
</div>
 </div>

 {/* CATEGORY FILTER CAPSULE MATCHING ARSENAL DESIGN */}
      <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] max-w-2xl w-full">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-[35px] flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center border-0 text-[13px] leading-[16px] ${
                  isActive
                    ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
                    : 'text-[#c4c6d0] hover:text-white'
                }`}
                title={tab.label}
                aria-label={tab.label}
              >
                <i className={`${tab.icon} text-base ${isActive ? 'text-[#042e60]' : 'text-[#c4c6d0]'}`}></i>
              </button>
            );
          })}
      </div>

      {/* FEED METRICS BAR & SHOWING COUNT */}
      <div className="bg-[#21232b] rounded-xl p-2 flex items-center justify-between text-[12px] leading-[12px] text-[#8e9199] font-mono border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "12px", lineHeight: "12px" }}>
            SHOWING <strong className="text-[#a8c7fa]">{filteredDispatches.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredDispatches.length)}</strong> OF <strong className="text-white">{filteredDispatches.length}</strong> BULLETINS
          </span>
        </div>
        {totalPages > 1 && (
          <span className="text-[12px] leading-[12px] text-[#8e9199]" style={{ fontSize: "12px", lineHeight: "12px" }}>
            PAGE <span className="text-[#a8c7fa] font-bold">{currentPage}</span> / {totalPages}
          </span>
        )}
      </div>

      {/* DISPATCH CARDS FEED */}
      <div className="flex flex-col gap-[15px]">
        {filteredDispatches.length === 0 ? (
 <div className="bg-[#21232b] p-8 rounded-2xl text-center space-y-3 border-0">
 <i className="ri-file-search-line text-3xl text-[#8e9199]"></i>
 <div className="text-white font-bold text-sm">No dispatches match your selected category</div>
 <p className="text-[13px] leading-[16px] text-[#8e9199] max-w-md mx-auto">
 Reset the category filter to explore all 25 published security advisories.
 </p>
 <button
 onClick={() => {
 handleTabChange('all');
 }}
 className="px-4 py-2 bg-[#a8c7fa] text-[#001d35] font-bold text-[13px] leading-[16px] rounded-xl cursor-pointer"
 >
 Reset Category Filter
 </button>
 </div>
 ) : (
 paginatedDispatches.map((dispatch) => {
 const isExpanded = !!expandedIds[dispatch.id];
 const formattedReadTime = dispatch.readTime.replace(/\s*MIN READ/i, 'm READ').trim();

 return (
 <article
 key={dispatch.id}
 className="space-y-4 group transition-all"
 >
 {/* Title & Target System in #21232b Container */}
 <div className="bg-[#21232b] rounded-xl p-2 space-y-3 border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
                <h3 className="text-base font-bold text-white leading-[16px]" style={{ lineHeight: "16px" }}>
                  {dispatch.title}
                </h3>

                {/* Target System */}
                <div className="flex flex-wrap items-center gap-2 text-[13px] leading-[16px]">
                  <span className="w-[343.576px] h-[45px] inline-flex items-center bg-[#13141a] text-[#c4c6d0] rounded-md font-mono text-[12px]" style={{ width: "343.576px", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", fontSize: "12px" }}>
                    {dispatch.targetSystem}
                  </span>
                </div>

                {/* Icons Row: Like, Date, Read Time, Share, and Right-Aligned Expand/Collapse Icon */}
                <div className="flex items-center justify-between gap-2 sm:gap-4 font-mono text-[13px] leading-[16px]">
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    {/* Like Button (Before Calendar Icon) */}
                    <button
                      onClick={(e) => handleLike(dispatch, e)}
                      className="flex items-center gap-1.5 text-[#a8c7fa] cursor-pointer select-none"
                      title={likedIds[dispatch.id] ? 'Advisory Liked (Click to unlike)' : 'Like Advisory'}
                      aria-label="Like advisory"
                    >
                      <i className={`${likedIds[dispatch.id] ? 'ri-thumb-up-fill' : 'ri-thumb-up-line'} text-[#a8c7fa]`}></i>
                      <span className={`text-[12px] leading-[12px] font-mono ${likedIds[dispatch.id] ? 'font-bold text-[#a8c7fa]' : 'text-[#a8c7fa]'}`} style={{ fontSize: "12px", lineHeight: "12px" }}>
                        {getLikeCount(dispatch.id, dispatch.date)}
                      </span>
                    </button>

                    {/* Date of Published */}
                    <span className="flex items-center gap-1.5 text-[#a8c7fa]">
                      <i className="ri-calendar-2-line text-[#a8c7fa]"></i>
                      <span style={{ fontSize: "12px", lineHeight: "12px" }}>{dispatch.date}</span>
                    </span>

                    {/* Read Time */}
                    <span className="flex items-center gap-1.5 text-[#a8c7fa]">
                      <i className="ri-time-line text-[#a8c7fa]"></i>
                      <span style={{ fontSize: "12px", lineHeight: "12px" }}>{formattedReadTime}</span>
                    </span>

              {/* Share Button (After Read Time) */}
              <button
                onClick={(e) => handleShare(dispatch, e)}
                className="flex items-center gap-1 text-[#a8c7fa] cursor-pointer"
                title="Share advisory to social media"
                aria-label="Share advisory"
              >
                <i className="ri-share-line text-[#a8c7fa]"></i>
                {copiedShareId === dispatch.id && (
                  <span className="text-[13px] leading-[16px] text-[#a8e6cf] font-mono">COPIED</span>
                )}
              </button>
 </div>

 {/* Expand / Collapse Icon Button (Right-aligned, no color change) */}
 <button
 onClick={() => toggleExpand(dispatch.id)}
 className="flex items-center justify-center text-[#a8c7fa] cursor-pointer text-base shrink-0"
 title={isExpanded ? 'Collapse intel' : 'Expand intel'}
 >
 <i className={isExpanded ? 'ri-swap-3-line text-base text-[#a8c7fa]' : 'ri-beer-line text-base text-[#a8c7fa]'}></i>
 </button>
 </div>
 </div>

 {/* Detailed Intel (Visible when Expanded) */}
 {isExpanded && (
 <>
 {/* MITRE & Summary / TL;DR */}
 <div className="bg-[#21232b] rounded-xl p-2 space-y-2 border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                      <i className="ri-secure-payment-line"></i>
                    </div>
                    <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                      {dispatch.mitreAttck}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#e2e2e9] leading-[16px] font-sans font-normal pl-0" style={{ fontSize: "12px" }}>
                    {dispatch.summary}
                  </p>
                </div>

 {/* Plain English Breakdown (Tech Blog Style) */}
 {dispatch.plainEnglish && (
 <div className="bg-[#21232b] rounded-xl p-2 space-y-2 border-0" style={{ paddingLeft: "8px", paddingTop: "8px", paddingRight: "8px", paddingBottom: "10px" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                      <i className="ri-lightbulb-line"></i>
                    </div>
                    <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                      THE 30s<br />BREAKDOWN
                    </span>
                  </div>
                  <p className="text-[12px] text-[#c4c6d0] leading-[16px] font-sans pl-0" style={{ fontSize: "12px" }}>
                    {dispatch.plainEnglish}
                  </p>
                </div>
 )}

 {/* Real-World Blast Radius & Impact */}
 {dispatch.impact && (
 <div className="bg-[#21232b] rounded-xl p-2 space-y-2 border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center text-base font-bold shadow-sm">
                      <i className="ri-alert-line"></i>
                    </div>
                    <span className="text-base font-bold text-[#ffb4ab] uppercase font-mono tracking-wide leading-[16px]">
                      RISK<br />IMPACT
                    </span>
                  </div>
                  <p className="text-[12px] text-[#c4c6d0] leading-[16px] font-sans pl-0" style={{ fontSize: "12px" }}>
                    {dispatch.impact}
                  </p>
                </div>
 )}

 {/* Key Findings & Technical Breakdown */}
 <div className="bg-[#21232b] rounded-xl p-2 space-y-2 border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                      <i className="ri-ram-line"></i>
                    </div>
                    <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                      TECHNICAL<br />MECHANICS
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-[12px] leading-[15.125px] text-[#c4c6d0] font-sans pl-0">
                    {dispatch.findings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <i className="ri-arrow-right-circle-line text-[#a8c7fa] text-sm shrink-0 mt-0.5"></i>
                        <span className="leading-relaxed" style={{ fontSize: "12px", lineHeight: "15.125px" }}>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

 {/* Endpoint Hardening Playbook */}
 <div className="bg-[#21232b] rounded-xl p-2 space-y-2 border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                      <i className="ri-safe-3-line"></i>
                    </div>
                    <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                      ENDPOINT<br />HARDENING
                    </span>
                  </div>
                  <ul className="space-y-2 text-[12px] leading-[15.125px] text-[#c4c6d0] font-sans pl-0">
                    {dispatch.mitigations.map((mitigation, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <i className="ri-arrow-right-circle-line text-[#a8c7fa] text-sm shrink-0 mt-0.5"></i>
                        <span className="leading-relaxed" style={{ fontSize: "12px", lineHeight: "15.125px" }}>{mitigation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

 {/* IoC Hashes, Signatures & Reproducibility */}
              {(dispatch.iocs || dispatch.pocCommand) && (
                <div className="bg-[#21232b] rounded-xl p-2 space-y-2.5 border-0 font-mono text-[13px] leading-[16px]" style={{ paddingLeft: "8px", paddingTop: "8px", paddingRight: "8px", paddingBottom: "8px" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                      <i className="ri-virus-line"></i>
                    </div>
                    <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                      INDICATORS<br />OF COMPROMISE
                    </span>
                  </div>

                  <div className="space-y-2 pl-0">
                    {dispatch.iocs?.sha256 && (
                      <div className="bg-[#13141a] p-2 rounded-lg text-[13px] leading-[16px] space-y-1.5 font-mono" style={{ paddingLeft: "8px", paddingTop: "8px", paddingBottom: "8px", paddingRight: "8px" }}>
                        <div className="flex items-center justify-between text-[13px] leading-[16px] text-[#8e9199]">
                          <div className="flex items-center gap-1.5" style={{ fontSize: "12px", lineHeight: "12px" }}>
                            <i className="ri-hashtag text-[#a8c7fa] text-sm"></i>
                            <span className="text-[12px] leading-[12px] text-[#8e9199] uppercase" style={{ fontSize: "12px", lineHeight: "12px" }}>SHA256:</span>
                          </div>
                          <button
                            onClick={(e) => handleCopyIoc(e, dispatch.iocs!.sha256!, dispatch.id)}
                            className="cursor-pointer transition-opacity text-sm p-0.5 flex items-center justify-center hover:opacity-80"
                            title="Copy SHA256 Hash"
                          >
                            <i className={copiedIocId === dispatch.id ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line text-[#a8c7fa]'}></i>
                          </button>
                        </div>
                        <div className="text-[#a8c7fa] text-[12px] leading-[16px] break-all font-mono" style={{ fontSize: "12px" }}>
                          {dispatch.iocs.sha256}
                        </div>
                      </div>
                    )}

                    {dispatch.iocs?.filePaths && dispatch.iocs.filePaths.length > 0 && (
                      <div className="bg-[#13141a] p-2 rounded-lg text-[13px] leading-[16px] space-y-1.5 font-mono" style={{ paddingTop: "8px", paddingLeft: "8px", paddingRight: "8px", paddingBottom: "8px" }}>
                        <div className="flex items-center justify-between text-[13px] leading-[16px] text-[#8e9199]">
                          <div className="flex items-center gap-1.5">
                            <i className="ri-folder-shield-2-line text-[#a8c7fa] text-sm"></i>
                            <span className="text-[12px] leading-[12px] text-[#8e9199] uppercase" style={{ fontSize: "12px", lineHeight: "12px" }}>AFFECTED ARTIFACT PATHS:</span>
                          </div>
                          <button
                            onClick={(e) => handleCopyPaths(e, dispatch.iocs!.filePaths!, dispatch.id)}
                            className="cursor-pointer transition-opacity text-sm p-0.5 flex items-center justify-center hover:opacity-80"
                            title="Copy Artifact Paths"
                          >
                            <i className={copiedPathsId === dispatch.id ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line text-[#a8c7fa]'}></i>
                          </button>
                        </div>
                        <div className="space-y-1 text-[#c4c6d0] text-[12px] leading-[16px] break-all" style={{ fontSize: "12px" }}>
                          {dispatch.iocs.filePaths.map((path, idx) => (
                            <div key={idx} style={{ fontSize: "12px" }}>
                              {path}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reproducibility CLI PoC Block */}
                    {dispatch.pocCommand && (
                      <div className="bg-[#13141a] p-2 rounded-lg text-[13px] leading-[16px] space-y-1.5 font-mono" style={{ paddingLeft: "8px", paddingTop: "8px", paddingBottom: "8px", paddingRight: "8px" }}>
                        <div className="flex items-center justify-between text-[13px] leading-[16px] text-[#8e9199]">
                          <div className="flex items-center gap-1.5" style={{ fontSize: "12px", lineHeight: "12px" }}>
                            <i className="ri-terminal-window-line text-[#a8c7fa] text-sm"></i>
                            <span className="text-[12px] leading-[12px] text-[#8e9199] uppercase" style={{ fontSize: "12px", lineHeight: "12px" }}>REPRODUCIBILITY:</span>
                          </div>
                          <button
                            onClick={(e) => handleCopyPoc(e, dispatch)}
                            className="cursor-pointer transition-opacity text-sm p-0.5 flex items-center justify-center hover:opacity-80"
                            title="Copy CLI PoC Command"
                          >
                            <i className={copiedPocId === dispatch.id ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line text-[#a8c7fa]'}></i>
                          </button>
                        </div>
                        <div className="text-[#a8c7fa] overflow-x-auto select-all text-[12px] leading-[16px] break-all">
                          <code className="leading-[16px]" style={{ fontSize: "12px", lineHeight: "16px" }}>{dispatch.pocCommand}</code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* YARA Detection Rule */}
              {dispatch.yaraRule && (
                <div className="bg-[#21232b] rounded-xl p-2 space-y-2 border-0 font-mono text-[13px] leading-[16px]" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <div className="flex items-center justify-between text-[13px] leading-[16px] text-[#8e9199]">
 <div className="flex items-center gap-2.5 leading-[16px]">
 <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
 <i className="ri-shake-hands-line"></i>
 </div>
 <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
 DETECTION<br />SIGNATURE
 </span>
 </div>
 </div>
 <pre className="text-[#a8c7fa] text-[12px] leading-[16px] whitespace-pre-wrap break-words break-all p-2 bg-[#13141a] rounded-lg" style={{ padding: "8px" }}>
                    <code className="text-[12px]" style={{ fontSize: "12px" }}>{dispatch.yaraRule}</code>
                  </pre>
 </div>
 )}
 </>
 )}
 </article>
 );
 })
 )}
 </div>

 {/* PAGINATION CONTROLS */}
 {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[13px] leading-[16px]">
 <button
 onClick={() => {
 if (currentPage > 1) {
 soundEngine.play('click');
 setCurrentPage((p) => p - 1);
 document.getElementById('dispatch')?.scrollIntoView({ behavior: 'smooth' });
 }
 }}
 disabled={currentPage === 1}
 aria-label="Previous Page"
 title="Previous Page"
 className={`w-9 h-9 rounded-[18px] flex items-center justify-center transition-all ${
 currentPage === 1
 ? 'bg-[#1b1c22] text-[#565961] cursor-not-allowed'
 : 'bg-[#21232b] text-[#c4c6d0] hover:bg-[#2c2f3a] hover:text-white cursor-pointer'
 }`}
 >
 <i className="ri-arrow-left-s-line"></i>
 </button>

 {/* Page number indicators */}
 <div className="flex items-center gap-1.5">
 {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
 const isCurrent = pageNum === currentPage;
 return (
 <button
 key={pageNum}
 onClick={() => {
 soundEngine.play('click');
 setCurrentPage(pageNum);
 document.getElementById('dispatch')?.scrollIntoView({ behavior: 'smooth' });
 }}
 className={`w-9 h-9 rounded-[18px] text-base font-bold transition-all cursor-pointer flex items-center justify-center ${
 isCurrent
 ? 'bg-[#a8c7fa] text-[#001d35] shadow-md'
 : 'bg-[#21232b] text-[#8e9199] hover:bg-[#2c2f3a] hover:text-white'
 }`}
 >
 {pageNum}
 </button>
 );
 })}
 </div>

 <button
 onClick={() => {
 if (currentPage < totalPages) {
 soundEngine.play('click');
 setCurrentPage((p) => p + 1);
 document.getElementById('dispatch')?.scrollIntoView({ behavior: 'smooth' });
 }
 }}
 disabled={currentPage === totalPages}
 aria-label="Next Page"
 title="Next Page"
 className={`w-9 h-9 rounded-[18px] flex items-center justify-center transition-all ${
 currentPage === totalPages
 ? 'bg-[#1b1c22] text-[#565961] cursor-not-allowed'
 : 'bg-[#21232b] text-[#c4c6d0] hover:bg-[#2c2f3a] hover:text-white cursor-pointer'
 }`}
 >
 <i className="ri-arrow-right-s-line"></i>
 </button>
 </div>
 )}
 </div>
 </section>
 );
};
