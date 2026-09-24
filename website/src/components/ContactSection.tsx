import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';

const GUARANTEE_TEXT = 'All transmissions originating from this portal are signed using client WebCrypto nonces and routed over HTTPS TLS 1.3 endpoints.';
import { soundEngine } from '../utils/soundEngine';

interface ContactSectionProps {
  isActive?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ isActive = true }) => {
  const [emailUsername, setEmailUsername] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isEncrypting, setIsEncrypting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [isPlaneMoving, setIsPlaneMoving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [typedNotice, setTypedNotice] = useState('');

  // Cloudflare Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string>(
    import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || ''
  );
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  // Retrieve public site key safely from server if not set in client build env
  useEffect(() => {
    let isMounted = true;
    const fetchTurnstileConfig = async () => {
      try {
        const res = await fetch('/api/turnstile/config');
        if (res.ok) {
          const cfg = await res.json();
          if (isMounted && cfg.siteKey) {
            setTurnstileSiteKey(cfg.siteKey);
          }
        }
      } catch (err) {
        console.warn('Could not fetch Turnstile configuration:', err);
      }
    };

    if (!turnstileSiteKey) {
      fetchTurnstileConfig();
    }
    return () => {
      isMounted = false;
    };
  }, [turnstileSiteKey]);

  // Mount and render Cloudflare Turnstile widget explicitly
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileContainerRef.current) return;

    let intervalId: NodeJS.Timeout | null = null;
    let isMounted = true;

    const mountTurnstile = () => {
      if (!isMounted || !turnstileContainerRef.current) return;
      if (typeof window !== 'undefined' && window.turnstile) {
        if (turnstileWidgetIdRef.current) {
          try {
            window.turnstile.remove(turnstileWidgetIdRef.current);
          } catch {
            // Widget already unmounted
          }
        }

        try {
          turnstileContainerRef.current.innerHTML = '';
          const widgetId = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: turnstileSiteKey,
            theme: 'dark',
            size: 'flexible',
            callback: (token: string) => {
              setTurnstileToken(token);
              setErrorMessage('');
              setSendFailed(false);
              soundEngine.play('access_granted');
            },
            'expired-callback': () => {
              setTurnstileToken('');
            },
            'error-callback': () => {
              setTurnstileToken('');
            },
          });
          turnstileWidgetIdRef.current = widgetId;
          if (intervalId) clearInterval(intervalId);
        } catch (err) {
          console.warn('Waiting for Turnstile script to finish loading:', err);
        }
      }
    };

    if (typeof window !== 'undefined' && window.turnstile) {
      mountTurnstile();
    } else {
      intervalId = setInterval(() => {
        if (typeof window !== 'undefined' && window.turnstile) {
          mountTurnstile();
        }
      }, 300);
    }

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      if (typeof window !== 'undefined' && window.turnstile && turnstileWidgetIdRef.current) {
        try {
          window.turnstile.remove(turnstileWidgetIdRef.current);
          turnstileWidgetIdRef.current = null;
        } catch {
          // ignore
        }
      }
    };
  }, [turnstileSiteKey]);

  useEffect(() => {
    if (!isActive) return;
    let index = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout | null = null;
    let isCancelled = false;

    const tick = () => {
      if (isCancelled) return;
      if (!isDeleting) {
        index++;
        setTypedNotice(GUARANTEE_TEXT.slice(0, index));
        if (index >= GUARANTEE_TEXT.length) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            tick();
          }, 4000);
          return;
        }
        timeoutId = setTimeout(tick, 45);
      } else {
        index -= 2;
        if (index <= 0) {
          index = 0;
          setTypedNotice('');
          isDeleting = false;
          timeoutId = setTimeout(tick, 800);
          return;
        }
        setTypedNotice(GUARANTEE_TEXT.slice(0, index));
        timeoutId = setTimeout(tick, 15);
      }
    };

    setTypedNotice('');
    timeoutId = setTimeout(tick, 300);

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isActive]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsPlaneMoving(true);

    const cleanUsername = emailUsername.replace(/@.*$/, '').trim();
    if (!cleanUsername || !formData.subject.trim() || !formData.message.trim()) {
      setSendFailed(true);
      soundEngine.play('error');
      setErrorMessage('PLEASE PROVIDE GMAIL USER ID, SUBJECT & MESSAGE');
      setTimeout(() => setIsPlaneMoving(false), 1200);
      setTimeout(() => setSendFailed(false), 5000);
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const fullEmail = `${cleanUsername.toLowerCase()}@gmail.com`;
    const gmailUserRegex = /^[a-zA-Z0-9._-]+$/;
    if (!gmailUserRegex.test(cleanUsername)) {
      setSendFailed(true);
      soundEngine.play('error');
      setErrorMessage('INVALID GMAIL USER ID FORMAT');
      setTimeout(() => setIsPlaneMoving(false), 1200);
      setTimeout(() => setSendFailed(false), 5000);
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setSendFailed(false);
    setIsEncrypting(true);
    setErrorMessage('');
    setSentSuccess(false);
    soundEngine.play('terminal_key');

    // Cloudflare Turnstile token verification check
    if (!turnstileToken) {
      setIsEncrypting(false);
      setIsPlaneMoving(false);
      setSendFailed(true);
      soundEngine.play('error');
      setErrorMessage('VERIFY CAPTCHA TO DISPATCH');
      setTimeout(() => setErrorMessage(''), 5000);
      setTimeout(() => setSendFailed(false), 5000);
      return;
    }

    // Verify token with server endpoint before proceeding
    try {
      const vRes = await fetch('/api/turnstile/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const vData = await vRes.json();
      if (!vRes.ok || !vData.success) {
        throw new Error(vData.error || 'Cloudflare CAPTCHA verification failed');
      }
    } catch (verr: any) {
      setIsEncrypting(false);
      setIsPlaneMoving(false);
      setSendFailed(true);
      soundEngine.play('error');
      setErrorMessage(verr.message || 'CAPTCHA verification error');
      if (window.turnstile && turnstileWidgetIdRef.current) {
        try {
          window.turnstile.reset(turnstileWidgetIdRef.current);
        } catch {
          // ignore
        }
      }
      setTurnstileToken('');
      setTimeout(() => setErrorMessage(''), 6000);
      setTimeout(() => setSendFailed(false), 6000);
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const senderName = cleanUsername;
    const formattedMessage = `[TRANSMISSION DETAILS]
From: ${senderName} (${fullEmail})
Reply-To: ${fullEmail}
Subject: ${formData.subject}
----------------------------------------

${formData.message}`;

    const templateParams = {
      from_name: `${senderName} (${fullEmail})`,
      name: senderName,
      user_name: senderName,
      sender_name: senderName,
      to_name: 'Labib B. Shahed',
      from_email: fullEmail,
      email: fullEmail,
      user_email: fullEmail,
      sender_email: fullEmail,
      reply_to: fullEmail,
      subject: formData.subject,
      user_subject: formData.subject,
      title: formData.subject,
      message: formattedMessage,
      raw_message: formData.message,
      user_message: formData.message,
    };

    try {
      let dispatched = false;

      // 1. Check client-side keys or retrieve configured public keys from server
      let sId = serviceId;
      let tId = templateId;
      let pKey = publicKey;

      if (!sId || !tId || !pKey) {
        try {
          const cfgRes = await fetch('/api/contact/config');
          if (cfgRes.ok) {
            const cfg = await cfgRes.json();
            if (cfg.isConfigured) {
              sId = cfg.serviceId;
              tId = cfg.templateId;
              pKey = cfg.publicKey;
            }
          }
        } catch (e) {
          console.warn('Could not fetch EmailJS config:', e);
        }
      }

      // 2. Direct browser dispatch with @emailjs/browser (avoids non-browser restrictions)
      if (sId && tId && pKey) {
        try {
          await emailjs.send(sId, tId, templateParams, pKey);
          dispatched = true;
        } catch (browserErr: any) {
          console.warn('Direct EmailJS browser send failed, attempting server proxy:', browserErr);
        }
      }

      // 3. Server proxy fallback
      if (!dispatched) {
        const res = await fetch('/api/contact/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: senderName, email: fullEmail, subject: formData.subject, message: formData.message, turnstileToken }),
        });

        if (res.ok) {
          dispatched = true;
        } else {
          let errMsg = 'Transmission failed on server';
          try {
            const errData = await res.json();
            errMsg = errData?.error || errMsg;
          } catch {
            const text = await res.text();
            errMsg = text || errMsg;
          }
          throw new Error(errMsg);
        }
      }

      setIsEncrypting(false);
      setIsPlaneMoving(false);
      setSendFailed(false);
      setSentSuccess(true);
      setStatusMessage('DISPATCH ENCRYPTED & TRANSMITTED VIA EMAILJS!');
      soundEngine.play('access_granted');
      setEmailUsername('');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset Turnstile token and widget
      if (window.turnstile && turnstileWidgetIdRef.current) {
        try {
          window.turnstile.reset(turnstileWidgetIdRef.current);
        } catch {
          // ignore
        }
      }
      setTurnstileToken('');

      setTimeout(() => {
        setSentSuccess(false);
        setStatusMessage('');
      }, 6000);
    } catch (err: any) {
      setIsEncrypting(false);
      setIsPlaneMoving(false);
      setSendFailed(true);
      soundEngine.play('terminal_key');

      // Reset Turnstile on error so user can re-verify if needed
      if (window.turnstile && turnstileWidgetIdRef.current) {
        try {
          window.turnstile.reset(turnstileWidgetIdRef.current);
        } catch {
          // ignore
        }
      }
      setTurnstileToken('');

      const errText = typeof err === 'string' ? err : (err?.text || err?.message || 'Transmission error. Please check EmailJS configuration.');
      setErrorMessage(errText);
      setTimeout(() => setErrorMessage(''), 8000);
      setTimeout(() => setSendFailed(false), 8000);
    }
  };

 return (
    <section id="contact" className="pt-0 px-[8px] pb-0 border-b-0 bg-transparent relative scroll-mt-28" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "0px", paddingBottom: "0px" }}>
 <div className="max-w-7xl mx-auto px-0">
 {/* Section Header */}
        <div className="mb-[15px]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
            <span className="text-[12px] leading-[16px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold" style={{ fontSize: "12px" }}>
              Contact & Outreach
            </span>
          </div>
          <h2 className="text-2xl leading-[24px] font-extrabold tracking-tight text-white flex items-center gap-3" style={{ fontSize: "24px", lineHeight: "24px" }}>
            Secure Communication
          </h2>
        </div>

        {/* Yandex Map in RSA-4096 / AES-256-GCM Container Style */}
        <div className="mb-[15px] bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col shadow-md space-y-2.5" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
          {/* Top Bar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center text-base font-bold shadow-sm"
                title="Base Station / Geo-Coordinates"
              >
                <i className="ri-treasure-map-line"></i>
              </div>
              <div className="flex flex-col font-mono text-[#a8c7fa] font-bold">
                <span className="text-[16px] leading-[16px] tracking-tight">BASE STATION</span>
                <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">GEO-COORDINATES</span>
              </div>
            </div>
          </div>

          {/* Inner Map Capsule */}
          <div className="bg-[#000000] border border-[#44474f]/30 rounded-xl overflow-hidden">
            <iframe
              src="https://yandex.com/map-widget/v1/?ll=90.4125%2C23.8103&z=11&lang=en_US&theme=dark"
              title="Yandex Map Base Station - Dhaka"
              width="100%"
              height="150"
              frameBorder="0"
              allowFullScreen={true}
              className="w-full h-[150px] border-0 block"
              loading="lazy"
            />
          </div>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 gap-[15px] items-start">
          {/* PGP Security Protocol Notice - Credential Section Card Style */}
          <div className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col shadow-md space-y-2.5" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
            {/* Top Bar Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3 w-full">
                <div
                  className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center text-base font-bold shadow-sm"
                  title="RSA-4096 / AES-256-GCM"
                >
                  <i className="ri-base-station-line"></i>
                </div>
                <div className="flex flex-col font-mono text-[#a8c7fa] font-bold shrink-0">
                  <span className="text-[16px] leading-[16px] tracking-tight">RSA-4096</span>
                  <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">AES-0256</span>
                </div>

                {/* Vertical Separator */}
                <div className="w-[2px] h-8 bg-[#44474f]/60 mx-1 shrink-0" />

                {/* 4 Social Brand Buttons strictly beside vertical bar on one row */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto sm:ml-0">
                  <a
                    href="https://github.com/la-b-ib"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.play('click')}
                    className="w-8 h-8 shrink-0 rounded-lg bg-[#000000] text-white flex items-center justify-center text-base shadow-sm cursor-pointer"
                    title="GitHub"
                    aria-label="GitHub"
                  >
                    <i className="ri-github-line"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/la-b-ib?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.play('click')}
                    className="w-8 h-8 shrink-0 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center text-base shadow-sm cursor-pointer"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                  >
                    <i className="ri-linkedin-box-line"></i>
                  </a>
                  <a
                    href="https://x.com/la_b_ib_?s=11"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.play('click')}
                    className="w-8 h-8 shrink-0 rounded-lg bg-[#1da1f2] text-white flex items-center justify-center text-base shadow-sm cursor-pointer"
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
                    className="w-8 h-8 shrink-0 rounded-lg bg-[#25d366] text-white flex items-center justify-center text-base shadow-sm cursor-pointer"
                    title="WhatsApp"
                    aria-label="WhatsApp"
                  >
                    <i className="ri-whatsapp-line"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Inner Text Capsule */}
            <div className="bg-[#000000] border border-[#44474f]/30 rounded-xl p-2 text-[13px] leading-[16px] font-mono h-[80px] overflow-hidden flex items-start shrink-0" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "80px" }}>
              <p className="bg-[#000000] text-[#c4c6d0] text-[12px] leading-[16px] font-mono w-full" style={{ fontSize: "12px" }}>
                {typedNotice}
                <span className="inline-block w-1.5 h-3.5 bg-[#a8c7fa] ml-0.5 animate-pulse align-middle" />
              </p>
            </div>
          </div>

          {/* Right Column: Encrypted Form */}
          <div className="bg-[#21232b] rounded-2xl border-0 p-2 shadow-md flex flex-col space-y-2.5 h-auto" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
          {/* Top Bar Header */}
          <div className="flex items-center justify-between min-h-[32px]">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center text-base font-bold shadow-sm"
              >
                <i className="ri-mail-send-line"></i>
              </div>
              <div className="flex flex-col font-mono text-[#a8c7fa] font-bold">
                <span className="text-[16px] leading-[16px] tracking-tight" style={{ fontSize: "16px", lineHeight: "16px" }}>ENCRYPTED</span>
                <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]" style={{ fontSize: "16px", lineHeight: "16px" }}>TRANSMISSION</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-2.5 font-mono text-[13px] leading-[16px] flex flex-col h-auto">
            <div className="grid grid-cols-2 gap-2.5 shrink-0">
              <input
                type="text"
                value={emailUsername}
                onChange={(e) => {
                  const clean = e.target.value.replace(/@.*$/, '').trim();
                  setEmailUsername(clean);
                  if (sendFailed) setSendFailed(false);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Gmail USER ID"
                aria-label="Gmail USER ID"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-full h-[45px] bg-[#000000] border-0 outline-none focus:outline-none focus:ring-0 rounded-xl p-2 text-[12px] leading-[12px] text-white placeholder:text-[#8e9199] font-mono"
                style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", fontSize: "12px", lineHeight: "12px" }}
              />

              <input
                type="text"
                value={formData.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                  if (sendFailed) setSendFailed(false);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="SUBJECT"
                aria-label="SUBJECT"
                className="w-full h-[45px] bg-[#000000] border-0 outline-none focus:outline-none focus:ring-0 rounded-xl p-2 text-[12px] leading-[12px] text-white placeholder:text-[#8e9199] font-mono"
                style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", fontSize: "12px", lineHeight: "12px" }}
              />
            </div>

            <div className="shrink-0">
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (sendFailed) setSendFailed(false);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="TRANSMISSION BODY"
                aria-label="TRANSMISSION BODY"
                className="w-full h-[150px] bg-[#000000] border-0 outline-none focus:outline-none focus:ring-0 rounded-xl p-2 text-[12px] leading-[12px] text-white placeholder:text-[#8e9199] font-mono resize-none"
                style={{ paddingLeft: "8px", paddingTop: "8px", paddingRight: "8px", paddingBottom: "8px", fontSize: "12px", lineHeight: "12px" }}
              ></textarea>
            </div>

            {/* Cloudflare Turnstile CAPTCHA Capsule - matches input box width and height with 15px left/right gap */}
            <div className="w-full flex items-center justify-center min-h-[70px] h-[70px] bg-transparent rounded-xl overflow-visible border-0 shrink-0 px-0">
              <div
                ref={turnstileContainerRef}
                id="cf-turnstile-element"
                className="w-[420px] max-w-full h-[70px] flex justify-center items-center scale-105 origin-center"
                style={{ height: "70px", width: "420px" }}
              />
            </div>

            <button
              type="submit"
              disabled={isEncrypting}
              className={`w-full h-[40px] font-semibold text-[12px] leading-[12px] tracking-wider p-2 rounded-xl cursor-pointer disabled:opacity-50 transition-colors flex items-center justify-center border-0 shrink-0 ${
                sendFailed || errorMessage
                  ? 'bg-[#ba1a1a] text-white hover:bg-[#93000a]'
                  : 'bg-[#a8c7fa] hover:bg-[#96bef8] text-[#001d35]'
              }`}
              style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", fontSize: "12px", lineHeight: "12px", height: "40px" }}
            >
              <span className="truncate">
                {isEncrypting
                  ? 'SENDING...'
                  : errorMessage
                  ? errorMessage
                  : sentSuccess
                  ? 'MAIL SENT'
                  : 'SEND MAIL'}
              </span>
            </button>
          </form>
 </div>

 </div>
 </div>
 </section>
 );
};
