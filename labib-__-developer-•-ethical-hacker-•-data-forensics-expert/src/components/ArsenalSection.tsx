import React, { useState } from 'react';
import { SKILLS_DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';

export const ArsenalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'offsec' | 'dfir' | 'fullstack' | 'crypto'>('all');

  const filteredSkills = SKILLS_DATA.filter((skill) => {
    if (activeTab === 'all') return true;
    return skill.category === activeTab;
  });

  return (
    <section id="skills" className="py-16 md:py-24 border-b border-white/10 bg-[#0f0e13] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="text-xs font-mono text-[#a8c7fa] tracking-wider uppercase">Technical Competencies</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Skill Arsenal & Technical Stack
          </h2>
        </div>

        {/* Category Tabs - Material 3 Segmented Pill Row */}
        <div className="flex items-center gap-2 mb-10 text-xs font-medium overflow-x-auto pb-2 scrollbar-none flex-nowrap sm:flex-wrap w-full">
          {[
            { id: 'all', label: 'ALL ARSENAL', icon: 'ri-apps-2-line' },
            { id: 'offsec', label: 'OFFSEC & PENTESTING', icon: 'ri-shield-keyhole-line' },
            { id: 'dfir', label: 'DFIR & REVERSE ENG', icon: 'ri-search-eye-line' },
            { id: 'fullstack', label: 'FULL-STACK & CLOUD', icon: 'ri-flashlight-line' },
            { id: 'crypto', label: 'CRYPTO & PROTOCOLS', icon: 'ri-lock-2-line' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'all' | 'offsec' | 'dfir' | 'fullstack' | 'crypto');
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

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-4 hover:border-[#a8c7fa] transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-3">
                {/* Top Row: Icon + Level Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-[#004a77]/20 border border-[#a8c7fa]/30 flex items-center justify-center text-[#a8c7fa] text-xl group-hover:scale-105 transition-transform">
                    <i className={skill.icon}></i>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#00522b]/30 border border-[#a8e6cf]/30 text-[11px] font-mono font-semibold text-[#c6f6d5]">
                    {skill.level}% {skill.levelLabel}
                  </span>
                </div>

                {/* Skill Title */}
                <h3 className="text-base font-bold text-white">
                  {skill.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#a8aab3] leading-relaxed font-sans">
                  {skill.description}
                </p>
              </div>

              {/* Progress Bar & Footer */}
              <div className="space-y-2.5 pt-3 border-t border-[#44474f]/30">
                <div className="w-full bg-[#0f0e13] rounded-full h-2 overflow-hidden border border-[#44474f]/30">
                  <div
                    className="bg-gradient-to-r from-[#004a77] via-[#386a99] to-[#a8c7fa] h-full rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#8e9199]">
                  <span>EXP: {skill.expYears}</span>
                  <span className="text-[#a8c7fa] truncate max-w-[160px]" title={skill.command}>
                    {skill.command}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
