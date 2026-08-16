import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { PhilosophyPillars } from './PhilosophyPillars';
import { ArchitectureReadinessQuiz } from './ArchitectureReadinessQuiz';
import { PgpCryptoSandbox } from './PgpCryptoSandbox';
import { LeadershipCredentialsTimeline } from './LeadershipCredentialsTimeline';

export const AboutSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pillars' | 'audit' | 'crypto' | 'leadership'>('pillars');

  const pgpFingerprint = '4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2';

  const copyPgp = () => {
    navigator.clipboard.writeText(pgpFingerprint);
    setCopied(true);
    soundEngine.play('click');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="about" className="py-16 md:py-24 border-b-0 bg-[#0f0e13] relative scroll-mt-28 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#44474f]/30 pb-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-[#a8c7fa] tracking-wider uppercase flex items-center gap-1.5">
              <i className="ri-shield-line"></i>
              <span>PERSONNEL PROFILE & INTEL BRIEFING</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Briefing & Architectural Philosophy
            </h2>
            <p className="text-xs sm:text-sm text-[#c4c6d0] max-w-3xl">
              Fusing low-level memory forensics with zero-trust distributed architectures, offensive exploit resilience, and high-performance engineering.
            </p>
          </div>

          {/* Quick Sub-Navigation Toolbar */}
          <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-1 scrollbar-none flex-nowrap sm:flex-wrap w-full md:w-auto">
            <button
              onClick={() => {
                setActiveTab('pillars');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'pillars'
                  ? 'bg-[#a8c7fa] text-[#042e60] shadow-md'
                  : 'bg-[#1a1b21] text-[#c4c6d0] hover:text-white border border-[#44474f]/40'
              }`}
            >
              <i className="ri-layout-grid-line"></i>
              <span>PILLARS & DEMOS</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('audit');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'audit'
                  ? 'bg-[#a8c7fa] text-[#042e60] shadow-md'
                  : 'bg-[#1a1b21] text-[#c4c6d0] hover:text-white border border-[#44474f]/40'
              }`}
            >
              <i className="ri-shield-keyhole-line"></i>
              <span>SECURITY AUDIT</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('crypto');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'crypto'
                  ? 'bg-[#a8c7fa] text-[#042e60] shadow-md'
                  : 'bg-[#1a1b21] text-[#c4c6d0] hover:text-white border border-[#44474f]/40'
              }`}
            >
              <i className="ri-key-2-line"></i>
              <span>PGP CRYPTO</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('leadership');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                activeTab === 'leadership'
                  ? 'bg-[#a8c7fa] text-[#042e60] shadow-md'
                  : 'bg-[#1a1b21] text-[#c4c6d0] hover:text-white border border-[#44474f]/40'
              }`}
            >
              <i className="ri-award-line"></i>
              <span>IEEE CS & THESIS</span>
            </button>
          </div>
        </div>

        {/* Main Personnel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Personnel Profile Card (Fixed & Persistent on Desktop) */}
          <div className="lg:col-span-4 bg-[#1a1b21] rounded-2xl border border-[#44474f]/50 p-6 space-y-6 shadow-xl static lg:sticky lg:top-28">
            <div className="flex items-start justify-between border-b border-[#44474f]/30 pb-5">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-[#004a77]/30 border border-[#a8c7fa]/40 flex items-center justify-center text-[#a8c7fa] text-2xl shadow-sm shrink-0">
                  <i className="ri-shield-user-line"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Labib Bin Shahed</h3>
                  <div className="text-xs text-[#a8c7fa] font-medium mt-0.5">
                    President, IEEE CS BDC Secretariat • Security & Content Lead
                  </div>
                  <div className="text-[11px] text-[#8e9199] flex items-center gap-1 mt-1">
                    <i className="ri-map-pin-2-line text-[#c23616]"></i> DHK, BD / Global Ops
                  </div>
                </div>
              </div>
            </div>

            {/* Clearance Stamp */}
            <div className="flex items-center justify-between bg-[#0f0e13]/90 p-3.5 rounded-xl text-xs font-mono">
              <span className="text-[#8e9199]">CLEARANCE LEVEL:</span>
              <span className="px-3 py-1 rounded-full bg-[#60000e]/40 text-[#ffb4ab] font-bold border border-[#ffb4ab]/30">
                LEVEL 5 / TS-SCI (OFFSEC & DFIR)
              </span>
            </div>

            {/* Bio Paragraph */}
            <p className="text-xs text-[#c4c6d0] leading-relaxed">
              Computer Science Engineer architecting immutable, adversary-resistant systems by fusing enterprise software engineering with validated memory forensics and zero-trust security protocols.
            </p>

            {/* Metadata Table */}
            <div className="space-y-3 pt-3 border-t border-[#44474f]/30 text-xs font-sans">
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1 text-[#c4c6d0]">
                <span className="text-[#8e9199] shrink-0">EDUCATION:</span>
                <span className="text-[#a8c7fa] font-semibold text-right sm:text-left">BRAC University (B.Sc. CSE, CGPA 3.58)</span>
              </div>
              <div className="flex justify-between text-[#c4c6d0]">
                <span className="text-[#8e9199]">LOCATION:</span>
                <span className="text-[#a8e6cf] font-mono font-medium">23.77°N, 90.42°E</span>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1 text-[#c4c6d0]">
                <span className="text-[#8e9199] shrink-0">RESEARCH THESIS:</span>
                <span className="text-[#d0bcff] font-medium text-right sm:text-left truncate max-w-full sm:max-w-[200px]" title="Adversarial Machine Learning in Malware Detection">Adversarial ML in Malware Detection</span>
              </div>
              <div className="flex justify-between text-[#c4c6d0]">
                <span className="text-[#8e9199]">LANGUAGES:</span>
                <span className="text-[#a8e6cf]">TypeScript, Go, Rust, Python, C</span>
              </div>
              <div className="flex justify-between text-[#c4c6d0]">
                <span className="text-[#8e9199]">FORENSIC SUITE:</span>
                <span className="text-[#a8c7fa]">Volatility 3, Ghidra, YARA, Wireshark</span>
              </div>

              {/* PGP Fingerprint Box */}
              <div className="bg-[#0f0e13] p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#8e9199]">
                  <span className="flex items-center gap-1.5 text-[#a8e6cf]">
                    <i className="ri-key-2-line text-sm"></i> PGP FINGERPRINT
                  </span>
                  <button
                    onClick={copyPgp}
                    className="px-2.5 py-1 rounded-full bg-[#21232b] hover:bg-[#2b2d36] text-[#c2e7ff] text-[10px] font-mono font-medium transition-all cursor-pointer"
                  >
                    {copied ? 'COPIED!' : 'COPY KEY'}
                  </button>
                </div>
                <div className="text-[11px] text-[#a8e6cf] font-mono tracking-tight truncate select-all">
                  {pgpFingerprint}
                </div>
              </div>
            </div>
          </div>

          {/* Right Area: Dynamic Interactive Mode Views */}
          <div className="lg:col-span-8">
            {activeTab === 'pillars' && <PhilosophyPillars />}
            {activeTab === 'audit' && <ArchitectureReadinessQuiz />}
            {activeTab === 'crypto' && <PgpCryptoSandbox />}
            {activeTab === 'leadership' && <LeadershipCredentialsTimeline />}
          </div>

        </div>

      </div>
    </section>
  );
};

