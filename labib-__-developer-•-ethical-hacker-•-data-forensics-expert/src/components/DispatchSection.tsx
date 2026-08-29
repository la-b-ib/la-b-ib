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
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    { id: 'all', label: 'ALL DISPATCHES', icon: 'ri-radar-line', count: categoryCounts.all },
    { id: 'kernel', label: 'KERNEL & eBPF', icon: 'ri-cpu-line', count: categoryCounts.kernel },
    { id: 'offsec', label: 'OFFSEC & EXPLOITS', icon: 'ri-shield-keyhole-line', count: categoryCounts.offsec },
    { id: 'dfir', label: 'DFIR & INCIDENTS', icon: 'ri-search-eye-line', count: categoryCounts.dfir },
    { id: 'architecture', label: 'ZERO-TRUST ARCH', icon: 'ri-lock-password-line', count: categoryCounts.architecture },
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
    <section id="dispatch" className="pt-[15px] px-[15px] pb-12 border-b-0 bg-[#0f0e13] relative scroll-mt-28 font-mono">
      <div className="max-w-7xl mx-auto px-0 flex flex-col gap-[15px]">
        
        {/* TOP SECTION HEADER & METRICS */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-[12px] leading-[13px] font-mono text-[#a8c7fa] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
              <span>FIELD DISPATCHES // TECHNICAL ADVISORIES & RESEARCH BULLETINS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1">
              Security Dispatches & Intel
            </h2>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 font-mono">
            {/* Card 1: TOTAL DISPATCHES */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#a8c7fa]">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-article-line"></i>
                  </div>
                  <span>BULLETINS</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">INDEX</span>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[#a8c7fa] font-mono tracking-tight">{DISPATCHES_DATA.length}</span>
                <span className="text-xs sm:text-sm text-[#8e9199] font-mono">PUBLISHED</span>
              </div>
            </div>

            {/* Card 2: CRITICAL FINDINGS */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#ffb4ab]">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-error-warning-line"></i>
                  </div>
                  <span>CRITICAL</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">ADVISORIES</span>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[#ffb4ab] font-mono tracking-tight">{categoryCounts.critical}</span>
                <span className="text-xs sm:text-sm text-[#8e9199] font-mono">ZERO-DAYS</span>
              </div>
            </div>

            {/* Card 3: EXPLOIT RESEARCH & PoCs */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#a8e6cf]">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8e6cf] text-[#003822] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-terminal-box-line"></i>
                  </div>
                  <span>VERIFIED</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">PROOFS</span>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[#a8e6cf] font-mono tracking-tight">100%</span>
                <span className="text-xs sm:text-sm text-[#8e9199] font-mono">REPRODUCIBLE</span>
              </div>
            </div>

            {/* Card 4: SIGNATURES & IOCS */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#d0bcff]">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#d0bcff] text-[#381e72] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-file-shield-2-line"></i>
                  </div>
                  <span>YARA / IOC</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">RULES</span>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[#d0bcff] font-mono tracking-tight">ACTIVE</span>
                <span className="text-xs sm:text-sm text-[#8e9199] font-mono">ENRICHED</span>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER BAR */}
        <div className="pt-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#a8c7fa] text-[#001d35] font-bold shadow-md border-0'
                      : 'bg-[#21232b] text-[#c4c6d0] hover:bg-[#2c2f3a] hover:text-white border-0'
                  }`}
                >
                  <i className={`${tab.icon} text-sm`}></i>
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#001d35] text-[#a8c7fa]' : 'bg-[#13141a] text-[#8e9199]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FEED METRICS BAR & SHOWING COUNT */}
        <div className="bg-[#21232b] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between text-xs text-[#8e9199] font-mono border-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a8c7fa]"></span>
            <span>
              SHOWING <strong className="text-[#a8c7fa]">{filteredDispatches.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredDispatches.length)}</strong> OF <strong className="text-white">{filteredDispatches.length}</strong> BULLETINS
            </span>
          </div>
          {totalPages > 1 && (
            <span className="text-xs text-[#8e9199]">
              PAGE <span className="text-[#a8c7fa] font-bold">{currentPage}</span> / {totalPages}
            </span>
          )}
        </div>

        {/* DISPATCH CARDS FEED */}
        <div className="flex flex-col gap-[15px] pt-1">
          {filteredDispatches.length === 0 ? (
            <div className="bg-[#21232b] p-8 rounded-2xl text-center space-y-3 border-0">
              <i className="ri-file-search-line text-3xl text-[#8e9199]"></i>
              <div className="text-white font-bold text-sm">No dispatches match your selected category</div>
              <p className="text-xs text-[#8e9199] max-w-md mx-auto">
                Reset the category filter to explore all 25 published security advisories.
              </p>
              <button
                onClick={() => {
                  handleTabChange('all');
                }}
                className="px-4 py-2 bg-[#a8c7fa] text-[#001d35] font-bold text-xs rounded-xl cursor-pointer"
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
                  <div className="bg-[#21232b] rounded-xl p-3.5 sm:p-4 space-y-3 border-0">
                    <h3 className="text-base font-bold text-white leading-[18px]">
                      {dispatch.title}
                    </h3>

                    {/* Target System */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-3 h-[45px] inline-flex items-center bg-[#13141a] text-[#c4c6d0] rounded-md font-mono">
                        {dispatch.targetSystem}
                      </span>
                    </div>

                    {/* Icons Row: Date, Read Time, and Right-Aligned Expand/Collapse Icon */}
                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#44474f]/20 font-mono text-xs">
                      <div className="flex items-center gap-4">
                        {/* Date of Published */}
                        <span className="flex items-center gap-1.5 text-[#a8c7fa]">
                          <i className="ri-calendar-2-line text-[#a8c7fa]"></i>
                          <span>{dispatch.date}</span>
                        </span>

                        {/* Read Time */}
                        <span className="flex items-center gap-1.5 text-[#fdd663]">
                          <i className="ri-time-line text-[#fdd663]"></i>
                          <span>{formattedReadTime}</span>
                        </span>
                      </div>

                      {/* Expand / Collapse Icon Button (Right-aligned, no color change) */}
                      <button
                        onClick={() => toggleExpand(dispatch.id)}
                        className="flex items-center justify-center text-[#a8c7fa] cursor-pointer text-base"
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
                      <div className="bg-[#21232b] rounded-xl p-3.5 sm:p-4 space-y-2 border-0">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                            <i className="ri-secure-payment-line"></i>
                          </div>
                          <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                            {dispatch.mitreAttck}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#e2e2e9] leading-relaxed font-sans font-normal pl-0 sm:pl-[42px]">
                          {dispatch.summary}
                        </p>
                      </div>

                      {/* Plain English Breakdown (Tech Blog Style) */}
                      {dispatch.plainEnglish && (
                        <div className="bg-[#21232b] rounded-xl p-3.5 sm:p-4 space-y-2 border-0">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                              <i className="ri-lightbulb-line"></i>
                            </div>
                            <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                              THE 30s<br />BREAKDOWN
                            </span>
                          </div>
                          <p className="text-xs text-[#c4c6d0] leading-relaxed font-sans pl-0 sm:pl-[42px]">
                            {dispatch.plainEnglish}
                          </p>
                        </div>
                      )}

                      {/* Real-World Blast Radius & Impact */}
                      {dispatch.impact && (
                        <div className="bg-[#21232b] rounded-xl p-3.5 sm:p-4 space-y-2 border-0">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center text-base font-bold shadow-sm">
                              <i className="ri-alert-line"></i>
                            </div>
                            <span className="text-base font-bold text-[#ffb4ab] uppercase font-mono tracking-wide leading-[16px]">
                              RISK<br />IMPACT
                            </span>
                          </div>
                          <p className="text-xs text-[#c4c6d0] leading-relaxed font-sans pl-0 sm:pl-[42px]">
                            {dispatch.impact}
                          </p>
                        </div>
                      )}

                      {/* Key Findings & Technical Breakdown */}
                      <div className="bg-[#21232b] rounded-xl p-3.5 sm:p-4 space-y-2 border-0">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                            <i className="ri-ram-line"></i>
                          </div>
                          <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                            TECHNICAL<br />MECHANICS
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#c4c6d0] font-sans pl-0 sm:pl-[42px]">
                          {dispatch.findings.map((finding, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <i className="ri-arrow-right-circle-line text-[#a8c7fa] text-sm shrink-0 mt-0.5"></i>
                              <span className="leading-relaxed">{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Endpoint Hardening Playbook */}
                      <div className="bg-[#21232b] rounded-xl p-3.5 sm:p-4 space-y-2 border-0">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                            <i className="ri-safe-3-line"></i>
                          </div>
                          <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                            ENDPOINT<br />HARDENING
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs text-[#c4c6d0] font-sans pl-0 sm:pl-[42px]">
                          {dispatch.mitigations.map((mitigation, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <i className="ri-arrow-right-circle-line text-[#a8c7fa] text-sm shrink-0 mt-0.5"></i>
                              <span className="leading-relaxed">{mitigation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* IoC Hashes, Signatures & Reproducibility */}
                      {(dispatch.iocs || dispatch.pocCommand) && (
                        <div className="bg-[#21232b] rounded-xl p-3.5 sm:p-4 space-y-2.5 border-0 font-mono text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                              <i className="ri-virus-line"></i>
                            </div>
                            <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                              INDICATORS<br />OF COMPROMISE
                            </span>
                          </div>

                          <div className="space-y-2 pl-0 sm:pl-[42px]">
                            {dispatch.iocs?.sha256 && (
                              <div className="bg-[#13141a] p-2.5 rounded-lg text-xs space-y-1.5 font-mono">
                                <div className="flex items-center justify-between text-xs text-[#8e9199]">
                                  <div className="flex items-center gap-1.5">
                                    <i className="ri-hashtag text-[#a8c7fa] text-sm"></i>
                                    <span className="text-xs text-[#8e9199] uppercase">SHA256:</span>
                                  </div>
                                  <button
                                    onClick={(e) => handleCopyIoc(e, dispatch.iocs!.sha256!, dispatch.id)}
                                    className="cursor-pointer transition-opacity text-sm p-0.5 flex items-center justify-center hover:opacity-80"
                                    title="Copy SHA256 Hash"
                                  >
                                    <i className={copiedIocId === dispatch.id ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line text-[#a8c7fa]'}></i>
                                  </button>
                                </div>
                                <div className="text-[#a8c7fa] text-xs break-all font-mono">
                                  {dispatch.iocs.sha256}
                                </div>
                              </div>
                            )}

                            {dispatch.iocs?.filePaths && dispatch.iocs.filePaths.length > 0 && (
                              <div className="bg-[#13141a] p-2.5 rounded-lg text-xs space-y-1.5 font-mono">
                                <div className="flex items-center justify-between text-xs text-[#8e9199]">
                                  <div className="flex items-center gap-1.5">
                                    <i className="ri-folder-shield-2-line text-[#a8c7fa] text-sm"></i>
                                    <span className="text-xs text-[#8e9199] uppercase">AFFECTED ARTIFACT PATHS:</span>
                                  </div>
                                  <button
                                    onClick={(e) => handleCopyPaths(e, dispatch.iocs!.filePaths!, dispatch.id)}
                                    className="cursor-pointer transition-opacity text-sm p-0.5 flex items-center justify-center hover:opacity-80"
                                    title="Copy Artifact Paths"
                                  >
                                    <i className={copiedPathsId === dispatch.id ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line text-[#a8c7fa]'}></i>
                                  </button>
                                </div>
                                <div className="space-y-1 text-[#c4c6d0] text-xs break-all">
                                  {dispatch.iocs.filePaths.map((path, idx) => (
                                    <div key={idx}>
                                      {path}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Reproducibility CLI PoC Block */}
                            {dispatch.pocCommand && (
                              <div className="bg-[#13141a] p-2.5 rounded-lg text-xs space-y-1.5 font-mono">
                                <div className="flex items-center justify-between text-xs text-[#8e9199]">
                                  <div className="flex items-center gap-1.5">
                                    <i className="ri-terminal-window-line text-[#a8c7fa] text-sm"></i>
                                    <span className="text-xs text-[#8e9199] uppercase">REPRODUCIBILITY:</span>
                                  </div>
                                  <button
                                    onClick={(e) => handleCopyPoc(e, dispatch)}
                                    className="cursor-pointer transition-opacity text-sm p-0.5 flex items-center justify-center hover:opacity-80"
                                    title="Copy CLI PoC Command"
                                  >
                                    <i className={copiedPocId === dispatch.id ? 'ri-survey-line text-[#a8e6cf]' : 'ri-file-copy-2-line text-[#a8c7fa]'}></i>
                                  </button>
                                </div>
                                <div className="text-[#a8c7fa] overflow-x-auto select-all text-xs break-all">
                                  <code className="leading-[14px]">{dispatch.pocCommand}</code>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* YARA Detection Rule */}
                      {dispatch.yaraRule && (
                        <div className="bg-[#21232b] rounded-xl p-3.5 sm:p-4 space-y-2 border-0 font-mono text-xs">
                          <div className="flex items-center justify-between text-xs text-[#8e9199]">
                            <div className="flex items-center gap-2.5 leading-[12px]">
                              <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                                <i className="ri-shake-hands-line"></i>
                              </div>
                              <span className="text-base font-bold text-[#a8c7fa] uppercase font-mono tracking-wide leading-[16px]">
                                DETECTION<br />SIGNATURE
                              </span>
                            </div>
                          </div>
                          <pre className="text-[#a8c7fa] text-xs whitespace-pre-wrap break-words break-all p-2.5 bg-[#13141a] rounded-lg">
                            <code>{dispatch.yaraRule}</code>
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
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 pb-2 border-t border-[#44474f]/20 font-mono text-xs">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  soundEngine.play('click');
                  setCurrentPage((p) => p - 1);
                  document.getElementById('dispatch')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                currentPage === 1
                  ? 'bg-[#1b1c22] text-[#565961] cursor-not-allowed'
                  : 'bg-[#21232b] text-[#c4c6d0] hover:bg-[#2c2f3a] hover:text-white cursor-pointer'
              }`}
            >
              <i className="ri-arrow-left-s-line"></i>
              <span>PREVIOUS</span>
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
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                currentPage === totalPages
                  ? 'bg-[#1b1c22] text-[#565961] cursor-not-allowed'
                  : 'bg-[#21232b] text-[#c4c6d0] hover:bg-[#2c2f3a] hover:text-white cursor-pointer'
              }`}
            >
              <span>NEXT</span>
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
