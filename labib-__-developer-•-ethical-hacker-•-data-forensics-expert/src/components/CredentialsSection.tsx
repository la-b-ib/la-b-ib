import React, { useState, useMemo } from 'react';
import {
  PROFILES_DATA,
  CERTIFICATIONS_DATA,
  BADGES_DATA,
  EDUCATION_DATA,
  THESIS_DATA,
  PUBLICATIONS_DATA,
  HONORS_DATA,
  ORGANIZATIONS_DATA,
} from '../data/portfolioData';
import { Credential, VerifiedBadge } from '../types';
import { soundEngine } from '../utils/soundEngine';

type SectionTab = 'certifications' | 'badges' | 'academic' | 'publications';
type CategoryFilter = 'all' | 'cybersecurity' | 'cloud' | 'automation' | 'analytics';
type SortOption = 'featured' | 'issuer' | 'title';

export const CredentialsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SectionTab>('certifications');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [inspectedItem, setInspectedItem] = useState<{
    type: 'cert' | 'badge' | 'pub';
    data: any;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique issuers for quick filtering
  const allIssuers = useMemo(() => {
    const issuers = new Set<string>();
    CERTIFICATIONS_DATA.forEach((c) => issuers.add(c.issuer));
    return ['all', ...Array.from(issuers)];
  }, []);

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

  // Filtered and sorted certifications
  const filteredCertifications = useMemo(() => {
    return CERTIFICATIONS_DATA.filter((cert) => {
      const matchesCategory = activeCategory === 'all' || cert.category === activeCategory;
      const matchesIssuer = selectedIssuer === 'all' || cert.issuer === selectedIssuer;
      const matchesSearch =
        searchQuery.trim() === '' ||
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesIssuer && matchesSearch;
    }).sort((a, b) => {
      if (sortOption === 'issuer') return a.issuer.localeCompare(b.issuer);
      if (sortOption === 'title') return a.title.localeCompare(b.title);
      return 0; // Default order
    });
  }, [activeCategory, selectedIssuer, searchQuery, sortOption]);

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
    <section id="certificates" className="py-12 md:py-20 border-b-0 bg-[#0f0e13] relative scroll-mt-28 text-white font-mono">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-8">
        
        {/* TOP SECTION HEADER */}
        <div className="border-b border-[#44474f]/30 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#a8c7fa] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
              <span>VERIFIED CRYPTOGRAPHIC CREDENTIALS & ACADEMIA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Credentials & Accreditations
            </h2>
            <p className="text-xs text-[#c4c6d0] max-w-2xl leading-relaxed">
              Official university degrees, IEEE peer-reviewed research publications, Credly-verified security badges, and proctored industry certifications.
            </p>
          </div>

          {/* Quick Stats Ticker */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
            <div className="bg-[#1a1b21] border border-[#44474f]/40 px-3 py-2 rounded-xl text-center min-w-[72px]">
              <div className="text-[10px] text-[#8e9199] font-semibold uppercase">Certs</div>
              <div className="text-base font-bold text-[#a8c7fa]">{CERTIFICATIONS_DATA.length}</div>
            </div>
            <div className="bg-[#1a1b21] border border-[#44474f]/40 px-3 py-2 rounded-xl text-center min-w-[72px]">
              <div className="text-[10px] text-[#8e9199] font-semibold uppercase">Badges</div>
              <div className="text-base font-bold text-[#fbbc05]">{BADGES_DATA.length}</div>
            </div>
            <div className="bg-[#1a1b21] border border-[#44474f]/40 px-3 py-2 rounded-xl text-center min-w-[72px]">
              <div className="text-[10px] text-[#8e9199] font-semibold uppercase">Papers</div>
              <div className="text-base font-bold text-[#a8e6cf]">{PUBLICATIONS_DATA.length}</div>
            </div>
            <div className="bg-[#1a1b21] border border-[#44474f]/40 px-3 py-2 rounded-xl text-center min-w-[72px]">
              <div className="text-[10px] text-[#8e9199] font-semibold uppercase">CGPA</div>
              <div className="text-base font-bold text-[#d0bcff]">3.58</div>
            </div>
          </div>
        </div>

        {/* PRIMARY VIEW NAVIGATION TABS */}
        <div className="bg-[#1a1b21] p-1.5 rounded-2xl border border-[#44474f]/40 flex flex-wrap sm:flex-nowrap items-center gap-1.5 shadow-md">
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

          <button
            onClick={() => {
              setActiveTab('academic');
              soundEngine.play('click');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'academic'
                ? 'bg-[#a8e6cf] text-[#003923] shadow'
                : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
            }`}
          >
            <i className="ri-graduation-cap-line text-sm"></i>
            <span className="truncate">Academia & Thesis</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('publications');
              soundEngine.play('click');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'publications'
                ? 'bg-[#d0bcff] text-[#381e72] shadow'
                : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
            }`}
          >
            <i className="ri-article-line text-sm"></i>
            <span className="truncate">Papers & Profiles</span>
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

                {/* Issuer Selector + Sort & View Controls */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Issuer Dropdown Filter */}
                  <select
                    value={selectedIssuer}
                    onChange={(e) => {
                      setSelectedIssuer(e.target.value);
                      soundEngine.play('click');
                    }}
                    className="bg-[#0f0e13] border border-[#44474f]/40 text-xs text-[#c4c6d0] rounded-xl px-3 py-2 outline-none focus:border-[#a8c7fa] cursor-pointer"
                  >
                    <option value="all">All Issuers ({allIssuers.length - 1})</option>
                    {allIssuers.filter((i) => i !== 'all').map((issuer) => (
                      <option key={issuer} value={issuer}>
                        {issuer}
                      </option>
                    ))}
                  </select>

                  {/* Sort Selector */}
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value as SortOption);
                      soundEngine.play('click');
                    }}
                    className="bg-[#0f0e13] border border-[#44474f]/40 text-xs text-[#c4c6d0] rounded-xl px-3 py-2 outline-none focus:border-[#a8c7fa] cursor-pointer"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="issuer">Sort: Issuer (A-Z)</option>
                    <option value="title">Sort: Title (A-Z)</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-[#0f0e13] p-1 rounded-xl border border-[#44474f]/40">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        viewMode === 'grid' ? 'bg-[#a8c7fa] text-[#001d35]' : 'text-[#8e9199] hover:text-white'
                      }`}
                      title="Grid View"
                    >
                      <i className="ri-grid-fill text-xs"></i>
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        viewMode === 'compact' ? 'bg-[#a8c7fa] text-[#001d35]' : 'text-[#8e9199] hover:text-white'
                      }`}
                      title="Compact List View"
                    >
                      <i className="ri-list-check text-xs"></i>
                    </button>
                  </div>
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
            <div className="flex items-center justify-between text-xs text-[#8e9199] px-1">
              <span>
                Showing <strong className="text-white">{filteredCertifications.length}</strong> of {CERTIFICATIONS_DATA.length} accredited certificates
              </span>
              {(searchQuery || activeCategory !== 'all' || selectedIssuer !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setSelectedIssuer('all');
                    soundEngine.play('click');
                  }}
                  className="text-[#a8c7fa] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <i className="ri-refresh-line text-xs"></i> Reset Filters
                </button>
              )}
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
                    setSelectedIssuer('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#a8c7fa] text-[#001d35] text-xs font-bold mt-2 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
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

                      {/* Credential ID if present */}
                      {cert.credentialId && (
                        <div className="pt-2 border-t border-[#44474f]/30 flex items-center justify-between text-[10px]">
                          <span className="text-[#8e9199]">ID:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#a8c7fa] font-mono truncate max-w-[140px]">
                              {cert.credentialId}
                            </span>
                            <button
                              onClick={(e) => handleCopyCredentialId(cert.credentialId!, e)}
                              className="text-[#8e9199] hover:text-white p-1 rounded hover:bg-[#21232b] cursor-pointer"
                              title="Copy ID"
                            >
                              <i className={copiedId === cert.credentialId ? 'ri-check-line text-[#a8e6cf]' : 'ri-file-copy-line text-xs'}></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#44474f]/20 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setInspectedItem({ type: 'cert', data: cert });
                          soundEngine.play('click');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#21232b] hover:bg-[#2b2d36] text-xs font-bold text-[#c4c6d0] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#44474f]/30"
                      >
                        <i className="ri-eye-line text-xs"></i>
                        <span>Inspect</span>
                      </button>

                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEngine.play('click')}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#004a77] hover:bg-[#005a91] text-xs font-bold text-[#c2e7ff] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#a8c7fa]/30"
                      >
                        <i className="ri-checkbox-circle-line text-xs"></i>
                        <span>Verify</span>
                        <i className="ri-external-link-line text-[10px] opacity-70"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Compact List View */
              <div className="space-y-3">
                {filteredCertifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-4 hover:border-[#a8c7fa] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#004a77]/30 border border-[#a8c7fa]/30 flex items-center justify-center text-[#a8c7fa] text-lg shrink-0">
                        <i className={cert.icon}></i>
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white group-hover:text-[#a8c7fa] transition-colors truncate">
                            {cert.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#21232b] text-[#a8c7fa] border border-[#44474f]/40">
                            {cert.issuer}
                          </span>
                        </div>
                        <p className="text-xs text-[#a8aab3] font-sans truncate">
                          {cert.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {cert.credentialId && (
                        <button
                          onClick={(e) => handleCopyCredentialId(cert.credentialId!, e)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#21232b] text-[#8e9199] hover:text-white text-[11px] flex items-center gap-1 border border-[#44474f]/30 cursor-pointer"
                          title="Copy Credential ID"
                        >
                          <i className={copiedId === cert.credentialId ? 'ri-check-line text-[#a8e6cf]' : 'ri-file-copy-line'}></i>
                          <span className="hidden md:inline">ID</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setInspectedItem({ type: 'cert', data: cert });
                          soundEngine.play('click');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#21232b] text-[#c4c6d0] hover:text-white text-xs font-bold border border-[#44474f]/30 cursor-pointer"
                      >
                        Details
                      </button>
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEngine.play('click')}
                        className="px-3 py-1.5 rounded-lg bg-[#004a77] text-[#c2e7ff] hover:bg-[#005a91] text-xs font-bold border border-[#a8c7fa]/30 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Verify</span>
                        <i className="ri-external-link-line text-[10px]"></i>
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

                  <div className="pt-3 border-t border-[#44474f]/20 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setInspectedItem({ type: 'badge', data: badge });
                        soundEngine.play('click');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#21232b] hover:bg-[#2b2d36] text-xs font-bold text-[#c4c6d0] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#44474f]/30"
                    >
                      <i className="ri-eye-line text-xs"></i>
                      <span>Inspect</span>
                    </button>

                    <a
                      href={badge.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#5a4300]/40 hover:bg-[#5a4300]/70 text-xs font-bold text-[#ffe088] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#fbbc05]/30"
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

        {/* TAB 3: ACADEMIA, THESIS & HONORS */}
        {activeTab === 'academic' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Degree Card */}
              <div className="lg:col-span-7 bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-6 shadow-md hover:border-[#a8c7fa] transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#44474f]/30 pb-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#004a77]/30 border border-[#a8c7fa]/40 flex items-center justify-center text-[#a8c7fa] text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      <i className="ri-government-line"></i>
                    </div>
                    <div>
                      <span className="px-3 py-0.5 rounded-full bg-[#004a77]/30 text-[#c2e7ff] border border-[#a8c7fa]/30 text-[10px] font-bold">
                        UNDERGRADUATE DEGREE
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#a8c7fa] transition-colors mt-1">
                        {EDUCATION_DATA.institution}
                      </h3>
                      <p className="text-xs text-[#c4c6d0] font-semibold">
                        {EDUCATION_DATA.degree}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end text-xs">
                    <span className="px-3 py-1 rounded-full bg-[#21232b] border border-[#44474f]/40 text-[#a8e6cf] font-medium">
                      {EDUCATION_DATA.duration}
                    </span>
                    <span className="text-[11px] text-[#8e9199] mt-1 flex items-center gap-1">
                      <i className="ri-map-pin-line text-[#a8c7fa]"></i>
                      {EDUCATION_DATA.locationCoords}
                    </span>
                  </div>
                </div>

                {/* CGPA & Academic Standing Meter */}
                <div className="bg-[#0f0e13] p-4 rounded-xl border border-[#44474f]/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8e9199] flex items-center gap-1.5 font-bold">
                      <i className="ri-trophy-line text-[#fbbc05]"></i> CUMULATIVE GPA (US SCALE):
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-[#00522b]/40 text-[#c6f6d5] font-bold border border-[#a8e6cf]/40 text-xs">
                      {EDUCATION_DATA.cgpa}
                    </span>
                  </div>
                  {/* Progress Meter Bar */}
                  <div className="w-full h-2 bg-[#21232b] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#a8c7fa] via-[#a8e6cf] to-[#c6f6d5] rounded-full" style={{ width: '89.5%' }}></div>
                  </div>
                </div>

                {/* Core Coursework */}
                <div className="space-y-2.5">
                  <div className="text-xs text-[#8e9199] font-bold flex items-center gap-1.5">
                    <i className="ri-book-open-line text-[#a8c7fa]"></i> CORE RIGOROUS COURSEWORK:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {EDUCATION_DATA.coreCoursework.map((course, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#21232b] text-[#c4c6d0] border border-[#44474f]/40 hover:border-[#a8c7fa] hover:text-white transition-colors"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Thesis & Awards Right Column */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                {/* Thesis Card */}
                <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-4 shadow-md hover:border-[#d0bcff] transition-all group flex-1">
                  <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
                    <span className="px-3 py-0.5 rounded-full bg-[#381e72]/40 text-[#e8def8] border border-[#d0bcff]/40 text-[10px] font-bold flex items-center gap-1">
                      <i className="ri-flask-line"></i> {THESIS_DATA.type}
                    </span>
                    <span className="text-[11px] text-[#d0bcff] font-bold">RESEARCH THESIS</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white group-hover:text-[#d0bcff] transition-colors leading-snug">
                      "{THESIS_DATA.title}"
                    </h4>
                    <p className="text-xs text-[#a8aab3] font-sans leading-relaxed">
                      {THESIS_DATA.summary}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-[10px] text-[#8e9199]">
                    <span className="px-2 py-0.5 rounded bg-[#21232b] text-[#d0bcff]">Adversarial ML</span>
                    <span className="px-2 py-0.5 rounded bg-[#21232b] text-[#a8e6cf]">Malware Heuristics</span>
                    <span className="px-2 py-0.5 rounded bg-[#21232b] text-[#a8c7fa]">Classification</span>
                  </div>
                </div>

                {/* Honors & Awards Box */}
                <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-5 space-y-3 shadow-md hover:border-[#fbbc05] transition-all group">
                  <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-2.5">
                    <span className="text-xs font-bold text-[#fbbc05] flex items-center gap-1.5">
                      <i className="ri-medal-fill text-[#fbbc05] text-sm"></i> HONORS & AWARDS
                    </span>
                    <span className="text-[10px] text-[#8e9199]">INTERNATIONAL DISTINCTION</span>
                  </div>
                  {HONORS_DATA.map((award) => (
                    <div key={award.id} className="flex items-center justify-between text-xs">
                      <div>
                        <div className="text-white font-bold">{award.title}</div>
                        <div className="text-[10px] text-[#8e9199]">{award.issuer}</div>
                      </div>
                      <span className="text-[#fbbc05] font-bold text-[10px] px-2.5 py-1 rounded-full bg-[#fbbc05]/10 border border-[#fbbc05]/30">
                        GOLD MEDAL
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Organizations & Clubs */}
            <div className="space-y-4 pt-4 border-t border-[#44474f]/30">
              <div className="flex items-center space-x-2 text-xs text-[#d0bcff] uppercase tracking-widest">
                <i className="ri-team-line text-lg text-[#d0bcff]"></i>
                <span>ORGANIZATIONS, SOCIETIES & CLUBS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ORGANIZATIONS_DATA.map((group, idx) => (
                  <div key={idx} className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-5 space-y-3 shadow-md">
                    <h4 className="text-xs font-bold text-[#a8e6cf] uppercase border-b border-[#44474f]/30 pb-2 flex items-center gap-2">
                      <i className="ri-checkbox-circle-fill text-[#a8e6cf]"></i> {group.category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="px-2.5 py-1 rounded-lg text-xs bg-[#21232b] text-[#c4c6d0] border border-[#44474f]/40"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PUBLICATIONS & PROFILES */}
        {activeTab === 'publications' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Conference Publications */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs text-[#a8c7fa] uppercase tracking-widest">
                <i className="ri-article-line text-lg text-[#a8c7fa]"></i>
                <span>PEER-REVIEWED IEEE CONFERENCE PUBLICATIONS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PUBLICATIONS_DATA.map((pub) => (
                  <div
                    key={pub.id}
                    className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-4 hover:border-[#a8c7fa] transition-all flex flex-col justify-between group shadow-md relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
                        <span className="px-3 py-0.5 rounded-full bg-[#004a77]/40 border border-[#a8c7fa]/40 text-[#c2e7ff] text-[10px] font-bold">
                          IEEE INDEXED CONFERENCE
                        </span>
                        <span className="text-xs text-[#8e9199] flex items-center gap-1">
                          <i className="ri-calendar-event-line text-[#a8c7fa]"></i>
                          {pub.date}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-[#a8c7fa] transition-colors leading-snug">
                        {pub.title}
                      </h3>

                      <div className="space-y-1.5 text-xs text-[#c4c6d0] pt-1">
                        <p className="text-[#a8e6cf] font-semibold flex items-center gap-1">
                          <i className="ri-building-2-line"></i> {pub.conference}
                        </p>
                        <p className="text-[#8e9199] flex items-center gap-1 text-[11px]">
                          <i className="ri-map-pin-2-line text-[#f2b8b5]"></i> Location: {pub.location}
                        </p>
                        <p className="text-[#8e9199] text-[11px]">
                          Electronic ISBN: <span className="text-white font-bold">{pub.isbn}</span>
                        </p>
                      </div>
                    </div>

                    <a
                      href={pub.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="py-2.5 px-4 rounded-xl bg-[#004a77] hover:bg-[#005a91] text-xs font-bold text-[#c2e7ff] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#a8c7fa]/30 mt-2"
                    >
                      <i className="ri-file-list-3-line text-sm"></i>
                      <span>VIEW IEEE XPLORE DOI PAPER</span>
                      <i className="ri-external-link-line text-xs opacity-70"></i>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Research & Credential Profiles */}
            <div className="space-y-4 pt-4 border-t border-[#44474f]/30">
              <div className="flex items-center space-x-2 text-xs text-[#8e9199] uppercase tracking-widest">
                <i className="ri-user-verified-line text-[#a8e6cf] text-lg"></i>
                <span>VERIFIED RESEARCH & CREDENTIAL PORTALS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROFILES_DATA.map((profile) => (
                  <a
                    key={profile.name}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.play('click')}
                    className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-5 hover:border-[#a8c7fa] transition-all flex items-start justify-between group shadow-md"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#004a77]/30 border border-[#a8c7fa]/30 flex items-center justify-center text-[#a8c7fa] text-xl group-hover:scale-105 transition-transform shrink-0">
                        <i className={profile.icon}></i>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white group-hover:text-[#a8c7fa] transition-colors">
                            {profile.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-[#00522b]/30 text-[#c6f6d5] border border-[#a8e6cf]/30 text-[9px] font-bold">
                            {profile.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8e9199]">
                          {profile.platform}
                        </p>
                        <p className="text-xs text-[#a8aab3] font-sans line-clamp-2 pt-0.5">
                          {profile.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-[#8e9199] group-hover:text-[#a8c7fa] transition-colors shrink-0 pl-2">
                      <i className="ri-external-link-line text-base"></i>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* CREDENTIAL DETAIL INSPECTION MODAL */}
      {inspectedItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1a1b21] border border-[#44474f] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#44474f]/40 pb-4">
              <div className="flex items-center gap-2 text-xs text-[#a8c7fa] font-bold uppercase tracking-wider">
                <i className="ri-shield-check-line text-base text-[#a8e6cf]"></i>
                <span>Verified Credential Record</span>
              </div>
              <button
                onClick={() => {
                  setInspectedItem(null);
                  soundEngine.play('click');
                }}
                className="w-8 h-8 rounded-full bg-[#21232b] hover:bg-[#2b2d36] text-[#c4c6d0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-base"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#004a77]/40 border border-[#a8c7fa]/40 flex items-center justify-center text-[#a8c7fa] text-2xl shrink-0">
                  <i className={inspectedItem.data.icon || 'ri-shield-star-line'}></i>
                </div>
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#21232b] border border-[#44474f]/40 text-[#a8c7fa]">
                    {inspectedItem.data.issuer}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {inspectedItem.data.title}
                  </h3>
                  {inspectedItem.data.status && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#00522b]/40 text-[#a8e6cf] border border-[#a8e6cf]/40">
                      {inspectedItem.data.status}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#c4c6d0] font-sans leading-relaxed bg-[#0f0e13] p-4 rounded-xl border border-[#44474f]/30">
                {inspectedItem.data.description}
              </p>

              {/* Credential ID row if exists */}
              {inspectedItem.data.credentialId && (
                <div className="bg-[#0f0e13] p-3 rounded-xl border border-[#44474f]/30 flex items-center justify-between text-xs">
                  <span className="text-[#8e9199]">AUTHENTICATION ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#a8c7fa] font-mono font-bold text-xs truncate max-w-[200px]">
                      {inspectedItem.data.credentialId}
                    </span>
                    <button
                      onClick={(e) => handleCopyCredentialId(inspectedItem.data.credentialId, e)}
                      className="px-2 py-1 rounded bg-[#21232b] hover:bg-[#2b2d36] text-[#8e9199] hover:text-white text-xs cursor-pointer"
                      title="Copy ID"
                    >
                      <i className={copiedId === inspectedItem.data.credentialId ? 'ri-check-line text-[#a8e6cf]' : 'ri-file-copy-line'}></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setInspectedItem(null);
                  soundEngine.play('click');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#21232b] hover:bg-[#2b2d36] text-xs font-bold text-[#c4c6d0] hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>

              <a
                href={inspectedItem.data.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.play('click')}
                className="flex-1 py-2.5 rounded-xl bg-[#004a77] hover:bg-[#005a91] text-xs font-bold text-[#c2e7ff] transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#a8c7fa]/30"
              >
                <i className="ri-checkbox-circle-line text-sm"></i>
                <span>Open Verification Page</span>
                <i className="ri-external-link-line text-xs opacity-70"></i>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
