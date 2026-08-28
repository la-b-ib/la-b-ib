import React, { useState, useEffect } from 'react';
import { HeaderSearch, FILTER_CATEGORIES } from './HeaderSearch';
import { soundEngine } from '../utils/soundEngine';
import { Casefile } from '../types';

interface SearchSectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (sectionId: string) => void;
  onInspectCasefile?: (casefile: Casefile) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  isOpen,
  onClose,
  onSelectSection,
  onInspectCasefile,
}) => {
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <section className="w-full flex-1 flex flex-col bg-[#0f0e13] min-h-[calc(100dvh-92px)] border-t border-white/10 text-white font-mono animate-fadeIn">
      {/* Header Bar with Search Bar, Filter Buttons (desktop), Matches Count & Close Button */}
      <div className="bg-[#1a1b21] px-4 py-3 border-b border-[#44474f]/30 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 select-none">
        <div className="flex-1 max-w-xl min-w-[200px]">
          <HeaderSearch
            autoFocus
            placeholder="Search anything: OSCP, React, Metasploit, Memory, Kernel, IEEE..."
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onMatchesCountChange={setMatchesCount}
            onSelectSection={(sectionId) => {
              onClose();
              onSelectSection(sectionId);
            }}
            onInspectCasefile={(casefile) => {
              onClose();
              if (onInspectCasefile) onInspectCasefile(casefile);
            }}
          />
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          {/* Desktop Filter Buttons before matches button */}
          <div className="hidden md:flex items-center gap-1.5">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                title={cat.label}
                onClick={() => {
                  soundEngine.play('click');
                  setSelectedCategory(cat.id);
                }}
                className={`search-result-item shrink-0 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#a8c7fa] text-[#042e60] border-[#a8c7fa] font-semibold'
                    : 'bg-[#21232b] text-[#c4c6d0] hover:text-white hover:bg-[#2b2d36] border-[#44474f]/40'
                }`}
              >
                <i className={`${cat.icon} text-sm leading-none`}></i>
                <span className="text-[11px] uppercase">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Matches Count Button / Badge */}
          <div
            className="px-3 py-1.5 text-[11px] font-mono font-semibold rounded-full border border-[#a8c7fa]/40 bg-[#004a77]/30 text-[#a8c7fa] flex items-center justify-center gap-1.5 h-8"
            title="Matching search items found"
          >
            <i className="ri-radar-line text-[#a8c7fa] text-xs"></i>
            <span>{matchesCount} {matchesCount === 1 ? 'MATCH' : 'MATCHES'}</span>
          </div>

          {/* Icon-Only Close Button */}
          <button
            onClick={() => {
              soundEngine.play('click');
              onClose();
            }}
            className="bg-[#21232b] hover:bg-[#2b2d36] text-[#c4c6d0] hover:text-white w-8 h-8 rounded-full border border-[#44474f]/50 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            title="Close Search"
          >
            <i className="ri-close-line text-lg leading-none"></i>
          </button>
        </div>
      </div>
    </section>
  );
};
