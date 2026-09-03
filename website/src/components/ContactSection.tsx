import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const GUARANTEE_TEXT = 'All transmissions originating from this portal are signed using client WebCrypto nonces and routed over HTTPS TLS 1.3 endpoints.';
import { soundEngine } from '../utils/soundEngine';

interface ContactSectionProps {
  isActive?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ isActive = true }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isEncrypting, setIsEncrypting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [typedNotice, setTypedNotice] = useState('');

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
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;

    const trimmedEmail = formData.email.trim();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|googlemail)\.com$/i;
    if (!gmailRegex.test(trimmedEmail)) {
      setErrorMessage('INVALID EMAIL: MUST BE A GMAIL ADDRESS');
      soundEngine.play('error');
      return;
    }

    setIsEncrypting(true);
    setErrorMessage('');
    setSentSuccess(false);
    soundEngine.play('terminal_key');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const formattedMessage = `[TRANSMISSION DETAILS]
From: ${formData.name} (${formData.email})
Reply-To: ${formData.email}
Subject: ${formData.subject}
----------------------------------------

${formData.message}`;

    const templateParams = {
      from_name: `${formData.name} (${formData.email})`,
      name: formData.name,
      user_name: formData.name,
      sender_name: formData.name,
      to_name: 'Labib B. Shahed',
      from_email: formData.email,
      email: formData.email,
      user_email: formData.email,
      sender_email: formData.email,
      reply_to: formData.email,
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
          body: JSON.stringify(formData),
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
      setSentSuccess(true);
      setStatusMessage('DISPATCH ENCRYPTED & TRANSMITTED VIA EMAILJS!');
      soundEngine.play('access_granted');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setSentSuccess(false);
        setStatusMessage('');
      }, 6000);
    } catch (err: any) {
      setIsEncrypting(false);
      soundEngine.play('terminal_key');
      const errText = typeof err === 'string' ? err : (err?.text || err?.message || 'Transmission error. Please check EmailJS configuration.');
      setErrorMessage(errText);
      setTimeout(() => setErrorMessage(''), 8000);
    }
  };

 return (
 <section id="contact" className="pt-[15px] px-[15px] pb-[calc(env(safe-area-inset-bottom,0px)+24px)] border-b-0 bg-transparent relative scroll-mt-28">
 <div className="max-w-7xl mx-auto px-0">
 {/* Section Header */}
        <div className="mb-[15px]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
            <span className="text-[12px] leading-[13px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold">
              Contact & Outreach
            </span>
          </div>
          <h2 className="text-3xl leading-[30px] font-extrabold tracking-tight text-white flex items-center gap-3">
            Secure Communication
          </h2>
        </div>

        {/* Yandex Map in RSA-4096 / AES-256-GCM Container Style */}
        <div className="mb-[15px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col shadow-md space-y-2.5">
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
 <div className="grid grid-cols-1 gap-8 items-start">
 
        {/* Direct Links & PGP Info directly in background */}
        <div className="space-y-4">
          {/* PGP Security Protocol Notice - Credential Section Card Style */}
          <div className="bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col shadow-md space-y-2.5">
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
            <div className="bg-[#000000] border border-[#44474f]/30 rounded-xl p-3 text-[12px] leading-[16.5px] font-mono h-[85px] overflow-hidden flex items-start shrink-0">
              <p className="bg-[#000000] text-[#c4c6d0] text-[11px] leading-relaxed font-mono w-full">
                {typedNotice}
                <span className="inline-block w-1.5 h-3.5 bg-[#a8c7fa] ml-0.5 animate-pulse align-middle" />
              </p>
            </div>
          </div>
        </div>
        {/* Right Column: Encrypted Form */}
        <div className="bg-[#21232b] rounded-2xl border-0 p-[14px] shadow-md flex flex-col space-y-4">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center text-base font-bold shadow-sm"
              >
                <i className="ri-shield-keyhole-line"></i>
              </div>
              <div className="flex flex-col font-mono text-[#a8c7fa] font-bold shrink-0">
                <span className="text-[16px] leading-[16px] tracking-tight">ENCRYPTED</span>
                <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">TRANSMISSION</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
 <div className="grid grid-cols-1 gap-4">
 <div className="space-y-1.5">
 <label className="text-[#c4c6d0] font-semibold">CODENAME / SENDER NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Lead Engineer"
                  className="w-full bg-[#1a1b21] border-0 outline-none focus:outline-none focus:ring-0 rounded-xl p-3 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[#c4c6d0] font-semibold">RETURN EMAIL ADDRESS</label>
                  <span className="text-[10px] tracking-wider text-[#a8c7fa] font-mono uppercase">Gmail Only</span>
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errorMessage) setErrorMessage('');
                  }}
                  pattern="^[a-zA-Z0-9._%+\\-]+@(gmail|googlemail)\\.com$"
                  title="Please enter a valid Gmail address (ending in @gmail.com)"
                  placeholder="username@gmail.com"
                  className={`w-full bg-[#1a1b21] outline-none focus:outline-none focus:ring-0 rounded-xl p-3 text-white font-mono ${
                    formData.email.length > 0 && !/^[a-zA-Z0-9._%+-]+@(gmail|googlemail)\.com$/i.test(formData.email.trim())
                      ? 'border border-[#ffb4ab]/50'
                      : 'border border-transparent'
                  }`}
                />
                {formData.email.length > 0 && !/^[a-zA-Z0-9._%+-]+@(gmail|googlemail)\.com$/i.test(formData.email.trim()) && (
                  <p className="text-[11px] text-[#ffb4ab] font-mono flex items-center gap-1 mt-1">
                    <i className="ri-error-warning-line"></i>
                    Must be a valid Gmail address (@gmail.com)
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#c4c6d0] font-semibold">DISPATCH SUBJECT</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Red Team Security Audit / Consultation"
                className="w-full bg-[#1a1b21] border-0 outline-none focus:outline-none focus:ring-0 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#c4c6d0] font-semibold">ENCRYPTED TRANSMISSION BODY</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type dispatch payload..."
                className="w-full bg-[#1a1b21] border-0 outline-none focus:outline-none focus:ring-0 rounded-xl p-3 text-white font-mono resize-none"
              ></textarea>
 </div>


            <button
              type="submit"
              disabled={isEncrypting}
              className="m3-btn-primary w-full justify-center text-xs tracking-wider cursor-pointer disabled:opacity-50"
            >
              {isEncrypting ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-base"></i>
                  <span>ENCRYPTING & TRANSMITTING...</span>
                </>
              ) : sentSuccess ? (
                <>
                  <i className="ri-checkbox-circle-fill text-base text-[#a8e6cf]"></i>
                  <span className="text-[#a8e6cf]">DISPATCH TRANSMITTED VIA EMAILJS</span>
                </>
              ) : errorMessage ? (
                <>
                  <i className="ri-error-warning-fill text-base text-[#ffb4ab]"></i>
                  <span className="text-[#ffb4ab]">{errorMessage}</span>
                </>
              ) : (
                <>
                  <i className="ri-send-plane-fill text-base"></i>
                  <span>TRANSMIT ENCRYPTED DISPATCH</span>
                </>
              )}
            </button>
 </form>
 </div>

 </div>
 </div>
 </section>
 );
};
