import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { GlobeGLComponent, City3D, Attack3D } from './GlobeGLComponent';
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
 { name: 'Dhaka', country: 'Bangladesh', code: 'BD', lat: 23.8103, lng: 90.4125 },
 { name: 'San Francisco', country: 'America', code: 'US', lat: 37.7749, lng: -122.4194 },
 { name: 'New York', country: 'America', code: 'US', lat: 40.7128, lng: -74.0060 },
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
 'POST /api/v1/auth/session HTTP/2"UNION SELECT 1,@@version--"',
 '0x414141414141414100803f2a... [Kernel RCE Overflow Payload]',
 'SYN Flood 240,000 pps -> port 443 (Botnet Cluster #14)',
 'GET /wp-login.php HTTP/1.1 (BruteForce 8,500 attempts/sec)',
 'Ransomware_drop_v4.exe -key AES256_RSA4096',
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

// Attack Type Short Badges Mapping
const ATTACK_TYPE_SHORT_LABELS: Record<string, string> = {
 'DDoS (Distributed Denial of Service)': 'DDoS',
 'DDoS': 'DDoS',
 'SQL Injection (SQLi)': 'SQLi',
 'SQL Injection': 'SQLi',
 'SQLi': 'SQLi',
 'Ransomware': 'R-Ware',
 'R-Ware': 'R-Ware',
 'Zero-Day Exploit': 'ZDE',
 'ZDE': 'ZDE',
 'Phishing / Spear Phishing': 'Phish',
 'Phishing': 'Phish',
 'Man-in-the-Middle (MitM)': 'MitM',
 'MitM': 'MitM',
 'Cross-Site Scripting (XSS)': 'XSS',
 'XSS': 'XSS',
 'Credential Stuffing': 'Cred-Stuff',
 'Malware / Trojan': 'T1204',
 'Malware': 'T1204',
 'Business Email Compromise (BEC)': 'BEC',
 'BEC': 'BEC',
 'DNS Spoofing / Cache Poisoning': 'T1584',
 'DNS Spoofing': 'T1584',
 'Brute Force Attack': 'SSH-BF',
 'Brute Force': 'SSH-BF',
 'Drive-By Download': 'EK-DbD',
 'Supply Chain Attack': 'T1195',
 'Insider Threat / Exfiltration': 'Net-Exfil',
 'Pass-the-Hash': 'PtH',
 'Reconnaissance': 'T1592',
 'Cross-Site Request Forgery (CSRF)': 'CSRF',
 'CSRF': 'CSRF',
 'Buffer Overflow': 'BOF',
 'Session Hijacking': 'AiTM',
 'Cryptojacking': 'T1496',
 'API Abuse / Broken Auth': 'BFLA',
 'Watering Hole Attack': 'T1189',
 'SIM Swapping': 'T1451',
 'Keylogging / Spyware': 'T1056',
 'Keylogging': 'T1056',
};

// 5 Solid Background Colors for Badges
const BADGE_SOLID_PALETTE = [
 { bg: '#ffb4ab', text: '#690005' }, // RED
 { bg: '#a8c7fa', text: '#001d35' }, // BLUE
 { bg: '#d0bcff', text: '#381e72' }, // PURPLE
 { bg: '#fdd663', text: '#422c00' }, // YELLOW
 { bg: '#a8e6cf', text: '#003822' }, // GREEN
];

const getBadgeSolidColor = (seed: string) => {
 let hash = 0;
 for (let i = 0; i < seed.length; i++) {
 hash = (hash << 5) - hash + seed.charCodeAt(i);
 hash |= 0;
 }
 const index = Math.abs(hash) % BADGE_SOLID_PALETTE.length;
 return BADGE_SOLID_PALETTE[index];
};

const getShortAttackBadge = (type: string): string => {
 return ATTACK_TYPE_SHORT_LABELS[type] || type.substring(0, 8).toUpperCase();
};

export const CyberAttackMapSection: React.FC<CyberAttackMapSectionProps> = ({
 crtActive = true,
 onToggleCrt,
}) => {
 const [attacks, setAttacks] = useState<AttackEvent[]>([]);
 const [liveLog, setLiveLog] = useState<AttackEvent[]>([]);
 const [isLive, setIsLive] = useState<boolean>(true);
 const [autoRotate, setAutoRotate] = useState<boolean>(true);
 const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
 const [isExpanded, setIsExpanded] = useState<boolean>(false);
 const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
 const [filterType, setFilterType] = useState<string>('ALL');
 const [attacksToday, setAttacksToday] = useState<number>(18492040);
 const [selectedAttack, setSelectedAttack] = useState<AttackEvent | null>(null);
 const [hoveredAttackId, setHoveredAttackId] = useState<string | null>(null);
 const [hoveredCity, setHoveredCity] = useState<string | null>(null);
 const [mitigatedMap, setMitigatedMap] = useState<Record<string, boolean>>({});
 const [blockedIpMap, setBlockedIpMap] = useState<Record<string, boolean>>({});
 const [targetedMap, setTargetedMap] = useState<Record<string, boolean>>({});
 const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
 const [audioFeedback, setAudioFeedback] = useState<boolean>(true);
 const [focusLocation, setFocusLocation] = useState<{ lat: number; lng: number } | null>(null);
 const [activePreset, setActivePreset] = useState<string>('GLOBAL');
 const [rateMode, setRateMode] = useState<'TOTAL' | 'RATE' | 'VELOCITY'>('TOTAL');
 const [lastDelta, setLastDelta] = useState<number>(5);
 const [sparkline, setSparkline] = useState<number[]>([25, 38, 30, 48, 62, 55, 78, 65, 82, 75, 92, 88, 96, 100]);
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
 setTimeout(() => setIsDeleting(false), 1000);
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
 setTimeout(() => setIsExporting(false), 1200);
 };

 const filteredLogs = liveLog.filter((item) => {
 const matchSev = filterSeverity === 'ALL' || item.severity === filterSeverity;
 const matchType = filterType === 'ALL' || item.type === filterType;
  return matchSev && matchType;
 });

 // Dynamic calculation for Top Target Country from live telemetry stream
 const targetCounts = liveLog.reduce((acc, curr) => {
 acc[curr.targetCountry] = (acc[curr.targetCountry] || 0) + 1;
 return acc;
 }, {} as Record<string, number>);
 const topTargetPair = Object.entries(targetCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0] || ['America', 1];
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

 const activeHoveredCityData = CITIES.find((c) => c.name === hoveredCity);

 return (
  <section
    id="threat-map"
    className="pt-0 px-0 pb-0 border-b-0 bg-transparent relative scroll-mt-28 text-white font-mono"
    style={{
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
    }}
  >
 <div className="max-w-7xl mx-auto px-0 flex flex-col gap-[15px]" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
 {/* SECTION HEADER & SOC CONTROLS */}
 <div className="flex flex-row items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white leading-[24px]" style={{ lineHeight: "24px" }}>
            Global Threat Ops
          </h2>
        </div>

 {/* 2 Action Buttons (Delete & Export) on the right with 10px gap */}
 <div className="flex items-center gap-[10px] shrink-0">
 {/* Clear (Delete) Log Action */}
 <button
 onClick={clearLogs}
 className={`w-[35px] h-[35px] rounded-full text-[13px] leading-[16px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 ${
 isDeleting
 ? 'bg-[#ffb4ab] text-[#690005]'
 : 'bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#ffb4ab] active:text-[#690005]'
 }`}
 title="Clear Incident Feed Log"
 >
 <i className="ri-delete-bin-5-line text-[13px] leading-[16px]"></i>
 </button>

 {/* Export Log Action */}
 <button
 onClick={handleExportLog}
 className={`w-[35px] h-[35px] rounded-full text-[13px] leading-[16px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center border-0 shadow-md active:scale-95 ${
 isExporting
 ? 'bg-[#a8e6cf] text-[#003923]'
 : 'bg-[#a8c7fa] text-[#001d35] hover:opacity-90 active:bg-[#a8e6cf] active:text-[#003923]'
 }`}
 title="Export Live Incident Stream as JSON"
 >
 <i className={`${isExporting ? 'ri-file-check-line text-[#003923]' : 'ri-survey-line'} text-[13px] leading-[16px]`}></i>
 </button>
 </div>
 </div>

 {/* TOP METRICS TICKER - THREAT MATRIX */}
 <div className="font-mono">
 {/* CARD: THREAT MATRIX & LIVE VELOCITY */}
 <div className="bg-[#21232b] border-0 p-2 rounded-2xl transition-all flex flex-col justify-between space-y-3 relative group shadow-md" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2 text-[13px] leading-[16px] text-[#c4c6d0] uppercase tracking-wider font-semibold">
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#fdd663] text-[#3b2f00] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">
 <i className="ri-bar-chart-2-line"></i>
 </div>
 <span className="text-[16px] text-white font-bold" style={{ fontSize: "16px", borderColor: "#ffffff", color: "#ffffff" }}>Threat MATRIX</span>
 </div>
 <div className="flex items-center space-x-1">
 {(['TOTAL', 'RATE', 'VELOCITY'] as const).map((m) => (
 <button
 key={m}
 onClick={() => {
 setRateMode(m);
 soundEngine.play('click');
 }}
 className={`px-2 h-[25px] flex items-center justify-center rounded-full text-[12px] leading-[12px] font-bold transition-all cursor-pointer border-0 ${
 rateMode === m
 ? 'bg-[#fdd663] text-[#422c00]'
 : 'bg-transparent text-[#8e9199] hover:text-[#c4c6d0] hover:bg-[#13141a]'
 }`}
 style={{ fontSize: "12px", lineHeight: "12px" }}
 >
 {m}
 </button>
 ))}
 <span className="px-2 h-[25px] flex items-center justify-center rounded-full text-[12px] leading-[12px] font-bold bg-[#fdd663] text-[#422c00] border-0">
 +{lastDelta}
 </span>
 </div>
 </div>

 <div className="space-y-1">
 <div className="flex items-baseline space-x-2 leading-[16px]" style={{ lineHeight: "16px" }}>
 <span className="text-2xl font-bold text-[#fdd663] tracking-tight leading-[24px]" style={{ lineHeight: "24px" }}>
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
 className="flex-1 bg-[#13141a] group-hover:bg-[#fdd663]/20 rounded-t transition-all duration-300 relative"
 style={{ height: `${Math.max(15, val)}%` }}
 >
 <div
 className="w-full bg-[#fdd663]/80 rounded-t"
 style={{ height: `${val}%` }}
 />
 </div>
 ))}
 </div>
 </div>

 <div className="text-[13px] leading-[16px] text-[#8e9199] flex items-center justify-between pt-2">
 <span className="text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>Avg +1,850/min global rate</span>
 <span className="text-[#fdd663] font-bold text-[13px] leading-[16px] flex items-center space-x-1">
 <span className="w-1.5 h-1.5 rounded-full bg-[#fdd663] animate-ping"></span>
 <span className="text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>LIVE FEED</span>
 </span>
 </div>
 </div>
 </div>

 {/* MAIN MAP CANVAS & FEED */}
 <div className="grid grid-cols-1 gap-y-[15px] gap-x-6 items-start">
 {/* Interactive 3D Globe Canvas (7 Cols) */}
 <div className="space-y-[15px] relative flex flex-col justify-start">
 {/* Threat Radar Header Container (Identical to Intel Brief Research Tab Header architecture) */}
 <div className="h-[56.9792px] bg-[#21232b] border-0 px-2 rounded-2xl transition-all flex items-center" style={{ paddingLeft: "8px", paddingRight: "8px" }}>
 <div className="flex items-center gap-3 min-w-0 pr-0" style={{ paddingRight: "0px" }}>
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] text-[#001d35] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">
 <i className="ri-base-station-line"></i>
 </div>
 <div className="flex-1 min-w-0 flex flex-col justify-center">
 <h3 className="text-[16px] leading-[16px] font-bold text-white truncate font-mono" style={{ lineHeight: "16px" }}>
 THREAT RADAR
 </h3>
 <div className="text-[13px] leading-[16px] text-[#a8c7fa] font-semibold mt-0.5 flex items-center gap-1.5 font-mono">
 <span className="w-1.5 h-1.5 rounded-full bg-[#a8c7fa] animate-pulse"></span>
 <span className="text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>GEO-LOC STREAM</span>
 </div>
 </div>
 </div>
 </div>

 {/* 3D GLOBE.GL NIGHT RADAR STAGE CONTAINER (SQUARE, NO BORDER, NO ROUNDED CORNERS) */}
  <div
    className={`relative w-full h-[250px] bg-transparent rounded-none border-0 overflow-hidden group shadow-inner ${crtActive ? 'animate-crt-flicker' : ''}`}
    style={{ height: '250px' }}
  >
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
 <div className="absolute top-3 left-3 z-20 bg-[#1a1b21]/95 backdrop-blur-md border border-[#a8c7fa]/40 p-2.5 rounded-xl text-[13px] leading-[16px] font-mono text-[#a8c7fa] space-y-0.5 shadow-lg animate-fadeIn">
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
 <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center space-x-1 bg-[#1a1b21]/95 backdrop-blur-md px-0 py-1 border-t border-[#44474f]/50 text-[13px] leading-[16px] font-mono justify-between h-[45px] shadow-lg">
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
 className={`flex-1 px-2 h-[35px] flex items-center justify-center rounded-full transition-all cursor-pointer font-bold border-0 text-center text-[12px] leading-[12px] ${
 isSelected
 ? 'bg-[#a8c7fa] text-[#001d35]'
 : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
 }`}
 style={{ fontSize: "12px", lineHeight: "12px" }}
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
 className={`px-2.5 h-[35px] rounded-full transition-all cursor-pointer font-bold border-0 flex items-center justify-center space-x-1 text-center shrink-0 text-[12px] leading-[12px] ${
 autoRotate
 ? 'bg-[#a8c7fa] text-[#001d35]'
 : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
 }`}
 title={autoRotate ? 'Disable 3D Globe Auto-Rotation' : 'Enable 3D Globe Auto-Rotation'}
 style={{ fontSize: "12px", lineHeight: "12px" }}
 >
 <i className={`${autoRotate ? 'ri-global-line' : 'ri-global-off-line'} text-[13px] leading-[16px]`}></i>
 </button>

 {/* CRT Shader Action */}
 {onToggleCrt && (
 <button
 onClick={() => {
 onToggleCrt();
 soundEngine.play('click');
 }}
 className={`px-2.5 h-[35px] rounded-full transition-all cursor-pointer font-bold border-0 flex items-center justify-center space-x-1 text-center shrink-0 text-[12px] leading-[12px] ${
 crtActive
 ? 'bg-[#a8c7fa] text-[#001d35]'
 : 'text-[#c4c6d0] hover:text-white hover:bg-[#21232b]'
 }`}
 title={crtActive ? 'Turn Off CRT Shader Effect' : 'Turn On CRT Shader Effect'}
 style={{ fontSize: "12px", lineHeight: "12px" }}
 >
 <i className={`${crtActive ? 'ri-mosaic-line' : 'ri-painting-line'} text-[13px] leading-[16px]`}></i>
 </button>
 )}
 </div>

 {/* CRT Scanline & Vignette Shader Layer localized exclusively to the 3D Globe */}
 {crtActive && (
 <div className="absolute inset-0 z-10 pointer-events-none scanlines crt-vignette opacity-80 rounded-lg"/>
 )}
 </div>

 </div>

 {/* Live Incident Stream Feed Table (5 Cols) - directly on BG */}
  <div className="flex flex-col px-0 gap-[15px]">
  {/* MERGED INCIDENT & ATTACK FLOW CONTAINER */}
  <div className="bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col space-y-3 relative font-mono shadow-md" style={{ paddingLeft: "8px", paddingRight: "8px", height: "157.94px" }}>
   <div className="flex items-center gap-3 min-w-0">
    <div className="w-[32px] h-[32px] rounded-[8px] bg-[#a8c7fa] text-[#001d35] border-0 shadow-md flex items-center justify-center text-base font-bold shrink-0">
     <i className="ri-rfid-line"></i>
    </div>
    <div className="flex flex-col justify-center shrink-0">
     <h3 className="text-[16px] leading-[16px] font-bold text-white truncate font-mono" style={{ lineHeight: "16px" }}>
      INCIDENT
     </h3>
     <div
      onClick={() => {
       setIsLive(!isLive);
       soundEngine.play('click');
      }}
      className="text-[13px] leading-[16px] text-[#a8c7fa] font-semibold mt-0.5 flex items-center gap-1.5 font-mono cursor-pointer"
      title={isLive ? 'Live Stream Active (Click to Pause)' : 'Stream Paused (Click to Resume)'}
     >
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-[#a8c7fa] animate-pulse' : 'bg-[#ffb4ab]'}`}></span>
      <span>{filteredLogs.length} EVENTS</span>
     </div>
    </div>

    {/* Vertical Separator Line beside text INCIDENT 40 EVENTS */}
    <span
     className="w-[1px] h-6 mx-1 shrink-0"
     style={{
      borderWidth: '1.66667px',
      borderColor: '#44484e',
      borderStyle: 'solid',
     }}
    ></span>

    {/* Capsule Buttons: Play/Pause, 2x, 4x, Expand/Close */}
    <div
     className="flex items-center space-x-1 bg-[#000000] p-1 rounded-full border border-[#44474f]/30 text-[13px] leading-[16px] font-mono shrink-0 h-[45px] w-[170px]"
     style={{ height: '45px', width: '170px', backgroundColor: '#000000' }}
    >
     {/* Live Stream Play / Pause Toggle Button */}
     <button
      onClick={() => {
       setIsLive(!isLive);
       soundEngine.play('click');
      }}
      className={`flex-1 h-[35px] rounded-full text-[13px] leading-[16px] font-bold transition-all cursor-pointer flex items-center justify-center border-0 shrink-0 ${
       isLive
        ? 'bg-[#ffb4ab] text-[#690005]'
        : 'text-[#8e9199] hover:text-white hover:bg-[#21232b]'
      }`}
      style={{ height: '35px' }}
      title={isLive ? 'Pause Stream' : 'Resume Live Stream (Play)'}
     >
      <i className={isLive ? 'ri-pause-circle-line text-sm' : 'ri-play-circle-line text-sm'}></i>
     </button>

     {[2, 4].map((spd) => {
      const isSelected = speedMultiplier === spd;
      return (
       <button
        key={spd}
        onClick={() => {
         setSpeedMultiplier(speedMultiplier === spd ? 1 : spd);
         soundEngine.play('click');
        }}
        className={`flex-1 h-[35px] rounded-full text-[13px] leading-[16px] font-bold transition-all text-center cursor-pointer border-0 flex items-center justify-center ${
         isSelected
          ? 'bg-[#a8c7fa] text-[#001d35]'
          : 'text-[#8e9199] hover:text-white hover:bg-[#21232b]'
        }`}
        style={{ height: '35px' }}
       >
        {spd}x
       </button>
      );
     })}

     {/* Expand / Close Toggle Button (Icon matching Arsenal) */}
     <button
      onClick={() => {
       setIsExpanded(!isExpanded);
       soundEngine.play('click');
      }}
      className={`flex-1 h-[35px] rounded-full text-[13px] leading-[16px] font-bold transition-all text-center cursor-pointer border-0 flex items-center justify-center shrink-0 ${
       isExpanded
        ? 'bg-[#a8c7fa] text-[#001d35]'
        : 'text-[#8e9199] hover:text-white hover:bg-[#21232b]'
      }`}
      style={{ height: '35px' }}
      title={isExpanded ? 'Collapse Feed' : 'Expand Feed to Footer'}
      aria-label={isExpanded ? 'Collapse Feed' : 'Expand Feed to Footer'}
     >
      <i className={`text-sm ${isExpanded ? 'ri-swap-3-line' : 'ri-beer-line'}`}></i>
     </button>
    </div>
   </div>

  <div className="grid grid-cols-2 gap-3 items-start w-full min-w-0">
 {/* ORIGIN ITEM */}
 <div className="space-y-1.5 min-w-0">
 <div className="flex items-center justify-between gap-1.5 min-w-0 w-full">
 <div className="flex items-center space-x-2 min-w-0 flex-1 overflow-hidden">
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#13141a] flex items-center justify-center shrink-0 border border-[#44474f]/30" style={{ height: "32px", width: "32px", borderRadius: "8px" }}>
 <i className="ri-global-line text-[#a8c7fa] text-[13px] leading-[16px]"></i>
 </div>
 <div className="min-w-0 flex-1 overflow-hidden">
 <div className="text-[12px] font-bold text-white truncate leading-[16px] block" style={{ fontSize: "12px" }} title={topSourceName.toUpperCase()}>
 {topSourceName.toUpperCase()}
 </div>
 <div className="text-[12px] leading-[12px] font-bold text-[#8e9199] tracking-wider uppercase block" style={{ fontSize: "12px", lineHeight: "12px" }}>
 ORIGIN
 </div>
 </div>
 </div>
 <button
 onClick={() => {
 setFocusLocation({ lat: topSourceCityObj.lat, lng: topSourceCityObj.lng });
 soundEngine.play('click');
 }}
 className="text-[#a8c7fa] hover:text-white transition-all cursor-pointer shrink-0 p-1"
 title="Fly Camera to Origin"
 aria-label="Fly camera to origin"
 >
 <i className="ri-crosshair-2-line text-sm"></i>
 </button>
 </div>

 <div className="space-y-1 pt-1">
 <div className="flex justify-between text-[13px] leading-[16px] text-[#8e9199] font-medium">
 <span className="truncate text-[12px] leading-[16px]" style={{ fontSize: "12px" }}>Botnet Share</span>
 <span className="text-[#a8c7fa] shrink-0 font-mono font-bold ml-1 text-[12px] leading-[16px]" style={{ fontSize: "12px" }}>{topSourceShare}%</span>
 </div>
 <div className="w-full bg-[#000000] rounded-full h-1.5 border border-[#44474f]/30 overflow-hidden" style={{ backgroundColor: "#000000" }}>
 <div
 className="bg-[#a8c7fa] h-full rounded-full transition-all duration-500"
 style={{ width: `${Math.min(100, Math.max(15, parseFloat(topSourceShare) * 2.5))}%` }}
 ></div>
 </div>
 </div>
 </div>

 {/* TARGET ITEM */}
 <div className="space-y-1.5 min-w-0">
 <div className="flex items-center justify-between gap-1.5 min-w-0 w-full">
 <div className="flex items-center space-x-2 min-w-0 flex-1 overflow-hidden">
 <div className="w-[32px] h-[32px] rounded-[8px] bg-[#13141a] flex items-center justify-center shrink-0 border border-[#44474f]/30" style={{ height: "32px", width: "32px", borderRadius: "8px" }}>
 <i className="ri-database-line text-[#a8c7fa] text-[13px] leading-[16px]"></i>
 </div>
 <div className="min-w-0 flex-1 overflow-hidden">
 <div className="text-[12px] font-bold text-white truncate leading-[16px] block" style={{ fontSize: "12px" }} title={topTargetName.toUpperCase()}>
 {topTargetName.toUpperCase()}
 </div>
 <div className="text-[12px] leading-[12px] font-bold text-[#8e9199] tracking-wider uppercase block" style={{ fontSize: "12px", lineHeight: "12px" }}>
 TARGET
 </div>
 </div>
 </div>
 <button
 onClick={() => {
 setFocusLocation({ lat: topTargetCityObj.lat, lng: topTargetCityObj.lng });
 soundEngine.play('click');
 }}
 className="text-[#a8c7fa] hover:text-white transition-all cursor-pointer shrink-0 p-1"
 title="Fly Camera to Target"
 aria-label="Fly camera to target"
 >
 <i className="ri-crosshair-2-line text-sm"></i>
 </button>
 </div>

 <div className="space-y-1 pt-1">
 <div className="flex justify-between text-[13px] leading-[16px] text-[#8e9199] font-medium">
 <span className="truncate text-[12px] leading-[16px]" style={{ fontSize: "12px" }}>Target Share</span>
 <span className="text-[#a8c7fa] shrink-0 font-mono font-bold ml-1 text-[12px] leading-[16px]" style={{ fontSize: "12px" }}>{topTargetShare}%</span>
 </div>
 <div className="w-full bg-[#000000] rounded-full h-1.5 border border-[#44474f]/30 overflow-hidden" style={{ backgroundColor: "#000000" }}>
 <div
 className="bg-[#a8c7fa] h-full rounded-full transition-all duration-500"
 style={{ width: `${Math.min(100, Math.max(15, parseFloat(topTargetShare) * 2.5))}%` }}
 ></div>
 </div>
 </div>
 </div>
 </div>
  </div>

   {isExpanded && (
    <>
  {/* Severity Filter Tabs (Capsule Button) */}
 {/* Severity Filter Tabs */}
 <div className="flex items-center flex-wrap gap-1 bg-[#21232b] p-1 rounded-full border-0 h-[45px]">
 {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
 <button
 key={sev}
 onClick={() => {
 setFilterSeverity(sev);
 soundEngine.play('click');
 }}
 className={`flex-1 min-w-[50px] h-[35px] flex items-center justify-center text-[12px] leading-[12px] font-mono font-bold rounded-full transition-colors cursor-pointer text-center ${
 filterSeverity === sev
 ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
 : 'text-[#c4c6d0] hover:text-white'
 }`}
 style={{ fontSize: "12px", lineHeight: "12px" }}
 >
 {sev}
 </button>
 ))}
 </div>

 {/* Vector Filter Chip (if active) */}
 {filterType !== 'ALL' && (
 <div className="flex items-center justify-between bg-[#004a77]/30 border border-[#a8c7fa]/40 px-3 py-1 rounded-full text-[13px] leading-[16px] font-mono text-[#a8c7fa]">
 <span>VECTOR FILTER: <strong>{filterType}</strong></span>
 <button
 onClick={() => setFilterType('ALL')}
 className="text-[#c4c6d0] hover:text-white cursor-pointer ml-2"
 >
 <i className="ri-close-line font-bold"></i>
 </button>
 </div>
 )}

  {/* Incident List */}
  <div className="h-[220px] max-h-[220px] overflow-y-auto overflow-x-hidden flex flex-col gap-[15px] pr-1 font-jetbrains scrollbar-thin snap-y snap-mandatory scroll-smooth">
 {filteredLogs.length === 0 ? (
 <div className="text-center py-12 text-slate-500 font-mono text-[13px] leading-[16px] space-y-2">
 <i className="ri-radar-line text-2xl text-slate-600"></i>
 <p>NO INCIDENT MATCHES CURRENT FILTERS</p>
 </div>
 ) : (
 filteredLogs.map((atk) => {
 const isSelected = selectedAttack?.id === atk.id;
 const isMitigated = !!mitigatedMap[atk.id];
 const isBlocked = !!blockedIpMap[atk.sourceIP];
 const isTargeted = !!targetedMap[atk.id];
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
  className="p-2 rounded-2xl text-[12px] leading-[12px] font-mono cursor-pointer border-0 bg-[#21232b] h-[200px] flex flex-col justify-between shrink-0 snap-start snap-always" style={{ paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px", height: "200px" }}
  >
   {/* Header & Route Section */}
   <div className="space-y-1.5 shrink-0">
    <div className="flex items-center justify-between">
     <span className="text-[12px] leading-[12px] text-[#8e9199]" style={{ fontSize: "12px", lineHeight: "12px" }}>[{atk.id}] {atk.timestamp}</span>
     <div className="flex items-center space-x-1.5">
      <span
       className={`inline-block w-[64px] h-[15.9896px] leading-[16px] flex items-center justify-center text-center text-[12px] leading-[12px] font-bold rounded-full border-0 ${
        isMitigated || isBlocked
         ? "bg-[#a8e6cf] text-[#003822]"
         : atk.severity === "CRITICAL"
         ? "bg-[#ffb4ab] text-[#690005]"
         : atk.severity === "HIGH"
         ? "bg-[#fdd663] text-[#422c00]"
         : "bg-[#d0bcff] text-[#381e72]"
       }`}
       style={{ fontSize: "12px", lineHeight: "12px", height: "15.9896px" }}
      >
       {isBlocked ? "BLOCKED" : isMitigated ? "RESOLVED" : atk.severity}
      </span>
      {(() => {
       const solidColor = getBadgeSolidColor(atk.id + atk.type);
       const shortLabel = getShortAttackBadge(atk.type);
       return (
        <span
         className="w-[76px] h-[15.9896px] inline-flex items-center justify-center text-center text-[12px] leading-[12px] font-bold font-mono rounded-full border-0 shadow-none shrink-0"
         style={{
          backgroundColor: solidColor.bg,
          color: solidColor.text,
          fontSize: "12px",
          lineHeight: "12px",
          height: "15.9896px",
         }}
         title={atk.type}
        >
         {shortLabel}
        </span>
       );
      })()}
     </div>
    </div>

    <div className="flex items-center justify-between text-[12px] leading-[12px] font-mono text-[#c4c6d0]">
     <div className="truncate flex items-center space-x-1 text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>
      <span className="text-[#a8c7fa] font-semibold text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>{atk.sourceCity} [{atk.sourceCode}]</span>
      <i className="ri-arrow-right-line text-[12px] leading-[12px] text-[#8e9199]"></i>
      <span className="text-[#ffb4ab] font-semibold text-[12px] leading-[12px]" style={{ fontSize: "12px", lineHeight: "12px" }}>{atk.targetCity} [{atk.targetCode}]</span>
     </div>
     <span className="text-[12px] leading-[12px] font-mono text-[#c4c6d0] font-normal shrink-0" style={{ fontSize: "12px", lineHeight: "12px" }}>
      <code style={{ color: atkColor }} className="font-bold text-[12px] leading-[12px]">{atk.port}</code> ({atk.protocol})
     </span>
    </div>
   </div>

   {/* Telemetry Details */}
   <div
    className="space-y-1 text-[#c4c6d0] text-[12px] leading-[12px] font-mono shrink-0"
    style={{ fontSize: "12px", lineHeight: "12px" }}
    onClick={(e) => e.stopPropagation()}
   >
          {/* SOURCE IP */}
          <div className="flex items-start text-[12px] font-mono leading-[12px] h-[16px]" style={{ fontSize: "12px", lineHeight: "12px" }}>
            <span className="w-[76px] shrink-0 text-[#a8c7fa]">SOURCE IP</span>
            <span className="text-[#a8c7fa] mr-2 shrink-0">:</span>
            <span className="flex-1 min-w-0 truncate text-[#8e9199] font-bold">{atk.sourceIP}</span>
          </div>

          {/* CVE */}
          <div className="flex items-start text-[12px] font-mono leading-[12px] h-[32px]" style={{ fontSize: "12px", lineHeight: "12px" }}>
            <span className="w-[76px] shrink-0 text-[#a8c7fa]">CVE</span>
            <span className="text-[#a8c7fa] mr-2 shrink-0">:</span>
            <span className="flex-1 min-w-0 line-clamp-2 break-words text-[#8e9199] font-bold">{atk.cveId}</span>
          </div>

          {/* PAYLOAD */}
          <div className="flex items-start text-[12px] font-mono leading-[12px] h-[32px]" style={{ fontSize: "12px", lineHeight: "12px" }}>
            <span className="w-[76px] shrink-0 text-[#a8c7fa]">PAYLOAD</span>
            <span className="text-[#a8c7fa] mr-2 shrink-0">:</span>
            <span className="flex-1 min-w-0 line-clamp-2 break-all text-[#8e9199] select-all font-mono">
              {atk.payloadSnippet}
            </span>
          </div>
   </div>

   {/* 4-Button Action Capsule (Matching ALL CRITICAL HIGH MEDIUM Capsule Button) */}
   <div
    className="flex items-center gap-1 bg-[#000000] p-1 rounded-full border-0 h-[45px] w-full shrink-0"
    style={{ backgroundColor: '#000000' }}
    onClick={(e) => e.stopPropagation()}
   >
    {/* 1. Block Source IP Button */}
    <button
     type="button"
     onClick={(e) => {
      e.stopPropagation();
      handleToggleBlockIp(atk.sourceIP);
     }}
     className={`flex-1 h-[35px] flex items-center justify-center text-[13px] leading-[16px] font-mono font-bold rounded-full transition-colors cursor-pointer text-center ${
      isBlocked
       ? 'bg-[#ffb4ab] text-[#690005] font-semibold'
       : 'text-[#c4c6d0] hover:text-white hover:bg-white/5'
     }`}
     title={isBlocked ? `Unblock Source IP (${atk.sourceIP})` : `Block Source IP (${atk.sourceIP})`}
    >
     <i className={isBlocked ? 'ri-spam-line text-sm' : 'ri-spam-3-line text-sm'}></i>
    </button>

    {/* 2. Fly to Source / Target Button */}
    <button
     type="button"
     onClick={(e) => {
      e.stopPropagation();
      handleToggleTarget(atk.id, atk.sourceLat, atk.sourceLng);
     }}
     className={`flex-1 h-[35px] flex items-center justify-center text-[13px] leading-[16px] font-mono font-bold rounded-full transition-colors cursor-pointer text-center ${
      isTargeted
       ? 'bg-[#a8c7fa] text-[#042e60] font-semibold'
       : 'text-[#c4c6d0] hover:text-white hover:bg-white/5'
     }`}
     title={isTargeted ? `Reset Focus (${atk.sourceCity})` : `Fly to Source (${atk.sourceCity})`}
    >
     <i className={isTargeted ? 'ri-focus-2-line text-sm' : 'ri-crosshair-2-line text-sm'}></i>
    </button>

    {/* 3. Mitigate Threat Button */}
    <button
     type="button"
     onClick={(e) => {
      e.stopPropagation();
      handleToggleMitigation(atk.id);
     }}
     className={`flex-1 h-[35px] flex items-center justify-center text-[13px] leading-[16px] font-mono font-bold rounded-full transition-colors cursor-pointer text-center ${
      isMitigated
       ? 'bg-[#fdd663] text-[#3b2d00] font-semibold'
       : 'text-[#c4c6d0] hover:text-white hover:bg-white/5'
     }`}
     title={isMitigated ? 'Re-open Threat' : 'Mitigate Threat'}
    >
     <i className={isMitigated ? 'ri-git-repository-commits-line text-sm' : 'ri-git-repository-private-line text-sm'}></i>
    </button>

    {/* 4. Payload Copy Button */}
    <button
     type="button"
     onClick={(e) => {
      e.stopPropagation();
      handleCopyPayload(atk.payloadSnippet, atk.id);
     }}
     className={`flex-1 h-[35px] flex items-center justify-center text-[13px] leading-[16px] font-mono font-bold rounded-full transition-colors cursor-pointer text-center ${
      isCopied
       ? 'bg-[#a8e6cf] text-[#003822] font-semibold'
       : 'text-[#c4c6d0] hover:text-white hover:bg-white/5'
     }`}
     title={isCopied ? 'Copied (Click to reset)' : 'Copy Payload'}
    >
     <i className={isCopied ? 'ri-survey-line text-sm' : 'ri-file-copy-line text-sm'}></i>
    </button>
   </div>
  </div>
 );
 })
 )}
 </div>
    </>
   )}
 </div>
 </div>
 </div>

 </section>
 );
};
