import React, { useState } from 'react';
import { MISSIONS_DATA, RECOMMENDATIONS_DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { CvSection } from './CvSection';

export const MissionsSection: React.FC = () => {
  return (
    <section id="experience" className="py-16 md:py-24 border-b border-white/10 bg-[#0f0e13] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="text-xs font-mono text-[#a8c7fa] tracking-wider uppercase">Career History & Missions</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Professional Experience
          </h2>
        </div>

        {/* Missions Cards Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MISSIONS_DATA.map((mission, index) => {
            const missionNumber = String(index + 1).padStart(2, '0');
            return (
              <div
                key={mission.id}
                className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 sm:p-7 space-y-5 hover:border-[#a8c7fa] transition-all relative overflow-hidden group shadow-md"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#44474f]/30 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="px-3 py-1 rounded-full bg-[#004a77]/30 border border-[#a8c7fa]/30 text-[#c2e7ff] font-mono text-[11px] font-semibold">
                        MISSION {missionNumber}
                      </span>
                      {mission.isCurrent && (
                        <span className="px-3 py-1 rounded-full bg-[#00522b]/30 text-[#c6f6d5] border border-[#a8e6cf]/30 text-[11px] font-mono font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34a853] animate-pulse"></span>
                          CURRENT ROLE
                        </span>
                      )}
                      <span className="text-xs font-mono text-[#8e9199] font-medium uppercase">
                        {mission.company}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#a8c7fa] transition-colors pt-1">
                      {mission.title}
                    </h3>

                    <div className="text-xs text-[#8e9199] flex items-center gap-1.5 pt-0.5">
                      <i className="ri-map-pin-2-line text-[#a8c7fa]"></i>
                      <span>{mission.location}</span>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-full bg-[#21232b] border border-[#44474f]/40 text-xs font-mono text-[#a8e6cf] font-medium self-start sm:self-center shrink-0 flex items-center gap-1.5">
                    <i className="ri-calendar-event-line text-[#a8e6cf]"></i>
                    <span>{mission.period}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-[#c4c6d0] leading-relaxed font-sans">
                  {mission.summary}
                </p>

                {/* Bullets List */}
                <ul className="space-y-2.5 text-xs text-[#c4c6d0] font-sans">
                  {mission.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 leading-relaxed group/item">
                      <i className="ri-shield-flash-line text-sm text-[#a8e6cf] shrink-0 mt-0.5 group-hover/item:text-[#a8c7fa] transition-colors"></i>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#44474f]/30">
                  {mission.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="m3-chip"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations & Endorsements Block */}
        <div className="mt-20 pt-12 border-t border-[#44474f]/30 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#a8e6cf] font-semibold uppercase tracking-wider bg-[#00522b]/30 px-3 py-1 rounded-full border border-[#a8e6cf]/30">
              <i className="ri-double-quotes-l text-sm"></i>
              <span>VERIFIED ENDORSEMENTS & RECOMMENDATIONS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Peer Endorsements
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECOMMENDATIONS_DATA.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-4 hover:border-[#a8c7fa] transition-all flex flex-col justify-between group shadow-md relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-[#a8c7fa] transition-colors">
                        {rec.name}
                      </h4>
                      <p className="text-xs text-[#a8e6cf] font-medium mt-0.5">
                        {rec.role}
                      </p>
                    </div>
                    {rec.linkedIn && (
                      <a
                        href={rec.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEngine.play('click')}
                        className="w-8 h-8 rounded-full bg-[#21232b] border border-[#44474f] flex items-center justify-center text-[#c4c6d0] hover:text-[#a8c7fa] hover:border-[#a8c7fa] transition-all shrink-0"
                        title="LinkedIn Profile"
                      >
                        <i className="ri-linkedin-box-fill text-lg"></i>
                      </a>
                    )}
                  </div>

                  <div className="relative pt-2">
                    <i className="ri-double-quotes-l text-2xl text-[#a8c7fa]/20 absolute -top-1 -left-1"></i>
                    <blockquote className="text-xs text-[#c4c6d0] font-sans leading-relaxed italic pl-4">
                      "{rec.quote}"
                    </blockquote>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#44474f]/30 flex items-center justify-between text-[11px] font-mono text-[#8e9199]">
                  <span className="flex items-center gap-1 text-[#a8e6cf] font-medium">
                    <i className="ri-checkbox-circle-fill"></i> VERIFIED ENDORSEMENT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CV Section */}
        <CvSection />
      </div>
    </section>
  );
};
