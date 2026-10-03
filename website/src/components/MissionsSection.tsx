import React, { useState, useMemo } from 'react';
import { WORK_EXPERIENCE_DATA, MISSIONS_DATA, RECOMMENDATIONS_DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { CvSection } from './CvSection';

type MissionTab = 'work' | 'experience' | 'endorsements' | 'resume';

interface MissionTabMeta {
  id: MissionTab;
  label: string;
  badge: string;
  icon: string;
}

const MISSION_TABS: MissionTabMeta[] = [
  {
    id: 'work',
    label: `Work Experience (${WORK_EXPERIENCE_DATA.length})`,
    badge: 'WORK EXPERIENCES',
    icon: 'ri-suitcase-3-line',
  },
  {
    id: 'experience',
    label: `Volunteer Experience (${MISSIONS_DATA.length})`,
    badge: 'VOLUNTEER EXPERIENCES',
    icon: 'ri-hand-heart-line',
  },
  {
    id: 'endorsements',
    label: `Endorsements (${RECOMMENDATIONS_DATA.length})`,
    badge: 'VERIFIED ENDORSEMENTS',
    icon: 'ri-chat-quote-line',
  },
  {
    id: 'resume',
    label: 'Resume & Curriculum Vitae',
    badge: 'CURRICULUM VITAE',
    icon: 'ri-file-text-line',
  },
];

export const MissionsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MissionTab>('work');

  // Track single expanded work experience (accordion behavior)
  const [expandedWorkId, setExpandedWorkId] = useState<string | null>(null);

  const toggleWork = (id: string) => {
    setExpandedWorkId((prev) => (prev === id ? null : id));
  };

  // Track single expanded volunteer mission (accordion behavior)
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);

  const toggleMission = (id: string) => {
    setExpandedMissionId((prev) => (prev === id ? null : id));
  };

  // Track single expanded recommendation/endorsement
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);

  const toggleRec = (id: string) => {
    setExpandedRecId((prev) => (prev === id ? null : id));
  };

  const currentTabMeta = useMemo(() => {
    switch (activeTab) {
      case 'work':
        return {
          total: WORK_EXPERIENCE_DATA.length,
          typeBadge: 'WORK EXPERIENCES',
          icon: 'ri-suitcase-3-line',
          colorClass: 'text-[#a8c7fa]',
        };
      case 'experience':
        return {
          total: MISSIONS_DATA.length,
          typeBadge: 'VOLUNTEER EXPERIENCES',
          icon: 'ri-hand-heart-line',
          colorClass: 'text-[#a8c7fa]',
        };
      case 'endorsements':
        return {
          total: RECOMMENDATIONS_DATA.length,
          typeBadge: 'VERIFIED ENDORSEMENTS',
          icon: 'ri-chat-quote-line',
          colorClass: 'text-[#a8c7fa]',
        };
      case 'resume':
      default:
        return {
          total: 1,
          typeBadge: 'CURRICULUM VITAE',
          icon: 'ri-file-text-line',
          colorClass: 'text-[#a8c7fa]',
        };
    }
  }, [activeTab]);

  return (
    <section
      id="experience"
      className="pt-0 pb-0 px-[8px] border-b-0 bg-transparent relative scroll-mt-28 font-sans"
      style={{ paddingTop: '0px', paddingLeft: '8px', paddingRight: '8px', paddingBottom: '0px' }}
    >
      <div className="max-w-7xl mx-auto px-0">
        {/* Section Header */}
        <div className="mb-[15px]">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8c7fa] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a8c7fa] shadow-[0_0_8px_rgba(168,199,250,0.8)]"></span>
            </span>
            <span
              className="text-[12px] leading-[16px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold"
              style={{ fontSize: '12px' }}
            >
              PROFESSIONAL TRACK & SERVICE
            </span>
          </div>
          <h2
            className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3 leading-[24px]"
            style={{ fontSize: '24px', lineHeight: '24px' }}
          >
            Missions & Track Record
          </h2>
        </div>

        {/* Capsule Button Bar matching Arsenal (4 Tabs) */}
        <div className="flex items-center gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px] mb-[15px] max-w-2xl w-full">
          {MISSION_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  soundEngine.play('click');
                }}
                className={`w-[35px] flex-1 h-[35px] flex items-center justify-center rounded-full transition-colors cursor-pointer text-center border-0 text-[13px] leading-[16px] ${
                  isActive
                    ? 'bg-[#a8c7fa] text-[#00325b] font-semibold'
                    : 'text-[#c4c6d0] hover:text-white'
                }`}
                title={tab.label}
                aria-label={tab.label}
              >
                <i
                  className={`${tab.icon} text-base ${isActive ? 'text-[#00325b]' : 'text-[#c4c6d0]'}`}
                ></i>
              </button>
            );
          })}
        </div>

        {/* Status / Filter HUD Capsule Bar */}
        <div
          className="bg-[#21232b] rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 text-[12px] leading-[12px] font-mono border-0 mb-[15px]"
          style={{
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingTop: '8px',
            paddingBottom: '8px',
            color: '#a8c7fa',
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate" style={{ fontSize: '12px', lineHeight: '12px', color: '#a8c7fa' }}>
              SHOWING{' '}
              <strong className={currentTabMeta.colorClass} style={{ color: '#a8c7fa' }}>
                {currentTabMeta.total > 0 ? 1 : 0}-{currentTabMeta.total}
              </strong>{' '}
              OF <strong className="text-white">{currentTabMeta.total}</strong>{' '}
              <strong className={currentTabMeta.colorClass} style={{ color: '#a8c7fa' }}>
                {currentTabMeta.typeBadge}
              </strong>
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="space-y-[15px]">
          {/* Work Experience Block */}
          {activeTab === 'work' && (
            <div className="space-y-[15px]">
              {/* Work Experience Cards Deck */}
              <div className="grid grid-cols-1 gap-[15px]">
                {WORK_EXPERIENCE_DATA.map((job) => {
                  const isExpanded = expandedWorkId === job.id;

                  return (
                    <div
                      key={job.id}
                      className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all relative overflow-hidden group shadow-md"
                      style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
                    >
                      {/* Header Row */}
                      <div>
                        <div className="flex items-center justify-between gap-2.5">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <div
                              className="rounded-lg flex items-center justify-center text-base font-bold bg-[#a8c7fa] text-[#00325b] shrink-0 mt-0.5 shadow-sm"
                              style={{ width: '32.9948px', height: '32.9948px' }}
                            >
                              <i className={job.icon || 'ri-suitcase-3-line'}></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-[16px] leading-[16px] font-bold text-white">
                                {job.company}
                              </h3>
                              <p className="text-[12px] font-medium text-[#a8c7fa] leading-[12px] mt-1" style={{ fontSize: '12px', lineHeight: '12px' }}>
                                {job.title} | {job.period}
                              </p>
                            </div>
                          </div>

                          {/* Expand/Collapse Action Icon on the Right */}
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.play('click');
                              toggleWork(job.id);
                            }}
                            className="p-1 text-[#a8c7fa] hover:text-white transition-colors cursor-pointer focus:outline-none shrink-0"
                            title={isExpanded ? 'Collapse details' : 'Expand details'}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                          >
                            <i
                              className={`text-lg text-[#a8c7fa] ${
                                isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
                              }`}
                            ></i>
                          </button>
                        </div>
                      </div>

                      {/* Always-Visible Description (Justified) in a Text Block */}
                      <div
                        className="bg-[#000000] border border-[#44474f]/30 rounded-xl p-2 mt-3"
                        style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
                      >
                        <p className="text-[12px] text-[#c4c6d0] leading-[16px] font-sans text-justify" style={{ fontSize: '12px' }}>
                          {job.summary}
                        </p>
                      </div>

                      {/* Collapsible Content: Bullets List (Justified) */}
                      {isExpanded && (
                        <div className="space-y-3 mt-3">
                          <ul className="space-y-2.5 text-[13px] leading-[16px] text-[#c4c6d0] font-sans">
                            {job.bullets.map((bullet, idx) => {
                              const colonIdx = bullet.indexOf(': ');
                              const hasPrefix = colonIdx !== -1;
                              const prefix = hasPrefix ? bullet.slice(0, colonIdx + 1) : '';
                              const body = hasPrefix ? bullet.slice(colonIdx + 1) : bullet;

                              return (
                                <li key={idx} className="flex items-start space-x-2.5 leading-relaxed group/item">
                                  <i className="ri-arrow-right-circle-line text-sm text-[#a8c7fa] shrink-0 mt-0.5"></i>
                                  <span className="text-justify">
                                    {hasPrefix ? (
                                      <>
                                        <strong className="text-white font-semibold">{prefix}</strong>{' '}
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
            </div>
          )}

          {/* Volunteer Experience Block */}
          {activeTab === 'experience' && (
            <div className="space-y-[15px]">
              {/* Missions Cards Deck */}
              <div className="grid grid-cols-1 gap-[15px]">
                {MISSIONS_DATA.map((mission) => {
                  const isExpanded = expandedMissionId === mission.id;

                  return (
                    <div
                      key={mission.id}
                      className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all relative overflow-hidden group shadow-md"
                      style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
                    >
                      {/* Header Row */}
                      <div>
                        <div className="flex items-center justify-between gap-2.5">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <div
                              className="rounded-lg flex items-center justify-center text-base font-bold bg-[#a8c7fa] text-[#00325b] shrink-0 mt-0.5 shadow-sm"
                              style={{ width: '32.9948px', height: '32.9948px' }}
                            >
                              <i className={mission.icon || 'ri-bank-line'}></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-[16px] leading-[16px] font-bold text-white">
                                {mission.company}
                              </h3>
                              <p className="text-[12px] font-medium text-[#a8c7fa] leading-[12px] mt-1" style={{ fontSize: '12px', lineHeight: '12px' }}>
                                {mission.title} | {mission.period}
                              </p>
                            </div>
                          </div>

                          {/* Expand/Collapse Action Icon on the Right */}
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.play('click');
                              toggleMission(mission.id);
                            }}
                            className="p-1 text-[#a8c7fa] hover:text-white transition-colors cursor-pointer focus:outline-none shrink-0"
                            title={isExpanded ? 'Collapse details' : 'Expand details'}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                          >
                            <i
                              className={`text-lg text-[#a8c7fa] ${
                                isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
                              }`}
                            ></i>
                          </button>
                        </div>
                      </div>

                      {/* Always-Visible Description (Justified) in a Text Block */}
                      <div
                        className="bg-[#000000] border border-[#44474f]/30 rounded-xl p-2 mt-3"
                        style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
                      >
                        <p className="text-[12px] text-[#c4c6d0] leading-[16px] font-sans text-justify" style={{ fontSize: '12px' }}>
                          {mission.summary}
                        </p>
                      </div>

                      {/* Collapsible Content: Bullets List (Justified) */}
                      {isExpanded && (
                        <div className="space-y-3 mt-3">
                          <ul className="space-y-2.5 text-[13px] leading-[16px] text-[#c4c6d0] font-sans">
                            {mission.bullets.map((bullet, idx) => {
                              const colonIdx = bullet.indexOf(': ');
                              const hasPrefix = colonIdx !== -1;
                              const prefix = hasPrefix ? bullet.slice(0, colonIdx + 1) : '';
                              const body = hasPrefix ? bullet.slice(colonIdx + 1) : bullet;

                              return (
                                <li key={idx} className="flex items-start space-x-2.5 leading-relaxed group/item">
                                  <i className="ri-arrow-right-circle-line text-sm text-[#a8c7fa] shrink-0 mt-0.5"></i>
                                  <span className="text-justify">
                                    {hasPrefix ? (
                                      <>
                                        <strong className="text-white font-semibold">{prefix}</strong>{' '}
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
            </div>
          )}

          {/* Endorsements Block */}
          {activeTab === 'endorsements' && (
            <div className="space-y-[15px]">
              {/* Endorsements Cards Grid */}
              <div className="grid grid-cols-1 gap-[15px]">
                {RECOMMENDATIONS_DATA.map((rec) => {
                  const isRecExpanded = expandedRecId === rec.id;
                  return (
                    <div
                      key={rec.id}
                      style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', height: 'auto' }}
                      className={`bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between group relative shadow-md h-auto ${isRecExpanded ? 'gap-2.5' : ''}`}
                    >
                      {/* Header Row */}
                      <div className="h-auto min-h-[30px] flex items-center justify-between gap-2 shrink-0">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {rec.imageUrl ? (
                            <img
                              src={rec.imageUrl}
                              alt={rec.name}
                              className="w-[45px] h-[45px] rounded-[8px] object-cover shrink-0 shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-[45px] h-[45px] shrink-0 rounded-[8px] bg-[#c2e7ff] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                              <i className="ri-user-star-line"></i>
                            </div>
                          )}
                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <span className="font-mono font-bold text-white text-[16px] leading-[16px] break-words">
                              {rec.name}
                            </span>
                            <span
                              className="text-[12px] text-[#a8c7fa] font-mono font-medium tracking-wider leading-[12px] mt-1 break-words"
                              style={{ fontSize: '12px', lineHeight: '12px' }}
                            >
                              {rec.role}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {rec.linkedIn && (
                            <a
                              href={rec.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => soundEngine.play('click')}
                              className="p-1 text-[#a8c7fa] cursor-pointer focus:outline-none shrink-0"
                              title="LinkedIn Profile"
                            >
                              <i className="ri-linkedin-box-line text-lg"></i>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.play('click');
                              toggleRec(rec.id);
                            }}
                            className="p-1 text-[#a8c7fa] hover:text-white transition-colors cursor-pointer focus:outline-none shrink-0"
                            title={isRecExpanded ? 'Collapse endorsement' : 'Expand endorsement'}
                            aria-expanded={isRecExpanded}
                            aria-label={isRecExpanded ? 'Collapse endorsement' : 'Expand endorsement'}
                          >
                            <i
                              className={`text-lg text-[#a8c7fa] ${
                                isRecExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
                              }`}
                            ></i>
                          </button>
                        </div>
                      </div>

                      {/* Content Capsule Box */}
                      {isRecExpanded && (
                        <div
                          className="min-h-[38px] h-auto bg-[#000000] border border-[#44474f]/30 rounded-xl p-2 text-[12px] leading-[16px] text-[#c4c6d0] font-sans flex-1"
                          style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
                        >
                          <p className="text-[12px] text-[#c4c6d0] font-sans leading-[16px] text-justify italic" style={{ fontSize: '12px' }}>
                            {rec.quote}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resume Block */}
          {activeTab === 'resume' && (
            <div className="space-y-[15px]">
              <CvSection />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
