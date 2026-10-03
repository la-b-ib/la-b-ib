/**
 * LABIB // SEC_OPS CYBER PORTFOLIO ENGINE
 * Full-Stack Developer • Ethical Hacker • Data Forensics Expert
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. SYNTHESIZED WEB AUDIO SOUND ENGINE
     ========================================================================== */
  let sfxEnabled = localStorage.getItem('sfx_enabled') !== 'false';
  let audioCtx = null;

  const getAudioContext = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  };

  const playTone = (freq, duration, type = 'sine', gainVal = 0.05) => {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  };

  const playSound = (soundType) => {
    if (!sfxEnabled) return;
    switch (soundType) {
      case 'click':
        playTone(800, 0.05, 'square', 0.03);
        break;
      case 'terminal_key':
        playTone(600 + Math.random() * 200, 0.03, 'sine', 0.02);
        break;
      case 'success':
        playTone(523.25, 0.1, 'sine', 0.06); // C5
        setTimeout(() => playTone(659.25, 0.1, 'sine', 0.06), 100); // E5
        setTimeout(() => playTone(783.99, 0.2, 'sine', 0.06), 200); // G5
        break;
      case 'access_granted':
        playTone(440, 0.1, 'triangle', 0.08);
        setTimeout(() => playTone(880, 0.25, 'triangle', 0.08), 120);
        break;
      case 'error':
        playTone(200, 0.15, 'sawtooth', 0.06);
        setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.06), 150);
        break;
    }
  };

  // SFX Toggle Handler
  const toggleSfxBtn = document.getElementById('toggle-sfx-btn');
  const sfxIcon = document.getElementById('sfx-icon');

  const updateSfxUI = () => {
    if (toggleSfxBtn) {
      if (sfxEnabled) {
        toggleSfxBtn.classList.add('accent-hud-btn');
        toggleSfxBtn.querySelector('.hud-btn-text').textContent = 'SFX: ON';
        if (sfxIcon) sfxIcon.textContent = '🔊';
      } else {
        toggleSfxBtn.classList.remove('accent-hud-btn');
        toggleSfxBtn.querySelector('.hud-btn-text').textContent = 'SFX: OFF';
        if (sfxIcon) sfxIcon.textContent = '🔇';
      }
    }
  };

  if (toggleSfxBtn) {
    toggleSfxBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      localStorage.setItem('sfx_enabled', sfxEnabled);
      updateSfxUI();
      if (sfxEnabled) playSound('click');
    });
  }
  updateSfxUI();

  // Attach generic click audio listener to buttons and links
  document.querySelectorAll('button, a, .filter-btn, .project-card, .skill-card').forEach(elem => {
    elem.addEventListener('click', () => {
      playSound('click');
    });
  });

  /* ==========================================================================
     2. THEME CONTROLLER (DARK DEFAULT)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');

  const getSavedTheme = () => localStorage.getItem('theme') || 'dark';

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      if (themeIconSun) themeIconSun.style.display = 'none';
      if (themeIconMoon) themeIconMoon.style.display = 'block';
    } else {
      if (themeIconSun) themeIconSun.style.display = 'block';
      if (themeIconMoon) themeIconMoon.style.display = 'none';
    }
  };

  setTheme(getSavedTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ==========================================================================
     3. MATRIX RAIN CANVAS ENGINE
     ========================================================================== */
  const matrixCanvas = document.getElementById('matrix-canvas');
  const toggleMatrixBtn = document.getElementById('toggle-matrix-btn');
  let matrixActive = false;
  let matrixInterval = null;

  if (matrixCanvas) {
    const ctx = matrixCanvas.getContext('2d');
    const chars = '01101001010101001010101010100101010010101010101010101010101LABIBSECOPS0101010';
    let fontSize = 14;
    let columns = 0;
    let drops = [];

    const initMatrix = () => {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
      columns = Math.floor(matrixCanvas.width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
      }
    };

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.fillStyle = '#2dd4bf';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    window.addEventListener('resize', () => {
      if (matrixActive) initMatrix();
    });

    const toggleMatrix = () => {
      matrixActive = !matrixActive;
      if (matrixActive) {
        matrixCanvas.classList.add('active');
        toggleMatrixBtn.classList.add('accent-hud-btn');
        initMatrix();
        matrixInterval = setInterval(drawMatrix, 40);
        showToast('Matrix Binary Stream Activated');
      } else {
        matrixCanvas.classList.remove('active');
        toggleMatrixBtn.classList.remove('accent-hud-btn');
        clearInterval(matrixInterval);
        showToast('Matrix Stream Paused');
      }
    };

    if (toggleMatrixBtn) {
      toggleMatrixBtn.addEventListener('click', toggleMatrix);
    }
  }

  /* ==========================================================================
     4. DECIPHER & TYPEWRITER ANIMATION ENGINES
     ========================================================================== */
  // Decipher effect on hero name
  const decryptTarget = document.getElementById('hero-name-decrypt');
  if (decryptTarget) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    let interval = null;

    const runDecrypt = () => {
      let iteration = 0;
      const originalText = decryptTarget.dataset.value || decryptTarget.innerText;
      clearInterval(interval);

      interval = setInterval(() => {
        decryptTarget.innerText = originalText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        iteration += 1 / 3;
      }, 30);
    };

    decryptTarget.addEventListener('mouseover', runDecrypt);
    setTimeout(runDecrypt, 500);
  }

  // Typewriter effect
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const phrases = [
      'Architecting Zero-Trust Cloud Platforms',
      'Reverse Engineering Kernel Rootkits & Ransomware',
      'Performing Physical RAM Memory Forensics',
      'Conducting Penetration Testing & Red Teaming',
      'Building High-Throughput Go & Rust Microservices'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIdx];
      if (isDeleting) {
        typewriterText.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typewriterText.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 30 : 60;

      if (!isDeleting && charIdx === currentPhrase.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 500;
      }

      setTimeout(typeLoop, speed);
    };

    typeLoop();
  }

  /* ==========================================================================
     5. TELEMETRY HASH CALCULATOR & EVENT STREAM
     ========================================================================== */
  const cipherInput = document.getElementById('cipher-input');
  const cipherCalcBtn = document.getElementById('cipher-calc-btn');
  const sha256Output = document.getElementById('sha256-output');
  const md5Output = document.getElementById('md5-output');

  // Simple WebCrypto SHA-256 Hash generator
  async function computeHashes(text) {
    if (!text) return;
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const shaHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      if (sha256Output) sha256Output.textContent = shaHex.substring(0, 16) + '...' + shaHex.substring(56);
      
      // Pseudo-MD5 representation for demo
      let dummyMd5 = '';
      for (let i = 0; i < 32; i++) {
        dummyMd5 += shaHex[(i * 2) % shaHex.length];
      }
      if (md5Output) md5Output.textContent = dummyMd5.substring(0, 16) + '...';
    } catch (e) {
      // Fallback
    }
  }

  if (cipherInput && cipherCalcBtn) {
    cipherCalcBtn.addEventListener('click', () => {
      computeHashes(cipherInput.value);
      playSound('click');
    });
    cipherInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        computeHashes(cipherInput.value);
        playSound('click');
      }
    });
    computeHashes(cipherInput.value);
  }

  // Telemetry stream logger
  const eventStream = document.getElementById('event-stream');
  if (eventStream) {
    const sampleEvents = [
      { type: 'ok', msg: 'Zero-Trust policy re-evaluated: 100% compliant.' },
      { type: 'info', msg: 'eBPF probe captured syscall write() from PID 4092.' },
      { type: 'alert', msg: 'Attempted SQLi payload blocked by WAF filter.' },
      { type: 'ok', msg: 'YARA scanner completed /tmp scan: Clean.' },
      { type: 'info', msg: 'mTLS handshake verified for node-02.' }
    ];

    setInterval(() => {
      const now = new Date();
      const timeStr = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
      const ev = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      
      const line = document.createElement('div');
      line.className = 'stream-line';
      let tagClass = 'info';
      let tagLabel = '[INFO]';
      if (ev.type === 'alert') { tagClass = 'alert'; tagLabel = '[SEC]'; }
      if (ev.type === 'ok') { tagClass = 'ok'; tagLabel = '[OK]'; }

      line.innerHTML = `<span class="time">${timeStr}</span> <span class="tag ${tagClass}">${tagLabel}</span> ${ev.msg}`;
      eventStream.appendChild(line);
      eventStream.scrollTop = eventStream.scrollHeight;

      if (eventStream.children.length > 15) {
        eventStream.removeChild(eventStream.firstChild);
      }
    }, 6000);
  }

  /* ==========================================================================
     6. INTERACTIVE BASH TERMINAL OVERLAY (`~ / BASH`)
     ========================================================================== */
  const terminalModal = document.getElementById('terminal-modal');
  const launchTerminalBtns = document.querySelectorAll('#launch-terminal-btn, .launch-terminal-action');
  const closeTerminalBtn = document.getElementById('close-terminal-btn');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  const openTerminal = () => {
    if (terminalModal) {
      terminalModal.classList.add('active');
      if (terminalInput) terminalInput.focus();
      playSound('terminal_key');
    }
  };

  const closeTerminal = () => {
    if (terminalModal) {
      terminalModal.classList.remove('active');
    }
  };

  launchTerminalBtns.forEach(btn => btn.addEventListener('click', openTerminal));
  if (closeTerminalBtn) closeTerminalBtn.addEventListener('click', closeTerminal);

  // Keyboard shortcut ~ or Ctrl+K to open terminal
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || (e.ctrlKey && e.key === 'k')) {
      e.preventDefault();
      if (terminalModal && terminalModal.classList.contains('active')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    } else if (e.key === 'Escape') {
      closeTerminal();
      closeModal();
      closeCtfModal();
    }
  });

  // Terminal Command Parser
  if (terminalInput && terminalOutput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim();
        terminalInput.value = '';
        if (!cmd) return;

        // Print input line
        appendTermLine(`labib@sec-ops:~$ ${cmd}`, 'cyan-text');
        playSound('terminal_key');

        const args = cmd.toLowerCase().split(' ');
        const mainCmd = args[0];

        switch (mainCmd) {
          case 'help':
            appendTermLine('AVAILABLE COMMANDS:', 'teal-text');
            appendTermLine('  whoami      - Display clearance & personal briefing');
            appendTermLine('  skills      - List tactical cybersecurity & engineering stack');
            appendTermLine('  projects    - List operational casefiles');
            appendTermLine('  certs       - Display verified security certifications');
            appendTermLine('  missions    - View career mission history');
            appendTermLine('  dispatches  - View security advisories & writeups');
            appendTermLine('  ctf         - Launch CTF flag challenge');
            appendTermLine('  matrix      - Toggle binary matrix background stream');
            appendTermLine('  sfx         - Toggle sound effects');
            appendTermLine('  theme       - Toggle dark/light theme');
            appendTermLine('  contact     - Display PGP fingerprint & communication channels');
            appendTermLine('  clear       - Clear terminal window');
            appendTermLine('  sudo        - Privileged access test');
            appendTermLine('  cat secret  - Read classified secret');
            break;

          case 'whoami':
            appendTermLine('USER: Labib B. Shahed', 'green-text');
            appendTermLine('ROLE: Principal Security Architect & Full-Stack Lead');
            appendTermLine('CLEARANCE: Level 5 / Top Secret (OffSec & DFIR)');
            appendTermLine('FOCUS: Zero-Trust Engineering, Memory Forensics, Exploit Research');
            break;

          case 'skills':
            appendTermLine('[SKILL ARSENAL SUMMARY]', 'teal-text');
            appendTermLine('• OffSec: Metasploit, Burp Suite Pro, Nmap, Exploit Dev, OWASP');
            appendTermLine('• DFIR: Volatility 3, Ghidra, YARA, Autopsy, x64dbg, Wireshark');
            appendTermLine('• Full-Stack: TypeScript, React, Node.js, Go, Rust, Docker, Kubernetes');
            appendTermLine('• Cryptography: WebCrypto, AES-GCM, RSA/ECDSA, Zero-Knowledge, mTLS');
            break;

          case 'projects':
          case 'casefiles':
            appendTermLine('[OPERATIONAL CASEFILES]', 'teal-text');
            appendTermLine('1. Spectre-X      - Automated RAM Forensics & Rootkit Detector');
            appendTermLine('2. AegisGuard     - WebAuthn & Passkey Zero-Trust Engine');
            appendTermLine('3. Vortex-Fuzz    - 100k req/sec Parallel Web Fuzzer in Rust');
            appendTermLine('4. CipherTrace   - Malware Detonation Chamber & YARA Generator');
            appendTermLine('5. CyberPulse    - 3D SIEM Telemetry Globe Dashboard');
            appendTermLine('6. KeystrokeVault- Zero-Knowledge Encrypted Messaging Portal');
            break;

          case 'certs':
          case 'clearance':
            appendTermLine('[VERIFIED CLEARANCES & CERTS]', 'teal-text');
            appendTermLine('✓ OSCP     - Offensive Security Certified Professional (OS-109284)');
            appendTermLine('✓ GIAC GCFA- Certified Forensic Analyst (SANS-88402)');
            appendTermLine('✓ CISSP    - Certified Information Systems Security Professional');
            appendTermLine('✓ AWS SEC  - Certified Security Specialty (AWS-SEC-9921)');
            appendTermLine('✓ CEH      - Certified Ethical Hacker Master (ECC-339281)');
            break;

          case 'missions':
          case 'experience':
            appendTermLine('[CAREER MISSIONS]', 'teal-text');
            appendTermLine('2023-PRES: Lead OffSec Architect @ Apex Cyber Solutions');
            appendTermLine('2021-2023: Senior DFIR Specialist @ CyberTrace Intelligence Labs');
            appendTermLine('2019-2021: Senior Full-Stack Security Engineer @ Vanguard Systems');
            appendTermLine('2017-2019: InfoSec & Forensics Analyst @ Global Shield Corp');
            break;

          case 'ctf':
            closeTerminal();
            openCtfModal();
            break;

          case 'matrix':
            if (toggleMatrixBtn) toggleMatrixBtn.click();
            appendTermLine('Matrix stream toggled.', 'green-text');
            break;

          case 'sfx':
            if (toggleSfxBtn) toggleSfxBtn.click();
            appendTermLine(`Sound effects: ${sfxEnabled ? 'ON' : 'OFF'}`, 'green-text');
            break;

          case 'theme':
            if (themeToggleBtn) themeToggleBtn.click();
            appendTermLine('Theme toggled.', 'green-text');
            break;

          case 'contact':
            appendTermLine('[ENCRYPTED CONTACT CHANNELS]', 'teal-text');
            appendTermLine('PGP Fingerprint: 4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2');
            appendTermLine('Email: labib@sec-ops.io');
            appendTermLine('GitHub: github.com/la-b-ib');
            appendTermLine('Matrix: @labib:matrix.org');
            break;

          case 'clear':
            terminalOutput.innerHTML = '';
            break;

          case 'sudo':
            appendTermLine('Nice try! This incident will be reported to security ops.', 'red-text');
            playSound('error');
            break;

          case 'cat':
            if (args[1] === 'secret') {
              appendTermLine('🔓 UNLOCKED SECRET FLAG: CL_FLAG{L4B1B_53C_OPS_2026}', 'green-text');
              playSound('access_granted');
            } else {
              appendTermLine(`cat: ${args[1] || 'missing argument'}: No such file or directory`, 'red-text');
            }
            break;

          default:
            appendTermLine(`bash: command not found: ${cmd}. Type 'help' for options.`, 'red-text');
            playSound('error');
            break;
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    });
  }

  function appendTermLine(text, className = '') {
    const div = document.createElement('div');
    div.className = `term-line ${className}`;
    div.textContent = text;
    terminalOutput.appendChild(div);
  }

  /* ==========================================================================
     7. FILTER CONTROLLERS (TIMELINE, SKILLS, PROJECTS, BLOG)
     ========================================================================== */
  // Generic Filter Helper
  const setupFilter = (containerId, selectorClass, dataAttr) => {
    const filterContainer = document.getElementById(containerId);
    if (!filterContainer) return;

    const filterBtns = filterContainer.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll(selectorClass);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetFilter = btn.dataset[dataAttr];

        items.forEach(item => {
          const itemCat = item.dataset[dataAttr] || item.dataset.cat || item.dataset.pcat || item.dataset.bcat || item.dataset.category || '';
          if (targetFilter === 'all' || itemCat.includes(targetFilter)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  };

  setupFilter('experience-filters', '.timeline-item', 'filter');
  setupFilter('skill-category-tabs', '.skill-card', 'skillCat');
  setupFilter('project-filters', '.project-card', 'pfilter');
  setupFilter('blog-filters', '.blog-card', 'bfilter');

  /* ==========================================================================
     8. DETAIL MODALS (CASEFILES, ARTICLES, CERTS)
     ========================================================================== */
  const detailModal = document.getElementById('detail-modal');
  const detailModalTag = document.getElementById('detail-modal-tag');
  const detailModalBody = document.getElementById('detail-modal-body');
  const closeModalBtn = document.getElementById('close-modal-btn');

  const openModal = (tagText, htmlContent) => {
    if (detailModal && detailModalBody) {
      if (detailModalTag) detailModalTag.textContent = tagText;
      detailModalBody.innerHTML = htmlContent;
      detailModal.classList.add('active');
      playSound('click');
    }
  };

  const closeModal = () => {
    if (detailModal) detailModal.classList.remove('active');
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeModal();
    });
  }

  // Casefile Modals Data
  const casefileData = {
    'spectre-x': {
      title: 'Spectre-X // RAM Forensics & Kernel Rootkit Detector',
      badge: 'CRITICAL FORENSIC TOOL',
      summary: 'Spectre-X is a memory forensic analysis engine designed to parse uncompressed Windows (x64) and Linux RAM dumps to uncover sophisticated rootkit techniques.',
      details: [
        'Integrated with Volatility 3 framework API for deep physical address translation.',
        'Detects SSDT/IDT kernel hook modifications, direct kernel object manipulation (DKOM), and unlinked VAD tree structures.',
        'Automatically extracts injected shellcode blocks and hashes them against VirusTotal API.'
      ],
      code: `def scan_kernel_hooks(vol_context, memory_dump):\n    plugin = vol_context.plugins.get('windows.pslist')\n    for process in plugin.list_processes(memory_dump):\n        if process.is_unlinked_from_vad():\n            flag_rootkit_artifact(process.pid, process.name)`
    },
    'aegisguard': {
      title: 'AegisGuard // WebAuthn & Passkey Zero-Trust Engine',
      badge: 'ZERO-TRUST ARCHITECTURE',
      summary: 'A high-availability authentication service built to replace password-based login flows with cryptographic FIDO2/WebAuthn hardware key credentials.',
      details: [
        'Enforces ECDSA P-256 signature verification directly in microservices layer.',
        'Prevents phishing attacks by binding origin signatures to TLS certificates.',
        'Handles biometric passkey enrollment with zero-knowledge fallback tokens.'
      ],
      code: `export async function verifyPasskeySignature(credential, expectedChallenge) {\n  const verified = await simpleWebAuthn.verifyAuthenticationResponse({\n    response: credential,\n    expectedChallenge,\n    expectedOrigin: 'https://sec-ops.io'\n  });\n  return verified.verified;\n}`
    },
    'vortext-fuzz': {
      title: 'Vortex-Fuzz // 100k req/sec Parallel Web API Fuzzer',
      badge: 'HIGH THROUGHPUT RUST ENGINE',
      summary: 'Written in pure Rust with Tokio async runtime, Vortex-Fuzz blasts HTTP/2 endpoints with mutation-based fuzzing payloads to isolate logic flaws and crash points.',
      details: [
        'Custom HTTP/2 multiplexing pipeline bypassing standard threadpool bottlenecks.',
        'Automatic parameter discovery using dynamic dictionary mutation algorithms.',
        'Outputs structured JSON reports mapping response codes, response time variance, & stacktraces.'
      ],
      code: `#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std.error::Error>> {\n    let client = Client::builder().http2_prior_knowledge().build()?;\n    let handles: Vec<_> = (0..1000).map(|i| tokio::spawn(fuzz_worker(client.clone(), i))).collect();\n    futures::future::join_all(handles).await;\n    Ok(())\n}`
    }
  };

  document.querySelectorAll('.inspect-casefile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.dataset.case;
      const data = casefileData[caseId] || {
        title: 'Operational Casefile Detail',
        badge: 'CONFIDENTIAL',
        summary: 'Full technical briefing available upon request with appropriate security clearance.',
        details: ['Architecture specification verified.', 'Threat model analysis completed.', 'Defensive controls deployed.'],
        code: `// Confidential Casefile Log Entry\nlog_event("CASEFILE_INSPECTED", user_clearance="LEVEL_5");`
      };

      const html = `
        <div class="casefile-modal-inner">
          <span class="threat-level-badge red" style="display:inline-block; margin-bottom:0.75rem;">${data.badge}</span>
          <h2 style="font-size:1.5rem; margin-bottom:0.75rem;">${data.title}</h2>
          <p style="font-size:0.95rem; color:var(--text-secondary); margin-bottom:1.25rem;">${data.summary}</p>
          <h4 class="code-text" style="color:var(--accent-teal); font-size:0.85rem; margin-bottom:0.5rem;">&gt; KEY CAPABILITIES &amp; THREAT MATRIX</h4>
          <ul class="role-bullets" style="margin-bottom:1.5rem;">
            ${data.details.map(d => `<li>${d}</li>`).join('')}
          </ul>
          <h4 class="code-text" style="color:var(--accent-teal); font-size:0.85rem; margin-bottom:0.5rem;">&gt; SAMPLE ARCHITECTURE SNIPPET</h4>
          <pre class="code-text" style="background:#000; border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-sm); font-size:0.8rem; overflow-x:auto; color:var(--accent-teal); margin-bottom:1.5rem;"><code>${data.code}</code></pre>
          <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
            <a href="https://github.com/la-b-ib" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">GITHUB REPOSITORY</a>
          </div>
        </div>
      `;

      openModal('[ CLASSIFIED CASEFILE INSPECTION ]', html);
    });
  });

  // Certificate Verification Modals
  document.querySelectorAll('.cert-verify-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const certId = btn.dataset.certId || 'VERIFIED-001';
      const certName = btn.closest('.cert-card').querySelector('.cert-name').textContent;
      
      const html = `
        <div style="text-align:center; padding:1rem 0;">
          <div style="font-size:3rem; margin-bottom:0.5rem;">🛡️</div>
          <span class="cert-status verified" style="font-size:0.8rem; padding:0.3rem 0.8rem;">✓ OFFICIAL CREDENTIAL VERIFIED</span>
          <h2 style="font-size:1.4rem; margin:1rem 0 0.25rem;">${certName}</h2>
          <div class="code-text" style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1.5rem;">ISSUER CREDENTIAL ID: ${certId}</div>
          <div style="background:var(--code-bg); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md); text-align:left; font-size:0.85rem; font-family:var(--font-mono); margin-bottom:1.5rem;">
            <div style="color:var(--accent-green); margin-bottom:0.3rem;">STATUS: ACTIVE &amp; VALID IN ISSUER REGISTRY</div>
            <div style="color:var(--text-secondary); margin-bottom:0.3rem;">EXAM TYPE: Practical Hands-On / Rigorous Proctored</div>
            <div style="color:var(--text-secondary);">BLOCKCHAIN HASH: 0x8f2c...9b1a (Cryptographically Signed)</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('detail-modal').classList.remove('active')">CLOSE VERIFICATION</button>
        </div>
      `;
      openModal('[ CREDENTIAL REGISTRY VERIFICATION ]', html);
    });
  });

  // Blog Article Readers
  document.querySelectorAll('.read-dispatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.closest('.blog-card').querySelector('.blog-title').textContent;
      const excerpt = btn.closest('.blog-card').querySelector('.blog-excerpt').textContent;

      const html = `
        <div>
          <span class="blog-tag teal" style="margin-bottom:0.75rem; display:inline-block;">FIELD DISPATCH WRITEUP</span>
          <h2 style="font-size:1.6rem; margin-bottom:0.75rem;">${title}</h2>
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-bottom:1.5rem;">BY LABIB B. SHAHED • SECURITY ADVISORY • 10 MIN READ</div>
          <p style="font-size:1rem; line-height:1.7; color:var(--text-secondary); margin-bottom:1.25rem;">${excerpt}</p>
          <p style="font-size:0.95rem; line-height:1.7; color:var(--text-secondary); margin-bottom:1.25rem;">
            During technical investigations, threat actors frequently weaponize obscure system APIs to subvert endpoint detection and response (EDR) telemetry. By implementing eBPF kernel hooks or conducting physical RAM analysis, security teams can isolate compromised memory blocks before payload execution completes.
          </p>
          <div style="background:#000; border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-sm); font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-teal); margin-bottom:1.5rem;">
            // Remediation & Detection Strategy<br />
            1. Enforce strict memory integrity checks via Kernel DMA Protection.<br />
            2. Author YARA signatures targeting unique binary header entropy patterns.<br />
            3. Rotate API tokens and enforce mTLS across all internal microservice channels.
          </div>
        </div>
      `;
      openModal('[ SECURITY DISPATCH FULL ARTICLE ]', html);
    });
  });

  /* ==========================================================================
     9. CTF DECRYPT CHALLENGE MODAL
     ========================================================================== */
  const ctfModal = document.getElementById('ctf-modal');
  const ctfLauncherBtn = document.getElementById('ctf-launcher-btn');
  const closeCtfBtn = document.getElementById('close-ctf-btn');
  const submitCtfFlagBtn = document.getElementById('submit-ctf-flag-btn');
  const ctfFlagInput = document.getElementById('ctf-flag-input');
  const ctfResultMsg = document.getElementById('ctf-result-msg');

  const openCtfModal = () => {
    if (ctfModal) {
      ctfModal.classList.add('active');
      if (ctfFlagInput) ctfFlagInput.focus();
      playSound('click');
    }
  };

  const closeCtfModal = () => {
    if (ctfModal) ctfModal.classList.remove('active');
  };

  if (ctfLauncherBtn) ctfLauncherBtn.addEventListener('click', openCtfModal);
  if (closeCtfBtn) closeCtfBtn.addEventListener('click', closeCtfModal);

  if (submitCtfFlagBtn && ctfFlagInput) {
    submitCtfFlagBtn.addEventListener('click', () => {
      const val = ctfFlagInput.value.trim();
      // SGVsbG8gSGFja2VyISBDTF9GTEFHe0w0QjFCXzUzQ19PUFNfMjAyNn0= decodes to: Hello Hacker! CL_FLAG{L4B1B_53C_OPS_2026}
      if (val.includes('CL_FLAG{L4B1B_53C_OPS_2026}') || val === 'L4B1B_53C_OPS_2026') {
        if (ctfResultMsg) {
          ctfResultMsg.className = 'ctf-result success';
          ctfResultMsg.innerHTML = '🚩 FLAG CAPTURED! ACCESS GRANTED. You have unlocked the Official Hacker Clearance Badge!';
        }
        playSound('access_granted');
        showToast('🏆 CTF Victory! Official Hacker Clearance Unlocked!');
      } else {
        if (ctfResultMsg) {
          ctfResultMsg.className = 'ctf-result error';
          ctfResultMsg.innerHTML = '❌ INVALID FLAG PAYLOAD. Hint: Try decoding the Base64 payload string with `atob()` or `base64 -d`.';
        }
        playSound('error');
      }
    });
  }

  /* ==========================================================================
     10. PGP KEY COPIER & TRANSMITTER FORM
     ========================================================================== */
  const copyPgpBtn = document.getElementById('copy-pgp-btn');
  const viewRawPgpBtn = document.getElementById('view-raw-pgp-btn');

  if (copyPgpBtn) {
    copyPgpBtn.addEventListener('click', () => {
      const fingerprint = '4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2';
      navigator.clipboard.writeText(fingerprint);
      showToast('PGP Fingerprint copied to clipboard!');
      playSound('click');
    });
  }

  if (viewRawPgpBtn) {
    viewRawPgpBtn.addEventListener('click', () => {
      const rawKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: GnuPG v2.2.19 (GNU/Linux)\n\nmQENBF+1aXABCAC3qW8p0...L4B1B_53C_OPS_2026...XyZ9\n=4F9B\n-----END PGP PUBLIC KEY BLOCK-----`;
      openModal('[ RAW PGP PUBLIC KEY ASCII ]', `<pre class="code-text" style="background:#000; padding:1rem; border-radius:var(--radius-sm); color:var(--accent-teal); font-size:0.8rem; overflow-x:auto;">${rawKey}</pre>`);
    });
  }

  // Encrypted Form Transmission Simulator
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-form-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>ENCRYPTING RSA PAYLOAD...</span>';
      }

      setTimeout(() => {
        playSound('success');
        showToast('⚡ Transmission Encrypted & Dispatched Successfully!');
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>TRANSMIT ENCRYPTED PAYLOAD</span>';
        }
      }, 1500);
    });
  }

  /* ==========================================================================
     11. TOAST NOTIFICATIONS & BACK TO TOP
     ========================================================================== */
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  }

  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      if (backToTopBtn) backToTopBtn.classList.add('visible');
    } else {
      if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Navigation Toggle
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      playSound('click');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
});
