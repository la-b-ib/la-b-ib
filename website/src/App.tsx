import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MissionsSection } from './components/MissionsSection';
import { ArsenalSection } from './components/ArsenalSection';
import { CasefilesSection } from './components/CasefilesSection';
import { DispatchSection } from './components/DispatchSection';
import { CredentialsSection } from './components/CredentialsSection';
import { CyberAttackMapSection } from './components/CyberAttackMapSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TerminalModal } from './components/TerminalModal';
import { CtfModal } from './components/CtfModal';
import { SearchSection } from './components/SearchSection';
import { GraphPaperBg } from './components/GraphPaperBg';

export function App() {
  const [sfxActive, setSfxActive] = useState<boolean>(true);
  const [crtActive, setCrtActive] = useState<boolean>(true);
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [ctfOpen, setCtfOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [latency, setLatency] = useState<number>(14);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLatency(12 + Math.floor(Math.random() * 6));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Synchronize visualViewport height to prevent iOS keyboard expansion / phantom scrolling
  React.useEffect(() => {
    const updateViewport = () => {
      const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      document.documentElement.style.setProperty('--visual-viewport-height', `${vh}px`);
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
      
      // Prevent iOS window scroll offset
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
      document.body.scrollTop = 0;
    };

    updateViewport();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
      window.visualViewport.addEventListener('scroll', updateViewport);
    }
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    const handleFocusEvents = () => {
      setTimeout(updateViewport, 30);
      setTimeout(updateViewport, 150);
      setTimeout(updateViewport, 300);
    };

    window.addEventListener('focusin', handleFocusEvents);
    window.addEventListener('focusout', handleFocusEvents);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewport);
        window.visualViewport.removeEventListener('scroll', updateViewport);
      }
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      window.removeEventListener('focusin', handleFocusEvents);
      window.removeEventListener('focusout', handleFocusEvents);
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    setTerminalOpen(false);
    setCtfOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="h-[var(--visual-viewport-height,100dvh)] sm:min-h-[100dvh] w-full bg-[#000000] text-[#e3e2e6] flex flex-col items-center justify-start sm:justify-center font-sans antialiased sm:py-6 sm:px-4 overflow-hidden relative">
      {/* Pure black engineering graph paper background across entire viewport */}
      <GraphPaperBg className="fixed inset-0 z-0 pointer-events-none" opacity={0.8} />

      {/* Mobile Device Viewport Container (Enforces Mobile Viewport on all screens) */}
      <div className="w-full sm:max-w-[430px] h-[var(--visual-viewport-height,100dvh)] sm:h-[880px] sm:max-h-[92dvh] bg-[#000000] border-0 sm:border sm:border-[#49454f]/40 sm:rounded-[40px] shadow-2xl relative flex flex-col justify-start overflow-hidden sm:shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10">
        
        {/* Engineering graph paper background inside mobile container */}
        <GraphPaperBg className="absolute inset-0 z-0 pointer-events-none" opacity={0.8} />

        {/* Mobile Device Top Bar Header with Mobile Frame Toggle */}
        <div className="hidden sm:flex justify-between items-center px-4 pt-2 pb-1 bg-[#000000] sticky top-0 z-[60] border-0 shrink-0">
          <span className="text-[10px] font-mono font-bold text-[#9c88ff] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd137] animate-pulse"></span>
            MOBILE SIMULATOR
          </span>
          <div className="w-16 h-3 bg-[#09080c] rounded-full flex items-center justify-center space-x-1 border border-[#49454f]/30">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1b21] border border-[#49454f]/50"></div>
            <div className="w-8 h-1 rounded-full bg-[#1a1b21]"></div>
          </div>
        </div>

        {/* Sticky Top Header (M3 Expressive Top App Bar with Pure Black WhatsApp Doodle Wallpaper) */}
        <header className="sticky top-0 sm:top-[29px] z-50 w-full h-[55px] bg-[#000000]/90 backdrop-blur-md border-0 shadow-none mt-0 shrink-0 pt-[env(safe-area-inset-top,0px)] sm:pt-0 relative overflow-visible flex items-center">
          <div className="relative z-10 w-full h-full flex items-center">
            <Navbar
              activeSection={activeSection}
              onSelectSection={handleNavigate}
              searchDrawerOpen={searchOpen}
              onToggleSearch={() => setSearchOpen(!searchOpen)}
              onCloseSearch={() => setSearchOpen(false)}
              sfxActive={sfxActive}
              onToggleSfx={() => setSfxActive(!sfxActive)}
              ctfOpen={ctfOpen}
              onToggleCtf={() => setCtfOpen(!ctfOpen)}
              terminalOpen={terminalOpen}
              onToggleTerminal={() => setTerminalOpen(!terminalOpen)}
              onOpenTerminal={() => setTerminalOpen(true)}
              latency={latency}
            />
          </div>
        </header>

        {/* Main Application Content - Tabbed Single-Section View */}
        <main className={`relative z-10 flex-1 flex flex-col px-0 mt-0 min-h-0 ${terminalOpen || ctfOpen || searchOpen ? "overflow-hidden" : "overflow-y-auto"} [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}>
          {terminalOpen ? (
            <TerminalModal
              isOpen={terminalOpen}
              onClose={() => setTerminalOpen(false)}
              
            />
          ) : ctfOpen ? (
            <CtfModal isOpen={ctfOpen} onClose={() => setCtfOpen(false)} />
          ) : searchOpen ? (
            <SearchSection
              isOpen={searchOpen}
              onClose={() => setSearchOpen(false)}
              onSelectSection={handleNavigate}
            />
          ) : (
            <>
              <div className={activeSection === 'hero' ? 'block animate-fadeIn' : 'hidden'}>
                <HeroSection onOpenTerminal={() => setTerminalOpen(true)} onNavigate={handleNavigate} />
              </div>
              <div className={activeSection === 'about' ? 'block animate-fadeIn' : 'hidden'}>
                <AboutSection />
              </div>
              <div className={activeSection === 'threat-map' ? 'block animate-fadeIn' : 'hidden'}>
                <CyberAttackMapSection crtActive={crtActive} onToggleCrt={() => setCrtActive(!crtActive)} />
              </div>
              <div className={activeSection === 'experience' ? 'block animate-fadeIn' : 'hidden'}>
                <MissionsSection />
              </div>
              <div className={activeSection === 'skills' ? 'block animate-fadeIn' : 'hidden'}>
                <ArsenalSection />
              </div>
              <div className={activeSection === 'projects' ? 'block animate-fadeIn' : 'hidden'}>
                <CasefilesSection />
              </div>
              <div className={activeSection === 'certificates' ? 'block animate-fadeIn' : 'hidden'}>
                <CredentialsSection />
              </div>
              <div className={activeSection === 'dispatch' ? 'block animate-fadeIn' : 'hidden'}>
                <DispatchSection />
              </div>
              <div className={activeSection === 'contact' ? 'block animate-fadeIn' : 'hidden'}>
                <ContactSection />
              </div>
              
              {/* Footer - Hidden when Terminal, CTF, or Search section is active */}
              <Footer
                onNavigate={handleNavigate}
                onOpenTerminal={() => setTerminalOpen(true)}
                latency={latency}
                activeSection={activeSection}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
