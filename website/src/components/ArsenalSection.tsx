import React, { useState, useMemo } from 'react';
import { SKILLS_DATA, SKILL_PROFILES_DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';

type CategoryFilter =
  | 'languages'
  | 'web'
  | 'cloud'
  | 'security'
  | 'profiles';

interface CategoryTab {
  id: CategoryFilter;
  label: string;
  icon: string;
  color: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { id: 'languages', label: 'LANGUAGES & DATA SCIENCE', icon: 'ri-code-box-line', color: '#d0bcff' },
  { id: 'web', label: 'WEB DEV & DATABASE', icon: 'ri-database-line', color: '#fdd663' },
  { id: 'cloud', label: 'CLOUD, OS & DEV TOOLS', icon: 'ri-pencil-ruler-line', color: '#a8c7fa' },
  { id: 'security', label: 'CYBERSECURITY & DFIR', icon: 'ri-secure-payment-line', color: '#ffb4ab' },
  { id: 'profiles', label: `Profiles (${SKILL_PROFILES_DATA.length})`, icon: 'ri-user-community-line', color: '#a8c7fa' },
];

const getSkillAccentColor = (category: string): string => {
  if (['offsec', 'dfir', 'crypto', 'security'].includes(category)) return '#ffb4ab';
  if (category === 'web' || category === 'backend') return '#fdd663';
  if (category === 'languages' || category === 'datascience') return '#d0bcff';
  if (['cloud', 'os', 'tools'].includes(category)) return '#a8c7fa';
  return '#a8c7fa';
};

export const ArsenalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryFilter>('languages');

  // Filter skills based on Category
  const filteredSkills = useMemo(() => {
    if (activeTab === 'profiles') return [];
    if (activeTab === 'languages') {
      return SKILLS_DATA.filter((skill) => ['languages', 'datascience'].includes(skill.category));
    }
    if (activeTab === 'web') {
      return SKILLS_DATA.filter((skill) => ['web', 'backend'].includes(skill.category));
    }
    if (activeTab === 'cloud') {
      return SKILLS_DATA.filter((skill) => ['cloud', 'os', 'tools'].includes(skill.category));
    }
    if (activeTab === 'security') {
      return SKILLS_DATA.filter((skill) => ['offsec', 'dfir', 'crypto'].includes(skill.category));
    }
    return SKILLS_DATA.filter((skill) => skill.category === activeTab);
  }, [activeTab]);

  const currentTabMeta = useMemo(() => {
    switch (activeTab) {
      case 'languages':
        return {
          icon: 'ri-code-box-line',
          typeName: 'Languages & Data Science',
          typeBadge: 'LANGUAGES & DATA SCIENCE',
          colorClass: 'text-[#d0bcff]',
        };
      case 'web':
        return {
          icon: 'ri-database-line',
          typeName: 'Web Dev & Database',
          typeBadge: 'WEB DEV & DATABASE',
          colorClass: 'text-[#fdd663]',
        };
      case 'cloud':
        return {
          icon: 'ri-pencil-ruler-line',
          typeName: 'Cloud, OS & Tools',
          typeBadge: 'CLOUD, OS & DEV TOOLS',
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
          colorClass: 'text-[#a8c7fa]',
        };
      default:
        return {
          icon: 'ri-cpu-line',
          typeName: 'Core Stack',
          typeBadge: 'SYS-ARCH & CORE',
          colorClass: 'text-[#a8c7fa]',
        };
    }
  }, [activeTab]);

  const totalItems = activeTab === 'profiles' ? SKILL_PROFILES_DATA.length : filteredSkills.length;

  return (
    <section id="skills" className="pt-[8px] px-[8px] pb-0 border-b-0 bg-transparent relative scroll-mt-28 font-sans" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "0px" }}>
      <div className="max-w-7xl mx-auto px-0">
        
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 mb-[15px]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8c7fa] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a8c7fa] shadow-[0_0_8px_rgba(168,199,250,0.8)]"></span>
              </span>
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
            const activeBgColor =
              tab.id === 'languages'
                ? '#d0bcff'
                : tab.id === 'web'
                ? '#fdd663'
                : tab.id === 'cloud'
                ? '#a8c7fa'
                : tab.id === 'security'
                ? '#ffb4ab'
                : '#a8c7fa';
            const activeTextColor =
              tab.id === 'languages'
                ? '#381e72'
                : tab.id === 'web'
                ? '#3b2f00'
                : tab.id === 'cloud'
                ? '#00325b'
                : tab.id === 'security'
                ? '#561e18'
                : '#00325b';

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  soundEngine.play('click');
                }}
                className={`w-[35px] flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center border-0 text-[13px] leading-[16px] ${
                  isActive
                    ? 'font-semibold'
                    : 'text-[#c4c6d0] hover:text-white'
                }`}
                style={isActive ? { backgroundColor: activeBgColor, color: activeTextColor } : undefined}
                title={tab.label}
                aria-label={tab.label}
              >
                <i
                  className={`${tab.icon} text-base`}
                  style={isActive ? { color: activeTextColor } : { color: '#c4c6d0' }}
                ></i>
              </button>
            );
          })}
        </div>

        {/* FEED METRICS BAR & SHOWING COUNT */}
        <div
          className="bg-[#21232b] rounded-xl p-2 flex items-center justify-between gap-2 text-[12px] leading-[12px] text-[#8e9199] font-mono border-0 mb-[15px]"
          style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate" style={{ fontSize: "12px", lineHeight: "12px" }}>
              SHOWING{' '}
              <strong className={currentTabMeta.colorClass}>
                {totalItems > 0 ? 1 : 0}-{totalItems}
              </strong>{' '}
              OF <strong className="text-white">{totalItems}</strong>{' '}
              <strong className={currentTabMeta.colorClass}>{currentTabMeta.typeBadge}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] leading-[11px] text-[#8e9199]">
              <i className={`${currentTabMeta.icon} ${currentTabMeta.colorClass}`}></i>
              TYPE: <strong className="text-white uppercase">{currentTabMeta.typeName}</strong>
            </span>
          </div>
        </div>

        {/* --- PROFILES GRID (WHEN PROFILES TAB SELECTED) --- */}
        {activeTab === 'profiles' ? (
          <div className="animate-fadeIn">
            {/* 2-column side by side layout on all screens matching DEV PROFILES in Casefiles */}
            <div className="grid grid-cols-2 gap-[15px]" style={{ gap: "15px" }}>
              {SKILL_PROFILES_DATA.map((profile) => {
                return (
                  <div
                    key={profile.name}
                    style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
                    className="h-auto bg-[#21232b] border-0 p-2 rounded-2xl flex flex-col shadow-md"
                  >
                    {/* Card Header (Matching DEV PROFILES in Casefiles) */}
                    <div className="h-auto flex flex-col select-none">
                      {/* Top Bar: Icon, Title, Username handle, and Right Visit Profile Icon */}
                      <div className="flex items-center justify-between gap-2 shrink-0 min-h-[33px]">
                        <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#a8c7fa] min-w-0 flex-1">
                          {/* Button before text like credly bg color #a8c7fa */}
                          <div
                            className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center font-bold shadow-sm"
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
          /* --- MATRIX GRID --- */
          <div>
          {filteredSkills.length === 0 ? (
            <div className="py-12 text-center text-[#8e9199] font-mono text-[13px] leading-[16px]">
              <i className="ri-folder-info-line text-3xl block mb-2 text-[#44474f]"></i>
              No technologies found for the selected category.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-[15px]" style={{ gap: '15px' }}>
              {filteredSkills.map((skill) => {
                const accentColor = getSkillAccentColor(skill.category);

                return (
                  <div
                    key={skill.id}
                    className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex items-center"
                    style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
                  >
                    <div className="flex items-center space-x-2.5 w-full min-w-0">
                      {/* Left: Button / Icon */}
                      <div
                        className="w-[32.9948px] h-[32.9948px] rounded-lg flex items-center justify-center text-base font-bold transition-colors shrink-0 shadow-sm"
                        style={{
                          width: '32.9948px',
                          height: '32.9948px',
                          backgroundColor:
                            skill.category === 'languages' || skill.category === 'datascience'
                              ? '#d0bcff'
                              : skill.category === 'web' || skill.category === 'backend'
                              ? '#fdd663'
                              : ['cloud', 'os', 'tools'].includes(skill.category)
                              ? '#a8c7fa'
                              : ['security', 'offsec', 'dfir', 'crypto'].includes(skill.category)
                              ? '#ffb4ab'
                              : '#21232b',
                          color:
                            skill.category === 'languages' || skill.category === 'datascience'
                              ? '#381e72'
                              : skill.category === 'web' || skill.category === 'backend'
                              ? '#3b2f00'
                              : ['cloud', 'os', 'tools'].includes(skill.category)
                              ? '#00325b'
                              : ['security', 'offsec', 'dfir', 'crypto'].includes(skill.category)
                              ? '#561e18'
                              : accentColor,
                        }}
                      >
                        <i className={skill.icon}></i>
                      </div>

                      {/* Right: Title Text + Progress Bar directly under text */}
                      <div className="min-w-0 flex-1 flex flex-col justify-center space-y-1.5">
                        <h3
                          className="text-base font-bold leading-tight truncate mb-0"
                          style={{ color: accentColor, marginBottom: '0px' }}
                        >
                          {skill.title}
                        </h3>
                        {/* Progress Bar styled like Hero Section */}
                        <div className="w-full bg-transparent h-[6px] rounded-full overflow-hidden flex items-center border-0">
                          <div
                            className="h-[4px] rounded-full transition-all duration-500"
                            style={{
                              width: `${skill.level}%`,
                              backgroundColor: accentColor,
                            }}
                          ></div>
                        </div>
                      </div>
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
