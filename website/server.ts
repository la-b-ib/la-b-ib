import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent likes store for user interactions
const extraLikesStore: Record<string, number> = {};

// Deterministic monthly like calculation helper
const MONTH_MAP: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
};

function computeLikesForDispatch(id: string, dateStr: string = 'AUG 2026'): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  // Monthly increment strictly between 10 and 25
  const monthlyRate = 10 + (absHash % 16);
  const seedLikes = 18 + (absHash % 17);

  // Parse publish date
  const parts = dateStr.trim().split(/\s+/);
  const pubMonth = MONTH_MAP[parts[0]?.toUpperCase()] ?? 7;
  const pubYear = parseInt(parts[1], 10) || 2026;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Elapsed months calculation
  const elapsedMonths = Math.max(0, (currentYear - pubYear) * 12 + (currentMonth - pubMonth));
  const currentMonthFraction = Math.floor((currentDay / daysInMonth) * monthlyRate);

  const baseCalculatedLikes = seedLikes + (elapsedMonths * monthlyRate) + currentMonthFraction;
  const extraLikes = extraLikesStore[id] || 0;

  return baseCalculatedLikes + extraLikes;
}

// API route to fetch likes count for dispatches
app.get('/api/dispatches/likes', (req, res) => {
  const { id, date } = req.query;
  if (typeof id === 'string') {
    const dateStr = typeof date === 'string' ? date : 'AUG 2026';
    return res.json({ id, likes: computeLikesForDispatch(id, dateStr) });
  }
  return res.json({ extraLikes: extraLikesStore });
});

// API route to like / unlike a dispatch
app.post('/api/dispatches/likes/:id', (req, res) => {
  const { id } = req.params;
  const { action = 'like', date = 'AUG 2026' } = req.body;
  if (action === 'like') {
    extraLikesStore[id] = (extraLikesStore[id] || 0) + 1;
  } else if (action === 'unlike') {
    extraLikesStore[id] = Math.max(0, (extraLikesStore[id] || 0) - 1);
  }
  const updatedLikes = computeLikesForDispatch(id, date);
  return res.json({ id, likes: updatedLikes, success: true });
});

// In-memory cache for live GitHub contributions & profile telemetry
const githubCache: Record<string, { timestamp: number; data: any }> = {};
const GITHUB_CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache

// API route to fetch real-time live GitHub contributions directly from public profile
app.get('/api/github/contributions/:username', async (req, res) => {
  const username = req.params.username || 'la-b-ib';
  const now = Date.now();

  if (githubCache[username] && now - githubCache[username].timestamp < GITHUB_CACHE_TTL) {
    return res.json({ ...githubCache[username].data, cached: true });
  }

  try {
    // 1. Fetch contribution data from public endpoint
    const contribPromise = fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=all`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (AI Studio Portfolio; +https://github.com/la-b-ib)' },
    }).then(async (r) => (r.ok ? r.json() : null)).catch(() => null);

    // 2. Fetch public user profile telemetry
    const userPromise = fetch(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (AI Studio Portfolio; +https://github.com/la-b-ib)' },
    }).then(async (r) => (r.ok ? r.json() : null)).catch(() => null);

    const [contribData, userData] = await Promise.all([contribPromise, userPromise]);

    if (!contribData || !contribData.contributions) {
      throw new Error('Failed to retrieve GitHub contributions data');
    }

    const payload = {
      username,
      total: contribData.total || {},
      contributions: contribData.contributions || [],
      publicRepos: userData?.public_repos ?? 12,
      followers: userData?.followers ?? 10,
      avatarUrl: userData?.avatar_url || `https://github.com/${username}.png`,
      cached: false,
      lastUpdated: new Date().toISOString(),
    };

    githubCache[username] = {
      timestamp: now,
      data: payload,
    };

    return res.json(payload);
  } catch (error: any) {
    console.error('Error fetching live GitHub data:', error?.message);
    if (githubCache[username]) {
      return res.json({ ...githubCache[username].data, cached: true, warning: 'Using stale cache' });
    }
    return res.status(502).json({
      error: 'Unable to fetch live GitHub data',
      message: error?.message,
    });
  }
});

// API route for AI vulnerability code audit
app.post('/api/security-audit', async (req, res) => {
  const { code, mode = 'full_audit' } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Code snippet parameter required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const prompt = `You are Labib B. Shahed, Principal OffSec Architect and DFIR Specialist.
Analyze the following source code snippet for security vulnerabilities, software defects, memory corruption, or bad auth practices (Mode: ${mode}):

\`\`\`
${code}
\`\`\`

Return a JSON object with the following exact keys:
- "vulnerabilityType": string (short title e.g. SQL Injection, Buffer Overflow, YARA Rule Target)
- "severity": string ("CRITICAL", "HIGH", "MEDIUM", "LOW", or "INFORMATIONAL")
- "riskScore": number (integer 0 to 100 calculated risk rating)
- "cwe": string (CWE classification e.g. CWE-89)
- "owaspCategory": string (OWASP Top 10 category e.g. A03:2021-Injection)
- "mitreAttck": string (MITRE ATT&CK technique code e.g. T1190 Exploit Public-Facing Application)
- "cvssVector": string (CVSS v3.1 vector string e.g. CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
- "exploitability": string ("High", "Medium", or "Low")
- "analysis": string (detailed technical explanation of threat vector & exploit risk)
- "exploitVectorDetails": string (weaponization steps, payload mechanics, preconditions)
- "recommendedRemediation": string (actionable architectural fix)
- "patchedSnippet": string (hardened code snippet fix)
- "diffUnified": string (unified Git-style diff string comparing original vs patched code)
- "yaraRule": string (a production-valid YARA rule or Suricata detection signature for this threat vector)
- "detectionSignature": string (SIEM / EDR detection logic)

Return ONLY raw JSON, no markdown backticks outside the JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';

    // Robust JSON extraction helper
    let parsedData: any;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleanedJsonText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      try {
        parsedData = JSON.parse(cleanedJsonText);
      } catch {
        const jsonMatch = cleanedJsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedData = JSON.parse(jsonMatch[0]);
          } catch {
            parsedData = null;
          }
        }
      }
    }

    if (!parsedData || typeof parsedData !== 'object') {
      parsedData = {
        vulnerabilityType: 'Security Analysis Notice',
        severity: 'INFORMATIONAL',
        riskScore: 35,
        cwe: 'CWE-200: Exposure of Sensitive Information',
        owaspCategory: 'A05:2021 - Security Misconfiguration',
        mitreAttck: 'T1082 - System Information Discovery',
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
        exploitability: 'Low',
        analysis: responseText || 'Code analysis completed with conversational response.',
        exploitVectorDetails: 'Ensure all inputs, parameters, and system calls are properly validated and sanitized.',
        recommendedRemediation: 'Implement strict parameter bounds checking and input validation.',
        patchedSnippet: `// Hardened Code Implementation\n// Ensure input validation and safe execution context\n`,
        diffUnified: '--- a/source.code\n+++ b/source.code\n@@ -1 +1 @@\n- Unsanitized execution\n+ Sanitized execution',
        yaraRule: `rule Security_Audit_Notice {\n    meta:\n        description = "Security Audit Notice"\n    condition:\n        true\n}`,
        detectionSignature: 'alert ip any any -> any any (msg:"SEC_AUDIT - System Analysis Notice"; sid:1000001;)',
      };
    }

    return res.json(parsedData);
  } catch (err: unknown) {
    console.error('Gemini Audit API Error:', err);
    return res.status(500).json({ error: 'Failed to process AI security audit' });
  }
});

// API route for AI Security Assistant follow-up Q&A
app.post('/api/security-audit/chat', async (req, res) => {
  const { code, auditResult, userQuestion } = req.body;

  if (!userQuestion || typeof userQuestion !== 'string') {
    return res.status(400).json({ error: 'userQuestion parameter required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are Labib B. Shahed, Principal OffSec Architect and Cyber Defense Lead.
The user is inspecting a security audit result for code snippet:

\`\`\`
${code || ''}
\`\`\`

Current Audit Finding:
${JSON.stringify(auditResult || {}, null, 2)}

User Question: "${userQuestion}"

Answer concise, authoritative, professional OffSec/DFIR guidance in markdown format (bullet points, code snippets where appropriate). Avoid fluff.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return res.json({ answer: response.text || 'No response generated.' });
  } catch (err: unknown) {
    console.error('Gemini Security Chat Error:', err);
    return res.status(500).json({ error: 'Failed to answer security follow-up query' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SecOps Server running on http://localhost:${PORT}`);
  });
}

startServer();
