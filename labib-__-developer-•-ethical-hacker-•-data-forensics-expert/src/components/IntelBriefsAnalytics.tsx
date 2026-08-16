import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Dispatch } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface IntelBriefsAnalyticsProps {
  dispatches: Dispatch[];
  onFilterCategory: (category: string) => void;
  onFilterThreat?: (threat: string) => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  dfir: 'DFIR & Kernel',
  arch: 'Zero-Trust Arch',
  offsec: 'OffSec & Fuzzing',
  ai_security: 'AI Security',
  cloud: 'Cloud & KMS',
};

const CATEGORY_COLORS: Record<string, string> = {
  dfir: '#ff5252',
  arch: '#29b6f6',
  offsec: '#ffa726',
  ai_security: '#ab47bc',
  cloud: '#66bb6a',
};

export const IntelBriefsAnalytics: React.FC<IntelBriefsAnalyticsProps> = ({
  dispatches,
  onFilterCategory,
}) => {
  // Category Breakdown Data
  const categoryData = useMemo(() => {
    const counts: Record<string, { total: number; critical: number; high: number; views: number }> = {
      dfir: { total: 0, critical: 0, high: 0, views: 0 },
      arch: { total: 0, critical: 0, high: 0, views: 0 },
      offsec: { total: 0, critical: 0, high: 0, views: 0 },
      ai_security: { total: 0, critical: 0, high: 0, views: 0 },
      cloud: { total: 0, critical: 0, high: 0, views: 0 },
    };

    dispatches.forEach((d) => {
      const cat = d.category || 'other';
      if (!counts[cat]) {
        counts[cat] = { total: 0, critical: 0, high: 0, views: 0 };
      }
      counts[cat].total += 1;
      counts[cat].views += d.viewsCount || 100;
      if (d.threatLevel === 'CRITICAL') counts[cat].critical += 1;
      if (d.threatLevel === 'HIGH') counts[cat].high += 1;
    });

    return Object.entries(counts).map(([catKey, data]) => ({
      catKey,
      name: CATEGORY_NAMES[catKey] || catKey.toUpperCase(),
      Total: data.total,
      Critical: data.critical,
      High: data.high,
      Views: data.views,
      color: CATEGORY_COLORS[catKey] || '#a8c7fa',
    }));
  }, [dispatches]);

  // Threat Level Distribution
  const threatLevelData = useMemo(() => {
    const counts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, INFORMATIONAL: 0 };
    dispatches.forEach((d) => {
      const level = d.threatLevel || 'INFORMATIONAL';
      counts[level] = (counts[level] || 0) + 1;
    });

    return [
      { name: 'CRITICAL', value: counts.CRITICAL, color: '#ff1744' },
      { name: 'HIGH', value: counts.HIGH, color: '#ff9100' },
      { name: 'MEDIUM', value: counts.MEDIUM, color: '#ffea00' },
      { name: 'INFO BRIEF', value: counts.INFORMATIONAL, color: '#00e676' },
    ];
  }, [dispatches]);

  // Top CVEs referenced
  const cveBriefs = useMemo(() => {
    return dispatches.filter((d) => d.cveReference).slice(0, 5);
  }, [dispatches]);

  const totalViews = useMemo(() => {
    return dispatches.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  }, [dispatches]);

  const criticalCount = useMemo(() => {
    return dispatches.filter((d) => d.threatLevel === 'CRITICAL').length;
  }, [dispatches]);

  return (
    <div className="space-y-6 animate-fadeIn font-sans text-white">
      
      {/* ANALYTICS HEADER */}
      <div className="bg-[#1a1b21] p-5 rounded-2xl border border-[#44474f]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#a8c7fa] uppercase tracking-wider">
            <i className="ri-bar-chart-grouped-line text-sm"></i>
            <span>INTEL BRIEF THREAT TELEMETRY & SPECTRUM</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Technical Advisory Analytics & Vulnerability Matrix
          </h3>
          <p className="text-xs text-[#c4c6d0] mt-0.5 font-sans">
            Peer-reviewed research breakdown by vulnerability discipline, CVE impact metrics, and engagement telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-[11px] text-[#8e9199]">TOTAL READERSHIP:</span>
          <span className="bg-[#004a77]/40 text-[#a8c7fa] px-3 py-1.5 rounded-xl border border-[#a8c7fa]/30 font-bold">
            {totalViews.toLocaleString()} READS
          </span>
        </div>
      </div>

      {/* METRIC HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Card 1 */}
        <div className="bg-[#1a1b21] p-4 rounded-2xl border border-[#44474f]/40 hover:border-[#a8c7fa]/50 transition-all shadow-md group">
          <div className="flex items-center justify-between text-xs text-[#8e9199]">
            <span>TOTAL ADVISORIES</span>
            <i className="ri-article-line text-base text-[#a8c7fa]"></i>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-2">
            {dispatches.length} <span className="text-xs text-[#a8c7fa] font-normal">PAPERS</span>
          </div>
          <div className="text-[11px] text-[#a8e6cf] mt-1 flex items-center space-x-1">
            <i className="ri-shield-check-line"></i>
            <span>100% Peer-Reviewed</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1a1b21] p-4 rounded-2xl border border-[#44474f]/40 hover:border-[#ffb4ab]/50 transition-all shadow-md group">
          <div className="flex items-center justify-between text-xs text-[#8e9199]">
            <span>CRITICAL CVE BRIEFS</span>
            <i className="ri-alarm-warning-line text-base text-[#ff1744]"></i>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#ff1744] mt-2">
            {criticalCount} <span className="text-xs text-[#8e9199] font-normal">ZERO-DAYS</span>
          </div>
          <div className="text-[11px] text-[#ffb4ab] mt-1 flex items-center space-x-1">
            <i className="ri-error-warning-line"></i>
            <span>Actionable Exploits & PoCs</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#1a1b21] p-4 rounded-2xl border border-[#44474f]/40 hover:border-[#ffb951]/50 transition-all shadow-md group">
          <div className="flex items-center justify-between text-xs text-[#8e9199]">
            <span>AVG READING TIME</span>
            <i className="ri-time-line text-base text-[#ffb951]"></i>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#ffb951] mt-2">
            8.5 <span className="text-xs text-[#8e9199] font-normal">MIN</span>
          </div>
          <div className="text-[11px] text-[#8e9199] mt-1 flex items-center space-x-1">
            <i className="ri-code-s-slash-line text-[#ffb951]"></i>
            <span>Includes Code & Mitigation Steps</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#1a1b21] p-4 rounded-2xl border border-[#44474f]/40 hover:border-[#d0bcff]/50 transition-all shadow-md group">
          <div className="flex items-center justify-between text-xs text-[#8e9199]">
            <span>CVE REFERENCE RATE</span>
            <i className="ri-bug-line text-base text-[#d0bcff]"></i>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#d0bcff] mt-2">
            83.3% <span className="text-xs text-[#8e9199] font-normal">INDEXED</span>
          </div>
          <div className="text-[11px] text-[#a8e6cf] mt-1 flex items-center space-x-1">
            <i className="ri-check-double-line"></i>
            <span>Mapped to NVD / OWASP LLM</span>
          </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: ADVISORY VOLUME BY DOMAIN */}
        <div className="bg-[#1a1b21] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <i className="ri-folder-shield-2-line text-[#a8c7fa]"></i>
                <span>Vulnerability Domain Spectrum</span>
              </h4>
              <p className="text-xs text-[#8e9199] font-mono">
                Distribution of research advisories across technical security disciplines
              </p>
            </div>
            <span className="text-xs font-mono text-[#a8c7fa] bg-[#004a77]/30 px-2.5 py-1 rounded-full border border-[#a8c7fa]/30">
              5 DISCIPLINES
            </span>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#36343b" />
                <XAxis dataKey="name" stroke="#c4c6d0" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#8e9199" fontSize={11} fontFamily="monospace" />
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
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#c4c6d0' }} />
                <Bar dataKey="Critical" fill="#ff1744" name="Critical Risk" radius={[4, 4, 0, 0]} />
                <Bar dataKey="High" fill="#ff9100" name="High Risk" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Total" fill="#a8c7fa" name="Total Advisories" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Domain Filter Chips */}
          <div className="pt-2 flex flex-wrap gap-2 border-t border-[#44474f]/30">
            <span className="text-[11px] font-mono text-[#8e9199] self-center mr-1">QUICK FILTER:</span>
            {categoryData.map((cat) => (
              <button
                key={cat.catKey}
                onClick={() => {
                  soundEngine.play('click');
                  onFilterCategory(cat.catKey);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#0f0e13] hover:bg-[#21232b] border border-[#44474f] text-[11px] font-mono text-[#c4c6d0] hover:text-white transition-all cursor-pointer flex items-center space-x-1"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CHART 2: THREAT LEVEL BREAKDOWN */}
        <div className="bg-[#1a1b21] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <i className="ri-pie-chart-2-line text-[#ff1744]"></i>
                <span>Threat Severity Breakdown</span>
              </h4>
              <p className="text-xs text-[#8e9199] font-mono">
                Proportion of advisories categorized by risk rating
              </p>
            </div>
            <span className="text-xs font-mono text-[#ffb4ab] bg-[#93000a]/30 px-2.5 py-1 rounded-full border border-[#ffb4ab]/30">
              SEVERITY RATINGS
            </span>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatLevelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {threatLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1a1b21" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f0e13',
                    borderColor: '#44474f',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [`${val} Advisories`, 'Count']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#c4c6d0' }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] font-mono text-[#8e9199] text-center pt-2 border-t border-[#44474f]/30">
            Click any advisory card in the main feed to open technical exploit steps & code.
          </div>
        </div>

      </div>

      {/* RECENT CVE BRIEFS TABLE SPOTLIGHT */}
      <div className="bg-[#1a1b21] p-5 rounded-2xl border border-[#44474f]/50 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#44474f]/30 pb-3">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <i className="ri-bug-2-line text-[#d0bcff]"></i>
              <span>CVE Vulnerability Spotlight Index</span>
            </h4>
            <p className="text-xs text-[#8e9199] font-mono">
              Directly mapped CVE advisories with technical PoC code attachments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cveBriefs.map((d) => (
            <div
              key={d.id}
              className="p-3.5 bg-[#0f0e13] rounded-xl border border-[#44474f]/40 hover:border-[#a8c7fa]/60 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#a8e6cf] font-bold bg-[#005231]/30 px-2 py-0.5 rounded border border-[#a8e6cf]/30">
                  {d.cveReference}
                </span>
                <span className="text-[10px] text-[#8e9199]">{d.date}</span>
              </div>
              <h5 className="text-xs font-bold text-white group-hover:text-[#a8c7fa] transition-colors line-clamp-1">
                {d.title}
              </h5>
              <p className="text-[11px] text-[#c4c6d0] line-clamp-2 font-sans">
                {d.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
