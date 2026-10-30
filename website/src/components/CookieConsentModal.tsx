import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface CookieConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const CookieConsentModal: React.FC<CookieConsentModalProps> = ({ isOpen, onAccept }) => {
  const [declinedNotice, setDeclinedNotice] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    soundEngine.play('access_granted');
    onAccept();
  };

  const handleDecline = () => {
    soundEngine.play('terminal_key');
    setDeclinedNotice(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie & Session Authorization"
      className="fixed left-0 right-0 bottom-0 z-40 bg-transparent flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn font-mono overflow-y-auto"
      style={{
        top: 'calc(55px + env(safe-area-inset-top, 0px))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="w-full max-w-md bg-[#21232b] text-[#e3e2e6] rounded-3xl p-2 shadow-2xl border-0 flex flex-col relative overflow-hidden my-auto"
        style={{
          paddingLeft: '8px',
          paddingRight: '8px',
          paddingTop: '8px',
          paddingBottom: '8px',
          borderWidth: '0px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-[35px] h-[35px] min-w-[35px] min-h-[35px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm site-card-icon-35"
              title="Cookie Authorization"
            >
              <i className="ph-bold ph-cookie flex items-center justify-center"></i>
            </div>
            <div>
              <div
                className="text-[12px] text-[#a8c7fa] tracking-wider uppercase font-semibold leading-none"
                style={{ fontSize: '12px' }}
              >
                SECURITY CLEARANCE
              </div>
              <h2
                className="text-[16px] font-bold text-white tracking-tight mt-0.5 leading-[16px]"
                style={{ fontSize: '16px', lineHeight: '16px' }}
              >
                Cookie Authorization
              </h2>
            </div>
          </div>
          {/* Circular Action Buttons replacing ZERO-TRUST badge */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAccept}
              title="Accept Cookies"
              aria-label="Accept Cookies"
              className="w-[35px] h-[35px] min-w-[35px] min-h-[35px] rounded-full bg-[#a8c7fa] text-[#001d35] flex items-center justify-center cursor-pointer transition-all shadow-sm active:scale-95 site-icon-btn-35"
            >
              <i className="ph-bold ph-beer-stein flex items-center justify-center"></i>
            </button>

            <button
              type="button"
              onClick={handleDecline}
              title="Decline Cookies"
              aria-label="Decline Cookies"
              className="w-[35px] h-[35px] min-w-[35px] min-h-[35px] rounded-full bg-[#ffb4ab] text-[#690005] flex items-center justify-center cursor-pointer transition-all active:scale-95 site-icon-btn-35"
            >
              <i className="ph-bold ph-trash flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        {/* Description Body */}
        <div className="space-y-2.5 text-[14px] leading-[16px] text-[#c4c6d0]">
          <p className="text-justify" style={{ textAlign: 'justify' }}>
            Accepting cookies unlocks full site navigation, live attack maps, interactive terminal CLI, and encrypted transmissions.
          </p>

          {/* Breakdown Box */}
          <div
            className="bg-[#13141a] rounded-2xl p-2 border border-[#44474f]/25 space-y-2 text-[11px] leading-[15px]"
            style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
          >
            <div className="flex items-start gap-2">
              <i className="ph-bold ph-keyhole text-[#a8c7fa] text-[18px] shrink-0" style={{ marginTop: '0px' }}></i>
              <div>
                <span className="text-white font-semibold block text-[16px]" style={{ fontSize: '16px' }}>Session & Clearance Tokens</span>
                <span className="text-[#8e9199] text-[12px] block text-justify" style={{ fontSize: '12px', textAlign: 'justify' }}>Stores Cloudflare verification, TLS handshake state, and CSRF protection.</span>
              </div>
            </div>
            <div className="flex items-start gap-2 pt-1 border-t border-[#44474f]/20">
              <i className="ph-bold ph-sliders-horizontal text-[#a8e6cf] text-[18px] shrink-0" style={{ marginTop: '0px' }}></i>
              <div>
                <span className="text-white font-semibold block text-[16px]" style={{ fontSize: '16px' }}>Terminal & Audio State</span>
                <span className="text-[#8e9199] text-[12px] block text-justify" style={{ fontSize: '12px', textAlign: 'justify' }}>Remembers SFX synthesizer audio state, CRT toggle, and navigation preferences.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning if declined */}
        {declinedNotice && (
          <div
            className="mt-3 rounded-xl bg-[#ba1a1a]/20 border-0 text-[#ffb4ab] flex items-start gap-2 animate-fadeIn"
            style={{
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '8px',
              paddingBottom: '8px',
              borderWidth: '0px',
            }}
          >
            <i className="ph-bold ph-warning text-[#ffb4ab] text-[18px] shrink-0 mt-0.5"></i>
            <div style={{ fontSize: '12px', textAlign: 'justify' }} className="text-[12px] leading-[16px] text-justify">
              <strong className="block font-semibold" style={{ fontSize: '16px' }}>
                ACCESS RESTRICTED
              </strong>
              Essential security tokens are required for the zero-trust architecture. You must accept cookies to access and use the site.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
