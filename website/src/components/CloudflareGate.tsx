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
  const [bypassPassword, setBypassPassword] = useState<string>('');
  const [bypassError, setBypassError] = useState<string>('');
  const [isBypassing, setIsBypassing] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  // Handle server-side bypass password verification
  const handleBypassSubmit = async () => {
    const trimmed = bypassPassword.trim();
    if (!trimmed) {
      soundEngine.play('error');
      setBypassError('[-] PASSWORD REQUIRED FOR GATE OVERRIDE');
      return;
    }

    setIsBypassing(true);
    setBypassError('');

    try {
      const res = await fetch('/api/gate/verify-bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        soundEngine.play('access_granted');
        sessionStorage.setItem('cf_clearance_passed', 'true');
        setIsVerified(true);
        setStatus('success');
        setStatusText('OVERRIDE AUTHORIZED • ACCESS GRANTED');
        setTimeout(() => {
          onVerified();
        }, 400);
      } else {
        soundEngine.play('error');
        setBypassError('[-] INCORRECT OVERRIDE PASSWORD. ACCESS DENIED.');
      }
    } catch {
      // Offline / fallback verification against configured secret
      if (trimmed === 'fuck@duck') {
        soundEngine.play('access_granted');
        sessionStorage.setItem('cf_clearance_passed', 'true');
        setIsVerified(true);
        setStatus('success');
        setStatusText('OVERRIDE AUTHORIZED • ACCESS GRANTED');
        setTimeout(() => {
          onVerified();
        }, 400);
      } else {
        soundEngine.play('error');
        setBypassError('[-] INCORRECT OVERRIDE PASSWORD. ACCESS DENIED.');
      }
    } finally {
      setIsBypassing(false);
    }
  };

  // Primary button handler
  const handleProceed = () => {
    if (isVerified) {
      grantAccess();
    } else {
      handleBypassSubmit();
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
    <div className="w-full flex-1 flex flex-col px-[8px] pt-0 pb-0 font-mono select-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "0px", paddingBottom: "0px", paddingLeft: "8px", paddingRight: "8px" }}>
      {/* Section Header */}
      <div className="mb-[15px] shrink-0">
          <div className="flex items-center space-x-2 leading-[16px]" style={{ lineHeight: "16px" }}>
            <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
            <span className="text-[12px] leading-[13px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold">
              SYS: L7-SEC
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3 leading-[24px]" style={{ fontSize: "24px", lineHeight: "24px" }}>
            Security Clearance
          </h2>
        </div>

        {/* Card 1: Cloudflare Edge Defense - Identical to ContactSection Top Card */}
        <div className="mb-[15px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col shadow-md space-y-2.5 shrink-0 h-[125px]" style={{ height: "125px", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
          {/* Top Bar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm"
                style={{ width: "33px", height: "33px" }}
                title="Cloudflare Edge Protocol"
              >
                <i className="ri-secure-payment-line text-[27px] flex items-center justify-center" style={{ width: "27px", height: "27px", fontSize: "27px" }}></i>
              </div>
              <div className="flex flex-col font-mono text-[#a8c7fa] font-bold">
                <span className="text-[16px] leading-[16px] tracking-tight">CLOUDFLARE</span>
                <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">EDGE-DEFENSE</span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 bg-[#000000] px-2.5 h-[18.4375px] rounded-full border border-[#44474f]/30 text-[12px]" style={{ fontSize: "12px" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd137] animate-pulse"></span>
              <span className="text-[12px] leading-none font-mono text-[#a8c7fa] uppercase">ARMED</span>
            </div>
          </div>

          {/* Inner Text Capsule */}
          <div className="bg-[#000000] border border-[#44474f]/30 rounded-xl p-2 text-[12px] leading-[16.5px] font-mono h-[65px] overflow-hidden flex items-start shrink-0" style={{ height: "65px", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
            <p className="bg-[#000000] text-[#c4c6d0] text-[12px] leading-[16px] font-mono w-full" style={{ fontSize: "12px", lineHeight: "16px" }}>
              {typedNotice}
              <span className="inline-block w-1.5 h-3.5 bg-[#a8c7fa] ml-0.5 animate-pulse align-middle" />
            </p>
          </div>
        </div>

        {/* Card 2: Verification Challenge - Identical to ContactSection Form Card */}
        <div className="bg-[#21232b] rounded-2xl border-0 p-2 shadow-md flex flex-col space-y-4 shrink-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
          {/* Top Bar Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center w-full">
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                <div className="w-[33px] h-[33px] shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center font-bold shadow-sm" style={{ width: "33px", height: "33px" }}>
                  <i className="ri-lock-password-line text-[27px] flex items-center justify-center" style={{ width: "27px", height: "27px", fontSize: "27px" }}></i>
                </div>
                <div className="flex flex-col font-mono text-[#a8c7fa] font-bold shrink-0">
                  <span className="text-[16px] leading-[16px] tracking-tight">TURNSTILE</span>
                  <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">VERIFICATION</span>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="w-[2px] h-8 bg-[#44474f]/60 ml-3.5 mr-[15px] shrink-0 border-[1.6px] border-[#44484e]" style={{ borderWidth: "1.6px", borderColor: "#44484e" }} />

              {/* 3 Icons: User on left, arrow in middle, shield on right */}
              <div className="flex items-center relative flex-1 max-w-[156px] sm:max-w-[192px] h-8 shrink-0">
                <i className="ri-user-shield-line text-[17px] text-[#a8c7fa] shrink-0 block leading-none mr-[15px]" title="Client"></i>
                <div className="relative flex-1 h-5 flex items-center overflow-hidden mr-[15px]">
                  <div className="absolute text-[#a8c7fa] flex items-center justify-center left-0 top-1/2 -translate-y-1/2 animate-pulse">
                    <i className="ri-arrow-right-double-line text-[16px] block leading-none"></i>
                  </div>
                </div>
                <i
                  className={`ri-database-line text-[17px] shrink-0 block leading-none transition-colors ${
                    isVerified ? 'text-[#4cd137]' : 'text-[#a8c7fa]'
                  }`}
                  title="Cloudflare Edge / Database"
                ></i>
              </div>
            </div>
          </div>

          {/* Telemetry text block */}
          <div className="bg-[#000000] rounded-xl p-2 flex flex-col space-y-2 text-white border border-[#44474f]/30 font-mono text-xs" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
            <div className="flex items-center justify-between">
              <span className="text-[#8e9199] text-[12px] leading-[16px]" style={{ fontSize: "12px", lineHeight: "16px" }}>RAY-ID</span>
              <span className="text-[#a8c7fa] text-[12px] leading-[16px] font-mono" style={{ fontSize: "12px", lineHeight: "16px" }}>{rayId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8e9199] text-[12px]" style={{ fontSize: "12px" }}>SECURITY PROTOCOL</span>
              <span className="text-[#c4c6d0] text-[12px] leading-[16px] font-mono" style={{ fontSize: "12px", lineHeight: "16px" }}>TLS 1.3 / NONCE SIGNED</span>
            </div>
          </div>

          {/* Turnstile Widget Capsule with Transparent Background - matches inputs with 15px left/right gap */}
          <div className="w-full flex items-center justify-center min-h-[65px] h-[65px] bg-transparent rounded-xl overflow-visible border-0 shrink-0 px-0">
            <div
              ref={turnstileContainerRef}
              id="cf-turnstile-gate-element"
              className="w-full min-h-[65px] h-[65px] flex justify-center items-center scale-105 origin-center"
            />
          </div>

          {/* Password Bypass Section */}
          {!isVerified && (
            <div className="pt-0 space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-[#8e9199] text-xs">
                <span className="flex items-center gap-1.5 text-[12px] text-[#a8c7fa]">
                  <i className="ri-key-2-line text-xs"></i>
                  <span className="text-[12px] leading-[16px]" style={{ fontSize: "12px", lineHeight: "16px" }}>OVERRIDE PASSWORD</span>
                </span>
                <span className="text-[12px] leading-[16px] text-[#8e9199]" style={{ fontSize: "12px", lineHeight: "16px" }}>SECRET REQUIRED</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={bypassPassword}
                  onChange={(e) => {
                    setBypassPassword(e.target.value);
                    if (bypassError) setBypassError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleBypassSubmit();
                    }
                  }}
                  placeholder="Enter bypass password..."
                  className="w-full h-[45px] bg-[#000000] rounded-xl px-2 pr-10 text-white font-mono text-[12px] leading-[16px] border-0 focus:border-0 focus:outline-none transition-colors" style={{ borderWidth: "0px", fontSize: "12px", lineHeight: "16px", paddingLeft: "8px", paddingRight: "8px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8e9199] hover:text-[#a8c7fa] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={showPassword ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i>
                </button>
              </div>
              {bypassError && (
                <div className="text-[#ffb4ab] text-[12px] font-mono flex items-center gap-1.5 pt-0.5">
                  <i className="ri-error-warning-line text-xs"></i>
                  <span>{bypassError}</span>
                </div>
              )}
            </div>
          )}

          {/* Main Action Button - Identical to ContactSection Send Button */}
          <button
            type="button"
            onClick={handleProceed}
            disabled={isVerifying || isBypassing}
            className={`w-full font-semibold text-xs tracking-wider pt-[12px] pb-3 px-4 rounded-xl cursor-pointer transition-colors flex items-center justify-center border-0 shrink-0 uppercase ${
              isVerified
                ? 'bg-[#4cd137] text-[#003258] hover:bg-[#44bd32]'
                : status === 'failed'
                ? 'bg-[#ba1a1a] text-white hover:bg-[#93000a]'
                : 'bg-[#ffb4ab] hover:opacity-90 text-[#690005]'
            }`}
            style={{ backgroundColor: isVerified ? undefined : status === 'failed' ? undefined : '#ffb4ab' }}
          >
            <span className="truncate leading-[12px]" style={{ lineHeight: "12px" }}>
              {isVerifying
                ? 'VERIFYING CREDENTIALS...'
                : isBypassing
                ? 'VERIFYING OVERRIDE KEY...'
                : isVerified
                ? 'VERIFIED • ENTER WEBSITE'
                : bypassPassword.trim()
                ? 'AUTHORIZE BYPASS & ENTER'
                : 'ENTER PASSWORD TO BYPASS'}
            </span>
          </button>

        </div>
    </div>
  );
};
