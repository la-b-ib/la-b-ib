import React from 'react';
import { soundEngine } from '../utils/soundEngine';

interface MobileBottomDockProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  terminalOpen?: boolean;
  ctfOpen?: boolean;
  searchOpen?: boolean;
  settingsOpen?: boolean;
  onToggleSettings?: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  activeSection,
  onSelectSection,
  terminalOpen = false,
  ctfOpen = false,
  searchOpen = false,
  settingsOpen = false,
  onToggleSettings,
}) => {
  // Primary mobile navigation items - all sections included + settings
  const mainNavs = [
    { id: 'hero', label: 'Home', icon: 'ri-home-5-line' },
    { id: 'about', label: 'Brief', icon: 'ri-user-search-line' },
    { id: 'threat-map', label: 'Radar', icon: 'ri-radar-line' },
    { id: 'experience', label: 'Missions', icon: 'ri-crosshair-2-line' },
    { id: 'skills', label: 'Arsenal', icon: 'ri-tools-line' },
    { id: 'projects', label: 'Casefiles', icon: 'ri-folder-shield-2-line' },
    { id: 'certificates', label: 'Credentials', icon: 'ri-award-line' },
    { id: 'blog', label: 'Dispatches', icon: 'ri-article-line' },
    { id: 'contact', label: 'Contact', icon: 'ri-mail-send-line' },
    { id: 'settings', label: 'Settings', icon: 'ri-settings-4-line' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090b10] border-0 pt-3 pb-3 px-[15px]">
      <div className="bg-[#141218]/95 backdrop-blur-xl border border-[#44474f]/60 rounded-2xl p-1.5 px-[15px] shadow-2xl flex items-center justify-around max-w-md mx-auto">
        {/* Main Section Navigation Pills */}
        <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5 w-full snap-x snap-mandatory">
          {mainNavs.map((item) => {
            const isSettings = item.id === 'settings';
            const isActive = isSettings
              ? settingsOpen
              : activeSection === item.id && !terminalOpen && !ctfOpen && !searchOpen && !settingsOpen;

            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.play('click');
                  if (isSettings) {
                    if (onToggleSettings) {
                      onToggleSettings();
                    }
                  } else {
                    onSelectSection(item.id);
                  }
                }}
                title={item.label}
                aria-label={item.label}
                className={`flex flex-col items-center justify-center shrink-0 w-[calc((100%-16px)/5)] aspect-square p-0.5 rounded-xl transition-all cursor-pointer snap-start ${
                  isActive
                    ? 'bg-[#004a77] text-[#c2e7ff] shadow-sm border border-[#a8c7fa]/40'
                    : 'text-[#8e9199] hover:text-[#c4c6d0] hover:bg-[#21232b]/50'
                }`}
              >
                <i className={`${item.icon} text-lg leading-none ${isActive ? 'text-[#a8c7fa]' : ''}`}></i>
                <span className="text-[10px] font-medium tracking-tight truncate max-w-full mt-1 leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
