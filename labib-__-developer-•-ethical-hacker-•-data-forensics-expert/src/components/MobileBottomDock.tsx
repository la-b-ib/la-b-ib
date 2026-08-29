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
    { id: 'experience', label: 'Missions', icon: 'ri-brain-line' },
    { id: 'skills', label: 'Arsenal', icon: 'ri-pencil-ruler-line' },
    { id: 'projects', label: 'Casefiles', icon: 'ri-folder-shield-2-line' },
    { id: 'certificates', label: 'Credentials', icon: 'ri-certificate-2-line' },
    { id: 'dispatch', label: 'Dispatch', icon: 'ri-article-line' },
    { id: 'contact', label: 'Contact', icon: 'ri-mail-send-line' },
    { id: 'settings', label: 'Settings', icon: 'ri-settings-5-line' },
  ];

  return (
    <div className="fixed sm:sticky bottom-0 left-0 right-0 sm:left-auto sm:right-auto w-full z-40 bg-black h-[calc(94px+env(safe-area-inset-bottom,0px))] sm:h-[94px] pt-[15px] pb-[calc(15px+env(safe-area-inset-bottom,0px))] sm:pb-[15px] px-[15px] flex items-center justify-center">
      <div className="bg-[#21232b] backdrop-blur-xl border-0 rounded-2xl p-1.5 px-[15px] shadow-2xl flex items-center justify-around w-full max-w-md sm:max-w-[430px] h-[64px]">
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
                className={`flex flex-col items-center justify-center shrink-0 w-[calc((100%-16px)/5)] h-[52px] p-0.5 rounded-xl transition-all cursor-pointer snap-start ${
                  isActive
                    ? 'bg-[#a8c7fa] text-[#001d35] font-semibold shadow-sm border-0'
                    : 'text-[#8e9199] hover:text-[#c4c6d0] hover:bg-[#21232b]/50'
                }`}
              >
                <i className={`${item.icon} text-lg leading-none ${isActive ? 'text-[#001d35]' : ''}`}></i>
                <span className="text-[10px] font-medium tracking-tight truncate max-w-full mt-1 leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
