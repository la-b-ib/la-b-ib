import React, { useState, useMemo } from 'react';
import { CASEFILES_DATA } from '../data/portfolioData';
import { Casefile } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface CasefilesSectionProps {
  onInspectCasefile?: (casefile: Casefile) => void;
}

type CategoryTab = 'all' | 'offsec' | 'dfir' | 'fullstack';

interface FilterOption {
  id: CategoryTab;
  label: string;
  icon: string;
  count: number;
}

export const CasefilesSection: React.FC<CasefilesSectionProps> = () => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCloneId, setCopiedCloneId] = useState<string | null>(null);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    return {
      all: CASEFILES_DATA.length,
      offsec: CASEFILES_DATA.filter((c) => c.category === 'offsec').length,
      dfir: CASEFILES_DATA.filter((c) => c.category === 'dfir').length,
      fullstack: CASEFILES_DATA.filter((c) => c.category === 'fullstack').length,
    };
  }, []);

  const filterTabs: FilterOption[] = [
    { id: 'all', label: 'ALL REPOSITORIES', icon: 'ri-folder-open-line', count: categoryCounts.all },
    { id: 'offsec', label: 'OFFSEC & SCANNERS', icon: 'ri-shield-keyhole-line', count: categoryCounts.offsec },
    { id: 'dfir', label: 'DFIR & FORENSICS', icon: 'ri-search-eye-line', count: categoryCounts.dfir },
    { id: 'fullstack', label: 'AI & FULL-STACK', icon: 'ri-brain-line', count: categoryCounts.fullstack },
  ];

  // Filtered casefiles based on category & search query
  const filteredCasefiles = useMemo(() => {
    return CASEFILES_DATA.filter((file) => {
      // Category filter
      if (activeTab !== 'all' && file.category !== activeTab) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = file.title.toLowerCase().includes(query);
        const inSummary = file.summary.toLowerCase().includes(query);
        const inRepo = (file.repoName || '').toLowerCase().includes(query);
        const inDetails = file.details.some((d) => d.toLowerCase().includes(query));
        return inTitle || inSummary || inRepo || inDetails;
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  const handleCopyClone = (e: React.MouseEvent, file: Casefile) => {
    e.stopPropagation();
    const cloneCmd = `git clone ${file.githubUrl}.git`;
    navigator.clipboard.writeText(cloneCmd);
    setCopiedCloneId(file.id);
    soundEngine.play('terminal_key');
    setTimeout(() => setCopiedCloneId(null), 2000);
  };

  return (
    <section id="projects" className="pt-[15px] px-[15px] pb-12 border-b-0 bg-[#0f0e13] relative scroll-mt-28 font-mono">
      <div className="max-w-7xl mx-auto px-0 flex flex-col gap-[15px]">
        
        {/* TOP SECTION HEADER & METRICS */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-[12px] leading-[13px] font-mono text-[#a8c7fa] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
              <span>ENGINE ARCHIVES // OPEN-SOURCE & SYSTEMS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Casefiles & Repositories
            </h2>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 font-mono">
            {/* Card 1: TOTAL ENGINES */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#a8c7fa]">
                  <div className="w-[28px] h-[28px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-folder-shield-2-line"></i>
                  </div>
                  <span>ENGINES</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">REPOS</span>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[#a8c7fa] font-mono tracking-tight">{CASEFILES_DATA.length}</span>
                <span className="text-xs sm:text-sm text-[#8e9199] font-mono">TOTAL</span>
              </div>
            </div>

            {/* Card 2: OFFSEC */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#ffb4ab]">
                  <div className="w-[28px] h-[28px] shrink-0 rounded-lg bg-[#ffb4ab] text-[#60000e] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-shield-keyhole-line"></i>
                  </div>
                  <span>OFFSEC</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">SCANNERS</span>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[#ffb4ab] font-mono tracking-tight">{categoryCounts.offsec}</span>
                <span className="text-xs sm:text-sm text-[#8e9199] font-mono">ENGINES</span>
              </div>
            </div>

            {/* Card 3: DFIR */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#d0bcff]">
                  <div className="w-[28px] h-[28px] shrink-0 rounded-lg bg-[#d0bcff] text-[#381e72] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-search-eye-line"></i>
                  </div>
                  <span>FORENSICS</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">DFIR</span>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[#d0bcff] font-mono tracking-tight">{categoryCounts.dfir}</span>
                <span className="text-xs sm:text-sm text-[#8e9199] font-mono">ACTIVE</span>
              </div>
            </div>

            {/* Card 4: FULL-STACK & AI */}
            <div className="h-[105px] bg-[#21232b] border-0 p-3.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1.5">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#a8e6cf]">
                  <div className="w-[28px] h-[28px] shrink-0 rounded-lg bg-[#a8e6cf] text-[#003824] flex items-center justify-center text-base font-bold shadow-sm">
                    <i className="ri-brain-line"></i>
                  </div>
                  <span>SYSTEMS</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">AI & WEB</span>
              </div>
              <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[#a8e6cf] font-mono tracking-tight">{categoryCounts.fullstack}</span>
                <span className="text-xs sm:text-sm text-[#8e9199] font-mono">PLATFORMS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Controls Bar: Search Input */}
        <div className="mb-0">
          <div className="flex items-center h-[42px] bg-[#21232b] rounded-xl px-2 max-w-2xl w-full border-0">
            <div className="relative flex-1 flex items-center h-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search casefiles, repositories, OWASP scanners, systems..."
                className="w-full h-full bg-transparent border-0 pl-1.5 pr-8 py-2 text-xs text-white font-mono focus:outline-none placeholder-[#8e9199]/70"
              />
              <div className="absolute right-2 flex items-center space-x-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      soundEngine.play('click');
                    }}
                    className="text-[#8e9199] hover:text-white transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <i className="ri-close-circle-line text-sm"></i>
                  </button>
                ) : (
                  <i className="ri-search-2-line text-sm text-[#8e9199]"></i>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Buttons Capsule */}
        <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] overflow-x-auto scrollbar-none max-w-full w-full">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  soundEngine.play('click');
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#004a77] text-[#c2e7ff] font-bold shadow-sm'
                    : 'text-[#c4c6d0] hover:text-white hover:bg-[#2b2d36]'
                }`}
              >
                <i className={`${tab.icon} text-sm ${isActive ? 'text-[#a8c7fa]' : 'text-[#8e9199]'}`}></i>
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-[#a8c7fa]/20 text-[#a8c7fa]' : 'bg-[#13141a] text-[#8e9199]'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Results Summary Banner */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between text-xs text-[#8e9199] bg-[#21232b] px-4 py-2 rounded-xl border-0">
            <span>
              FILTERED: <strong className="text-white">{filteredCasefiles.length}</strong> matching repositories for "<span className="text-[#a8c7fa]">{searchQuery}</span>"
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#a8c7fa] hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Casefiles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
          {filteredCasefiles.map((file) => {
            const isCopied = copiedCloneId === file.id;

            return (
              <div
                key={file.id}
                className="bg-[#21232b] rounded-2xl border-0 p-5 sm:p-6 space-y-4 transition-all flex flex-col justify-between group relative"
              >
                <div className="space-y-3">
                  {/* Title & GitHub Repo Handle */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#a8c7fa] transition-colors leading-snug">
                      {file.title}
                    </h3>
                    {file.repoName && (
                      <a
                        href={file.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-1 text-xs font-mono text-[#8e9199] hover:text-[#a8c7fa] transition-colors"
                      >
                        <i className="ri-github-fill text-[#a8c7fa]"></i>
                        <span>{file.repoName}</span>
                      </a>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#c4c6d0] leading-relaxed font-sans font-normal">
                    {file.summary}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-3 border-t border-[#44474f]/20 flex items-center gap-2">
                  <a
                    href={file.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.play('click')}
                    className="m3-btn-tonal flex-1 justify-center cursor-pointer text-xs font-mono font-bold h-9"
                  >
                    <i className="ri-github-fill text-base text-[#a8c7fa]"></i>
                    <span>VIEW REPOSITORY</span>
                  </a>

                  {file.liveUrl && (
                    <a
                      href={file.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="px-3.5 h-9 rounded-xl bg-[#3b2f00]/60 hover:bg-[#3b2f00] text-[#fdd663] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      title="Launch Live Streamlit Application"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fdd663] animate-ping"></span>
                      <i className="ri-external-link-line text-sm"></i>
                      <span>LIVE DEMO</span>
                    </a>
                  )}

                  <button
                    onClick={(e) => handleCopyClone(e, file)}
                    className="px-3 h-9 rounded-xl bg-[#13141a] hover:bg-[#2b2d36] text-[#c4c6d0] hover:text-white flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer text-xs font-mono"
                    title="Copy Git Clone Command"
                  >
                    <i className={isCopied ? 'ri-check-line text-[#a8e6cf]' : 'ri-terminal-box-line'}></i>
                    <span>{isCopied ? 'COPIED' : 'CLONE'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCasefiles.length === 0 && (
          <div className="bg-[#21232b] rounded-2xl border-0 p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#13141a] flex items-center justify-center text-[#8e9199] text-2xl">
              <i className="ri-file-search-line"></i>
            </div>
            <h3 className="text-lg font-bold text-white">No Matching Repositories</h3>
            <p className="text-xs text-[#8e9199] max-w-md mx-auto">
              No repositories matched your active search query and category filters.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
                soundEngine.play('click');
              }}
              className="m3-btn-tonal text-xs mx-auto mt-2"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
