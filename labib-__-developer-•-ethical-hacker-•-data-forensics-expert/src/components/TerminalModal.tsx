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
    { id: "1", type: "ascii", text: "▀█▀ █▀▀ █▀█ █▀▄▀█ █ █▄░█ ▄▀█ █░░\n░█░ ██▄ █▀▄ █░▀░█ █ █░▀█ █▀█ █▄▄\n===================================================================" },
    { id: "2", type: "teal", text: "Type \"help\" or \"menu\" to view available tactical commands.\nPress [TAB] for autocompletion | Use ↑ / ↓ for command history." },
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
[01] help / menu    : Display this manual
[02] fastfetch      : Display system info, health diagnostics, & active user
[03] biofetch       : Personnel dossier, skills, casefiles & certifications
===================================================================

[02] SECURITY TOOLS
===================================================================
[01] overwatch [tgt]: Automated reconnaissance, port mapping & vulnerability audit
===================================================================

[03] CONTROL
===================================================================
[01] clear          : Clear terminal buffer
[02] exit           : Terminate terminal session
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
[01] Name         : Labib B. Shahed
[02] Role         : CSE Student, Cyber Security Enthusiast, Programmer
[03] Speciality   : Zero-Trust Platforms, Memory Forensics, EDR Evasion
[04] Clearance    : Top Secret / SCI (Simulated)
===================================================================

[02] ARSENAL & PROFICIENCY MATRIX
===================================================================
[01] Domain       : Programming [89%]
     Stack        : TypeScript, Python, Java, Go, Rust

[02] Domain       : Web & Backend [90%]
     Stack        : React, Node.js, Next.js, PostgreSQL, Redis

[03] Domain       : Cybersecurity [88%]
     Stack        : Burp Suite Pro, Metasploit, Nmap, Wireshark, Volatility 3

[04] Domain       : Cloud & Ops [90%]
     Stack        : Docker, AWS, Ubuntu Linux, Kubernetes, Terraform

[05] Domain       : Data Science [83%]
     Stack        : scikit-learn, PyTorch, TensorFlow, Apache Kafka
===================================================================

[03] ACTIVE CASEFILES & PROJECTS
===================================================================
[01] CASE-091     : Spectre-X (Volatility 3 RAM Forensics & Rootkit Detector)
[02] CASE-084     : AegisGuard (WebAuthn & Passkey Zero-Trust Identity Engine)
[03] CASE-078     : Vortex-Fuzz (100k req/sec HTTP/2 Async Rust Fuzzer)
[04] CASE-065     : CipherTrace (Ransomware eBPF Detonation & Telemetry)
===================================================================

[04] CERTIFICATIONS & CREDENTIALS
===================================================================
${CERTIFICATIONS_DATA.map((c, i) => `[${(i + 1).toString().padStart(2, '0')}] Title        : ${c.title}\n     Issuer       : ${c.issuer}\n     Cert Type    : ${c.status || 'VERIFIED'}`).join('\n')}
===================================================================

[05] DIGITAL BADGES
===================================================================
${BADGES_DATA.map((b, i) => `[${(i + 1).toString().padStart(2, '0')}] Title        : ${b.title}\n     Issuer       : ${b.issuer}\n     CredID       : ${b.credentialId || 'N/A'}`).join('\n')}
===================================================================`
        });
        break;

      case "fastfetch":
        newHistory.push({
          id: crypto.randomUUID(),
          type: "ascii",
          text: "█▀▀ ▄▀█ █▀ ▀█▀ █▀▀ █▀▀ ▀█▀ █▀▀ █░█\n█▀░ █▀█ ▄█ ░█░ █▀░ ██▄ ░█░ █▄▄ █▀█",
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: "teal",
          text: `===================================================================\n[01] HARDWARE & ARCHITECTURE\n===================================================================\n[01] Machine ID   : sec-node-01.internal (UUID: 4f9b-8a2c-1e5d)\n[02] Platform     : x86_64-pc-linux-gnu / Bare-Metal Hypervisor\n[03] Processor    : Intel(R) Xeon(R) Platinum 8375C CPU @ 2.80GHz (16 Cores, 32 Threads)\n[04] Microarch    : Ice Lake (10nm) / Stepping 6 / AVX-512 Enabled\n[05] Memory       : 4,096 MiB / 32,768 MiB (12.5% Utilized) [ECC DDR5 - 4800 MT/s]\n[06] Storage      : 1.2 TB NVMe SSD (PCIe Gen4) [RAID 1 / LUKS Encrypted]\n===================================================================\n\n[02] OS & KERNEL ENVIRONMENT\n===================================================================\n[01] OS Release   : SecOps Custom Linux (Build 2024.1)\n[02] Kernel       : 6.8.0-sec-hardened (SMP PREEMPT_DYNAMIC)\n[03] Uptime       : 42 days, 13 hours, 07 mins, 12 secs\n[04] Init Sys     : systemd v252.6\n[05] Compilers    : gcc 13.2.1, clang 17.0.6, go 1.22.0\n===================================================================\n\n[03] SECURITY & TELEMETRY\n===================================================================\n[01] Identity     : labib@sec-node-01 [UID: 0001, GID: 0001 - TS/SCI SEC_OPS MASTER]\n[02] Integrity    : OPTIMAL [0 Kernel Panics / SecureBoot: ENABLED]\n[03] eBPF Hooks   : 14 Active Tracepoints (Network/Syscall Monitoring)\n[04] SELinux      : Enforcing (Targeted Policy - v3.12)\n[05] Firewall     : FortiGate 7.6 Virtual Fabric [STRICT FILTERING INGRESS/EGRESS]\n[06] Crypto Sub   : FIPS 140-2 Validated Mode [Active]\n[07] Status       : DEFCON 5 (ALL SYSTEMS NOMINAL)\n===================================================================`
        });
        break;
      

      
      

      case 'overwatch': {
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
[01] Target Host  : ${target}
[02] Resolved IP  : 10.0.0.1 (DNS: Cloudflare WARP)
[03] ICMP Latency : 14.2ms (0% Packet Loss, TTL=54)
[04] MAC Address  : 0A:1B:2C:3D:4E:5F (OUI: Virtual Interface)
===================================================================

[02] PORT & SERVICE MAPPING (SYN STEALTH SCAN)
===================================================================
-------------------------------------------------------------------
PORT       STATE      SERVICE           VERSION
-------------------------------------------------------------------
22/tcp     open       ssh               OpenSSH 9.6 (protocol 2.0)
80/tcp     open       http              Nginx 1.25.3
443/tcp    open       ssl/http          Nginx 1.25.3
8080/tcp   filtered   http-proxy        -
-------------------------------------------------------------------
===================================================================

[03] VULNERABILITY AUDIT & MITIGATION REPORT
===================================================================
[OK] Port 22 SSH    : Clean (Patched against CVE-2024-6387 RegreSSHion)
[OK] Port 80 HTTP   : Clean (Headers hardened, strict CSP enforced)
[ER] Port 443 HTTPS : INFO - TLS 1.2 legacy cipher suites supported
[OK] Memory Kernel  : eBPF Spectre mitigation enabled (IBRS active)
===================================================================

[04] THREAT INTELLIGENCE SUMMARY
===================================================================
[01] Defense Posture : OPTIMAL (0 Critical, 0 High, 1 Info)
[02] Overall Score   : 9.8 / 10 SECURE
[03] Recommendation  : Disable TLS 1.2 CBC suites on proxy edge.
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
          text: 'Email: la-b-ib@github.io\nGitHub: https://github.com/la-b-ib\nPGP Fingerprint: 4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2',
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
          text: `bash: command not found: "${cmd}". Type "help" or press [TAB] for options.`,
        });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
    setIsExecuted(true);
  };

  const showDefaultScreen = () => {
    soundEngine.play('terminal_key');
    setHistory([
      {
        id: crypto.randomUUID(),
        type: 'ascii',
        text: "▀█▀ █▀▀ █▀█ █▀▄▀█ █ █▄░█ ▄▀█ █░░\n░█░ ██▄ █▀▄ █░▀░█ █ █░▀█ █▀█ █▄▄\n===================================================================",
      },
      {
        id: crypto.randomUUID(),
        type: 'teal',
        text: "Type \"help\" or \"menu\" to view available tactical commands.\nPress [TAB] for autocompletion | Use ↑ / ↓ for command history.",
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
          { id: crypto.randomUUID(), type: 'teal', text: `MATCHES: ${matches.join('  ')}` },
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
    <section className="w-full flex-1 flex flex-col min-h-0 bg-[#0f0e13] text-white font-mono animate-fadeIn transition-all">
      <div className="w-full flex-1 flex flex-col min-h-0 bg-[#0f0e13]">
        {/* Terminal Header Bar */}
        <div className="px-0 pt-0 pb-0 shrink-0 bg-[#09090d]">
          <div className="bg-[#21232b] h-[45px] px-[15px] rounded-none border-0 flex items-center justify-between select-none">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
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
              <span className="font-mono font-semibold text-white flex items-center space-x-2 truncate">
                <span className="truncate max-w-[180px] xs:max-w-[220px] sm:max-w-none text-[16px]">TERMINAL</span>
                <span className="hidden md:inline-block text-[10px] text-[#c2e7ff] bg-[#004a77]/40 px-2.5 py-0.5 rounded-full border border-[#a8c7fa]/30 shrink-0">
                  SEC_OPS SHELL
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* Exit Terminal Button */}
              <button
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
        <div className="flex-1 min-h-0 bg-[#09090d] px-[15px] py-[15px] pb-[160px] font-mono text-[12px] leading-[14px] overflow-y-auto space-y-2 sm:space-y-2.5 [scrollbar-width:thin] [scrollbar-color:#44474f_#09090d] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#09090d] [&::-webkit-scrollbar-thumb]:bg-[#44474f] [&::-webkit-scrollbar-thumb]:rounded-full select-text">
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
                  <span className="text-[#8e9199] shrink-0 select-none hidden sm:inline">node-01:~$</span>
                  <span className="text-[#8e9199] shrink-0 select-none sm:hidden">~$</span>
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

            const lines = item.text.split('\n');

            return (
              <div key={item.id} className={`break-words ${textColorClass}`}>
                {lines.map((line, idx) => {
                  if (/^\s*={3,}\s*$/.test(line) || /^\s*-{10,}\s*$/.test(line)) {
                    return (
                      <div key={idx} className="whitespace-nowrap overflow-hidden text-clip opacity-40">
                        {line}
                      </div>
                    );
                  }

                  let rest = line;
                  let prefix = null;
                  
                  const tagMatch = rest.match(/^(\s*\[.*?\])(.*)/);
                  if (tagMatch && !line.includes('http')) {
                     const tag = tagMatch[1];
                     let tagColor = 'text-[#a8c7fa] font-bold'; 
                     if (tag.includes('✓') || tag.includes('+') || tag.includes('OK')) tagColor = 'text-[#a8e6cf] font-bold';
                     else if (tag.includes('⚠') || tag.includes('ERROR') || tag.includes('FAIL') || tag.includes('ER')) tagColor = 'text-[#ffb4ab] font-bold';
                     else if (tag.includes('DOSSIER') || tag.includes('CERTIFICATES') || tag.includes('SYSTEM')) tagColor = 'text-[#ffb870] font-bold';
                     
                     prefix = <span className={tagColor}>{tag}</span>;
                     rest = tagMatch[2];
                  }

                  const kvMatch = rest.match(/^(\s*[A-Za-z0-9 _\-\/\[\]<>]+?):(.*)/);
                  if (kvMatch && !rest.includes('http')) {
                     return (
                       <div key={idx} className="flex">
                         <div className="shrink-0 whitespace-pre">
                           {prefix}
                           <span className="opacity-75">{kvMatch[1]}</span>
                           <span className="opacity-40">:</span>
                         </div>
                         <div className="font-semibold text-white/90 whitespace-pre-wrap break-words pl-1">{kvMatch[2].trimStart()}</div>
                       </div>
                     );
                  }
                  return (
                    <div key={idx} className="whitespace-pre-wrap">
                      {prefix}
                      <span className="opacity-90">{rest}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div ref={bottomRef} className="!mt-0"></div>
        </div>

        {/* Command Input Container */}
        <div className="fixed bottom-[calc(98px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-50 px-[15px] pointer-events-none flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="pointer-events-auto w-full max-w-md sm:max-w-[430px] bg-[#21232b] px-[10px] h-[45px] rounded-xl border border-[#44474f]/40 flex items-center gap-2 sm:gap-3 transition-colors shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
          >
            <span className="text-[#a8c7fa] font-mono font-semibold text-[12px] leading-[12px] flex items-center shrink-0 gap-1.5">
              <span className="text-[#8e9199] hidden sm:inline">node-{String(cmdHistory.length).padStart(2, '0')}:</span>
              <i className="ri-money-dollar-circle-line text-[16px] text-[#a8c7fa]"></i>
            </span>
            <div className="relative flex-1 flex items-center h-full">
              <input
                ref={inputRef}
                type="text"
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
                className="w-full bg-transparent border-none text-white font-mono text-[12px] leading-[12px] focus:outline-none placeholder:text-[#8e9199] placeholder:text-[12px] placeholder:leading-[12px] h-[45px] z-10"
              />
              {ghostText && inputVal.trim() && (
                <span className="absolute left-0 pointer-events-none font-mono text-[12px] leading-[12px] text-[#44474f] whitespace-pre min-h-[36px] flex items-center">
                  <span className="opacity-0">{inputVal}</span>
                  <span>{ghostText}</span>
                  <span className="ml-2 text-[9px] leading-[9px] text-[#a8c7fa]/60 bg-[#004a77]/30 px-1 py-0.5 rounded border border-[#a8c7fa]/20 hidden md:inline">
                    [TAB]
                  </span>
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
              className="text-[#a8c7fa] hover:text-white active:scale-90 transition-all p-1 flex items-center justify-center shrink-0 cursor-pointer focus:outline-none rounded-full"
              title={inputVal.trim() ? "Execute command" : "Show terminal default screen"}
              aria-label={inputVal.trim() ? "Execute command" : "Show terminal default screen"}
            >
              <i
                className={`${
                  isExecuted && !inputVal.trim()
                    ? 'ri-play-circle-line'
                    : 'ri-pause-circle-line'
                } text-[20px] text-[#a8c7fa] hover:text-white transition-colors`}
              ></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
