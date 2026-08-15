import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { GlobeGLComponent, City3D, Attack3D } from './GlobeGLComponent';
import { AiSecurityAssistant } from './AiSecurityAssistant';
import { SocAnalyticsDashboard } from './SocAnalyticsDashboard';
import {
  ALL_CYBER_ATTACK_TYPES,
  CYBER_ATTACK_COLOR_MAP,
  getAttackColor,
  hexToRgba,
} from '../utils/cyberAttackTypes';

interface AttackEvent extends Attack3D {
  timestamp: string;
  sourceCountry: string;
  sourceCode: string;
  targetCountry: string;
  targetCode: string;
  sourceIP: string;
  targetIP: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'HTTP/2' | 'DNS' | 'ICMP';
  cveId: string;
  payloadSnippet: string;
  mitigationStatus: string;
  mitigated?: boolean;
}

const CITIES: City3D[] = [
  { name: 'Jessore (1010/A PTI Rd, Sastitala)', country: 'Bangladesh', code: 'BD', lat: 23.1667, lng: 89.2167 },
  { name: 'San Francisco', country: 'United States', code: 'US', lat: 37.7749, lng: -122.4194 },
  { name: 'New York', country: 'United States', code: 'US', lat: 40.7128, lng: -74.0060 },
  { name: 'Toronto', country: 'Canada', code: 'CA', lat: 43.6532, lng: -79.3832 },
  { name: 'Mexico City', country: 'Mexico', code: 'MX', lat: 19.4326, lng: -99.1332 },
  { name: 'Sao Paulo', country: 'Brazil', code: 'BR', lat: -23.5505, lng: -46.6333 },
  { name: 'Buenos Aires', country: 'Argentina', code: 'AR', lat: -34.6037, lng: -58.3816 },
  { name: 'Reykjavik', country: 'Iceland', code: 'IS', lat: 64.1466, lng: -21.9426 },
  { name: 'London', country: 'United Kingdom', code: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', code: 'FR', lat: 48.8566, lng: 2.3522 },
  { name: 'Frankfurt', country: 'Germany', code: 'DE', lat: 50.1109, lng: 8.6821 },
  { name: 'Stockholm', country: 'Sweden', code: 'SE', lat: 59.3293, lng: 18.0686 },
  { name: 'Moscow', country: 'Russia', code: 'RU', lat: 55.7558, lng: 37.6173 },
  { name: 'Cairo', country: 'Egypt', code: 'EG', lat: 30.0444, lng: 31.2357 },
  { name: 'Dubai', country: 'UAE', code: 'AE', lat: 25.2048, lng: 55.2708 },
  { name: 'Johannesburg', country: 'South Africa', code: 'ZA', lat: -26.2041, lng: 28.0473 },
  { name: 'Mumbai', country: 'India', code: 'IN', lat: 19.0760, lng: 72.8777 },
  { name: 'Singapore', country: 'Singapore', code: 'SG', lat: 1.3521, lng: 103.8198 },
  { name: 'Hong Kong', country: 'Hong Kong', code: 'HK', lat: 22.3193, lng: 114.1694 },
  { name: 'Beijing', country: 'China', code: 'CN', lat: 39.9042, lng: 116.4074 },
  { name: 'Seoul', country: 'South Korea', code: 'KR', lat: 37.5665, lng: 126.9780 },
  { name: 'Tokyo', country: 'Japan', code: 'JP', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', country: 'Australia', code: 'AU', lat: -33.8688, lng: 151.2093 },
];

const PROTOCOLS: AttackEvent['protocol'][] = ['TCP', 'UDP', 'HTTP/2', 'DNS', 'ICMP'];
const PORTS = [443, 80, 22, 3389, 8080, 53, 445, 1433, 21];

const CVES = [
  'CVE-2024-6387 (RegreSSHion RCE)',
  'CVE-2023-4863 (WebP Heap Overflow)',
  'CVE-2024-21626 (runc Container Escape)',
  'CVE-2023-38606 (Triangulation Kernel Exploit)',
  'CVE-2024-30078 (Windows Driver RCE)',
  'CVE-2024-27198 (JetBrains Auth Bypass)',
];

const PAYLOADS = [
  'POST /api/v1/auth/session HTTP/2 "UNION SELECT 1,@@version--"',
  '0x414141414141414100803f2a... [Kernel RCE Overflow Payload]',
  'SYN Flood 240,000 pps -> port 443 (Botnet Cluster #14)',
  'GET /wp-login.php HTTP/1.1 (BruteForce 8,500 attempts/sec)',
  'PAYLOAD_EXEC: ransomware_drop_v4.exe -key AES256_RSA4096',
  'DNS QNAME: evil-c2-domain.xyz TXT [Tunneling Command]',
];

const CAMERA_PRESETS = [
  { label: 'GLOBAL', lat: 20, lng: 10 },
  { label: 'AMERICAS', lat: 25, lng: -90 },
  { label: 'EUROPE', lat: 50, lng: 15 },
  { label: 'ASIA', lat: 25, lng: 120 },
];

interface CyberAttackMapSectionProps {
  crtActive?: boolean;
  onToggleCrt?: () => void;
}

export const CyberAttackMapSection: React.FC<CyberAttackMapSectionProps> = ({
  crtActive = true,
  onToggleCrt,
}) => {
  const [attacks, setAttacks] = useState<AttackEvent[]>([]);
  const [liveLog, setLiveLog] = useState<AttackEvent[]>([]);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [attacksToday, setAttacksToday] = useState<number>(18492040);
  const [selectedAttack, setSelectedAttack] = useState<AttackEvent | null>(null);
  const [hoveredAttackId, setHoveredAttackId] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [mitigatedMap, setMitigatedMap] = useState<Record<string, boolean>>({});
  const [blockedIpMap, setBlockedIpMap] = useState<Record<string, boolean>>({});
  const [targetedMap, setTargetedMap] = useState<Record<string, boolean>>({});
  const [auditedMap, setAuditedMap] = useState<Record<string, boolean>>({});
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [focusLocation, setFocusLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activePreset, setActivePreset] = useState<string>('GLOBAL');
  const [rateMode, setRateMode] = useState<'TOTAL' | 'RATE' | 'VELOCITY'>('TOTAL');
  const [lastDelta, setLastDelta] = useState<number>(5);
  const [sparkline, setSparkline] = useState<number[]>([25, 38, 30, 48, 62, 55, 78, 65, 82, 75, 92, 88, 96, 100]);
  const [activeRadarTab, setActiveRadarTab] = useState<'radar' | 'analytics' | 'auditor'>('radar');
  const [auditorInitialCode, setAuditorInitialCode] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Helper to generate realistic random IP
  const randomIp = () =>
    `${Math.floor(Math.random() * 200) + 11}.${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255
    )}.${Math.floor(Math.random() * 254) + 1}`;

  // Generate attack event with custom type/severity override if requested
  const generateAttack = (overrideType?: string, overrideSev?: AttackEvent['severity']): AttackEvent => {
    let sourceIdx = Math.floor(Math.random() * CITIES.length);
    let targetIdx = Math.floor(Math.random() * CITIES.length);
    while (sourceIdx === targetIdx) {
      targetIdx = Math.floor(Math.random() * CITIES.length);
    }

    const source = CITIES[sourceIdx];
    const target = CITIES[targetIdx];
    const type = overrideType || ALL_CYBER_ATTACK_TYPES[Math.floor(Math.random() * ALL_CYBER_ATTACK_TYPES.length)];
    
    const highRisk = [
      'Ransomware',
      'Zero-Day Exploit',
      'Supply Chain Attack',
      'Buffer Overflow',
      'Malware / Trojan',
      'Insider Threat / Exfiltration',
    ];
    
    const severity: AttackEvent['severity'] = overrideSev || (highRisk.includes(type)
      ? 'CRITICAL'
      : Math.random() > 0.45
      ? 'HIGH'
      : 'MEDIUM');

    return {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      sourceCity: source.name,
      sourceCountry: source.country,
      sourceCode: source.code,
      sourceLat: source.lat,
      sourceLng: source.lng,
      sourceIP: randomIp(),
      targetCity: target.name,
      targetCountry: target.country,
      targetCode: target.code,
      targetLat: target.lat,
      targetLng: target.lng,
      targetIP: `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 200)}`,
      type,
      port: PORTS[Math.floor(Math.random() * PORTS.length)],
      severity,
      protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
      cveId: CVES[Math.floor(Math.random() * CVES.length)],
      payloadSnippet: PAYLOADS[Math.floor(Math.random() * PAYLOADS.length)],
      mitigationStatus: 'DROPPED BY eBPF KERNEL FILTER',
    };
  };

  // Seed initial discrete attack impulses
  useEffect(() => {
    const initialAttacks = Array.from({ length: 7 }, () => generateAttack());
    setAttacks(initialAttacks);
    setLiveLog(initialAttacks);
  }, []);

  // Discrete real-time attack pulse feed
  useEffect(() => {
    if (!isLive) return;

    const intervalTime = Math.max(400, 1400 / speedMultiplier);
    const interval = setInterval(() => {
      const newAttack = generateAttack();
      const delta = Math.floor(Math.random() * 9) + 1;
      setAttacks((prev) => [newAttack, ...prev.slice(0, 7)]);
      setLiveLog((prev) => [newAttack, ...prev.slice(0, 39)]);
      setAttacksToday((prev) => prev + delta);
      setLastDelta(delta);
      setSparkline((prev) => [
        ...prev.slice(1),
        Math.min(100, Math.max(15, (prev[prev.length - 1] || 50) + (Math.random() > 0.45 ? delta * 3.5 : -delta * 2.5))),
      ]);

      if (audioFeedback && Math.random() > 0.7) {
        soundEngine.play('terminal_key');
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isLive, speedMultiplier, audioFeedback]);

  const clearLogs = () => {
    setIsDeleting(true);
    setLiveLog([]);
    soundEngine.play('click');
    showToast('🧹 SOC INCIDENT STREAM FLUSHED');
    setTimeout(() => setIsDeleting(false), 1000);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyPayload = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    soundEngine.play('click');
  };

  const handleToggleTarget = (id: string, lat: number, lng: number) => {
    setFocusLocation({ lat, lng });
    setTargetedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    soundEngine.play('click');
  };

  const handleToggleAudit = (atk: AttackEvent) => {
    setAuditorInitialCode(`// THREAT RADAR INCIDENT AUDIT [ID: ${atk.id}]
// VECTOR: ${atk.type} | CVE: ${atk.cveId}
// PROTOCOL: ${atk.protocol} | PORT: ${atk.port}
// ATTACK ORIGIN: ${atk.sourceCity} (${atk.sourceIP}) -> TARGET: ${atk.targetCity} (${atk.targetIP})

/* INCIDENT PAYLOAD SNIPPET */
${atk.payloadSnippet}`);
    setActiveRadarTab('auditor');
    setAuditedMap((prev) => ({ ...prev, [atk.id]: !prev[atk.id] }));
    soundEngine.play('click');
  };

  const handleToggleMitigation = (id: string) => {
    setMitigatedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    soundEngine.play('click');
  };

  const handleToggleBlockIp = (ip: string) => {
    setBlockedIpMap((prev) => ({ ...prev, [ip]: !prev[ip] }));
    soundEngine.play('click');
  };

  const handleExportLog = () => {
    setIsExporting(true);
    const logData = JSON.stringify(liveLog, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOC_Threat_Log_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    soundEngine.play('click');
    showToast('📥 SOC INCIDENT LOG EXPORTED TO JSON');
    setTimeout(() => setIsExporting(false), 1200);
  };

  const filteredLogs = liveLog.filter((item) => {
    const matchSev = filterSeverity === 'ALL' || item.severity === filterSeverity;
    const matchType = filterType === 'ALL' || item.type === filterType;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      item.id.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.sourceCity.toLowerCase().includes(q) ||
      item.targetCity.toLowerCase().includes(q) ||
      item.sourceCode.toLowerCase().includes(q) ||
      item.targetCode.toLowerCase().includes(q) ||
      item.sourceIP.toLowerCase().includes(q) ||
      item.cveId.toLowerCase().includes(q) ||
      item.payloadSnippet.toLowerCase().includes(q);
    return matchSev && matchType && matchSearch;
  });

  // Dynamic calculation for Top Target Country from live telemetry stream
  const targetCounts = liveLog.reduce((acc, curr) => {
    acc[curr.targetCountry] = (acc[curr.targetCountry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topTargetPair = Object.entries(targetCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0] || ['United States', 1];
  const topTargetName = topTargetPair[0] as string;
  const topTargetCityObj = CITIES.find((c) => c.country === topTargetName) || CITIES[0];
  const topTargetCode = topTargetCityObj.code;
  const topTargetShare = liveLog.length > 0 ? (((topTargetPair[1] as number) / liveLog.length) * 100).toFixed(1) : '28.4';

  // Dynamic calculation for Top Origin Country from live telemetry stream
  const sourceCounts = liveLog.reduce((acc, curr) => {
    acc[curr.sourceCountry] = (acc[curr.sourceCountry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topSourcePair = Object.entries(sourceCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0] || ['Russia', 1];
  const topSourceName = topSourcePair[0] as string;
  const topSourceCityObj = CITIES.find((c) => c.country === topSourceName) || CITIES[11];
  const topSourceCode = topSourceCityObj.code;
  const topSourceShare = liveLog.length > 0 ? (((topSourcePair[1] as number) / liveLog.length) * 100).toFixed(1) : '31.2';

  // Dynamic calculation for Top Attack Vector from live telemetry stream
  const vectorCounts = liveLog.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topVectorPair = Object.entries(vectorCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0] || ['Ransomware', 1];
  const topVectorName = topVectorPair[0] as string;
  const topVectorColor = getAttackColor(topVectorName, 'CRITICAL');
  const topVectorShare = liveLog.length > 0 ? (((topVectorPair[1] as number) / liveLog.length) * 100).toFixed(1) : '35.0';

  const activeHoveredCityData = CITIES.find((c) => c.name === hoveredCity);

  return (
    <section id="threat-map" className="pt-[15px] px-[15px] pb-0 border-b-0 bg-[#0f0e13] relative scroll-mt-28 text-white font-mono">
      <div className="max-w-7xl mx-auto px-0 space-y-6">
        {/* SECTION HEADER & SOC CONTROLS */}
        <div className="border-b border-[#44474f]/30 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#a8c7fa] uppercase tracking-widest pb-1">
              <span className="w-2 h-2 rounded-full bg-[#a8c7fa] animate-pulse"></span>
              <span>SOC-TE/AAE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              Global Threat Ops
            </h2>
          </div>

          <div className="w-full md:w-auto flex items-center">
            {/* Unified Slider Capsule with View Switchers, Delete (Clear) & Export Actions */}
            <div className="w-full md:w-auto h-[31.5px] flex items-center justify-between space-x-1.5 bg-[#21232b] px-1.5 rounded-full border-0 shadow-md">
              <button
                onClick={() => {
                  setActiveRadarTab('radar');
                  soundEngine.play('click');
                }}
                className={`flex-1 md:flex-initial md:w-[21.5px] h-[21.5px] px-2 md:px-0 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                  activeRadarTab === 'radar'
                    ? 'bg-[#a8c7fa] text-[#042e60] shadow'
                    : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
                }`}
                title="3D Radar & Live Stream"
              >
                <i className="ri-radar-line text-xs"></i>
              </button>
              <button
                onClick={() => {
                  setActiveRadarTab('analytics');
                  soundEngine.play('click');
                }}
                className={`flex-1 md:flex-initial md:w-[21.5px] h-[21.5px] px-2 md:px-0 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                  activeRadarTab === 'analytics'
                    ? 'bg-[#a8c7fa] text-[#042e60] shadow'
                    : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
                }`}
                title="SOC Threat Analytics"
              >
                <i className="ri-pie-chart-2-line text-xs"></i>
              </button>
              <button
                onClick={() => {
                  setActiveRadarTab('auditor');
                  soundEngine.play('click');
                }}
                className={`flex-1 md:flex-initial md:w-[21.5px] h-[21.5px] px-2 md:px-0 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                  activeRadarTab === 'auditor'
                    ? 'bg-[#a8c7fa] text-[#042e60] shadow'
                    : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
                }`}
                title="AI Vulnerability Auditor"
              >
                <i className="ri-shield-keyhole-line text-xs"></i>
              </button>

              <span className="w-[1px] h-3.5 bg-[#44474f]/50 mx-1 shrink-0"></span>

              {/* Clear (Delete) Log Action inside Slider */}
              <button
                onClick={clearLogs}
                className={`flex-1 md:flex-initial md:w-[21.5px] h-[21.5px] px-2 md:px-0 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 active:scale-95 ${
                  isDeleting
                    ? 'bg-[#ffb4ab] text-[#690005]'
                    : 'bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#ffb4ab] active:text-[#690005]'
                }`}
                title="Clear Incident Feed Log"
              >
                <i className="ri-delete-bin-5-line text-xs"></i>
              </button>

              {/* Export Log Action inside Slider */}
              <button
                onClick={handleExportLog}
                className={`flex-1 md:flex-initial md:w-[21.5px] h-[21.5px] px-2 md:px-0 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 active:scale-95 ${
                  isExporting
                    ? 'bg-[#a8e6cf] text-[#003923]'
                    : 'bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#a8e6cf] active:text-[#003923]'
                }`}
                title="Export Live Incident Stream as JSON"
              >
                <i className={`${isExporting ? 'ri-file-check-line text-[#003923]' : 'ri-survey-line'} text-xs`}></i>
              </button>
            </div>
          </div>
        </div>

        {activeRadarTab === 'auditor' ? (
          <div className="animate-fadeIn pt-2">
            <AiSecurityAssistant initialCode={auditorInitialCode} />
          </div>
        ) : activeRadarTab === 'analytics' ? (
          <div className="animate-fadeIn pt-2">
            <SocAnalyticsDashboard
              attacks={attacks}
              attacksToday={attacksToday}
              mitigatedMap={mitigatedMap}
              blockedIpMap={blockedIpMap}
              onTriggerSimulatedAttack={(type, severity) => {
                const newAtt = generateAttack(type, severity);
                setAttacks((prev) => [newAtt, ...prev.slice(0, 49)]);
                setLiveLog((prev) => [newAtt, ...prev.slice(0, 99)]);
              }}
              onClearLogs={clearLogs}
            />
          </div>
        ) : (
          <>
            {/* TOP METRICS TICKER - DYNAMIC & HIGHLY POLISHED DIRECTLY ON BG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono pt-2">
          {/* CARD 1: ATTACKS TODAY & LIVE VELOCITY */}
          <div className="flex flex-col justify-between space-y-3 relative group transition-all">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-[#c4c6d0] uppercase tracking-wider flex items-center space-x-1.5 font-semibold">
                <i className="ri-shield-flash-line text-[#ffb4ab] text-xs"></i>
                <span>ATTACKS TODAY</span>
              </div>
              <div className="flex items-center space-x-1">
                {(['TOTAL', 'RATE', 'VELOCITY'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setRateMode(m);
                      soundEngine.play('click');
                    }}
                    className={`px-2 py-0.5 rounded-full text-[8px] font-bold transition-all cursor-pointer border-0 ${
                      rateMode === m
                        ? 'bg-[#ffb4ab] text-[#690005]'
                        : 'bg-transparent text-[#8e9199] hover:text-[#c4c6d0] hover:bg-[#21232b]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
                <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-[#ffb4ab] text-[#690005] border-0">
                  +{lastDelta}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#ffb4ab] tracking-tight">
                  {rateMode === 'TOTAL'
                    ? attacksToday.toLocaleString()
                    : rateMode === 'RATE'
                    ? '~3,420/min'
                    : '+28.4% SURGE'}
                </span>
              </div>

              {/* Mini Sparkline Bar Chart */}
              <div className="flex items-end space-x-1 h-6 pt-1">
                {sparkline.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-[#21232b] group-hover:bg-[#60000e]/40 rounded-t transition-all duration-300 relative"
                    style={{ height: `${Math.max(15, val)}%` }}
                  >
                    <div
                      className="w-full bg-[#ffb4ab]/80 rounded-t"
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-[#8e9199] flex items-center justify-between border-t border-[#44474f]/30 pt-2">
              <span>Avg +1,850/min global rate</span>
              <span className="text-[#ffb4ab] font-bold text-[9px] flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping"></span>
                <span>LIVE FEED</span>
              </span>
            </div>
          </div>

          {/* CARD 2: TOP TARGET COUNTRY */}
          <div className="flex flex-col justify-between space-y-3 relative group transition-all">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-[#c4c6d0] uppercase tracking-wider flex items-center space-x-1.5 font-semibold">
                <i className="ri-earth-line text-[#a8c7fa] text-xs"></i>
                <span>TOP TARGET COUNTRY</span>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#a8c7fa] text-[#001d35] border-0">
                {topTargetCode}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-base sm:text-lg font-bold text-white truncate flex items-center space-x-2 min-w-0">
                  <i className="ri-building-4-line text-[#a8c7fa] text-lg shrink-0"></i>
                  <span className="truncate">{topTargetName.toUpperCase()}</span>
                </div>
                <button
                  onClick={() => {
                    setFocusLocation({ lat: topTargetCityObj.lat, lng: topTargetCityObj.lng });
                    soundEngine.play('click');
                    showToast(`FLYING TO TARGET CAMERA: ${topTargetName.toUpperCase()}`);
                  }}
                  className="text-[#a8c7fa] hover:text-white transition-all cursor-pointer shrink-0 p-0.5"
                  title="Fly Camera to Target"
                  aria-label="Fly camera to target"
                >
                  <i className="ri-crosshair-2-line text-lg"></i>
                </button>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-[#8e9199] font-medium">
                  <span>Target Share</span>
                  <span className="text-[#a8c7fa]">{topTargetShare}%</span>
                </div>
                <div className="w-full bg-[#0f0e13] rounded-full h-1.5 border border-[#44474f]/30 overflow-hidden">
                  <div
                    className="bg-[#a8c7fa] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(15, parseFloat(topTargetShare) * 2.5))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: TOP ORIGIN COUNTRY */}
          <div className="flex flex-col justify-between space-y-3 relative group transition-all">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-[#c4c6d0] uppercase tracking-wider flex items-center space-x-1.5 font-semibold">
                <i className="ri-map-pin-user-line text-[#a8c7fa] text-xs"></i>
                <span>TOP ORIGIN COUNTRY</span>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#a8c7fa] text-[#001d35] border-0">
                {topSourceCode}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-base sm:text-lg font-bold text-white truncate flex items-center space-x-2 min-w-0">
                  <i className="ri-global-line text-[#a8c7fa] text-lg shrink-0"></i>
                  <span className="truncate">{topSourceName.toUpperCase()}</span>
                </div>
                <button
                  onClick={() => {
                    setFocusLocation({ lat: topSourceCityObj.lat, lng: topSourceCityObj.lng });
                    soundEngine.play('click');
                    showToast(`FLYING TO ORIGIN C2 CAMERA: ${topSourceName.toUpperCase()}`);
                  }}
                  className="text-[#a8c7fa] hover:text-white transition-all cursor-pointer shrink-0 p-0.5"
                  title="Fly Camera to Origin"
                  aria-label="Fly camera to origin"
                >
                  <i className="ri-crosshair-2-line text-lg"></i>
                </button>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-[#8e9199] font-medium">
                  <span>Botnet Share</span>
                  <span className="text-[#a8c7fa]">{topSourceShare}%</span>
                </div>
                <div className="w-full bg-[#0f0e13] rounded-full h-1.5 border border-[#44474f]/30 overflow-hidden">
                  <div
                    className="bg-[#a8c7fa] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(15, parseFloat(topSourceShare) * 2.5))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: TOP ATTACK VECTOR */}
          <div className="flex flex-col justify-between space-y-3 relative group transition-all">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-[#c4c6d0] uppercase tracking-wider flex items-center space-x-1.5 font-semibold">
                <i className="ri-bug-line text-[#ffb870] text-xs"></i>
                <span>TOP ATTACK VECTOR</span>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#4a2800]/30 text-[#ffb870] border border-[#ffb870]/30">
                {topVectorShare}% SHARE
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-sm sm:text-base font-bold truncate text-[#ffb870]">
                {topVectorName.toUpperCase()}
              </div>

              <div className="text-[10px] text-[#8e9199] flex items-center space-x-1">
                <span>Port Target:</span>
                <span className="text-[#ffb870] font-bold">443 / 22 / 3389</span>
              </div>
            </div>

            <button
              onClick={() => {
                setFilterType(filterType === topVectorName ? 'ALL' : topVectorName);
                soundEngine.play('click');
                showToast(`FILTERING STREAM: ${topVectorName.toUpperCase()}`);
              }}
              className="w-full py-1.5 rounded-full bg-[#21232b] hover:bg-[#2b2d36] text-[#ffb870] border border-[#44474f]/40 text-[10px] font-semibold transition-all cursor-pointer flex items-center justify-center space-x-1"
            >
              <i className="ri-filter-3-line text-[#ffb870]"></i>
              <span>{filterType === topVectorName ? 'RESET VECTOR FILTER' : 'FILTER THIS VECTOR'}</span>
            </button>
          </div>
        </div>

        {/* MAIN MAP CANVAS & FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Interactive 3D Globe Canvas (7 Cols) */}
          <div className="lg:col-span-7 space-y-3 relative flex flex-col justify-start">
            {/* Top Bar inside Map Canvas */}
            <div className="flex items-center justify-between z-10 flex-wrap gap-2 border-b border-[#44474f]/30 pb-3 shrink-0">
              <div className="flex items-center space-x-2 text-xs font-mono text-white font-bold">
                <i className="ri-radar-fill text-rose-500 text-base"></i>
                <span>THREAT RADAR STAGE</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-[#a8c7fa]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>GEO-LOC STREAM ACTIVE</span>
              </div>
            </div>

            {/* 3D GLOBE.GL NIGHT RADAR STAGE CONTAINER (SQUARE, NO BORDER) */}
            <div className={`relative w-full aspect-square bg-[#0f0e13] rounded-2xl overflow-hidden group shadow-inner ${crtActive ? 'animate-crt-flicker' : ''}`}>
              <GlobeGLComponent
                cities={CITIES}
                attacks={attacks}
                autoRotate={autoRotate}
                selectedAttackId={selectedAttack?.id}
                hoveredAttackId={hoveredAttackId}
                hoveredCity={hoveredCity}
                onHoverCity={setHoveredCity}
                focusLocation={focusLocation}
              />

              {/* Telemetry Readout Box on Globe (Top Left) */}
              {activeHoveredCityData && (
                <div className="absolute top-3 left-3 z-20 bg-[#1a1b21]/95 backdrop-blur-md border border-[#a8c7fa]/40 p-2.5 rounded-xl text-[10px] font-mono text-[#a8c7fa] space-y-0.5 shadow-lg animate-fadeIn">
                  <div className="font-bold flex items-center space-x-1">
                    <i className="ri-map-pin-2-fill text-[#ffb4ab]"></i>
                    <span>{activeHoveredCityData.name} [{activeHoveredCityData.code}]</span>
                  </div>
                  <div className="text-[#8e9199]">
                    LAT: {activeHoveredCityData.lat.toFixed(4)}° | LNG: {activeHoveredCityData.lng.toFixed(4)}°
                  </div>
                </div>
              )}

              {/* 3D Camera Region Focus Hotspots & CRT/Globe Move Controls inside Unified Slider Capsule at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center space-x-1 bg-[#1a1b21]/95 backdrop-blur-md p-1 border-t border-[#44474f]/50 text-[9px] sm:text-[10px] font-mono justify-between h-[31.5px] shadow-lg">
                {CAMERA_PRESETS.map((preset) => {
                  const isSelected = activePreset === preset.label;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setActivePreset(preset.label);
                        setFocusLocation({ lat: preset.lat, lng: preset.lng });
                        soundEngine.play('click');
                      }}
                      className={`flex-1 px-2 sm:px-2.5 h-[21.5px] flex items-center justify-center rounded-full transition-all cursor-pointer font-bold border-0 text-center ${
                        isSelected
                          ? 'bg-[#a8c7fa] text-[#001d35]'
                          : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}

                <span className="w-[1px] h-4 bg-[#44474f]/50 mx-0.5 shrink-0"></span>

                {/* Globe Move / Spin Action */}
                <button
                  onClick={() => {
                    setAutoRotate(!autoRotate);
                    soundEngine.play('click');
                  }}
                  className={`px-2.5 h-[21.5px] rounded-full transition-all cursor-pointer font-bold border-0 flex items-center justify-center space-x-1 text-center shrink-0 ${
                    autoRotate
                      ? 'bg-[#a8c7fa] text-[#001d35]'
                      : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
                  }`}
                  title={autoRotate ? 'Disable 3D Globe Auto-Rotation' : 'Enable 3D Globe Auto-Rotation'}
                >
                  <i className={`${autoRotate ? 'ri-global-line' : 'ri-global-off-line'} text-xs`}></i>
                </button>

                {/* CRT Shader Action */}
                {onToggleCrt && (
                  <button
                    onClick={() => {
                      onToggleCrt();
                      soundEngine.play('click');
                    }}
                    className={`px-2.5 h-[21.5px] rounded-full transition-all cursor-pointer font-bold border-0 flex items-center justify-center space-x-1 text-center shrink-0 ${
                      crtActive
                        ? 'bg-[#a8c7fa] text-[#001d35]'
                        : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
                    }`}
                    title={crtActive ? 'Turn Off CRT Shader Effect' : 'Turn On CRT Shader Effect'}
                  >
                    <i className={`${crtActive ? 'ri-mosaic-line' : 'ri-painting-line'} text-xs`}></i>
                  </button>
                )}
              </div>

              {/* CRT Scanline & Vignette Shader Layer localized exclusively to the 3D Globe */}
              {crtActive && (
                <div className="absolute inset-0 z-10 pointer-events-none scanlines crt-vignette opacity-80 rounded-lg" />
              )}
            </div>
          </div>

          {/* Live Incident Stream Feed Table (5 Cols) - directly on BG */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-between min-h-[480px] sm:min-h-[520px] lg:min-h-[550px] px-0">
            {/* Header */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-white font-bold">
                  <i className="ri-pulse-line text-[#ffb4ab] text-sm"></i>
                  <span>LIVE INCIDENT STREAM</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#21232b] text-[#c4c6d0] border border-[#44474f]/40 font-medium">
                  {filteredLogs.length} EVENTS
                </span>
              </div>

              {/* Live Stream & Speed Controls + Search Bar Side by Side (40% slider, 60% searchbar) */}
              <div className="flex flex-row items-center gap-2 w-full">
                {/* Slider Capsule (40% width with auto-adjusted buttons) */}
                <div className="w-[40%] min-w-0 flex items-center justify-between space-x-1 bg-[#21232b] p-1 rounded-full border-0 text-[10px] font-mono h-[31.5px] shrink-0 shadow-none">
                  {/* Live Stream Play / Pause Toggle Button (Icon only) */}
                  <button
                    onClick={() => {
                      setIsLive(!isLive);
                      soundEngine.play('click');
                    }}
                    className={`px-2 sm:px-2.5 h-[21.5px] rounded-full text-[9px] font-bold transition-all cursor-pointer flex items-center justify-center border-0 shrink-0 ${
                      isLive
                        ? 'bg-[#ffb4ab] text-[#690005]'
                        : 'bg-[#21232b] text-[#8e9199] hover:text-white'
                    }`}
                    title={isLive ? 'Pause Stream' : 'Resume Live Stream (Play)'}
                  >
                    <i className={isLive ? 'ri-pause-circle-line text-xs' : 'ri-play-circle-line text-xs'}></i>
                  </button>

                  <span className="w-[1px] h-3.5 bg-[#44474f]/50 mx-0.5 shrink-0"></span>

                  {/* Speed Selector (1x, 2x, 4x) */}
                  <div className="flex items-center space-x-1 flex-1 min-w-0 justify-between">
                    {[1, 2, 4].map((spd) => {
                      const isSelected = speedMultiplier === spd;
                      return (
                        <button
                          key={spd}
                          onClick={() => {
                            setSpeedMultiplier(spd);
                            soundEngine.play('click');
                          }}
                          className={`flex-1 min-w-0 px-1 sm:px-1.5 h-[21.5px] rounded-full text-[9px] font-bold transition-all text-center cursor-pointer border-0 flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#a8c7fa] text-[#001d35]'
                              : 'text-[#8e9199] hover:text-white hover:bg-[#21232b]'
                          }`}
                        >
                          {spd}x
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter Search Field (60% width, no border, bg #21232b, no placeholder suggestion text, ri-menu-search-line on right) */}
                <div className="relative w-[60%] min-w-0 flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder=""
                    className="w-full h-[31.5px] bg-[#21232b] border-0 text-white pl-3.5 pr-8 rounded-full text-[11px] font-mono focus:outline-none focus:ring-0"
                  />
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8e9199] hover:text-white"
                      title="Clear search"
                    >
                      <i className="ri-close-circle-fill text-xs"></i>
                    </button>
                  ) : (
                    <i className="ri-menu-search-line absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9199] text-xs pointer-events-none"></i>
                  )}
                </div>
              </div>

              {/* Severity Filter Tabs */}
              <div className="flex items-center flex-wrap gap-1 bg-[#0f0e13] p-1 rounded-full border border-[#44474f]/40">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => {
                      setFilterSeverity(sev);
                      soundEngine.play('click');
                    }}
                    className={`flex-1 min-w-[50px] py-1 text-[9px] sm:text-[10px] font-mono font-bold rounded-full transition-colors cursor-pointer text-center ${
                      filterSeverity === sev
                        ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
                        : 'text-[#c4c6d0] hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              {/* Vector Filter Chip (if active) */}
              {filterType !== 'ALL' && (
                <div className="flex items-center justify-between bg-[#004a77]/30 border border-[#a8c7fa]/40 px-3 py-1 rounded-full text-[10px] font-mono text-[#a8c7fa]">
                  <span>VECTOR FILTER: <strong>{filterType}</strong></span>
                  <button
                    onClick={() => setFilterType('ALL')}
                    className="text-[#c4c6d0] hover:text-white cursor-pointer ml-2"
                  >
                    <i className="ri-close-line font-bold"></i>
                  </button>
                </div>
              )}
            </div>

            {/* Incident List */}
            <div className="flex-1 max-h-[380px] overflow-y-auto space-y-2 pr-1 font-jetbrains scrollbar-thin">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono text-xs space-y-2">
                  <i className="ri-radar-line text-2xl text-slate-600"></i>
                  <p>NO INCIDENT MATCHES CURRENT FILTERS</p>
                </div>
              ) : (
                filteredLogs.map((atk) => {
                  const isSelected = selectedAttack?.id === atk.id;
                  const isMitigated = !!mitigatedMap[atk.id];
                  const isBlocked = !!blockedIpMap[atk.sourceIP];
                  const isTargeted = !!targetedMap[atk.id];
                  const isAudited = !!auditedMap[atk.id];
                  const isCopied = !!copiedMap[atk.id];
                  const atkColor = getAttackColor(atk.type, atk.severity);

                  return (
                    <div
                      key={atk.id}
                      onClick={() => {
                        if (selectedAttack?.id === atk.id) {
                          setSelectedAttack(null);
                          setIsLive(true);
                        } else {
                          setSelectedAttack(atk);
                          setIsLive(false);
                        }
                        soundEngine.play('click');
                      }}
                      onMouseEnter={() => setHoveredAttackId(atk.id)}
                      onMouseLeave={() => setHoveredAttackId(null)}
                      className={`p-2.5 rounded-xl text-xs font-mono space-y-1.5 cursor-pointer transition-all border-0 ${
                        isSelected || hoveredAttackId === atk.id
                          ? 'bg-[#21232b]'
                          : 'bg-transparent hover:bg-[#1a1b21]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#8e9199]">[{atk.id}] {atk.timestamp}</span>
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`inline-block w-[64px] text-center text-[9px] font-bold py-0.5 rounded-full border-0 ${
                              isMitigated || isBlocked
                                ? 'bg-[#a8e6cf] text-[#003822]'
                                : atk.severity === 'CRITICAL'
                                ? 'bg-[#ffb4ab] text-[#690005]'
                                : atk.severity === 'HIGH'
                                ? 'bg-[#fdd663] text-[#422c00]'
                                : 'bg-[#d0bcff] text-[#381e72]'
                            }`}
                          >
                            {isBlocked ? 'BLOCKED' : isMitigated ? 'RESOLVED' : atk.severity}
                          </span>
                          <i className={`ri-arrow-down-s-line text-[#8e9199] transition-transform ${isSelected ? 'rotate-180 text-[#a8c7fa]' : ''}`}></i>
                        </div>
                      </div>

                      <div className="font-bold text-white flex items-center justify-between flex-wrap gap-1">
                        <span className="flex items-center space-x-1.5">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                            style={{
                              color: atkColor,
                              borderColor: hexToRgba(atkColor, 0.4),
                              backgroundColor: hexToRgba(atkColor, 0.12),
                            }}
                          >
                            {atk.type}
                          </span>
                        </span>
                        <span className="text-[10px] font-mono text-[#c4c6d0] font-normal">
                          <code style={{ color: atkColor }} className="font-bold">{atk.port}</code> ({atk.protocol})
                        </span>
                      </div>

                      <div className="text-[11px] text-[#c4c6d0] truncate flex items-center space-x-1">
                        <span className="text-[#a8c7fa] font-semibold">{atk.sourceCity} [{atk.sourceCode}]</span>
                        <i className="ri-arrow-right-line text-[10px] text-[#8e9199]"></i>
                        <span className="text-[#a8e6cf] font-semibold">{atk.targetCity} [{atk.targetCode}]</span>
                      </div>

                      {/* Inline Dropdown Details */}
                      {isSelected && (
                        <div
                          className="pt-2 mt-2 border-t border-[#44474f]/40 space-y-2 text-[10px] font-mono animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="grid grid-cols-1 gap-1 text-[#c4c6d0]">
                            <div>
                              <span className="text-[#8e9199]">SOURCE IP:</span>{' '}
                              <span className="text-[#ffb4ab] font-bold">{atk.sourceIP}</span>
                            </div>
                            <div>
                              <span className="text-[#8e9199]">PORT:</span>{' '}
                              <span className="text-white font-semibold">{atk.port} ({atk.protocol})</span>
                            </div>
                            <div>
                              <span className="text-[#8e9199]">CVE:</span>{' '}
                              <span className="text-[#fdd663] font-bold">{atk.cveId}</span>
                            </div>
                            <div className="truncate flex items-center justify-between">
                              <span>
                                <span className="text-[#8e9199]">STATUS:</span>{' '}
                                <span className={isMitigated || isBlocked ? 'text-[#a8e6cf] font-bold' : 'text-[#a8c7fa] font-semibold'}>
                                  {isBlocked ? 'IP BLOCKED BY FIREWALL' : isMitigated ? 'MITIGATED [ENFORCED]' : atk.mitigationStatus}
                                </span>
                              </span>
                            </div>

                            {/* Payload Item right after STATUS */}
                            <div className="pt-1 flex items-center gap-1.5 min-w-0 overflow-hidden text-[10px]">
                              <span className="text-[#8e9199] font-mono shrink-0">PAYLOAD:</span>
                              <span className="text-[#ffb4ab] font-mono truncate select-all">{atk.payloadSnippet}</span>
                            </div>
                          </div>

                          {/* 5-Button Slider Capsule (bg pure dark #0f0e13, no border, button selection color #a8c7fa) */}
                          <div className="mt-2 flex items-center space-x-1 bg-[#0f0e13] p-1 rounded-full border-0 text-[10px] font-mono h-[31.5px] w-full justify-between shadow-none">
                            {/* 1. Block Source IP Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleBlockIp(atk.sourceIP);
                              }}
                              className={`flex-1 h-[21.5px] rounded-full flex items-center justify-center cursor-pointer transition-all border-0 shadow-none ${
                                isBlocked
                                  ? 'bg-[#ffb4ab] text-[#690005]'
                                  : 'text-[#8e9199] hover:bg-[#a8c7fa] hover:text-[#001d35]'
                              }`}
                              title={isBlocked ? `Unblock Source IP (${atk.sourceIP})` : `Block Source IP (${atk.sourceIP})`}
                            >
                              <i className={isBlocked ? 'ri-spam-line text-xs font-bold' : 'ri-spam-3-line text-xs font-bold'}></i>
                            </button>

                            {/* 2. Fly to Source / Target Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTarget(atk.id, atk.sourceLat, atk.sourceLng);
                              }}
                              className={`flex-1 h-[21.5px] rounded-full flex items-center justify-center cursor-pointer transition-all border-0 shadow-none ${
                                isTargeted
                                  ? 'bg-[#ffb4ab] text-[#690005]'
                                  : 'text-[#8e9199] hover:bg-[#a8c7fa] hover:text-[#001d35]'
                              }`}
                              title={isTargeted ? `Reset Focus (${atk.sourceCity})` : `Fly to Source (${atk.sourceCity})`}
                            >
                              <i className={isTargeted ? 'ri-focus-2-line text-xs font-bold' : 'ri-crosshair-2-line text-xs font-bold'}></i>
                            </button>

                            {/* 3. Mitigate Threat Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleMitigation(atk.id);
                              }}
                              className={`flex-1 h-[21.5px] rounded-full flex items-center justify-center cursor-pointer transition-all border-0 shadow-none ${
                                isMitigated
                                  ? 'bg-[#fdd663] text-[#3b2d00]'
                                  : 'text-[#8e9199] hover:bg-[#a8c7fa] hover:text-[#001d35]'
                              }`}
                              title={isMitigated ? 'Re-open Threat' : 'Mitigate Threat'}
                            >
                              <i className={isMitigated ? 'ri-git-repository-commits-line text-xs font-bold' : 'ri-git-repository-private-line text-xs font-bold'}></i>
                            </button>

                            {/* 4. AI Audit Code Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleAudit(atk);
                              }}
                              className={`flex-1 h-[21.5px] rounded-full flex items-center justify-center cursor-pointer transition-all border-0 shadow-none ${
                                isAudited
                                  ? 'bg-[#d0bcff] text-[#381e72]'
                                  : 'text-[#8e9199] hover:bg-[#a8c7fa] hover:text-[#001d35]'
                              }`}
                              title={isAudited ? 'Audit Active' : 'AI Audit Code'}
                            >
                              <i className={isAudited ? 'ri-brain-line text-xs font-bold' : 'ri-robot-2-line text-xs font-bold'}></i>
                            </button>

                            {/* 5. Payload Copy Button after AI Auditor */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPayload(atk.payloadSnippet, atk.id);
                              }}
                              className={`flex-1 h-[21.5px] rounded-full flex items-center justify-center cursor-pointer transition-all border-0 shadow-none ${
                                isCopied
                                  ? 'bg-[#a8e6cf] text-[#003822]'
                                  : 'text-[#8e9199] hover:bg-[#a8c7fa] hover:text-[#001d35]'
                              }`}
                              title={isCopied ? 'Copied (Click to reset)' : 'Copy Payload'}
                            >
                              <i className={isCopied ? 'ri-survey-line text-xs font-bold' : 'ri-file-copy-line text-xs font-bold'}></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </>
    )}
  </div>

      {/* Global SOC Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1b21] text-white border border-[#a8c7fa]/50 font-mono text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-bounce">
          <i className="ri-checkbox-circle-fill text-lg text-[#a8e6cf]"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};
