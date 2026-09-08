const fs = require('fs');

let content = fs.readFileSync('src/components/TerminalModal.tsx', 'utf-8');

// Update ALL_COMMANDS
content = content.replace(
  /const ALL_COMMANDS = \[\s*([^\]]*)\s*\];/,
  (match, p1) => {
    let commands = p1.split(',').map(s => s.trim().replace(/'/g, '').replace(/"/g, '')).filter(Boolean);
    // Remove nmap, ping, vulnscan
    commands = commands.filter(c => !['nmap', 'ping', 'vulnscan'].includes(c));
    // Add overwatch (let's put it right after biofetch)
    const bioIdx = commands.indexOf('biofetch');
    if (bioIdx !== -1) {
        commands.splice(bioIdx + 1, 0, 'overwatch');
    } else {
        commands.push('overwatch');
    }
    return `const ALL_COMMANDS = [\n  ${commands.map(c => `'${c}'`).join(',\n  ')},\n];`;
  }
);

// Update Help case
const oldHelpText = `[02] SECURITY TOOLS
===================================================================
[01] nmap [target]  : Port scanner (e.g. "nmap 10.0.0.1")
[02] vulnscan [host]: CVE vulnerability scanner & mitigation reports
[03] ping <target>  : ICMP network latency probe
===================================================================`;

const newHelpText = `[02] SECURITY TOOLS
===================================================================
[01] overwatch [host]: Automated reconnaissance, port mapping & vulnerability audit
===================================================================`;

content = content.replace(oldHelpText, newHelpText);

// Remove nmap, vulnscan, ping cases and add overwatch case
// Using regex to carefully match each case block until the next case or default

const nmapRegex = /case\s+"nmap":\s*\{[\s\S]*?break;\s*\}/;
const vulnscanRegex = /case\s+'vulnscan':\s*\{[\s\S]*?break;\s*\}/;
const pingRegex = /case\s+'ping':\s*\{[\s\S]*?break;\s*\}/;

content = content.replace(nmapRegex, '');
content = content.replace(vulnscanRegex, '');
content = content.replace(pingRegex, '');

// Insert overwatch case before the 'clear' case
const overwatchCase = `case 'overwatch': {
        const target = args[0] || 'sec-node-01.internal';
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'ascii',
          text: '█▀█ █░█ █▀▀ █▀█ █░█░█ ▄▀█ ▀█▀ █▀▀ █░█\\n█▄█ ▀▄▀ ██▄ █▀▄ ▀▄▀▄▀ █▀█ ░█░ █▄▄ █▀█',
        });
        newHistory.push({
          id: crypto.randomUUID(),
          type: 'teal',
          text: \`===================================================================
[01] TARGET RECONNAISSANCE & LATENCY PROBE
===================================================================
[01] Target Host  : \${target}
[02] Resolved IP  : 10.0.0.1 (DNS: Cloudflare WARP)
[03] ICMP Latency : 14.2ms (0% Packet Loss, TTL=54)
[04] MAC Address  : 0A:1B:2C:3D:4E:5F (OUI: Virtual Interface)
===================================================================

[02] PORT & SERVICE MAPPING (SYN STEALTH SCAN)
===================================================================
[PORT]     [STATE]      [SERVICE]         [VERSION]
22/tcp     open         ssh               OpenSSH 9.6 (protocol 2.0)
80/tcp     open         http              Nginx 1.25.3
443/tcp    open         ssl/http          Nginx 1.25.3
8080/tcp   filtered     http-proxy        -
===================================================================

[03] VULNERABILITY AUDIT & MITIGATION REPORT
===================================================================
[✓] Port 22 SSH    : Clean (Patched against CVE-2024-6387 RegreSSHion)
[✓] Port 80 HTTP   : Clean (Headers hardened, strict CSP enforced)
[⚠] Port 443 HTTPS : INFO - TLS 1.2 legacy cipher suites supported
[✓] Memory Kernel  : eBPF Spectre mitigation enabled (IBRS active)
===================================================================

[04] THREAT INTELLIGENCE SUMMARY
===================================================================
[01] Defense Posture : OPTIMAL (0 Critical, 0 High, 1 Info)
[02] Overall Score   : 9.8 / 10 SECURE
[03] Recommendation  : Disable TLS 1.2 CBC suites on proxy edge.
===================================================================\`,
        });
        break;
      }
      `;

content = content.replace(/case\s+'clear':/, overwatchCase + "case 'clear':");

fs.writeFileSync('src/components/TerminalModal.tsx', content);
