import React, { useState, useMemo } from 'react';
import {
 CERTIFICATIONS_DATA,
 BADGES_DATA,
 PROFILES_DATA,
} from '../data/portfolioData';
import { Credential, VerifiedBadge, CredentialProfile } from '../types';
import { soundEngine } from '../utils/soundEngine';

type SectionTab = 'certifications' | 'badges' | 'profiles';
type CategoryFilter = 'cybersecurity' | 'cloud' | 'automation' | 'analytics';

export const CredentialsSection: React.FC = () => {
 const [activeTab, setActiveTab] = useState<SectionTab>('certifications');
 const [activeCategory, setActiveCategory] = useState<CategoryFilter>('cybersecurity');
 const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
 const [copiedId, setCopiedId] = useState<string | null>(null);
 const [selectedPathSteps, setSelectedPathSteps] = useState<Record<string, number | null>>({});

 const formatBadgeDescription = (desc: string) => {
 const match = desc.match(/^([^:]+:)(.*)$/s);
 if (match) {
 return (
 <span>
 <span className="text-[#fdd663] font-semibold">{match[1]}</span>
 {match[2]}
 </span>
 );
 }
 return desc;
 };

 const categories: { id: CategoryFilter; label: string; icon: string }[] = [
 {
 id: 'cybersecurity',
 label: 'Security & Forensics',
 icon: 'ri-shake-hands-line',
 },
 {
 id: 'cloud',
 label: 'Cloud & Software',
 icon: 'ri-soundcloud-line',
 },
 {
 id: 'automation',
 label: 'Automation & Systems',
 icon: 'ri-robot-2-line',
 },
 {
 id: 'analytics',
 label: 'Data & Strategy',
 icon: 'ri-database-line',
 },
 ];

 // Filtered certifications by category
 const filteredCertifications = useMemo(() => {
 return CERTIFICATIONS_DATA.filter((cert) => {
 return cert.category === activeCategory;
 });
 }, [activeCategory]);

 const toggleExpanded = (id: string) => {
 setExpandedIds((prev) => {
 if (prev.has(id)) {
 setSelectedPathSteps((steps) => ({ ...steps, [id]: null }));
 return new Set();
 } else {
 setSelectedPathSteps({});
 return new Set([id]);
 }
 });
 soundEngine.play('click');
 };

 const handleCopyCredentialId = (id: string, e: React.MouseEvent) => {
 e.stopPropagation();
 navigator.clipboard.writeText(id);
 setCopiedId(id);
 soundEngine.play('click');
 setTimeout(() => {
 setCopiedId((prev) => (prev === id ? null : prev));
 }, 2200);
 };

 return (
 <section id="certificates" className="pt-[15px] px-[15px] pb-0 border-b-0 bg-[#0f0e13] relative scroll-mt-28 text-white font-mono">
 <div className="max-w-7xl mx-auto px-0 flex flex-col gap-[15px]">
 
 {/* TOP SECTION HEADER & STATS */}
 <div className="space-y-4">
 <div>
 <div className="flex items-center space-x-2 text-[12px] leading-[13px] font-mono text-[#a8c7fa] uppercase tracking-widest">
 <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
 <span>AUTH-CREDS</span>
 </div>
 <h2 className="text-2xl font-bold text-white">
 Creds & Accred
 </h2>
 </div>

 {/* 2 Metric Cards matching Academic Tab / Intel Briefs cards */}
 <div className="grid grid-cols-2 gap-3 font-mono">
 {/* Card 1: CERTS */}
 <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
 <div className="h-[30px] flex items-center justify-between">
 <div className="flex items-center gap-2 text-[11px] font-bold text-[#a8c7fa]">
 <div
 className="w-[28px] h-[28px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm"
 title="Certifications"
 >
 <i className="ri-shield-star-line"></i>
 </div>
 <span>CERTS</span>
 </div>
 <span className="text-[10px] text-[#8e9199] font-sans font-medium">ACCRED</span>
 </div>
 <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
 <span className="text-xl font-bold text-[#a8c7fa] font-mono tracking-tight">{CERTIFICATIONS_DATA.length}</span>
 <span className="text-xs text-[#8e9199] font-mono">TOTAL</span>
 </div>
 </div>

 {/* Card 2: BADGES */}
 <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
 <div className="h-[30px] flex items-center justify-between">
 <div className="flex items-center gap-2 text-[11px] font-bold text-[#fdd663]">
 <div
 className="w-[28px] h-[28px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center text-base font-bold shadow-sm"
 title="Digital Badges"
 >
 <i className="ri-medal-line"></i>
 </div>
 <span>BADGES</span>
 </div>
 <span className="text-[10px] text-[#8e9199] font-sans font-medium">CREDLY</span>
 </div>
 <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
 <span className="text-xl font-bold text-[#fdd663] font-mono tracking-tight">{BADGES_DATA.length}</span>
 <span className="text-xs text-[#8e9199] font-mono">VERIFIED</span>
 </div>
 </div>
 </div>
 </div>

 {/* PRIMARY VIEW NAVIGATION TABS - SLIDER CAPSULE MATCHING INTEL BRIEFS */}
 <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] w-full">
 <button
 onClick={() => {
 setActiveTab('certifications');
 setExpandedIds(new Set());
 setSelectedPathSteps({});
 soundEngine.play('click');
 }}
 title={`Certifications (${CERTIFICATIONS_DATA.length})`}
 aria-label={`Certifications (${CERTIFICATIONS_DATA.length})`}
 className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center ${
 activeTab === 'certifications'
 ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
 : 'text-[#c4c6d0] hover:text-white'
 }`}
 >
 <i className="ri-certificate-2-line text-lg"></i>
 </button>

 <button
 onClick={() => {
 setActiveTab('badges');
 setExpandedIds(new Set());
 setSelectedPathSteps({});
 soundEngine.play('click');
 }}
 title={`Digital Badges (${BADGES_DATA.length})`}
 aria-label={`Digital Badges (${BADGES_DATA.length})`}
 className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center ${
 activeTab === 'badges'
 ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
 : 'text-[#c4c6d0] hover:text-white'
 }`}
 >
 <i className="ri-police-badge-line text-lg"></i>
 </button>

 <button
 onClick={() => {
 setActiveTab('profiles');
 setExpandedIds(new Set());
 setSelectedPathSteps({});
 soundEngine.play('click');
 }}
 title={`Profiles (${PROFILES_DATA.length})`}
 aria-label={`Profiles (${PROFILES_DATA.length})`}
 className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center ${
 activeTab === 'profiles'
 ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
 : 'text-[#c4c6d0] hover:text-white'
 }`}
 >
 <i className="ri-user-community-line text-lg"></i>
 </button>
 </div>

 {/* TAB 1: CERTIFICATIONS */}
 {activeTab === 'certifications' && (
 <div className="flex flex-col gap-[15px] animate-fadeIn">
 
 {/* Category Filter Tabs - Slider capsule matching above tab buttons */}
 <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] w-full">
 {categories.map((cat) => {
 const isActive = activeCategory === cat.id;
 return (
 <button
 key={cat.id}
 onClick={() => {
 setActiveCategory(cat.id);
 setExpandedIds(new Set());
 setSelectedPathSteps({});
 soundEngine.play('click');
 }}
 title={cat.label}
 aria-label={cat.label}
 className={`flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center ${
 isActive
 ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
 : 'text-[#c4c6d0] hover:text-white'
 }`}
 >
 <i className={`${cat.icon} text-lg`}></i>
 </button>
 );
 })}
 </div>

 {/* CERTIFICATIONS GRID - IDENTICAL TO RESEARCH / PUBS CONTAINER WITH DEFAULT COLLAPSE */}
 <div className="grid grid-cols-1 gap-3.5">
 {filteredCertifications.map((cert) => {
 const isExpanded = expandedIds.has(cert.id);
 return (
 <div
 key={cert.id}
 className="h-auto bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col shadow-md"
 >
 {/* Non-Expandable Card Header */}
 <div
 onClick={() => toggleExpanded(cert.id)}
 className="h-auto flex flex-col cursor-pointer select-none group"
 >
 {/* Top Bar: Icon, Title, and Right Actions */}
 <div className="flex items-center justify-between gap-2 shrink-0 min-h-[31.9965px]">
 <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#a8c7fa] min-w-0 flex-1">
 <div
 className="w-[31.9965px] h-[31.9965px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#042e60] flex items-center justify-center text-base font-bold shadow-sm"
 title={cert.issuer}
 >
 <i className={cert.icon || 'ri-shield-star-line'}></i>
 </div>
 <div className="flex flex-col justify-center min-w-0 flex-1">
 <span className="font-mono font-bold text-white text-[14px] leading-tight break-words text-left line-clamp-2">
 {cert.title}
 </span>
 </div>
 </div>

 {/* Right side Status Badge & Expand Icon */}
 <div className="flex items-center gap-2.5 shrink-0">
 {cert.status && (
 <span className="text-[10px] text-[#a8c7fa] font-sans font-medium hidden break-words">
 {cert.status.replace('VERIFIED ', '')}
 </span>
 )}

 {/* Expand / Collapse Icon */}
 <i
 className={`text-base text-[#a8c7fa] transition-all shrink-0 ${
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
 <span className="font-semibold text-[#8e9199]">Issuer:</span>{' '}
 <span className="font-medium text-white">{cert.issuer}</span>
 </div>

 <div>
 <span className="font-semibold text-[#8e9199]">Domain:</span>{' '}
 <span className="text-[#c2e7ff] capitalize font-medium">{cert.category}</span>
 </div>
 </div>

 {/* Verify Link Button at Top Right of Details Box */}
 <a
 href={cert.link}
 target="_blank"
 rel="noopener noreferrer"
 onClick={(e) => {
 e.stopPropagation();
 soundEngine.play('click');
 }}
 title="Verify Certificate"
 className="w-[31.9965px] h-[31.9965px] rounded-lg bg-[#a8c7fa] hover:bg-[#c2e7ff] text-[#00325b] flex items-center justify-center text-sm font-bold shadow-sm transition-all shrink-0 cursor-pointer"
 >
 <i className="ri-link-unlink-m"></i>
 </a>
 </div>

 {cert.description && (
 <div className="pt-2 text-[#a8aab3] text-justify text-[12px] leading-[16.5px]">
 {cert.description}
 </div>
 )}
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* TAB 2: DIGITAL BADGES */}
 {activeTab === 'badges' && (
 <div className="animate-fadeIn">
 {/* DIGITAL BADGES GRID - IDENTICAL TO RESEARCH / PUBS CONTAINER WITH DEFAULT COLLAPSE */}
 <div className="grid grid-cols-1 gap-3.5">
 {BADGES_DATA.map((badge) => {
 const isExpanded = expandedIds.has(badge.id);
 const activeStepIndex = isExpanded && selectedPathSteps[badge.id] !== undefined ? selectedPathSteps[badge.id] : null;
 const activePathStep = isExpanded && activeStepIndex !== null && badge.learningPath && badge.learningPath[activeStepIndex]
 ? badge.learningPath[activeStepIndex]
 : null;

 const displayTitle = activePathStep ? activePathStep.title : badge.title;
 const displayIssuer = activePathStep ? activePathStep.issuer : badge.issuer;
 const displayDate = activePathStep ? activePathStep.issueDate : badge.issueDate;
 const displayCredentialId = activePathStep ? activePathStep.credentialId : badge.credentialId;
 const displayDescription = activePathStep ? activePathStep.description : badge.description;
 const displayLink = activePathStep ? activePathStep.link : badge.link;

 return (
 <div
 key={badge.id}
 className="h-auto bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col shadow-md"
 >
 {/* Non-Expandable Card Header */}
 <div
 onClick={() => toggleExpanded(badge.id)}
 className="h-auto flex flex-col cursor-pointer select-none group"
 >
 {/* Top Bar: Icon, Title, Issuer, and Right Actions */}
 <div className="flex items-center justify-between gap-2 shrink-0 min-h-[31.9965px]">
 <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#fdd663] min-w-0 flex-1">
 <div
 className="w-[31.9965px] h-[31.9965px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center text-base font-bold shadow-sm"
 title={displayIssuer}
 >
 <i className={badge.icon || 'ri-medal-line'}></i>
 </div>
 <div className="flex flex-col justify-center min-w-0 flex-1">
 <span className="font-mono font-bold text-white text-[14px] leading-tight break-words text-left line-clamp-2">
 {displayTitle}
 </span>
 </div>
 </div>

 {/* Right side Badge & Expand Icon */}
 <div className="flex items-center gap-2.5 shrink-0">
 <span className="text-[10px] text-[#a8c7fa] font-sans font-medium hidden">CREDLY</span>

 {/* Expand / Collapse Icon */}
 <i
 className={`text-base text-[#a8c7fa] transition-all shrink-0 ${
 isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
 }`}
 title={isExpanded ? 'Collapse details' : 'Expand details'}
 ></i>
 </div>
 </div>
 </div>

 {/* Inner Content Capsule Box (COLLAPSED BY DEFAULT, EXPANDED ON CLICK) */}
 {isExpanded && (
 <div className="mt-[15px] min-h-[38px] h-auto bg-[#13141a] border border-[#44474f]/30 rounded-xl p-3.5 text-[12px] leading-[16.5px] text-[#a8aab3] font-sans space-y-2.5 animate-fadeIn">
 {/* Interactive Learning Path Buttons in a Single Row */}
 {badge.learningPath && badge.learningPath.length > 0 && (
 <div
 className="grid gap-1 w-full"
 style={{
 gridTemplateColumns: `repeat(${badge.learningPath.length}, minmax(0, 1fr))`,
 }}
 >
 {badge.learningPath.map((step, idx) => {
 const isSelected = activeStepIndex === idx;
 return (
 <button
 key={step.id}
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 soundEngine.play('click');
 setSelectedPathSteps((prev) => ({
 ...prev,
 [badge.id]: prev[badge.id] === idx ? null : idx,
 }));
 }}
 className={`py-1 px-1 rounded-lg font-mono text-[12px] leading-[16.5px] font-bold text-center transition-all cursor-pointer truncate border-0 ${
 isSelected
 ? 'bg-[#fdd663] text-[#3b2f00] shadow-sm'
 : 'bg-[#21232b] hover:bg-[#2b2d38] text-[#c4c6d0] hover:text-white'
 }`}
 title={step.title}
 >
 {step.name}
 </button>
 );
 })}
 </div>
 )}

 <div className="flex items-start justify-between gap-3">
 <div className="space-y-1 flex-1 min-w-0">
 <div>
 <span className="font-semibold text-[#8e9199]">Issuer:</span>{' '}
 <span className="font-medium text-white">{displayIssuer}</span>
 </div>

 <div>
 <span className="font-semibold text-[#8e9199]">Date:</span>{' '}
 <span className="font-medium text-white">{displayDate}</span>
 </div>
 </div>

 {/* Action Buttons: Copy ID & Verify Link Button at Top Right of Details Box */}
 <div className="flex items-center gap-1.5 shrink-0">
 <button
 onClick={(e) => handleCopyCredentialId(displayCredentialId, e)}
 title={copiedId === displayCredentialId ? 'Copied Credly ID' : 'Copy Credly ID'}
 className={`w-[31.9965px] h-[31.9965px] rounded-lg flex items-center justify-center text-sm font-bold shadow-sm transition-all shrink-0 cursor-pointer ${
 copiedId === displayCredentialId
 ? 'bg-[#a8e6cf] hover:bg-[#c6f6d5] text-[#003923]'
 : 'bg-[#a8c7fa] hover:bg-[#c2e7ff] text-[#00325b]'
 }`}
 >
 <i className={copiedId === displayCredentialId ? 'ri-survey-line' : 'ri-file-copy-2-line'}></i>
 </button>

 <a
 href={displayLink}
 target="_blank"
 rel="noopener noreferrer"
 onClick={(e) => {
 e.stopPropagation();
 soundEngine.play('click');
 }}
 title="View Credly Badge"
 className="w-[31.9965px] h-[31.9965px] rounded-lg bg-[#fdd663] hover:bg-[#ffe088] text-[#3b2f00] flex items-center justify-center text-sm font-bold shadow-sm transition-all shrink-0 cursor-pointer"
 >
 <i className="ri-link-unlink-m"></i>
 </a>
 </div>
 </div>

 {displayDescription && (
 <div className="pt-2 text-[#a8aab3] text-justify text-[12px] leading-[16.5px]">
 {formatBadgeDescription(displayDescription)}
 </div>
 )}
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* TAB 3: PROFILES */}
 {activeTab === 'profiles' && (
 <div className="animate-fadeIn">
 {/* PROFILES GRID - IDENTICAL TO RESEARCH / PUBS CONTAINER WITH DEFAULT COLLAPSE */}
 <div className="grid grid-cols-1 gap-3.5">
 {PROFILES_DATA.map((profile) => {
 const isExpanded = expandedIds.has(profile.name);
 return (
 <div
 key={profile.name}
 className="h-auto bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col shadow-md"
 >
 {/* Non-Expandable Card Header */}
 <div
 onClick={() => toggleExpanded(profile.name)}
 className="h-auto flex flex-col cursor-pointer select-none group"
 >
 {/* Top Bar: Icon, Title, Handle, and Right Actions */}
 <div className="flex items-center justify-between gap-2 shrink-0 min-h-[31.9965px]">
 <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#a8e6cf] min-w-0 flex-1">
 <div
 className="w-[31.9965px] h-[31.9965px] shrink-0 rounded-lg bg-[#a8e6cf] text-[#003923] flex items-center justify-center text-base font-bold shadow-sm"
 title={profile.name}
 >
 <i className={profile.icon || 'ri-external-link-line'}></i>
 </div>
 <div className="flex flex-col justify-center min-w-0 flex-1">
 <span className="font-mono font-bold text-white text-[14px] leading-tight break-words text-left line-clamp-2">
 {profile.name}
 </span>
 <span className="text-[11px] text-[#a8e6cf] font-mono font-medium tracking-wider leading-tight mt-0.5 break-words text-left">
 {profile.username}
 </span>
 </div>
 </div>

 {/* Right side Status Badge & Expand Icon */}
 <div className="flex items-center gap-2.5 shrink-0">
 <span className="text-[10px] text-[#a8c7fa] font-sans font-medium hidden break-words">
 {profile.status}
 </span>

 {/* Expand / Collapse Icon */}
 <i
 className={`text-base text-[#a8c7fa] transition-all shrink-0 ${
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
 <span className="text-[#a8e6cf] font-mono font-medium">{profile.username}</span>
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
 className="w-[31.9965px] h-[31.9965px] rounded-lg bg-[#a8e6cf] hover:bg-[#c6f6d5] text-[#003923] flex items-center justify-center text-sm font-bold shadow-sm transition-all shrink-0 cursor-pointer"
 >
 <i className="ri-link-unlink-m"></i>
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
 )}

 </div>
 </section>
 );
};
