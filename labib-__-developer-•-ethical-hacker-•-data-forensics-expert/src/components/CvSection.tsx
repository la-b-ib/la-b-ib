import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { EDUCATION_DATA, THESIS_DATA, PUBLICATIONS_DATA, HONORS_DATA } from '../data/portfolioData';

export const CvSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Generate downloadable CV text content for download feature
  const cvTextContent = `
================================================================================
LABIB BIN SHAHED - CURRICULUM VITAE
================================================================================
Cybersecurity Analyst | Software Engineer | AI & Network Security Researcher
Email: labib.b.shahed@gmail.com
Location: Dhaka, Bangladesh (23.77°N, 90.42°E)

RESEARCH PROFILES:
- IEEE Xplore: https://ieeexplore.ieee.org/author/428150838708730
- Google Scholar: https://scholar.google.com/citations?user=xg04A5kAAAAJ&hl=en
- ORCID: https://orcid.org/0009-0007-4656-8709
- ResearchGate: https://www.researchgate.net/profile/Labib-Bin-Shahed

EDUCATION:
BRAC University | B.Sc. in Computer Science and Engineering
- Duration: Jan 2022 – Ongoing
- CGPA: 3.58 / 4.00 (US Scale)
- Location: 23.77°N, 90.42°E
- Core Coursework: Data Structures, Algorithms, Discrete Mathematics, Operating Systems,
  Computer Networks, Software Engineering, Web Technologies, Natural Language Processing (NLP),
  Cybersecurity, Cryptography & Network Security

THESIS & RESEARCH:
Undergraduate Thesis:
- Title: Adversarial Machine Learning in Malware Detection

CONFERENCE PUBLICATIONS:
1. "Blockchain in Project Management for Information Security, Transparency and Accountability"
   - Conference: 2025 International Conference on Electronics, Information, and Communication (ICEIC)
   - Location: Osaka, Japan (19–22 January 2025)
   - Electronic ISBN: 979-8-3315-1075-6
   - DOI: https://doi.org/10.1109/ICEIC64972.2025.10879668

2. "Crop Prediction Using Machine Learning and IoT: A Comparative Analysis of Algorithms"
   - Conference: 2024 International Conference on Recent Progresses in Science, Engineering and Technology (ICRPSET)
   - Location: Rajshahi, Bangladesh (07–08 December 2024)
   - Electronic ISBN: 979-8-3315-0947-7
   - DOI: https://doi.org/10.1109/ICRPSET64863.2024.10955896

HONORS & AWARDS:
- Duke of Edinburgh Gold Award (The Duke of Edinburgh's International Award Foundation)

ORGANIZATIONS, SOCIETIES & CLUBS:
- Technical & Security: OWASP, Trace Labs, IEEE, BUEEC (BRAC University Electrical and Electronic Club)
- Research, Editorial & Social: Osmosis Institute, BRACU Express, 3Zero Club

TECHNICAL SKILLS:
- Cybersecurity: Penetration Testing, Threat Hunting, Digital Forensics, OWASP Top 10, Network Security
- Programming: TypeScript, Go, Python, C, Rust, C++
- Tools & Platforms: Wireshark, Metasploit, Nmap, Burp Suite, Docker, Linux, Git, Firebase
================================================================================
`;

  const handleDownloadCv = () => {
    soundEngine.play('click');
    const blob = new Blob([cvTextContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Labib_Bin_Shahed_CV.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCvSummary = () => {
    soundEngine.play('click');
    navigator.clipboard.writeText(cvTextContent.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mt-20 pt-12 border-t border-slate-800 space-y-8">
      {/* CV Box / Preview Card */}
      <div className="bg-[#0b0e17] rounded-xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
        {/* Top Header Bar inside CV card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-xl sm:text-2xl font-source-code-black text-slate-100">
                Labib Bin Shahed
              </h4>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                VERIFIED CV
              </span>
            </div>
            <p className="text-xs font-mono text-cyan-400 font-semibold">
              B.Sc. in Computer Science & Engineering • BRAC University
            </p>
            <p className="text-xs font-mono text-slate-400">
              Dhaka, Bangladesh (23.77°N, 90.42°E) • labib.b.shahed@gmail.com
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadCv}
              className="py-2.5 px-4 rounded-sm bg-cyan-400 text-slate-950 font-mono text-xs font-extrabold flex items-center space-x-2 border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000000] hover:bg-cyan-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <i className="ri-download-2-line text-sm"></i>
              <span>DOWNLOAD CV (TXT / DOC)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.play('click');
                setIsPreviewOpen(true);
              }}
              className="py-2.5 px-4 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-200 font-mono text-xs font-bold flex items-center space-x-2 shadow-[3px_3px_0px_0px_#00a8ff] hover:bg-slate-800 hover:text-cyan-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <i className="ri-file-search-line text-cyan-400 text-sm"></i>
              <span>VIEW FULL DOSSIER</span>
            </button>

            <button
              onClick={handleCopyCvSummary}
              className="py-2.5 px-3 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-300 font-mono text-xs shadow-[3px_3px_0px_0px_#334155] hover:bg-slate-800 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              title="Copy CV Summary"
            >
              <i className={copied ? 'ri-check-line text-emerald-400' : 'ri-file-copy-line'}></i>
            </button>
          </div>
        </div>

        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 space-y-1.5">
            <div className="text-teal-400 font-bold flex items-center gap-1.5">
              <i className="ri-graduation-cap-line text-sm"></i> EDUCATION
            </div>
            <p className="text-slate-200 font-semibold">{EDUCATION_DATA.institution}</p>
            <p className="text-slate-400 text-[11px]">{EDUCATION_DATA.degree}</p>
            <p className="text-emerald-300 text-[11px] font-bold">CGPA: {EDUCATION_DATA.cgpa}</p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 space-y-1.5">
            <div className="text-purple-400 font-bold flex items-center gap-1.5">
              <i className="ri-article-line text-sm"></i> IEEE PUBLICATIONS
            </div>
            <p className="text-slate-200 font-semibold">{PUBLICATIONS_DATA.length} Peer-Reviewed Papers</p>
            <p className="text-slate-400 text-[11px]">ICEIC 2025 (Osaka, Japan)</p>
            <p className="text-slate-400 text-[11px]">ICRPSET 2024 (Rajshahi, BD)</p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 space-y-1.5">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <i className="ri-award-line text-sm"></i> HONORS & CLUBS
            </div>
            <p className="text-amber-300 font-semibold">{HONORS_DATA[0].title}</p>
            <p className="text-slate-400 text-[11px]">OWASP • IEEE • Trace Labs</p>
            <p className="text-slate-400 text-[11px]">Osmosis Institute • 3Zero Club</p>
          </div>
        </div>
      </div>

      {/* Full Dossier Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[60px] sm:top-[68px] z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-[#0b0e17] rounded-xl border-2 border-slate-950 w-full max-w-sm sm:max-w-2xl md:max-w-3xl max-h-[calc(100dvh-95px)] flex flex-col p-4 sm:p-6 space-y-5 shadow-2xl relative my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-cyan-300 font-bold uppercase">[ CURRICULUM VITAE FULL DOSSIER ]</span>
              </div>

              <button
                onClick={() => {
                  soundEngine.play('click');
                  setIsPreviewOpen(false);
                }}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto space-y-6 pr-2 text-xs font-mono text-slate-300">
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-300 select-text">
                {cvTextContent}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
              <span className="text-[11px] font-mono text-slate-500">
                Official Document • Labib Bin Shahed
              </span>
              <button
                onClick={handleDownloadCv}
                className="py-2 px-4 rounded bg-cyan-500 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center space-x-1.5"
              >
                <i className="ri-download-line"></i>
                <span>DOWNLOAD FILE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
