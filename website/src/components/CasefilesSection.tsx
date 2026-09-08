import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CASEFILES_DATA } from '../data/portfolioData';
import { Casefile } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface CasefilesSectionProps {
  onInspectCasefile?: (casefile: Casefile) => void;
}

type CategoryTab = 'all' | 'offsec_dfir' | 'fullstack' | 'extension';

interface FilterOption {
  id: CategoryTab;
  label: string;
  icon: string;
  count: number;
}

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

  return (
    <section id="projects" className="pt-[15px] px-[15px] pb-12 border-b-0 bg-transparent relative scroll-mt-28 font-mono">
      <div className="max-w-7xl mx-auto px-0 flex flex-col gap-[15px]">
        
        {/* TOP SECTION HEADER & METRICS */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-[12px] leading-[13px] font-mono text-[#a8c7fa] uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8c7fa] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a8c7fa] shadow-[0_0_8px_rgba(168,199,250,0.8)]"></span>
              </span>
              <span>ENGINE ARCHIVES // OPEN-SOURCE & SYSTEMS</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Casefiles & Repositories
            </h2>
          </div>

          {/* 4 Metric Cards - Merged OFFSEC & DFIR */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {/* Card 1: TOTAL ENGINES */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[16px] font-bold text-[#a8c7fa]">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-folder-shield-2-line"></i>
                  </div>
                  <span>ENGINES</span>
                </div>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl font-bold text-[#a8c7fa] font-mono tracking-tight leading-[20px]">
                  {CASEFILES_DATA.length}
                </span>
                <span className="text-xs text-[#8e9199] font-mono">ARCHIVES</span>
              </div>
            </div>

            {/* Card 2: OFFSEC & FORENSICS */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[16px] font-bold text-[#ffb4ab]">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-shield-keyhole-line"></i>
                  </div>
                  <span>OFFSEC & DFIR</span>
                </div>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl font-bold text-[#ffb4ab] font-mono tracking-tight leading-[20px]">
                  {categoryCounts.offsecDfir}
                </span>
                <span className="text-xs text-[#8e9199] font-mono">SCANNERS & FORENSICS</span>
              </div>
            </div>

            {/* Card 3: FULL-STACK & AI */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[16px] font-bold text-[#a8e6cf]">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8e6cf] text-[#003824] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-brain-line"></i>
                  </div>
                  <span>SYSTEMS</span>
                </div>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl font-bold text-[#a8e6cf] font-mono tracking-tight leading-[20px]">
                  {categoryCounts.fullstack}
                </span>
                <span className="text-xs text-[#8e9199] font-mono">AI & WEB</span>
              </div>
            </div>

            {/* Card 4: EXTENSIONS */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[16px] font-bold text-[#ffd8e4]">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#ffd8e4] text-[#630030] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-puzzle-line"></i>
                  </div>
                  <span>EXTENSIONS</span>
                </div>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl font-bold text-[#ffd8e4] font-mono tracking-tight leading-[20px]">
                  {categoryCounts.extension}
                </span>
                <span className="text-xs text-[#8e9199] font-mono">ADD-ONS</span>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER CAPSULE MATCHING ARSENAL & DISPATCH DESIGN */}
        <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] max-w-2xl w-full">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-[35px] flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center border-0 text-[12px] leading-[12px] ${
                  isActive
                    ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
                    : 'text-[#c4c6d0] hover:text-white'
                }`}
                title={`${tab.label} (${tab.count})`}
                aria-label={tab.label}
              >
                <i className={`${tab.icon} text-base ${isActive ? 'text-[#042e60]' : 'text-[#c4c6d0]'}`}></i>
              </button>
            );
          })}
        </div>

        {/* FEED METRICS BAR & SHOWING COUNT */}
        <div className="flex items-center justify-between text-xs text-[#8e9199] font-mono px-1">
          <span className="flex items-center gap-1.5">
            <i className="ri-archive-stack-line text-[#a8c7fa]"></i>
            <span>SHOWING {filteredCasefiles.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredCasefiles.length)} OF {filteredCasefiles.length} REPOSITORIES</span>
          </span>
          {activeTab !== 'all' && (
            <span className="text-[#a8c7fa] uppercase">
              FILTER: {filterTabs.find((t) => t.id === activeTab)?.label}
            </span>
          )}
        </div>

        {/* CASEFILES CARDS FEED */}
        <div className="flex flex-col gap-[15px]">
          {filteredCasefiles.length === 0 ? (
            <div className="bg-[#21232b] p-8 rounded-2xl text-center space-y-3 border-0">
              <i className="ri-file-search-line text-3xl text-[#8e9199]"></i>
              <div className="text-white font-bold text-sm">No repositories match this category filter</div>
              <p className="text-xs text-[#8e9199] max-w-md mx-auto">
                Select another category or view all {CASEFILES_DATA.length} open-source repositories and forensic tools.
              </p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setCurrentPage(1);
                  soundEngine.play('click');
                }}
                className="px-4 py-2 bg-[#a8c7fa] text-[#001d35] font-bold text-xs rounded-xl cursor-pointer"
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
                  <div className="bg-[#21232b] rounded-xl p-3.5 space-y-3 border-0">
                    
                    {/* Header: GitHub Icon Button + Title */}
                    <div className="flex items-center justify-between gap-2.5 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <a
                          href={file.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundEngine.play('click')}
                          className="w-8 h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center text-base font-bold shadow-sm shrink-0 border-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                          title={`Open ${file.repoName || file.title} on GitHub`}
                          aria-label={`GitHub repository ${file.repoName || file.title}`}
                        >
                          <i className="ri-github-line"></i>
                        </a>
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
                              <h3 className="text-base font-bold text-white leading-[20px]">
                                {file.title}
                              </h3>
                            </a>
                          ) : (
                            <h3 className="text-base font-bold text-white leading-[20px]">
                              {file.title}
                            </h3>
                          )}
                        </div>
                      </div>

                      {/* Actions & Links Strip */}
                      <div className="flex items-center gap-3 font-mono text-xs">
                        {/* Live Demo Link */}
                        {file.liveUrl && (
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
                            <span className="font-bold">LIVE DEMO</span>
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
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs pt-2">
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
                    className={`w-8 h-8 rounded-full text-xs font-mono transition-all cursor-pointer ${
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
            className="fixed bottom-6 right-6 z-50 bg-[#1e2028] border border-[#a8e6cf]/40 shadow-2xl rounded-2xl p-4 flex items-center gap-3.5 max-w-sm text-xs font-mono text-white animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-[#a8e6cf]/15 text-[#a8e6cf] flex items-center justify-center text-xl shrink-0">
              <i className="ri-archive-stack-line"></i>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[#a8e6cf] flex items-center gap-1.5">
                <span>EXTENSION ARCHIVE</span>
                <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
              </div>
              <div className="text-white truncate font-sans text-xs mt-0.5">
                Downloading {downloadPopup.title}.zip
              </div>
              <div className="text-[11px] text-[#8e9199] truncate">
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
