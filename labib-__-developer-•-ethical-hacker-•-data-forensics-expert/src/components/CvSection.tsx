import React from 'react';
import { soundEngine } from '../utils/soundEngine';

export const CvSection: React.FC = () => {
  // Generate downloadable CV text content for download feature
  const cvTextContent = `
================================================================================
LABIB BIN SHAHED - CURRICULUM VITAE
================================================================================
Cybersecurity Analyst | Software Engineer | AI & Network Security Researcher
Email: labib.b.shahed@gmail.com
Location: DHK, BD (23.77°N, 90.42°E)

RESEARCH PROFILES:
- IEEE Xplore: https://ieeexplore.ieee.org/author/428150838708730
- Google Scholar: https://scholar.google.com/citations?user=xg04A5kAAAAJ&hl=en
- ORCID: https://orcid.org/0009-0007-4656-8709
- ResearchGate: https://www.researchgate.net/profile/Labib-Bin-Shahed

EDUCATION:
BRAC University | B.Sc. in CSE
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
- Technical & Security: OWASP, Trace Labs, IEEE, BUEEC
- Research, Editorial & Social: Osmosis Institute, BRACU Express, 3Zero Club

TECHNICAL SKILLS:
- Cybersecurity: Penetration Testing, Threat Hunting, Digital Forensics, OWASP Top 10, Network Security
- Programming: TypeScript, Go, Python, C, Rust, C++
- Tools & Platforms: Wireshark, Metasploit, Nmap, Burp Suite, Docker, Linux, Git, Firebase
================================================================================
`;

  const handleDownloadCv = async () => {
    soundEngine.play('click');
    const cvUrl = 'https://cdn.jsdelivr.net/gh/la-b-ib/la-b-ib@main/website%20assets/CV/cv.pdf';
    try {
      const response = await fetch(cvUrl);
      if (!response.ok) throw new Error('Failed to fetch CV file');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Labib_Bin_Shahed_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback direct download link trigger if fetch is restricted
      const link = document.createElement('a');
      link.href = cvUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = 'Labib_Bin_Shahed_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="mt-[15px] mb-0 pb-0">
      {/* Curriculum Vitae Container Box */}
      <div className="bg-[#21232b] border-0 p-4 sm:p-5 rounded-2xl transition-all flex items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shrink-0 shadow-sm">
            <i className="ri-file-text-line"></i>
          </div>
          <div className="space-y-0.5 min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-white truncate leading-[16px]">
              Curriculum Vitae
            </h4>
            <p className="text-xs font-mono text-[#a8c7fa] font-semibold truncate">
              Labib Bin Shahed
            </p>
          </div>
        </div>
        <button
          onClick={handleDownloadCv}
          className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] hover:bg-[#c2e7ff] text-[#00325b] flex items-center justify-center text-base font-bold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95 border-0"
          title="Download Curriculum Vitae (PDF)"
          aria-label="Download CV"
        >
          <i className="ri-file-download-line text-base"></i>
        </button>
      </div>
    </div>
  );
};
