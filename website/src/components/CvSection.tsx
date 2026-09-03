import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export const CvSection: React.FC = () => {
 const [downloading, setDownloading] = useState(false);

 const handleDownload = () => {
 soundEngine.play('click');
 setDownloading(true);
 // Trigger download of CV
 const link = document.createElement('a');
 link.href = '/biofetch.txt';
 link.download = 'Labib_Shahed_CV.txt';
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 
 setTimeout(() => {
 setDownloading(false);
 }, 1500);
 };

 return (
 <section id="cv" className="py-12 border-t border-emerald-900/30">
 <div className="max-w-4xl mx-auto px-4">
 <div className="bg-black/60 border border-emerald-500/30 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden">
 {/* Background decorative scan line */}
 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none"/>
 
 <div className="flex flex-col items-center justify-between gap-6 relative z-10">
 <div className="space-y-2 text-center">
 <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
 OFFICIAL RECORD
 </div>
 <h3 className="text-xl font-bold font-mono text-emerald-300">
 CURRICULUM VITAE // DOSSIER
 </h3>
 <p className="text-sm font-mono text-zinc-400 max-w-xl">
 Download the complete verified security dossier, executive profile, professional experience timeline, and technical certifications.
 </p>
 </div>

 <div className="flex flex-col gap-3 w-full">
 <button
 onClick={handleDownload}
 disabled={downloading}
 className={`flex items-center justify-center gap-2 px-6 py-3 rounded font-mono text-sm font-semibold transition-all duration-200 ${
 downloading
 ? 'bg-emerald-800 text-zinc-300 cursor-wait'
 : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]'
 }`}
 >
 <i className={`ri-${downloading ? 'loader-4-line animate-spin' : 'download-2-line'}`} />
 <span>{downloading ? 'FETCHING RECORD...' : 'DOWNLOAD CV'}</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 </section>
 );
};
