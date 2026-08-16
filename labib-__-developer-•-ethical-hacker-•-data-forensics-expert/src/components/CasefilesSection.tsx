import React, { useState } from 'react';
import { CASEFILES_DATA } from '../data/portfolioData';
import { Casefile } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface CasefilesSectionProps {
  onInspectCasefile: (casefile: Casefile) => void;
}

export const CasefilesSection: React.FC = ({ onInspectCasefile }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'dfir' | 'offsec' | 'fullstack' | 'auth'>('all');

  const filteredCasefiles = CASEFILES_DATA.filter((file) => {
    if (activeTab === 'all') return true;
    return file.category === activeTab;
  });

  return (
    <section id="projects" className="py-16 md:py-24 border-b-0 bg-[#0f0e13] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="text-xs font-mono text-[#a8c7fa] tracking-wider uppercase">Engine Archives & Repositories</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Selected Open-Source Projects & Forensic Engines
          </h2>
        </div>

        {/* Filter Controls - Material 3 Segmented Pill Buttons */}
        <div className="flex items-center gap-2 mb-10 text-xs font-medium overflow-x-auto pb-2 scrollbar-none flex-nowrap sm:flex-wrap w-full">
          {[
            { id: 'all', label: 'ALL CASEFILES', icon: 'ri-folder-open-line' },
            { id: 'dfir', label: 'FORENSIC TOOLS', icon: 'ri-search-eye-line' },
            { id: 'offsec', label: 'OFFSEC & FUZZERS', icon: 'ri-shield-keyhole-line' },
            { id: 'fullstack', label: 'FULL-STACK PLATFORMS', icon: 'ri-flashlight-line' },
            { id: 'auth', label: 'ZERO-TRUST AUTH', icon: 'ri-lock-2-line' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'all' | 'dfir' | 'offsec' | 'fullstack' | 'auth');
                soundEngine.play('click');
              }}
              className={`px-4 py-2 rounded-full transition-all flex items-center space-x-2 cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#004a77] text-[#c2e7ff] font-semibold shadow-sm border border-[#a8c7fa]/40'
                  : 'bg-[#21232b] text-[#c4c6d0] border border-[#44474f]/50 hover:bg-[#2b2d36] hover:text-white'
              }`}
            >
              <i className={`${tab.icon} text-sm ${activeTab === tab.id ? 'text-[#a8c7fa]' : 'text-[#8e9199]'}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Casefiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCasefiles.map((file) => (
            <div
              key={file.id}
              className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-4 hover:border-[#a8c7fa] transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-3">
                {/* Top Row: Threat Badge + Case ID */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-0.5 rounded-full bg-[#60000e]/40 text-[#ffb4ab] border border-[#ffb4ab]/30 text-[10px] font-mono font-semibold">
                    {file.badge}
                  </span>
                  <span className="text-[11px] font-mono text-[#8e9199] font-medium">
                    {file.caseId}
                  </span>
                </div>

                {/* Case Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-[#a8c7fa] transition-colors">
                  {file.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-[#a8aab3] leading-relaxed font-sans">
                  {file.summary}
                </p>
              </div>

              {/* Tech Badges & Actions */}
              <div className="space-y-4 pt-3 border-t border-[#44474f]/30">
                <div className="flex flex-wrap gap-1.5">
                  {file.tech.slice(0, 4).map((t, idx) => (
                    <span
                      key={idx}
                      className="m3-chip"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => {
                      onInspectCasefile(file);
                      soundEngine.play('click');
                    }}
                    className="m3-btn-tonal flex-1 justify-center cursor-pointer text-xs"
                  >
                    <span>INSPECT CASEFILE</span>
                    <i className="ri-arrow-right-line text-sm"></i>
                  </button>

                  <a
                    href={file.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.play('click')}
                    className="w-10 h-10 rounded-full bg-[#21232b] hover:bg-[#2b2d36] border border-[#44474f] text-[#c4c6d0] hover:text-white flex items-center justify-center transition-colors shrink-0"
                    title="View GitHub Repository"
                  >
                    <i className="ri-github-line text-lg"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
