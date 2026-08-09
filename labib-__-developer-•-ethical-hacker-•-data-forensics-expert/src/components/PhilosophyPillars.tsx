import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export const PhilosophyPillars: React.FC = () => {
  const [activePillar, setActivePillar] = useState<number>(0);

  // Pillar 1 Interactive Demo State (Zero Trust)
  const [mtlsEnabled, setMtlsEnabled] = useState<boolean>(true);
  const [jwtValid, setJwtValid] = useState<boolean>(true);
  const [ipWhitelisted, setIpWhitelisted] = useState<boolean>(true);
  const [zeroTrustLog, setZeroTrustLog] = useState<string[]>([]);
  const [simulating, setSimulating] = useState<boolean>(false);

  // Pillar 2 Interactive Demo State (Sanitization)
  const [rawPayload, setRawPayload] = useState<string>("SELECT * FROM users WHERE '1'='1' -- OR <script>alert('pwned')</script>");
  const [sanitizedOutput, setSanitizedOutput] = useState<string | null>(null);

  // Pillar 3 Interactive Demo State (Forensics Heap Inspection)
  const [scanningRam, setScanningRam] = useState<boolean>(false);
  const [forensicArtifacts, setForensicArtifacts] = useState<{ pid: number; name: string; status: string; memoryOffset: string }[] | null>(null);

  // Pillar 4 Interactive Demo State (Performance & Cache Benchmark)
  const [cacheEnabled, setCacheEnabled] = useState<boolean>(true);
  const [benchmarking, setBenchmarking] = useState<boolean>(false);
  const [benchResults, setBenchResults] = useState<{ latencyMs: number; throughputTps: number; p99Ms: number } | null>(null);

  // Zero-Trust Simulation Trigger
  const handleTestZeroTrust = () => {
    soundEngine.play('click');
    setSimulating(true);
    setZeroTrustLog(['[00.00ms] Packet arrived at ingress proxy...']);

    setTimeout(() => {
      if (!mtlsEnabled) {
        setZeroTrustLog((prev) => [
          ...prev,
          '[01.20ms] ❌ mTLS Handshake Failed: Invalid Client Certificate',
          '[01.40ms] ⛔ DENIED: Connection terminated at Edge (403 Forbidden)',
        ]);
        setSimulating(false);
        return;
      }
      setZeroTrustLog((prev) => [...prev, '[01.20ms] ✅ mTLS 1.3 Handshake Succeeded (TLS_AES_256_GCM)']);

      setTimeout(() => {
        if (!jwtValid) {
          setZeroTrustLog((prev) => [
            ...prev,
            '[02.80ms] ❌ OAuth2 JWT Verification Failed: Token Expired / Invalid HMAC',
            '[03.00ms] ⛔ DENIED: Unauthorized Request (401 Unauthorized)',
          ]);
          setSimulating(false);
          return;
        }
        setZeroTrustLog((prev) => [...prev, '[02.80ms] ✅ OAuth2 JWT Bearer Claims Validated (Scope: write:secure)']);

        setTimeout(() => {
          if (!ipWhitelisted) {
            setZeroTrustLog((prev) => [
              ...prev,
              '[04.10ms] ❌ eBPF Firewall Check: Source IP not in Zero-Trust subnet',
              '[04.30ms] ⛔ DENIED: Kernel eBPF Packet Drop (403 Forbidden)',
            ]);
            setSimulating(false);
            return;
          }
          setZeroTrustLog((prev) => [
            ...prev,
            '[04.10ms] ✅ eBPF Packet Filtering passed',
            '[05.20ms] 🚀 SUCCESS: Request forwarded to Microservice. HTTP 200 OK',
          ]);
          setSimulating(false);
        }, 300);
      }, 300);
    }, 300);
  };

  // Sanitizer Run Trigger
  const handleRunSanitizer = () => {
    soundEngine.play('click');
    let clean = rawPayload
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[REDACTED_SCRIPT]')
      .replace(/' OR '1'='1/gi, '[PREPARED_STATEMENT_BOUND]')
      .replace(/SELECT\s+\*\s+FROM/gi, 'SELECT [SPECIFIC_FIELDS] FROM');
    setSanitizedOutput(clean);
  };

  // Forensic Heap Scan Trigger
  const handleScanMemory = () => {
    soundEngine.play('click');
    setScanningRam(true);
    setForensicArtifacts(null);
    setTimeout(() => {
      setForensicArtifacts([
        { pid: 1024, name: 'systemd-journal', status: 'CLEAN', memoryOffset: '0x7fff81a000' },
        { pid: 2048, name: 'nginx-worker', status: 'CLEAN', memoryOffset: '0x7fff81f200' },
        { pid: 31337, name: 'malicious_hook.so (INJECTED)', status: 'MALWARE_FOUND', memoryOffset: '0x7fff89a410' },
        { pid: 4096, name: 'postgres_pool', status: 'CLEAN', memoryOffset: '0x7fff82b300' },
      ]);
      setScanningRam(false);
    }, 800);
  };

  // Benchmark Run Trigger
  const handleRunBenchmark = () => {
    soundEngine.play('click');
    setBenchmarking(true);
    setTimeout(() => {
      if (cacheEnabled) {
        setBenchResults({ latencyMs: 1.2, throughputTps: 18500, p99Ms: 2.4 });
      } else {
        setBenchResults({ latencyMs: 145.8, throughputTps: 1200, p99Ms: 380.0 });
      }
      setBenchmarking(false);
    }, 600);
  };

  const pillars = [
    {
      id: 0,
      title: '1. Defense in Depth & Zero Trust',
      subtitle: 'Never Trust, Always Explicitly Verify',
      icon: 'ri-shield-cross-line',
      color: '#a8c7fa',
      bgColor: '#004a77',
      desc: 'Never assume internal network trust. Every microservice API endpoint, database query, and WebSocket connection must enforce strict identity verification, short-lived OAuth tokens, and mutual TLS encryption.',
    },
    {
      id: 1,
      title: '2. Offensive Mindset for Defense',
      subtitle: 'Engineered Immune to Exploits',
      icon: 'ri-sword-line',
      color: '#a8e6cf',
      bgColor: '#00522b',
      desc: 'Resilient applications are engineered by developers who deeply understand exploit mechanics. By conducting penetration testing, fuzzing, and AST sanitization, systems are hardened against zero-day vectors.',
    },
    {
      id: 2,
      title: '3. Low-Level Forensic Analysis',
      subtitle: 'Root Cause Resolution via RAM Artifacts',
      icon: 'ri-search-eye-line',
      color: '#d0bcff',
      bgColor: '#3b00ed',
      desc: 'When security anomalies occur, ground truth resides in kernel ring buffers, volatile memory heap dumps, and raw pcap bytes. Forensics capabilities guarantee immediate containment and root cause isolation.',
    },
    {
      id: 3,
      title: '4. High-Performance Craftsmanship',
      subtitle: 'Sub-Millisecond Speed Meets Security',
      icon: 'ri-speed-up-line',
      color: '#ffb951',
      bgColor: '#5f3300',
      desc: 'Security must never degrade user experience or induce latency bottlenecks. Building slick, responsive user interfaces backed by ultra-fast microservices with sub-millisecond in-memory caching.',
    },
  ];

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* PILLARS SELECTOR TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pillars.map((p) => {
          const isSelected = activePillar === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setActivePillar(p.id);
                soundEngine.play('click');
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#1a1b21] border-[#a8c7fa] shadow-xl ring-1 ring-[#a8c7fa]/40'
                  : 'bg-[#0f0e13] border-[#44474f]/40 hover:border-[#a8c7fa]/50 hover:bg-[#1a1b21]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl"
                  style={{
                    backgroundColor: `${p.bgColor}40`,
                    borderColor: `${p.color}60`,
                    color: p.color,
                  }}
                >
                  <i className={p.icon}></i>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isSelected ? 'bg-[#a8c7fa] text-[#042e60] font-bold' : 'text-[#8e9199] border-[#44474f]'
                  }`}
                >
                  PILLAR 0{p.id + 1}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{p.title}</h4>
                <p className="text-[11px] text-[#8e9199] line-clamp-1 font-mono mt-0.5">{p.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE PILLAR EXPANDED DETAILS & INTERACTIVE SIMULATOR */}
      <div className="bg-[#1a1b21] p-6 rounded-2xl border border-[#44474f]/60 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#44474f]/40 pb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl"
              style={{
                backgroundColor: `${pillars[activePillar].bgColor}50`,
                borderColor: `${pillars[activePillar].color}80`,
                color: pillars[activePillar].color,
              }}
            >
              <i className={pillars[activePillar].icon}></i>
            </div>
            <div>
              <div className="text-xs font-mono text-[#a8c7fa] uppercase tracking-wider">
                ARCHITECTURAL DISCIPLINE 0{activePillar + 1}
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">{pillars[activePillar].title}</h3>
            </div>
          </div>

          <span className="text-xs font-mono text-[#a8e6cf] bg-[#00522b]/40 px-3 py-1 rounded-full border border-[#a8e6cf]/30">
            LIVE DEMONSTRATOR READY
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#c4c6d0] leading-relaxed font-sans">
          {pillars[activePillar].desc}
        </p>

        {/* DEMONSTRATOR 1: ZERO TRUST PIPELINE SIMULATOR */}
        {activePillar === 0 && (
          <div className="bg-[#0f0e13] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
              <span className="text-[#a8c7fa] font-bold flex items-center gap-1.5">
                <i className="ri-flask-line"></i> INTERACTIVE ZERO-TRUST PIPELINE SIMULATOR
              </span>
              <span className="text-[11px] text-[#8e9199]">TOGGLE PIPELINE GAUNTLETS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* mTLS Toggle */}
              <button
                onClick={() => {
                  setMtlsEnabled(!mtlsEnabled);
                  soundEngine.play('click');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mtlsEnabled ? 'bg-[#004a77]/30 border-[#a8c7fa] text-white' : 'bg-[#1a1b21] border-[#ff1744]/60 text-[#8e9199]'
                }`}
              >
                <div className="text-[10px] text-[#8e9199] font-bold">MUTUAL TLS (mTLS)</div>
                <div className="text-xs font-bold mt-1 flex items-center justify-between">
                  <span>{mtlsEnabled ? 'mTLS 1.3 ENABLED' : 'mTLS DISABLED'}</span>
                  <i className={mtlsEnabled ? 'ri-checkbox-circle-fill text-[#a8c7fa]' : 'ri-close-circle-fill text-[#ff1744]'}></i>
                </div>
              </button>

              {/* JWT Toggle */}
              <button
                onClick={() => {
                  setJwtValid(!jwtValid);
                  soundEngine.play('click');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  jwtValid ? 'bg-[#004a77]/30 border-[#a8c7fa] text-white' : 'bg-[#1a1b21] border-[#ff1744]/60 text-[#8e9199]'
                }`}
              >
                <div className="text-[10px] text-[#8e9199] font-bold">OAUTH2 JWT BEARER</div>
                <div className="text-xs font-bold mt-1 flex items-center justify-between">
                  <span>{jwtValid ? 'VALID TOKEN' : 'EXPIRED / INVALID'}</span>
                  <i className={jwtValid ? 'ri-checkbox-circle-fill text-[#a8c7fa]' : 'ri-close-circle-fill text-[#ff1744]'}></i>
                </div>
              </button>

              {/* eBPF IP Toggle */}
              <button
                onClick={() => {
                  setIpWhitelisted(!ipWhitelisted);
                  soundEngine.play('click');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  ipWhitelisted ? 'bg-[#004a77]/30 border-[#a8c7fa] text-white' : 'bg-[#1a1b21] border-[#ff1744]/60 text-[#8e9199]'
                }`}
              >
                <div className="text-[10px] text-[#8e9199] font-bold">eBPF IP FILTERING</div>
                <div className="text-xs font-bold mt-1 flex items-center justify-between">
                  <span>{ipWhitelisted ? 'IP ALLOWED' : 'UNAUTHORIZED IP'}</span>
                  <i className={ipWhitelisted ? 'ri-checkbox-circle-fill text-[#a8c7fa]' : 'ri-close-circle-fill text-[#ff1744]'}></i>
                </div>
              </button>
            </div>

            <button
              onClick={handleTestZeroTrust}
              disabled={simulating}
              className="m3-btn-primary w-full justify-center text-xs font-bold py-2.5 cursor-pointer"
            >
              <i className="ri-play-fill"></i>
              <span>{simulating ? 'DISPATCHING PACKET THROUGH ZERO-TRUST PIPELINE...' : 'DISPATCH SIMULATED REQUEST'}</span>
            </button>

            {/* Execution Log Screen */}
            {zeroTrustLog.length > 0 && (
              <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#44474f] space-y-1 text-[11px] text-[#c4c6d0]">
                {zeroTrustLog.map((log, idx) => (
                  <div key={idx} className="animate-fadeIn">{log}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DEMONSTRATOR 2: AST SANITIZATION PLAYGROUND */}
        {activePillar === 1 && (
          <div className="bg-[#0f0e13] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
              <span className="text-[#a8e6cf] font-bold flex items-center gap-1.5">
                <i className="ri-code-s-slash-line"></i> OFFENSIVE PAYLOAD SANITIZER & AST DEFENSE
              </span>
              <span className="text-[11px] text-[#8e9199]">SQLi & XSS IMMUNITY</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#8e9199] font-bold">INPUT RAW MALICIOUS PAYLOAD</label>
              <input
                type="text"
                value={rawPayload}
                onChange={(e) => setRawPayload(e.target.value)}
                className="w-full bg-[#1a1b21] border border-[#44474f] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#a8e6cf]"
              />
            </div>

            <button
              onClick={handleRunSanitizer}
              className="px-4 py-2 bg-[#00522b] hover:bg-[#00703c] text-[#a8e6cf] border border-[#a8e6cf]/40 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-2"
            >
              <i className="ri-shield-flash-line"></i>
              <span>RUN AST SANITIZER & PREPARED STATEMENT BINDING</span>
            </button>

            {sanitizedOutput !== null && (
              <div className="p-3 bg-[#1a1b21] rounded-xl border border-[#a8e6cf]/40 space-y-1">
                <div className="text-[10px] text-[#a8e6cf] font-bold">SANITIZED SECURE EXECUTION OUTPUT</div>
                <div className="text-xs text-white bg-[#0f0e13] p-2 rounded-lg border border-[#44474f]/50 font-mono">
                  {sanitizedOutput}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DEMONSTRATOR 3: FORENSIC RAM HEAP INSPECTION */}
        {activePillar === 2 && (
          <div className="bg-[#0f0e13] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
              <span className="text-[#d0bcff] font-bold flex items-center gap-1.5">
                <i className="ri-cpu-line"></i> VOLATILITY 3 KERNEL HEAP & RAM INSPECTOR
              </span>
              <span className="text-[11px] text-[#8e9199]">LIVE MEMORY DUMP: memdump.vmem</span>
            </div>

            <button
              onClick={handleScanMemory}
              disabled={scanningRam}
              className="px-4 py-2 bg-[#3b00ed]/30 hover:bg-[#3b00ed]/50 text-[#d0bcff] border border-[#d0bcff]/40 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-2"
            >
              <i className="ri-search-line"></i>
              <span>{scanningRam ? 'SCANNING RAM HEAP ARTIFACTS...' : 'INSPECT KERNEL RAM & PROCESS TREE'}</span>
            </button>

            {forensicArtifacts && (
              <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#44474f] space-y-2">
                <div className="text-[10px] text-[#8e9199] font-bold flex justify-between">
                  <span>PROCESS NAME</span>
                  <span>PID</span>
                  <span>MEMORY OFFSET</span>
                  <span>STATUS</span>
                </div>
                {forensicArtifacts.map((item) => (
                  <div key={item.pid} className="flex justify-between items-center text-xs border-t border-[#44474f]/30 pt-1.5">
                    <span className="text-white font-bold">{item.name}</span>
                    <span className="text-[#8e9199]">{item.pid}</span>
                    <span className="text-[#a8c7fa]">{item.memoryOffset}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'CLEAN' ? 'bg-[#00522b]/40 text-[#a8e6cf]' : 'bg-[#93000a]/50 text-[#ffb4ab] animate-pulse'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DEMONSTRATOR 4: PERFORMANCE BENCHMARK */}
        {activePillar === 3 && (
          <div className="bg-[#0f0e13] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
              <span className="text-[#ffb951] font-bold flex items-center gap-1.5">
                <i className="ri-dashboard-line"></i> MICROSECOND BENCHMARK & IN-MEMORY CACHE
              </span>
              <span className="text-[11px] text-[#8e9199]">HIGH-THROUGHPUT TEST</span>
            </div>

            <div className="flex items-center justify-between bg-[#1a1b21] p-3 rounded-xl border border-[#44474f]/40">
              <span className="text-white font-bold">REDIS IN-MEMORY L2 CACHE LAYER</span>
              <button
                onClick={() => {
                  setCacheEnabled(!cacheEnabled);
                  soundEngine.play('click');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cacheEnabled ? 'bg-[#ffb951] text-[#3e2723]' : 'bg-[#21232b] text-[#8e9199]'
                }`}
              >
                {cacheEnabled ? 'CACHE ENABLED (1.2ms)' : 'CACHE BYPASSED (145ms)'}
              </button>
            </div>

            <button
              onClick={handleRunBenchmark}
              disabled={benchmarking}
              className="px-4 py-2 bg-[#5f3300]/40 hover:bg-[#5f3300]/70 text-[#ffb951] border border-[#ffb951]/40 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-2"
            >
              <i className="ri-flashlight-line"></i>
              <span>{benchmarking ? 'RUNNING LOAD BENCHMARK...' : 'EXECUTE LATENCY STRESS TEST'}</span>
            </button>

            {benchResults && (
              <div className="grid grid-cols-3 gap-3 bg-[#1a1b21] p-3 rounded-xl border border-[#ffb951]/30 text-center">
                <div>
                  <div className="text-[10px] text-[#8e9199]">AVG LATENCY</div>
                  <div className="text-base font-bold text-[#ffb951]">{benchResults.latencyMs} ms</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8e9199]">THROUGHPUT</div>
                  <div className="text-base font-bold text-[#a8e6cf]">{benchResults.throughputTps.toLocaleString()} TPS</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8e9199]">P99 TAIL LATENCY</div>
                  <div className="text-base font-bold text-[#a8c7fa]">{benchResults.p99Ms} ms</div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
