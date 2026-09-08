import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface CvssCalculatorModalProps {
 isOpen: boolean;
 onClose: () => void;
}

interface CvssMetrics {
 AV: 'N' | 'A' | 'L' | 'P';
 AC: 'L' | 'H';
 PR: 'N' | 'L' | 'H';
 UI: 'N' | 'R';
 S: 'U' | 'C';
 C: 'N' | 'L' | 'H';
 I: 'N' | 'L' | 'H';
 A: 'N' | 'L' | 'H';
}

const PRESET_VULNS: Record<string, { name: string; cve: string; metrics: CvssMetrics }> = {
 regresshion: {
 name: 'OpenSSH RegreSSHion RCE',
 cve: 'CVE-2024-6387',
 metrics: { AV: 'N', AC: 'H', PR: 'N', UI: 'N', S: 'U', C: 'H', I: 'H', A: 'H' },
 },
 log4shell: {
 name: 'Log4j Remote Code Execution',
 cve: 'CVE-2021-44228',
 metrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'C', C: 'H', I: 'H', A: 'H' },
 },
 prompt_injection: {
 name: 'Indirect Prompt Injection (OWASP LLM01)',
 cve: 'OWASP-LLM01',
 metrics: { AV: 'N', AC: 'L', PR: 'N', UI: 'R', S: 'C', C: 'H', I: 'H', A: 'L' },
 },
 ebpf_rootkit: {
 name: 'Kernel Ring Buffer Overwrite',
 cve: 'CVE-2025-21689',
 metrics: { AV: 'L', AC: 'L', PR: 'H', UI: 'N', S: 'U', C: 'H', I: 'H', A: 'H' },
 },
};

export const CvssCalculatorModal: React.FC<CvssCalculatorModalProps> = ({ isOpen, onClose }) => {
 const [metrics, setMetrics] = useState<CvssMetrics>({
 AV: 'N',
 AC: 'L',
 PR: 'N',
 UI: 'N',
 S: 'U',
 C: 'H',
 I: 'H',
 A: 'H',
 });

 const [copied, setCopied] = useState(false);

 if (!isOpen) return null;

 // Calculate standard CVSS v3.1 score approximation
 const calculateScore = (m: CvssMetrics): { score: number; severity: string; color: string } => {
 let base = 0;

 // Impact sub score
 const cMap = { N: 0, L: 0.22, H: 0.56 };
 const iMap = { N: 0, L: 0.22, H: 0.56 };
 const aMap = { N: 0, L: 0.22, H: 0.56 };
 const iss = 1 - (1 - cMap[m.C]) * (1 - iMap[m.I]) * (1 - aMap[m.A]);

 let impact = 0;
 if (m.S === 'U') {
 impact = 6.42 * iss;
 } else {
 impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
 }

 // Exploitability sub score
 const avMap = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 };
 const acMap = { L: 0.77, H: 0.44 };
 const prMap = m.S === 'U' ? { N: 0.85, L: 0.62, H: 0.27 } : { N: 0.85, L: 0.68, H: 0.5 };
 const uiMap = { N: 0.85, R: 0.62 };

 const exploitability = 8.22 * avMap[m.AV] * acMap[m.AC] * prMap[m.PR] * uiMap[m.UI];

 if (impact <= 0) {
 base = 0;
 } else if (m.S === 'U') {
 base = Math.min(Math.ceil((impact + exploitability) * 10) / 10, 10);
 } else {
 base = Math.min(Math.ceil((1.08 * (impact + exploitability)) * 10) / 10, 10);
 }

 let severity = 'INFORMATIONAL';
 let color = 'text-[#a8c7fa] border-[#a8c7fa] bg-[#004a77]/30';

 if (base >= 9.0) {
 severity = 'CRITICAL';
 color = 'text-[#ffb4ab] border-[#ffb4ab] bg-[#93000a]/40 animate-pulse';
 } else if (base >= 7.0) {
 severity = 'HIGH';
 color = 'text-[#ffb951] border-[#ffb951] bg-[#5f3300]/40';
 } else if (base >= 4.0) {
 severity = 'MEDIUM';
 color = 'text-[#e2e2e6] border-[#8e9199] bg-[#36343b]/40';
 } else if (base > 0) {
 severity = 'LOW';
 color = 'text-[#a8e6cf] border-[#a8e6cf] bg-[#005231]/40';
 }

 return { score: base, severity, color };
 };

 const { score, severity, color } = calculateScore(metrics);
 const vectorString = `CVSS:3.1/AV:${metrics.AV}/AC:${metrics.AC}/PR:${metrics.PR}/UI:${metrics.UI}/S:${metrics.S}/C:${metrics.C}/I:${metrics.I}/A:${metrics.A}`;

 const handleCopyVector = () => {
 navigator.clipboard.writeText(vectorString);
 soundEngine.play('click');
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 const handleLoadPreset = (key: string) => {
 if (PRESET_VULNS[key]) {
 setMetrics(PRESET_VULNS[key].metrics);
 soundEngine.play('click');
 }
 };

 return (
 <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
 <div className="bg-[#1a1b21] rounded-2xl border border-[#44474f] w-full max-w-3xl max-h-[calc(100dvh-60px)] overflow-y-auto p-6 space-y-6 shadow-2xl relative my-auto text-white font-mono text-xs">
 
 {/* Modal Header */}
 <div className="flex items-center justify-between border-b border-[#44474f]/50 pb-4">
 <div className="flex items-center space-x-2">
 <div className="p-2 bg-[#004a77]/30 border border-[#a8c7fa]/30 rounded-xl text-[#a8c7fa]">
 <i className="ri-[#a8c7fa] ri-calculator-line text-lg"></i>
 </div>
 <div>
 <h3 className="text-base font-bold text-white">CVSS v3.1 Threat Score Calculator</h3>
 <p className="text-[11px] text-[#8e9199]">FIRST Standard Vulnerability Scoring Metric System</p>
 </div>
 </div>

 <button
 onClick={() => {
 onClose();
 soundEngine.play('click');
 }}
 className="w-8 h-8 rounded-full bg-[#21232b] border border-[#44474f] text-[#c4c6d0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
 >
 <i className="ri-close-line text-lg"></i>
 </button>
 </div>

 {/* Preset Load Buttons */}
 <div className="space-y-2">
 <label className="text-[10px] text-[#8e9199] font-bold uppercase tracking-wider">LOAD FAMOUS CVE METRICS PRESET</label>
 <div className="flex flex-wrap gap-2">
 {Object.entries(PRESET_VULNS).map(([key, val]) => (
 <button
 key={key}
 onClick={() => handleLoadPreset(key)}
 className="px-3 py-1.5 rounded-xl bg-[#13141a] hover:bg-[#21232b] border border-[#44474f]/60 text-[#c4c6d0] hover:text-white transition-all cursor-pointer text-[11px] flex items-center space-x-1.5"
 >
 <i className="ri-bug-line text-[#a8c7fa]"></i>
 <span>{val.name} ({val.cve})</span>
 </button>
 ))}
 </div>
 </div>

 {/* Score & Vector Summary Card */}
 <div className="bg-[#13141a] p-5 rounded-2xl border border-[#44474f]/60 flex flex-col items-center justify-between gap-4 shadow-inner">
 <div className="space-y-1 text-center">
 <div className="text-[10px] text-[#8e9199] uppercase font-bold">CALCULATED BASE SCORE</div>
 <div className="flex items-center justify-center space-x-3">
 <span className="text-4xl font-bold text-white">{score.toFixed(1)}</span>
 <span className={`px-3 py-1 rounded-full border text-xs font-bold ${color}`}>
 {severity}
 </span>
 </div>
 </div>

 <div className="w-full text-center space-y-2">
 <div className="text-[10px] text-[#8e9199] uppercase font-bold">CVSS VECTOR STRING</div>
 <div className="bg-[#1a1b21] px-3 py-1.5 rounded-xl border border-[#44474f] text-[11px] text-[#a8e6cf] font-mono break-all">
 {vectorString}
 </div>
 <button
 onClick={handleCopyVector}
 className="px-3 py-1 bg-[#004a77] hover:bg-[#00639b] text-[#c2e7ff] rounded-lg text-[10px] font-bold border border-[#a8c7fa]/30 transition-all cursor-pointer inline-flex items-center space-x-1"
 >
 <i className={copied ? 'ri-check-line text-emerald-400' : 'ri-file-copy-line'}></i>
 <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY VECTOR'}</span>
 </button>
 </div>
 </div>

 {/* Metrics Selector Grid */}
 <div className="grid grid-cols-1 gap-4">
 
 {/* Attack Vector (AV) */}
 <div className="p-3.5 bg-[#13141a] rounded-xl border border-[#44474f]/40 space-y-2">
 <div className="text-[#a8c7fa] font-bold text-[11px]">ATTACK VECTOR (AV)</div>
 <div className="grid grid-cols-2 gap-1.5">
 {[
 { k: 'N', label: 'Network (N)' },
 { k: 'A', label: 'Adjacent (A)' },
 { k: 'L', label: 'Local (L)' },
 { k: 'P', label: 'Physical (P)' },
 ].map((item) => (
 <button
 key={item.k}
 onClick={() => setMetrics({ ...metrics, AV: item.k as any })}
 className={`p-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
 metrics.AV === item.k ? 'bg-[#a8c7fa] text-[#042e60] border-[#a8c7fa]' : 'bg-[#1a1b21] text-[#8e9199] border-[#44474f]/40 hover:text-white'
 }`}
 >
 {item.label}
 </button>
 ))}
 </div>
 </div>

 {/* Attack Complexity (AC) */}
 <div className="p-3.5 bg-[#13141a] rounded-xl border border-[#44474f]/40 space-y-2">
 <div className="text-[#a8c7fa] font-bold text-[11px]">ATTACK COMPLEXITY (AC)</div>
 <div className="grid grid-cols-2 gap-1.5">
 {[
 { k: 'L', label: 'Low (L)' },
 { k: 'H', label: 'High (H)' },
 ].map((item) => (
 <button
 key={item.k}
 onClick={() => setMetrics({ ...metrics, AC: item.k as any })}
 className={`p-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
 metrics.AC === item.k ? 'bg-[#a8c7fa] text-[#042e60] border-[#a8c7fa]' : 'bg-[#1a1b21] text-[#8e9199] border-[#44474f]/40 hover:text-white'
 }`}
 >
 {item.label}
 </button>
 ))}
 </div>
 </div>

 {/* Privileges Required (PR) */}
 <div className="p-3.5 bg-[#13141a] rounded-xl border border-[#44474f]/40 space-y-2">
 <div className="text-[#a8c7fa] font-bold text-[11px]">PRIVILEGES REQUIRED (PR)</div>
 <div className="grid grid-cols-3 gap-1.5">
 {[
 { k: 'N', label: 'None (N)' },
 { k: 'L', label: 'Low (L)' },
 { k: 'H', label: 'High (H)' },
 ].map((item) => (
 <button
 key={item.k}
 onClick={() => setMetrics({ ...metrics, PR: item.k as any })}
 className={`p-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
 metrics.PR === item.k ? 'bg-[#a8c7fa] text-[#042e60] border-[#a8c7fa]' : 'bg-[#1a1b21] text-[#8e9199] border-[#44474f]/40 hover:text-white'
 }`}
 >
 {item.label}
 </button>
 ))}
 </div>
 </div>

 {/* User Interaction (UI) */}
 <div className="p-3.5 bg-[#13141a] rounded-xl border border-[#44474f]/40 space-y-2">
 <div className="text-[#a8c7fa] font-bold text-[11px]">USER INTERACTION (UI)</div>
 <div className="grid grid-cols-2 gap-1.5">
 {[
 { k: 'N', label: 'None (N)' },
 { k: 'R', label: 'Required (R)' },
 ].map((item) => (
 <button
 key={item.k}
 onClick={() => setMetrics({ ...metrics, UI: item.k as any })}
 className={`p-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
 metrics.UI === item.k ? 'bg-[#a8c7fa] text-[#042e60] border-[#a8c7fa]' : 'bg-[#1a1b21] text-[#8e9199] border-[#44474f]/40 hover:text-white'
 }`}
 >
 {item.label}
 </button>
 ))}
 </div>
 </div>

 {/* Scope (S) */}
 <div className="p-3.5 bg-[#13141a] rounded-xl border border-[#44474f]/40 space-y-2">
 <div className="text-[#a8c7fa] font-bold text-[11px]">SCOPE (S)</div>
 <div className="grid grid-cols-2 gap-1.5">
 {[
 { k: 'U', label: 'Unchanged (U)' },
 { k: 'C', label: 'Changed (C)' },
 ].map((item) => (
 <button
 key={item.k}
 onClick={() => setMetrics({ ...metrics, S: item.k as any })}
 className={`p-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
 metrics.S === item.k ? 'bg-[#a8c7fa] text-[#042e60] border-[#a8c7fa]' : 'bg-[#1a1b21] text-[#8e9199] border-[#44474f]/40 hover:text-white'
 }`}
 >
 {item.label}
 </button>
 ))}
 </div>
 </div>

 {/* Confidentiality Impact (C) */}
 <div className="p-3.5 bg-[#13141a] rounded-xl border border-[#44474f]/40 space-y-2">
 <div className="text-[#a8c7fa] font-bold text-[11px]">CONFIDENTIALITY IMPACT (C)</div>
 <div className="grid grid-cols-3 gap-1.5">
 {[
 { k: 'N', label: 'None' },
 { k: 'L', label: 'Low' },
 { k: 'H', label: 'High' },
 ].map((item) => (
 <button
 key={item.k}
 onClick={() => setMetrics({ ...metrics, C: item.k as any })}
 className={`p-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
 metrics.C === item.k ? 'bg-[#a8c7fa] text-[#042e60] border-[#a8c7fa]' : 'bg-[#1a1b21] text-[#8e9199] border-[#44474f]/40 hover:text-white'
 }`}
 >
 {item.label}
 </button>
 ))}
 </div>
 </div>

 </div>

 {/* Action Button */}
 <div className="pt-2 text-right">
 <button
 onClick={() => {
 onClose();
 soundEngine.play('click');
 }}
 className="m3-btn-primary cursor-pointer text-xs font-bold px-6"
 >
 DONE & CLOSE CALCULATOR
 </button>
 </div>

 </div>
 </div>
 );
};
