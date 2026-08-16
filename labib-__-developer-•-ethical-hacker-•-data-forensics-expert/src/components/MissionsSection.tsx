import React, { useState } from 'react';
import { MISSIONS_DATA, RECOMMENDATIONS_DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { CvSection } from './CvSection';

export const MissionsSection: React.FC = () => {
  // Track expanded state per mission (defaulting to false/closed)
  const [expandedMissions, setExpandedMissions] = useState<Record<string, boolean>>({});

  const toggleMission = (id: string) => {
    setExpandedMissions((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? true : !prev[id],
    }));
  };

  return (
    <section id="experience" className="pt-[15px] pb-0 px-[15px] border-b-0 bg-[#0f0e13] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-0">
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="text-xs font-mono text-[#a8c7fa] tracking-wider uppercase">Career History & Missions</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Leadership &amp; Volunteer Experience
          </h2>
        </div>

        {/* Missions Cards Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {MISSIONS_DATA.map((mission) => {
            const isExpanded = Boolean(expandedMissions[mission.id]);

            return (
              <div
                key={mission.id}
                className="space-y-4 relative overflow-hidden group"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#44474f]/30 pb-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <i className="ri-bank-line text-[#a8c7fa] text-2xl sm:text-3xl shrink-0"></i>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#a8c7fa]">
                        {mission.company}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base font-medium text-white">
                      {mission.title}
                    </p>

                    <div className="text-xs text-[#8e9199] flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 w-full">
                      <div className="flex items-center gap-1.5">
                        <i className="ri-map-pin-line text-[#c23616]"></i>
                        <span>{mission.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <i className="ri-calendar-todo-line text-[#44bd32]"></i>
                        <span>{mission.period}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.play('click');
                          toggleMission(mission.id);
                        }}
                        className="flex items-center gap-1.5 cursor-pointer focus:outline-none text-[#8e9199] ml-auto select-none"
                        title={isExpanded ? "Collapse details" : "Expand details"}
                        aria-expanded={isExpanded}
                      >
                        <i
                          className={`text-base text-[#ff793f] ${
                            isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
                          }`}
                        ></i>
                        <span className="text-[#8e9199]">{isExpanded ? 'Collapse' : 'Expand'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Content (Closed by default) */}
                {isExpanded && (
                  <div className="space-y-3 pt-1">
                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-[#c4c6d0] leading-relaxed font-sans">
                      {mission.summary}
                    </p>

                    {/* Bullets List */}
                    <ul className="space-y-2.5 text-xs text-[#c4c6d0] font-sans">
                      {mission.bullets.map((bullet, idx) => {
                        const colonIdx = bullet.indexOf(': ');
                        const hasPrefix = colonIdx !== -1;
                        const prefix = hasPrefix ? bullet.slice(0, colonIdx + 1) : '';
                        const body = hasPrefix ? bullet.slice(colonIdx + 1) : bullet;

                        return (
                          <li key={idx} className="flex items-start space-x-2.5 leading-relaxed group/item">
                            <i className="ri-arrow-right-circle-line text-sm text-[#a8c7fa] shrink-0 mt-0.5"></i>
                            <span>
                              {hasPrefix ? (
                                <>
                                  <strong className="text-white font-semibold">{prefix}</strong>
                                  {body}
                                </>
                              ) : (
                                bullet
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recommendations & Endorsements Block */}
        <div className="mt-[15px] pt-0 border-t border-[#44474f]/30 space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Peer Endorsements
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RECOMMENDATIONS_DATA.map((rec) => (
              <div
                key={rec.id}
                className="space-y-4 flex flex-col justify-between group relative py-2"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
                    <div className="flex items-center gap-3">
                      {rec.imageUrl && (
                        <img
                          src={rec.imageUrl}
                          alt={rec.name}
                          className="w-[51px] h-[51px] rounded-lg object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                          <span>{rec.name}</span>
                          <i className="ri-verified-badge-line text-[#a8e6cf] text-sm" title="Verified"></i>
                        </h4>
                        <p className="text-xs text-[#a8e6cf] font-medium mt-0.5">
                          {rec.role}
                        </p>
                      </div>
                    </div>
                    {rec.linkedIn && (
                      <a
                        href={rec.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEngine.play('click')}
                        className="text-[#a8c7fa] hover:text-white transition-colors shrink-0"
                        title="LinkedIn Profile"
                      >
                        <i className="ri-linkedin-box-line text-xl"></i>
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
