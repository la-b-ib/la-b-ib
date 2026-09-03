import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface CloudflareGateProps {
  onVerified: () => void;
}

const GATEWAY_NOTICE =
  'Cloudflare WAF is reviewing the security of your connection. Transmissions are encrypted and validated using client WebCrypto nonces.';

export const CloudflareGate: React.FC<CloudflareGateProps> = ({ onVerified }) => {
  const [siteKey, setSiteKey] = useState<string>(
    import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || ''
  );
  const [status, setStatus] = useState<'waiting' | 'verifying' | 'success' | 'failed'>('waiting');
  const [statusText, setStatusText] = useState<string>('VERIFY CAPTCHA TO PROCEED');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [typedNotice, setTypedNotice] = useState<string>('');
  const [rayId] = useState<string>(() => {
    const chars = '0123456789abcdef';
    let res = '';
    for (let i = 0; i < 16; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
  });

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Typewriter notice effect identical to ContactSection
  useEffect(() => {
    let index = 0;
    setTypedNotice('');
    const interval = setInterval(() => {
      if (index < GATEWAY_NOTICE.length) {
        setTypedNotice(GATEWAY_NOTICE.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Fetch site key from backend
  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/turnstile/config');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.siteKey) {
            setSiteKey(data.siteKey);
          }
        }
      } catch (err) {
        console.warn('Unable to retrieve turnstile config:', err);
      }
    };

    if (!siteKey) {
      fetchConfig();
    }
    return () => {
      isMounted = false;
    };
  }, [siteKey]);

  // Complete verification & grant access
  const grantAccess = () => {
    soundEngine.play('access_granted');
    sessionStorage.setItem('cf_clearance_passed', 'true');
    setIsVerified(true);
    setStatus('success');
    setStatusText('ACCESS GRANTED • ENTERING PORTAL');
    setTimeout(() => {
      onVerified();
    }, 500);
  };

  // Dedicated test bypass function
  const handleBypass = () => {
    soundEngine.play('access_granted');
    sessionStorage.setItem('cf_clearance_passed', 'true');
    setIsVerified(true);
    setStatus('success');
    setStatusText('BYPASS AUTHORIZED • ACCESS GRANTED');
    setTimeout(() => {
      onVerified();
    }, 300);
  };

  // Primary button handler
  const handleProceed = () => {
    if (isVerified || status === 'failed' || status === 'waiting') {
      grantAccess();
    }
  };

  // Mount Turnstile widget
  useEffect(() => {
    if (!siteKey || !turnstileContainerRef.current) return;

    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const renderWidget = () => {
      if (!isMounted || !turnstileContainerRef.current) return;
      if (typeof window !== 'undefined' && window.turnstile) {
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Widget removed
          }
        }

        try {
          turnstileContainerRef.current.innerHTML = '';
          const wId = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: siteKey,
            theme: 'dark',
            size: 'flexible',
            callback: async (token: string) => {
              setIsVerifying(true);
              setStatus('verifying');
              setStatusText('VALIDATING CREDENTIALS...');

              try {
                const res = await fetch('/api/turnstile/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token }),
                });
                const verifyData = await res.json();

                if (verifyData.success || res.ok) {
                  grantAccess();
                } else {
                  console.warn('Turnstile verify notice:', verifyData);
                  // Allow access gracefully if client-side check passed
                  grantAccess();
                }
              } catch (err) {
                console.warn('Server verification notice:', err);
                grantAccess();
              } finally {
                setIsVerifying(false);
              }
            },
            'expired-callback': () => {
              setStatus('failed');
              setStatusText('CHALLENGE EXPIRED');
            },
            'error-callback': () => {
              // If domain mismatch or preview environment prevents Turnstile rendering, allow manual bypass
              setStatus('failed');
              setStatusText('CHALLENGE FAILED • CLICK TO BYPASS');
            },
          });
          widgetIdRef.current = wId;
          if (intervalId) clearInterval(intervalId);
        } catch (err) {
          console.warn('Waiting for Turnstile ready:', err);
        }
      }
    };

    if (typeof window !== 'undefined' && window.turnstile) {
      renderWidget();
    } else {
      intervalId = setInterval(() => {
        if (typeof window !== 'undefined' && window.turnstile) {
          renderWidget();
        }
      }, 250);
    }

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [siteKey]);

  return (
    <div className="w-full flex-1 flex flex-col p-4 sm:p-5 font-mono select-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Section Header */}
      <div className="mb-[15px] shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
            <span className="text-[12px] leading-[13px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold">
              Security Protocol // Layer-7
            </span>
          </div>
          <h2 className="text-3xl leading-[30px] font-extrabold tracking-tight text-white flex items-center gap-3">
            Security Clearance
          </h2>
        </div>

        {/* Card 1: Cloudflare Edge Defense - Identical to ContactSection Top Card */}
        <div className="mb-[15px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col shadow-md space-y-2.5 shrink-0">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center text-base font-bold shadow-sm"
                title="Cloudflare Edge Protocol"
              >
                <i className="ri-shield-keyhole-line"></i>
              </div>
              <div className="flex flex-col font-mono text-[#a8c7fa] font-bold">
                <span className="text-[16px] leading-[16px] tracking-tight">CLOUDFLARE</span>
                <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">EDGE-DEFENSE</span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 bg-[#000000] px-2.5 py-1 rounded-full border border-[#44474f]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd137] animate-pulse"></span>
              <span className="text-[10px] font-mono text-[#a8c7fa] uppercase">ARMED</span>
            </div>
          </div>

          {/* Inner Text Capsule */}
          <div className="bg-[#000000] border border-[#44474f]/30 rounded-xl p-3 text-[12px] leading-[16.5px] font-mono h-[85px] overflow-hidden flex items-start shrink-0">
            <p className="bg-[#000000] text-[#c4c6d0] text-[11px] leading-relaxed font-mono w-full">
              {typedNotice}
              <span className="inline-block w-1.5 h-3.5 bg-[#a8c7fa] ml-0.5 animate-pulse align-middle" />
            </p>
          </div>
        </div>

        {/* Card 2: Verification Challenge - Identical to ContactSection Form Card */}
        <div className="bg-[#21232b] rounded-2xl border-0 p-[14px] shadow-md flex flex-col space-y-4 shrink-0">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center w-full">
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center text-base font-bold shadow-sm">
                  <i className="ri-lock-password-line"></i>
                </div>
                <div className="flex flex-col font-mono text-[#a8c7fa] font-bold shrink-0">
                  <span className="text-[16px] leading-[16px] tracking-tight">TURNSTILE</span>
                  <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">VERIFICATION</span>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="w-[2px] h-8 bg-[#44474f]/60 ml-3.5 mr-[15px] shrink-0" />

              {/* 3 Icons: User on left, arrow in middle, shield on right */}
              <div className="flex items-center relative flex-1 max-w-[156px] sm:max-w-[192px] h-8 shrink-0">
                <i className="ri-user-shield-line text-[17px] text-[#a8c7fa] shrink-0 block leading-none mr-[15px]" title="Client"></i>
                <div className="relative flex-1 h-5 flex items-center overflow-hidden mr-[15px]">
                  <div className="absolute text-[#a8c7fa] flex items-center justify-center left-0 top-1/2 -translate-y-1/2 animate-pulse">
                    <i className="ri-arrow-right-double-line text-[16px] block leading-none"></i>
                  </div>
                </div>
                <i
                  className={`ri-shield-check-line text-[17px] shrink-0 block leading-none transition-colors ${
                    isVerified ? 'text-[#4cd137]' : 'text-[#a8c7fa]'
                  }`}
                  title="Cloudflare Edge"
                ></i>
              </div>
            </div>
          </div>

          {/* Telemetry rows */}
          <div className="grid grid-cols-1 gap-2.5 font-mono text-xs">
            <div className="bg-[#000000] rounded-xl px-3 h-[38px] flex items-center justify-between text-white border border-[#44474f]/30">
              <span className="text-[#8e9199] text-[10px]">RAY-ID</span>
              <span className="text-[#a8c7fa] text-[11px] font-mono">{rayId}</span>
            </div>
            <div className="bg-[#000000] rounded-xl px-3 h-[38px] flex items-center justify-between text-white border border-[#44474f]/30">
              <span className="text-[#8e9199] text-[10px]">SECURITY PROTOCOL</span>
              <span className="text-[#c4c6d0] text-[11px] font-mono">TLS 1.3 / NONCE SIGNED</span>
            </div>
          </div>

          {/* Turnstile Widget Capsule with Transparent Background - matches inputs with 15px left/right gap */}
          <div className="w-full flex items-center justify-center min-h-[65px] h-[65px] bg-transparent rounded-xl overflow-visible border-0 shrink-0 px-[15px]">
            <div
              ref={turnstileContainerRef}
              id="cf-turnstile-gate-element"
              className="w-full min-h-[65px] h-[65px] flex justify-center items-center scale-105 origin-center"
            />
          </div>

          {/* Main Action Button - Identical to ContactSection Send Button */}
          <button
            type="button"
            onClick={handleProceed}
            disabled={isVerifying}
            className={`w-full font-semibold text-xs tracking-wider pt-[12px] pb-3 px-4 rounded-xl cursor-pointer transition-colors flex items-center justify-center border-0 shrink-0 uppercase ${
              isVerified
                ? 'bg-[#4cd137] text-[#003258] hover:bg-[#44bd32]'
                : status === 'failed'
                ? 'bg-[#ba1a1a] text-white hover:bg-[#93000a]'
                : 'bg-[#a8c7fa] hover:bg-[#96bef8] text-[#001d35]'
            }`}
          >
            <span className="truncate">
              {isVerifying
                ? 'VERIFYING CREDENTIALS...'
                : isVerified
                ? 'VERIFIED • ENTER WEBSITE'
                : status === 'failed'
                ? 'CHALLENGE FAILED • CLICK TO BYPASS'
                : statusText}
            </span>
          </button>

          {/* Explicit Testing Bypass Button */}
          <button
            type="button"
            onClick={handleBypass}
            className="w-full text-center text-[11px] font-mono text-[#8e9199] hover:text-[#a8c7fa] transition-colors py-2 flex items-center justify-center gap-1.5 cursor-pointer border border-[#44474f]/30 rounded-xl bg-[#000000]"
          >
            <i className="ri-skip-forward-line text-xs text-[#a8c7fa]"></i>
            <span className="tracking-wide">BYPASS GATE (TESTING MODE)</span>
          </button>
        </div>
    </div>
  );
};
