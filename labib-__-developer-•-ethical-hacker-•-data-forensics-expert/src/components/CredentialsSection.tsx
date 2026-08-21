import React, { useState, useMemo } from 'react';
import {
  CERTIFICATIONS_DATA,
  BADGES_DATA,
} from '../data/portfolioData';
import { Credential, VerifiedBadge } from '../types';
import { soundEngine } from '../utils/soundEngine';

type SectionTab = 'certifications' | 'badges';
type CategoryFilter = 'all' | 'cybersecurity' | 'cloud' | 'automation' | 'analytics';

export const CredentialsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SectionTab>('certifications');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { id: CategoryFilter; label: string; icon: string; count: number }[] = [
    { id: 'all', label: 'All Categories', icon: 'ri-apps-2-line', count: CERTIFICATIONS_DATA.length },
    {
      id: 'cybersecurity',
      label: 'Security & Forensics',
      icon: 'ri-shield-keyhole-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'cybersecurity').length,
    },
    {
      id: 'cloud',
      label: 'Cloud & Software',
      icon: 'ri-code-box-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'cloud').length,
    },
    {
      id: 'automation',
      label: 'Automation & Systems',
      icon: 'ri-robot-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'automation').length,
    },
    {
      id: 'analytics',
      label: 'Data & Strategy',
      icon: 'ri-bar-chart-box-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'analytics').length,
    },
  ];

  // Filtered certifications
  const filteredCertifications = useMemo(() => {
    return CERTIFICATIONS_DATA.filter((cert) => {
      const matchesCategory = activeCategory === 'all' || cert.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Filtered badges
  const filteredBadges = useMemo(() => {
    return BADGES_DATA.filter((badge) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.credentialId.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery]);

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
    <section id="certificates" className="pt-[15px] px-[15px] pb-12 border-b-0 bg-[#0f0e13] relative scroll-mt-28 text-white font-mono">
      <div className="max-w-7xl mx-auto px-0 space-y-8">
        
        {/* TOP SECTION HEADER & STATS */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#a8c7fa] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
              <span>AUTH-CREDS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Creds & Accred
            </h2>
          </div>

          {/* 2 Metric Cards matching Academic Tab / Intel Briefs cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 font-mono">
            {/* Card 1: CERTS */}
            <div className="h-[95px] sm:h-[105px] bg-[#21232b] border-0 p-2.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[28px] sm:h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1 sm:pb-1.5">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-[#a8c7fa]">
                  <div
                    className="w-[22px] h-[22px] sm:w-[28px] sm:h-[28px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-xs sm:text-base font-bold shadow-sm"
                    title="Certifications"
                  >
                    <i className="ri-shield-star-line"></i>
                  </div>
                  <span>CERTS</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">ACCRED</span>
              </div>
              <div className="h-[34px] sm:h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-1.5">
                <span className="text-lg sm:text-2xl font-bold text-[#a8c7fa] font-mono tracking-tight">{CERTIFICATIONS_DATA.length}</span>
                <span className="text-xs sm:text-sm text-[#8e9199] font-mono">TOTAL</span>
              </div>
            </div>

            {/* Card 2: BADGES */}
            <div className="h-[95px] sm:h-[105px] bg-[#21232b] border-0 p-2.5 sm:p-4 rounded-2xl transition-all flex flex-col justify-between">
              <div className="h-[28px] sm:h-[30px] flex items-center justify-between border-b border-[#44474f]/30 pb-1 sm:pb-1.5">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-[#fdd663]">
                  <div
                    className="w-[22px] h-[22px] sm:w-[28px] sm:h-[28px] shrink-0 rounded-lg bg-[#fdd663] text-[#3b2f00] flex items-center justify-center text-xs sm:text-base font-bold shadow-sm"
                    title="Digital Badges"
                  >
                    <i className="ri-medal-line"></i>
                  </div>
                  <span>BADGES</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#8e9199] font-sans font-medium">CREDLY</span>
              </div>
              <div className="h-[34px] sm:h-[38px] bg-[#13141a] border border-[#44474f]/30 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-1.5">
                <span className="text-lg sm:text-2xl font-bold text-[#fdd663] font-mono tracking-tight">{BADGES_DATA.length}</span>
                <span className="text-xs sm:text-sm text-[#8e9199] font-mono">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY VIEW NAVIGATION TABS */}
        <div className="bg-[#1a1b21] p-1.5 rounded-2xl border border-[#44474f]/40 flex items-center gap-1.5 shadow-md">
          <button
            onClick={() => {
              setActiveTab('certifications');
              soundEngine.play('click');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'certifications'
                ? 'bg-[#a8c7fa] text-[#001d35] shadow'
                : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
            }`}
          >
            <i className="ri-shield-star-line text-sm"></i>
            <span className="truncate">Certifications ({CERTIFICATIONS_DATA.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('badges');
              soundEngine.play('click');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-[#fbbc05] text-[#2c1d00] shadow'
                : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
            }`}
          >
            <i className="ri-verified-badge-line text-sm"></i>
            <span className="truncate">Digital Badges ({BADGES_DATA.length})</span>
          </button>
        </div>

        {/* TAB 1: CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* DYNAMIC SEARCH & FILTER CONTROL BAR */}
            <div className="bg-[#1a1b21] p-4 rounded-2xl border border-[#44474f]/40 space-y-4 shadow-sm">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8e9199]"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, issuer (e.g. Cisco, Google, Fortinet), skill, or ID..."
                    className="w-full bg-[#0f0e13] border border-[#44474f]/40 focus:border-[#a8c7fa] pl-10 pr-9 py-2 rounded-xl text-xs text-white placeholder-[#8e9199] outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9199] hover:text-white"
                    >
                      <i className="ri-close-circle-line text-sm"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        soundEngine.play('click');
                      }}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 whitespace-nowrap transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-[#004a77] text-[#c2e7ff] border-[#a8c7fa]'
                          : 'bg-[#0f0e13] text-[#8e9199] border-[#44474f]/30 hover:border-[#a8c7fa]/50 hover:text-white'
                      }`}
                    >
                      <i className={`${cat.icon} text-xs`}></i>
                      <span>{cat.label}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#a8c7fa] text-[#001d35]' : 'bg-[#21232b] text-[#8e9199]'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RESULTS COUNT & STATUS */}
            {/* Sub-header / Counter */}
            <div className="text-xs text-[#8e9199] px-1">
              <span>
                Showing <strong className="text-white">{filteredCertifications.length}</strong> of {CERTIFICATIONS_DATA.length} accredited certificates
              </span>
            </div>

            {/* CERTIFICATIONS DISPLAY */}
            {filteredCertifications.length === 0 ? (
              <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-12 text-center space-y-3">
                <i className="ri-search-eye-line text-4xl text-[#8e9199]"></i>
                <div className="text-base font-bold text-white">No matching credentials found</div>
                <p className="text-xs text-[#8e9199]">
                  Try refining your search keyword or selecting a different category filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#a8c7fa] text-[#001d35] text-xs font-bold mt-2 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCertifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-5 space-y-4 hover:border-[#a8c7fa] hover:shadow-[0_0_20px_rgba(168,199,250,0.1)] transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Header Row */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#21232b] border border-[#44474f]/40 text-[#a8c7fa]">
                          <i className="ri-building-line text-xs mr-1 text-[#8e9199]"></i>
                          {cert.issuer}
                        </span>

                        {cert.status && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                            cert.status.includes('CREDLY')
                              ? 'bg-[#fbbc05]/10 text-[#fbbc05] border-[#fbbc05]/30'
                              : cert.status.includes('SPECIALIZATION')
                              ? 'bg-[#d0bcff]/10 text-[#d0bcff] border-[#d0bcff]/30'
                              : 'bg-[#00522b]/30 text-[#a8e6cf] border-[#a8e6cf]/30'
                          }`}>
                            {cert.status}
                          </span>
                        )}
                      </div>

                      {/* Icon + Title */}
                      <div className="flex items-start gap-3 pt-1">
                        <div className="w-10 h-10 rounded-xl bg-[#004a77]/30 border border-[#a8c7fa]/30 flex items-center justify-center text-[#a8c7fa] text-lg shrink-0 group-hover:scale-105 transition-transform">
                          <i className={cert.icon}></i>
                        </div>
                        <h3 className="text-sm font-bold text-white leading-snug group-hover:text-[#a8c7fa] transition-colors">
                          {cert.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#a8aab3] font-sans leading-relaxed line-clamp-3">
                        {cert.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#44474f]/20">
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEngine.play('click')}
                        className="w-full py-2 px-3 rounded-xl bg-[#004a77] hover:bg-[#005a91] text-xs font-bold text-[#c2e7ff] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#a8c7fa]/30"
                      >
                        <i className="ri-checkbox-circle-line text-xs"></i>
                        <span>Verify</span>
                        <i className="ri-external-link-line text-[10px] opacity-70"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DIGITAL BADGES */}
        {activeTab === 'badges' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#1a1b21] p-4 rounded-2xl border border-[#44474f]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8e9199]"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search digital badges by issuer (Cisco, Fortinet, Acronis), title, or ID..."
                  className="w-full bg-[#0f0e13] border border-[#44474f]/40 focus:border-[#fbbc05] pl-10 pr-9 py-2 rounded-xl text-xs text-white placeholder-[#8e9199] outline-none transition-all"
                />
              </div>

              <div className="text-xs text-[#fbbc05] font-bold flex items-center gap-1.5 shrink-0">
                <i className="ri-shield-check-line text-base"></i>
                <span>{filteredBadges.length} Credly Verified Badges</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-5 space-y-4 hover:border-[#fbbc05] hover:shadow-[0_0_20px_rgba(251,188,5,0.1)] transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#fbbc05]/10 border border-[#fbbc05]/30 text-[#fbbc05]">
                        <i className="ri-award-line text-xs mr-1"></i>
                        {badge.issuer}
                      </span>
                      <span className="text-[10px] text-[#8e9199] font-mono">
                        {badge.issueDate}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <div className="w-10 h-10 rounded-xl bg-[#fbbc05]/10 border border-[#fbbc05]/30 flex items-center justify-center text-[#fbbc05] text-lg shrink-0 group-hover:scale-105 transition-transform">
                        <i className={badge.icon}></i>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug group-hover:text-[#fbbc05] transition-colors">
                        {badge.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#a8aab3] font-sans leading-relaxed line-clamp-3">
                      {badge.description}
                    </p>

                    <div className="pt-2 border-t border-[#44474f]/30 flex items-center justify-between text-[10px]">
                      <span className="text-[#8e9199]">CREDLY ID:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#fbbc05] font-mono truncate max-w-[140px]">
                          {badge.credentialId}
                        </span>
                        <button
                          onClick={(e) => handleCopyCredentialId(badge.credentialId, e)}
                          className="text-[#8e9199] hover:text-white p-1 rounded hover:bg-[#21232b] cursor-pointer"
                          title="Copy Credly ID"
                        >
                          <i className={copiedId === badge.credentialId ? 'ri-check-line text-[#a8e6cf]' : 'ri-file-copy-line text-xs'}></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#44474f]/20">
                    <a
                      href={badge.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="w-full py-2 px-3 rounded-xl bg-[#5a4300]/40 hover:bg-[#5a4300]/70 text-xs font-bold text-[#ffe088] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#fbbc05]/30"
                    >
                      <i className="ri-shield-check-line text-xs text-[#fbbc05]"></i>
                      <span>Credly</span>
                      <i className="ri-external-link-line text-[10px] opacity-70"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
