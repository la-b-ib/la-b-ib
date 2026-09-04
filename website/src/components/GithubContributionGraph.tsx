import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface DayContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  month: number;
}

interface GithubContributionGraphProps {
  username?: string;
  className?: string;
}

interface LiveGithubResponse {
  username: string;
  total: Record<string, number>;
  contributions: Array<{ date: string; count: number; level: number }>;
  publicRepos: number;
  followers: number;
  avatarUrl: string;
  cached: boolean;
  lastUpdated: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const GithubContributionGraph: React.FC<GithubContributionGraphProps> = ({
  username = 'la-b-ib',
  className = '',
}) => {
  const [liveData, setLiveData] = useState<LiveGithubResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [hoveredDay, setHoveredDay] = useState<DayContribution | null>(null);

  // Fetch real-time live data directly from the public GitHub endpoint
  const fetchLiveData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/github/contributions/${username}`);
      if (res.ok) {
        const data: LiveGithubResponse = await res.json();
        setLiveData(data);
        
        // If the live response has years, ensure the default selected year is sensible
        if (data.total) {
          const years = Object.keys(data.total).map(Number).sort((a, b) => b - a);
          if (years.length > 0 && !years.includes(selectedYear)) {
            setSelectedYear(years[0]);
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch real-time GitHub data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [username, selectedYear]);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // Extract available years from live data or provide defaults
  const availableYears = useMemo(() => {
    if (liveData?.total && Object.keys(liveData.total).length > 0) {
      return Object.keys(liveData.total)
        .map(Number)
        .filter((y) => y >= 2022)
        .sort((a, b) => b - a);
    }
    return [2026, 2025, 2024];
  }, [liveData]);

  // Compute year days matrix from real-time contributions
  const { days, total, streak, maxStreak } = useMemo(() => {
    const targetYearStr = String(selectedYear);
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    // Build map of date -> { count, level } from live payload
    const contribMap = new Map<string, { count: number; level: 0 | 1 | 2 | 3 | 4 }>();

    if (liveData?.contributions && liveData.contributions.length > 0) {
      for (const item of liveData.contributions) {
        const lvl = Math.min(4, Math.max(0, item.level || (item.count > 10 ? 4 : item.count > 5 ? 3 : item.count > 2 ? 2 : item.count > 0 ? 1 : 0))) as 0 | 1 | 2 | 3 | 4;
        contribMap.set(item.date, { count: item.count, level: lvl });
      }
    }

    const dayList: DayContribution[] = [];
    let yearTotal = 0;
    let currentStreak = 0;
    let maxStreakVal = 0;
    let tempStreak = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const month = d.getMonth();

      const liveEntry = contribMap.get(dateStr);
      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (liveEntry) {
        count = liveEntry.count;
        level = liveEntry.level;
      }

      if (count > 0) {
        tempStreak++;
        if (tempStreak > maxStreakVal) maxStreakVal = tempStreak;
      } else {
        tempStreak = 0;
      }

      yearTotal += count;

      dayList.push({
        date: dateStr,
        count,
        level,
        dayOfWeek,
        month,
      });
    }

    currentStreak = tempStreak;

    // Use reported total if available from GitHub, otherwise calculated sum
    const finalTotal = liveData?.total?.[targetYearStr] ?? yearTotal;

    return {
      days: dayList,
      total: finalTotal,
      streak: currentStreak,
      maxStreak: maxStreakVal,
    };
  }, [liveData, selectedYear]);

  // Group days into columns (weeks, Sunday-Saturday)
  const weeks = useMemo(() => {
    const cols: (DayContribution | null)[][] = [];
    let currentWeek: (DayContribution | null)[] = [];

    const firstDayOfWeek = days[0]?.dayOfWeek ?? 0;
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (const day of days) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        cols.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      cols.push(currentWeek);
    }

    return cols;
  }, [days]);

  // Calculate month label offsets for the header
  const monthLabels = useMemo(() => {
    const labels: { month: string; colIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, colIdx) => {
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay && firstValidDay.month !== lastMonth) {
        lastMonth = firstValidDay.month;
        labels.push({
          month: MONTH_NAMES[firstValidDay.month],
          colIndex: colIdx,
        });
      }
    });

    return labels;
  }, [weeks]);

  // Get color for contribution level
  const getCellColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0:
        return 'bg-[#13141a] border border-[#21232b] hover:border-[#44474f]';
      case 1:
        return 'bg-[#0e4429] border border-[#006d32]/40 hover:border-[#26a641]';
      case 2:
        return 'bg-[#006d32] border border-[#26a641]/50 hover:border-[#39d353]';
      case 3:
        return 'bg-[#26a641] border border-[#39d353]/70 hover:border-[#a8e6cf] shadow-sm shadow-[#26a641]/20';
      case 4:
        return 'bg-[#39d353] border border-[#a8e6cf] hover:brightness-110 shadow-sm shadow-[#39d353]/40';
      default:
        return 'bg-[#13141a] border border-[#21232b]';
    }
  };

  const handleCellHover = (day: DayContribution | null) => {
    if (day) {
      setHoveredDay(day);
      if (day.count > 0) {
        soundEngine.play('terminal_key');
      }
    }
  };

  return (
    <div className={`mt-6 bg-transparent border-0 transition-all font-mono ${className}`}>
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#21232b]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#13141a] border border-[#21232b] text-[#a8c7fa] flex items-center justify-center text-lg shrink-0">
            <i className="ri-github-fill"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                GITHUB TELEMETRY
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-sans px-1.5 py-0.5 rounded bg-[#003824] text-[#a8e6cf] border border-[#006d32]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd137] animate-pulse"></span>
                LIVE API
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#a8c7fa] hover:underline flex items-center gap-1 font-sans"
              >
                @{username}
                <i className="ri-external-link-line text-[10px]"></i>
              </a>
              {liveData?.lastUpdated && (
                <span className="text-[10px] text-[#8e9199] font-sans">
                  • Synced
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Year Filter Buttons & Live Refresh */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 bg-[#13141a] border border-[#21232b] p-1 rounded-xl w-fit">
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => {
                  setSelectedYear(yr);
                  soundEngine.play('click');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border-0 ${
                  selectedYear === yr
                    ? 'bg-[#a8c7fa] text-[#00325b] shadow-sm'
                    : 'text-[#8e9199] hover:text-white'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              soundEngine.play('click');
              fetchLiveData(true);
            }}
            disabled={isRefreshing}
            className="w-7 h-7 rounded-xl bg-[#13141a] border border-[#21232b] text-[#a8c7fa] hover:text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Live GitHub Telemetry"
            aria-label="Refresh Live GitHub Telemetry"
          >
            <i className={`ri-refresh-line text-xs ${isRefreshing ? 'animate-spin' : ''}`}></i>
          </button>
        </div>
      </div>

      {/* Telemetry Summary Stats Row - Styled Exactly Like Dispatch Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4 font-mono">
        {/* Card 1: ANNUAL COMMITS */}
        <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
          <div className="h-[30px] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[15px] font-bold text-[#a8e6cf]">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8e6cf] text-[#003822] flex items-center justify-center text-base font-bold shadow-sm">
                <i className="ri-git-commit-line"></i>
              </div>
              <span className="truncate">COMMITS</span>
            </div>
          </div>
          <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-xl font-bold text-[#a8e6cf] font-mono tracking-tight leading-[20px]">
              {isLoading ? '...' : total.toLocaleString()}
            </span>
            <span className="text-xs text-[#8e9199] font-mono">ANNUAL</span>
          </div>
        </div>

        {/* Card 2: LONGEST STREAK */}
        <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
          <div className="h-[30px] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[15px] font-bold text-[#d0bcff]">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-[#d0bcff] text-[#381e72] flex items-center justify-center text-base font-bold shadow-sm">
                <i className="ri-fire-line"></i>
              </div>
              <span className="truncate">BEST STREAK</span>
            </div>
          </div>
          <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-xl font-bold text-[#d0bcff] font-mono tracking-tight leading-[20px]">
              {isLoading ? '...' : `${maxStreak}`}
            </span>
            <span className="text-xs text-[#8e9199] font-mono">DAYS PEAK</span>
          </div>
        </div>

        {/* Card 3: ACTIVE STREAK */}
        <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
          <div className="h-[30px] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[15px] font-bold text-[#fdd663]">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-[#fdd663] text-[#422c00] flex items-center justify-center text-base font-bold shadow-sm">
                <i className="ri-pulse-line"></i>
              </div>
              <span className="truncate">ACTIVE STREAK</span>
            </div>
          </div>
          <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-xl font-bold text-[#fdd663] font-mono tracking-tight leading-[20px]">
              {isLoading ? '...' : `${streak}`}
            </span>
            <span className="text-xs text-[#8e9199] font-mono">DAYS CONT</span>
          </div>
        </div>

        {/* Card 4: PUBLIC REPOS */}
        <div className="h-[105px] bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col justify-between">
          <div className="h-[30px] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[15px] font-bold text-[#a8c7fa]">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-[#a8c7fa] text-[#00325b] flex items-center justify-center text-base font-bold shadow-sm">
                <i className="ri-git-repository-line"></i>
              </div>
              <span className="truncate">REPOSITORIES</span>
            </div>
          </div>
          <div className="h-[38px] bg-[#13141a] border-0 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-xl font-bold text-[#a8c7fa] font-mono tracking-tight leading-[20px]">
              {liveData?.publicRepos ? liveData.publicRepos : '12'}
            </span>
            <span className="text-xs text-[#8e9199] font-mono">PUBLIC PROD</span>
          </div>
        </div>
      </div>

      {/* Contribution Heatmap Grid - 25% Enlarged View */}
      <div className="relative mt-2">
        <div className="overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:#44474f_transparent]">
          <div className="min-w-[775px] select-none">
            {/* Month Labels Bar */}
            <div className="flex text-[12px] text-[#8e9199] mb-1.5 pl-7 relative h-5">
              {monthLabels.map((lbl, idx) => (
                <span
                  key={idx}
                  className="absolute"
                  style={{ left: `${lbl.colIndex * 14.5 + 30}px` }}
                >
                  {lbl.month}
                </span>
              ))}
            </div>

            {/* Matrix Body: Day labels + Week columns */}
            <div className="flex items-start gap-1.5">
              {/* Day of Week Labels */}
              <div className="flex flex-col justify-between text-[12px] text-[#8e9199] h-[98px] pr-1.5 pt-[2px]">
                <span className="leading-none">Mon</span>
                <span className="leading-none">Wed</span>
                <span className="leading-none">Fri</span>
              </div>

              {/* 52 Week Columns */}
              <div className="flex gap-[3px]">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px]">
                    {week.map((day, dIdx) => {
                      if (!day) {
                        return (
                          <div
                            key={dIdx}
                            className="w-[11.5px] h-[11.5px] rounded-[3px] bg-transparent opacity-0 pointer-events-none"
                          />
                        );
                      }

                      const isSelected = hoveredDay?.date === day.date;

                      return (
                        <div
                          key={dIdx}
                          onMouseEnter={() => handleCellHover(day)}
                          onClick={() => handleCellHover(day)}
                          className={`w-[11.5px] h-[11.5px] rounded-[3px] transition-transform cursor-pointer ${getCellColor(
                            day.level
                          )} ${isSelected ? 'scale-125 z-10 ring-1 ring-white' : 'hover:scale-125'}`}
                          title={`${day.count} contributions on ${day.date}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hover / Tap Tooltip Status Indicator & Legend Container (Styled like Endorsements Header Container) */}
        <div className="mt-3 bg-[#21232b] border-0 p-3.5 rounded-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px]">
          <div className="text-[12px] text-[#c4c6d0] min-h-[20px] flex items-center gap-1.5 flex-wrap">
            {hoveredDay ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-[#a8e6cf] animate-pulse"></span>
                <span className="font-bold text-white text-[12px]">{hoveredDay.count} contribution{hoveredDay.count !== 1 ? 's' : ''}</span>
                <span className="text-[#8e9199] text-[12px]">on</span>
                <span className="text-[#a8c7fa] text-[12px] font-bold">{hoveredDay.date}</span>
              </>
            ) : (
              <span className="text-[#8e9199] text-[12px]">
                Hover or tap any square to inspect daily commit density
              </span>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-1.5 text-[12px] text-[#8e9199] shrink-0 self-end sm:self-auto">
            <span className="text-[12px]">Less</span>
            <div className="w-[11.5px] h-[11.5px] rounded-[2.5px] bg-[#13141a] border border-[#21232b]" />
            <div className="w-[11.5px] h-[11.5px] rounded-[2.5px] bg-[#0e4429] border border-[#006d32]/40" />
            <div className="w-[11.5px] h-[11.5px] rounded-[2.5px] bg-[#006d32] border border-[#26a641]/50" />
            <div className="w-[11.5px] h-[11.5px] rounded-[2.5px] bg-[#26a641] border border-[#39d353]/70" />
            <div className="w-[11.5px] h-[11.5px] rounded-[2.5px] bg-[#39d353] border border-[#a8e6cf]" />
            <span className="text-[12px]">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};
