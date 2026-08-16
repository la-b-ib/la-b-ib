import React from 'react';
import { Casefile } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface CasefileModalProps {
  casefile: Casefile | null;
  onClose: () => void;
}

export const CasefileModal: React.FC<CasefileModalProps> = ({ casefile, onClose }) => {
  if (!casefile) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 top-[60px] sm:top-[68px] z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f] w-full max-w-sm sm:max-w-xl md:max-w-2xl max-h-[calc(100dvh-95px)] overflow-y-auto p-6 space-y-5 shadow-2xl relative my-auto">
        <button
          onClick={() => {
            onClose();
            soundEngine.play('click');
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#21232b] border border-[#44474f] text-[#c4c6d0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {/* Case Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-[#60000e]/40 text-[#ffb4ab] border border-[#ffb4ab]/30 text-[10px] font-mono font-semibold">
              {casefile.badge}
            </span>
            <span className="text-xs font-mono text-[#8e9199] font-semibold">
              {casefile.caseId}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {casefile.title}
          </h3>
        </div>

        {/* Details & Specifications */}
        <div className="space-y-3 font-sans text-xs sm:text-sm text-[#c4c6d0]">
          <p className="bg-[#0f0e13] p-4 rounded-xl border border-[#44474f]/30 text-white leading-relaxed font-sans">
            {casefile.summary}
          </p>

          <div className="space-y-2">
            <h4 className="font-mono font-semibold text-white text-xs">ARCHITECTURAL SPECIFICATIONS & HIGHLIGHTS:</h4>
            <ul className="space-y-1.5 font-sans">
              {casefile.details.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-[#a8c7fa] font-mono font-bold">&gt;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Snippet Box */}
          <div className="space-y-1 pt-2">
            <h4 className="font-mono font-semibold text-[#a8c7fa] text-xs flex items-center gap-1.5">
              <i className="ri-code-s-slash-line"></i> CORE ARCHITECTURE SNIPPET ({casefile.language.toUpperCase()})
            </h4>
            <pre className="bg-[#0f0e13] p-4 rounded-xl border border-[#44474f]/30 font-mono text-xs text-[#a8e6cf] overflow-x-auto leading-relaxed max-h-56">
              <code>{casefile.codeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#44474f]/30">
          <a
            href={casefile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.play('click')}
            className="m3-btn-tonal text-xs cursor-pointer"
          >
            <i className="ri-github-line text-base text-[#a8c7fa]"></i>
            <span>OPEN GITHUB REPOSITORY</span>
          </a>

          <button
            onClick={() => {
              onClose();
              soundEngine.play('click');
            }}
            className="m3-btn-primary text-xs cursor-pointer"
          >
            CLOSE CASEFILE
          </button>
        </div>
      </div>
    </div>
  );
};
