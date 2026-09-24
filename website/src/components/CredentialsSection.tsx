import React, { useState, useMemo } from 'react';
import {
 CERTIFICATIONS_DATA,
 BADGES_DATA,
 PROFILES_DATA,
} from '../data/portfolioData';
import { Credential, VerifiedBadge, CredentialProfile } from '../types';
import { soundEngine } from '../utils/soundEngine';

type SectionTab =
  | 'certifications'
  | 'cybersecurity'
  | 'cloud'
  | 'automation'
  | 'analytics'
  | 'badges'
  | 'profiles';

const CREDENTIAL_TABS: { id: SectionTab; label: string; icon: string }[] = [
  {
    id: 'certifications',
    label: `All Certifications (${CERTIFICATIONS_DATA.length})`,
    icon: 'ri-certificate-2-line',
  },
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
  {
    id: 'badges',
    label: `Digital Badges (${BADGES_DATA.length})`,
    icon: 'ri-police-badge-line',
  },
  {
    id: 'profiles',
    label: `Profiles (${PROFILES_DATA.length})`,
    icon: 'ri-user-community-line',
  },
];

export const CredentialsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SectionTab>('certifications');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
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

  const isCertTab = ['certifications', 'cybersecurity', 'cloud', 'automation', 'analytics'].includes(activeTab);

  // Filtered certifications by category or show all
  const filteredCertifications = useMemo(() => {
    if (activeTab === 'certifications') {
      return CERTIFICATIONS_DATA;
    }
    if (['cybersecurity', 'cloud', 'automation', 'analytics'].includes(activeTab)) {
      return CERTIFICATIONS_DATA.filter((cert) => cert.category === activeTab);
    }
    return [];
  }, [activeTab]);

  const currentTabMeta = useMemo(() => {
    switch (activeTab) {
      case 'cybersecurity':
        return {
          typeName: 'Security & Forensics',
          typeBadge: 'SECURITY & FORENSICS',
          labelSuffix: 'SECURITY & FORENSICS CERTS',
          icon: 'ri-shake-hands-line',
        };
      case 'cloud':
        return {
          typeName: 'Cloud & Software',
          typeBadge: 'CLOUD & SOFTWARE',
          labelSuffix: 'CLOUD & SOFTWARE CERTS',
          icon: 'ri-soundcloud-line',
        };
      case 'automation':
        return {
          typeName: 'Automation & Systems',
          typeBadge: 'AUTOMATION & SYSTEMS',
          labelSuffix: 'AUTOMATION & SYSTEMS CERTS',
          icon: 'ri-robot-2-line',
        };
      case 'analytics':
        return {
          typeName: 'Data & Strategy',
          typeBadge: 'DATA & STRATEGY',
          labelSuffix: 'DATA & STRATEGY CERTS',
          icon: 'ri-database-line',
        };
      case 'badges':
        return {
          typeName: 'Digital Badges',
          typeBadge: 'DIGITAL BADGES',
          labelSuffix: 'DIGITAL BADGES',
          icon: 'ri-police-badge-line',
        };
      case 'profiles':
        return {
          typeName: 'Academic & Dev Profiles',
          typeBadge: 'PROFILES',
          labelSuffix: 'CREDENTIAL PROFILES',
          icon: 'ri-user-community-line',
        };
      case 'certifications':
      default:
        return {
          typeName: 'All Certifications',
          typeBadge: 'ALL',
          labelSuffix: 'ALL CERTS',
          icon: 'ri-certificate-2-line',
        };
    }
  }, [activeTab]);

  const { totalItems, paginatedCertifications, paginatedBadges, paginatedProfiles } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    if (activeTab === 'badges') {
      return {
        totalItems: BADGES_DATA.length,
        paginatedCertifications: [],
        paginatedBadges: BADGES_DATA.slice(startIndex, startIndex + itemsPerPage),
        paginatedProfiles: [],
      };
    }
    if (activeTab === 'profiles') {
      return {
        totalItems: PROFILES_DATA.length,
        paginatedCertifications: [],
        paginatedBadges: [],
        paginatedProfiles: PROFILES_DATA.slice(startIndex, startIndex + itemsPerPage),
      };
    }
    // isCertTab
    return {
      totalItems: filteredCertifications.length,
      paginatedCertifications: filteredCertifications.slice(startIndex, startIndex + itemsPerPage),
      paginatedBadges: [],
      paginatedProfiles: [],
    };
  }, [activeTab, filteredCertifications, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

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
    <section id="certificates" className="pt-[15px] px-0 pb-0 border-b-0 bg-transparent relative scroll-mt-28 text-white font-mono">
 <div className="max-w-7xl mx-auto px-[8px] flex flex-col gap-[15px]" style={{ paddingLeft: "8px", paddingRight: "8px" }}>
 
 {/* TOP SECTION HEADER & STATS */}
 <div className="space-y-4">
 <div>
 <div className="flex items-center space-x-2 text-[12px] leading-[16px] font-mono text-[#a8c7fa] uppercase tracking-widest" style={{ lineHeight: "16px" }}>
 <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
 <span>AUTH-CREDS</span>
 </div>
 <h2 className="text-2xl font-bold text-white leading-[24px]" style={{ lineHeight: "24px" }}>
 Creds & Accred
 </h2>
 </div>

 {/* 2 Metric Cards matching Academic Tab / Intel Briefs cards */}
 <div className="grid grid-cols-2 gap-3 font-mono">
 {/* Card 1: CERTS */}
 <div className="h-[95px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "95px" }}>
 <div className="h-[30px] flex items-center justify-between">
 <div className="flex items-center gap-2 text-[11px] font-bold text-[#a8c7fa]">
 <div
 className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm"
 style={{ width: "32.9948px", height: "32.9948px" }}
 title="Certifications"
 >
 <i className="ri-shield-star-line" style={{ width: "26.9965px" }}></i>
 </div>
 <span className="text-[16px] leading-[16px]" style={{ fontSize: "16px", lineHeight: "16px" }}>CERTS</span>
 </div>
 <span className="text-[12px] leading-[12px] text-[#8e9199] font-sans font-medium" style={{ fontSize: "12px", lineHeight: "12px" }}>ACCRED</span>
 </div>
 <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-2 py-2 flex items-center gap-1.5" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <span className="text-[24px] font-bold text-[#a8c7fa] font-mono tracking-tight" style={{ fontSize: "24px" }}>{CERTIFICATIONS_DATA.length}</span>
 <span className="text-xs leading-[12px] text-[#8e9199] font-mono" style={{ lineHeight: "12px" }}>TOTAL</span>
 </div>
 </div>

 {/* Card 2: BADGES */}
 <div className="h-[95px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "95px" }}>
 <div className="h-[30px] flex items-center justify-between">
 <div className="flex items-center gap-2 text-[11px] font-bold text-[#fdd663]">
 <div
 className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center text-base font-bold shadow-sm"
 style={{ width: "32.9948px", height: "32.9948px" }}
 title="Digital Badges"
 >
 <i className="ri-medal-line"></i>
 </div>
 <span className="text-[16px] leading-[16px]" style={{ fontSize: "16px", lineHeight: "16px" }}>BADGES</span>
 </div>
 <span className="text-[12px] leading-[12px] text-[#8e9199] font-sans font-medium" style={{ fontSize: "12px", lineHeight: "12px" }}>CREDLY</span>
 </div>
 <div className="h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-2 py-2 flex items-center gap-1.5" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <span className="text-[24px] leading-[24px] font-bold text-[#fdd663] font-mono tracking-tight" style={{ fontSize: "24px", lineHeight: "24px" }}>{BADGES_DATA.length}</span>
 <span className="text-xs leading-[12px] text-[#8e9199] font-mono" style={{ lineHeight: "12px" }}>VERIFIED</span>
 </div>
 </div>
 </div>
 </div>

 {/* Consolidated 7-Button Capsule matching Arsenal */}
        <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] max-w-2xl w-full">
          {CREDENTIAL_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            let activeColorClass = 'bg-[#a8c7fa] text-[#042e60] font-semibold';
            let iconActiveClass = 'text-[#042e60]';
            if (tab.id === 'badges') {
              activeColorClass = 'bg-[#fdd663] text-[#3b2f00] font-semibold';
              iconActiveClass = 'text-[#3b2f00]';
            } else if (tab.id === 'profiles') {
              activeColorClass = 'bg-[#d0bcff] text-[#381e72] font-semibold';
              iconActiveClass = 'text-[#381e72]';
            }

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                  setExpandedIds(new Set());
                  setSelectedPathSteps({});
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
          className="bg-[#21232b] rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 text-[12px] leading-[12px] text-[#8e9199] font-mono border-0"
          style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "12px", lineHeight: "12px" }}>
              SHOWING{' '}
              <strong className={activeTab === 'badges' ? 'text-[#fdd663]' : activeTab === 'profiles' ? 'text-[#d0bcff]' : 'text-[#a8c7fa]'}>
                {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(currentPage * itemsPerPage, totalItems)}
              </strong>{' '}
              OF <strong className="text-white">{totalItems}</strong>{' '}
              {['cybersecurity', 'cloud', 'automation', 'analytics'].includes(activeTab) ? (
                <>
                  <strong className="text-[#a8c7fa]">{currentTabMeta.typeBadge}</strong>{' '}
                  <strong className="text-white">CERTS</strong>
                </>
              ) : activeTab === 'certifications' ? (
                <strong className="text-white">CERTS</strong>
              ) : activeTab === 'badges' ? (
                <strong className="text-[#fdd663]">DIGITAL BADGES</strong>
              ) : activeTab === 'profiles' ? (
                <strong className="text-[#d0bcff]">CREDENTIAL PROFILES</strong>
              ) : (
                <strong className="text-white">{currentTabMeta.labelSuffix}</strong>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] leading-[11px] text-[#8e9199]">
              <i className={`${currentTabMeta.icon} ${activeTab === 'badges' ? 'text-[#fdd663]' : activeTab === 'profiles' ? 'text-[#d0bcff]' : 'text-[#a8c7fa]'}`}></i>
              TYPE: <strong className="text-white uppercase">{currentTabMeta.typeName}</strong>
            </span>
            {totalPages > 1 && (
              <span className="text-[12px] leading-[12px] text-[#8e9199]" style={{ fontSize: "12px", lineHeight: "12px" }}>
                PAGE <span className={`font-bold ${activeTab === 'badges' ? 'text-[#fdd663]' : activeTab === 'profiles' ? 'text-[#d0bcff]' : 'text-[#a8c7fa]'}`}>{currentPage}</span> / {totalPages}
              </span>
            )}
          </div>
        </div>

        {/* TAB 1: CERTIFICATIONS */}
        {isCertTab && (
          <div className="flex flex-col gap-[15px] animate-fadeIn">
            {/* CERTIFICATIONS GRID - IDENTICAL TO RESEARCH / PUBS CONTAINER WITH DEFAULT COLLAPSE */}
            <div className="grid grid-cols-1 gap-3.5">
 {paginatedCertifications.map((cert) => {
 const isExpanded = expandedIds.has(cert.id);
 return (
 <div
 key={cert.id}
 className="h-auto bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col shadow-md" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
 >
 {/* Non-Expandable Card Header */}
 <div
 onClick={() => toggleExpanded(cert.id)}
 className="h-auto flex flex-col cursor-pointer select-none group"
 >
 {/* Top Bar: Icon, Title, and Right Actions */}
 <div className="flex items-center justify-between gap-2 shrink-0 min-h-[33px]">
 <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#a8c7fa] min-w-0 flex-1">
 <div
 className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#042e60] flex items-center justify-center font-bold shadow-sm" style={{ width: "33px", height: "33px" }}
 title={cert.issuer}
 >
 <i className={cert.icon || 'ri-shield-star-line'}></i>
 </div>
 <div className="flex flex-col justify-center min-w-0 flex-1">
 <span className="font-mono font-bold text-white text-[16px] leading-[16.5px] break-words text-left line-clamp-2" style={{ fontSize: "16px", lineHeight: "16.5px" }}>
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
 <div className="mt-[15px] min-h-[38px] h-auto bg-[#13141a] border border-[#44474f]/30 rounded-xl p-2 text-[12px] leading-[16.5px] text-[#a8aab3] font-sans space-y-2 animate-fadeIn" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <div className="flex items-start justify-between gap-3">
 <div className="space-y-1.5 flex-1 min-w-0">
 <div>
 <span className="font-semibold text-[#8e9199] leading-[12px]" style={{ lineHeight: "12px" }}>Issuer:</span>{' '}
 <span className="font-medium text-white leading-[12px]" style={{ lineHeight: "12px" }}>{cert.issuer}</span>
 </div>

 <div>
 <span className="font-semibold text-[#8e9199] leading-[12px]" style={{ lineHeight: "12px" }}>Domain:</span>{' '}
 <span className="text-[#c2e7ff] capitalize font-medium leading-[12px]" style={{ lineHeight: "12px" }}>{cert.category}</span>
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
 className="w-[33px] h-[33px] rounded-lg bg-[#a8c7fa] hover:bg-[#c2e7ff] text-[#00325b] flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer" style={{ width: "33px", height: "33px" }}
 >
 <i className="ri-link-unlink-m text-[27px]" style={{ fontSize: "27px" }}></i>
 </a>
 </div>

 {cert.description && (
 <div className="pt-2 text-[#a8aab3] text-justify text-[12px] leading-[16px]" style={{ lineHeight: "16px" }}>
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
 {paginatedBadges.map((badge) => {
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
 className="h-auto bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col shadow-md" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
 >
 {/* Non-Expandable Card Header */}
 <div
 onClick={() => toggleExpanded(badge.id)}
 className="h-auto flex flex-col cursor-pointer select-none group"
 >
 {/* Top Bar: Icon, Title, Issuer, and Right Actions */}
 <div className="flex items-center justify-between gap-2 shrink-0 min-h-[33px]">
 <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#fdd663] min-w-0 flex-1">
 <div
 className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center font-bold shadow-sm" style={{ width: "33px", height: "33px" }}
 title={displayIssuer}
 >
 <i className={badge.icon || 'ri-medal-line'}></i>
 </div>
 <div className="flex flex-col justify-center min-w-0 flex-1">
 <span className="font-mono font-bold text-white text-[16px] leading-[16.5px] break-words text-left line-clamp-2" style={{ fontSize: "16px", lineHeight: "16.5px" }}>
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
 <div className="mt-[15px] min-h-[38px] h-auto bg-[#13141a] border border-[#44474f]/30 rounded-xl p-2 text-[12px] leading-[16.5px] text-[#a8aab3] font-sans space-y-2.5 animate-fadeIn" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
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
 className={`p-2 rounded-lg font-mono text-[11px] leading-[16.5px] font-bold text-center transition-all cursor-pointer truncate border-0 ${
 isSelected
 ? 'bg-[#fdd663] text-[#3b2f00] shadow-sm'
 : 'bg-[#21232b] hover:bg-[#2b2d38] text-[#c4c6d0] hover:text-white'
 }`}
 style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", fontSize: "11px" }}
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
 className={`w-[33px] h-[33px] rounded-lg flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer ${
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
 className="w-[33px] h-[33px] rounded-lg bg-[#fdd663] hover:bg-[#ffe088] text-[#3b2f00] flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer" style={{ width: "33px", height: "33px" }}
 >
 <i className="ri-link-unlink-m text-[27px]" style={{ fontSize: "27px" }}></i>
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
 {paginatedProfiles.map((profile) => {
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
 <div className="flex items-center justify-between gap-2 shrink-0 min-h-[33px]">
 <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#a8e6cf] min-w-0 flex-1">
 <div
 className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#a8e6cf] text-[#003923] flex items-center justify-center font-bold shadow-sm" style={{ width: "33px", height: "33px" }}
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
 className="w-[33px] h-[33px] rounded-lg bg-[#a8e6cf] hover:bg-[#c6f6d5] text-[#003923] flex items-center justify-center font-bold shadow-sm transition-all shrink-0 cursor-pointer" style={{ width: "33px", height: "33px" }}
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
 )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[13px] leading-[16px] pt-1">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  soundEngine.play('click');
                  setCurrentPage((p) => p - 1);
                  document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' });
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
                      document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-[18px] text-base font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? activeTab === 'badges'
                          ? 'bg-[#fdd663] text-[#3b2f00] shadow-md'
                          : activeTab === 'profiles'
                          ? 'bg-[#d0bcff] text-[#381e72] shadow-md'
                          : 'bg-[#a8c7fa] text-[#001d35] shadow-md'
                        : 'bg-[#21232b] text-[#8e9199] hover:bg-[#2c2f3a] hover:text-white'
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
                  document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' });
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
 </div>
 </section>
 );
};
