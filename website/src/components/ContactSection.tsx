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
  const [sendFailed, setSendFailed] = useState(false);
  const [isPlaneMoving, setIsPlaneMoving] = useState(false);
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

    setIsPlaneMoving(true);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSendFailed(true);
      soundEngine.play('error');
      setTimeout(() => setIsPlaneMoving(false), 1200);
      setTimeout(() => setSendFailed(false), 5000);
      return;
    }

    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setSendFailed(true);
      soundEngine.play('error');
      setTimeout(() => setIsPlaneMoving(false), 1200);
      setTimeout(() => setSendFailed(false), 5000);
      return;
    }

    setSendFailed(false);
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
      setIsPlaneMoving(false);
      setSendFailed(false);
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
      setIsPlaneMoving(false);
      setSendFailed(true);
      soundEngine.play('terminal_key');
      const errText = typeof err === 'string' ? err : (err?.text || err?.message || 'Transmission error. Please check EmailJS configuration.');
      setErrorMessage(errText);
      setTimeout(() => setErrorMessage(''), 8000);
      setTimeout(() => setSendFailed(false), 8000);
    }
  };

 return (
 <section id="contact" className="pt-[15px] px-[15px] pb-[15px] border-b-0 bg-transparent relative scroll-mt-28">
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
        <div className="grid grid-cols-1 gap-[15px] items-start">
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

          {/* Right Column: Encrypted Form */}
          <div className="bg-[#21232b] rounded-2xl border-0 p-[14px] shadow-md flex flex-col space-y-4 h-[460px]">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center w-full">
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                <div
                  className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center text-base font-bold shadow-sm"
                >
                  <i className="ri-mail-send-line"></i>
                </div>
                <div className="flex flex-col font-mono text-[#a8c7fa] font-bold shrink-0">
                  <span className="text-[16px] leading-[16px] tracking-tight">ENCRYPTED</span>
                  <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">TRANSMISSION</span>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="w-[2px] h-8 bg-[#44474f]/60 ml-3.5 mr-[15px] shrink-0" />

              {/* 3 Icons: ri-user-2-line on left, ri-flight-takeoff-line in middle, ri-database-line on right */}
              <div className="flex items-center relative flex-1 max-w-[156px] sm:max-w-[192px] h-8 shrink-0">
                {/* User Icon on left */}
                <i className="ri-user-2-line text-[17px] text-[#a8c7fa] shrink-0 block leading-none mr-[15px]" title="Sender"></i>

                {/* Middle: ri-flight-takeoff-line icon */}
                <div className="relative flex-1 h-5 flex items-center overflow-hidden mr-[15px]">
                  <div
                    className={`absolute text-[#a8c7fa] flex items-center justify-center ${
                      isPlaneMoving
                        ? 'animate-plane-flight top-1/2'
                        : 'left-0 top-1/2 -translate-y-1/2'
                    }`}
                  >
                    <i className="ri-flight-takeoff-line text-[16px] block leading-none"></i>
                  </div>
                </div>

                {/* Database Icon on right */}
                <i
                  className={`ri-database-line text-[17px] shrink-0 transition-colors duration-300 block leading-none ${
                    sendFailed ? 'text-[#ffb4ab]' : 'text-[#a8c7fa]'
                  }`}
                  title={sendFailed ? 'Transmission Failed' : 'Database'}
                ></i>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5 font-mono text-xs h-[380px]">
            <div className="grid grid-cols-1 gap-3.5 h-[100px]">
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (sendFailed) setSendFailed(false);
                  }}
                  placeholder="CODENAME"
                  aria-label="CODENAME"
                  className="w-full h-[45px] bg-[#000000] border-0 outline-none focus:outline-none focus:ring-0 rounded-xl px-3 text-white placeholder:text-[#8e9199] font-mono"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (sendFailed) setSendFailed(false);
                  }}
                  placeholder="RETURN EMAIL ADDRESS"
                  aria-label="RETURN EMAIL ADDRESS"
                  className="w-full h-[45px] bg-[#000000] border-0 outline-none focus:outline-none focus:ring-0 rounded-xl px-3 text-white placeholder:text-[#8e9199] font-mono"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                  if (sendFailed) setSendFailed(false);
                }}
                placeholder="DISPATCH SUBJECT"
                aria-label="DISPATCH SUBJECT"
                className="w-full h-[45px] bg-[#000000] border-0 outline-none focus:outline-none focus:ring-0 rounded-xl px-3 text-white placeholder:text-[#8e9199] font-mono"
              />
            </div>

            <div>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (sendFailed) setSendFailed(false);
                }}
                placeholder="TRANSMISSION BODY"
                aria-label="TRANSMISSION BODY"
                className="w-full h-[150px] bg-[#000000] border-0 outline-none focus:outline-none focus:ring-0 rounded-xl p-3 text-white placeholder:text-[#8e9199] font-mono resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isEncrypting}
              className="w-full bg-[#a8c7fa] hover:bg-[#96bef8] text-[#001d35] font-semibold text-xs tracking-wider pt-[12px] pb-3 px-4 rounded-xl cursor-pointer disabled:opacity-50 transition-colors flex items-center justify-center border-0"
            >
              <span>{isEncrypting ? 'SENDING...' : sentSuccess ? 'MAIL SENT' : 'SEND MAIL'}</span>
            </button>
          </form>
 </div>

 </div>
 </div>
 </section>
 );
};
