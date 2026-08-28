import React, { useState, useEffect, useRef } from 'react';
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
  const navRef = useRef<HTMLDivElement>(null);

  const isSearchOpen = controlledSearchOpen !== undefined ? controlledSearchOpen : localSearchOpen;

  // Auto-close hamburger menu on outside click or escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

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
    { label: 'INTEL BRIEF', icon: 'ri-user-search-line', num: '01', href: '#about' },
    { label: 'THREAT RADAR', icon: 'ri-radar-line', num: '02', href: '#threat-map' },
    { label: 'MISSIONS', icon: 'ri-brain-line', num: '03', href: '#experience' },
    { label: 'ARSENAL', icon: 'ri-pencil-ruler-line', num: '04', href: '#skills' },
    { label: 'CASEFILES', icon: 'ri-folder-shield-2-line', num: '05', href: '#projects' },
    { label: 'DISPATCH', icon: 'ri-article-line', num: '06', href: '#dispatch' },
    { label: 'CREDENTIALS', icon: 'ri-certificate-2-line', num: '07', href: '#certificates' },
    { label: 'ENCRYPTED', icon: 'ri-mail-send-line', num: '08', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    soundEngine.play('click');
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    onSelectSection(targetId);
  };

  return (
    <div ref={navRef} className="w-full pt-0 pb-2.5 relative">
      <div className="max-w-7xl mx-auto px-[15px] sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Google Style Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="flex items-center gap-[5px] group shrink-0"
        >
          {/* Header Brand Logo Image */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-none sm:rounded-xl bg-[#21232b] transition-all overflow-hidden shrink-0">
            <img
              src="https://raw.githubusercontent.com/la-b-ib/la-b-ib/main/website%20assets/header%20%26%20footer/header.JPEG"
              alt="Labib Logo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="text-[20px] font-bold tracking-tight text-white flex items-center gap-1.5">
              labib
              <i className="ri-verified-badge-line text-[#a8c7fa]"></i>
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
            className={`w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
              mobileMenuOpen
                ? 'bg-[#ffb4ab] text-[#690005] shadow-md border-0'
                : 'bg-[#2b2930] hover:bg-[#36343b] border border-[#49454f]/50 text-[#e3e2e6]'
            }`}
            aria-label="Toggle navigation menu"
          >
            <i className={mobileMenuOpen ? 'ri-close-circle-line text-lg font-bold' : 'ri-list-indefinite text-lg font-bold'}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Top Sheet - M3 Expressive Modal Surface */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 w-full bg-[#000000] backdrop-blur-2xl border-b-0 px-[15px] py-[15px] space-y-4 text-xs max-h-[85vh] overflow-y-auto shadow-2xl rounded-b-3xl mt-0 animate-fadeIn z-50">
          {/* Mobile Search Input */}
          <div className="w-full pb-1">
            <HeaderSearch
              placeholder=""
              iconPosition="right"
              iconName="ri-menu-search-line"
              inputClassName="rounded-[16px]"
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
                  className={`cursor-pointer transition-all flex items-center space-x-2.5 px-3.5 h-[48px] border-0 rounded-full font-bold text-sm ${
                    isActive
                      ? 'bg-[#a8c7fa] text-[#001d35] shadow-md'
                      : 'bg-[#2b2930]/80 hover:bg-[#36343b] text-[#e3e2e6]'
                  }`}
                >
                  <i className={`${link.icon} text-base shrink-0 ${isActive ? 'text-[#001d35]' : 'text-[#a8c7fa]'}`}></i>
                  <span className="truncate text-[14px]">{formattedLabel}</span>
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
              className={`flex-1 h-[45px] rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                sfxActive
                  ? 'bg-[#a8c7fa] border-0 text-[#001d35]'
                  : 'bg-[#2b2930] border border-[#49454f]/40 text-[#c4c6d0]'
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
              className={`flex-1 h-[45px] rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                ctfOpen
                  ? 'bg-[#a8c7fa] border-0 text-[#001d35]'
                  : 'bg-[#2b2930] border border-[#49454f]/40 text-[#c4c6d0]'
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
              className={`flex-1 h-[45px] rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                terminalOpen
                  ? 'bg-[#a8c7fa] border-0 text-[#001d35]'
                  : 'bg-[#2b2930] border border-[#49454f]/40 text-[#c4c6d0]'
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

