import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CASEFILES_DATA } from '../data/portfolioData';
import { Casefile } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface CasefilesSectionProps {
  onInspectCasefile?: (casefile: Casefile) => void;
}

type CategoryTab = 'all' | 'offsec_dfir' | 'fullstack' | 'extension' | 'profiles';

interface FilterOption {
  id: CategoryTab;
  label: string;
  icon: string;
  count: number;
}

interface DevProfile {
  name: string;
  platform: string;
  username: string;
  url: string;
  icon: string;
  description?: string;
}

const DEV_PROFILES_DATA: DevProfile[] = [
  {
    name: 'Str.Lit',
    platform: 'Streamlit Community Cloud',
    username: 'la-b-ib',
    url: 'https://share.streamlit.io/user/la-b-ib',
    icon: 'ri-friendica-line',
  },
  {
    name: 'Github',
    platform: 'GitHub Repositories',
    username: 'la-b-ib',
    url: 'https://github.com/la-b-ib',
    icon: 'ri-github-line',
  },
  {
    name: 'Gitlab',
    platform: 'GitLab Repositories',
    username: 'la-b-ib',
    url: 'https://gitlab.com/la-b-ib',
    icon: 'ri-gitlab-line',
  },
];

export const CasefilesSection: React.FC<CasefilesSectionProps> = () => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadedIds, setDownloadedIds] = useState<Record<string, boolean>>({});
  const [downloadPopup, setDownloadPopup] = useState<{ id: string; title: string } | null>(null);
  const resetTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const itemsPerPage = 4;

  useEffect(() => {
    if (!downloadPopup) return;
    const timer = setTimeout(() => {
      setDownloadPopup(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [downloadPopup]);

  // Clean up all pending reset timers on unmount
  useEffect(() => {
    return () => {
      Object.keys(resetTimersRef.current).forEach((key) => {
        clearTimeout(resetTimersRef.current[key]);
      });
    };
  }, []);

  const handleDownloadExtensionZip = (file: Casefile) => {
    soundEngine.play('click');
    setDownloadedIds((prev) => ({ ...prev, [file.id]: true }));
    setDownloadPopup({ id: file.id, title: file.title });

    // Clear previous timer for this file if present
    if (resetTimersRef.current[file.id]) {
      clearTimeout(resetTimersRef.current[file.id]);
    }

    // Automatically revert icon color back to blue (#a8c7fa) after 3 seconds of pressing
    resetTimersRef.current[file.id] = setTimeout(() => {
      setDownloadedIds((prev) => {
        const next = { ...prev };
        delete next[file.id];
        return next;
      });
      delete resetTimersRef.current[file.id];
    }, 3000);

    // Trigger zip download of extension from GitHub repository
    const zipUrl = `${file.githubUrl}/archive/refs/heads/main.zip`;
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `${file.title}.zip`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    return {
      all: CASEFILES_DATA.length,
      offsecDfir: CASEFILES_DATA.filter((c) => c.category === 'offsec' || c.category === 'dfir').length,
      fullstack: CASEFILES_DATA.filter((c) => c.category === 'fullstack').length,
      extension: CASEFILES_DATA.filter((c) => c.category === 'extension').length,
    };
  }, []);

  const filterTabs: FilterOption[] = [
    { id: 'all', label: 'ALL REPOSITORIES', icon: 'ri-folder-open-line', count: categoryCounts.all },
    { id: 'offsec_dfir', label: 'OFFSEC, DFIR & FORENSICS', icon: 'ri-shield-keyhole-line', count: categoryCounts.offsecDfir },
    { id: 'fullstack', label: 'AI & FULL-STACK', icon: 'ri-brain-line', count: categoryCounts.fullstack },
    { id: 'extension', label: 'BROWSER EXTENSIONS', icon: 'ri-puzzle-line', count: categoryCounts.extension },
    { id: 'profiles', label: 'DEV PROFILES', icon: 'ri-user-community-line', count: DEV_PROFILES_DATA.length },
  ];

  // Filtered casefiles based on category
  const filteredCasefiles = useMemo(() => {
    return CASEFILES_DATA.filter((file) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'offsec_dfir') {
        return file.category === 'offsec' || file.category === 'dfir';
      }
      return file.category === activeTab;
    });
  }, [activeTab]);

  // Paginated casefiles
  const totalPages = Math.ceil(filteredCasefiles.length / itemsPerPage) || 1;
  const paginatedCasefiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCasefiles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCasefiles, currentPage, itemsPerPage]);

  const handleTabChange = (tabId: CategoryTab) => {
    soundEngine.play('click');
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const currentTabMeta = useMemo(() => {
    switch (activeTab) {
      case 'offsec_dfir':
        return {
          icon: 'ri-shield-keyhole-line',
          typeName: 'Security & DFIR',
          typeBadge: 'OFFSEC & FORENSICS REPOS',
          colorClass: 'text-[#ffb4ab]',
          activeButtonBg: 'bg-[#ffb4ab] text-[#561e18]',
          activeIconColor: 'text-[#561e18]',
        };
      case 'fullstack':
        return {
          icon: 'ri-brain-line',
          typeName: 'AI & Full-Stack',
          typeBadge: 'AI & FULL-STACK REPOS',
          colorClass: 'text-[#d0bcff]',
          activeButtonBg: 'bg-[#d0bcff] text-[#381e72]',
          activeIconColor: 'text-[#381e72]',
        };
      case 'extension':
        return {
          icon: 'ri-puzzle-line',
          typeName: 'Browser Extensions',
          typeBadge: 'BROWSER EXTENSIONS',
          colorClass: 'text-[#fdd663]',
          activeButtonBg: 'bg-[#fdd663] text-[#3b2f00]',
          activeIconColor: 'text-[#3b2f00]',
        };
      case 'profiles':
        return {
          icon: 'ri-user-community-line',
          typeName: 'Dev Profiles',
          typeBadge: 'DEV PROFILES',
          colorClass: 'text-[#a8c7fa]',
          activeButtonBg: 'bg-[#a8c7fa] text-[#003258]',
          activeIconColor: 'text-[#003258]',
        };
      default:
        return {
          icon: 'ri-folder-open-line',
          typeName: 'All Repositories',
          typeBadge: 'OSR',
          colorClass: 'text-[#a8c7fa]',
          activeButtonBg: 'bg-[#a8c7fa] text-[#042e60]',
          activeIconColor: 'text-[#042e60]',
        };
    }
  }, [activeTab]);

  return (
    <section id="projects" className="pt-0 px-2 pb-0 border-b-0 bg-transparent relative scroll-mt-28 font-mono" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "0px", paddingBottom: "0px" }}>
      <div className="max-w-7xl mx-auto px-0 flex flex-col gap-[15px]">
        
        {/* TOP SECTION HEADER & METRICS */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-[13px] leading-[16px] font-mono text-[#a8c7fa] uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8c7fa] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a8c7fa] shadow-[0_0_8px_rgba(168,199,250,0.8)]"></span>
              </span>
              <span className="text-[12px]" style={{ fontSize: "12px" }}>DEV & SYS</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1 leading-[24px]" style={{ lineHeight: "24px" }}>
              Casefiles & Repositories
            </h2>
          </div>

          {/* 2 Metric Cards */}
          <div className="grid grid-cols-2 gap-[15px] font-mono" style={{ gap: "15px" }}>
            {/* Card 1: OFFSEC, DFIR & EXTENSIONS */}
            <div className="h-[115px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "115px" }}>
              <div className="min-h-[32px] h-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-[16px] font-bold text-[#a8e6cf] min-w-0">
                  <div className="shrink-0 rounded-lg bg-[#a8e6cf] text-[#003824] flex items-center justify-center text-base font-bold shadow-sm" style={{ width: "32.9948px", height: "32.9948px", backgroundColor: "#a8e6cf" }}>
                    <i className="ri-shield-keyhole-line" style={{ color: "#003824" }}></i>
                  </div>
                  <div className="flex flex-col justify-center font-mono font-bold text-[#a8e6cf] shrink-0 min-w-0" style={{ color: "#a8e6cf" }}>
                    <span className="text-[16px] leading-[16px] truncate" style={{ fontSize: "16px", lineHeight: "16px", color: "#a8e6cf" }}>OFFSEC-DFIR</span>
                    <span className="text-[16px] leading-[16px] truncate" style={{ fontSize: "16px", lineHeight: "16px", color: "#a8e6cf" }}>& EXTENSIONS</span>
                  </div>
                </div>
              </div>
              <div className="h-[60px] bg-black border-0 rounded-xl px-2 py-1 flex flex-col justify-center gap-1 font-mono overflow-hidden" style={{ paddingLeft: "8px", paddingRight: "8px", height: "60px", backgroundColor: "#000000" }}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-2xl font-bold text-[#a8e6cf] font-mono tracking-tight leading-[24px] shrink-0" style={{ fontSize: "24px", lineHeight: "24px", color: "#a8e6cf" }}>
                    {categoryCounts.offsecDfir}
                  </span>
                  <div className="flex flex-col justify-center leading-none min-w-0">
                    <span className="text-[12px] leading-[13px] text-[#8e9199] font-mono truncate" style={{ fontSize: "12px", lineHeight: "13px" }}>SCANNERS</span>
                    <span className="text-[12px] leading-[13px] text-[#8e9199] font-mono truncate" style={{ fontSize: "12px", lineHeight: "13px" }}>& FORENSICS</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-2xl font-bold text-[#a8e6cf] font-mono tracking-tight leading-[24px] shrink-0" style={{ fontSize: "24px", lineHeight: "24px", color: "#a8e6cf" }}>
                    {categoryCounts.extension}
                  </span>
                  <div className="flex flex-col justify-center leading-none min-w-0">
                    <span className="text-[12px] leading-[13px] text-[#8e9199] font-mono truncate" style={{ fontSize: "12px", lineHeight: "13px" }}>BROWSER</span>
                    <span className="text-[12px] leading-[13px] text-[#8e9199] font-mono truncate" style={{ fontSize: "12px", lineHeight: "13px" }}>EXTENSIONS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: FULL-STACK & AI */}
            <div className="h-[115px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "115px" }}>
              <div className="min-h-[32px] h-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-[16px] font-bold text-[#ffb4ab] min-w-0">
                  <div className="shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center text-base font-bold shadow-sm" style={{ width: "32.9948px", height: "32.9948px", backgroundColor: "#ffb4ab" }}>
                    <i className="ri-brain-line" style={{ color: "#60000e" }}></i>
                  </div>
                  <div className="flex flex-col justify-center font-mono font-bold text-[#ffb4ab] shrink-0 min-w-0" style={{ color: "#ffb4ab" }}>
                    <span className="text-[16px] leading-[16px] truncate" style={{ fontSize: "16px", lineHeight: "16px", color: "#ffb4ab" }}>SYSTEMS</span>
                    <span className="text-[16px] leading-[16px] truncate" style={{ fontSize: "16px", lineHeight: "16px", color: "#ffb4ab" }}>& ENGINES</span>
                  </div>
                </div>
              </div>
              <div className="h-[60px] bg-black border-0 rounded-xl px-2 py-1 flex flex-col justify-center gap-1 font-mono overflow-hidden" style={{ paddingLeft: "8px", paddingRight: "8px", height: "60px", backgroundColor: "#000000" }}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-2xl font-bold text-[#ffb4ab] font-mono tracking-tight leading-[24px] shrink-0" style={{ fontSize: "24px", lineHeight: "24px", color: "#ffb4ab" }}>
                    {categoryCounts.fullstack}
                  </span>
                  <span className="text-[12px] leading-[13px] text-[#8e9199] font-mono truncate" style={{ fontSize: "12px", lineHeight: "13px" }}>LMS & ATS</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-2xl font-bold text-[#ffb4ab] font-mono tracking-tight leading-[24px] shrink-0" style={{ fontSize: "24px", lineHeight: "24px", color: "#ffb4ab" }}>
                    9
                  </span>
                  <div className="flex flex-col justify-center leading-none min-w-0">
                    <span className="text-[12px] leading-[13px] text-[#8e9199] font-mono truncate" style={{ fontSize: "12px", lineHeight: "13px" }}>OPEN SOURCE</span>
                    <span className="text-[12px] leading-[13px] text-[#8e9199] font-mono truncate" style={{ fontSize: "12px", lineHeight: "13px" }}>REPOSITORIES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER CAPSULE MATCHING ARSENAL & DISPATCH DESIGN */}
        <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] max-w-2xl w-full">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            let activeColorClass = 'bg-[#a8c7fa] text-[#042e60] font-semibold';
            let iconActiveClass = 'text-[#042e60]';
            if (tab.id === 'offsec_dfir') {
              activeColorClass = 'bg-[#ffb4ab] text-[#561e18] font-semibold';
              iconActiveClass = 'text-[#561e18]';
            } else if (tab.id === 'fullstack') {
              activeColorClass = 'bg-[#d0bcff] text-[#381e72] font-semibold';
              iconActiveClass = 'text-[#381e72]';
            } else if (tab.id === 'extension') {
              activeColorClass = 'bg-[#fdd663] text-[#3b2f00] font-semibold';
              iconActiveClass = 'text-[#3b2f00]';
            } else if (tab.id === 'profiles') {
              activeColorClass = 'bg-[#a8c7fa] text-[#003258] font-semibold';
              iconActiveClass = 'text-[#003258]';
            }

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-[35px] flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center border-0 text-[13px] leading-[16px] ${
                  isActive
                    ? activeColorClass
                    : 'text-[#c4c6d0] hover:text-white'
                }`}
                title={`${tab.label} (${tab.count})`}
                aria-label={tab.label}
              >
                <i className={`${tab.icon} text-base ${isActive ? iconActiveClass : 'text-[#c4c6d0]'}`}></i>
              </button>
            );
          })}
        </div>

        {/* FEED METRICS BAR & SHOWING COUNT */}
        <div
          className="bg-[#21232b] rounded-xl p-2 flex items-center justify-between gap-2 text-[12px] leading-[12px] text-[#8e9199] font-mono border-0"
          style={{ height: "27.9861px", paddingLeft: "8px", paddingRight: "8px", paddingTop: "0px", paddingBottom: "0px" }}
        >
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="truncate" style={{ fontSize: "12px", lineHeight: "12px" }}>
              SHOWING{' '}
              <strong className={currentTabMeta.colorClass}>
                {activeTab === 'profiles'
                  ? `1-${DEV_PROFILES_DATA.length}`
                  : filteredCasefiles.length === 0
                  ? 0
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredCasefiles.length)}`}
              </strong>{' '}
              OF <strong className="text-white">{activeTab === 'profiles' ? DEV_PROFILES_DATA.length : filteredCasefiles.length}</strong>{' '}
              <strong className={currentTabMeta.colorClass}>{currentTabMeta.typeBadge}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] leading-[11px] text-[#8e9199]">
              <i className={`${currentTabMeta.icon} ${currentTabMeta.colorClass}`}></i>
              TYPE: <strong className="text-white uppercase">{currentTabMeta.typeName}</strong>
            </span>
            {activeTab !== 'profiles' && totalPages > 1 && (
              <span className="text-[12px] leading-[12px] text-[#8e9199]" style={{ fontSize: "12px", lineHeight: "12px" }}>
                PAGE <span className={`font-bold ${currentTabMeta.colorClass}`}>{currentPage}</span> / {totalPages}
              </span>
            )}
          </div>
        </div>

        {/* CASEFILES OR DEV PROFILES CARDS FEED */}
        {activeTab === 'profiles' ? (
          <div className="animate-fadeIn">
            {/* 2-column side by side layout on all screens matching H.Rank in Credentials */}
            <div className="grid grid-cols-2 gap-[15px]" style={{ gap: "15px" }}>
              {DEV_PROFILES_DATA.map((profile) => {
                return (
                  <div
                    key={profile.name}
                    style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
                    className="h-auto bg-[#21232b] border-0 p-2 rounded-2xl flex flex-col shadow-md"
                  >
                    {/* Card Header (Expanded by default, matching H.Rank card architecture) */}
                    <div className="h-auto flex flex-col select-none">
                      {/* Top Bar: Icon, Title, Username handle, and Right Visit Profile Icon */}
                      <div className="flex items-center justify-between gap-2 shrink-0 min-h-[33px]">
                        <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#a8c7fa] min-w-0 flex-1">
                          {/* Button before text like credly bg color #a8c7fa */}
                          <div
                            className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm"
                            style={{ width: "33px", height: "33px" }}
                            title={profile.name}
                          >
                            <i className={profile.icon || 'ri-external-link-line'}></i>
                          </div>
                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <span
                              style={{ fontSize: "16px" }}
                              className="font-mono font-bold text-white text-[16px] leading-tight break-words text-left line-clamp-2"
                            >
                              {profile.name}
                            </span>
                            {/* Username without link embedding, color #a8c7fa, no @ */}
                            <span
                              style={{ fontSize: "12px", lineHeight: "12px" }}
                              className="text-[12px] leading-[12px] text-[#a8c7fa] font-mono font-medium tracking-wider break-words text-left select-none"
                            >
                              {profile.username.replace(/^@/, '')}
                            </span>
                          </div>
                        </div>

                        {/* In expand/close button place: remix icon ri-link-unlink in #a8c7fa colour, no colour change, tap to visit */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <a
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundEngine.play('click');
                            }}
                            title={`Visit ${profile.name} profile`}
                            aria-label={`Visit ${profile.name} profile`}
                            className="flex items-center justify-center text-[#a8c7fa] cursor-pointer p-0.5"
                          >
                            <i className="ri-link-unlink text-base text-[#a8c7fa]"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[15px]">
          {filteredCasefiles.length === 0 ? (
            <div className="bg-[#21232b] p-8 rounded-2xl text-center space-y-3 border-0">
              <i className="ri-file-search-line text-3xl text-[#8e9199]"></i>
              <div className="text-white font-bold text-sm">No repositories match this category filter</div>
              <p className="text-[13px] leading-[16px] text-[#8e9199] max-w-md mx-auto">
                Select another category or view all {CASEFILES_DATA.length} open-source repositories and forensic tools.
              </p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setCurrentPage(1);
                  soundEngine.play('click');
                }}
                className="px-4 py-2 bg-[#a8c7fa] text-[#001d35] font-bold text-[13px] leading-[16px] rounded-xl cursor-pointer"
              >
                View All Repositories
              </button>
            </div>
          ) : (
            paginatedCasefiles.map((file) => {
              return (
                <article
                  key={file.id}
                  className="space-y-4 group transition-all"
                >
                  {/* Primary Container in #21232b */}
                  <div className="bg-[#21232b] rounded-xl p-2 space-y-3 border-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
                    
                    {/* Header: GitHub Icon Button + Title */}
                    <div className="flex items-center justify-between gap-2.5 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        {(() => {
                          const fileId = file.id.toLowerCase();
                          const isSpecialThreat = fileId === 'duskprobe' || fileId === 'ouroboros' || fileId === 'ciphersky';
                          const isSpecialExtension =
                            fileId === 'voidfetch' || fileId === 'leafbyte' || fileId === 'costnest' || fileId === 'moodscope';
                          const isSpecialFullstack = fileId === 'litgrid' || fileId === 'vitasort';

                          let customIconClass = 'ri-github-line';
                          if (fileId === 'duskprobe') customIconClass = 'ri-eye-2-line';
                          else if (fileId === 'ouroboros') customIconClass = 'ri-virus-line';
                          else if (fileId === 'ciphersky') customIconClass = 'ri-bluesky-line';
                          else if (fileId === 'voidfetch') customIconClass = 'ri-base-station-line';
                          else if (fileId === 'leafbyte') customIconClass = 'ri-cactus-line';
                          else if (fileId === 'costnest') customIconClass = 'ri-money-pound-circle-line';
                          else if (fileId === 'moodscope') customIconClass = 'ri-emotion-line';
                          else if (fileId === 'litgrid') customIconClass = 'ri-book-3-line';
                          else if (fileId === 'vitasort') customIconClass = 'ri-finder-line';

                          if (isSpecialThreat) {
                            return (
                              <a
                                href={file.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => soundEngine.play('click')}
                                className="shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center text-base font-bold shadow-sm border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                                style={{ width: "32.9948px", height: "32.9948px", backgroundColor: "#ffb4ab" }}
                                title={`Open ${file.repoName || file.title} on GitHub`}
                                aria-label={`GitHub repository ${file.repoName || file.title}`}
                              >
                                <i className={customIconClass} style={{ color: "#60000e" }}></i>
                              </a>
                            );
                          }

                          if (isSpecialExtension) {
                            return (
                              <a
                                href={file.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => soundEngine.play('click')}
                                className="shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center text-base font-bold shadow-sm border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                                style={{ width: "32.9948px", height: "32.9948px", backgroundColor: "#fdd663" }}
                                title={`Open ${file.repoName || file.title} on GitHub`}
                                aria-label={`GitHub repository ${file.repoName || file.title}`}
                              >
                                <i className={customIconClass} style={{ color: "#3b2f00" }}></i>
                              </a>
                            );
                          }

                          if (isSpecialFullstack) {
                            return (
                              <a
                                href={file.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => soundEngine.play('click')}
                                className="shrink-0 rounded-lg bg-[#d0bcff] text-[#381e72] flex items-center justify-center text-base font-bold shadow-sm border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                                style={{ width: "32.9948px", height: "32.9948px", backgroundColor: "#d0bcff" }}
                                title={`Open ${file.repoName || file.title} on GitHub`}
                                aria-label={`GitHub repository ${file.repoName || file.title}`}
                              >
                                <i className={customIconClass} style={{ color: "#381e72" }}></i>
                              </a>
                            );
                          }

                          return (
                            <a
                              href={file.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => soundEngine.play('click')}
                              className="w-8 h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center text-base font-bold shadow-sm shrink-0 border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                              title={`Open ${file.repoName || file.title} on GitHub`}
                              aria-label={`GitHub repository ${file.repoName || file.title}`}
                            >
                              <i className={customIconClass}></i>
                            </a>
                          );
                        })()}
                        <div className="min-w-0">
                          {file.githubUrl ? (
                            <a
                              href={file.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => soundEngine.play('click')}
                              className="text-white hover:text-white visited:text-white active:text-white focus:text-white no-underline hover:no-underline cursor-pointer inline-block"
                              title={`Open ${file.title} on GitHub`}
                            >
                              <h3 className="text-base font-bold text-white leading-[16px]" style={{ lineHeight: "16px" }}>
                                {file.title}
                              </h3>
                            </a>
                          ) : (
                            <h3 className="text-base font-bold text-white leading-[16px]" style={{ lineHeight: "16px" }}>
                              {file.title}
                            </h3>
                          )}
                        </div>
                      </div>

                      {/* Actions & Links Strip */}
                      <div className="flex items-center gap-3 font-mono text-[13px] leading-[16px]">
                        {/* Live Demo Link */}
                        {file.liveUrl && file.id !== 'vitasort' && file.category !== 'offsec' && file.category !== 'dfir' && (
                          <a
                            href={file.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundEngine.play('click')}
                            className="flex items-center gap-1.5 text-[#fdd663] hover:text-white transition-colors cursor-pointer"
                            title="Launch Live Demo"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#fdd663] animate-pulse"></span>
                            <i className="ri-external-link-line text-sm"></i>
                            <span className="font-bold" style={{ fontSize: "12px", lineHeight: "12px" }}>LIVE DEMO</span>
                          </a>
                        )}

                        {/* Casefile Readme Info Icon Link */}
                        {file.githubUrl && (
                          <a
                            href={`${file.githubUrl}/blob/main/README.md`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundEngine.play('click')}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer transition-transform active:scale-90 text-[#a8c7fa] hover:text-[#a8c7fa] visited:text-[#a8c7fa] focus:text-[#a8c7fa] active:text-[#a8c7fa] no-underline"
                            style={{ color: '#a8c7fa' }}
                            title={`View ${file.title} README documentation`}
                            aria-label={`View ${file.title} README documentation on GitHub`}
                          >
                            <i
                              className="ri-information-2-line text-lg"
                              style={{ color: '#a8c7fa' }}
                            />
                          </a>
                        )}

                        {/* Extension Zip Download Icon Button */}
                        {file.category === 'extension' && (
                          <button
                            type="button"
                            onClick={() => handleDownloadExtensionZip(file)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer transition-all duration-300 active:scale-90"
                            style={{
                              color: downloadedIds[file.id] ? '#a8e6cf' : '#a8c7fa',
                            }}
                            title={`Download ${file.title} extension (.zip)`}
                            aria-label={`Download ${file.title} extension archive`}
                          >
                            <i
                              className="ri-archive-stack-line text-lg"
                              style={{
                                color: downloadedIds[file.id] ? '#a8e6cf' : '#a8c7fa',
                              }}
                            />
                          </button>
                        )}

                        {/* Repository Direct Link Icon for All Categories */}
                        {file.githubUrl && (
                          <a
                            href={file.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundEngine.play('click')}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer transition-transform active:scale-90 text-[#a8c7fa] hover:text-[#a8c7fa] visited:text-[#a8c7fa] focus:text-[#a8c7fa] active:text-[#a8c7fa] no-underline"
                            style={{ color: '#a8c7fa' }}
                            title={`Open ${file.title} repository`}
                            aria-label={`Open ${file.title} repository on GitHub`}
                          >
                            <i
                              className="ri-link-unlink text-lg"
                              style={{ color: '#a8c7fa' }}
                            />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {activeTab !== 'profiles' && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[13px] leading-[16px] pt-2">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  soundEngine.play('click');
                  setCurrentPage((p) => p - 1);
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
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
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-full text-[13px] leading-[16px] font-mono transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#a8c7fa] text-[#00325b] font-bold shadow-sm'
                        : 'bg-[#13141a] text-[#8e9199] hover:bg-[#21232b] hover:text-white'
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
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
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

        {/* EXTENSION DOWNLOAD NOTIFICATION POPUP */}
        {downloadPopup && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 bg-[#1e2028] border border-[#a8e6cf]/40 shadow-2xl rounded-2xl p-4 flex items-center gap-3.5 max-w-sm text-[13px] leading-[16px] font-mono text-white animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-[#a8e6cf]/15 text-[#a8e6cf] flex items-center justify-center text-xl shrink-0">
              <i className="ri-archive-stack-line"></i>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[#a8e6cf] flex items-center gap-1.5">
                <span>EXTENSION ARCHIVE</span>
                <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
              </div>
              <div className="text-white truncate font-sans text-[13px] leading-[16px] mt-0.5">
                Downloading {downloadPopup.title}.zip
              </div>
              <div className="text-[13px] leading-[16px] text-[#8e9199] truncate">
                Source: GitHub repository archive
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDownloadPopup(null)}
              className="text-[#8e9199] hover:text-white p-1 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
              aria-label="Dismiss download popup"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
