import React from 'react';
import { soundEngine } from '../utils/soundEngine';

interface FooterProps {
  onNavigate?: (section: string) => void;
  onOpenTerminal?: () => void;
  onOpenCtf?: () => void;
  latency?: number;
  activeSection?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTerminal,
  onOpenCtf,
  latency = 14,
  activeSection,
}) => {
  // Dynamic version calculation starting from v 8.12 on Sept 28, 2026, increasing by 0.1 each week
  const getAppVersion = () => {
    const anchorDate = new Date('2026-09-28T00:00:00Z').getTime();
    const now = new Date().getTime();
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksPassed = Math.max(0, Math.floor((now - anchorDate) / msInWeek));
    const versionValue = 8.12 + weeksPassed * 0.1;
    return `v ${versionValue.toFixed(2)}`;
  };

  return (
    <footer
      className={`mt-auto w-full bg-transparent border-0 border-t-0 shadow-none px-[8px] ${
        activeSection === 'skills' || activeSection === 'threat-map'
          ? 'pt-0'
          : activeSection === 'hero' ||
            activeSection === 'experience' ||
            activeSection === 'about' ||
            activeSection === 'dispatch' ||
            activeSection === 'certificates' ||
            activeSection === 'contact'
          ? 'pt-[15px]'
          : 'pt-6 '
      } pb-[calc(env(safe-area-inset-bottom,0px)+8px)] text-[13px] leading-[16px] font-mono text-[#8e9199] relative z-20`}
      style={{
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingTop: activeSection === 'skills' || activeSection === 'threat-map' ? '0px' : '15px',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
      }}
    >
      <div
        className="max-w-7xl mx-auto px-0 space-y-3"
        style={{ paddingLeft: '0px', paddingRight: '0px' }}
      >
        {/* Merged Single Container maintaining the exact 2-column layout */}
        <div
          className="h-[95px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all shadow-md font-mono"
          style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px', height: '95px' }}
        >
          <div className="grid grid-cols-2 gap-3 h-full">
            {/* Left Column: DEV INFO & TELEMETRY */}
            <div className="flex flex-col justify-between h-full">
              <div className="h-[30px] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#a8c7fa]">
                  <div
                    className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm"
                    style={{ width: '32.9948px', height: '32.9948px' }}
                    title="Dev Info"
                  >
                    <i className="ri-information-2-line"></i>
                  </div>
                  <div className="flex flex-col font-mono text-[#a8c7fa] font-bold shrink-0">
                    <span className="text-[14px] leading-[14px] tracking-tight" style={{ fontSize: '14px', lineHeight: '14px' }}>
                      Dev
                    </span>
                    <span className="text-[14px] leading-[14px] tracking-tight" style={{ fontSize: '14px', lineHeight: '14px' }}>
                      Info
                    </span>
                  </div>
                  {/* Vertical Separation */}
                  <div className="w-[2px] h-7 bg-[#44474f]/60 mx-1 shrink-0" />
                </div>
                <div className="flex flex-col items-end justify-center font-mono shrink-0">
                  <span
                    className="text-[12px] leading-[12px] text-[#a8c7fa] font-mono font-bold"
                    style={{ fontSize: '12px', lineHeight: '12px' }}
                  >
                    {latency}ms
                  </span>
                  <span
                    className="text-[10px] leading-[10px] text-[#8e9199] font-mono mt-1 font-medium"
                    style={{ fontSize: '10px', lineHeight: '10px' }}
                  >
                    {getAppVersion()}
                  </span>
                </div>
              </div>
              <div
                className="h-[37.9948px] bg-[#000000] border border-[#44474f]/30 rounded-xl px-2 flex flex-col items-start justify-center text-left overflow-hidden"
                style={{
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  height: '37.9948px',
                  backgroundColor: '#000000',
                }}
              >
                <span
                  className="text-[12px] font-mono font-bold tracking-tight text-white select-none text-left leading-[14px]"
                  style={{ fontSize: '12px', textAlign: 'left', lineHeight: '14px' }}
                >
                  Labib Bin Shahed
                </span>
                <span
                  className="text-[12px] font-mono font-medium tracking-wider text-[#8e9199] select-none text-left leading-[14px]"
                  style={{ fontSize: '12px', textAlign: 'left', lineHeight: '14px' }}
                >
                  Copyright : {new Date().getFullYear()}
                </span>
              </div>
            </div>

            {/* Right Column: CONTACT & SOCIALS */}
            <div className="flex flex-col justify-between h-full">
              <div className="h-[30px] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#a8c7fa]">
                  <div
                    className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm"
                    style={{ width: '32.9948px', height: '32.9948px' }}
                    title="Contact"
                  >
                    <i className="ri-user-community-line"></i>
                  </div>
                  <span className="text-[16px] leading-[16px]" style={{ fontSize: '16px', lineHeight: '16px' }}>
                    CONTACT
                  </span>
                </div>
              </div>
              <div
                className="h-[38px] bg-[#21232b] border-0 rounded-xl p-0 flex items-center justify-around gap-2"
                style={{
                  paddingLeft: '0px',
                  paddingRight: '0px',
                  paddingTop: '0px',
                  paddingBottom: '0px',
                  backgroundColor: '#21232b',
                  borderWidth: '0px',
                }}
              >
                <a
                  href="https://www.linkedin.com/in/la-b-ib?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.play('click')}
                  className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center text-base shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                  style={{ width: '32.9948px', height: '32.9948px' }}
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <i className="ri-linkedin-box-line"></i>
                </a>
                <a
                  href="https://www.reddit.com/u/la-b-ib"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.play('click')}
                  className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#ff4500] text-white flex items-center justify-center text-base shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                  style={{ width: '32.9948px', height: '32.9948px' }}
                  title="Reddit"
                  aria-label="Reddit"
                >
                  <i className="ri-reddit-line"></i>
                </a>
                <a
                  href="https://x.com/la_b_ib_?s=11"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.play('click')}
                  className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#1da1f2] text-white flex items-center justify-center text-base shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                  style={{ width: '32.9948px', height: '32.9948px' }}
                  title="Twitter"
                  aria-label="Twitter"
                >
                  <i className="ri-twitter-line"></i>
                </a>
                <a
                  href="https://wa.me/@la.b.ib"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.play('click')}
                  className="w-[32.9948px] h-[32.9948px] shrink-0 rounded-lg bg-[#25d366] text-white flex items-center justify-center text-base shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                  style={{ width: '32.9948px', height: '32.9948px' }}
                  title="WhatsApp"
                  aria-label="WhatsApp"
                >
                  <i className="ri-whatsapp-line"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
