import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface DesktopCompanionProps {
  latency?: number;
}

export const DesktopCompanion: React.FC<DesktopCompanionProps> = ({ latency = 14 }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>('https://la-b-ib.github.io');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      soundEngine.play('click');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // QR Code URL using high-speed SVG/PNG QR API with theme colors (#090b10 bg, #a8c7fa foreground)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=13-14-1a&color=a8-c7-fa&margin=8`;

  return (
    <aside
      aria-label="Desktop Switch to Mobile Workstation"
      className="hidden lg:flex flex-col justify-between w-[400px] xl:w-[430px] h-[824px] xl:h-[836px] max-h-[90dvh] bg-[#13141a]/95 border border-[#44474f]/40 rounded-3xl p-6 shadow-2xl backdrop-blur-xl font-mono text-[#e3e2e6] select-none shrink-0"
    >
      {/* Top Header & Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#fbbc04] animate-ping" />
            <span className="text-[11px] font-bold tracking-widest text-[#fbbc04]">
              DESKTOP_VIEWPORT_DETECTED
            </span>
          </div>
          <span className="text-[11px] text-[#8e9199]">
            PING: <span className="text-[#a8c7fa] font-bold">{latency}ms</span>
          </span>
        </div>

        {/* Main Title & Request Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#a8c7fa]/10 text-[#a8c7fa] text-[11px] font-bold border border-[#a8c7fa]/20 tracking-wider">
            <i className="ri-smartphone-line text-sm"></i>
            OPTIMIZED FOR MOBILE VIEW
          </div>
          <h1 className="text-xl xl:text-2xl font-black tracking-tight text-white leading-tight font-sans">
            Please Switch to Mobile View
          </h1>
          <p className="text-xs text-[#8e9199] leading-relaxed">
            This portfolio and SOC terminal are handcrafted strictly for vertical mobile viewports to deliver haptic-style sound design, tactile gestures, and authentic zero-trust threat logs.
          </p>
        </div>

        {/* Interactive QR Code Card */}
        <div className="bg-[#090b10] border border-[#44474f]/40 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 relative overflow-hidden group">
          {/* Cyber Corner Decals */}
          <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#a8c7fa]/50" />
          <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-[#a8c7fa]/50" />
          <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-[#a8c7fa]/50" />
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-[#a8c7fa]/50" />

          {/* QR Code Container with subtle scanning glow and moving laser */}
          <div className="relative p-2 bg-[#13141a] rounded-xl border border-[#44474f]/40 shadow-inner overflow-hidden">
            {/* Cyber Scanning Laser Line */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#a8c7fa] to-transparent shadow-[0_0_8px_#a8c7fa] pointer-events-none animate-qr-scan z-20" />
            
            <img
              src={qrUrl}
              alt="Scan to open on mobile"
              width={144}
              height={144}
              className="w-32 h-32 xl:w-36 xl:h-36 rounded-lg object-contain block transition-transform duration-300 group-hover:scale-[1.02] relative z-10"
              loading="lazy"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#a8c7fa]">
              <i className="ri-qr-scan-2-line animate-pulse"></i>
              <span>SCAN WITH SMARTPHONE CAMERA</span>
            </div>
            <p className="text-[11px] text-[#8e9199]">
              Instantly opens the full mobile dossier on your phone
            </p>
          </div>
        </div>

        {/* Action Buttons: Copy Link & Share */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={handleCopyLink}
            className="col-span-4 h-11 bg-[#21232b] hover:bg-[#2b2d36] active:scale-[0.98] border border-[#44474f]/50 hover:border-[#a8c7fa]/50 rounded-xl px-3 flex items-center justify-between text-xs text-white transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <i className={`text-base ${copied ? 'ri-check-line text-[#a8e6cf]' : 'ri-file-copy-line text-[#a8c7fa]'}`}></i>
              <span className="truncate font-mono text-[11px] text-[#c4c7c5]">
                {copied ? 'Link Copied to Clipboard!' : currentUrl}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#a8c7fa] group-hover:underline shrink-0">
              {copied ? 'COPIED' : 'COPY'}
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.play('click');
              if (navigator.share) {
                navigator.share({
                  title: 'Labib B. Shahed | Portfolio',
                  text: 'SecDev, DFIR & OSINT Specialist portfolio.',
                  url: currentUrl,
                }).catch(() => {});
              } else {
                handleCopyLink();
              }
            }}
            title="Share or AirDrop link"
            className="col-span-1 h-11 bg-[#21232b] hover:bg-[#2b2d36] active:scale-[0.98] border border-[#44474f]/50 hover:border-[#a8c7fa]/50 rounded-xl flex items-center justify-center text-[#a8c7fa] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <i className="ri-share-forward-line text-base"></i>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry & Desktop Preview Note */}
      <div className="space-y-3 pt-4 border-t border-[#44474f]/30">
        <div className="grid grid-cols-2 gap-2 text-[10px] text-[#8e9199]">
          <div className="bg-[#090b10] p-2 rounded-lg border border-[#44474f]/30">
            <span className="block text-[#a8c7fa] font-bold">ASPECT RATIO</span>
            <span>9:16 VERTICAL</span>
          </div>
          <div className="bg-[#090b10] p-2 rounded-lg border border-[#44474f]/30">
            <span className="block text-[#a8e6cf] font-bold">DEVICE COMPAT</span>
            <span>iOS / ANDROID</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#8e9199]">
          <i className="ri-information-line text-[#a8c7fa] shrink-0 text-sm"></i>
          <span>
            Browsing on desktop? You can still interact with the live console on the right.
          </span>
        </div>
      </div>
    </aside>
  );
};
