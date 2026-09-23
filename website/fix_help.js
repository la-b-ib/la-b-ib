const fs = require('fs');

let content = fs.readFileSync('src/components/TerminalModal.tsx', 'utf-8');

// Replace the kvMatch regex
content = content.replace(
  /const kvMatch = rest\.match\(\/\^\(\\s\*\[A-Za-z0-9 _-\]\+\?\):\(.\*\)\/\);/g,
  'const kvMatch = rest.match(/^(\\s*[A-Za-z0-9 _\\-\\/\\\[\\\]<>]+?):(.*)/);'
);

// Replace the help case
const helpCaseRegex = /case 'help':\s+case 'menu':\s+newHistory\.push\({[\s\S]*?break;/;

const newHelpCase = `case 'help':
      case 'menu':
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '█░█ █▀▀ █░░ █▀█\\n█▀█ ██▄ █▄▄ █▀▀',
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'teal',
          text: \`===================================================================
[00] TERMINAL COMMAND LIST
===================================================================

[01] CORE COMMANDS
===================================================================
[01] help / menu    : Display this manual
[02] about          : Personnel dossier & architecture specializations
[03] skills         : Offensive & defensive technical arsenal
[04] projects       : Casefiles & security open-source repositories
[05] certs          : Professional certifications summary
[06] badges         : Verified Credly digital badges list
[07] fastfetch      : Display system info, health diagnostics, & active user
===================================================================

[02] SECURITY TOOLS
===================================================================
[01] nmap [target]  : Port scanner (e.g. "nmap 10.0.0.1")
[02] vulnscan [host]: CVE vulnerability scanner & mitigation reports
[03] hashid <hash>  : Cryptographic hash identification utility
[04] encode <type>  : Base64 / Hex text encoder
[05] decode <type>  : Base64 / Hex text decoder
[06] ping <target>  : ICMP network latency probe
===================================================================

[03] FILESYSTEM & CONTROL
===================================================================
[01] ls             : List directory contents
[02] banner         : Display terminal ASCII banner
[03] ctf            : Launch CTF Decrypt Challenge
[04] echo <text>    : Echo input string
[05] clear          : Clear terminal buffer
[06] exit           : Terminate terminal session
===================================================================\`
        });
        break;`;

content = content.replace(helpCaseRegex, newHelpCase);

fs.writeFileSync('src/components/TerminalModal.tsx', content);
console.log('Update complete.');
