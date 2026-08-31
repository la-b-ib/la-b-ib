import React, { useState, useMemo } from 'react';
import { SKILLS_DATA } from '../data/portfolioData';
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
 const [searchQuery, setSearchQuery] = useState('');
 const [copiedSkillId, setCopiedSkillId] = useState<string | null>(null);
 const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

 // Filter skills based on Category and Search Query
 const filteredSkills = useMemo(() => {
 return SKILLS_DATA.filter((skill) => {
 // Category Match
 let matchesCategory = true;
 if (activeTab) {
 if (activeTab === 'security') {
 matchesCategory = ['offsec', 'dfir', 'crypto'].includes(skill.category);
 } else {
 matchesCategory = skill.category === activeTab;
 }
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
 <div className="flex flex-col justify-between gap-4 mb-6">
 <div>
 <div className="flex items-center space-x-2">
 <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
 <span className="text-[12px] leading-[13px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold">
 SYS-ARCH & CORE
 </span>
 </div>
 <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
 SKILL STACK
 </h2>
 </div>
 </div>

 {/* Dynamic Controls Bar: Search Bar */}
 <div className="mb-[15px]">
 <div className="flex items-center h-[42px] bg-[#21232b] rounded-xl px-2 max-w-2xl w-full">
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
 className={`w-[35px] flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center border-0 text-[12px] leading-[12px] ${
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
 <div className="py-12 text-center text-[#8e9199] font-mono text-xs">
 <i className="ri-search-eye-line text-3xl block mb-2 text-[#44474f]"></i>
 No technologies found matching &ldquo;{searchQuery}&rdquo;.
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
 className="bg-[#21232b] border-0 p-4 rounded-2xl transition-all flex flex-col justify-between"
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
 className="text-sm font-bold leading-tight truncate"
 style={{ color: accentColor }}
 >
 {skill.title}
 </h3>
 <div className="text-xs leading-4 font-mono text-[#8e9199] truncate">
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
 <p className="text-xs text-[#c4c6d0] leading-relaxed">
 {skill.description}
 </p>

 {/* Tags */}
 {skill.tags && skill.tags.length > 0 && (
 <div className="flex flex-wrap gap-1 pt-0.5">
 {skill.tags.map((tag) => (
 <span
 key={tag}
 className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#13141a] text-white"
 >
 #{tag}
 </span>
 ))}
 </div>
 )}

 {/* --- INLINE DROPDOWN DETAILS ACCORDION --- */}
 {isExpanded && (
 <div className="mt-3 space-y-2.5 animate-fadeIn font-mono text-xs">
 <div className="flex items-center justify-between text-xs text-[#8e9199]">
 <span className="text-xs">DOMAIN :</span>
 <span className="font-bold text-xs"style={{ color: accentColor }}>{skill.ecosystem || 'Linux Core Architecture'}</span>
 </div>
 <div className="flex items-center justify-between text-xs text-[#8e9199]">
 <span className="text-xs">YEARS IN PRODUCTION:</span>
 <span className="text-[#a8e6cf] font-bold text-xs">{skill.expYears}</span>
 </div>
 <div className="flex items-center justify-between text-xs text-[#8e9199]">
 <span className="text-xs">PROFICIENCY RATING:</span>
 <span className="text-white font-bold text-xs">{skill.level}%</span>
 </div>
 </div>
 )}
 </div>

 {/* Bottom Signature Command Strip */}
 <div className="mt-3 flex items-center justify-between gap-2 h-[32px]">
 <div className="flex items-center space-x-1.5 overflow-hidden text-xs leading-[12px] font-mono text-[#8e9199] bg-[#13141a] px-2.5 h-[32px] rounded-lg flex-1 min-w-0">
 <span className="select-none font-bold shrink-0 text-xs leading-[12px]"style={{ color: accentColor }}>$</span>
 <span className="truncate text-xs leading-[12px]">{skill.command}</span>
 </div>
 <button
 onClick={(e) => handleCopyCommand(e, skill)}
 className={`w-[32px] h-[32px] rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer shrink-0 border-0 shadow-sm ${
 isCopied
 ? 'bg-[#a8e6cf] text-[#003824]'
 : 'bg-[#a8c7fa] text-[#00325b] hover:opacity-90 active:scale-95'
 }`}
 title={isCopied ?"Copied to clipboard!": `Copy"${skill.command}"`}
 aria-label={isCopied ?"Copied":"Copy command"}
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

 </div>
 </section>
 );
};
