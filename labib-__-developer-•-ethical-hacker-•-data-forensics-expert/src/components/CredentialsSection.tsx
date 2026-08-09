import React, { useState } from 'react';
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
import { soundEngine } from '../utils/soundEngine';

type CategoryFilter = 'all' | 'cybersecurity' | 'cloud' | 'automation' | 'analytics';

export const CredentialsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeTab, setActiveTab] = useState<'certifications' | 'badges'>('certifications');

  const categories: { id: CategoryFilter; label: string; icon: string; count: number }[] = [
    { id: 'all', label: 'ALL CREDENTIALS', icon: 'ri-apps-2-line', count: CERTIFICATIONS_DATA.length },
    {
      id: 'cybersecurity',
      label: 'CYBERSECURITY & FORENSICS',
      icon: 'ri-shield-keyhole-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'cybersecurity').length,
    },
    {
      id: 'cloud',
      label: 'SOFTWARE & CLOUD',
      icon: 'ri-code-box-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'cloud').length,
    },
    {
      id: 'automation',
      label: 'AUTOMATION & APIS',
      icon: 'ri-robot-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'automation').length,
    },
    {
      id: 'analytics',
      label: 'DATA & STRATEGY',
      icon: 'ri-bar-chart-box-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'analytics').length,
    },
  ];

  const filteredCerts =
    activeCategory === 'all'
      ? CERTIFICATIONS_DATA
      : CERTIFICATIONS_DATA.filter((c) => c.category === activeCategory);

  return (
    <section id="certificates" className="py-16 md:py-24 border-b border-white/10 bg-[#0f0e13] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-[#a8c7fa] tracking-wider uppercase">Academic & Verified Credentials</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Education, Publications & Industry Certifications
          </h2>
        </div>

        {/* 1. ACADEMIC EDUCATION & THESIS GRID */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#a8c7fa] uppercase tracking-widest">
            <i className="ri-graduation-cap-line text-lg text-[#a8c7fa]"></i>
            <span>ACADEMIC BACKGROUND & THESIS RESEARCH</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Education Main Card */}
            <div className="lg:col-span-7 bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-5 shadow-md hover:border-[#a8c7fa] transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#44474f]/30 pb-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#004a77]/30 border border-[#a8c7fa]/40 flex items-center justify-center text-[#a8c7fa] text-2xl shrink-0 group-hover:scale-105 transition-transform">
                    <i className="ri-government-line"></i>
                  </div>
                  <div>
                    <span className="px-3 py-0.5 rounded-full bg-[#004a77]/30 text-[#c2e7ff] border border-[#a8c7fa]/30 text-[10px] font-mono font-semibold">
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

                <div className="flex flex-col items-start sm:items-end font-mono text-xs">
                  <span className="px-3 py-1 rounded-full bg-[#21232b] border border-[#44474f]/40 text-[#a8e6cf] font-medium">
                    {EDUCATION_DATA.duration}
                  </span>
                  <span className="text-[11px] text-[#8e9199] mt-1 flex items-center gap-1">
                    <i className="ri-map-pin-line text-[#a8c7fa]"></i>
                    {EDUCATION_DATA.locationCoords}
                  </span>
                </div>
              </div>

              {/* CGPA Badge */}
              <div className="flex items-center justify-between bg-[#0f0e13] p-3 rounded-xl border border-[#44474f]/30 text-xs font-mono">
                <span className="text-[#8e9199] flex items-center gap-1.5">
                  <i className="ri-trophy-line text-[#fbbc05]"></i> ACADEMIC STANDING (CGPA):
                </span>
                <span className="px-3 py-0.5 rounded-full bg-[#00522b]/30 text-[#c6f6d5] font-bold border border-[#a8e6cf]/30">
                  {EDUCATION_DATA.cgpa}
                </span>
              </div>

              {/* Core Coursework */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-mono text-[#8e9199] font-medium flex items-center gap-1.5">
                  <i className="ri-book-open-line text-[#a8c7fa]"></i> CORE COURSEWORK:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EDUCATION_DATA.coreCoursework.map((course, idx) => (
                    <span
                      key={idx}
                      className="m3-chip"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Thesis Card & Honors */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              {/* Thesis Card */}
              <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-4 shadow-md hover:border-[#d0bcff] transition-all group flex-1">
                <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
                  <span className="px-3 py-0.5 rounded-full bg-[#4a2800]/30 text-[#d0bcff] border border-[#d0bcff]/30 text-[10px] font-mono font-semibold flex items-center gap-1">
                    <i className="ri-flask-line"></i> {THESIS_DATA.type}
                  </span>
                  <span className="text-[11px] font-mono text-[#d0bcff] font-semibold">RESEARCH THESIS</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white group-hover:text-[#d0bcff] transition-colors leading-snug">
                    "{THESIS_DATA.title}"
                  </h4>
                  <p className="text-xs text-[#a8aab3] font-sans leading-relaxed">
                    {THESIS_DATA.summary}
                  </p>
                </div>
              </div>

              {/* Honors & Awards Box */}
              <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-5 space-y-3 shadow-md hover:border-[#fbbc05] transition-all group">
                <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-2.5">
                  <span className="text-xs font-mono font-bold text-[#fbbc05] flex items-center gap-1.5">
                    <i className="ri-medal-fill text-[#fbbc05] text-sm"></i> HONORS & AWARDS
                  </span>
                  <span className="text-[10px] font-mono text-[#8e9199]">GOLD MEDALIST</span>
                </div>
                {HONORS_DATA.map((award) => (
                  <div key={award.id} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-semibold">{award.title}</span>
                    <span className="text-[#fbbc05] font-semibold text-[11px] px-2.5 py-0.5 rounded-full bg-[#fbbc05]/10 border border-[#fbbc05]/30">
                      INTERNATIONAL AWARD
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. CONFERENCE PUBLICATIONS */}
        <div className="space-y-4 pt-4 border-t border-[#44474f]/30">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#a8c7fa] uppercase tracking-widest">
            <i className="ri-article-line text-lg text-[#a8c7fa]"></i>
            <span>PEER-REVIEWED CONFERENCE PUBLICATIONS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PUBLICATIONS_DATA.map((pub) => (
              <div
                key={pub.id}
                className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-4 hover:border-[#a8c7fa] transition-all flex flex-col justify-between group shadow-md relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
                    <span className="px-3 py-0.5 rounded-full bg-[#004a77]/30 border border-[#a8c7fa]/30 text-[#c2e7ff] font-mono text-[10px] font-semibold">
                      IEEE INDEXED CONFERENCE
                    </span>
                    <span className="text-xs font-mono text-[#8e9199] flex items-center gap-1">
                      <i className="ri-calendar-event-line text-[#a8c7fa]"></i>
                      {pub.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#a8c7fa] transition-colors leading-snug">
                    {pub.title}
                  </h3>

                  <div className="space-y-1.5 text-xs font-mono text-[#c4c6d0] pt-1">
                    <p className="text-[#a8e6cf] font-semibold flex items-center gap-1">
                      <i className="ri-building-2-line"></i> {pub.conference}
                    </p>
                    <p className="text-[#8e9199] flex items-center gap-1 text-[11px]">
                      <i className="ri-map-pin-2-line text-[#8e9199]"></i> Location: {pub.location}
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
                  className="m3-btn-tonal w-full justify-center text-xs mt-4"
                >
                  <i className="ri-file-list-3-line text-sm"></i>
                  <span>VIEW IEEE XPLORE DOI PAPER</span>
                  <i className="ri-external-link-line text-xs opacity-70"></i>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 3. ORGANIZATIONS, SOCIETIES & CLUBS */}
        <div className="space-y-4 pt-4 border-t border-[#44474f]/30">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#d0bcff] uppercase tracking-widest">
            <i className="ri-team-line text-lg text-[#d0bcff]"></i>
            <span>ORGANIZATIONS, SOCIETIES & CLUBS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ORGANIZATIONS_DATA.map((group, idx) => (
              <div key={idx} className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-4 shadow-md">
                <h4 className="text-sm font-bold text-[#a8e6cf] uppercase border-b border-[#44474f]/30 pb-2 flex items-center gap-2">
                  <i className="ri-checkbox-circle-fill text-[#a8e6cf]"></i> {group.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="m3-chip"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. VERIFIED RESEARCH & CREDENTIAL PROFILES */}
        <div className="space-y-4 pt-4 border-t border-[#44474f]/30">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8e9199] uppercase tracking-widest">
            <i className="ri-user-verified-line text-[#a8e6cf] text-lg"></i>
            <span>RESEARCH & CREDENTIAL PROFILES</span>
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
                <div className="flex items-start space-x-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#004a77]/30 border border-[#a8c7fa]/30 flex items-center justify-center text-[#a8c7fa] text-xl group-hover:scale-105 transition-transform shrink-0">
                    <i className={profile.icon}></i>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-sm font-bold text-white group-hover:text-[#a8c7fa] transition-colors">
                        {profile.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#00522b]/30 text-[#c6f6d5] border border-[#a8e6cf]/30 text-[9px] font-mono font-semibold">
                        {profile.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#8e9199]">
                      {profile.platform}
                    </p>
                    <p className="text-xs text-[#a8aab3] font-sans line-clamp-2 pt-0.5">
                      {profile.description}
                    </p>
                  </div>
                </div>
                <div className="text-[#8e9199] group-hover:text-[#a8c7fa] transition-colors shrink-0">
                  <i className="ri-external-link-line text-base"></i>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 5. SECTION TABS: CERTIFICATIONS VS BADGES */}
        <div className="pt-8 border-t border-[#44474f]/30 space-y-6">
          <div className="border-b border-[#44474f]/30 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 bg-[#21232b] p-1.5 rounded-full border border-[#44474f]/50">
              <button
                onClick={() => {
                  setActiveTab('certifications');
                  soundEngine.play('click');
                }}
                className={`px-4 py-2 rounded-full font-medium text-xs transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'certifications'
                    ? 'bg-[#004a77] text-[#c2e7ff] font-semibold shadow-sm border border-[#a8c7fa]/40'
                    : 'text-[#c4c6d0] hover:text-white'
                }`}
              >
                <i className="ri-file-shield-line text-sm"></i>
                <span>PROFESSIONAL CERTIFICATIONS ({CERTIFICATIONS_DATA.length})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('badges');
                  soundEngine.play('click');
                }}
                className={`px-4 py-2 rounded-full font-medium text-xs transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'badges'
                    ? 'bg-[#004a77] text-[#c2e7ff] font-semibold shadow-sm border border-[#a8c7fa]/40'
                    : 'text-[#c4c6d0] hover:text-white'
                }`}
              >
                <i className="ri-verified-badge-line text-sm"></i>
                <span>VERIFIED BADGES ({BADGES_DATA.length})</span>
              </button>
            </div>

            {/* Category Filters (Visible when Certifications tab active) */}
            {activeTab === 'certifications' && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      soundEngine.play('click');
                    }}
                    className={`px-3 py-1.5 rounded-full font-medium text-[11px] flex items-center space-x-1.5 transition-all border cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#004a77] text-[#c2e7ff] border-[#a8c7fa]/40'
                        : 'bg-[#21232b] text-[#c4c6d0] border-[#44474f]/50 hover:bg-[#2b2d36] hover:text-white'
                    }`}
                  >
                    <i className={`${cat.icon} text-xs`}></i>
                    <span>{cat.label}</span>
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#1a1b21] text-[#8e9199]">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Categorized Certifications Grid */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-4 hover:border-[#a8c7fa] transition-all flex flex-col justify-between group shadow-md relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Header Row: Issuer Pill + Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#21232b] border border-[#44474f]/40 text-[#a8c7fa]">
                          <i className="ri-building-line text-xs mr-1 text-[#8e9199]"></i>
                          {cert.issuer}
                        </span>
                        {cert.status && (
                          <span className="px-3 py-0.5 rounded-full bg-[#00522b]/30 text-[#c6f6d5] border border-[#a8e6cf]/30 text-[10px] font-mono font-semibold">
                            {cert.status}
                          </span>
                        )}
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-start space-x-3 pt-1">
                        <div className="w-11 h-11 rounded-2xl bg-[#004a77]/30 border border-[#a8c7fa]/30 flex items-center justify-center text-[#a8c7fa] text-xl shrink-0 group-hover:scale-105 transition-transform">
                          <i className={cert.icon}></i>
                        </div>
                        <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#a8c7fa] transition-colors">
                          {cert.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#a8aab3] font-sans leading-relaxed pt-1">
                        {cert.description}
                      </p>

                      {/* Credential ID if present */}
                      {cert.credentialId && (
                        <div className="text-[11px] font-mono text-[#8e9199] pt-2 border-t border-[#44474f]/30 flex items-center justify-between">
                          <span>CREDENTIAL ID:</span>
                          <span className="text-[#a8c7fa] font-semibold">{cert.credentialId}</span>
                        </div>
                      )}
                    </div>

                    {/* Direct Link / Verify Button */}
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="m3-btn-tonal w-full justify-center text-xs mt-4"
                    >
                      <i className="ri-checkbox-circle-line text-sm"></i>
                      <span>VERIFY CREDENTIAL</span>
                      <i className="ri-external-link-line text-xs opacity-70"></i>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Badges Grid */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-[#8e9199] uppercase tracking-widest">
                  <i className="ri-verified-badge-line text-[#fbbc05]"></i>
                  <span>OFFICIAL DIGITAL BADGES (CREDLY & ISSUERS)</span>
                </div>
                <span className="text-xs font-mono text-[#a8e6cf] font-semibold">
                  {BADGES_DATA.length} VERIFIED BADGES
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BADGES_DATA.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-4 hover:border-[#fbbc05] transition-all flex flex-col justify-between group shadow-md relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Header Row: Issuer + Issue Date */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#fbbc05]/10 border border-[#fbbc05]/30 text-[#fbbc05]">
                          <i className="ri-award-line text-xs mr-1"></i>
                          {badge.issuer}
                        </span>
                        <span className="text-[11px] font-mono text-[#8e9199]">
                          {badge.issueDate}
                        </span>
                      </div>

                      {/* Title & Badge Icon */}
                      <div className="flex items-start space-x-3 pt-1">
                        <div className="w-11 h-11 rounded-2xl bg-[#fbbc05]/10 border border-[#fbbc05]/30 flex items-center justify-center text-[#fbbc05] text-xl shrink-0 group-hover:scale-105 transition-transform">
                          <i className={badge.icon}></i>
                        </div>
                        <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#fbbc05] transition-colors">
                          {badge.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#a8aab3] font-sans leading-relaxed">
                        {badge.description}
                      </p>

                      {/* Credential ID */}
                      <div className="text-[10px] font-mono text-[#8e9199] pt-2 border-t border-[#44474f]/30 flex flex-col space-y-0.5">
                        <span className="text-[#8e9199]">CREDENTIAL ID:</span>
                        <span className="text-[#fbbc05] font-semibold break-all text-[11px]">
                          {badge.credentialId}
                        </span>
                      </div>
                    </div>

                    {/* Direct Link / Verify Button */}
                    <a
                      href={badge.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="m3-btn-tonal w-full justify-center text-xs mt-4"
                    >
                      <i className="ri-shield-check-line text-sm text-[#fbbc05]"></i>
                      <span>VERIFY BADGE ON CREDLY</span>
                      <i className="ri-external-link-line text-xs opacity-70"></i>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
