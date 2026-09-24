import React, { useState, useMemo } from 'react';
import { SKILLS_DATA, SKILL_PROFILES_DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { Skill } from '../types';

type CategoryFilter =
  | 'languages'
  | 'web'
  | 'backend'
  | 'datascience'
  | 'cloud'
  | 'os'
  | 'tools'
  | 'security'
  | 'profiles';

interface CategoryTab {
  id: CategoryFilter;
  label: string;
  icon: string;
  color: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { id: 'languages', label: 'LANGUAGES', icon: 'ri-code-box-line', color: '#a8c7fa' },
  { id: 'web', label: 'WEB DEV', icon: 'ri-terminal-window-line', color: '#d0bcff' },
  { id: 'backend', label: 'BACKEND & DB', icon: 'ri-database-line', color: '#fdd663' },
  { id: 'datascience', label: 'DATA SCIENCE & AI', icon: 'ri-brain-line', color: '#d0bcff' },
  { id: 'cloud', label: 'CLOUD & DEVOPS', icon: 'ri-soundcloud-line', color: '#a8e6cf' },
  { id: 'os', label: 'OPERATING SYSTEMS', icon: 'ri-safe-3-line', color: '#ffb4ab' },
  { id: 'tools', label: 'DEV TOOLS', icon: 'ri-pencil-ruler-line', color: '#a8c7fa' },
  { id: 'security', label: 'CYBERSECURITY & DFIR', icon: 'ri-secure-payment-line', color: '#ffb4ab' },
  { id: 'profiles', label: `Profiles (${SKILL_PROFILES_DATA.length})`, icon: 'ri-user-community-line', color: '#d0bcff' },
];

const getSkillAccentColor = (category: string): string => {
  if (['offsec', 'dfir', 'crypto', 'security', 'os'].includes(category)) return '#ffb4ab';
  if (category === 'web' || category === 'datascience') return '#d0bcff';
  if (category === 'backend') return '#fdd663';
  if (category === 'cloud') return '#a8e6cf';
  return '#a8c7fa';
};

export const ArsenalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryFilter | null>(null);
  const [copiedSkillId, setCopiedSkillId] = useState<string | null>(null);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
  const [expandedProfileIds, setExpandedProfileIds] = useState<Set<string>>(new Set());

  // Filter skills based on Category
  const filteredSkills = useMemo(() => {
    if (activeTab === 'profiles') return [];
    return SKILLS_DATA.filter((skill) => {
      if (activeTab) {
        if (activeTab === 'security') {
          return ['offsec', 'dfir', 'crypto'].includes(skill.category);
        }
        return skill.category === activeTab;
      }
      return true;
    });
  }, [activeTab]);

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

  const currentTabMeta = useMemo(() => {
    switch (activeTab) {
      case 'languages':
        return {
          icon: 'ri-code-box-line',
          typeName: 'Languages',
          typeBadge: 'PROGRAMMING LANGUAGES',
          colorClass: 'text-[#a8c7fa]',
        };
      case 'web':
        return {
          icon: 'ri-terminal-window-line',
          typeName: 'Web Dev',
          typeBadge: 'WEB DEV TECHNOLOGIES',
          colorClass: 'text-[#d0bcff]',
        };
      case 'backend':
        return {
          icon: 'ri-database-line',
          typeName: 'Backend & DB',
          typeBadge: 'BACKEND & DATABASE',
          colorClass: 'text-[#fdd663]',
        };
      case 'datascience':
        return {
          icon: 'ri-brain-line',
          typeName: 'Data & AI',
          typeBadge: 'DATA SCIENCE & AI',
          colorClass: 'text-[#d0bcff]',
        };
      case 'cloud':
        return {
          icon: 'ri-soundcloud-line',
          typeName: 'Cloud & DevOps',
          typeBadge: 'CLOUD & DEVOPS',
          colorClass: 'text-[#a8e6cf]',
        };
      case 'os':
        return {
          icon: 'ri-safe-3-line',
          typeName: 'Operating Systems',
          typeBadge: 'OPERATING SYSTEMS',
          colorClass: 'text-[#ffb4ab]',
        };
      case 'tools':
        return {
          icon: 'ri-pencil-ruler-line',
          typeName: 'Dev Tools',
          typeBadge: 'DEV TOOLS',
          colorClass: 'text-[#a8c7fa]',
        };
      case 'security':
        return {
          icon: 'ri-secure-payment-line',
          typeName: 'Cybersecurity & DFIR',
          typeBadge: 'CYBERSECURITY & DFIR',
          colorClass: 'text-[#ffb4ab]',
        };
      case 'profiles':
        return {
          icon: 'ri-user-community-line',
          typeName: 'Developer Profiles',
          typeBadge: 'DEVELOPER PROFILES',
          colorClass: 'text-[#d0bcff]',
        };
      default:
        return {
          icon: 'ri-cpu-line',
          typeName: 'Core Stack',
          typeBadge: 'SYS-ARCH & CORE TECHNOLOGIES',
          colorClass: 'text-[#a8c7fa]',
        };
    }
  }, [activeTab]);

  const totalItems = activeTab === 'profiles' ? SKILL_PROFILES_DATA.length : filteredSkills.length;

  const toggleExpandProfile = (name: string) => {
    soundEngine.play('click');
    setExpandedProfileIds((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <section id="skills" className="pt-[15px] px-[8px] pb-6 border-b-0 bg-transparent relative scroll-mt-28 font-sans" style={{ paddingLeft: "8px", paddingRight: "8px" }}>
      <div className="max-w-7xl mx-auto px-0">
        
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 mb-[15px]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
              <span className="text-[12px] leading-[16px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold" style={{ fontSize: "12px" }}>
                SYS-ARCH & CORE
              </span>
            </div>
            <h2 className="text-2xl leading-[24px] font-extrabold tracking-tight text-white flex items-center gap-3" style={{ fontSize: "24px", lineHeight: "24px" }}>
              Skill Stack
            </h2>
          </div>
        </div>

        {/* Category Buttons Capsule matching Live INCIDENT controls */}
        <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] mb-[15px] max-w-2xl w-full">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            let activeColorClass = 'bg-[#a8c7fa] text-[#042e60] font-semibold';
            let iconActiveClass = 'text-[#042e60]';
            if (tab.id === 'profiles') {
              activeColorClass = 'bg-[#d0bcff] text-[#381e72] font-semibold';
              iconActiveClass = 'text-[#381e72]';
            }

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab((prev) => (prev === tab.id ? null : tab.id));
                  soundEngine.play('click');
                }}
                className={`w-[35px] flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center border-0 text-[13px] leading-[16px] ${
                  isActive
                    ? activeColorClass
                    : 'text-[#c4c6d0] hover:text-white'
                }`}
                title={tab.label}
                aria-label={tab.label}
              >
                <i className={`${tab.icon} text-base ${isActive ? iconActiveClass : 'text-[#c4c6d0]'}`}></i>
              </button>
            );
          })}
        </div>

        {/* FEED METRICS BAR & SHOWING COUNT */}
        <div
          className="bg-[#21232b] rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 text-[12px] leading-[12px] text-[#8e9199] font-mono border-0 mb-[15px]"
          style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "12px", lineHeight: "12px" }}>
              SHOWING{' '}
              <strong className={currentTabMeta.colorClass}>
                {totalItems > 0 ? 1 : 0}-{totalItems}
              </strong>{' '}
              OF <strong className="text-white">{totalItems}</strong>{' '}
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

        {/* --- PROFILES GRID (WHEN PROFILES TAB SELECTED) --- */}
        {activeTab === 'profiles' ? (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 gap-3.5">
              {SKILL_PROFILES_DATA.map((profile) => {
                const isExpanded = expandedProfileIds.has(profile.name);
                return (
                  <div
                    key={profile.name}
                    className="h-auto bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col shadow-md"
                  >
                    {/* Non-Expandable Card Header */}
                    <div
                      onClick={() => toggleExpandProfile(profile.name)}
                      className="h-auto flex flex-col cursor-pointer select-none group"
                    >
                      {/* Top Bar: Icon, Title, Handle, and Right Actions */}
                      <div className="flex items-center justify-between gap-2 shrink-0 min-h-[33px]">
                        <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#d0bcff] min-w-0 flex-1">
                          <div
                            className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#d0bcff] text-[#381e72] flex items-center justify-center font-bold shadow-sm"
                            style={{ width: "33px", height: "33px" }}
                            title={profile.name}
                          >
                            <i className={profile.icon || 'ri-external-link-line'}></i>
                          </div>
                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <span className="font-mono font-bold text-white text-[14px] leading-tight break-words text-left line-clamp-2">
                              {profile.name}
                            </span>
                            <span className="text-[11px] text-[#d0bcff] font-mono font-medium tracking-wider leading-tight mt-0.5 break-words text-left">
                              {profile.username}
                            </span>
                          </div>
                        </div>

                        {/* Right side Status Badge & Expand Icon */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-[10px] text-[#d0bcff] font-sans font-medium hidden break-words">
                            {profile.status}
                          </span>
                          {/* Expand / Collapse Icon */}
                          <i
                            className={`text-base text-[#d0bcff] transition-all shrink-0 ${
                              isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
                            }`}
                            title={isExpanded ? 'Collapse details' : 'Expand details'}
                          ></i>
                        </div>
                      </div>
                    </div>

                    {/* Inner Content Capsule Box (COLLAPSED BY DEFAULT, EXPANDED ON CLICK) */}
                    {isExpanded && (
                      <div className="mt-[15px] min-h-[38px] h-auto bg-[#13141a] border border-[#44474f]/30 rounded-xl p-3.5 text-[12px] leading-[16.5px] text-[#a8aab3] font-sans space-y-2 animate-fadeIn">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div>
                              <span className="font-semibold text-[#8e9199]">Profile:</span>{' '}
                              <span className="font-medium text-white">{profile.platform}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-[#8e9199]">Handle:</span>{' '}
                              <span className="text-[#d0bcff] font-mono font-medium">{profile.username}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-[#8e9199]">Status:</span>{' '}
                              <span className="text-[#a8c7fa] font-medium">{profile.status}</span>
                            </div>
                          </div>

                          {/* Link Button at Top Right of Details Box */}
                          <a
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundEngine.play('click');
                            }}
                            title={`Visit ${profile.name}`}
                            className="w-[33px] h-[33px] rounded-lg bg-[#d0bcff] hover:bg-[#e8def8] text-[#381e72] flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer"
                            style={{ width: "33px", height: "33px" }}
                          >
                            <i className="ri-link-unlink-m text-[27px]" style={{ fontSize: "27px" }}></i>
                          </a>
                        </div>

                        {profile.description && (
                          <div className="pt-2 text-[#a8aab3] text-justify text-[12px] leading-[16.5px]">
                            {profile.description}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* --- MATRIX GRID WITH INLINE EXPANDABLE DROPDOWNS --- */
          <div>
          {filteredSkills.length === 0 ? (
            <div className="py-12 text-center text-[#8e9199] font-mono text-[13px] leading-[16px]">
              <i className="ri-folder-info-line text-3xl block mb-2 text-[#44474f]"></i>
              No technologies found for the selected category.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSkills.map((skill) => {
                const isCopied = copiedSkillId === skill.id;
                const isExpanded = expandedSkillId === skill.id;
                const accentColor = getSkillAccentColor(skill.category);

                return (
                  <div
                    key={skill.id}
                    className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
                  >
                    <div className="space-y-2.5">
                      {/* Top Row: Icon + Title + Level + Dropdown Chevron */}
                      <div
                        onClick={() => handleToggleExpandSkill(skill)}
                        className="flex items-start justify-between gap-2 cursor-pointer select-none"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold transition-colors shrink-0"
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
                          <div className="min-w-0">
                            <h3
                              className="text-base font-bold leading-tight truncate"
                              style={{ color: accentColor }}
                            >
                              {skill.title}
                            </h3>
                            <div className="text-[12px] leading-[12px] font-mono text-[#8e9199] truncate" style={{ fontSize: "12px", lineHeight: "12px" }}>
                              {skill.expYears} • {skill.ecosystem || skill.category.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {/* Expand/Collapse Action Icon */}
                        <div className="flex items-center text-right shrink-0">
                          <i
                            className={`text-sm text-[#a8c7fa] transition-colors ${
                              isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
                            }`}
                          ></i>
                        </div>
                      </div>

                      {/* Proficiency Gauge Bar */}
                      <div className="w-full bg-[#13141a] h-[3px] rounded-full overflow-hidden flex items-center">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${skill.level}%`, backgroundColor: accentColor }}
                        ></div>
                      </div>

                      {/* Description */}
                      <p
                        className="text-[12px] text-[#c4c6d0] leading-[15px]"
                        style={{ fontSize: "12px", lineHeight: "15px" }}
                      >
                        {skill.description}
                      </p>

                      {/* Tags */}
                      {skill.tags && skill.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {skill.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[12px] leading-[12px] font-mono px-2 py-0.5 rounded-md bg-[#13141a] text-white" style={{ fontSize: "12px", lineHeight: "12px" }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* --- INLINE DROPDOWN DETAILS ACCORDION --- */}
                      {isExpanded && (
                        <div className="mt-3 space-y-2.5 animate-fadeIn font-mono text-[12px] leading-[12px]" style={{ fontSize: "12px" }}>
                          <div className="flex items-center justify-between text-[12px] leading-[12px] text-[#8e9199]">
                            <span className="text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>DOMAIN :</span>
                            <span className="font-bold text-[12px] leading-[12px]" style={{ color: accentColor, fontSize: "12px", lineHeight: "12px" }}>{skill.ecosystem || 'Linux Core Architecture'}</span>
                          </div>
                          <div className="flex items-center justify-between text-[12px] leading-[12px] text-[#8e9199]" style={{ fontSize: "12px" }}>
                            <span className="text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>YEARS IN PRODUCTION:</span>
                            <span className="text-[#a8e6cf] font-bold text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>{skill.expYears}</span>
                          </div>
                          <div className="flex items-center justify-between text-[12px] leading-[12px] text-[#8e9199]">
                            <span className="text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>PROFICIENCY RATING:</span>
                            <span className="text-white font-bold text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>{skill.level}%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Signature Command Strip */}
                    <div className="mt-3 flex items-center justify-between gap-2 h-[38px]">
                      <div className="flex items-center space-x-1.5 overflow-hidden text-[13px] leading-[16px] font-mono text-[#8e9199] bg-[#13141a] px-2.5 h-[38px] rounded-lg flex-1 min-w-0">
                        <span className="select-none font-bold shrink-0 text-[13px] leading-[16px]" style={{ color: accentColor }}>$</span>
                        <span className="truncate text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>{skill.command}</span>
                      </div>
                      <button
                        onClick={(e) => handleCopyCommand(e, skill)}
                        className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer shrink-0 border-0 shadow-sm ${
                          isCopied
                            ? 'bg-[#a8e6cf] text-[#003824]'
                            : 'bg-[#a8c7fa] text-[#00325b] hover:opacity-90 active:scale-95'
                        }`}
                        title={isCopied ? "Copied to clipboard!" : `Copy "${skill.command}"`}
                        aria-label={isCopied ? "Copied" : "Copy command"}
                      >
                        <i className={isCopied ? 'ri-survey-line' : 'ri-file-copy-2-line'}></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      </div>
    </section>
  );
};
