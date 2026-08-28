import React, { useState, useEffect, useRef } from 'react';
import { TerminalEntry } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { BADGES_DATA, CERTIFICATIONS_DATA } from '../data/portfolioData';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCtf: () => void;
}

const ALL_COMMANDS = [
  'help',
  'menu',
  'about',
  'skills',
  'projects',
  'certs',
  'badges',
  'sysinfo',
  'health',
  'nmap',
  'hashid',
  'encode',
  'decode',
  'ping',
  'vulnscan',
  'cat',
  'ls',
  'banner',
  'theme',
  'ctf',
  'matrix',
  'whoami',
  'date',
  'contact',
  'echo',
  'clear',
  'sudo',
  'exit',
];

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  onOpenCtf,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalEntry[]>([
    { id: '1', type: 'ascii', text: '▐▓█▀▀▀▀▀▀▀▀▀█▓▌░▄▄▄▄▄░\n▐▓█░░▀░░▀▄░░█▓▌░█▄▄▄█░\n▐▓█░░▄░░▄▀░░█▓▌░█▄▄▄█░\n▐▓█▄▄▄▄▄▄▄▄▄█▓▌░█████░\n░░░░▄▄███▄▄░░░░░█████░' },
    { id: '2', type: 'teal', text: 'Type "help" or "menu" to view available tactical commands.\nPress [TAB] for autocompletion | Use ↑ / ↓ for command history.' },
    { id: '3', type: 'input', text: 'whoami' },
    { id: '4', type: 'success', text: 'node-01 [DEFCON 5 CLEARANCE: TS/SCI]' },
  ]);

  const [cmdHistory, setCmdHistory] = useState<string[]>(['whoami']);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [terminalTheme, setTerminalTheme] = useState<'cyan' | 'green' | 'amber' | 'matrix'>('cyan');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const copyTerminalLogs = () => {
    soundEngine.play('click');
    const logContent = history.map((h) => h.text).join('\n');
    navigator.clipboard.writeText(logContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

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

    const newHistory = [...history, { id: crypto.randomUUID(), type: 'input' as const, text: `$ ${cmd}` }];
    const parts = cmd.split(' ').filter(Boolean);
    const baseCmd = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    switch (baseCmd) {
      case 'help':
      case 'menu':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '▒▒▒▒▒▒▐███████▌\n▒▒▒▒▒▒▐░▀░▀░▀░▌\n▒▒▒▒▒▒▐▄▄▄▄▄▄▄▌\n▄▀▀▀█▒▐░▀▀▄▀▀░▌▒█▀▀▀▄\n▌▌▌▌▐▒▄▌░▄▄▄░▐▄▒▌▐▐▐▐',
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'teal',
          text: `===================================================================
LABIB B. SHAHED // SEC_OPS TACTICAL SHELL MANUAL
===================================================================
CORE COMMANDS:
  help / menu    - Display this manual
  about          - Personnel dossier & architecture specializations
  skills         - Offensive & defensive technical arsenal
  projects       - Casefiles & security open-source repositories
  certs          - Professional certifications summary
  badges         - Verified Credly digital badges list
  sysinfo        - System kernel specs, active eBPF hooks & memory load
  health         - System health status, telemetry & ASCII diagnostic
  whoami         - Active session identity & clearance level

SECURITY TOOLS:
  nmap [target]  - Port scanner (e.g. "nmap 10.0.0.1" or "nmap google.com")
  vulnscan [host]- CVE vulnerability scanner & mitigation reports
  hashid <hash>  - Cryptographic hash identification utility
  encode <type>  - Base64 / Hex text encoder (e.g. "encode base64 text")
  decode <type>  - Base64 / Hex text decoder (e.g. "decode base64 U2VjT3Bz")
  ping <target>  - ICMP network latency probe

FILESYSTEM & CONTROL:
  ls             - List directory contents
  cat <file>     - Display virtual file content (e.g. "cat dossier.txt")
  banner         - Display terminal ASCII banner
  theme <color>  - Set text theme color (cyan, green, amber, matrix)
  ctf            - Launch CTF Decrypt Challenge
  matrix         - Toggle background binary rain stream
  echo <text>    - Echo input string
  clear          - Clear terminal buffer
  exit           - Terminate terminal session`,
        });
        break;

      case 'about':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '╔══╗░░░░╔╦╗░░╔═════╗\n║╚═╬════╬╣╠═╗║░▀░▀░║\n╠═╗║╔╗╔╗║║║╩╣║╚═══╝║\n╚══╩╝╚╝╚╩╩╩═╝╚═════╝',
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'info',
          text: `[PERSONNEL DOSSIER]
Name: Labib B. Shahed
Role: Principal Security Architect & Lead Engineer
Specializations: Zero-Trust Platforms, Memory Forensics (Volatility 3), EDR Evasion, Kernel Rootkit Analysis, High-Throughput Microservices.
Clearance: Top Secret / SCI (Simulated)`,
        });
        break;

      case 'skills':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒\n▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒\n▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒\n░█▀█▀█░█▀██░█▀█░█▄█▄█░\n░█▀█▀█░█▀████▀█░█▄█▄█░\n████████▀█████████████',
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'success',
          text: `TECHNICAL ARSENAL & PROFICIENCY MATRIX:
[+] Offensive Sec & Exploit Dev    [98%] (Metasploit, Burp Suite Pro, Ghidra)
[+] Digital Forensics & IR         [97%] (Volatility 3, Autopsy, FTK, Wireshark)
[+] Cloud & Container Security     [96%] (Kubernetes, RedHat OpenShift, AWS Sec)
[+] Full-Stack Systems & APIs      [98%] (TypeScript, React, Node.js, Go, Rust)
[+] Applied Cryptography & ZK      [96%] (Post-Quantum Crypto, WebAuthn/Passkeys)
[+] Network Defense & Firewalls    [97%] (Fortinet FortiGate, eBPF Packet Filtering)`,
        });
        break;

      case 'projects':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '║║║░░▄██║║║║░░░▄█░╔╗\n╚╬╝░██▄█╬╬╬╬╬╬███░║║\n░║░░░▀██║║║║░░░▀█░╠╝\n░║░░░░░░░░░░░░░░░░║',
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'info',
          text: `ACTIVE CASEFILES & OPEN SOURCE REPOSITORIES:
[01] CASE-091: Spectre-X — Volatility 3 RAM Forensics & Kernel Rootkit Detector
[02] CASE-084: AegisGuard — WebAuthn & Passkey Zero-Trust Identity Engine
[03] CASE-078: Vortex-Fuzz — 100k req/sec HTTP/2 Async Rust Fuzzer
[04] CASE-065: CipherTrace — Ransomware eBPF Detonation & Telemetry Chamber`,
        });
        break;

      case 'certs':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '█▓▒▓█▀██▀█▄░░▄█▀██▀█▓▒▓█\n█▓▒░▀▄▄▄▄▄█░░█▄▄▄▄▄▀░▒▓█\n█▓▓▒░░░░░▒▓░░▓▒░░░░░▒▓▓█',
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'amber',
          text: `VERIFIED PROFESSIONAL CERTIFICATIONS (${CERTIFICATIONS_DATA.length}):
${CERTIFICATIONS_DATA.map(
  (c, i) => `[${(i + 1).toString().padStart(2, '0')}] ${c.title} — ${c.issuer} (${c.status || 'VERIFIED'})`
).join('\n')}`,
        });
        break;

      case 'badges':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'amber',
          text: `VERIFIED DIGITAL BADGES (${BADGES_DATA.length}):
${BADGES_DATA.map(
  (b, i) => `[${(i + 1).toString().padStart(2, '0')}] ${b.title} (${b.issuer}) | Date: ${b.issueDate} | ID: ${b.credentialId}`
).join('\n')}`,
        });
        break;

      case 'sysinfo':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '────▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n▀▀▀█─▄▄▄▄▄▄─▄─▄─▄─█\n───█─█────█─▄▀▄▀▄─█\n───█─█▄▄▄▄█─▄▀▄▀▄─█\n───▀▄▄▄▄▄▄▄▄▄▄▄▄▄▄▀',
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'teal',
          text: `SYSTEM ARCHITECTURE & OPERATIONAL METRICS:
OS Kernel  : Linux 6.8.0-sec-hardened x86_64
Host Node  : sec-node-01.internal
CPU Core   : 16x Intel Xeon Platinum 8375C @ 2.80GHz
RAM Usage  : 4,096 MB / 32,768 MB (12.5% load)
eBPF Probes: 14 active kernel tracepoints
Uptime     : 42 days, 13 hours, 07 mins
Firewall   : FortiGate 7.6 Virtual Fabric [STRICT FILTERING ACTIVE]`,
        });
        break;

      case 'health':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '───────▄██████▄───────\n──────▐▀▀▀▀▀▀▀▀▌──────\n──────▌▌▀▀▌▐▀▀▐▐──────\n──────▐──▄▄▄▄──▌──────\n───────▌▐▌──▐▌▐───────',
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'teal',
          text: `[SYSTEM HEALTH DIAGNOSTICS & TELEMETRY]
===================================================================
[+] NODE STATUS      : OPERATIONAL (100% ONLINE)
[+] SYSTEM INTEGRITY : OPTIMAL [NO ANOMALIES DETECTED]
[+] CPU LOAD         : 12.4% (16x Intel Xeon Platinum 8375C @ 2.80GHz)
[+] MEMORY HEALTH    : 4,096 MB / 32,768 MB (12.5% LOAD - ECC DDR5 OK)
[+] FIREWALL STATE   : FORTIGATE VIRTUAL FABRIC [STRICT FILTERING ACTIVE]
[+] DEFCON CLEARANCE : DEFCON 5 (ALL SYSTEMS NORMAL)`,
        });
        break;

      case 'whoami':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'success',
          text: 'labib@sec-node-01 [UID: 0001, GID: 0001 - TS/SCI SEC_OPS MASTER]',
        });
        break;

      case 'nmap': {
        const target = args[0] || '10.0.0.1';
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '──▄────▄▄▄▄▄▄▄────▄───\n─▀▀▄─▄█████████▄─▄▀▀──\n─────██─▀███▀─██──────\n───▄─▀████▀████▀─▄────\n─▀█────██▀█▀██────█▀──',
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'info',
          text: `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}
Nmap scan report for ${target}
Host is up (0.00018s latency).
Not shown: 995 closed ports

PORT     STATE SERVICE       VERSION
22/tcp   open  ssh           OpenSSH 9.6 (protocol 2.0)
80/tcp   open  http          Nginx 1.25.3 (eBPF Hardened)
443/tcp  open  ssl/https     Cloudflare TLS 1.3
3000/tcp open  ppp-express   Node.js / React 19 SPA
8080/tcp open  http-proxy    Vortex-Fuzz Proxy Engine

Device type: general purpose
Running: Linux 6.X
OS CPE: cpe:/o:linux:linux_kernel:6.8
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`,
        });
        break;
      }

      case 'vulnscan': {
        const host = args[0] || 'localhost';
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'amber',
          text: `[+] RUNNING AUTOMATED VULNERABILITY AUDIT SCANNER AGAINST: ${host}
===================================================================
[✓] Port 22 SSH     - Clean (OpenSSH 9.6 patched against CVE-2024-6387 RegreSSHion)
[✓] Port 80 HTTP    - Clean (Nginx 1.25.3 headers hardened)
[⚠] Port 443 HTTPS   - Informational: TLS 1.2 legacy cipher suites supported (Recommended disable)
[✓] Memory Kernel   - eBPF Spectre mitigation enabled (IBRS + Retpoline active)
[✓] Overall Score   - 9.8 / 10 SECURE (Zero Critical Vulnerabilities Detected)`,
        });
        break;
      }

      case 'hashid': {
        const hash = args[0];
        if (!hash) {
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'error',
            text: 'Usage: hashid <hash_string>\nExample: hashid 5d41402abc4b2a76b9719d911017c592',
          });
        } else {
          let hashType = 'Unknown / Custom Hash';
          const cleanHash = hash.trim();

          if (cleanHash.startsWith('$2a$') || cleanHash.startsWith('$2b$')) hashType = 'Bcrypt Password Hash';
          else if (cleanHash.startsWith('$argon2')) hashType = 'Argon2 Password Hash';
          else if (/^[a-fA-F0-9]{32}$/.test(cleanHash)) hashType = 'MD5 / NTLM Hash (128-bit)';
          else if (/^[a-fA-F0-9]{40}$/.test(cleanHash)) hashType = 'SHA-1 / RIPEMD-160 Hash (160-bit)';
          else if (/^[a-fA-F0-9]{64}$/.test(cleanHash)) hashType = 'SHA-256 / SHA3-256 Hash (256-bit)';
          else if (/^[a-fA-F0-9]{128}$/.test(cleanHash)) hashType = 'SHA-512 Hash (512-bit)';

          newHistory.push({
            id: crypto.randomUUID(),
            type: 'teal',
            text: `HASH ANALYZER RESULT:
Input String : ${cleanHash}
Detected Type: ${hashType}
Length       : ${cleanHash.length} characters
Status       : Classification Verified`,
          });
        }
        break;
      }

      case 'encode': {
        const mode = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');
        if (!mode || !text) {
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'error',
            text: 'Usage: encode <base64|hex> <string>\nExample: encode base64 Hello World',
          });
        } else if (mode === 'base64') {
          try {
            const encoded = btoa(text);
            newHistory.push({
              id: crypto.randomUUID(),
              type: 'success',
              text: `ENCODED (Base64): ${encoded}`,
            });
          } catch {
            newHistory.push({ id: crypto.randomUUID(), type: 'error', text: 'Error encoding Base64.' });
          }
        } else if (mode === 'hex') {
          const hex = Array.from(text)
            .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'success',
            text: `ENCODED (Hex): ${hex}`,
          });
        } else {
          newHistory.push({ id: crypto.randomUUID(), type: 'error', text: 'Supported encoding types: base64, hex' });
        }
        break;
      }

      case 'decode': {
        const mode = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');
        if (!mode || !text) {
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'error',
            text: 'Usage: decode <base64|hex> <string>\nExample: decode base64 U2VjT3Bz',
          });
        } else if (mode === 'base64') {
          try {
            const decoded = atob(text);
            newHistory.push({
              id: crypto.randomUUID(),
              type: 'success',
              text: `DECODED (Base64): ${decoded}`,
            });
          } catch {
            newHistory.push({ id: crypto.randomUUID(), type: 'error', text: 'Invalid Base64 string.' });
          }
        } else if (mode === 'hex') {
          try {
            const cleanHex = text.replace(/\s+/g, '');
            let str = '';
            for (let i = 0; i < cleanHex.length; i += 2) {
              str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
            }
            newHistory.push({
              id: crypto.randomUUID(),
              type: 'success',
              text: `DECODED (Hex): ${str}`,
            });
          } catch {
            newHistory.push({ id: crypto.randomUUID(), type: 'error', text: 'Invalid Hex string.' });
          }
        } else {
          newHistory.push({ id: crypto.randomUUID(), type: 'error', text: 'Supported decoding types: base64, hex' });
        }
        break;
      }

      case 'ping': {
        const host = args[0] || 'sec-node-01.internal';
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'info',
          text: `PING ${host} (10.0.0.1) 56(84) bytes of data.
64 bytes from 10.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms
64 bytes from 10.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms
64 bytes from 10.0.0.1: icmp_seq=3 ttl=64 time=0.045 ms
64 bytes from 10.0.0.1: icmp_seq=4 ttl=64 time=0.039 ms

--- ${host} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 0.038/0.041/0.045/0.003 ms`,
        });
        break;
      }

      case 'ls':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'teal',
          text: `drwxr-xr-x 2 labib sec_ops 4096 Aug  5 10:00 exploits/
-rw-r--r-- 1 labib sec_ops 1024 Aug  5 10:00 dossier.txt
-rw-r--r-- 1 labib sec_ops 2048 Aug  5 10:00 skills.json
-rw-r--r-- 1 labib sec_ops 4096 Aug  5 10:00 certificates.db
-rw-r--r-- 1 labib sec_ops  512 Aug  5 10:00 keys.pgp
-rw-r--r-- 1 labib sec_ops  890 Aug  5 10:00 README.md`,
        });
        break;

      case 'cat': {
        const file = args[0]?.toLowerCase();
        if (!file) {
          newHistory.push({ id: crypto.randomUUID(), type: 'error', text: 'Usage: cat <filename>\nExample: cat dossier.txt' });
        } else if (file === 'dossier.txt') {
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'info',
            text: `[DOSSIER.TXT]
Labib B. Shahed — Cybersecurity Architect & Software Engineer
Focus: Zero-Trust Engineering, Memory Forensics, Vulnerability Auditing, Cloud Hardening.
Email: la-b-ib@github.io`,
          });
        } else if (file === 'skills.json') {
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'success',
            text: `{
  "engineer": "Labib B. Shahed",
  "specialties": ["Memory Forensics", "Zero-Trust Architecture", "Reverse Engineering", "Cloud Hardening"],
  "certifications": ["OSCP", "CISSP", "CEH", "AWS Security Specialist"],
  "clearance": "Top Secret / SCI"
}`,
          });
        } else if (file === 'certificates.db') {
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'teal',
            text: `[CERTIFICATES DATABASE RECORD]
-------------------------------------------------------------------
[+] CERT-01: Offensive Security Certified Professional (OSCP)
[+] CERT-02: Certified Information Systems Security Professional (CISSP)
[+] CERT-03: Certified Ethical Hacker (CEH v12)
[+] CERT-04: AWS Certified Security - Specialty
[+] CERT-05: Certified Cloud Security Professional (CCSP)
Status: Verified & Active`,
          });
        } else if (file === 'readme.md') {
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'teal',
            text: `# SEC_OPS TERMINAL SHELL
Welcome to Labib's security portfolio interactive shell environment.
Type "help" for a full list of commands or "ctf" to start the cryptographic challenge.`,
          });
        } else if (file === 'keys.pgp') {
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'amber',
            text: `-----BEGIN PGP PUBLIC KEY BLOCK-----
mQENBF5x9...
4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2
-----END PGP PUBLIC KEY BLOCK-----`,
          });
        } else {
          newHistory.push({ id: crypto.randomUUID(), type: 'error', text: `cat: ${file}: No such file or directory` });
        }
        break;
      }

      case 'banner':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '▐▓█▀▀▀▀▀▀▀▀▀█▓▌░▄▄▄▄▄░\n▐▓█░░▀░░▀▄░░█▓▌░█▄▄▄█░\n▐▓█░░▄░░▄▀░░█▓▌░█▄▄▄█░\n▐▓█▄▄▄▄▄▄▄▄▄█▓▌░█████░\n░░░░▄▄███▄▄░░░░░█████░',
        });
        break;

      case 'theme': {
        const selectedTheme = args[0]?.toLowerCase();
        if (selectedTheme === 'cyan' || selectedTheme === 'green' || selectedTheme === 'amber' || selectedTheme === 'matrix') {
          setTerminalTheme(selectedTheme);
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'success',
            text: `Terminal color theme updated to "${selectedTheme}".`,
          });
        } else {
          newHistory.push({
            id: crypto.randomUUID(),
            type: 'error',
            text: 'Usage: theme <cyan|green|amber|matrix>',
          });
        }
        break;
      }

      case 'ctf':
        onOpenCtf();
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'amber',
          text: 'Launching CTF Decrypt Challenge GUI...',
        });
        break;

      case 'matrix':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'teal',
          text: 'Matrix background effect has been disabled.',
        });
        break;

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

      case 'echo':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'info',
          text: args.join(' '),
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx < cmdHistory.length) {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) {
        setInputVal('help');
        return;
      }

      const matches = ALL_COMMANDS.filter((c) => c.startsWith(current));
      if (matches.length === 1) {
        setInputVal(matches[0]);
        soundEngine.play('click');
      } else if (matches.length > 1) {
        soundEngine.play('click');
        setHistory((prev) => [
          ...prev,
          { id: crypto.randomUUID(), type: 'input', text: `$ ${current}` },
          { id: crypto.randomUUID(), type: 'teal', text: `MATCHES: ${matches.join('  ')}` },
        ]);
      }
    }
  };

  const getThemeTextClass = () => {
    switch (terminalTheme) {
      case 'green':
        return 'text-[#a8e6cf]';
      case 'amber':
        return 'text-[#ffb870]';
      case 'matrix':
        return 'text-[#a8e6cf] font-bold';
      default:
        return 'text-[#a8c7fa]';
    }
  };

  const quickPills = [
    { label: 'help', cmd: 'help' },
    { label: 'health', cmd: 'health' },
    { label: 'sysinfo', cmd: 'sysinfo' },
    { label: 'nmap', cmd: 'nmap 10.0.0.1' },
    { label: 'certs', cmd: 'certs' },
    { label: 'projects', cmd: 'projects' },
    { label: 'vulnscan', cmd: 'vulnscan' },
    { label: 'clear', cmd: 'clear' },
  ];

  const matchingCommand = inputVal.trim()
    ? ALL_COMMANDS.find((c) => c.startsWith(inputVal.trim().toLowerCase()))
    : null;
  const ghostText = matchingCommand ? matchingCommand.slice(inputVal.trim().length) : '';

  return (
    <section className={`w-full flex-1 flex flex-col bg-[#0f0e13] ${isMaximized ? 'min-h-[calc(100dvh-70px)]' : 'min-h-[calc(100dvh-191px)] lg:min-h-[calc(100dvh-92px)]'} mb-[99px] lg:mb-0 text-white font-mono animate-fadeIn transition-all`}>
      <div className="w-full flex-1 flex flex-col bg-[#0f0e13]">
        {/* Terminal Header Bar */}
        <div className="bg-[#21232b] h-[45px] px-[15px] border-b border-[#44474f]/30 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <span className="text-xs font-mono font-semibold text-white flex items-center space-x-2 truncate">
              <i className="ri-terminal-box-line text-[#a8c7fa] text-sm shrink-0"></i>
              <span className="truncate max-w-[180px] xs:max-w-[220px] sm:max-w-none">node-{String(cmdHistory.length).padStart(2, '0')}:~ (bash)</span>
              <span className="hidden md:inline-block text-[10px] text-[#c2e7ff] bg-[#004a77]/40 px-2.5 py-0.5 rounded-full border border-[#a8c7fa]/30 shrink-0">
                SEC_OPS SHELL
              </span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Theme Selector Pills */}
            <div className="hidden lg:flex items-center bg-[#14151a] p-0.5 border border-[#44474f]/40 mr-1" style={{ borderRadius: '12px' }}>
              {(['cyan', 'green', 'amber', 'matrix'] as const).map((th) => (
                <button
                  key={th}
                  onClick={() => {
                    soundEngine.play('click');
                    setTerminalTheme(th);
                  }}
                  style={{ borderRadius: '12px' }}
                  className={`px-2 py-0.5 text-[10px] font-mono capitalize transition-all cursor-pointer ${
                    terminalTheme === th
                      ? 'bg-[#a8c7fa] text-[#0f0e13] font-bold'
                      : 'text-[#8e9199] hover:text-white'
                  }`}
                  title={`Switch to ${th} theme`}
                >
                  {th}
                </button>
              ))}
            </div>

            {/* Dropdown Toggle Suggestions Button */}
            <button
              onClick={() => {
                soundEngine.play('click');
                setShowSuggestions(!showSuggestions);
              }}
              style={{ borderRadius: '9999px' }}
              className="bg-[#21232b] text-[#a8c7fa] w-8 h-8 border-0 flex items-center justify-center shrink-0 cursor-pointer text-xs rounded-full select-none"
              title={showSuggestions ? "Collapse tactical command suggestions" : "Expand tactical command suggestions"}
              aria-label="Toggle command suggestions menu"
            >
              <i className={`text-sm text-[#a8c7fa] ${showSuggestions ? 'ri-beer-line' : 'ri-swap-3-line'}`}></i>
            </button>

            {/* Copy Logs Button */}
            <button
              onClick={copyTerminalLogs}
              style={{ borderRadius: '9999px' }}
              className="bg-[#21232b] hover:bg-[#2b2d36] active:scale-95 text-[#c4c6d0] hover:text-white w-8 h-8 border-0 flex items-center justify-center shrink-0 cursor-pointer transition-all text-xs rounded-full"
              title="Copy terminal buffer to clipboard"
              aria-label="Copy terminal buffer"
            >
              <i className={isCopied ? 'ri-clipboard-line text-[#a8e6cf] text-sm' : 'ri-file-copy-2-line text-sm'}></i>
            </button>

            {/* Clear Buffer Button */}
            <button
              onClick={() => {
                soundEngine.play('click');
                executeCommand('clear');
              }}
              style={{ borderRadius: '9999px' }}
              className="bg-[#21232b] hover:bg-[#2b2d36] active:scale-95 text-[#c4c6d0] hover:text-white w-8 h-8 border-0 flex items-center justify-center shrink-0 cursor-pointer transition-all rounded-full"
              title="Clear log buffer"
              aria-label="Clear log buffer"
            >
              <i className="ri-delete-bin-line text-sm leading-none"></i>
            </button>

            {/* Exit Terminal Button */}
            <button
              onClick={() => {
                soundEngine.play('click');
                onClose();
              }}
              style={{ borderRadius: '9999px' }}
              className="bg-[#21232b] hover:bg-[#2b2d36] active:scale-95 text-[#c4c6d0] hover:text-white w-8 h-8 border-0 flex items-center justify-center shrink-0 cursor-pointer transition-all rounded-full"
              title="Exit terminal view [ESC]"
              aria-label="Exit terminal view"
            >
              <i className="ri-close-circle-line text-sm leading-none"></i>
            </button>
          </div>
        </div>

        {/* Quick Command Suggestions Grid (Adaptive 4-Column Layout on Mobile) */}
        {showSuggestions && (
          <div className="bg-[#21232b] px-[15px] py-2 sm:py-2.5 border-b border-[#44474f]/30 animate-fadeIn transition-all">
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 w-full">
              {quickPills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => {
                    executeCommand(pill.cmd);
                  }}
                  style={{ borderRadius: '12px' }}
                  className="w-full sm:w-auto px-1.5 sm:px-3 py-1.5 bg-[#000000] text-[#c4c6d0] hover:text-white hover:bg-[#2b2d36] active:bg-[#a8c7fa] active:text-[#0f0e13] font-mono text-[12px] leading-[12px] font-medium transition-all active:scale-95 cursor-pointer text-center truncate flex items-center justify-center border-0 outline-none"
                  title={`Run $${pill.label}`}
                >
                  ${pill.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Terminal Screen Log Area */}
        <div className={`flex-1 ${isMaximized ? 'min-h-[400px] sm:min-h-[580px]' : 'min-h-[260px] sm:min-h-[440px]'} bg-[#09090d] px-[15px] py-3 sm:py-5 font-mono text-[12px] leading-[12px] overflow-y-auto space-y-2 sm:space-y-2.5 [scrollbar-width:thin] [scrollbar-color:#44474f_#09090d] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#09090d] [&::-webkit-scrollbar-thumb]:bg-[#44474f] [&::-webkit-scrollbar-thumb]:rounded-full select-text`}>
          {history.map((item) => {
            const textColorClass =
              item.type === 'input'
                ? `${getThemeTextClass()} font-bold`
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
                <div key={item.id} className="mt-4 mb-1 flex gap-2 break-words">
                  <span className="text-[#8e9199] shrink-0 select-none hidden sm:inline">node-01:~$</span>
                  <span className="text-[#8e9199] shrink-0 select-none sm:hidden">~$</span>
                  <span className={`${getThemeTextClass()} font-bold`}>{item.text}</span>
                </div>
              );
            }

            if (item.type === 'ascii') {
              return (
                <div key={item.id} className={`break-words whitespace-pre-wrap ${textColorClass} text-[16px] leading-[18px] mt-4 mb-2`}>
                  {item.text}
                </div>
              );
            }

            const lines = item.text.split('\n');

            return (
              <div key={item.id} className={`break-words ${textColorClass} mb-4`}>
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
                     if (tag.includes('✓') || tag.includes('+')) tagColor = 'text-[#a8e6cf] font-bold';
                     else if (tag.includes('⚠') || tag.includes('ERROR') || tag.includes('FAIL')) tagColor = 'text-[#ffb4ab] font-bold';
                     else if (tag.includes('DOSSIER') || tag.includes('CERTIFICATES') || tag.includes('SYSTEM')) tagColor = 'text-[#ffb870] font-bold';
                     
                     prefix = <span className={tagColor}>{tag}</span>;
                     rest = tagMatch[2];
                  }

                  const kvMatch = rest.match(/^(\s*[A-Za-z0-9 _-]+?):(.*)/);
                  if (kvMatch && !rest.includes('http')) {
                     return (
                       <div key={idx} className="whitespace-pre-wrap">
                         {prefix}
                         <span className="opacity-75">{kvMatch[1]}</span>
                         <span className="opacity-40">:</span>
                         <span className="font-semibold text-white/90">{kvMatch[2]}</span>
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
          <div ref={bottomRef}></div>
        </div>

        {/* Command Input Form */}
        <form onSubmit={handleSubmit} className="bg-[#1a1b21] px-[15px] h-[45px] border-t border-[#44474f]/30 flex items-center gap-2 sm:gap-3">
          <span className="text-[#a8c7fa] font-mono font-semibold text-[12px] leading-[12px] flex items-center shrink-0">
            <span className="text-[#8e9199] hidden sm:inline">node-{String(cmdHistory.length).padStart(2, '0')}:~$</span>
            <span className="text-[#a8c7fa] sm:hidden">$</span>
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Type Command"
              className="w-full bg-transparent border-none text-white font-mono text-[12px] leading-[12px] focus:outline-none placeholder:text-[#8e9199] placeholder:text-[12px] placeholder:leading-[12px] min-h-[36px] z-10"
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
          <button
            type="submit"
            style={{ borderRadius: '9999px' }}
            className="w-[25px] h-[25px] bg-[#a8c7fa] hover:bg-[#a8c7fa]/90 active:scale-95 text-[#0f0e13] font-mono font-bold border-0 transition-all shrink-0 cursor-pointer shadow-sm flex items-center justify-center rounded-full"
            title="Execute command"
            aria-label="Execute command"
          >
            <i className="ri-connector-line text-sm font-bold"></i>
          </button>
        </form>
      </div>
    </section>
  );
};
