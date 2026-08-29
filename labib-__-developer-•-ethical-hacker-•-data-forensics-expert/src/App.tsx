import React, { useState, useEffect } from 'react';
import { HudTopbar } from './components/HudTopbar';
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
import { SettingsModal } from './components/SettingsModal';
import { MobileBottomDock } from './components/MobileBottomDock';
import { DesktopMobileNoticeScreen } from './components/DesktopMobileNoticeScreen';

export function App() {
  const [sfxActive, setSfxActive] = useState<boolean>(true);
  const [crtActive, setCrtActive] = useState<boolean>(true);
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [ctfOpen, setCtfOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [latency, setLatency] = useState<number>(14);

  // Desktop viewport detection & mobile frame simulator state
  const [isDesktopWidth, setIsDesktopWidth] = useState<boolean>(false);
  const [bypassDesktopNotice, setBypassDesktopNotice] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopWidth(window.innerWidth >= 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLatency(12 + Math.floor(Math.random() * 6));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    setTerminalOpen(false);
    setCtfOpen(false);
    setSearchOpen(false);
    setSettingsOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // If user is viewing on desktop screen and has not launched simulated mobile frame
  if (isDesktopWidth && !bypassDesktopNotice) {
    return (
      <DesktopMobileNoticeScreen
        onLaunchSimulator={() => setBypassDesktopNotice(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#09080c] text-[#e3e2e6] flex flex-col items-center justify-start sm:justify-center font-sans antialiased sm:py-6 sm:px-4">
      {/* Background ambient glow for desktop presentation */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#9c88ff]/10 via-[#0f0e13]/80 to-[#09080c] hidden sm:block" />

      {/* Mobile Device Viewport Container (Enforces Mobile Viewport on all screens) */}
      <div className="w-full sm:max-w-[430px] h-[100dvh] sm:h-[880px] sm:max-h-[92vh] bg-[#0f0e13] border-0 sm:border sm:border-[#49454f]/40 sm:rounded-[40px] shadow-2xl relative flex flex-col justify-start overflow-x-clip sm:overflow-x-hidden overflow-hidden sm:shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Mobile Device Top Bar Header with Mobile Frame Toggle */}
        <div className="hidden sm:flex justify-between items-center px-4 pt-2 pb-1 bg-[#141218] sticky top-0 z-[60] border-b border-[#49454f]/20">
          <span className="text-[10px] font-mono font-bold text-[#9c88ff] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd137] animate-pulse"></span>
            MOBILE SIMULATOR
          </span>
          <div className="w-16 h-3 bg-[#09080c] rounded-full flex items-center justify-center space-x-1 border border-[#49454f]/30">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1b21] border border-[#49454f]/50"></div>
            <div className="w-8 h-1 rounded-full bg-[#1a1b21]"></div>
          </div>
          <button
            onClick={() => setBypassDesktopNotice(false)}
            className="text-[10px] font-mono text-[#7f8fa6] hover:text-white transition-colors cursor-pointer"
            title="Return to Desktop Screen"
          >
            <i className="ri-logout-box-r-line"></i> EXIT
          </button>
        </div>

        {/* Sticky Top Header (M3 Expressive Top App Bar) */}
        <header className="sticky top-0 sm:top-[29px] z-50 w-full bg-[#141218]/95 backdrop-blur-md border-b border-[#49454f]/20 shadow-none mt-0 shrink-0 pt-[env(safe-area-inset-top,0px)] sm:pt-0">
          <HudTopbar
            sfxActive={sfxActive}
            onToggleSfx={() => setSfxActive(!sfxActive)}
            crtActive={crtActive}
            onToggleCrt={() => setCrtActive(!crtActive)}
            terminalOpen={terminalOpen}
            onToggleTerminal={() => setTerminalOpen(!terminalOpen)}
            onOpenTerminal={() => setTerminalOpen(true)}
            searchOpen={searchOpen}
            onToggleSearch={() => setSearchOpen(!searchOpen)}
            ctfOpen={ctfOpen}
            onToggleCtf={() => setCtfOpen(!ctfOpen)}
            
            latency={latency}
          />
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
        </header>

        {/* Main Application Content - Tabbed Single-Section View */}
        <main className={`relative z-10 flex-1 flex flex-col px-0 mt-0 min-h-0 ${terminalOpen || ctfOpen || settingsOpen || searchOpen ? "overflow-hidden" : "overflow-y-auto"}`}>
          {terminalOpen ? (
            <TerminalModal
              isOpen={terminalOpen}
              onClose={() => setTerminalOpen(false)}
              
            />
          ) : ctfOpen ? (
            <CtfModal isOpen={ctfOpen} onClose={() => setCtfOpen(false)} />
          ) : settingsOpen ? (
            <SettingsModal
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              sfxActive={sfxActive}
              onToggleSfx={() => setSfxActive(!sfxActive)}
              crtActive={crtActive}
              onToggleCrt={() => setCrtActive(!crtActive)}
              onOpenTerminal={() => {
                setSettingsOpen(false);
                setTerminalOpen(true);
              }}
              onOpenCtf={() => {
                setSettingsOpen(false);
                setCtfOpen(true);
              }}
              onOpenSearch={() => {
                setSettingsOpen(false);
                setSearchOpen(true);
              }}
              latency={latency}
            />
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
              
              {/* Footer - Hidden when Terminal, CTF, Settings, or Search section is active */}
              <Footer
                onNavigate={handleNavigate}
                onOpenTerminal={() => setTerminalOpen(true)}
                
                latency={latency}
                activeSection={activeSection}
              />
            </>
          )}
        </main>

        {/* Mobile Floating Quick Dock */}
        <MobileBottomDock
          activeSection={activeSection}
          onSelectSection={handleNavigate}
          searchOpen={searchOpen}
          ctfOpen={ctfOpen}
          terminalOpen={terminalOpen}
          settingsOpen={settingsOpen}
          onToggleSettings={() => setSettingsOpen(!settingsOpen)}
        />
      </div>
    </div>
  );
}

export default App;
