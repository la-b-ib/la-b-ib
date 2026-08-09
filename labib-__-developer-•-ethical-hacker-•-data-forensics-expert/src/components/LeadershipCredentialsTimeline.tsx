import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface CareerMilestone {
  id: string;
  period: string;
  role: string;
  organization: string;
  badge: string;
  badgeColor: string;
  summary: string;
  highlights: string[];
  thesisOrLink?: string;
}

export const LeadershipCredentialsTimeline: React.FC = () => {
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('ieee_cs');

  const milestones: CareerMilestone[] = [
    {
      id: 'ieee_cs',
      period: '2023 - PRESENT',
      role: 'President / Content & Security Operations Lead',
      organization: 'IEEE Computer Society Bangladesh Section (BDC) Secretariat',
      badge: 'EXECUTIVE LEADERSHIP',
      badgeColor: '#a8c7fa',
      summary: 'Directing technical operations, national cybersecurity symposiums, and engineering workshops across 30+ university student branches in Bangladesh. Overseeing secure communications and cloud infrastructure.',
      highlights: [
        'Organized National Cyber Defence Hackathons & DFIR workshops impacting 1,500+ engineers.',
        'Architected secure credential verification portals & automated event analytics pipelines.',
        'Spearheaded IEEE CS technical dispatches, research briefings, and technology publications.',
      ],
    },
    {
      id: 'brac_cse',
      period: '2020 - 2024',
      role: 'B.Sc. in Computer Science & Engineering (CGPA: 3.58 / 4.00)',
      organization: 'BRAC University, School of Data & Sciences',
      badge: 'ACADEMIC EXCELLENCE',
      badgeColor: '#a8e6cf',
      summary: 'Specialized in Systems Security, Distributed Operating Systems, Memory Forensics, and Adversarial Machine Learning. Graduated with High Distinction honours.',
      highlights: [
        'Research Thesis: "Adversarial Machine Learning Attacks & Defense Mechanisms in Automated Malware Classification"',
        'Coursework: Advanced Cryptography, OS Kernels, Network Security, Parallel Computing (CUDA/Go), Database Systems.',
        'Vice Chancellor’s Honor Roll & Dean’s List Awardee across multiple consecutive semesters.',
      ],
      thesisOrLink: 'THESIS SUMMARY AVAILABLE IN RESEARCH REPOSITORY',
    },
    {
      id: 'dfir_ops',
      period: '2022 - PRESENT',
      role: 'Security Engineering & Memory Forensics Researcher',
      organization: 'Independent OffSec & Malware Analysis Lab',
      badge: 'OFFSEC & FORENSICS',
      badgeColor: '#d0bcff',
      summary: 'Conducting threat modeling, Volatility 3 kernel RAM memory inspection, Ghidra reverse engineering, and custom YARA rule authoring for zero-day mitigation.',
      highlights: [
        'Authored 10+ Peer-Reviewed Technical Advisories & Exploit PoCs.',
        'Developed automated Volatility plugins for extracting injected DLLs from physical RAM dumps.',
        'Built microservice security layers with mTLS and eBPF kernel network filters.',
      ],
    },
  ];

  return (
    <div className="bg-[#1a1b21] p-6 rounded-2xl border border-[#44474f]/60 space-y-6 shadow-2xl font-sans text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#44474f]/40 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#d0bcff] uppercase tracking-wider">
            <i className="ri-award-line text-sm"></i>
            <span>LEADERSHIP, CREDENTIALS & ACADEMIC MILESTONES</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">IEEE CS Secretariat & Research Credentials</h3>
          <p className="text-xs text-[#c4c6d0] mt-0.5">
            Key executive roles, academic achievements at BRAC University, and security research highlights.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-[#a8e6cf]">
          <i className="ri-verified-badge-line text-base"></i>
          <span>VERIFIED CREDENTIALS</span>
        </div>
      </div>

      {/* MILESTONES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Milestone Selector List */}
        <div className="lg:col-span-5 space-y-3 font-mono">
          {milestones.map((m) => {
            const isSelected = activeMilestoneId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMilestoneId(m.id);
                  soundEngine.play('click');
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-[#004a77]/30 border-[#a8c7fa] text-white shadow-lg'
                    : 'bg-[#0f0e13] border-[#44474f]/40 text-[#c4c6d0] hover:bg-[#1a1b21] hover:border-[#a8c7fa]/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8e9199]">{m.period}</span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold border"
                    style={{
                      borderColor: `${m.badgeColor}40`,
                      backgroundColor: `${m.badgeColor}20`,
                      color: m.badgeColor,
                    }}
                  >
                    {m.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{m.role}</h4>
                <p className="text-xs text-[#a8c7fa] line-clamp-1 font-sans">{m.organization}</p>
              </button>
            );
          })}
        </div>

        {/* Milestone Detailed Card */}
        <div className="lg:col-span-7 bg-[#0f0e13] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 font-sans">
          {(() => {
            const m = milestones.find((item) => item.id === activeMilestoneId) || milestones[0];
            return (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
                  <div>
                    <span className="text-xs font-mono text-[#8e9199]">{m.period}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{m.role}</h3>
                    <div className="text-xs text-[#a8c7fa] font-mono mt-0.5">{m.organization}</div>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
                    style={{
                      borderColor: `${m.badgeColor}50`,
                      backgroundColor: `${m.badgeColor}20`,
                      color: m.badgeColor,
                    }}
                  >
                    {m.badge}
                  </span>
                </div>

                <p className="text-xs text-[#c4c6d0] leading-relaxed">{m.summary}</p>

                <div className="space-y-2 pt-2 border-t border-[#44474f]/30">
                  <div className="text-xs font-mono text-[#a8c7fa] uppercase font-bold">KEY IMPACT HIGHLIGHTS:</div>
                  <ul className="space-y-2 text-xs text-[#c4c6d0]">
                    {m.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <i className="ri-checkbox-circle-line text-[#a8e6cf] text-sm shrink-0 mt-0.5"></i>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {m.thesisOrLink && (
                  <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#a8c7fa]/30 text-xs font-mono text-[#a8c7fa] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <i className="ri-file-code-line text-sm"></i> {m.thesisOrLink}
                    </span>
                    <i className="ri-arrow-right-up-line text-sm"></i>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

      </div>

    </div>
  );
};
