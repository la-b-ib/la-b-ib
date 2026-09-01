import React, { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import { soundEngine } from '../utils/soundEngine';
import {
 SKILLS_DATA,
 MISSIONS_DATA,
 CASEFILES_DATA,
 DISPATCHES_DATA,
 CERTIFICATIONS_DATA,
 BADGES_DATA,
 PUBLICATIONS_DATA,
 RECOMMENDATIONS_DATA,
} from '../data/portfolioData';
import { Casefile } from '../types';

export interface SearchItem {
 id: string;
 title: string;
 subtitle: string;
 category: 'Skill' | 'Casefile' | 'Dispatch' | 'Mission' | 'Certificate' | 'Publication' | 'Navigation' | 'Recommendation';
 description: string;
 sectionId: string;
 icon: string;
 badgeColor?: string;
 casefileData?: Casefile;
 tags?: string[];
}

export const FILTER_CATEGORIES = [
 { id: 'ALL', label: 'ALL', icon: 'ri-apps-2-line' },
 { id: 'Navigation', label: 'PAGES', icon: 'ri-compass-3-line' },
 { id: 'Dispatch', label: 'DISPATCH', icon: 'ri-article-line' },
 { id: 'Casefile', label: 'CASEFILES', icon: 'ri-folder-shield-2-line' },
 { id: 'Skill', label: 'SKILLS', icon: 'ri-tools-line' },
 { id: 'Certificate', label: 'CERTS', icon: 'ri-award-line' },
];

export interface HeaderSearchProps {
 onSelectSection: (sectionId: string) => void;
 onInspectCasefile?: (casefile: Casefile) => void;
 className?: string;
 autoFocus?: boolean;
 onClose?: () => void;
 placeholder?: string;
 onMatchesCountChange?: (count: number) => void;
 selectedCategory?: string;
 onCategoryChange?: (cat: string) => void;
 iconPosition?: 'left' | 'right';
 iconName?: string;
 inputClassName?: string;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
 onSelectSection,
 onInspectCasefile,
 className = '',
 autoFocus = false,
 onClose,
 placeholder = 'Search site items, skills, casefiles...',
 onMatchesCountChange,
 selectedCategory: propSelectedCategory,
 onCategoryChange,
 iconPosition = 'left',
 iconName = 'ri-search-line',
 inputClassName = 'rounded-xl',
}) => {
 const [query, setQuery] = useState('');
 const [isOpen, setIsOpen] = useState(false);
 const [selectedIndex, setSelectedIndex] = useState(0);
 const [internalCategory, setInternalCategory] = useState<string>('ALL');
 const activeCategory = propSelectedCategory !== undefined ? propSelectedCategory : internalCategory;

 const handleCategorySelect = (cat: string) => {
 setInternalCategory(cat);
 if (onCategoryChange) onCategoryChange(cat);
 };

 const inputRef = useRef<HTMLInputElement>(null);
 const containerRef = useRef<HTMLDivElement>(null);

 // Build unified search items catalog
 const searchItems = useMemo<SearchItem[]>(() => {
 const items: SearchItem[] = [
 // Navigation Pages
 {
 id: 'nav-about',
 title: 'Intel Brief & Dossier',
 subtitle: 'About Labib Bin Shahed, Clearance, PGP Fingerprint',
 category: 'Navigation',
 description: 'OffSec Architect, RAM Forensics specialist, IEEE publications, background and bio.',
 sectionId: 'about',
 icon: 'ri-user-secret-line',
 },
 {
 id: 'nav-threat-map',
 title: 'Global Threat Ops',
 subtitle: '3D Interactive Cyber Attack Map',
 category: 'Navigation',
 description: 'Real-time honeypot attack telemetry, global 3D vector globe, attack origins and vectors.',
 sectionId: 'threat-map',
 icon: 'ri-radar-line',
 },
 {
 id: 'nav-missions',
 title: 'Operational Missions & Experience',
 subtitle: 'Work History & Cyber Defense Operations',
 category: 'Navigation',
 description: 'Principal OffSec Consultant, Lead Forensics Engineer, Full-Stack Security Lead.',
 sectionId: 'experience',
 icon: 'ri-shield-user-line',
 },
 {
 id: 'nav-arsenal',
 title: 'Arsenal & Technical Competencies',
 subtitle: 'Security Tools & Full-Stack Capabilities',
 category: 'Navigation',
 description: 'Metasploit, Burp Suite Pro, Volatility 3, Ghidra, React 19, Go, Rust, Wireshark, YARA.',
 sectionId: 'skills',
 icon: 'ri-tools-line',
 },
 {
 id: 'nav-casefiles',
 title: 'Casefiles & Project Repositories',
 subtitle: 'Open Source Security Tools & Platforms',
 category: 'Navigation',
 description: 'AetherShield, MemoryPulse, CypherNet, AegisAuth, KernelGuard, ThreatScope.',
 sectionId: 'projects',
 icon: 'ri-folder-shield-2-line',
 },
 {
 id: 'nav-dispatch',
 title: 'Security Dispatches & Intel Bulletins',
 subtitle: 'Field Advisories & Zero-Day Research',
 category: 'Navigation',
 description: 'eBPF Ring Buffer LPE, Volatility 3 Memory Injection, EIP-1153 Reentrancy, Cilium Zero-Trust Bypass, VMI Rootkit Hunting.',
 sectionId: 'dispatch',
 icon: 'ri-article-line',
 },
 {
 id: 'nav-certificates',
 title: 'Credentials & Verifications',
 subtitle: 'Certifications, Badges, IEEE Publications',
 category: 'Navigation',
 description: 'OSCP, CISSP, CEH Master, AWS Security Specialist, Credly Badges, Degree.',
 sectionId: 'certificates',
 icon: 'ri-award-line',
 },
 {
 id: 'nav-contact',
 title: 'Encrypted Contact & PGP Channel',
 subtitle: 'Secure Direct Communication',
 category: 'Navigation',
 description: 'Send encrypted dispatches, book security consultation, view public PGP key.',
 sectionId: 'contact',
 icon: 'ri-lock-2-line',
 },
 ];

 // Add Skills
 SKILLS_DATA.forEach((skill) => {
 items.push({
 id: `skill-${skill.id}`,
 title: skill.title,
 subtitle: `${skill.levelLabel} • ${skill.expYears}`,
 category: 'Skill',
 description: `${skill.description} Command: ${skill.command}`,
 sectionId: 'skills',
 icon: skill.icon,
 tags: [skill.category],
 });
 });

 // Add Missions
 MISSIONS_DATA.forEach((mission) => {
 items.push({
 id: `mission-${mission.id}`,
 title: mission.title,
 subtitle: `${mission.company} • ${mission.period}`,
 category: 'Mission',
 description: `${mission.summary} ${mission.bullets.join(' ')} ${mission.tech.join(' ')}`,
 sectionId: 'experience',
 icon: 'ri-shield-user-line',
 tags: mission.tech,
 });
 });

 // Add Casefiles
 CASEFILES_DATA.forEach((casefile) => {
 items.push({
 id: `casefile-${casefile.id}`,
 title: casefile.title,
 subtitle: `${casefile.caseId} • ${casefile.badge}`,
 category: 'Casefile',
 description: `${casefile.summary} ${casefile.tech.join(' ')} ${casefile.details.join(' ')}`,
 sectionId: 'projects',
 icon: 'ri-folder-shield-2-line',
 casefileData: casefile,
 tags: casefile.tech,
 });
 });

 // Add Dispatches
 DISPATCHES_DATA.forEach((dispatch) => {
 items.push({
 id: `dispatch-${dispatch.id}`,
 title: dispatch.title,
 subtitle: `${dispatch.dispatchId} • ${dispatch.severity} ADVISORY • ${dispatch.date}`,
 category: 'Dispatch',
 description: `${dispatch.summary} Target: ${dispatch.targetSystem} MITRE: ${dispatch.mitreAttck} ${dispatch.findings.join(' ')}`,
 sectionId: 'dispatch',
 icon: 'ri-article-line',
 tags: dispatch.tags,
 });
 });

 // Add Certifications
 CERTIFICATIONS_DATA.forEach((cert) => {
 items.push({
 id: `cert-${cert.id}`,
 title: cert.title,
 subtitle: cert.issuer,
 category: 'Certificate',
 description: `${cert.description} ${cert.credentialId || ''}`,
 sectionId: 'certificates',
 icon: cert.icon || 'ri-award-line',
 });
 });

 // Add Badges
 BADGES_DATA.forEach((badge) => {
 items.push({
 id: `badge-${badge.id}`,
 title: badge.title,
 subtitle: badge.issuer,
 category: 'Certificate',
 description: `${badge.description} ID: ${badge.credentialId}`,
 sectionId: 'certificates',
 icon: badge.icon || 'ri-verified-badge-line',
 });
 });

 // Add Publications
 PUBLICATIONS_DATA.forEach((pub) => {
 items.push({
 id: `pub-${pub.id}`,
 title: pub.title,
 subtitle: pub.conference,
 category: 'Publication',
 description: `IEEE DOI: ${pub.doi} ISBN: ${pub.isbn}`,
 sectionId: 'certificates',
 icon: 'ri-article-line',
 });
 });

 // Add Recommendations
 RECOMMENDATIONS_DATA.forEach((rec) => {
 items.push({
 id: `rec-${rec.id}`,
 title: `Peer Endorsement: ${rec.name}`,
 subtitle: `${rec.role} ${rec.organization ? '• ' + rec.organization : ''}`,
 category: 'Recommendation',
 description: rec.quote,
 sectionId: 'about',
 icon: 'ri-checkbox-circle-fill',
 });
 });

 return items;
 }, []);

 // Initialize Fuse.js instance
 const fuse = useMemo(() => {
 return new Fuse(searchItems, {
 keys: [
 { name: 'title', weight: 0.4 },
 { name: 'tags', weight: 0.25 },
 { name: 'subtitle', weight: 0.15 },
 { name: 'description', weight: 0.1 },
 { name: 'category', weight: 0.1 },
 ],
 threshold: 0.35,
 ignoreLocation: true,
 minMatchCharLength: 1,
 });
 }, [searchItems]);

 // Compute search results filtered by category
  const results = useMemo(() => {
    let list: SearchItem[] = [];
    if (!query.trim()) {
      // Default top suggestions when query is empty: filter by activeCategory or show mixed suggestions
      if (activeCategory === 'ALL') {
        list = searchItems.filter(item => item.category === 'Navigation' || item.category === 'Casefile' || item.category === 'Skill');
      } else {
        list = searchItems.filter(item => item.category === activeCategory);
      }
    } else {
      list = fuse.search(query.trim()).map(res => res.item);
      if (activeCategory !== 'ALL') {
        list = list.filter(item => item.category === activeCategory);
      }
    }

    return list.slice(0, 10);
  }, [query, fuse, searchItems, activeCategory]);

 // Auto focus effect if requested
 useEffect(() => {
 if (autoFocus) {
 setIsOpen(true);
 const timer = setTimeout(() => {
 inputRef.current?.focus();
 }, 50);
 return () => clearTimeout(timer);
 }
 }, [autoFocus]);

 // Keyboard shortcut Ctrl+K or Cmd+K
 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
 e.preventDefault();
 setIsOpen(prev => {
 const next = !prev;
 if (next) {
 setTimeout(() => inputRef.current?.focus(), 50);
 } else if (onClose) {
 onClose();
 }
 return next;
 });
 } else if (e.key === 'Escape' && isOpen) {
 setIsOpen(false);
 if (onClose) onClose();
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [isOpen, onClose]);

 // Handle clicking outside to close
 useEffect(() => {
 const handleClickOutside = (e: MouseEvent) => {
 if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
 setIsOpen(false);
 if (onClose) onClose();
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, [onClose]);

 // Reset selectedIndex and notify parent when results change
 useEffect(() => {
 setSelectedIndex(0);
 if (onMatchesCountChange) {
 onMatchesCountChange(results.length);
 }
 }, [results, onMatchesCountChange]);

 const handleSelectResult = (item: SearchItem) => {
 soundEngine.play('click');
 setIsOpen(false);
 setQuery('');
 onSelectSection(item.sectionId);
 if (item.casefileData && onInspectCasefile) {
 onInspectCasefile(item.casefileData);
 }
 if (onClose) {
 onClose();
 }
 };

 const handleKeyDownInInput = (e: React.KeyboardEvent) => {
 if (e.key === 'ArrowDown') {
 e.preventDefault();
 setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
 } else if (e.key === 'ArrowUp') {
 e.preventDefault();
 setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
 } else if (e.key === 'Enter') {
 e.preventDefault();
 if (results[selectedIndex]) {
 handleSelectResult(results[selectedIndex]);
 }
 }
 };

 const getCategoryBadgeStyle = (cat: SearchItem['category']) => {
 switch (cat) {
 case 'Casefile':
 return 'bg-[#004a77]/50 text-[#c2e7ff] border-0';
 case 'Skill':
 return 'bg-[#00522b]/50 text-[#a8e6cf] border-0';
 case 'Mission':
 return 'bg-[#00522b]/50 text-[#a8e6cf] border-0';
 case 'Certificate':
 return 'bg-[#5a4300]/50 text-[#fdd663] border-0';
 case 'Publication':
 return 'bg-[#381e72]/50 text-[#d0bcff] border-0';
 case 'Navigation':
 return 'bg-[#60000e]/50 text-[#ffb4ab] border-0';
 default:
 return 'bg-[#13141a] text-[#8e9199] border-0';
 }
 };

 // Helper to highlight matching characters in title
 const renderHighlightedText = (text: string, highlight: string) => {
 if (!highlight.trim()) return text;
 const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
 const parts = text.split(regex);
 return parts.map((part, i) =>
 regex.test(part) ? (
 <mark key={i} className="bg-white/20 text-white underline font-bold px-0.5 rounded-xs">
 {part}
 </mark>
 ) : (
 part
 )
 );
 };

 return (
 <div ref={containerRef} className={`relative ${className}`}>
 {/* Search Input Bar */}
 <div className="relative flex items-center">
 <input
 ref={inputRef}
 type="text"
 value={query}
 onChange={(e) => {
 setQuery(e.target.value);
 if (!isOpen) setIsOpen(true);
 }}
 onFocus={() => setIsOpen(true)}
 onKeyDown={handleKeyDownInInput}
 placeholder={placeholder}
 className={`w-full bg-[#21232b] border-0 text-white placeholder-[#8e9199] placeholder:text-[12px] font-mono text-[12px] ${
 iconPosition === 'right' ? 'pl-3.5 pr-12' : 'pl-9 pr-14'
 } h-[45px] ${inputClassName} focus:outline-none focus:ring-0 focus:border-0 border-0 !border-0 transition-all`}
 />
 {iconPosition === 'left' && (
 <i className={`${iconName} absolute left-3 text-[#8e9199] pointer-events-none`}></i>
 )}
 
 {/* Right side controls (Clear / Search Icon / Shortcut) */}
 <div className="absolute right-3 flex items-center gap-1.5">
 {query ? (
 <button
 type="button"
 onClick={() => {
 setQuery('');
 inputRef.current?.focus();
 }}
 className="search-result-item bg-[#21232b] hover:bg-[#2b2d36] text-[#c4c6d0] hover:text-white rounded-full border-0 flex items-center justify-center shrink-0 cursor-pointer w-6 h-6 transition-colors"
 title="Clear search"
 >
 <i className="ri-close-line text-sm text-[#c4c6d0]"></i>
 </button>
 ) : iconPosition === 'right' ? (
 <i className={`${iconName} text-base text-[#8e9199] pointer-events-none`}></i>
 ) : null}
 {iconPosition === 'left' && (
 <div className="hidden items-center gap-0.5 pointer-events-none">
 <kbd className="bg-[#0f0e13] text-[#8e9199] border border-[#44474f]/40 text-[10px] font-mono px-1.5 py-0.5 rounded-md">
 ⌘K
 </kbd>
 </div>
 )}
 </div>
 </div>

      {/* Instant Search Overlay Dropdown */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 w-full mt-0 bg-[#000000] border-0 shadow-2xl z-50 overflow-hidden font-mono text-xs animate-fadeIn h-[366px] flex flex-col pt-0 px-0 pb-[15px] rounded-2xl overscroll-contain"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Sticky Category Buttons Capsule matching Arsenal Section */}
          <div className="sticky top-0 z-20 bg-[#000000] pt-1 pb-2 shrink-0">
            <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] w-full shrink-0">
              {FILTER_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    title={cat.label}
                    aria-label={cat.label}
                    onClick={() => {
                      soundEngine.play("click");
                      handleCategorySelect(cat.id);
                    }}
                    className={`flex-1 min-w-0 h-[37px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center border-0 text-[12px] leading-[12px] ${
                      isActive
                        ? "bg-[#a8c7fa] text-[#042e60] font-semibold"
                        : "text-[#c4c6d0] hover:text-white"
                    }`}
                  >
                    <i className={`${cat.icon} text-base ${isActive ? "text-[#042e60]" : "text-[#c4c6d0]"}`}></i>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results List - Direct on background with smooth scrolling underneath sticky header */}
          <div 
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#000000]"
            onWheel={(e) => e.stopPropagation()}
          >
 {results.length === 0 ? (
 <div className="py-6 px-4 text-center text-[#8e9199] font-mono space-y-2.5">
 <i className="ri-search-eye-line text-2xl text-[#8e9199] block"></i>
 <p className="text-white font-bold text-xs">No telemetry entries found for "{query}"</p>
 <p className="text-[10px] text-[#8e9199]">
 Popular search terms:
 </p>
 <div className="flex flex-wrap justify-center gap-1 pt-1 max-w-sm mx-auto">
 {['OSCP', 'Metasploit', 'Volatility', 'React', 'Kernel', 'IEEE', 'Reverse Eng'].map((chip) => (
 <button
 key={chip}
 type="button"
 onClick={() => {
 setQuery(chip);
 handleCategorySelect('ALL');
 soundEngine.play('click');
 }}
 className="search-result-item text-[10px] bg-[#2b2930] text-[#c4c6d0] border-0 px-3 py-1 rounded-full transition-all cursor-pointer font-bold"
 >
 +{chip}
 </button>
 ))}
 </div>
 </div>
 ) : (
 results.map((item, idx) => {
 const isSelected = idx === selectedIndex;
 const badgeStyle = getCategoryBadgeStyle(item.category);
 return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectResult(item)}
                  className={`search-result-item w-full text-left px-3.5 py-3 flex items-start gap-3 cursor-pointer rounded-xl border-0 bg-[#21232b] text-[#c4c6d0] ${
                    isSelected
                      ? "text-white ring-1 ring-[#a8c7fa]/40 shadow-md"
                      : ""
                  }`}
                >
 {/* Icon - Clean inline icon without heavy box container */}
 <div className="mt-0.5 shrink-0 text-[#c4c6d0] flex items-center justify-center">
 <i className={`${item.icon} text-base `}></i>
 </div>

 {/* Text Body - Expanded horizontal utilization */}
 <div className="flex-1 min-w-0 space-y-0.5">
 <div className="flex items-center justify-between gap-1.5">
 <span className="font-bold text-white text-xs truncate">
 {renderHighlightedText(item.title, query)}
 </span>
 <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded shrink-0 uppercase ${badgeStyle}`}>
 {item.category}
 </span>
 </div>

 <div className="text-[11px] text-[#8e9199] font-medium truncate">
 {renderHighlightedText(item.subtitle, query)}
 </div>

 <p className="text-[10px] text-[#8e9199] line-clamp-2 leading-tight">
 {renderHighlightedText(item.description, query)}
 </p>

 {item.tags && item.tags.length > 0 && (
 <div className="flex flex-wrap gap-1 pt-0.5">
 {item.tags.slice(0, 4).map((tag, tIdx) => (
 <span
 key={tIdx}
 className="text-[9px] px-2 py-0.5 rounded bg-[#13141a] text-[#8e9199] font-mono"
 >
 #{tag}
 </span>
 ))}
 </div>
 )}
 </div>
 </button>
 );
 })
 )}
 </div>
 </div>
 )}
 </div>
 );
};
