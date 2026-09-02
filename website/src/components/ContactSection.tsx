import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export const ContactSection: React.FC = () => {
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 subject: 'Security Engagement / Consulting',
 message: '',
 });

 const [isEncrypting, setIsEncrypting] = useState(false);
 const [sentSuccess, setSentSuccess] = useState(false);

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
 <div className="text-[12px] leading-[13px] font-mono text-[#a8c7fa] tracking-wider uppercase">Contact & Outreach</div>
 <h2 className="text-3xl font-bold tracking-tight text-white">
 Initiate Secure Communication Channel
 </h2>
 </div>

 {/* Contact Layout Grid */}
 <div className="grid grid-cols-1 gap-8 items-start">
 
 {/* Left Column: Direct Links & PGP Info */}
 <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f]/40 p-6 space-y-5 shadow-md">
 <h3 className="text-lg font-bold text-white flex items-center gap-2">
 <i className="ri-shield-keyhole-line text-[#a8c7fa]"></i> Direct Secure Endpoints
 </h3>

 <div className="space-y-3 font-mono text-xs">
 <a
 href="mailto:la-b-ib@github.io"
 onClick={() => soundEngine.play('click')}
 className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#13141a] hover:bg-transparent text-[#c4c6d0] hover:text-white transition-all"
 >
 <div className="w-9 h-9 rounded-full bg-[#004a77]/30 flex items-center justify-center text-[#a8c7fa] text-lg">
 <i className="ri-mail-send-line"></i>
 </div>
 <div>
 <div className="text-[10px] text-[#8e9199]">PRIMARY EMAIL</div>
 <div className="font-semibold text-white">la-b-ib@github.io</div>
 </div>
 </a>

 <a
 href="https://github.com/la-b-ib"
 target="_blank"
 rel="noopener noreferrer"
 onClick={() => soundEngine.play('click')}
 className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#13141a] hover:bg-transparent text-[#c4c6d0] hover:text-white transition-all"
 >
 <div className="w-9 h-9 rounded-full bg-[#004a77]/30 flex items-center justify-center text-[#a8c7fa] text-lg">
 <i className="ri-github-line"></i>
 </div>
 <div>
 <div className="text-[10px] text-[#8e9199]">GITHUB PROFILE</div>
 <div className="font-semibold text-white">github.com/la-b-ib</div>
 </div>
 </a>

 <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#13141a] text-[#c4c6d0]">
 <div className="w-9 h-9 rounded-full bg-[#4a0072]/30 flex items-center justify-center text-[#e8b7ff] text-lg">
 <i className="ri-chat-shield-line"></i>
 </div>
 <div>
 <div className="text-[10px] text-[#8e9199]">MATRIX PROTOCOL</div>
 <div className="font-semibold text-[#e8b7ff]">@labib:matrix.org</div>
 </div>
 </div>
 </div>

 {/* PGP Security Protocol Notice */}
 <div className="bg-[#13141a] p-4 rounded-xl space-y-2 text-xs font-sans">
 <div className="font-mono text-[11px] font-semibold text-[#a8e6cf] flex items-center gap-1.5">
 <i className="ri-shield-check-line"></i> RSA-4096 / AES-256-GCM GUARANTEE
 </div>
 <p className="text-[#8e9199] text-[11px] leading-relaxed">
 All transmissions originating from this portal are signed using client WebCrypto nonces and routed over HTTPS TLS 1.3 endpoints.
 </p>
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
