import React, { useState, useEffect, useRef } from 'react';
import { TerminalEntry } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { BADGES_DATA, CERTIFICATIONS_DATA } from '../data/portfolioData';

interface TerminalModalProps {
 isOpen: boolean;
 onClose: () => void;
}

const ALL_COMMANDS = [
  'help',
  'menu',
  'fastfetch',
  'biofetch',
  'overwatch',
  'nmap',
  'scan',
  'portscan',
  'date',
  'contact',
  'clear',
  'sudo',
  'exit',
];

export const TerminalModal: React.FC<TerminalModalProps> = ({
 isOpen,
 onClose,
}) => {
 const [inputVal, setInputVal] = useState('');
 const [isExecuted, setIsExecuted] = useState<boolean>(false);
 const [history, setHistory] = useState<TerminalEntry[]>([
 { id:"1", type:"ascii", text:"▀█▀ █▀▀ █▀█ █▀▄▀█ █ █▄░█ ▄▀█ █░░\n░█░ ██▄ █▀▄ █░▀░█ █ █░▀█ █▀█ █▄▄\n==================================================================="},
 { id:"2", type:"teal", text:"Type \"help\"or \"menu\"to view available tactical commands.\nPress [TAB] for autocompletion | Use ↑ / ↓ for command history."},
 ]);
 const [cmdHistory, setCmdHistory] = useState<string[]>([]);
 const [historyIdx, setHistoryIdx] = useState<number>(-1);

 const inputRef = useRef<HTMLInputElement | null>(null);
 const bottomRef = useRef<HTMLDivElement | null>(null);

 useEffect(() => {
 if (isOpen) {
 setTimeout(() => inputRef.current?.focus(), 100);
 }
 }, [isOpen]);

 useEffect(() => {
 const handleEscapeKey = (e: KeyboardEvent) => {
 if (e.key === 'Escape' && isOpen) {
 onClose();
 }
 };
 window.addEventListener('keydown', handleEscapeKey);
 return () => window.removeEventListener('keydown', handleEscapeKey);
 }, [isOpen, onClose]);

 useEffect(() => {
 bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [history]);

 if (!isOpen) return null;

 const executeCommand = (rawCmd: string) => {
 const cmd = rawCmd.trim();
 if (!cmd) return;

 soundEngine.play('terminal_key');

 // Add to cmd history stack
 setCmdHistory((prev) => [...prev, cmd]);
 setHistoryIdx(-1);

 const newHistory: TerminalEntry[] = [{ id: crypto.randomUUID(), type: 'input', text: cmd }];
 const parts = cmd.split(' ').filter(Boolean);
 const baseCmd = parts[0]?.toLowerCase();
 const args = parts.slice(1);

 switch (baseCmd) {
 case 'help':
 case 'menu':
 newHistory.push({
 id: crypto.randomUUID(),
 type: 'ascii',
 text: `█░█ █▀▀ █░░ █▀█
█▀█ ██▄ █▄▄ █▀▀`,
 });
 newHistory.push({
 id: crypto.randomUUID(),
 type: 'teal',
 text: `===================================================================
[01] CORE COMMANDS
===================================================================
[01] help / menu : Display this manual
[02] fastfetch : Display system info, health diagnostics, & active user
[03] biofetch : Personnel dossier, skills, casefiles & certifications
===================================================================

[02] SECURITY TOOLS
===================================================================
[01] overwatch [tgt] : Automated reconnaissance, port mapping & vulnerability audit
===================================================================

[03] CONTROL
===================================================================
[01] clear : Clear terminal buffer
[02] exit : Terminate terminal session
===================================================================`
 });
 break;

 case 'biofetch':
 newHistory.push({
 id: crypto.randomUUID(),
 type: 'ascii',
 text: `█▄▄ █ █▀█ █▀▀ █▀▀ ▀█▀ █▀▀ █░█ ░
█▄█ █ █▄█ █▀░ ██▄ ░█░ █▄▄ █▀█ ▄`,
 });
 newHistory.push({
 id: crypto.randomUUID(),
 type: 'teal',
 text: `===================================================================
[01] PERSONNEL DOSSIER
===================================================================
[01] Name : Labib B. Shahed
[02] Role : CSE Student, Cyber Security Enthusiast, Programmer
[03] Speciality : Zero-Trust Platforms, Memory Forensics, EDR Evasion
[04] Clearance : Top Secret / SCI (Simulated)
===================================================================

[02] ARSENAL & PROFICIENCY MATRIX
===================================================================
[01] Domain : Programming [89%]
 Stack : TypeScript, Python, Java, Go, Rust

[02] Domain : Web & Backend [90%]
 Stack : React, Node.js, Next.js, PostgreSQL, Redis

[03] Domain : Cybersecurity [88%]
 Stack : Burp Suite Pro, Metasploit, Nmap, Wireshark, Volatility 3

[04] Domain : Cloud & Ops [90%]
 Stack : Docker, AWS, Ubuntu Linux, Kubernetes, Terraform

[05] Domain : Data Science [83%]
 Stack : scikit-learn, PyTorch, TensorFlow, Apache Kafka
===================================================================

[03] ACTIVE CASEFILES & PROJECTS
===================================================================
[01] CASE-091 : Spectre-X (Volatility 3 RAM Forensics & Rootkit Detector)
[02] CASE-084 : AegisGuard (WebAuthn & Passkey Zero-Trust Identity Engine)
[03] CASE-078 : Vortex-Fuzz (100k req/sec HTTP/2 Async Rust Fuzzer)
[04] CASE-065 : CipherTrace (Ransomware eBPF Detonation & Telemetry)
===================================================================

[04] CERTIFICATIONS & CREDENTIALS
===================================================================
${CERTIFICATIONS_DATA.map((c, i) => `[${(i + 1).toString().padStart(2, '0')}] Title : ${c.title}\n Issuer : ${c.issuer}\n Cert Type : ${c.status || 'VERIFIED'}`).join('\n')}
===================================================================

[05] DIGITAL BADGES
===================================================================
${BADGES_DATA.map((b, i) => `[${(i + 1).toString().padStart(2, '0')}] Title : ${b.title}\n Issuer : ${b.issuer}\n CredID : ${b.credentialId || 'N/A'}`).join('\n')}
===================================================================`
 });
 break;

 case"fastfetch":
 newHistory.push({
 id: crypto.randomUUID(),
 type:"ascii",
 text:"█▀▀ ▄▀█ █▀ ▀█▀ █▀▀ █▀▀ ▀█▀ █▀▀ █░█\n█▀░ █▀█ ▄█ ░█░ █▀░ ██▄ ░█░ █▄▄ █▀█",
 });
 newHistory.push({
 id: crypto.randomUUID(),
 type:"teal",
 text: `===================================================================\n[01] HARDWARE & ARCHITECTURE\n===================================================================\n[01] Machine ID : sec-node-01.internal (UUID: 4f9b-8a2c-1e5d)\n[02] Platform : x86_64-pc-linux-gnu / Bare-Metal Hypervisor\n[03] Processor : Intel(R) Xeon(R) Platinum 8375C CPU @ 2.80GHz (16 Cores, 32 Threads)\n[04] Microarch : Ice Lake (10nm) / Stepping 6 / AVX-512 Enabled\n[05] Memory : 4,096 MiB / 32,768 MiB (12.5% Utilized) [ECC DDR5 - 4800 MT/s]\n[06] Storage : 1.2 TB NVMe SSD (PCIe Gen4) [RAID 1 / LUKS Encrypted]\n===================================================================\n\n[02] OS & KERNEL ENVIRONMENT\n===================================================================\n[01] OS Release : SecOps Custom Linux (Build 2024.1)\n[02] Kernel : 6.8.0-sec-hardened (SMP PREEMPT_DYNAMIC)\n[03] Uptime : 42 days, 13 hours, 07 mins, 12 secs\n[04] Init Sys : systemd v252.6\n[05] Compilers : gcc 13.2.1, clang 17.0.6, go 1.22.0\n===================================================================\n\n[03] SECURITY & TELEMETRY\n===================================================================\n[01] Identity : labib@sec-node-01 [UID: 0001, GID: 0001 - TS/SCI SEC_OPS MASTER]\n[02] Integrity : OPTIMAL [0 Kernel Panics / SecureBoot: ENABLED]\n[03] eBPF Hooks : 14 Active Tracepoints (Network/Syscall Monitoring)\n[04] SELinux : Enforcing (Targeted Policy - v3.12)\n[05] Firewall : FortiGate 7.6 Virtual Fabric [STRICT FILTERING INGRESS/EGRESS]\n[06] Crypto Sub : FIPS 140-2 Validated Mode [Active]\n[07] Status : DEFCON 5 (ALL SYSTEMS NOMINAL)\n===================================================================`
 });
 break;
 

 
 

  case 'overwatch':
  case 'nmap':
  case 'scan':
  case 'portscan': {
    const target = args[0] || 'sec-node-01.internal';
    newHistory.push({
      id: crypto.randomUUID(),
      type: 'ascii',
      text: `█▀█ █░█ █▀█ █░█░█ ▄▀█ ▀█▀ █▀▀ █░█
█▄█ ▀▄▀ █▀▄ ▀▄▀▄▀ █▀█ ░█░ █▄▄ █▀█`,
    });
    newHistory.push({
      id: crypto.randomUUID(),
      type: 'teal',
      text: `===================================================================
[01] TARGET RECONNAISSANCE & LATENCY PROBE
===================================================================
[01] Target Host : ${target}
[02] Resolved IP : 10.0.0.1 (DNS: Cloudflare WARP)
[03] ICMP Latency : 14.2ms (0% Packet Loss, TTL=54)
[04] MAC Address : 0A:1B:2C:3D:4E:5F (OUI: Virtual Interface)
===================================================================

[02] SYN STEALTH SCAN
===================================================================
┌──────────┬────────────────────────────────────────────────────────┐
│ PORT     │ SERVICE & SECURITY AUDIT                               │
├──────────┼────────────────────────────────────────────────────────┤
│ 22/tcp   │ ssh • OpenSSH 9.6 (Clean: CVE-2024-6387)               │
│ 80/tcp   │ http • Nginx 1.25.3 (HSTS Active / 301)                │
│ 443/tcp  │ ssl/http • Nginx 1.25.3 (TLS 1.3 Quantum-Safe)         │
│ 8080/tcp │ http-proxy • Envoy WAF (SYN Dropped #14)               │
└──────────┴────────────────────────────────────────────────────────┘
===================================================================

[03] VULNERABILITY AUDIT & MITIGATION REPORT
===================================================================
[OK] Port 22 SSH : Clean (Patched against CVE-2024-6387 RegreSSHion)
[OK] Port 80 HTTP : Clean (Headers hardened, strict CSP enforced)
[ER] Port 443 HTTPS : INFO - TLS 1.2 legacy cipher suites supported
[OK] Memory Kernel : eBPF Spectre mitigation enabled (IBRS active)
===================================================================

[04] THREAT INTELLIGENCE SUMMARY
===================================================================
[01] Defense Posture : OPTIMAL (0 Critical, 0 High, 1 Info)
[02] Overall Score : 9.8 / 10 SECURE
[03] Recommendation : Disable TLS 1.2 CBC suites on proxy edge.
===================================================================`,
    });
    break;
  }
 case 'clear':
 setHistory([]);
 setInputVal('');
 return;

 case 'date':
 newHistory.push({
 id: crypto.randomUUID(),
 type: 'info',
 text: new Date().toUTCString(),
 });
 break;

 case 'contact':
 newHistory.push({
 id: crypto.randomUUID(),
 type: 'teal',
 text: 'Email : la-b-ib@github.io\nGitHub : https://github.com/la-b-ib\nPGP Fingerprint : 4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2',
 });
 break;


 case 'sudo':
 soundEngine.play('error');
 newHistory.push({
 id: crypto.randomUUID(),
 type: 'error',
 text: 'sudo: User is already root on sec-node-01. Incident reported.',
 });
 break;

 case 'exit':
 soundEngine.play('click');
 onClose();
 return;

 default:
 soundEngine.play('error');
 newHistory.push({
 id: crypto.randomUUID(),
 type: 'error',
 text: `bash: command not found:"${cmd}". Type"help"or press [TAB] for options.`,
 });
 break;
 }

 setHistory((prev) => [...prev, ...newHistory]);
 setInputVal('');
 setIsExecuted(true);
 };

 const showDefaultScreen = () => {
 soundEngine.play('terminal_key');
 setHistory([
 {
 id: crypto.randomUUID(),
 type: 'ascii',
 text:"▀█▀ █▀▀ █▀█ █▀▄▀█ █ █▄░█ ▄▀█ █░░\n░█░ ██▄ █▀▄ █░▀░█ █ █░▀█ █▀█ █▄▄\n===================================================================",
 },
 {
 id: crypto.randomUUID(),
 type: 'teal',
 text:"Type \"help\"or \"menu\"to view available tactical commands.\nPress [TAB] for autocompletion | Use ↑ / ↓ for command history.",
 },
 ]);
 setCmdHistory([]);
 setHistoryIdx(-1);
 setInputVal('');
 setIsExecuted(true);
 inputRef.current?.focus();
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 const cmdToRun = inputVal.trim();
 if (!cmdToRun) {
 showDefaultScreen();
 } else {
 executeCommand(cmdToRun);
 }
 inputRef.current?.focus();
 };

 const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
 if (e.key === 'ArrowUp') {
 e.preventDefault();
 if (cmdHistory.length === 0) return;
 const nextIdx = historyIdx + 1;
 if (nextIdx < cmdHistory.length) {
 setHistoryIdx(nextIdx);
 setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
 setIsExecuted(false);
 }
 } else if (e.key === 'ArrowDown') {
 e.preventDefault();
 if (historyIdx > 0) {
 const nextIdx = historyIdx - 1;
 setHistoryIdx(nextIdx);
 setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
 setIsExecuted(false);
 } else if (historyIdx === 0) {
 setHistoryIdx(-1);
 setInputVal('');
 setIsExecuted(false);
 }
 } else if (e.key === 'Tab') {
 e.preventDefault();
 const current = inputVal.trim().toLowerCase();
 if (!current) {
 setInputVal('help');
 setIsExecuted(false);
 return;
 }

 const matches = ALL_COMMANDS.filter((c) => c.startsWith(current));
 if (matches.length === 1) {
 setInputVal(matches[0]);
 setIsExecuted(false);
 soundEngine.play('click');
 } else if (matches.length > 1) {
 soundEngine.play('click');
 setHistory((prev) => [
 ...prev,
 { id: crypto.randomUUID(), type: 'input', text: `$ ${current}` },
 { id: crypto.randomUUID(), type: 'teal', text: `MATCHES: ${matches.join(' ')}` },
 ]);
 setIsExecuted(false);
 }
 }
 };



 const matchingCommand = inputVal.trim()
 ? ALL_COMMANDS.find((c) => c.startsWith(inputVal.trim().toLowerCase()))
 : null;
 const ghostText = matchingCommand ? matchingCommand.slice(inputVal.trim().length) : '';

 return (
 <section className="w-full h-full flex flex-col min-h-0 bg-[#000000] text-white font-mono animate-fadeIn transition-all ">
 <div className="w-full h-full flex flex-col min-h-0 bg-[#000000]">
        {/* Terminal Header Bar */}
        <div className="px-0 pt-0 pb-0 shrink-0 bg-[#000000]">
          <div className="bg-[#21232b] h-[45px] px-[15px] rounded-none border-0 flex items-center gap-2 select-none shrink-0">
            {/* Terminal Icon & Label */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  showDefaultScreen();
                }}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] cursor-pointer text-center border-0 text-[12px] leading-[12px] bg-[#a8c7fa] text-[#042e60] font-semibold active:scale-95 shrink-0"
                title="Terminal console / Reset view"
                aria-label="Terminal console"
              >
                <i className="ri-terminal-box-line text-base text-[#042e60]"></i>
              </button>
              <span className="font-mono font-semibold text-white flex items-center shrink-0">
                <span className="text-[16px] leading-[16px] pr-[14px] font-bold tracking-tight">TERMINAL</span>
              </span>
            </div>

            {/* Command Search Bar (Beside TERMINAL text - 15% shorter) */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 max-w-[85%] min-w-0 bg-[#000000] px-[5px] h-[35px] rounded-[16px] border-0 flex items-center gap-1.5 transition-colors focus-within:bg-[#000000]"
            >
              <span className="text-[#a8c7fa] font-mono font-semibold text-[12px] leading-[12px] flex items-center shrink-0">
                <i className="ri-money-dollar-circle-line text-[14px] text-[#a8c7fa]"></i>
              </span>
              <div className="relative flex-1 min-w-0 flex items-center h-full">
                <input
                  ref={inputRef}
                  type="text"
                  aria-label="Terminal command input"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    setHistoryIdx(-1);
                    setIsExecuted(false);
                  }}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="Type Command"
                  style={{ fontSize: '12px' }}
                  className="w-full bg-transparent border-none text-white font-mono text-[12px] !text-[12px] leading-[12px] !leading-[12px] focus:outline-none placeholder:text-[#8e9199] placeholder:text-[12px] placeholder:leading-[12px] h-full z-10"
                />
                {ghostText && inputVal.trim() && (
                  <span className="absolute left-0 pointer-events-none font-mono !text-[12px] !leading-[12px] text-[#44474f] whitespace-pre flex items-center">
                    <span className="opacity-0">{inputVal}</span>
                    <span>{ghostText}</span>
                  </span>
                )}
              </div>
              {/* Execute Command Button */}
              <button
                type="button"
                onClick={() => {
                  const cmdToRun = inputVal.trim();
                  if (!cmdToRun) {
                    showDefaultScreen();
                  } else {
                    executeCommand(cmdToRun);
                  }
                  inputRef.current?.focus();
                }}
                className="text-[#a8c7fa] active:scale-90 transition-all p-0.5 flex items-center justify-center shrink-0 cursor-pointer focus:outline-none rounded-full"
                title={inputVal.trim() ? "Execute command" : "Show terminal default screen"}
                aria-label={inputVal.trim() ? "Execute command" : "Show terminal default screen"}
              >
                <i
                  className={`${
                    isExecuted && !inputVal.trim()
                      ? 'ri-play-circle-line'
                      : 'ri-pause-circle-line'
                  } text-[16px] text-[#a8c7fa] transition-colors`}
                ></i>
              </button>
            </form>

            {/* Exit Terminal Button */}
            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  soundEngine.play('click');
                  onClose();
                }}
                className="bg-[#ffb4ab] text-[#690005] shadow-md border-0 w-[32px] h-[32px] rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
                title="Exit terminal view [ESC]"
                aria-label="Exit terminal view"
              >
                <i className="ri-close-circle-line text-base font-bold"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Screen Log Area */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex-1 min-h-0 bg-[#000000] px-[15px] pt-[15px] pb-0 font-mono text-[12px] leading-[14px] overflow-y-auto space-y-2 [scrollbar-width:thin] [scrollbar-color:#44474f_#000000] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#000000] [&::-webkit-scrollbar-thumb]:bg-[#44474f] [&::-webkit-scrollbar-thumb]:rounded-full select-text"
        >
 {history.map((item) => {
 const textColorClass =
 item.type === 'input'
 ? `text-[#a8c7fa] font-bold`
 : item.type === 'error'
 ? 'text-[#ffb4ab]'
 : item.type === 'success'
 ? 'text-[#a8e6cf]'
 : item.type === 'amber'
 ? 'text-[#ffb870]'
 : item.type === 'teal'
 ? 'text-[#a8c7fa]'
 : item.type === 'ascii'
 ? 'text-[#c4c6d0]'
 : 'text-[#c4c6d0]';

 if (item.type === 'input') {
 return (
 <div key={item.id} className="flex gap-2 break-words">
 <span className="text-[#8e9199] shrink-0 select-none hidden">node-01:~$</span>
 <span className="text-[#8e9199] shrink-0 select-none">~$</span>
 <span className={`text-[#a8c7fa] font-bold`}>{item.text}</span>
 </div>
 );
 }

 if (item.type === 'ascii') {
 return (
 <div key={item.id} className={`whitespace-pre overflow-x-hidden text-clip ${textColorClass} text-[16px] leading-[18px]`}>
 {item.text}
 </div>
 );
 }
          const rawLines = item.text.split('\n');

          // Group lines and detect tables
          type ParsedElement = 
            | { type: 'table'; headers: string[]; rows: string[][] }
            | { type: 'line'; line: string };

          const elements: ParsedElement[] = [];
          let lineIdx = 0;

          while (lineIdx < rawLines.length) {
            const currentLine = rawLines[lineIdx];
            const isBoxTable = currentLine.startsWith('┌') || (currentLine.startsWith('│') && currentLine.toUpperCase().includes('PORT'));
            const isPipeTable = currentLine.startsWith('|') && currentLine.toUpperCase().includes('PORT');
            const isDashTable = currentLine.startsWith('----') && rawLines[lineIdx + 1]?.toUpperCase().includes('PORT');
            const isPlainHeader = currentLine.toUpperCase().includes('PORT') && (currentLine.toUpperCase().includes('SERVICE') || currentLine.toUpperCase().includes('STATE'));

            if (isBoxTable || isPipeTable || isDashTable || isPlainHeader) {
              const tableBlock: string[] = [];
              while (
                lineIdx < rawLines.length &&
                rawLines[lineIdx].trim() !== '' &&
                !rawLines[lineIdx].startsWith('===') &&
                !/^\s*\[[0-9]{2}\]/.test(rawLines[lineIdx])
              ) {
                tableBlock.push(rawLines[lineIdx]);
                lineIdx++;
              }

              let headers: string[] = [];
              const rows: string[][] = [];
              for (const tblLine of tableBlock) {
                const trimmed = tblLine.trim();
                if (
                  trimmed.startsWith('┌') ||
                  trimmed.startsWith('├') ||
                  trimmed.startsWith('└') ||
                  trimmed.startsWith('----') ||
                  trimmed.startsWith('====')
                ) {
                  continue;
                }
                if (tblLine.includes('│')) {
                  const cells = tblLine.split('│').slice(1, -1).map((c) => c.trim());
                  if (cells.length > 0) {
                    if (headers.length === 0) {
                      headers = cells;
                    } else {
                      rows.push(cells);
                    }
                  }
                } else if (tblLine.includes('|')) {
                  const cells = tblLine.split('|').slice(1, -1).map((c) => c.trim());
                  if (cells.length > 0) {
                    if (headers.length === 0) {
                      headers = cells;
                    } else {
                      rows.push(cells);
                    }
                  }
                } else {
                  const parts = trimmed.split(/\s+/).map((c) => c.trim()).filter(Boolean);
                  if (parts.length >= 2) {
                    if (headers.length === 0) {
                      headers = parts;
                    } else {
                      rows.push(parts);
                    }
                  }
                }
              }
              if (headers.length > 0 && rows.length > 0) {
                elements.push({ type: 'table', headers, rows });
              }
            } else {
              elements.push({ type: 'line', line: currentLine });
              lineIdx++;
            }
          }

          return (
            <div key={item.id} className={`break-words ${textColorClass} grid grid-cols-[max-content_max-content_auto_1fr] gap-x-2 gap-y-0.5 items-baseline w-full`}>
              {elements.map((el, elIdx) => {
                if (el.type === 'table') {
                  const isTwoCol = el.headers.length === 2;
                  const isThreeCol = el.headers.length === 3;

                  return (
                    <div key={elIdx} className="col-span-full my-2.5 sm:my-3 border border-[#2d3139] rounded-lg bg-[#0a0e17]/95 shadow-xl font-mono overflow-hidden w-full">
                      <table className="w-full text-left border-collapse table-fixed text-[12px] leading-[12px]">
                        <thead>
                          <tr className="bg-[#131924] border-b border-[#2d3139] text-[#8e9199] font-bold uppercase tracking-wider select-none text-[12px] leading-[12px]">
                            {el.headers.map((h, hIdx) => {
                              let colWidth = '';
                              if (isTwoCol) {
                                if (hIdx === 0) colWidth = 'w-[32%] sm:w-[24%]';
                                else colWidth = 'w-[68%] sm:w-[76%]';
                              } else if (isThreeCol) {
                                if (hIdx === 0) colWidth = 'w-[28%] sm:w-[22%]';
                                else if (hIdx === 1) colWidth = 'w-[28%] sm:w-[22%]';
                                else colWidth = 'w-[44%] sm:w-[56%]';
                              }
                              return (
                                <th
                                  key={hIdx}
                                  className={`px-2 sm:px-3 py-1.5 sm:py-2 truncate ${colWidth} text-left text-[12px] leading-[12px]`}
                                >
                                  {h}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {el.rows.map((row, rIdx) => {
                            if (isTwoCol) {
                              const [port, serviceAndAudit] = row;
                              const parts = (serviceAndAudit || '').split('•').map(p => p.trim());
                              const serviceName = parts[0] || '';
                              const auditNote = parts.slice(1).join(' • ');

                              return (
                                <tr
                                  key={rIdx}
                                  className="border-b border-[#1b2230]/70 hover:bg-[#151e2d]/80 transition-colors last:border-b-0 text-[12px] leading-[12px]"
                                >
                                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-[#a8c7fa] font-bold truncate text-[12px] leading-[12px]">
                                    {port}
                                  </td>
                                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-[#c4c6d0] break-words text-[12px] leading-[12px]">
                                    <span className="text-[#d0bcff] font-semibold">{serviceName}</span>
                                    {auditNote && (
                                      <span className="text-[12px] leading-[12px] block sm:inline sm:before:content-['•_'] text-[#8e9199]">
                                        {auditNote.includes('Clean') || auditNote.includes('Patched') ? (
                                          <span className="text-[#a8e6cf] font-medium">{auditNote}</span>
                                        ) : auditNote.includes('WAF') || auditNote.includes('Dropped') ? (
                                          <span className="text-[#ffb870] font-medium">{auditNote}</span>
                                        ) : auditNote.includes('TLS') || auditNote.includes('Quantum') || auditNote.includes('HSTS') ? (
                                          <span className="text-[#a8c7fa] font-medium">{auditNote}</span>
                                        ) : (
                                          auditNote
                                        )}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            }

                            if (isThreeCol) {
                              // 3-column row
                              const [port, state, serviceAndAudit] = row;
                              const isStateOpen = state?.toLowerCase() === 'open';
                              const isStateFiltered = state?.toLowerCase() === 'filtered';
                              const isStateClosed = state?.toLowerCase() === 'closed';

                              const parts = (serviceAndAudit || '').split('•').map(p => p.trim());
                              const serviceName = parts[0] || '';
                              const auditNote = parts.slice(1).join(' • ');

                              return (
                                <tr
                                  key={rIdx}
                                  className="border-b border-[#1b2230]/70 hover:bg-[#151e2d]/80 transition-colors last:border-b-0 text-[12px] leading-[12px]"
                                >
                                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-[#a8c7fa] font-bold truncate text-[12px] leading-[12px]">
                                    {port}
                                  </td>
                                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-[12px] leading-[12px]">
                                    {isStateOpen && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] leading-[12px] font-bold text-[#a8e6cf] bg-[#00522b]/50 border border-[#a8e6cf]/40 shadow-sm select-none">
                                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#a8e6cf] animate-pulse shrink-0" />
                                        OPEN
                                      </span>
                                    )}
                                    {isStateFiltered && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] leading-[12px] font-bold text-[#ffb870] bg-[#4a2800]/50 border border-[#ffb870]/40 shadow-sm select-none">
                                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#ffb870] shrink-0" />
                                        FILTERED
                                      </span>
                                    )}
                                    {isStateClosed && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] leading-[12px] font-bold text-[#ffb4ab] bg-[#690005]/50 border border-[#ffb4ab]/40 shadow-sm select-none">
                                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#ffb4ab] shrink-0" />
                                        CLOSED
                                      </span>
                                    )}
                                    {!isStateOpen && !isStateFiltered && !isStateClosed && (
                                      <span className="text-white/80">{state}</span>
                                    )}
                                  </td>
                                  <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-[#c4c6d0] break-words text-[12px] leading-[12px]">
                                    <span className="text-[#d0bcff] font-semibold">{serviceName}</span>
                                    {auditNote && (
                                      <span className="text-[12px] leading-[12px] block sm:inline sm:before:content-['•_'] text-[#8e9199]">
                                        {auditNote.includes('Clean') || auditNote.includes('Patched') ? (
                                          <span className="text-[#a8e6cf] font-medium">{auditNote}</span>
                                        ) : auditNote.includes('WAF') || auditNote.includes('Dropped') ? (
                                          <span className="text-[#ffb870] font-medium">{auditNote}</span>
                                        ) : auditNote.includes('TLS') || auditNote.includes('Quantum') || auditNote.includes('HSTS') ? (
                                          <span className="text-[#a8c7fa] font-medium">{auditNote}</span>
                                        ) : (
                                          auditNote
                                        )}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            }

                            // Fallback for other tables
                            return (
                              <tr
                                key={rIdx}
                                className="border-b border-[#1b2230]/70 hover:bg-[#151e2d]/80 transition-colors last:border-b-0 text-[12px] leading-[12px]"
                              >
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-2 sm:px-3 py-1.5 sm:py-2 text-[#c4c6d0] break-words text-[12px] leading-[12px]">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                const line = el.line;

                // Separator lines
                if (/^\s*={3,}\s*$/.test(line) || /^\s*-{10,}\s*$/.test(line)) {
                  return (
                    <div key={elIdx} className="col-span-full whitespace-nowrap overflow-hidden text-clip opacity-40 py-0.5 text-[#44474f]">
                      {line}
                    </div>
                  );
                }

                // Check for tag prefix like [01], [OK], [ER], [INFO], etc.
                const tagMatch = line.match(/^(\s*\[(?:[A-Za-z0-9\s✓+!*?_\-]{1,15})\])(.*)$/);

                if (tagMatch) {
                  const rawTag = tagMatch[1].trim();
                  const restAfterTag = tagMatch[2];

                  // Section header (no colon)
                  if (!restAfterTag.includes(':')) {
                    let headerTagColor = 'text-[#a8c7fa] bg-[#004a77]/30 border-[#a8c7fa]/20';
                    if (rawTag.includes('OK') || rawTag.includes('✓')) {
                      headerTagColor = 'text-[#a8e6cf] bg-[#00522b]/30 border-[#a8e6cf]/20';
                    } else if (rawTag.includes('ER') || rawTag.includes('FAIL') || rawTag.includes('!')) {
                      headerTagColor = 'text-[#ffb4ab] bg-[#690005]/30 border-[#ffb4ab]/20';
                    } else if (/\[[0-9]{2}\]/.test(rawTag)) {
                      headerTagColor = 'text-[#ffb870] bg-[#4a2800]/30 border-[#ffb870]/20';
                    }

                    return (
                      <div key={elIdx} className="col-span-full flex items-center gap-2 font-bold pt-2 pb-0.5">
                        <span className={`text-[11px] leading-[13px] px-1.5 py-0.5 rounded border font-mono ${headerTagColor} shrink-0 select-none`}>
                          {rawTag}
                        </span>
                        <span className="tracking-wide text-[#ffb870] font-semibold">{restAfterTag.trim()}</span>
                      </div>
                    );
                  }

                  // Tagged Key-Value line
                  const colonIdx = restAfterTag.indexOf(':');
                  const keyPart = restAfterTag.slice(0, colonIdx).trim();
                  const valPart = restAfterTag.slice(colonIdx + 1).trim();

                  let tagBadgeColor = 'text-[#a8c7fa] bg-[#004a77]/30 border-[#a8c7fa]/20';
                  if (rawTag.includes('OK') || rawTag.includes('✓')) {
                    tagBadgeColor = 'text-[#a8e6cf] bg-[#00522b]/30 border-[#a8e6cf]/20';
                  } else if (rawTag.includes('ER') || rawTag.includes('FAIL') || rawTag.includes('!')) {
                    tagBadgeColor = 'text-[#ffb4ab] bg-[#690005]/30 border-[#ffb4ab]/20';
                  }

                  return (
                    <React.Fragment key={elIdx}>
                      <div className="flex items-center py-0.5">
                        <span className={`text-[11px] leading-[13px] px-1.5 py-0.2 rounded border font-mono font-bold ${tagBadgeColor} shrink-0 select-none`}>
                          {rawTag}
                        </span>
                      </div>
                      <div className="py-0.5 text-[12px] leading-[16px] text-[#a8c7fa] font-mono select-text whitespace-nowrap">
                        {keyPart}
                      </div>
                      <div className="py-0.5 text-[12px] leading-[16px] text-[#8e9199] font-bold select-none text-center">
                        :
                      </div>
                      <div className="py-0.5 text-[12px] leading-[16px] text-white font-medium break-words min-w-0">
                        {valPart}
                      </div>
                    </React.Fragment>
                  );
                }

                // Untagged line: check if it is an indented sub-item or direct key-value
                const isIndented = /^\s{1,8}[A-Za-z0-9]/.test(line);
                const colonIndex = line.indexOf(':');
                if (!line.includes('//') && colonIndex > 0 && !line.startsWith('http://') && !line.startsWith('https://')) {
                  const keyCandidate = line.slice(0, colonIndex).trim();
                  if (keyCandidate.length <= 35 && !keyCandidate.includes('\n') && !keyCandidate.startsWith('[')) {
                    const valPart = line.slice(colonIndex + 1).trim();
                    return (
                      <React.Fragment key={elIdx}>
                        <div className="flex items-center justify-end pr-1 py-0.5">
                          {isIndented ? (
                            <span className="text-[#8e9199]/70 font-mono text-[10px] select-none">↳</span>
                          ) : (
                            <span className="w-0 block" />
                          )}
                        </div>
                        <div className={`py-0.5 text-[12px] leading-[16px] ${isIndented ? 'text-[#8e9199]' : 'text-[#a8c7fa]'} font-mono select-text whitespace-nowrap`}>
                          {keyCandidate}
                        </div>
                        <div className="py-0.5 text-[12px] leading-[16px] text-[#8e9199] font-bold select-none text-center">
                          :
                        </div>
                        <div className="py-0.5 text-[12px] leading-[16px] text-white/95 font-medium break-words min-w-0">
                          {valPart}
                        </div>
                      </React.Fragment>
                    );
                  }
                }

                return (
                  <div key={elIdx} className="col-span-full whitespace-pre-wrap py-0.5 text-[#c4c6d0] text-[12px] leading-[16px]">
                    {line}
                  </div>
                );
              })}
            </div>
          );
 })}
 <div ref={bottomRef} className="!mt-0"></div>
 </div>
 </div>
 </section>
  );
};


