import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { soundEngine } from '../utils/soundEngine';

interface AttackEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  sourceCity: string;
  targetCity: string;
  sourceIP: string;
  targetIP: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'HTTP/2' | 'DNS' | 'ICMP';
  cveId: string;
  mitigated?: boolean;
}

interface SocAnalyticsDashboardProps {
  attacks: AttackEvent[];
  attacksToday: number;
  mitigatedMap: Record<string, boolean>;
  blockedIpMap: Record<string, boolean>;
  onTriggerSimulatedAttack?: (type: string, severity: 'CRITICAL' | 'HIGH' | 'MEDIUM') => void;
  onClearLogs?: () => void;
}

const VECTOR_COLORS: Record<string, string> = {
  'DDoS Attack': '#ff5252',
  'Ransomware': '#ff1744',
  'Zero-Day Exploit': '#d500f9',
  'SQL Injection': '#ff9100',
  'XSS Payload': '#ffea00',
  'Buffer Overflow': '#76ff03',
  'Supply Chain Attack': '#00e676',
  'Phishing / Social Eng': '#00e5ff',
  'Brute Force SSH': '#2979ff',
  'Malware / Trojan': '#651fff',
  'Insider Threat / Exfiltration': '#f50057',
};

const SEVERITY_COLORS = {
  CRITICAL: '#ff1744',
  HIGH: '#ff9100',
  MEDIUM: '#ffea00',
  LOW: '#00e676',
};

const CustomProtocolTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0f0e13] border border-[#44474f] rounded-xl p-3.5 shadow-2xl font-mono text-xs space-y-2 max-w-xs z-50">
        <div className="flex items-center justify-between border-b border-[#44474f]/40 pb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.color }}></span>
            <span className="font-bold text-white text-sm">{data.protocol}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#21232b] text-[#a8c7fa] border border-[#44474f]/50">
            {data.layer} LAYER
          </span>
        </div>

        <p className="text-[#8e9199] text-[11px] font-sans">{data.desc}</p>

        <div className="space-y-1 pt-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-[#8e9199]">Total Packets:</span>
            <span className="font-bold text-white">{data.count.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#a8e6cf]">Clean Inspected:</span>
            <span className="font-bold text-[#a8e6cf]">{data.cleanPackets.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#ffb4ab]">Threat Payloads:</span>
            <span className="font-bold text-[#ffb4ab]">{data.threatPayloads.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#44474f]/30">
            <span className="text-[#8e9199]">Spectrum Share:</span>
            <span className="font-bold text-[#a8c7fa]">{data.share}%</span>
          </div>
        </div>

        <div className="text-[9.5px] text-[#a8e6cf] bg-[#005231]/30 p-1.5 rounded border border-[#a8e6cf]/30 flex items-center space-x-1">
          <i className="ri-shield-check-line"></i>
          <span>eBPF DEEP PACKET INSPECTED</span>
        </div>
      </div>
    );
  }
  return null;
};

export const SocAnalyticsDashboard: React.FC<SocAnalyticsDashboardProps> = ({
  attacks,
  attacksToday,
  mitigatedMap,
  blockedIpMap,
  onTriggerSimulatedAttack,
  onClearLogs,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1H' | '6H' | '24H' | '7D'>('24H');
  const [simulationCategory, setSimulationCategory] = useState<string>('Ransomware');
  const [simulationSeverity, setSimulationSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  const [selectedLayerFilter, setSelectedLayerFilter] = useState<'ALL' | 'L7' | 'L4' | 'L3'>('ALL');
  const [activeCard, setActiveCard] = useState<'EVENTS' | 'SLA' | 'FIREWALL' | 'MTTD' | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Calculate Vector Distribution Data
  const vectorDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    attacks.forEach((a) => {
      counts[a.type] = (counts[a.type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        color: VECTOR_COLORS[name] || '#a8c7fa',
      }))
      .sort((a, b) => b.value - a.value);
  }, [attacks]);

  // Calculate Comprehensive 12-Protocol Spectrum Data
  const fullProtocolSpectrum = useMemo(() => {
    const baseVal = Math.max(attacks.length, 12);

    const spectrumList = [
      { protocol: 'HTTP/2', layer: 'L7', color: '#38bdf8', multiplier: 1.4, desc: 'Web Traffic & REST APIs' },
      { protocol: 'HTTP/3', layer: 'L7', color: '#a855f7', multiplier: 1.2, desc: 'QUIC Transport over UDP' },
      { protocol: 'TLS 1.3', layer: 'L6', color: '#34d399', multiplier: 1.8, desc: 'Encrypted Transport Layer' },
      { protocol: 'TCP', layer: 'L4', color: '#fbbf24', multiplier: 2.1, desc: 'Transmission Control Protocol' },
      { protocol: 'UDP', layer: 'L4', color: '#f87171', multiplier: 1.6, desc: 'User Datagram Protocol Floods' },
      { protocol: 'DNS/DoH', layer: 'L7', color: '#818cf8', multiplier: 1.1, desc: 'Domain Name & Encrypted DNS' },
      { protocol: 'SSH/SFTP', layer: 'L7', color: '#f472b6', multiplier: 0.9, desc: 'Secure Shell & C2 Tunneling' },
      { protocol: 'gRPC', layer: 'L7', color: '#2dd4bf', multiplier: 0.7, desc: 'Microservice RPC Traffic' },
      { protocol: 'WebSocket', layer: 'L7', color: '#fb923c', multiplier: 0.85, desc: 'Realtime WSS Connections' },
      { protocol: 'ICMP', layer: 'L3', color: '#a3e635', multiplier: 0.6, desc: 'Network Control & Echo Trace' },
      { protocol: 'BGP', layer: 'L3', color: '#e879f9', multiplier: 0.45, desc: 'Border Gateway Routing' },
      { protocol: 'MQTT', layer: 'L7', color: '#22d3ee', multiplier: 0.5, desc: 'IoT Device Sensor Feeds' },
    ];

    const liveCounts: Record<string, number> = {};
    attacks.forEach((a) => {
      liveCounts[a.protocol] = (liveCounts[a.protocol] || 0) + 1;
    });

    const totalVolume = spectrumList.reduce((acc, item) => {
      const real = liveCounts[item.protocol] || 0;
      return acc + real + Math.floor(baseVal * item.multiplier);
    }, 0);

    return spectrumList.map((item) => {
      const real = liveCounts[item.protocol] || 0;
      const count = real + Math.floor(baseVal * item.multiplier);
      const threatPayloads = Math.floor(count * 0.35);
      const cleanPackets = count - threatPayloads;
      const share = totalVolume > 0 ? ((count / totalVolume) * 100).toFixed(1) : '0.0';

      return {
        ...item,
        count,
        cleanPackets,
        threatPayloads,
        share,
      };
    });
  }, [attacks]);

  const filteredProtocolData = useMemo(() => {
    if (selectedLayerFilter === 'ALL') return fullProtocolSpectrum;
    return fullProtocolSpectrum.filter((item) => item.layer === selectedLayerFilter);
  }, [fullProtocolSpectrum, selectedLayerFilter]);

  const totalSpectrumPackets = useMemo(() => {
    return filteredProtocolData.reduce((acc, item) => acc + item.count, 0);
  }, [filteredProtocolData]);

  const totalCleanPackets = useMemo(() => {
    return filteredProtocolData.reduce((acc, item) => acc + item.cleanPackets, 0);
  }, [filteredProtocolData]);

  const totalThreatPackets = useMemo(() => {
    return filteredProtocolData.reduce((acc, item) => acc + item.threatPayloads, 0);
  }, [filteredProtocolData]);

  // Top Target Cities
  const topTargets = useMemo(() => {
    const targetCounts: Record<string, number> = {};
    attacks.forEach((a) => {
      targetCounts[a.targetCity] = (targetCounts[a.targetCity] || 0) + 1;
    });

    return Object.entries(targetCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [attacks]);

  // Time Series Velocity Trend
  const timeSeriesData = useMemo(() => {
    // Generate 12 historical telemetry buckets based on live attacks count
    const baseVal = Math.max(attacks.length, 10);
    return [
      { time: '00:00', critical: Math.floor(baseVal * 0.3), high: Math.floor(baseVal * 0.4), medium: Math.floor(baseVal * 0.3) },
      { time: '02:00', critical: Math.floor(baseVal * 0.25), high: Math.floor(baseVal * 0.5), medium: Math.floor(baseVal * 0.35) },
      { time: '04:00', critical: Math.floor(baseVal * 0.4), high: Math.floor(baseVal * 0.35), medium: Math.floor(baseVal * 0.2) },
      { time: '06:00', critical: Math.floor(baseVal * 0.6), high: Math.floor(baseVal * 0.55), medium: Math.floor(baseVal * 0.4) },
      { time: '08:00', critical: Math.floor(baseVal * 0.8), high: Math.floor(baseVal * 0.7), medium: Math.floor(baseVal * 0.5) },
      { time: '10:00', critical: Math.floor(baseVal * 0.95), high: Math.floor(baseVal * 0.85), medium: Math.floor(baseVal * 0.6) },
      { time: '12:00', critical: Math.floor(baseVal * 0.7), high: Math.floor(baseVal * 0.9), medium: Math.floor(baseVal * 0.45) },
      { time: '14:00', critical: Math.floor(baseVal * 0.85), high: Math.floor(baseVal * 0.75), medium: Math.floor(baseVal * 0.55) },
      { time: '16:00', critical: Math.floor(baseVal * 1.1), high: Math.floor(baseVal * 0.9), medium: Math.floor(baseVal * 0.65) },
      { time: '18:00', critical: Math.floor(baseVal * 0.9), high: Math.floor(baseVal * 0.8), medium: Math.floor(baseVal * 0.5) },
      { time: '20:00', critical: Math.floor(baseVal * 0.75), high: Math.floor(baseVal * 0.65), medium: Math.floor(baseVal * 0.4) },
      { time: 'NOW', critical: Math.floor(baseVal * 1.05), high: Math.floor(baseVal * 0.85), medium: Math.floor(baseVal * 0.6) },
    ];
  }, [attacks.length]);

  const totalMitigated = Object.values(mitigatedMap).filter(Boolean).length;
  const totalBlockedIps = Object.values(blockedIpMap).filter(Boolean).length;
  const mitigationRate = attacks.length > 0 ? Math.round((totalMitigated / attacks.length) * 100) : 98;

  const severityCounts = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    attacks.forEach((a) => {
      if (counts[a.severity] !== undefined) {
        counts[a.severity]++;
      }
    });
    return counts;
  }, [attacks]);

  const handleRunSimulation = () => {
    soundEngine.play('click');
    onTriggerSimulatedAttack?.(simulationCategory, simulationSeverity);
    showToast(`SIMULATED ${simulationSeverity} ${simulationCategory.toUpperCase()} ATTACK`);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans text-white">
      
      {/* HEADER CONTROL BAR */}
      <div className="bg-[#1a1b21] p-4 sm:p-5 rounded-2xl border border-[#44474f]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#a8c7fa] uppercase tracking-wider">
            <i className="ri-pie-chart-2-line text-sm"></i>
            <span>SOC ADVANCED TELEMETRY ANALYTICS ENGINE</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Real-Time Threat Intelligence Visualizer
          </h3>
          <p className="text-xs text-[#c4c6d0] mt-0.5 font-sans">
            Aggregated global attack vectors, protocol traffic telemetry, target distribution heatmaps, and mitigation SLA analytics.
          </p>
        </div>

        {/* TIME RANGE CONTROLS */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-[11px] text-[#8e9199] hidden sm:inline">WINDOW:</span>
          <div className="flex items-center space-x-1 bg-[#0f0e13] p-1 rounded-xl border border-[#44474f]/60">
            {(['1H', '6H', '24H', '7D'] as const).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setSelectedTimeRange(range);
                  soundEngine.play('click');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedTimeRange === range
                    ? 'bg-[#a8c7fa] text-[#042e60] shadow'
                    : 'text-[#8e9199] hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MATERIAL DESIGN 3 METRIC HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        {/* CARD 1: TOTAL CAPTURED EVENTS */}
        <div
          onClick={() => {
            soundEngine.play('click');
            setActiveCard(activeCard === 'EVENTS' ? null : 'EVENTS');
          }}
          className={`bg-[#1a1b21] hover:bg-[#21232b] p-4.5 rounded-2xl border transition-all duration-300 shadow-md relative overflow-hidden group cursor-pointer ${
            activeCard === 'EVENTS'
              ? 'border-[#00a8ff] ring-2 ring-[#00a8ff]/30 bg-[#21232b]'
              : 'border-[#44474f]/40 hover:border-[#00a8ff]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-[#00a8ff]/15 text-[#00a8ff] border border-[#00a8ff]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <i className="ri-radar-line text-base"></i>
              </div>
              <span className="text-[11px] font-bold text-[#c4c6d0] tracking-wider uppercase">
                TOTAL CAPTURED EVENTS
              </span>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a8ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a8ff]"></span>
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {attacks.length}{' '}
              <span className="text-xs font-normal text-[#00a8ff] bg-[#00a8ff]/15 px-2 py-0.5 rounded-full border border-[#00a8ff]/30">
                EVENTS
              </span>
            </div>
            <span className="text-[10px] text-[#7f8fa6] group-hover:text-white transition-colors">
              {activeCard === 'EVENTS' ? '▲ CLOSE' : '▼ DRILLDOWN'}
            </span>
          </div>

          {/* Micro Severity Spectrum Indicator */}
          <div className="w-full bg-[#0f0e13] h-1.5 rounded-full mt-2.5 overflow-hidden flex border border-[#2f3640]">
            <div
              style={{ width: `${attacks.length > 0 ? (severityCounts.CRITICAL / attacks.length) * 100 : 25}%` }}
              className="bg-[#ff1744] h-full"
              title={`Critical: ${severityCounts.CRITICAL}`}
            ></div>
            <div
              style={{ width: `${attacks.length > 0 ? (severityCounts.HIGH / attacks.length) * 100 : 25}%` }}
              className="bg-[#ff9100] h-full"
              title={`High: ${severityCounts.HIGH}`}
            ></div>
            <div
              style={{ width: `${attacks.length > 0 ? (severityCounts.MEDIUM / attacks.length) * 100 : 25}%` }}
              className="bg-[#ffea00] h-full"
              title={`Medium: ${severityCounts.MEDIUM}`}
            ></div>
            <div
              style={{ width: `${attacks.length > 0 ? (severityCounts.LOW / attacks.length) * 100 : 25}%` }}
              className="bg-[#00e676] h-full"
              title={`Low: ${severityCounts.LOW}`}
            ></div>
          </div>

          <div className="text-[11px] text-[#4cd137] mt-2 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <i className="ri-arrow-up-line text-xs"></i>
              <span>24h Global Telemetry Feed</span>
            </span>
            <span className="text-[10px] font-mono text-[#7f8fa6]">
              +{Math.max(2, Math.floor(attacks.length * 1.4))}/m
            </span>
          </div>

          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#00a8ff]/10 rounded-full blur-2xl group-hover:bg-[#00a8ff]/20 transition-all"></div>
        </div>

        {/* CARD 2: AUTOMATED MITIGATION SLA */}
        <div
          onClick={() => {
            soundEngine.play('click');
            setActiveCard(activeCard === 'SLA' ? null : 'SLA');
          }}
          className={`bg-[#1a1b21] hover:bg-[#21232b] p-4.5 rounded-2xl border transition-all duration-300 shadow-md relative overflow-hidden group cursor-pointer ${
            activeCard === 'SLA'
              ? 'border-[#4cd137] ring-2 ring-[#4cd137]/30 bg-[#21232b]'
              : 'border-[#44474f]/40 hover:border-[#4cd137]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-[#4cd137]/15 text-[#4cd137] border border-[#4cd137]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <i className="ri-shield-check-line text-base"></i>
              </div>
              <span className="text-[11px] font-bold text-[#c4c6d0] tracking-wider uppercase">
                AUTOMATED MITIGATION SLA
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#005231]/40 text-[#4cd137] border border-[#4cd137]/30">
              SLA 98%
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-[#4cd137] tracking-tight">
              {mitigationRate}%
            </div>
            <span className="text-[10px] text-[#7f8fa6] group-hover:text-white transition-colors">
              {activeCard === 'SLA' ? '▲ CLOSE' : '▼ DRILLDOWN'}
            </span>
          </div>

          {/* M3 Linear Progress Bar */}
          <div className="w-full bg-[#0f0e13] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[#2f3640] relative">
            <div
              className="bg-gradient-to-r from-[#005231] via-[#4cd137] to-[#44bd32] h-full rounded-full transition-all duration-500 relative"
              style={{ width: `${mitigationRate}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse"></div>
            </div>
          </div>

          <div className="text-[11px] text-[#8e9199] mt-2 flex items-center justify-between">
            <span>{totalMitigated} incidents mitigated in real time</span>
            <i className="ri-flashlight-line text-[#4cd137]"></i>
          </div>

          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#4cd137]/10 rounded-full blur-2xl group-hover:bg-[#4cd137]/20 transition-all"></div>
        </div>

        {/* CARD 3: IP BLACKLIST FIREWALL */}
        <div
          onClick={() => {
            soundEngine.play('click');
            setActiveCard(activeCard === 'FIREWALL' ? null : 'FIREWALL');
          }}
          className={`bg-[#1a1b21] hover:bg-[#21232b] p-4.5 rounded-2xl border transition-all duration-300 shadow-md relative overflow-hidden group cursor-pointer ${
            activeCard === 'FIREWALL'
              ? 'border-[#fbc531] ring-2 ring-[#fbc531]/30 bg-[#21232b]'
              : 'border-[#44474f]/40 hover:border-[#fbc531]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-[#fbc531]/15 text-[#fbc531] border border-[#fbc531]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <i className="ri-prohibited-line text-base"></i>
              </div>
              <span className="text-[11px] font-bold text-[#c4c6d0] tracking-wider uppercase">
                IP BLACKLIST FIREWALL
              </span>
            </div>
            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-[#192a56] text-[#00a8ff] border border-[#00a8ff]/30">
              eBPF ACTIVE
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-[#fbc531] tracking-tight">
              {totalBlockedIps}{' '}
              <span className="text-xs font-normal text-[#8e9199]">IPs</span>
            </div>
            <span className="text-[10px] text-[#7f8fa6] group-hover:text-white transition-colors">
              {activeCard === 'FIREWALL' ? '▲ CLOSE' : '▼ DRILLDOWN'}
            </span>
          </div>

          <div className="w-full bg-[#0f0e13] h-1.5 rounded-full mt-2.5 overflow-hidden flex border border-[#2f3640]">
            <div className="w-full bg-gradient-to-r from-[#e1b12c] to-[#fbc531] h-full animate-pulse"></div>
          </div>

          <div className="text-[11px] text-[#8e9199] mt-2 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <i className="ri-shield-flash-line text-[#fbc531]"></i>
              <span>Active Kernel eBPF Drop Rules</span>
            </span>
            <span className="text-[10px] text-[#fbc531] font-bold">100% HARDWARE</span>
          </div>

          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#fbc531]/10 rounded-full blur-2xl group-hover:bg-[#fbc531]/20 transition-all"></div>
        </div>

        {/* CARD 4: MEAN TIME TO DETECT (MTTD) */}
        <div
          onClick={() => {
            soundEngine.play('click');
            setActiveCard(activeCard === 'MTTD' ? null : 'MTTD');
          }}
          className={`bg-[#1a1b21] hover:bg-[#21232b] p-4.5 rounded-2xl border transition-all duration-300 shadow-md relative overflow-hidden group cursor-pointer ${
            activeCard === 'MTTD'
              ? 'border-[#9c88ff] ring-2 ring-[#9c88ff]/30 bg-[#21232b]'
              : 'border-[#44474f]/40 hover:border-[#9c88ff]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-[#9c88ff]/15 text-[#9c88ff] border border-[#9c88ff]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <i className="ri-time-line text-base"></i>
              </div>
              <span className="text-[11px] font-bold text-[#c4c6d0] tracking-wider uppercase">
                MEAN TIME TO DETECT (MTTD)
              </span>
            </div>
            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-[#25105c]/60 text-[#9c88ff] border border-[#9c88ff]/30">
              SLA PASSED
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-[#9c88ff] tracking-tight">
              0.42 <span className="text-xs font-normal text-[#8e9199]">SEC</span>
            </div>
            <span className="text-[10px] text-[#7f8fa6] group-hover:text-white transition-colors">
              {activeCard === 'MTTD' ? '▲ CLOSE' : '▼ DRILLDOWN'}
            </span>
          </div>

          {/* Micro Latency Gauge Comparison Bar */}
          <div className="w-full bg-[#0f0e13] h-1.5 rounded-full mt-2.5 overflow-hidden border border-[#2f3640] relative">
            <div className="bg-[#9c88ff] h-full rounded-full" style={{ width: '42%' }}></div>
          </div>

          <div className="text-[11px] text-[#4cd137] mt-2 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <i className="ri-flashlight-line text-xs"></i>
              <span>Sub-second AI Telemetry Pipeline</span>
            </span>
            <span className="text-[10px] font-bold text-[#9c88ff]">420 ms</span>
          </div>

          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#9c88ff]/10 rounded-full blur-2xl group-hover:bg-[#9c88ff]/20 transition-all"></div>
        </div>

      </div>

      {/* DYNAMIC EXPANDABLE MATERIAL DESIGN 3 DRILLDOWN DRAWER */}
      {activeCard && (
        <div className="bg-[#101116] border border-[#2f3640] rounded-2xl p-4 sm:p-5 shadow-2xl animate-fadeIn font-mono space-y-4">
          <div className="flex items-center justify-between border-b border-[#2f3640] pb-3">
            <div className="flex items-center space-x-3">
              {activeCard === 'EVENTS' && (
                <>
                  <div className="w-8 h-8 rounded-lg bg-[#00a8ff]/20 text-[#00a8ff] flex items-center justify-center">
                    <i className="ri-radar-line text-lg"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Live Capture Event Severity Distribution</h5>
                    <p className="text-xs text-[#7f8fa6] font-sans">
                      Real-time breakdown of captured threat vectors by severity priority
                    </p>
                  </div>
                </>
              )}
              {activeCard === 'SLA' && (
                <>
                  <div className="w-8 h-8 rounded-lg bg-[#4cd137]/20 text-[#4cd137] flex items-center justify-center">
                    <i className="ri-shield-check-line text-lg"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Automated Mitigation SLA & Response Health</h5>
                    <p className="text-xs text-[#7f8fa6] font-sans">
                      Automated playbook execution efficiency and incident response telemetry
                    </p>
                  </div>
                </>
              )}
              {activeCard === 'FIREWALL' && (
                <>
                  <div className="w-8 h-8 rounded-lg bg-[#fbc531]/20 text-[#fbc531] flex items-center justify-center">
                    <i className="ri-prohibited-line text-lg"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Kernel eBPF Firewall Drop Rules & Blacklist</h5>
                    <p className="text-xs text-[#7f8fa6] font-sans">
                      Line-rate hardware-accelerated eBPF packet drop table
                    </p>
                  </div>
                </>
              )}
              {activeCard === 'MTTD' && (
                <>
                  <div className="w-8 h-8 rounded-lg bg-[#9c88ff]/20 text-[#9c88ff] flex items-center justify-center">
                    <i className="ri-time-line text-lg"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">AI Telemetry Processing Pipeline Latency Breakdown</h5>
                    <p className="text-xs text-[#7f8fa6] font-sans">
                      Stage-by-stage execution latency from eBPF ring buffer to mitigation payload
                    </p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => {
                soundEngine.play('click');
                setActiveCard(null);
              }}
              className="text-[#7f8fa6] hover:text-white p-1 rounded-lg hover:bg-[#1a1b21] transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          {/* DRAWER CONTENT BY CARD TYPE */}
          {activeCard === 'EVENTS' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#ff1744]/30 space-y-1">
                <span className="text-[#ff1744] font-bold block">CRITICAL SEVERITY</span>
                <span className="text-xl font-bold text-white">{severityCounts.CRITICAL}</span>
                <span className="text-[10px] text-[#7f8fa6] block">
                  {attacks.length > 0 ? Math.round((severityCounts.CRITICAL / attacks.length) * 100) : 0}% of total
                </span>
              </div>
              <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#ff9100]/30 space-y-1">
                <span className="text-[#ff9100] font-bold block">HIGH SEVERITY</span>
                <span className="text-xl font-bold text-white">{severityCounts.HIGH}</span>
                <span className="text-[10px] text-[#7f8fa6] block">
                  {attacks.length > 0 ? Math.round((severityCounts.HIGH / attacks.length) * 100) : 0}% of total
                </span>
              </div>
              <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#ffea00]/30 space-y-1">
                <span className="text-[#ffea00] font-bold block">MEDIUM SEVERITY</span>
                <span className="text-xl font-bold text-white">{severityCounts.MEDIUM}</span>
                <span className="text-[10px] text-[#7f8fa6] block">
                  {attacks.length > 0 ? Math.round((severityCounts.MEDIUM / attacks.length) * 100) : 0}% of total
                </span>
              </div>
              <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#00e676]/30 space-y-1">
                <span className="text-[#00e676] font-bold block">LOW SEVERITY</span>
                <span className="text-xl font-bold text-white">{severityCounts.LOW}</span>
                <span className="text-[10px] text-[#7f8fa6] block">
                  {attacks.length > 0 ? Math.round((severityCounts.LOW / attacks.length) * 100) : 0}% of total
                </span>
              </div>
            </div>
          )}

          {activeCard === 'SLA' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#2f3640] space-y-1">
                <span className="text-[#7f8fa6] text-[10px] block">AUTO-PLAYBOOK SUCCESS RATE</span>
                <span className="text-lg font-bold text-[#4cd137]">99.4%</span>
                <span className="text-[10px] text-[#4cd137] block">Zero human intervention required</span>
              </div>
              <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#2f3640] space-y-1">
                <span className="text-[#7f8fa6] text-[10px] block">MEAN TIME TO RESPOND (MTTR)</span>
                <span className="text-lg font-bold text-[#00a8ff]">1.18 SEC</span>
                <span className="text-[10px] text-[#00a8ff] block">Sub-second eBPF isolation</span>
              </div>
              <div className="bg-[#1a1b21] p-3 rounded-xl border border-[#2f3640] space-y-1">
                <span className="text-[#7f8fa6] text-[10px] block">INCIDENTS RESOLVED TODAY</span>
                <span className="text-lg font-bold text-white">{totalMitigated} / {attacks.length}</span>
                <span className="text-[10px] text-[#a8e6cf] block">Full telemetry trace logged</span>
              </div>
            </div>
          )}

          {activeCard === 'FIREWALL' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-[#1a1b21] p-2.5 rounded-lg border border-[#2f3640]">
                  <span className="text-[#7f8fa6] text-[10px] block">eBPF KERNEL VERIFIER</span>
                  <span className="text-[#4cd137] font-bold">PASSED (BYTECODE VERIFIED)</span>
                </div>
                <div className="bg-[#1a1b21] p-2.5 rounded-lg border border-[#2f3640]">
                  <span className="text-[#7f8fa6] text-[10px] block">ACTIVE DROP MAP SLOTS</span>
                  <span className="text-[#fbc531] font-bold">{totalBlockedIps} / 65,536</span>
                </div>
                <div className="bg-[#1a1b21] p-2.5 rounded-lg border border-[#2f3640]">
                  <span className="text-[#7f8fa6] text-[10px] block">HARDWARE OFFLOAD</span>
                  <span className="text-[#00a8ff] font-bold">XDP / NIC ACCELERATED</span>
                </div>
                <div className="bg-[#1a1b21] p-2.5 rounded-lg border border-[#2f3640]">
                  <span className="text-[#7f8fa6] text-[10px] block">PACKET LOSS RATE</span>
                  <span className="text-[#4cd137] font-bold">0.00% (CLEAN TRAFFIC)</span>
                </div>
              </div>
            </div>
          )}

          {activeCard === 'MTTD' && (
            <div className="space-y-2 text-xs">
              <div className="space-y-1.5 bg-[#1a1b21] p-3 rounded-xl border border-[#2f3640]">
                <div className="flex justify-between">
                  <span className="text-[#7f8fa6]">1. eBPF Ring Buffer Capture</span>
                  <span className="text-[#9c88ff] font-bold">0.05s</span>
                </div>
                <div className="w-full bg-[#0f0e13] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#9c88ff] h-full" style={{ width: '12%' }}></div>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-[#7f8fa6]">2. Neural Feature Extraction</span>
                  <span className="text-[#00a8ff] font-bold">0.11s</span>
                </div>
                <div className="w-full bg-[#0f0e13] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00a8ff] h-full" style={{ width: '26%' }}></div>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-[#7f8fa6]">3. Gemini SOC Threat Classification</span>
                  <span className="text-[#fbc531] font-bold">0.18s</span>
                </div>
                <div className="w-full bg-[#0f0e13] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#fbc531] h-full" style={{ width: '43%' }}></div>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-[#7f8fa6]">4. eBPF Auto-Mitigation Trigger</span>
                  <span className="text-[#4cd137] font-bold">0.08s</span>
                </div>
                <div className="w-full bg-[#0f0e13] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#4cd137] h-full" style={{ width: '19%' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHARTS GRID: 3 CHARTS IN ONE ROW ON DESKTOP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART 1: REAL-TIME INCIDENT VELOCITY (AREA CHART) */}
        <div className="bg-[#1a1b21] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <i className="ri-pulse-fill text-[#ff1744]"></i>
                <span>Telemetry Incident Velocity Timeline</span>
              </h4>
              <p className="text-xs text-[#8e9199] font-mono">
                Severity surge monitoring across 24-hour SOC detection window
              </p>
            </div>
            <span className="text-xs font-mono text-[#ffb4ab] bg-[#93000a]/30 px-2.5 py-1 rounded-full border border-[#ffb4ab]/30 animate-pulse">
              LIVE SURGE
            </span>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff1744" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff1744" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9100" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff9100" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#36343b" />
                <XAxis dataKey="time" stroke="#8e9199" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#8e9199" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f0e13',
                    borderColor: '#44474f',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="critical" stroke="#ff1744" fillOpacity={1} fill="url(#criticalGrad)" name="CRITICAL" />
                <Area type="monotone" dataKey="high" stroke="#ff9100" fillOpacity={1} fill="url(#highGrad)" name="HIGH" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: TOP ATTACK TARGET NODES (BAR CHART) */}
        <div className="bg-[#1a1b21] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <i className="ri-global-line text-[#a8e6cf]"></i>
                <span>Top Target Geo-Nodes</span>
              </h4>
              <p className="text-xs text-[#8e9199] font-mono">
                Primary metropolitan infrastructure targets by incident count
              </p>
            </div>
            <span className="text-xs font-mono text-[#a8e6cf] bg-[#005231]/30 px-2.5 py-1 rounded-full border border-[#a8e6cf]/30">
              GLOBAL HOTSPOTS
            </span>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTargets} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#36343b" />
                <XAxis type="number" stroke="#8e9199" fontSize={11} fontFamily="monospace" />
                <YAxis dataKey="city" type="category" stroke="#c4c6d0" fontSize={11} fontFamily="sans-serif" width={90} />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: '#0f0e13',
                    borderColor: '#44474f',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#a8c7fa" radius={[0, 8, 8, 0]} name="Target Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: NETWORK PROTOCOL VOLUME (BAR CHART) */}
        <div className="bg-[#1a1b21] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#44474f]/30 pb-3 gap-2">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <i className="ri-router-line text-[#ffb951]"></i>
                <span>Protocol Traffic Spectrum</span>
              </h4>
              <p className="text-xs text-[#8e9199] font-mono">
                Multi-layer transport & application protocol inspection (L3-L7)
              </p>
            </div>

            {/* Layer Filter Pills */}
            <div className="flex items-center space-x-1 bg-[#0f0e13] p-1 rounded-xl border border-[#44474f]/60 text-[10px] font-mono">
              {(['ALL', 'L7', 'L4', 'L3'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => {
                    setSelectedLayerFilter(layer);
                    soundEngine.play('click');
                  }}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedLayerFilter === layer
                      ? 'bg-[#ffb951] text-[#3e1f00] shadow'
                      : 'text-[#8e9199] hover:text-white'
                  }`}
                >
                  {layer === 'ALL' ? 'ALL' : layer}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar inside Protocol Spectrum */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#0f0e13] p-2.5 rounded-xl border border-[#44474f]/30">
            <div>
              <span className="text-[#8e9199] text-[10px] block">TOTAL PACKETS</span>
              <span className="text-[#a8c7fa] font-bold">{totalSpectrumPackets.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[#8e9199] text-[10px] block">THREAT PAYLOADS</span>
              <span className="text-[#ffb4ab] font-bold">{totalThreatPackets.toLocaleString()}</span>
            </div>
          </div>

          <div className="h-[230px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredProtocolData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2b33" />
                <XAxis
                  dataKey="protocol"
                  stroke="#c4c6d0"
                  fontSize={10}
                  fontFamily="monospace"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis stroke="#8e9199" fontSize={10} fontFamily="monospace" />
                <Tooltip cursor={false} content={<CustomProtocolTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Volume">
                  {filteredProtocolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* INTERACTIVE THREAT ATTACK SIMULATOR & CONTROL SANDBOX */}
      <div className="bg-[#1a1b21] p-6 rounded-2xl border border-[#a8c7fa]/30 space-y-4 shadow-2xl relative overflow-hidden font-mono">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#44474f]/40 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#a8c7fa] uppercase tracking-wider">
              <i className="ri-flask-line text-sm"></i>
              <span>INTERACTIVE ATTACK SIMULATION & PENETRATION SANDBOX</span>
            </div>
            <h4 className="text-lg font-bold text-white mt-1">
              Simulate Live Cyber Attack & Verify SOC Telemetry
            </h4>
          </div>

          <button
            onClick={onClearLogs}
            className="px-3.5 py-1.5 rounded-xl bg-[#21232b] hover:bg-[#2b2d38] border border-[#44474f] text-xs text-[#c4c6d0] hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <i className="ri-delete-bin-line"></i>
            <span>FLUSH SOC FEED</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Select Vector */}
          <div className="space-y-1">
            <label className="text-[#8e9199] text-[11px] font-bold">ATTACK VECTOR TYPE</label>
            <select
              value={simulationCategory}
              onChange={(e) => setSimulationCategory(e.target.value)}
              className="w-full bg-[#0f0e13] border border-[#44474f] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8c7fa] cursor-pointer"
            >
              <option value="Ransomware">Ransomware Payload</option>
              <option value="Zero-Day Exploit">Zero-Day Kernel Exploit</option>
              <option value="DDoS Attack">L7 HTTP/2 DDoS Flood</option>
              <option value="SQL Injection">SQL Injection Exfiltration</option>
              <option value="Supply Chain Attack">Supply Chain Compromise</option>
              <option value="Buffer Overflow">Heap Buffer Overflow</option>
            </select>
          </div>

          {/* Select Severity */}
          <div className="space-y-1">
            <label className="text-[#8e9199] text-[11px] font-bold">SEVERITY OVERRIDE</label>
            <select
              value={simulationSeverity}
              onChange={(e) => setSimulationSeverity(e.target.value as any)}
              className="w-full bg-[#0f0e13] border border-[#44474f] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8c7fa] cursor-pointer"
            >
              <option value="CRITICAL">CRITICAL (Red Alert)</option>
              <option value="HIGH">HIGH (Orange Warning)</option>
              <option value="MEDIUM">MEDIUM (Yellow Notice)</option>
            </select>
          </div>

          {/* Inject Button */}
          <div className="flex items-end">
            <button
              onClick={handleRunSimulation}
              className="m3-btn-primary w-full justify-center text-xs font-bold cursor-pointer h-[38px]"
            >
              <i className="ri-play-circle-line text-base"></i>
              <span>INJECT SIMULATED ATTACK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1b21] border border-[#a8c7fa] text-white font-mono text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <i className="ri-alarm-warning-fill text-[#ff1744] text-base"></i>
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
};
