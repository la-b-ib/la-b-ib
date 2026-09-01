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
 <div className="mb-10">
 <div className="flex items-center space-x-2">
 <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
 <span className="text-[12px] leading-[13px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold">
 Leadership HISTORY
 </span>
 </div>
 <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
 Volunteer Experience
 </h2>
 </div>

 {/* Missions Cards Deck */}
 <div className="grid grid-cols-1 gap-4">
 {MISSIONS_DATA.map((mission) => {
 const isExpanded = Boolean(expandedMissions[mission.id]);

 return (
 <div
 key={mission.id}
 className="bg-[#21232b] border-0 p-4 rounded-2xl transition-all relative overflow-hidden group"
 >
 {/* Header Row */}
 <div>
 <div className="flex items-center justify-between gap-2.5">
 <div className="flex items-start gap-2.5 min-w-0 flex-1">
 <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold bg-[#a8c7fa] text-[#00325b] shrink-0 mt-0.5 shadow-sm">
 <i className={mission.icon || 'ri-bank-line'}></i>
 </div>
 <div className="min-w-0 flex-1">
 <h3 className="text-[16px] leading-[20px] font-bold text-white">
 {mission.company}
 </h3>
 <p className="text-[12px] font-medium text-[#a8c7fa] leading-tight mt-1">
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
 title={isExpanded ?"Collapse details":"Expand details"}
 aria-expanded={isExpanded}
 aria-label={isExpanded ?"Collapse details":"Expand details"}
 >
 <i
 className={`text-lg text-[#a8c7fa] ${
 isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'
 }`}
 ></i>
 </button>
 </div>
 </div>

 {/* Always-Visible Description (Justified) */}
 <p className="text-xs text-[#c4c6d0] leading-relaxed font-sans mt-3 text-justify">
 {mission.summary}
 </p>

 {/* Collapsible Content: Bullets List (Justified) */}
 {isExpanded && (
 <div className="space-y-3 mt-3">
 <ul className="space-y-2.5 text-xs text-[#c4c6d0] font-sans">
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

 {/* Endorsements Block (Redesigned like Intel Brief Research tab) */}
 <div className="space-y-3.5 pt-4">
 {/* Header Container */}
 <div className="bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all">
 <div className="flex items-center gap-3 min-w-0">
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#fdd663] text-[#3a2d00] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">
 <i className="ri-chat-quote-line"></i>
 </div>
 <div className="flex-1 min-w-0 flex flex-col justify-center">
 <h3 className="text-[16px] leading-[20px] font-bold text-white truncate">
 Endorsements
 </h3>
 <div className="text-[12px] leading-[15px] text-[#a8c7fa] font-semibold mt-0.5">
 Verified Recommendations : {RECOMMENDATIONS_DATA.length}
 </div>
 </div>
 </div>
 </div>

 {/* Endorsements Cards Grid */}
 <div className="grid grid-cols-1 gap-3.5">
 {RECOMMENDATIONS_DATA.map((rec) => (
 <div
 key={rec.id}
 className="bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between group relative shadow-md gap-2.5"
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
 <span className="font-mono font-bold text-white text-[15px] leading-tight break-words">
 {rec.name}
 </span>
 <span className="text-[11px] text-[#a8c7fa] font-mono font-medium tracking-wider leading-snug mt-0.5 break-words">
 {rec.role}
 </span>
 </div>
 </div>

 {rec.linkedIn && (
 <a
 href={rec.linkedIn}
 target="_blank"
 rel="noopener noreferrer"
 onClick={() => soundEngine.play('click')}
 className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] hover:bg-[#c2e7ff] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm transition-all shrink-0 cursor-pointer"
 title="LinkedIn Profile"
 >
 <i className="ri-linkedin-box-line text-lg"></i>
 </a>
 )}
 </div>

 {/* Content Capsule Box */}
 <div className="min-h-[38px] h-auto bg-[#13141a] border border-[#44474f]/30 rounded-xl p-3.5 text-[12px] leading-[19px] text-[#c4c6d0] font-sans flex-1">
 <p className="text-xs text-[#c4c6d0] font-sans leading-relaxed text-justify italic">
 {rec.quote}
 </p>
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
