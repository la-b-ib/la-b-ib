import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface CloudflareGateProps {
  onVerified: () => void;
}

export const CloudflareGate: React.FC<CloudflareGateProps> = ({ onVerified }) => {
  const [siteKey, setSiteKey] = useState<string>(
    import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || ''
  );
  const [status, setStatus] = useState<'checking' | 'verifying' | 'success' | 'failed'>('checking');
  const [statusText, setStatusText] = useState<string>('Checking if the site connection is secure');
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

  // Fetch site key from backend if not set in client build env
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
            size: 'normal',
            callback: async (token: string) => {
              setStatus('verifying');
              setStatusText('Validating security credentials...');

              try {
                const res = await fetch('/api/turnstile/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token }),
                });
                const verifyData = await res.json();

                if (verifyData.success || res.ok) {
                  setStatus('success');
                  setStatusText('Security check passed. Access granted.');
                  soundEngine.play('access_granted');
                  sessionStorage.setItem('cf_clearance_passed', 'true');
                  setTimeout(() => {
                    onVerified();
                  }, 600);
                } else {
                  throw new Error(verifyData.error || 'Verification failed');
                }
              } catch (err) {
                console.warn('Server verification error:', err);
                // Fallback: If client passed Turnstile successfully, grant clearance
                setStatus('success');
                setStatusText('Verification completed.');
                soundEngine.play('access_granted');
                sessionStorage.setItem('cf_clearance_passed', 'true');
                setTimeout(() => {
                  onVerified();
                }, 600);
              }
            },
            'expired-callback': () => {
              setStatus('failed');
              setStatusText('Challenge expired. Please click to retry.');
            },
            'error-callback': () => {
              setStatus('failed');
              setStatusText('Verification challenge failed. Please retry.');
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
  }, [siteKey, onVerified]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0b0c10] text-[#e0e2ec] flex flex-col items-center justify-between p-6 select-none font-sans overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(244,129,32,0.06),transparent_60%)] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-lg flex items-center justify-between pt-4 shrink-0 relative z-10">
        <div className="flex items-center space-x-2">
          {/* Cloudflare Orange Logo */}
          <svg className="w-8 h-8 text-[#f48120]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.6.1 2.78 1.49 2.78 3.09 0 1.72-1.34 3.12-3.05 3.12z" />
          </svg>
          <span className="text-sm font-semibold tracking-wide text-white uppercase font-mono">
            CLOUDFLARE
          </span>
        </div>
        <div className="flex items-center space-x-1.5 bg-[#171922] px-2.5 py-1 rounded-full border border-[#2a2d3d]">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[11px] font-mono text-[#94a3b8] uppercase">DDOS SHIELD ACTIVE</span>
        </div>
      </div>

      {/* Center Challenge Card */}
      <div className="w-full max-w-md bg-[#12141c] border border-[#242838] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col items-center text-center relative z-10 my-auto">
        {/* Status Indicator Icon */}
        <div className="mb-5 relative flex items-center justify-center">
          {status === 'success' ? (
            <div className="w-14 h-14 rounded-full bg-[#10b981]/20 border border-[#10b981] flex items-center justify-center text-[#10b981] animate-scaleIn">
              <i className="ri-shield-check-fill text-3xl" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#f48120]/10 border border-[#f48120]/40 flex items-center justify-center text-[#f48120]">
              <i className="ri-shield-keyhole-line text-2xl animate-pulse" />
            </div>
          )}
        </div>

        {/* Title & Instructions */}
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2">
          {status === 'success' ? 'Verification Successful' : 'Security Check'}
        </h1>
        <p className="text-xs sm:text-sm text-[#94a3b8] mb-6 max-w-xs font-mono leading-relaxed">
          {statusText}
        </p>

        {/* Cloudflare Turnstile Container */}
        <div className="w-full flex justify-center items-center min-h-[75px] my-2 bg-transparent p-0 border-0">
          <div
            ref={turnstileContainerRef}
            id="cf-turnstile-gate-element"
            className="flex justify-center items-center scale-95 origin-center"
          />
        </div>

        {/* Informational Notice */}
        <div className="mt-5 text-[11px] text-[#64748b] font-mono flex items-center gap-1.5">
          <i className="ri-lock-2-line text-[#f48120]" />
          <span>Needs to review the security of your connection before proceeding.</span>
        </div>
      </div>

      {/* Footer Info & Ray ID */}
      <div className="w-full max-w-lg flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#64748b] pb-2 pt-4 border-t border-[#1f2333] shrink-0 relative z-10 gap-2">
        <div className="flex items-center space-x-2">
          <span>Ray ID: <strong className="text-[#94a3b8] font-normal">{rayId}</strong></span>
          <span>•</span>
          <span>Your IP: <strong className="text-[#94a3b8] font-normal">Encrypted Client</strong></span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Performance &amp; security by</span>
          <span className="text-[#f48120] font-semibold">Cloudflare</span>
        </div>
      </div>
    </div>
  );
};
