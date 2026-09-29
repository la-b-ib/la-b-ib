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
import { CloudflareGate } from './components/CloudflareGate';
import { OrientationLock } from './components/OrientationLock';
import { DesktopCompanion } from './components/DesktopCompanion';
import { DesktopInspector } from './components/DesktopInspector';
import { IPhoneFrame } from './components/IPhoneFrame';

export function App() {
  const [isCfVerified, setIsCfVerified] = useState<boolean>(false);
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

  const handleToggleCtf = () => {
    setCtfOpen((prev) => {
      const next = !prev;
      if (next) {
        setTerminalOpen(false);
        setSearchOpen(false);
      }
      return next;
    });
  };

  const handleOpenCtf = () => {
    setCtfOpen(true);
    setTerminalOpen(false);
    setSearchOpen(false);
  };

  const handleToggleTerminal = () => {
    setTerminalOpen((prev) => {
      const next = !prev;
      if (next) {
        setCtfOpen(false);
        setSearchOpen(false);
      }
      return next;
    });
  };

  const handleOpenTerminal = () => {
    setTerminalOpen(true);
    setCtfOpen(false);
    setSearchOpen(false);
  };

  const handleToggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setTerminalOpen(false);
        setCtfOpen(false);
      }
      return next;
    });
  };

  return (
    <div className="h-[var(--visual-viewport-height,100dvh)] sm:min-h-[100dvh] w-full bg-[#07080c] text-[#e3e2e6] flex flex-col items-center justify-start lg:justify-center font-sans antialiased sm:py-3 lg:py-4 px-0 overflow-hidden relative" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
      {/* Background Ambience & Cyber Grid on Desktop */}
      <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(168,199,250,0.05),transparent_50%),radial-gradient(circle_at_80%_65%,rgba(168,230,207,0.04),transparent_50%)] pointer-events-none" />
      <div className="hidden lg:block absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Desktop HUD Top Telemetry Banner */}
      <header className="hidden lg:flex w-full max-w-7xl items-center justify-between px-6 py-2 mb-2 font-mono text-[11px] text-[#8e9199] border-b border-[#44474f]/25 z-10 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
            SOC_FIELD_WORKSTATION // v8.12
          </span>
          <span className="text-[#44474f]">/</span>
          <span className="text-[#a8c7fa]">OPERATOR: LABIB B. SHAHED</span>
        </div>

        <div className="flex items-center gap-4 text-[10.5px]">
          <span className="text-[#8e9199]">
            TARGET: <strong className="text-white">IPHONE_15_PRO_VIEWPORT</strong>
          </span>
          <span className="text-[#44474f]">/</span>
          <span className="text-[#8e9199]">
            ENCRYPTION: <strong className="text-[#a8e6cf]">TLS_1.3 // ZERO_TRUST</strong>
          </span>
          <span className="text-[#44474f]">/</span>
          <span className="text-[#a8c7fa] font-bold">
            {latency}ms
          </span>
        </div>
      </header>

      {/* Global Mobile Device Orientation Lock Overlay */}
      <OrientationLock />

      {/* Desktop & Mobile Responsive Viewport Wrapper */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-5 xl:gap-8 h-full max-h-[100dvh] lg:max-h-[90dvh] z-10 px-0 sm:px-4">
        {/* Desktop Switch to Mobile Station (Visible on Desktop / Large screens) */}
        <DesktopCompanion latency={latency} />

        {/* Mobile Viewport Hosted inside an authentic iPhone Screen Frame on Desktop */}
        <IPhoneFrame>
          {/* Sticky Top Header (M3 Expressive Top App Bar) */}
          <header className="sticky top-0 z-50 w-full h-[55px] bg-[#000000]/90 backdrop-blur-md border-0 shadow-none mt-0 shrink-0 pt-[env(safe-area-inset-top,0px)] relative overflow-visible flex items-center">
          <div className="relative z-10 w-full h-full flex items-center">
            <Navbar
              activeSection={activeSection}
              onSelectSection={handleNavigate}
              searchDrawerOpen={searchOpen}
              onToggleSearch={handleToggleSearch}
              onCloseSearch={() => setSearchOpen(false)}
              sfxActive={sfxActive}
              onToggleSfx={() => setSfxActive(!sfxActive)}
              ctfOpen={ctfOpen}
              onToggleCtf={handleToggleCtf}
              onOpenCtf={handleOpenCtf}
              terminalOpen={terminalOpen}
              onToggleTerminal={handleToggleTerminal}
              onOpenTerminal={handleOpenTerminal}
              latency={latency}
              hideMenu={!isCfVerified}
            />
          </div>
        </header>

        {/* Main Application Content - Tabbed Single-Section View */}
        <main className={`relative z-10 flex-1 flex flex-col px-0 mt-0 min-h-0 ${terminalOpen || ctfOpen || searchOpen ? "overflow-hidden" : "overflow-y-auto"} [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}>
          {!isCfVerified ? (
            <CloudflareGate onVerified={() => setIsCfVerified(true)} />
          ) : terminalOpen ? (
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
                <HeroSection onOpenTerminal={handleOpenTerminal} onNavigate={handleNavigate} />
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
                <ContactSection isActive={activeSection === 'contact'} />
              </div>
              
              {/* Footer */}
              <Footer
                onNavigate={handleNavigate}
                onOpenTerminal={handleOpenTerminal}
                onOpenCtf={handleOpenCtf}
                latency={latency}
                activeSection={activeSection}
              />
            </>
          )}
        </main>
        </IPhoneFrame>

        {/* Right Flank: SOC Operations Inspector & Remote Section Controller */}
        <DesktopInspector
          latency={latency}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenTerminal={handleOpenTerminal}
          onOpenCtf={handleOpenCtf}
          sfxActive={sfxActive}
          onToggleSfx={() => setSfxActive(!sfxActive)}
          crtActive={crtActive}
          onToggleCrt={() => setCrtActive(!crtActive)}
        />
      </div>
    </div>
  );
}

export default App;
