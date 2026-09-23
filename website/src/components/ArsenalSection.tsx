import React, { useState, useMemo } from 'react';
import { SKILLS_DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { Skill } from '../types';
import { GithubContributionGraph } from './GithubContributionGraph';

type CategoryFilter =
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

  // Filter skills based on Category
  const filteredSkills = useMemo(() => {
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

  return (
    <section id="skills" className="pt-[15px] px-[8px] pb-6 border-b-0 bg-transparent relative scroll-mt-28 font-sans" style={{ paddingLeft: "8px", paddingRight: "8px" }}>
      <div className="max-w-7xl mx-auto px-0">
        
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
              <span className="text-[12px] leading-[16px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold" style={{ fontSize: "12px" }}>
                SYS-ARCH & CORE
              </span>
            </div>
            <h2 className="text-2xl leading-[24px] font-extrabold tracking-tight text-white flex items-center gap-3" style={{ fontSize: "24px", lineHeight: "24px" }}>
              SKILL STACK
            </h2>
          </div>
        </div>

        {/* Category Buttons Capsule matching Live INCIDENT controls */}
        <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] mb-[15px] max-w-2xl w-full">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab((prev) => (prev === tab.id ? null : tab.id));
                  soundEngine.play('click');
                }}
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

        {/* --- MATRIX GRID WITH INLINE EXPANDABLE DROPDOWNS --- */}
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

        {/* GitHub Contribution Graph under Skill Stack */}
        <GithubContributionGraph username="la-b-ib" />

      </div>
    </section>
  );
};
