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
import { CookieConsentModal } from './components/CookieConsentModal';
import { OfflineStatusModal } from './components/OfflineStatusModal';
import { OrientationLock } from './components/OrientationLock';
import { DesktopRequestScreen } from './components/DesktopRequestScreen';

export function App() {
  const [isCfVerified, setIsCfVerified] = useState<boolean>(false);
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(false);
  const [sfxActive, setSfxActive] = useState<boolean>(true);
  const [crtActive, setCrtActive] = useState<boolean>(true);
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [ctfOpen, setCtfOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [latency, setLatency] = useState<number>(14);
  const [isDesktopOrTab, setIsDesktopOrTab] = useState<boolean>(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState<boolean>(false);
  const [landscapeDismissed, setLandscapeDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkViewport = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const minDim = Math.min(w, h);
      const isLandscape = w > h;

      // Mobile device in landscape: min dimension < 550px or height < 550px in landscape
      const mobileLandscape = isLandscape && (minDim < 550 || h < 550);
      setIsMobileLandscape(mobileLandscape);
      if (!mobileLandscape) {
        setLandscapeDismissed(false); // Reset dismissal when returned to portrait
      }

      // Tablets and desktops: width >= 640px, NOT a mobile phone in landscape
      const isTabletOrDesktop = !mobileLandscape && (w >= 640 || minDim >= 600);
      setIsDesktopOrTab(isTabletOrDesktop);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    window.addEventListener('orientationchange', checkViewport);
    return () => {
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('orientationchange', checkViewport);
    };
  }, []);

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
    if (!isCfVerified || !cookiesAccepted) return;
    setActiveSection(sectionId);
    setTerminalOpen(false);
    setCtfOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleToggleCtf = () => {
    if (!isCfVerified || !cookiesAccepted) return;
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
    if (!isCfVerified || !cookiesAccepted) return;
    setCtfOpen(true);
    setTerminalOpen(false);
    setSearchOpen(false);
  };

  const handleToggleTerminal = () => {
    if (!isCfVerified || !cookiesAccepted) return;
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
    if (!isCfVerified || !cookiesAccepted) return;
    setTerminalOpen(true);
    setCtfOpen(false);
    setSearchOpen(false);
  };

  const handleToggleSearch = () => {
    if (!isCfVerified || !cookiesAccepted) return;
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setTerminalOpen(false);
        setCtfOpen(false);
      }
      return next;
    });
  };

  if (isDesktopOrTab) {
    return <DesktopRequestScreen latency={latency} />;
  }

  return (
    <div
      className="h-[var(--visual-viewport-height,100dvh)] min-h-[100dvh] w-full bg-[#000000] text-[#e3e2e6] flex flex-col font-sans antialiased overflow-hidden relative"
      style={{
        backgroundImage: `url('/header-pyramid-pattern.svg')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '20px 20px',
      }}
    >
      {/* Background overlay for smooth contrast */}
      <div className="absolute inset-0 bg-[#000000]/40 pointer-events-none z-0" />

      {/* Global Mobile Device Orientation Lock Overlay */}
      {isMobileLandscape && !landscapeDismissed && (
        <OrientationLock onOverride={() => setLandscapeDismissed(true)} />
      )}

      {/* Sticky Top Header with 3D Textured Geometric Pattern & 5px Bottom Stroke */}
      <header
        className="sticky top-0 z-50 w-full h-[55px] bg-[#000000]/90 backdrop-blur-md border-b-[5px] border-[#44474f] shadow-md shrink-0 pt-[env(safe-area-inset-top,0px)] flex items-center relative"
        style={{
          backgroundImage: `url('/header-pyramid-pattern.svg')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '20px 20px',
          borderBottomWidth: '5px',
          borderBottomStyle: 'solid',
          borderBottomColor: '#44474f',
        }}
      >
        {/* Subtle dark overlay for contrast */}
        <div className="absolute inset-0 bg-[#000000]/40 pointer-events-none" />
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
            hideMenu={!isCfVerified || !cookiesAccepted}
          />
        </div>
      </header>

      {/* Cookie Consent Modal - Appears after Cloudflare Gate */}
      {isCfVerified && !cookiesAccepted && (
        <CookieConsentModal
          isOpen={!cookiesAccepted}
          onAccept={() => {
            setCookiesAccepted(true);
            try {
              localStorage.setItem('site_cookies_accepted', 'true');
            } catch {
              // ignore
            }
          }}
        />
      )}

      {/* Offline Connectivity Modal - Appears automatically if no internet */}
      <OfflineStatusModal />

      {/* Main Application Content - Tabbed Single-Section View */}
      <main className={`relative z-10 flex-1 flex flex-col px-0 mt-0 min-h-0 ${terminalOpen || ctfOpen || searchOpen || !cookiesAccepted ? "overflow-hidden" : "overflow-y-auto"} [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}>
        <div className={`w-full max-w-7xl mx-auto px-0 sm:px-2 lg:px-4 min-h-full flex flex-col justify-between flex-1 ${!cookiesAccepted && isCfVerified ? "pointer-events-none select-none blur-sm opacity-40 transition-all" : ""}`}>
          {!isCfVerified ? (
            <CloudflareGate onVerified={() => setIsCfVerified(true)} />
          ) : terminalOpen ? (
            <TerminalModal
              isOpen={terminalOpen}
              onClose={() => setTerminalOpen(false)}
              onNavigate={handleNavigate}
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
              <div className={activeSection === 'hero' ? 'block animate-fadeIn pt-[8px]' : 'hidden'} style={{ paddingTop: '8px' }}>
                <HeroSection onOpenTerminal={handleOpenTerminal} onNavigate={handleNavigate} />
              </div>
              <div className={activeSection === 'about' ? 'block animate-fadeIn pt-[8px]' : 'hidden'} style={{ paddingTop: '8px' }}>
                <AboutSection />
              </div>
              <div className={activeSection === 'threat-map' ? 'block animate-fadeIn pt-[8px]' : 'hidden'} style={{ paddingTop: '8px' }}>
                <CyberAttackMapSection crtActive={crtActive} onToggleCrt={() => setCrtActive(!crtActive)} />
              </div>
              <div className={activeSection === 'experience' ? 'block animate-fadeIn pt-[8px]' : 'hidden'} style={{ paddingTop: '8px' }}>
                <MissionsSection />
              </div>
              <div className={activeSection === 'skills' ? 'block animate-fadeIn pt-0' : 'hidden'} style={{ paddingTop: '0px' }}>
                <ArsenalSection />
              </div>
              <div className={activeSection === 'projects' ? 'block animate-fadeIn pt-[8px]' : 'hidden'} style={{ paddingTop: '8px' }}>
                <CasefilesSection />
              </div>
              <div className={activeSection === 'certificates' ? 'block animate-fadeIn pt-0' : 'hidden'} style={{ paddingTop: '0px' }}>
                <CredentialsSection />
              </div>
              <div className={activeSection === 'dispatch' ? 'block animate-fadeIn pt-[8px]' : 'hidden'} style={{ paddingTop: '8px' }}>
                <DispatchSection />
              </div>
              <div className={activeSection === 'contact' ? 'block animate-fadeIn pt-[8px]' : 'hidden'} style={{ paddingTop: '8px' }}>
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
        </div>
      </main>
    </div>
  );
}

export default App;
