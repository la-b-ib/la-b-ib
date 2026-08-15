import React, { useState, useEffect } from 'react';
import { DISPATCHES_DATA } from '../data/portfolioData';
import { Dispatch } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { CvssCalculatorModal } from './CvssCalculatorModal';
import { IntelBriefsAnalytics } from './IntelBriefsAnalytics';

// Helper for inline markdown bold and code formatting
function parseInlineStyles(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-[#0a0a0e] border border-[#44474f]/50 text-[#a8c7fa] font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// Rich Formatted Technical Markdown Document Renderer
const FormattedMarkdownDoc: React.FC<{ markdown: string; fontSize: 'sm' | 'base' | 'lg' }> = ({
  markdown,
  fontSize,
}) => {
  const lines = markdown.split('\n');

  return (
    <div className={`space-y-4 font-sans ${fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2"></div>;

        // Heading 2 (##)
        if (trimmed.startsWith('## ')) {
          const title = trimmed.replace('## ', '');
          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <div key={idx} id={id} className="pt-4 pb-2 border-b border-[#44474f]/40 my-3">
              <h2 className="text-lg sm:text-xl font-mono font-bold text-white flex items-center space-x-2.5">
                <span className="w-2 h-5 bg-[#a8c7fa] rounded-full inline-block shrink-0"></span>
                <span>{title}</span>
              </h2>
            </div>
          );
        }

        // Heading 3 (###)
        if (trimmed.startsWith('### ')) {
          const title = trimmed.replace('### ', '');
          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <h3 key={idx} id={id} className="text-sm sm:text-base font-mono font-bold text-[#a8c7fa] pt-3 pb-1 flex items-center space-x-2">
              <i className="ri-hashtag text-[#a8c7fa] text-xs"></i>
              <span>{title}</span>
            </h3>
          );
        }

        // Bullet list item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start space-x-2.5 pl-2 my-1 text-[#c4c6d0]">
              <span className="text-[#a8c7fa] mt-1 text-xs shrink-0">•</span>
              <span className="leading-relaxed">{parseInlineStyles(itemText)}</span>
            </div>
          );
        }

        // Numbered list item
        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\.\s(.*)/);
          if (match) {
            return (
              <div key={idx} className="flex items-start space-x-2.5 pl-2 my-1 text-[#c4c6d0]">
                <span className="px-1.5 py-0.5 rounded bg-[#004a77]/50 text-[#c2e7ff] text-[10px] font-mono font-bold shrink-0">
                  {match[1]}
                </span>
                <span className="leading-relaxed">{parseInlineStyles(match[2])}</span>
              </div>
            );
          }
        }

        // Paragraph
        return (
          <p key={idx} className="text-[#c4c6d0] leading-relaxed font-sans">
            {parseInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export const DispatchesSection: React.FC = () => {
  const [activeDispatch, setActiveDispatch] = useState<Dispatch | null>(null);
  const [activeIntelTab, setActiveIntelTab] = useState<'feed' | 'analytics'>('feed');
  const [isCvssModalOpen, setIsCvssModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'threat'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpulse_bookmarked_dispatches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [readerTheme, setReaderTheme] = useState<'cyber' | 'matrix' | 'slate'>('cyber');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Scroll listener for reading progress inside reader modal
  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const totalScroll = scrollHeight - clientHeight;
    if (totalScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, Math.round((scrollTop / totalScroll) * 100))));
    }
  };

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cyberpulse_bookmarked_dispatches', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    soundEngine.play('click');
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('REMOVED ADVISORY FROM BOOKMARKS');
        return prev.filter((item) => item !== id);
      } else {
        showToast('ADVISORY SAVED TO BOOKMARKS');
        return [...prev, id];
      }
    });
  };

  const handleCopyCode = (code: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(code);
    soundEngine.play('click');
    setCopiedCodeId(id);
    showToast('SNIPPET COPIED TO CLIPBOARD');
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Filter & Search Logic
  const filteredDispatches = DISPATCHES_DATA.filter((dispatch) => {
    // Category filter
    if (selectedCategory === 'bookmarked') {
      if (!bookmarkedIds.includes(dispatch.id)) return false;
    } else if (selectedCategory !== 'all') {
      if (dispatch.category !== selectedCategory) return false;
    }

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dispatch.title.toLowerCase().includes(q) ||
      dispatch.excerpt.toLowerCase().includes(q) ||
      dispatch.tags.some((t) => t.toLowerCase().includes(q)) ||
      dispatch.cveReference?.toLowerCase().includes(q) ||
      dispatch.category.toLowerCase().includes(q)
    );
  }).sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.viewsCount || 0) - (a.viewsCount || 0);
    }
    if (sortBy === 'threat') {
      const threatRank = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, INFORMATIONAL: 1 };
      return (threatRank[b.threatLevel || 'INFORMATIONAL'] || 0) - (threatRank[a.threatLevel || 'INFORMATIONAL'] || 0);
    }
    // Default latest
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Modal Next/Prev Navigation
  const handleModalNavigate = (direction: 'prev' | 'next') => {
    if (!activeDispatch) return;
    const currentIndex = filteredDispatches.findIndex((d) => d.id === activeDispatch.id);
    if (currentIndex === -1) return;

    soundEngine.play('click');
    if (direction === 'prev') {
      const prevIndex = (currentIndex - 1 + filteredDispatches.length) % filteredDispatches.length;
      setActiveDispatch(filteredDispatches[prevIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % filteredDispatches.length;
      setActiveDispatch(filteredDispatches[nextIndex]);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'dfir':
        return { label: 'DFIR & KERNEL', color: 'bg-[#93000a]/30 text-[#ffb4ab] border-[#ffb4ab]/40' };
      case 'arch':
        return { label: 'ZERO-TRUST ARCH', color: 'bg-[#004a77]/30 text-[#c2e7ff] border-[#a8c7fa]/40' };
      case 'offsec':
        return { label: 'OFFSEC & FUZZING', color: 'bg-[#5f3300]/30 text-[#ffb951] border-[#ffb951]/40' };
      case 'ai_security':
        return { label: 'AI SECURITY', color: 'bg-[#3b00ed]/30 text-[#d0bcff] border-[#d0bcff]/40' };
      case 'cloud':
        return { label: 'CLOUD & KMS', color: 'bg-[#005231]/30 text-[#a8e6cf] border-[#a8e6cf]/40' };
      default:
        return { label: cat.toUpperCase(), color: 'bg-[#21232b] text-[#c4c6d0] border-[#44474f]/40' };
    }
  };

  const getThreatBadge = (level?: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded bg-[#93000a] text-[#ffb4ab] text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 border border-[#ffb4ab]/50 animate-pulse"><i className="ri-alarm-warning-line"></i> CRITICAL THREAT</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded bg-[#5f3300] text-[#ffb951] text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 border border-[#ffb951]/50"><i className="ri-shield-keyhole-line"></i> HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded bg-[#36343b] text-[#e2e2e6] text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 border border-[#8e9199]/50"><i className="ri-error-warning-line"></i> MEDIUM RISK</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-[#1f2027] text-[#a8c7fa] text-[10px] font-mono font-bold tracking-wider border border-[#a8c7fa]/40">INFO BRIEF</span>;
    }
  };

  return (
    <section id="blog" className="py-16 md:py-24 border-b-0 bg-[#0f0e13] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* TOP HEADER & TELEMETRY DISPLAY */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#a8c7fa] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
              <span>TACTICAL THREAT INTELLIGENCE & RESEARCH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Field Intel Briefings & Technical Advisories
            </h2>
            <p className="text-sm text-[#c4c6d0] max-w-2xl font-sans">
              Peer-reviewed technical whitepapers, Kernel & eBPF exploit analysis, zero-trust cryptographic architectures, and GenAI security advisories.
            </p>
          </div>

          {/* TELEMETRY STATS COUNTER */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto font-mono text-xs">
            <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#44474f]/40 flex items-center space-x-3 shadow-md">
              <div className="p-2 bg-[#004a77]/30 rounded-lg text-[#a8c7fa] border border-[#a8c7fa]/30">
                <i className="ri-article-line text-lg"></i>
              </div>
              <div>
                <div className="text-[10px] text-[#8e9199] uppercase">TOTAL BRIEFS</div>
                <div className="text-base font-bold text-white">{DISPATCHES_DATA.length} ADVISORIES</div>
              </div>
            </div>

            <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#44474f]/40 flex items-center space-x-3 shadow-md">
              <div className="p-2 bg-[#5f3300]/30 rounded-lg text-[#ffb951] border border-[#ffb951]/30">
                <i className="ri-bookmark-3-line text-lg"></i>
              </div>
              <div>
                <div className="text-[10px] text-[#8e9199] uppercase">SAVED BOOKMARKS</div>
                <div className="text-base font-bold text-white">{bookmarkedIds.length} BRIEFS</div>
              </div>
            </div>

            {/* CVSS CALCULATOR BUTTON */}
            <button
              onClick={() => {
                setIsCvssModalOpen(true);
                soundEngine.play('click');
              }}
              className="bg-[#1a1b21] hover:bg-[#21232b] p-3 rounded-xl border border-[#a8c7fa]/40 flex items-center space-x-3 shadow-md text-left transition-all cursor-pointer group"
              title="Launch Interactive CVSS v3.1 Threat Calculator"
            >
              <div className="p-2 bg-[#3b00ed]/30 rounded-lg text-[#d0bcff] border border-[#d0bcff]/30 group-hover:bg-[#3b00ed]/50 transition-colors">
                <i className="ri-calculator-line text-lg"></i>
              </div>
              <div>
                <div className="text-[10px] text-[#a8c7fa] font-bold uppercase flex items-center space-x-1">
                  <span>CVSS CALCULATOR</span>
                  <i className="ri-arrow-right-s-line"></i>
                </div>
                <div className="text-xs font-bold text-white">CALCULATE CVE RISK</div>
              </div>
            </button>
          </div>
        </div>

        {/* INTEL BRIEF SECTION MODE NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#1a1b21] p-2.5 rounded-2xl border border-[#44474f]/50 shadow-lg">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => {
                setActiveIntelTab('feed');
                soundEngine.play('click');
              }}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                activeIntelTab === 'feed'
                  ? 'bg-[#a8c7fa] text-[#042e60] shadow-md'
                  : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
              }`}
            >
              <i className="ri-article-line text-sm"></i>
              <span>FIELD ADVISORIES FEED</span>
            </button>

            <button
              onClick={() => {
                setActiveIntelTab('analytics');
                soundEngine.play('click');
              }}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                activeIntelTab === 'analytics'
                  ? 'bg-[#a8c7fa] text-[#042e60] shadow-md'
                  : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
              }`}
            >
              <i className="ri-bar-chart-2-line text-sm"></i>
              <span>INTEL SPECTRUM ANALYTICS</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundEngine.play('click');
              const reportLines = [
                `# SOC EXECUTIVE INTEL BRIEFING REPORT`,
                `**Generated:** ${new Date().toLocaleDateString()} | **Total Included Briefs:** ${filteredDispatches.length}`,
                `---`,
                ...filteredDispatches.map((d, i) => (
                  `### ${i + 1}. ${d.title}\n` +
                  `- **Category:** ${d.category.toUpperCase()} | **Threat Level:** ${d.threatLevel || 'INFO'} | **CVE:** ${d.cveReference || 'N/A'}\n` +
                  `- **Author:** ${d.author} | **Date:** ${d.date}\n` +
                  `- **Excerpt:** ${d.excerpt}\n` +
                  (d.keyTakeaways ? `- **Key Findings:**\n` + d.keyTakeaways.map((k) => `  * ${k}`).join('\n') : '') +
                  `\n`
                )),
              ].join('\n');

              navigator.clipboard.writeText(reportLines);
              showToast('EXECUTIVE INTEL REPORT COPIED TO CLIPBOARD');
            }}
            className="px-3.5 py-2 rounded-xl bg-[#0f0e13] hover:bg-[#21232b] border border-[#a8c7fa]/40 text-xs font-mono text-[#a8c7fa] hover:text-white transition-all cursor-pointer flex items-center space-x-2"
            title="Export filtered advisories to executive Markdown briefing report"
          >
            <i className="ri-download-cloud-line text-sm"></i>
            <span>EXPORT EXECUTIVE REPORT</span>
          </button>
        </div>

        {activeIntelTab === 'analytics' ? (
          <IntelBriefsAnalytics
            dispatches={DISPATCHES_DATA}
            onFilterCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveIntelTab('feed');
              showToast(`FILTERED BY ${cat.toUpperCase()}`);
            }}
          />
        ) : (
          <>
            {/* SEARCH, CATEGORY TABS & CONTROLS TOOLBAR */}
        <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/50 p-4 mb-8 space-y-4 shadow-lg">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9199] text-base"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search advisories by CVE, vector, code snippet, or keyword..."
                className="w-full bg-[#0f0e13] border border-[#44474f]/60 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-[#8e9199] focus:outline-none focus:border-[#a8c7fa] transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9199] hover:text-white transition-colors"
                >
                  <i className="ri-close-circle-fill text-base"></i>
                </button>
              )}
            </div>

            {/* Controls: Sort & View Toggle */}
            <div className="flex items-center gap-3 self-end lg:self-auto font-mono text-xs">
              
              {/* Sort Selector */}
              <div className="flex items-center space-x-2 bg-[#0f0e13] border border-[#44474f]/60 px-3 py-2 rounded-xl text-[#c4c6d0]">
                <i className="ri-sort-desc text-[#a8c7fa]"></i>
                <span className="text-[11px] text-[#8e9199] hidden sm:inline">SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer text-xs font-mono"
                >
                  <option value="latest" className="bg-[#1a1b21]">LATEST FIRST</option>
                  <option value="threat" className="bg-[#1a1b21]">HIGHEST THREAT</option>
                  <option value="popular" className="bg-[#1a1b21]">MOST READ</option>
                </select>
              </div>

              {/* Grid vs Table View Mode Switcher */}
              <div className="flex items-center space-x-1 bg-[#0f0e13] p-1 rounded-xl border border-[#44474f]/60">
                <button
                  onClick={() => {
                    setViewMode('grid');
                    soundEngine.play('click');
                  }}
                  title="Card Grid View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#a8c7fa] text-[#042e60]' : 'text-[#8e9199] hover:text-white'
                  }`}
                >
                  <i className="ri-grid-fill text-base"></i>
                </button>
                <button
                  onClick={() => {
                    setViewMode('table');
                    soundEngine.play('click');
                  }}
                  title="Compact Operational Table View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'table' ? 'bg-[#a8c7fa] text-[#042e60]' : 'text-[#8e9199] hover:text-white'
                  }`}
                >
                  <i className="ri-list-check-2 text-base"></i>
                </button>
              </div>

            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
            <button
              onClick={() => {
                setSelectedCategory('all');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-[#a8c7fa] text-[#042e60] border-[#a8c7fa] font-bold shadow-md'
                  : 'bg-[#0f0e13] text-[#c4c6d0] border-[#44474f]/50 hover:border-[#a8c7fa]/60'
              }`}
            >
              <i className="ri-apps-2-line"></i>
              <span>ALL INTEL ({DISPATCHES_DATA.length})</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('dfir');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === 'dfir'
                  ? 'bg-[#ffb4ab] text-[#690005] border-[#ffb4ab] font-bold shadow-md'
                  : 'bg-[#0f0e13] text-[#c4c6d0] border-[#44474f]/50 hover:border-[#ffb4ab]/60'
              }`}
            >
              <i className="ri-pulse-line"></i>
              <span>DFIR & KERNEL</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('arch');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === 'arch'
                  ? 'bg-[#c2e7ff] text-[#001d33] border-[#c2e7ff] font-bold shadow-md'
                  : 'bg-[#0f0e13] text-[#c4c6d0] border-[#44474f]/50 hover:border-[#c2e7ff]/60'
              }`}
            >
              <i className="ri-shield-keyhole-line"></i>
              <span>ZERO-TRUST ARCH</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('offsec');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === 'offsec'
                  ? 'bg-[#ffb951] text-[#2a1300] border-[#ffb951] font-bold shadow-md'
                  : 'bg-[#0f0e13] text-[#c4c6d0] border-[#44474f]/50 hover:border-[#ffb951]/60'
              }`}
            >
              <i className="ri-terminal-box-line"></i>
              <span>OFFSEC & FUZZING</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('ai_security');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === 'ai_security'
                  ? 'bg-[#d0bcff] text-[#21005d] border-[#d0bcff] font-bold shadow-md'
                  : 'bg-[#0f0e13] text-[#c4c6d0] border-[#44474f]/50 hover:border-[#d0bcff]/60'
              }`}
            >
              <i className="ri-cpu-line"></i>
              <span>AI SECURITY</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('cloud');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === 'cloud'
                  ? 'bg-[#a8e6cf] text-[#002111] border-[#a8e6cf] font-bold shadow-md'
                  : 'bg-[#0f0e13] text-[#c4c6d0] border-[#44474f]/50 hover:border-[#a8e6cf]/60'
              }`}
            >
              <i className="ri-cloud-line"></i>
              <span>CLOUD & KMS</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('bookmarked');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === 'bookmarked'
                  ? 'bg-[#ffb951] text-[#2a1300] border-[#ffb951] font-bold shadow-md'
                  : 'bg-[#0f0e13] text-[#c4c6d0] border-[#44474f]/50 hover:border-[#ffb951]/60'
              }`}
            >
              <i className="ri-bookmark-fill text-amber-400"></i>
              <span>BOOKMARKED ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* SEARCH RESULTS COUNT / EMPTY STATE */}
        {filteredDispatches.length === 0 ? (
          <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-12 text-center space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-[#21232b] border border-[#44474f] text-[#ffb4ab] flex items-center justify-center mx-auto text-2xl">
              <i className="ri-search-eye-line"></i>
            </div>
            <h3 className="text-xl font-bold text-white">No Threat Advisories Found</h3>
            <p className="text-xs text-[#8e9199] font-mono max-w-md mx-auto">
              No field dispatches matched your filter query or bookmark list. Try adjusting your search keywords or resetting categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                soundEngine.play('click');
              }}
              className="m3-btn-tonal text-xs cursor-pointer inline-flex items-center space-x-2"
            >
              <i className="ri-refresh-line"></i>
              <span>RESET ALL FILTERS</span>
            </button>
          </div>
        ) : (
          <>
            {/* GRID VIEW MODE */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDispatches.map((dispatch) => {
                  const isBookmarked = bookmarkedIds.includes(dispatch.id);
                  const isExpanded = expandedPreviewId === dispatch.id;
                  const catBadge = getCategoryBadge(dispatch.category);

                  return (
                    <div
                      key={dispatch.id}
                      className={`bg-[#1a1b21] rounded-2xl border ${
                        isBookmarked ? 'border-[#ffb951]/70 shadow-lg shadow-[#ffb951]/5' : 'border-[#44474f]/40 hover:border-[#a8c7fa]'
                      } p-6 space-y-4 transition-all flex flex-col justify-between group shadow-md relative overflow-hidden`}
                    >
                      {/* Top Header Card Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${catBadge.color}`}>
                              {catBadge.label}
                            </span>
                            {getThreatBadge(dispatch.threatLevel)}
                          </div>

                          {/* Bookmark Button */}
                          <button
                            onClick={(e) => toggleBookmark(dispatch.id, e)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isBookmarked
                                ? 'bg-[#5f3300]/40 border-[#ffb951] text-[#ffb951]'
                                : 'bg-[#0f0e13] border-[#44474f]/40 text-[#8e9199] hover:text-white'
                            }`}
                            title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
                          >
                            <i className={isBookmarked ? 'ri-bookmark-fill' : 'ri-bookmark-line'}></i>
                          </button>
                        </div>

                        {/* Title & Metadata */}
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#a8c7fa] transition-colors leading-snug cursor-pointer"
                            onClick={() => {
                              setActiveDispatch(dispatch);
                              soundEngine.play('click');
                            }}
                        >
                          {dispatch.title}
                        </h3>

                        <div className="flex items-center space-x-3 text-[11px] font-mono text-[#8e9199] pt-1">
                          <span>{dispatch.date}</span>
                          <span>•</span>
                          <span>{dispatch.readTime}</span>
                          {dispatch.cveReference && (
                            <>
                              <span>•</span>
                              <span className="text-[#a8c7fa] font-bold">{dispatch.cveReference}</span>
                            </>
                          )}
                        </div>

                        {/* Excerpt */}
                        <p className="text-xs text-[#c4c6d0] leading-relaxed font-sans">
                          {dispatch.excerpt}
                        </p>

                        {/* Key Takeaways Interactive Accordion */}
                        {dispatch.keyTakeaways && dispatch.keyTakeaways.length > 0 && (
                          <div className="pt-2">
                            <div className="p-3 rounded-xl bg-[#0f0e13] border border-[#44474f]/30 space-y-2">
                              <div className="text-[10px] font-mono text-[#a8c7fa] font-bold uppercase tracking-wider flex items-center space-x-1.5">
                                <i className="ri-flashlight-line"></i>
                                <span>KEY EXECUTIVE TAKEAWAYS</span>
                              </div>
                              <ul className="space-y-1.5 text-[11px] text-[#c4c6d0] font-sans">
                                {dispatch.keyTakeaways.map((takeaway, idx) => (
                                  <li key={idx} className="flex items-start space-x-2">
                                    <span className="text-[#a8c7fa] mt-0.5">•</span>
                                    <span>{takeaway}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Code Snippet Quick Preview Dropdown */}
                        {dispatch.codeSnippet && (
                          <div className="pt-1">
                            <button
                              onClick={() => {
                                setExpandedPreviewId(isExpanded ? null : dispatch.id);
                                soundEngine.play('click');
                              }}
                              className="text-[11px] font-mono text-[#a8c7fa] flex items-center space-x-1.5 cursor-pointer"
                            >
                              <i className={isExpanded ? 'ri-arrow-up-s-line' : 'ri-code-s-slash-line'}></i>
                              <span>{isExpanded ? 'HIDE CODE PAYLOAD' : 'INSPECT CODE PAYLOAD'}</span>
                            </button>

                            {isExpanded && (
                              <div className="mt-2.5 p-3 bg-[#0a0a0e] rounded-xl border border-[#44474f]/50 font-mono text-[11px] relative text-[#a8e6cf] overflow-x-auto shadow-inner">
                                <button
                                  onClick={(e) => handleCopyCode(dispatch.codeSnippet!, dispatch.id, e)}
                                  className="absolute top-2 right-2 px-2 py-1 bg-[#1a1b21] border border-[#44474f] rounded text-[10px] text-[#c4c6d0] hover:text-white flex items-center space-x-1 cursor-pointer"
                                >
                                  <i className={copiedCodeId === dispatch.id ? 'ri-check-line text-emerald-400' : 'ri-file-copy-line'}></i>
                                  <span>{copiedCodeId === dispatch.id ? 'COPIED' : 'COPY'}</span>
                                </button>
                                <pre className="whitespace-pre overflow-x-auto pt-4 leading-relaxed font-mono">
                                  {dispatch.codeSnippet}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Action Footer */}
                      <div className="space-y-3 pt-3 border-t border-[#44474f]/30 mt-4">
                        <div className="flex flex-wrap gap-1">
                          {dispatch.tags.map((tag, idx) => (
                            <span key={idx} className="m3-chip">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setActiveDispatch(dispatch);
                            soundEngine.play('click');
                          }}
                          className="m3-btn-tonal w-full justify-center text-xs cursor-pointer font-mono font-bold"
                        >
                          <span>READ FULL INTEL BRIEF</span>
                          <i className="ri-arrow-right-line text-sm"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TABLE OPERATIONAL VIEW MODE */}
            {viewMode === 'table' && (
              <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/50 overflow-hidden shadow-xl font-mono text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0f0e13] border-b border-[#44474f]/50 text-[#8e9199] text-[10px] uppercase tracking-wider">
                        <th className="py-3.5 px-4 font-bold">THREAT LEVEL</th>
                        <th className="py-3.5 px-4 font-bold">CATEGORY</th>
                        <th className="py-3.5 px-4 font-bold">ADVISORY TITLE</th>
                        <th className="py-3.5 px-4 font-bold">CVE REF</th>
                        <th className="py-3.5 px-4 font-bold">DATE</th>
                        <th className="py-3.5 px-4 font-bold text-center">READ TIME</th>
                        <th className="py-3.5 px-4 font-bold text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#44474f]/30 text-[#c4c6d0]">
                      {filteredDispatches.map((dispatch) => {
                        const isBookmarked = bookmarkedIds.includes(dispatch.id);
                        const catBadge = getCategoryBadge(dispatch.category);

                        return (
                          <tr
                            key={dispatch.id}
                            className="hover:bg-[#21232b] transition-colors group cursor-pointer"
                            onClick={() => {
                              setActiveDispatch(dispatch);
                              soundEngine.play('click');
                            }}
                          >
                            <td className="py-3 px-4">
                              {getThreatBadge(dispatch.threatLevel)}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${catBadge.color}`}>
                                {catBadge.label}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-sans font-bold text-white group-hover:text-[#a8c7fa] transition-colors max-w-md">
                              {dispatch.title}
                            </td>
                            <td className="py-3 px-4 text-[#a8c7fa] font-bold whitespace-nowrap">
                              {dispatch.cveReference || 'N/A'}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-[#8e9199] text-[11px]">
                              {dispatch.date}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap text-[#8e9199] text-[11px]">
                              {dispatch.readTime}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={(e) => toggleBookmark(dispatch.id, e)}
                                  className={`p-1.5 rounded border transition-all ${
                                    isBookmarked ? 'bg-[#5f3300]/40 border-[#ffb951] text-[#ffb951]' : 'border-[#44474f]/40 text-[#8e9199] hover:text-white'
                                  }`}
                                  title="Bookmark"
                                >
                                  <i className={isBookmarked ? 'ri-bookmark-fill' : 'ri-bookmark-line'}></i>
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveDispatch(dispatch);
                                    soundEngine.play('click');
                                  }}
                                  className="px-3 py-1 rounded bg-[#004a77] hover:bg-[#00639b] text-[#c2e7ff] text-[11px] font-bold border border-[#a8c7fa]/30 transition-all flex items-center space-x-1"
                                >
                                  <span>READ</span>
                                  <i className="ri-arrow-right-line"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </>
    )}
    </div>

      {/* DISPATCH FULL READER MODAL */}
      {activeDispatch && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div 
            onScroll={handleModalScroll}
            className={`rounded-2xl border w-full max-w-4xl max-h-[calc(100dvh-40px)] overflow-y-auto p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto transition-colors duration-200 ${
              readerTheme === 'matrix'
                ? 'bg-[#0a120b] border-[#a8e6cf]/50 text-[#a8e6cf]'
                : readerTheme === 'slate'
                ? 'bg-[#181a20] border-[#8e9199]/50 text-[#e2e2e6]'
                : 'bg-[#1a1b21] border-[#44474f] text-[#c4c6d0]'
            }`}
          >
            {/* Reading Progress Indicator Bar */}
            <div className="sticky top-0 z-30 -mt-5 -mx-5 sm:-mt-8 sm:-mx-8 p-0 bg-transparent">
              <div className="w-full bg-[#0a0a0e]/80 backdrop-blur-md h-1.5 border-b border-[#44474f]/30">
                <div 
                  className="h-full bg-gradient-to-r from-[#004a77] via-[#a8c7fa] to-[#a8e6cf] transition-all duration-150"
                  style={{ width: `${scrollProgress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Modal Navigation Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#44474f]/40 pb-4 gap-3">
              <div className="flex items-center space-x-2 text-xs font-mono flex-wrap gap-y-1">
                <span className="px-2.5 py-1 rounded bg-[#004a77]/40 text-[#c2e7ff] border border-[#a8c7fa]/30 font-bold text-[10px]">
                  DOC_TYPE: TECHNICAL ADVISORY
                </span>
                {activeDispatch.cveReference && (
                  <span className="px-2.5 py-1 rounded bg-[#3b00ed]/30 text-[#d0bcff] border border-[#d0bcff]/30 font-bold text-[10px]">
                    {activeDispatch.cveReference}
                  </span>
                )}
                {getThreatBadge(activeDispatch.threatLevel)}
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs ml-auto">
                {/* Theme Selector */}
                <div className="flex items-center space-x-1 bg-[#0f0e13] p-1 rounded-lg border border-[#44474f]/50">
                  <button
                    onClick={() => setReaderTheme('cyber')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${readerTheme === 'cyber' ? 'bg-[#004a77] text-[#c2e7ff]' : 'text-[#8e9199]'}`}
                    title="Cyber Dark Theme"
                  >
                    CYBER
                  </button>
                  <button
                    onClick={() => setReaderTheme('matrix')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${readerTheme === 'matrix' ? 'bg-[#00522b] text-[#a8e6cf]' : 'text-[#8e9199]'}`}
                    title="Matrix Terminal Theme"
                  >
                    MATRIX
                  </button>
                  <button
                    onClick={() => setReaderTheme('slate')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${readerTheme === 'slate' ? 'bg-[#36343b] text-[#e2e2e6]' : 'text-[#8e9199]'}`}
                    title="Slate Reader Theme"
                  >
                    SLATE
                  </button>
                </div>

                {/* Font Size Adjuster */}
                <div className="flex items-center space-x-1 bg-[#0f0e13] p-1 rounded-lg border border-[#44474f]/50">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${fontSize === 'sm' ? 'bg-[#a8c7fa] text-[#042e60]' : 'text-[#8e9199]'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('base')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${fontSize === 'base' ? 'bg-[#a8c7fa] text-[#042e60]' : 'text-[#8e9199]'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${fontSize === 'lg' ? 'bg-[#a8c7fa] text-[#042e60]' : 'text-[#8e9199]'}`}
                  >
                    A+
                  </button>
                </div>

                {/* Bookmark Button in Modal */}
                <button
                  onClick={(e) => toggleBookmark(activeDispatch.id, e)}
                  className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                    bookmarkedIds.includes(activeDispatch.id)
                      ? 'bg-[#5f3300]/40 border-[#ffb951] text-[#ffb951]'
                      : 'bg-[#21232b] border-[#44474f] text-[#c4c6d0] hover:text-white'
                  }`}
                  title="Bookmark Advisory"
                >
                  <i className={bookmarkedIds.includes(activeDispatch.id) ? 'ri-bookmark-fill' : 'ri-bookmark-line'}></i>
                </button>

                {/* Close Modal Button */}
                <button
                  onClick={() => {
                    setActiveDispatch(null);
                    soundEngine.play('click');
                  }}
                  className="w-7 h-7 rounded-full bg-[#21232b] border border-[#44474f] text-[#c4c6d0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
            </div>

            {/* Advisory Meta & Title */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug tracking-tight">
                {activeDispatch.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8e9199] border-b border-[#44474f]/30 pb-4">
                <div className="flex items-center space-x-1.5 text-[#a8c7fa]">
                  <i className="ri-user-3-line"></i>
                  <span>BY {activeDispatch.author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1.5">
                  <i className="ri-calendar-line"></i>
                  <span>{activeDispatch.date}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1.5">
                  <i className="ri-time-line"></i>
                  <span>{activeDispatch.readTime}</span>
                </div>
                {activeDispatch.viewsCount && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1.5 text-[#a8e6cf]">
                      <i className="ri-eye-line"></i>
                      <span>{activeDispatch.viewsCount} VERIFIED READS</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <div className="text-[#a8c7fa] font-bold">
                  READING PROGRESS: {scrollProgress}%
                </div>
              </div>
            </div>

            {/* Key Takeaways Highlight Box */}
            {activeDispatch.keyTakeaways && activeDispatch.keyTakeaways.length > 0 && (
              <div className="p-4 rounded-xl bg-[#0f0e13] border border-[#a8c7fa]/30 space-y-2 font-mono shadow-inner">
                <div className="text-xs text-[#a8c7fa] font-bold uppercase tracking-wider flex items-center space-x-2">
                  <i className="ri-flashlight-line text-amber-400 text-sm"></i>
                  <span>EXECUTIVE BRIEFING SUMMARY & KEY FINDINGS</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#c4c6d0] font-sans">
                  {activeDispatch.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <i className="ri-checkbox-circle-line text-[#a8e6cf] mt-0.5 text-sm flex-shrink-0"></i>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Abstract Section */}
            <div className="text-white bg-[#0f0e13] p-4 rounded-xl border border-[#44474f]/40 font-mono text-xs leading-relaxed">
              <span className="text-[#a8c7fa] font-bold block mb-1">// ADVISORY ABSTRACT</span>
              <p className="text-[#c4c6d0] font-sans text-sm">{activeDispatch.excerpt}</p>
            </div>

            {/* Core Code Snippet Highlight */}
            {activeDispatch.codeSnippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#a8c7fa]">
                  <span className="flex items-center space-x-1.5 font-bold">
                    <i className="ri-code-s-slash-line"></i>
                    <span>CORE REMEDIATION / ANALYSIS PAYLOAD</span>
                  </span>
                  <button
                    onClick={(e) => handleCopyCode(activeDispatch.codeSnippet!, activeDispatch.id, e)}
                    className="px-2.5 py-1 bg-[#21232b] hover:bg-[#2b2d38] border border-[#44474f] rounded text-[11px] text-[#c4c6d0] hover:text-white flex items-center space-x-1 cursor-pointer font-mono"
                  >
                    <i className={copiedCodeId === activeDispatch.id ? 'ri-check-line text-emerald-400' : 'ri-file-copy-line'}></i>
                    <span>{copiedCodeId === activeDispatch.id ? 'COPIED' : 'COPY CODE'}</span>
                  </button>
                </div>
                <div className="p-4 bg-[#0a0a0e] rounded-xl border border-[#44474f]/60 font-mono text-xs text-[#a8e6cf] overflow-x-auto shadow-inner">
                  <pre className="whitespace-pre overflow-x-auto leading-relaxed">{activeDispatch.codeSnippet}</pre>
                </div>
              </div>
            )}

            {/* Formatted Technical Document Body */}
            <div className="border-t border-[#44474f]/30 pt-6">
              <FormattedMarkdownDoc markdown={activeDispatch.fullMarkdown} fontSize={fontSize} />
            </div>

            {/* Modal Footer Controls & Pagination */}
            <div className="pt-4 border-t border-[#44474f]/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleModalNavigate('prev')}
                  className="px-3.5 py-2 rounded-xl bg-[#21232b] border border-[#44474f] text-[#c4c6d0] hover:text-white hover:bg-[#2b2d38] transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <i className="ri-arrow-left-line"></i>
                  <span>PREV BRIEF</span>
                </button>

                <button
                  onClick={() => handleModalNavigate('next')}
                  className="px-3.5 py-2 rounded-xl bg-[#21232b] border border-[#44474f] text-[#c4c6d0] hover:text-white hover:bg-[#2b2d38] transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <span>NEXT BRIEF</span>
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const textContent = `${activeDispatch.title}\nBy ${activeDispatch.author} • ${activeDispatch.date}\nCVE: ${activeDispatch.cveReference || 'N/A'}\n\nABSTRACT:\n${activeDispatch.excerpt}\n\nFULL ADVISORY:\n${activeDispatch.fullMarkdown}`;
                    navigator.clipboard.writeText(textContent);
                    soundEngine.play('click');
                    showToast('FULL BRIEFING TEXT COPIED TO CLIPBOARD');
                  }}
                  className="px-3 py-2 rounded-xl bg-[#0f0e13] border border-[#44474f]/60 text-[#c4c6d0] hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
                  title="Copy Full Advisory Text"
                >
                  <i className="ri-file-copy-line"></i>
                  <span>COPY BRIEF TEXT</span>
                </button>

                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-2 rounded-xl bg-[#0f0e13] border border-[#44474f]/60 text-[#c4c6d0] hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
                  title="Print or Export PDF"
                >
                  <i className="ri-printer-line"></i>
                  <span>PRINT / PDF</span>
                </button>

                <button
                  onClick={() => {
                    setActiveDispatch(null);
                    soundEngine.play('click');
                  }}
                  className="m3-btn-primary text-xs cursor-pointer font-bold px-4 py-2"
                >
                  CLOSE DISPATCH
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CVSS v3.1 Calculator Modal */}
      <CvssCalculatorModal
        isOpen={isCvssModalOpen}
        onClose={() => setIsCvssModalOpen(false)}
      />

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1b21] border border-[#a8c7fa]/50 text-white font-mono text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <i className="ri-checkbox-circle-fill text-[#a8e6cf] text-base"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};
