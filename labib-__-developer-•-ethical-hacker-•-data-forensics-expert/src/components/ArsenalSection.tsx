import React, { useState, useMemo } from 'react';
import { SKILLS_DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { Skill } from '../types';

type CategoryFilter =
  | 'all'
  | 'languages'
  | 'web'
  | 'backend'
  | 'datascience'
  | 'cloud'
  | 'os'
  | 'tools'
  | 'security';

interface CategoryTab {
  id: CategoryFilter;
  label: string;
  icon: string;
  color: string;
  badge: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { id: 'all', label: 'ALL ARSENAL', icon: 'ri-apps-2-line', color: '#a8c7fa', badge: '37' },
  { id: 'languages', label: 'LANGUAGES', icon: 'ri-code-s-slash-line', color: '#a8c7fa', badge: '5' },
  { id: 'web', label: 'WEB DEV', icon: 'ri-window-line', color: '#d0bcff', badge: '4' },
  { id: 'backend', label: 'BACKEND & DB', icon: 'ri-server-line', color: '#fdd663', badge: '4' },
  { id: 'datascience', label: 'DATA SCIENCE & AI', icon: 'ri-brain-line', color: '#d0bcff', badge: '4' },
  { id: 'cloud', label: 'CLOUD & DEVOPS', icon: 'ri-cloud-line', color: '#a8e6cf', badge: '4' },
  { id: 'os', label: 'OPERATING SYSTEMS', icon: 'ri-ubuntu-line', color: '#ffb4ab', badge: '4' },
  { id: 'tools', label: 'DEV TOOLS', icon: 'ri-tools-line', color: '#a8c7fa', badge: '4' },
  { id: 'security', label: 'CYBERSECURITY & DFIR', icon: 'ri-shield-keyhole-line', color: '#ffb4ab', badge: '8' },
];

const getSkillAccentColor = (category: string): string => {
  if (['offsec', 'dfir', 'crypto', 'security', 'os'].includes(category)) return '#ffb4ab';
  if (category === 'web' || category === 'datascience') return '#d0bcff';
  if (category === 'backend') return '#fdd663';
  if (category === 'cloud') return '#a8e6cf';
  return '#a8c7fa';
};

export const ArsenalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grid');
  const [copiedSkillId, setCopiedSkillId] = useState<string | null>(null);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  // Filter skills based on Category and Search Query
  const filteredSkills = useMemo(() => {
    return SKILLS_DATA.filter((skill) => {
      // Category Match
      let matchesCategory = false;
      if (activeTab === 'all') {
        matchesCategory = true;
      } else if (activeTab === 'security') {
        matchesCategory = ['offsec', 'dfir', 'crypto'].includes(skill.category);
      } else {
        matchesCategory = skill.category === activeTab;
      }

      if (!matchesCategory) return false;

      // Search Query Match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = skill.title.toLowerCase().includes(query);
        const inDesc = skill.description.toLowerCase().includes(query);
        const inCommand = skill.command.toLowerCase().includes(query);
        const inTags = skill.tags?.some((t) => t.toLowerCase().includes(query));
        const inEcosystem = skill.ecosystem?.toLowerCase().includes(query);
        return inTitle || inDesc || inCommand || inTags || inEcosystem;
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  // Grouped skills for the 'grouped' view
  const groupedSkills = useMemo(() => {
    const map = new Map<string, { tab: CategoryTab; skills: Skill[] }>();
    CATEGORY_TABS.filter((t) => t.id !== 'all').forEach((tab) => {
      const skillsInGroup = SKILLS_DATA.filter((s) => {
        if (tab.id === 'security') {
          return ['offsec', 'dfir', 'crypto'].includes(s.category);
        }
        return s.category === tab.id;
      });
      if (skillsInGroup.length > 0) {
        map.set(tab.id, { tab, skills: skillsInGroup });
      }
    });
    return map;
  }, []);

  const handleCopyCommand = (e: React.MouseEvent, skill: Skill) => {
    e.stopPropagation();
    navigator.clipboard.writeText(skill.command);
    setCopiedSkillId(skill.id);
    soundEngine.play('terminal_key');
    setTimeout(() => setCopiedSkillId(null), 2000);
  };

  const handleToggleExpandSkill = (skill: Skill) => {
    soundEngine.play('click');
    setExpandedSkillId((prev) => (prev === skill.id ? null : skill.id));
  };

  return (
    <section id="skills" className="pt-[15px] px-[15px] pb-0 border-b-0 bg-[#0f0e13] relative scroll-mt-28 font-sans">
      <div className="max-w-7xl mx-auto px-0">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
              <span className="text-[11px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold">
                Technical Competencies & Systems Architecture
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Skill Arsenal & Stack
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#21232b] text-[#a8c7fa] border border-[#a8c7fa]/30 font-normal">
                {SKILLS_DATA.length} Core Modules
              </span>
            </h2>
            <p className="text-xs text-[#8e9199] max-w-2xl font-mono">
              Production engineering, systems programming, AI inference, full-stack ecosystems, and kernel-level offensive security.
            </p>
          </div>
        </div>

        {/* Dynamic Controls Bar: Integrated Search Bar with Slider Buttons */}
        <div className="mb-5 pb-3 border-b border-[#21232b]">
          <div className="flex items-center h-[42px] bg-[#21232b] rounded-xl px-2 gap-2 max-w-2xl w-full">
            {/* Search Input */}
            <div className="relative flex-1 flex items-center h-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=""
                className="w-full h-full bg-transparent border-0 pl-1.5 pr-8 py-2 text-xs text-white font-mono focus:outline-none placeholder-transparent"
              />
              <div className="absolute right-2 flex items-center space-x-1.5 pointer-events-none">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="pointer-events-auto text-[#8e9199] hover:text-white transition-colors"
                    title="Clear search"
                  >
                    <i className="ri-close-circle-line text-xs"></i>
                  </button>
                ) : null}
                <i className="ri-menu-search-line text-sm text-[#8e9199]"></i>
              </div>
            </div>

            {/* Divider */}
            <div className="h-5 w-[1px] bg-[#323540] shrink-0"></div>

            {/* Integrated View Mode Toggle Buttons */}
            <div className="flex items-center shrink-0 gap-1">
              <button
                onClick={() => {
                  setViewMode('grid');
                  soundEngine.play('click');
                }}
                className={`h-[30px] px-2.5 flex items-center justify-center rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-[#a8c7fa] text-[#00325b] shadow-sm font-bold' : 'text-[#8e9199] hover:text-white'
                }`}
                title="Grid Matrix View"
              >
                <i className="ri-grid-fill"></i>
              </button>
              <button
                onClick={() => {
                  setViewMode('grouped');
                  soundEngine.play('click');
                }}
                className={`h-[30px] px-2.5 flex items-center justify-center rounded-lg transition-all ${
                  viewMode === 'grouped' ? 'bg-[#a8c7fa] text-[#00325b] shadow-sm font-bold' : 'text-[#8e9199] hover:text-white'
                }`}
                title="Categorized Sections View"
              >
                <i className="ri-list-check-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs - Material 3 Segmented Pill Row */}
        {viewMode !== 'grouped' && (
          <div className="flex items-center gap-2 mb-6 text-xs font-medium overflow-x-auto pb-2 scrollbar-none flex-nowrap w-full">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    soundEngine.play('click');
                  }}
                  className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-2 cursor-pointer shrink-0 text-xs ${
                    isActive
                      ? 'bg-[#a8c7fa] text-[#00325b] font-bold border border-[#a8c7fa] shadow-sm'
                      : 'bg-[#21232b] text-[#c4c6d0] border border-[#44474f]/30 hover:bg-[#2b2d36] hover:text-white'
                  }`}
                >
                  <i className={`${tab.icon} text-sm ${isActive ? 'text-[#00325b]' : 'text-[#8e9199]'}`}></i>
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-[#00325b] text-[#a8c7fa] font-bold' : 'bg-[#141218] text-[#8e9199]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* --- VIEW MODE 1: MATRIX GRID WITH INLINE EXPANDABLE DROPDOWNS --- */}
        {viewMode === 'grid' && (
          <div>
            {filteredSkills.length === 0 ? (
              <div className="py-12 text-center text-[#8e9199] font-mono text-xs">
                <i className="ri-search-eye-line text-3xl block mb-2 text-[#44474f]"></i>
                No technologies found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-7 gap-x-6">
                {filteredSkills.map((skill) => {
                  const isCopied = copiedSkillId === skill.id;
                  const isExpanded = expandedSkillId === skill.id;
                  const accentColor = getSkillAccentColor(skill.category);

                  return (
                    <div
                      key={skill.id}
                      className="flex flex-col justify-between border-b border-[#21232b] pb-5"
                    >
                      <div className="space-y-2.5">
                        {/* Top Row: Icon + Title + Level + Dropdown Chevron */}
                        <div
                          onClick={() => handleToggleExpandSkill(skill)}
                          className="flex items-start justify-between gap-2 cursor-pointer select-none"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold transition-colors"
                              style={{
                                backgroundColor:
                                  skill.category === 'languages' || skill.category === 'tools'
                                    ? '#a8c7fa'
                                    : skill.category === 'web' || skill.category === 'datascience'
                                    ? '#d0bcff'
                                    : skill.category === 'backend'
                                    ? '#fdd663'
                                    : skill.category === 'cloud'
                                    ? '#a8e6cf'
                                    : ['os', 'security', 'offsec', 'dfir', 'crypto'].includes(skill.category)
                                    ? '#ffb4ab'
                                    : '#21232b',
                                color:
                                  skill.category === 'languages' || skill.category === 'tools'
                                    ? '#00325b'
                                    : skill.category === 'web' || skill.category === 'datascience'
                                    ? '#381e72'
                                    : skill.category === 'backend'
                                    ? '#3b2f00'
                                    : skill.category === 'cloud'
                                    ? '#003824'
                                    : ['os', 'security', 'offsec', 'dfir', 'crypto'].includes(skill.category)
                                    ? '#561e18'
                                    : accentColor,
                              }}
                            >
                              <i className={skill.icon}></i>
                            </div>
                            <div>
                              <h3
                                className="text-sm font-bold leading-tight"
                                style={{ color: accentColor }}
                              >
                                {skill.title}
                              </h3>
                              <div className="text-[10px] font-mono text-[#8e9199]">
                                {skill.expYears} • {skill.ecosystem || skill.category.toUpperCase()}
                              </div>
                            </div>
                          </div>

                          {/* Expand/Collapse Action Icon */}
                          <div className="flex items-center text-right">
                            <i
                              className={`text-sm text-[#fdd663] transition-colors ${
                                isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
                              }`}
                            ></i>
                          </div>
                        </div>

                        {/* Proficiency Gauge Bar */}
                        <div className="w-full bg-[#21232b] h-[3px] rounded-full overflow-hidden flex items-center">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${skill.level}%`, backgroundColor: accentColor }}
                          ></div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-[#c4c6d0] leading-relaxed">
                          {skill.description}
                        </p>

                        {/* Tags */}
                        {skill.tags && skill.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {skill.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#21232b] text-white"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* --- INLINE DROPDOWN DETAILS ACCORDION --- */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-[#21232b] space-y-2.5 animate-fadeIn font-mono text-xs">
                            <div className="flex items-center justify-between text-[11px] text-[#8e9199]">
                              <span>DOMAIN / ECOSYSTEM:</span>
                              <span className="font-bold" style={{ color: accentColor }}>{skill.ecosystem || 'Linux Core Architecture'}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-[#8e9199]">
                              <span>YEARS IN PRODUCTION:</span>
                              <span className="text-[#a8e6cf] font-bold">{skill.expYears}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-[#8e9199]">
                              <span>PROFICIENCY RATING:</span>
                              <span className="text-white font-bold">{skill.level}%</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Signature Command Strip */}
                      <div className="mt-3 pt-2.5 flex items-center justify-between gap-2 border-t border-[#21232b]">
                        <div className="flex items-center space-x-1.5 overflow-hidden text-[11px] font-mono text-[#8e9199]">
                          <span className="select-none font-bold" style={{ color: accentColor }}>$</span>
                          <span className="truncate">{skill.command}</span>
                        </div>
                        <button
                          onClick={(e) => handleCopyCommand(e, skill)}
                          className="shrink-0 text-[10px] font-mono px-2 py-1 rounded bg-[#21232b] text-[#c4c6d0] hover:bg-[#a8c7fa] hover:text-[#00325b] transition-all flex items-center space-x-1"
                          title="Copy command"
                        >
                          <i className={isCopied ? 'ri-check-line text-[#a8e6cf]' : 'ri-file-copy-line'}></i>
                          <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- VIEW MODE 2: GROUPED SECTIONS VIEW WITH INLINE DROPDOWNS --- */}
        {viewMode === 'grouped' && (
          <div className="space-y-10">
            {Array.from(groupedSkills.values()).map(({ tab, skills }) => (
              <div key={tab.id} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-[#21232b] pb-2">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: `${tab.color}20`, color: tab.color }}
                    >
                      <i className={tab.icon}></i>
                    </div>
                    <div>
                      <h3 className="text-base font-bold tracking-wide" style={{ color: tab.color }}>{tab.label}</h3>
                      <p className="text-[10px] font-mono text-[#8e9199]">
                        {skills.length} core technologies in this domain
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-mono px-2.5 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: `${tab.color}20`, color: tab.color }}
                  >
                    {skills.length} MODULES
                  </span>
                </div>

                {/* Grid within Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {skills.map((skill) => {
                    const isExpanded = expandedSkillId === skill.id;
                    const isCopied = copiedSkillId === skill.id;
                    const accentColor = getSkillAccentColor(skill.category);

                    return (
                      <div
                        key={skill.id}
                        className="border-b border-[#21232b] pb-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div
                            onClick={() => handleToggleExpandSkill(skill)}
                            className="flex items-center justify-between cursor-pointer select-none"
                          >
                            <div className="flex items-center space-x-1.5">
                              {skill.category === 'languages' && (
                                <span className="w-7 h-7 rounded-md flex items-center justify-center bg-[#a8c7fa] text-[#00325b] font-bold shrink-0">
                                  <i className={skill.icon}></i>
                                </span>
                              )}
                              {skill.category === 'web' && (
                                <span className="w-7 h-7 rounded-md flex items-center justify-center bg-[#d0bcff] text-[#381e72] font-bold shrink-0">
                                  <i className={skill.icon}></i>
                                </span>
                              )}
                              {skill.category === 'backend' && (
                                <span className="w-7 h-7 rounded-md flex items-center justify-center bg-[#fdd663] text-[#3b2f00] font-bold shrink-0">
                                  <i className={skill.icon}></i>
                                </span>
                              )}
                              {skill.category === 'datascience' && (
                                <span className="w-7 h-7 rounded-md flex items-center justify-center bg-[#d0bcff] text-[#381e72] font-bold shrink-0">
                                  <i className={skill.icon}></i>
                                </span>
                              )}
                              {skill.category === 'cloud' && (
                                <span className="w-7 h-7 rounded-md flex items-center justify-center bg-[#a8e6cf] text-[#003824] font-bold shrink-0">
                                  <i className={skill.icon}></i>
                                </span>
                              )}
                              {skill.category === 'os' && (
                                <span className="w-7 h-7 rounded-md flex items-center justify-center bg-[#ffb4ab] text-[#561e18] font-bold shrink-0">
                                  <i className={skill.icon}></i>
                                </span>
                              )}
                              {skill.category === 'tools' && (
                                <span className="w-7 h-7 rounded-md flex items-center justify-center bg-[#a8c7fa] text-[#00325b] font-bold shrink-0">
                                  <i className={skill.icon}></i>
                                </span>
                              )}
                              {['security', 'offsec', 'dfir', 'crypto'].includes(skill.category) && (
                                <span className="w-7 h-7 rounded-md flex items-center justify-center bg-[#ffb4ab] text-[#561e18] font-bold shrink-0">
                                  <i className={skill.icon}></i>
                                </span>
                              )}
                              <span className="text-sm font-bold" style={{ color: accentColor }}>
                                {skill.title}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i
                                className={`text-xs text-[#fdd663] transition-colors ${
                                  isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
                                }`}
                              ></i>
                            </div>
                          </div>
                          <p className="text-[11px] text-[#c4c6d0] line-clamp-2 leading-relaxed">
                            {skill.description}
                          </p>
                          {skill.tags && (
                            <div className="flex flex-wrap gap-1">
                              {skill.tags.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#21232b] text-white"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Inline Dropdown for Grouped View */}
                          {isExpanded && (
                            <div className="pt-2 border-t border-[#21232b] space-y-1 font-mono text-[10px] text-[#8e9199] animate-fadeIn">
                              <div><strong className="text-white">EXP:</strong> {skill.expYears}</div>
                              <div><strong className="text-white">PROFICIENCY RATING:</strong> {skill.level}%</div>
                              <div><strong className="text-white">STACK:</strong> {skill.ecosystem}</div>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#21232b] flex items-center justify-between">
                          <div className="text-[10px] font-mono text-[#8e9199] truncate flex items-center space-x-1">
                            <span style={{ color: accentColor }}>$</span>
                            <span className="truncate">{skill.command}</span>
                          </div>
                          <button
                            onClick={(e) => handleCopyCommand(e, skill)}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#21232b] text-[#c4c6d0] hover:bg-[#a8c7fa] hover:text-[#00325b] shrink-0 ml-1"
                          >
                            {isCopied ? 'COPIED' : 'COPY'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
