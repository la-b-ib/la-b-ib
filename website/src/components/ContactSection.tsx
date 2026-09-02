import React, { useState, useEffect } from 'react';

const GUARANTEE_TEXT = 'All transmissions originating from this portal are signed using client WebCrypto nonces and routed over HTTPS TLS 1.3 endpoints.';
import { soundEngine } from '../utils/soundEngine';

interface ContactSectionProps {
  isActive?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ isActive = true }) => {
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 subject: 'Security Engagement / Consulting',
 message: '',
 });

 const [isEncrypting, setIsEncrypting] = useState(false);
 const [sentSuccess, setSentSuccess] = useState(false);
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


 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!formData.name || !formData.email || !formData.message) return;

 setIsEncrypting(true);
 soundEngine.play('terminal_key');

 setTimeout(() => {
 setIsEncrypting(false);
 setSentSuccess(true);
 soundEngine.play('access_granted');
 setFormData({ name: '', email: '', subject: 'Security Engagement / Consulting', message: '' });
 setTimeout(() => setSentSuccess(false), 5000);
 }, 1200);
 };

 return (
 <section id="contact" className="pt-[15px] px-[15px] pb-0 border-b-0 bg-transparent relative scroll-mt-28">
 <div className="max-w-7xl mx-auto px-0">
 {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#a8e6cf] animate-pulse"></span>
            <span className="text-[12px] leading-[13px] font-mono text-[#a8c7fa] tracking-widest uppercase font-semibold">
              Contact & Outreach
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Secure Communication
          </h2>
        </div>

        {/* Yandex Map Iframe in Dark Mode */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-[#44474f]/40 bg-[#13141a] shadow-lg">
          <iframe
            src="https://yandex.com/map-widget/v1/?ll=90.4125%2C23.8103&z=13&lang=en_US&theme=dark"
            title="Yandex Map Base Station"
            width="100%"
            height="200"
            frameBorder="0"
            allowFullScreen={true}
            className="w-full h-[200px] border-0"
            loading="lazy"
          />
        </div>

 {/* Contact Layout Grid */}
 <div className="grid grid-cols-1 gap-8 items-start">
 
        {/* Direct Links & PGP Info directly in background */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
            <i className="ri-shield-keyhole-line text-[#a8c7fa]"></i> Direct Secure Endpoints
          </h3>

          <div className="space-y-2.5 font-mono text-xs">
            <a
              href="mailto:la-b-ib@github.io"
              onClick={() => soundEngine.play('click')}
              className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#21232b] hover:bg-[#2c2e38] text-[#c4c6d0] hover:text-white transition-all border-0 shadow-sm"
            >
              <div className="w-9 h-9 rounded-full bg-[#004a77]/40 flex items-center justify-center text-[#a8c7fa] text-lg shrink-0">
                <i className="ri-mail-send-line"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-[#8e9199]">PRIMARY EMAIL</div>
                <div className="font-semibold text-white truncate">la-b-ib@github.io</div>
              </div>
            </a>
          </div>

          {/* PGP Security Protocol Notice - Credential Section Card Style */}
          <div className="bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col shadow-md space-y-2.5">
            {/* Top Bar Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#003258] flex items-center justify-center text-base font-bold shadow-sm"
                  title="RSA-4096 / AES-256-GCM"
                >
                  <i className="ri-base-station-line"></i>
                </div>
                <div className="flex flex-col font-mono text-[#a8c7fa] font-bold">
                  <span className="text-[16px] leading-[16px] tracking-tight">RSA-4096</span>
                  <span className="text-[16px] leading-[16px] tracking-tight text-[#a8c7fa]">AES-256-GCM</span>
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
 <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 shadow-md">
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
 className="w-full bg-transparent border border-[#44474f]/50 rounded-xl p-3 text-white focus:outline-none focus:border-[#a8c7fa]"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-[#c4c6d0] font-semibold">RETURN EMAIL ADDRESS</label>
 <input
 type="email"
 required
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 placeholder="name@company.com"
 className="w-full bg-transparent border border-[#44474f]/50 rounded-xl p-3 text-white focus:outline-none focus:border-[#a8c7fa]"
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[#c4c6d0] font-semibold">DISPATCH SUBJECT</label>
 <select
 value={formData.subject}
 onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
 className="w-full bg-transparent border border-[#44474f]/50 rounded-xl p-3 text-white focus:outline-none focus:border-[#a8c7fa]"
 >
 <option value="Security Engagement / Consulting">Red Team / Pentesting Engagement</option>
 <option value="Full-Stack Architecture Request">Full-Stack Application Architecture</option>
 <option value="DFIR Incident Response Audit">Digital Forensics / Breach Incident Audit</option>
 <option value="General Professional Connection">General Professional Connection</option>
 </select>
 </div>

 <div className="space-y-1.5">
 <label className="text-[#c4c6d0] font-semibold">ENCRYPTED TRANSMISSION BODY</label>
 <textarea
 required
 rows={5}
 value={formData.message}
 onChange={(e) => setFormData({ ...formData, message: e.target.value })}
 placeholder="Type dispatch payload..."
 className="w-full bg-transparent border border-[#44474f]/50 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#a8c7fa] resize-none"
 ></textarea>
 </div>

 {sentSuccess && (
 <div className="p-3.5 rounded-xl bg-[#00522b]/30 border border-[#a8e6cf]/40 text-[#c6f6d5] font-bold text-center flex items-center justify-center gap-2">
 <i className="ri-checkbox-circle-fill text-[#a8e6cf] text-base"></i>
 <span>DISPATCH ENCRYPTED & TRANSMITTED SUCCESSFULLY!</span>
 </div>
 )}

 <button
 type="submit"
 disabled={isEncrypting}
 className="m3-btn-primary w-full justify-center text-xs tracking-wider cursor-pointer disabled:opacity-50"
 >
 {isEncrypting ? (
 <>
 <i className="ri-loader-4-line animate-spin text-base"></i>
 <span>ENCRYPTING WITH RSA-4096...</span>
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
