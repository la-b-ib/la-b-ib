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
              className="w-[33px] h-[33px] rounded-[8px] bg-[#a8c7fa] flex items-center justify-center text-lg shrink-0 border border-[#a8c7fa]/30"
              style={{
                backgroundColor: '#a8c7fa',
                width: '32.9948px',
                height: '32.9948px',
                borderRadius: '8px',
              }}
            >
              <i className="ri-cookie-line text-[#003258]" style={{ color: '#003258' }}></i>
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
              className="w-[33px] h-[33px] rounded-full bg-[#a8c7fa] hover:bg-[#96bef8] text-[#001d35] flex items-center justify-center cursor-pointer transition-colors shadow-sm active:scale-95"
            >
              <i className="ri-beer-line text-base"></i>
            </button>

            <button
              type="button"
              onClick={handleDecline}
              title="Decline Cookies"
              aria-label="Decline Cookies"
              className="w-[33px] h-[33px] rounded-full bg-[#ffb4ab] hover:opacity-90 flex items-center justify-center cursor-pointer transition-opacity active:scale-95"
              style={{ backgroundColor: '#ffb4ab' }}
            >
              <i className="ri-delete-bin-5-line text-base text-[#690005]" style={{ color: '#690005' }}></i>
            </button>
          </div>
        </div>

        {/* Description Body */}
        <div className="space-y-2.5 text-[12px] leading-[17px] text-[#c4c6d0]">
          <p>
            Accepting cookies unlocks full site navigation, live attack maps, interactive terminal CLI, and encrypted transmissions.
          </p>

          {/* Breakdown Box */}
          <div
            className="bg-[#13141a] rounded-2xl p-2 border border-[#44474f]/25 space-y-2 text-[11px] leading-[15px]"
            style={{ paddingLeft: '8px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}
          >
            <div className="flex items-start gap-2">
              <i className="ri-shield-keyhole-line text-[#a8c7fa] text-xs mt-0.5 shrink-0"></i>
              <div>
                <span className="text-white font-semibold block text-[16px]" style={{ fontSize: '16px' }}>Session & Clearance Tokens</span>
                <span className="text-[#8e9199] text-[12px]" style={{ fontSize: '12px' }}>Stores Cloudflare verification, TLS handshake state, and CSRF protection.</span>
              </div>
            </div>
            <div className="flex items-start gap-2 pt-1 border-t border-[#44474f]/20">
              <i className="ri-equalizer-line text-[#a8e6cf] text-xs mt-0.5 shrink-0"></i>
              <div>
                <span className="text-white font-semibold block text-[16px]" style={{ fontSize: '16px' }}>Terminal & Audio State</span>
                <span className="text-[#8e9199] text-[12px]" style={{ fontSize: '12px' }}>Remembers SFX synthesizer audio state, CRT toggle, and navigation preferences.</span>
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
            <i className="ri-alert-line text-sm shrink-0 mt-0.5"></i>
            <div style={{ fontSize: '12px' }} className="text-[12px] leading-[16px]">
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
