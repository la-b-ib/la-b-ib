import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { HeaderSearch } from './HeaderSearch';
import { Casefile } from '../types';

interface NavbarProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  onInspectCasefile?: (casefile: Casefile) => void;
  searchDrawerOpen?: boolean;
  onToggleSearch?: () => void;
  onCloseSearch?: () => void;
  sfxActive?: boolean;
  onToggleSfx?: () => void;
  ctfOpen?: boolean;
  onToggleCtf?: () => void;
  onOpenCtf?: () => void;
  terminalOpen?: boolean;
  onToggleTerminal?: () => void;
  onOpenTerminal?: () => void;
  latency?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  onInspectCasefile,
  searchDrawerOpen: controlledSearchOpen,
  onToggleSearch,
  onCloseSearch,
  sfxActive = true,
  onToggleSfx,
  ctfOpen = false,
  onToggleCtf,
  onOpenCtf,
  terminalOpen = false,
  onToggleTerminal,
  onOpenTerminal,
  latency = 14,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearchOpen, setLocalSearchOpen] = useState(false);

  const isSearchOpen = controlledSearchOpen !== undefined ? controlledSearchOpen : localSearchOpen;

  const toggleSearch = () => {
    if (onToggleSearch) {
      onToggleSearch();
    } else {
      setLocalSearchOpen((prev) => !prev);
    }
  };

  const closeSearch = () => {
    if (onCloseSearch) {
      onCloseSearch();
    } else if (onToggleSearch) {
      onToggleSearch();
    } else {
      setLocalSearchOpen(false);
    }
  };

  // Global keyboard shortcut to toggle search drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleSearch]);

  const navLinks = [
    { label: 'INTEL BRIEF', num: '01', href: '#about' },
    { label: 'THREAT RADAR', num: '02', href: '#threat-map' },
    { label: 'MISSIONS', num: '03', href: '#experience' },
    { label: 'ARSENAL', num: '04', href: '#skills' },
    { label: 'CASEFILES', num: '05', href: '#projects' },
    { label: 'CREDENTIALS', num: '06', href: '#certificates' },
    { label: 'DISPATCHES', num: '07', href: '#blog' },
    { label: 'ENCRYPTED', num: '08', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    soundEngine.play('click');
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    onSelectSection(targetId);
  };

  return (
    <div className="w-full pt-0 pb-2.5 relative">
      <div className="max-w-7xl mx-auto px-[15px] sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Google Style Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="flex items-center space-x-3 group shrink-0"
        >
          {/* Shield Icon */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#21232b] border border-[#44474f] group-hover:border-[#a8c7fa] transition-all">
            <i className="ri-shield-keyhole-line text-lg text-[#a8c7fa] group-hover:scale-110 transition-transform"></i>
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              LABIB <span className="text-[#a8c7fa] font-mono text-xs font-semibold">// GOOGLE_SEC</span>
            </div>
            <div className="text-[10px] font-medium text-[#a8aab3] tracking-wide hidden sm:block">
              ARCHITECT • OFFSEC • DFIR
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links - Material 3 Segmented Pill Tabs */}
        <nav className="hidden lg:flex items-center flex-wrap gap-1 text-xs font-medium shrink-0 ml-auto bg-[#1d1b20] p-1 rounded-full border border-[#49454f]/30">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`m3-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className={`font-mono text-[10px] mr-1.5 ${isActive ? 'text-[#c2e7ff]' : 'text-[#8e9199]'}`}>
                  {link.num}
                </span>
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Mobile / Tablet Quick Actions & Menu Toggle - M3 Expressive Cluster */}
        <div className="lg:hidden flex items-center space-x-2 shrink-0 ml-auto">
          {/* M3 Menu Toggle Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              soundEngine.play('click');
            }}
            className={`w-9 h-9 rounded-full border transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
              mobileMenuOpen
                ? 'bg-[#004a77] border-[#a8c7fa] text-[#c2e7ff] shadow-md'
                : 'bg-[#2b2930] hover:bg-[#36343b] border-[#49454f]/50 text-[#e3e2e6]'
            }`}
            aria-label="Toggle navigation menu"
          >
            <i className={mobileMenuOpen ? 'ri-close-line text-lg' : 'ri-menu-4-line text-lg'}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Top Sheet - M3 Expressive Modal Surface */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 w-full bg-[#1d1b20]/98 backdrop-blur-2xl border-b border-[#49454f]/50 px-[15px] py-[15px] space-y-4 text-xs max-h-[85vh] overflow-y-auto shadow-2xl rounded-b-3xl mt-0 animate-fadeIn z-50">
          {/* M3 Workspace Status Card Header */}
          <div className="bg-[#141218] p-3 rounded-2xl border border-[#49454f]/40 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a8e6cf] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34a853]"></span>
              </span>
              <span className="text-[#e3e2e6] font-bold tracking-tight">M3 GOOGLE_SEC</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#00522b]/40 border border-[#a8e6cf]/30 text-[#a8e6cf]">
              <i className="ri-router-line text-xs"></i>
              <span className="font-bold">{latency}ms</span>
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="w-full pb-1">
            <HeaderSearch
              onSelectSection={(sectionId) => {
                setMobileMenuOpen(false);
                onSelectSection(sectionId);
              }}
              onInspectCasefile={(casefile) => {
                setMobileMenuOpen(false);
                if (onInspectCasefile) onInspectCasefile(casefile);
              }}
            />
          </div>

          {/* M3 Segmented Navigation Pills Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              const formattedLabel = link.label
                .toLowerCase()
                .split(' ')
                .map((w) => (w === 'ai' ? 'AI' : w.charAt(0).toUpperCase() + w.slice(1)))
                .join(' ');

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`cursor-pointer transition-all flex items-center space-x-2 px-3.5 py-[15px] rounded-full font-bold text-xs ${
                    isActive
                      ? 'bg-[#004a77] text-[#c2e7ff] border border-[#a8c7fa]/50 shadow-md'
                      : 'bg-[#2b2930]/80 hover:bg-[#36343b] text-[#e3e2e6] border border-[#49454f]/30'
                  }`}
                >
                  <span className={`font-mono text-[10px] ${isActive ? 'text-[#c2e7ff]' : 'text-[#a8aab3]'}`}>{link.num}.</span>
                  <span className="truncate">{formattedLabel}</span>
                </a>
              );
            })}
          </div>

          {/* M3 Utility Controls Bar */}
          <div className="pt-3 border-t border-[#49454f]/40 flex items-center justify-between gap-2">
            {/* SFX Toggle */}
            <button
              onClick={() => {
                if (onToggleSfx) onToggleSfx();
                soundEngine.play('click');
              }}
              className={`flex-1 py-2 rounded-full border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                sfxActive
                  ? 'bg-[#004a77]/60 border-[#a8c7fa] text-[#c2e7ff]'
                  : 'bg-[#2b2930] border-[#49454f]/40 text-[#c4c6d0]'
              }`}
              title={`Toggle Audio SFX (${sfxActive ? 'ON' : 'OFF'})`}
            >
              <i className={`${sfxActive ? 'ri-volume-up-line' : 'ri-volume-mute-line'} text-sm`}></i>
              <span>SFX</span>
            </button>

            {/* CTF Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onToggleCtf) {
                  onToggleCtf();
                } else if (onOpenCtf) {
                  onOpenCtf();
                }
                soundEngine.play('click');
              }}
              className={`flex-1 py-2 rounded-full border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                ctfOpen
                  ? 'bg-[#004a77]/60 border-[#a8c7fa] text-[#c2e7ff]'
                  : 'bg-[#2b2930] border-[#49454f]/40 text-[#c4c6d0]'
              }`}
              title={ctfOpen ? "Turn Off CTF Challenge" : "Turn On CTF Challenge"}
            >
              <i className={`${ctfOpen ? 'ri-flag-2-line' : 'ri-flag-off-line'} text-sm`}></i>
              <span>CTF</span>
            </button>

            {/* CLI Terminal Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onToggleTerminal) {
                  onToggleTerminal();
                } else if (onOpenTerminal) {
                  onOpenTerminal();
                }
                soundEngine.play('click');
              }}
              className={`flex-1 py-2 rounded-full border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                terminalOpen
                  ? 'bg-[#004a77]/60 border-[#a8c7fa] text-[#c2e7ff]'
                  : 'bg-[#2b2930] border-[#49454f]/40 text-[#c4c6d0]'
              }`}
              title={terminalOpen ? "Turn Off Terminal (~)" : "Turn On Terminal (~)"}
            >
              <i className="ri-terminal-box-line text-sm"></i>
              <span>CLI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

