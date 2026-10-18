'use client';

import { motion } from 'framer-motion';
import { Activity, Flame, Trophy, MapPin, Calendar, ArrowUpRight, RefreshCw } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

import { calculateStreaks, ContributionDay } from '@/lib/portfolio-utils';

interface GithubData {
  avatarUrl: string;
  name: string;
  login: string;
  location: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  contributions: ContributionDay[];
  joinedYear: number;
  stars: number;
}

const LOCAL_OVERRIDES: Record<string, { count: number; level: number }> = {
  '2026-06-23': { count: 1, level: 1 } // Override to show June 23rd contribution
};

const GITHUB_USERNAME = 'batranitika505-tech';

// GitHub dark mode contribution colors (exact match)
const LEVEL_COLORS = [
  '#161b22', // 0 – none
  '#0e4429', // 1 – first quartile
  '#006d32', // 2 – second quartile
  '#26a641', // 3 – third quartile
  '#39d353', // 4 – fourth quartile
];

function getLevelStyle(level: number): React.CSSProperties {
  return {
    backgroundColor: LEVEL_COLORS[level] ?? LEVEL_COLORS[0],
    borderRadius: '2px',
  };
}

function GithubSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      <div className="w-full p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl">
        <div className="h-6 w-48 bg-white/10 rounded mb-6" />
        <div className="flex gap-1 overflow-hidden pb-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="w-3 h-3 rounded-sm bg-white/5" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 rounded-3xl bg-black/40 border border-white/10 p-8" />
        <div className="h-64 rounded-3xl bg-black/40 border border-white/10 p-8" />
        <div className="h-64 rounded-3xl bg-black/40 border border-white/10 p-8" />
      </div>
    </div>
  );
}

export default function Github() {
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<{
    day: ContributionDay;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, day: ContributionDay) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = e.currentTarget.closest('.calendar-container') as HTMLElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      setHoveredDay({
        day,
        x: rect.left - parentRect.left + parent.scrollLeft + rect.width / 2,
        y: rect.top - parentRect.top + parent.scrollTop - 8,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const processPayload = useCallback((calendarData: {
    contributions?: ContributionDay[];
    profile?: {
      avatarUrl?: string;
      name?: string;
      login?: string;
      location?: string;
      publicRepos?: number;
      followers?: number;
      following?: number;
      joinedYear?: number;
      stars?: number;
    };
  }) => {
    const rawContributions: ContributionDay[] = calendarData.contributions || [];
    const profileData = calendarData.profile || {};
    
    // Sort chronologically (earliest to latest)
    const sortedContributions = rawContributions.sort((a, b) => a.date.localeCompare(b.date));

    // Get local today's date in YYYY-MM-DD
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    // Filter to keep only days up to today
    const pastAndPresentContributions = sortedContributions.filter(c => c.date <= todayStr);

    // Apply overrides
    const overriddenContributions = pastAndPresentContributions.map(item => {
      if (LOCAL_OVERRIDES[item.date]) {
        return {
          ...item,
          count: LOCAL_OVERRIDES[item.date].count,
          level: LOCAL_OVERRIDES[item.date].level
        };
      }
      return item;
    });

    // Slices last 371 days ending on today (to show 53 weeks)
    const rollingContributions = overriddenContributions.slice(-371);
    const totalInYear = rollingContributions.reduce((acc, curr) => acc + curr.count, 0);

    // Streaks calculation
    const { currentStreak, longestStreak } = calculateStreaks(overriddenContributions);

    setData({
      avatarUrl: profileData.avatarUrl || 'https://avatars.githubusercontent.com/u/228721586?v=4',
      name: profileData.name || 'Nitika',
      login: profileData.login || GITHUB_USERNAME,
      location: profileData.location || 'India',
      publicRepos: profileData.publicRepos || 0,
      followers: profileData.followers || 0,
      following: profileData.following || 0,
      totalContributions: totalInYear,
      currentStreak,
      longestStreak,
      contributions: rollingContributions,
      joinedYear: profileData.joinedYear || 2025,
      stars: profileData.stars || 0
    });
  }, []);

  const loadGithubData = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      const res = await fetch(`/api/github-contributions${refresh ? '?refresh=true' : ''}`);
      if (!res.ok) throw new Error('Failed to fetch from GitHub API route');
      const payload = await res.json();
      processPayload(payload);
    } catch (error) {
      console.error('Error fetching Github stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [processPayload]);

  useEffect(() => {
    let ignore = false;
    const fetchInitial = async () => {
      try {
        const res = await fetch('/api/github-contributions');
        if (!res.ok) throw new Error('API fetch failed');
        const payload = await res.json();
        if (!ignore) {
          processPayload(payload);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setLoading(false);
        }
      }
    };
    fetchInitial();
    return () => {
      ignore = true;
    };
  }, [processPayload]);

  const handleSync = () => {
    loadGithubData(true);
  };

  // Group daily contributions into columns/weeks (each week has 7 days)
  const renderCalendar = () => {
    if (!data) return null;
    const days = [...data.contributions];
    
    // Split into arrays of 7 elements
    const columns: ContributionDay[][] = [];
    while (days.length > 0) {
      columns.push(days.splice(0, 7));
    }

    return (
      <div className="relative calendar-container">
        <div className="flex gap-1 overflow-x-auto pb-4 scrollbar-thin select-none">
          {columns.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1 flex-shrink-0">
              {week.map((day) => (
                <div
                  key={day.date}
                  role="button"
                  tabIndex={0}
                  aria-label={`${day.count} contributions on ${formatDate(day.date)}`}
                  className="w-[11px] h-[11px] transition-all duration-200 hover:scale-125 hover:brightness-125 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  style={getLevelStyle(day.level)}
                  onMouseEnter={(e) => handleMouseEnter(e, day)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    window.open(`https://github.com/${GITHUB_USERNAME}?tab=overview&from=${day.date}&to=${day.date}`, '_blank', 'noopener,noreferrer');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      window.open(`https://github.com/${GITHUB_USERNAME}?tab=overview&from=${day.date}&to=${day.date}`, '_blank', 'noopener,noreferrer');
                    }
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Custom Tooltip */}
        {hoveredDay && (
          <div
            className="absolute z-30 pointer-events-none p-3 rounded-lg border border-white/10 bg-neutral-950/90 backdrop-blur-md shadow-xl text-left select-none -translate-x-1/2 -translate-y-full flex flex-col gap-0.5"
            style={{
              left: hoveredDay.x,
              top: hoveredDay.y,
            }}
          >
            <div className="text-xs font-semibold text-emerald-400">
              {hoveredDay.day.count} contributions
            </div>
            <div className="text-[10px] text-white/95 whitespace-nowrap">
              {formatDate(hoveredDay.day.date)}
            </div>
            <div className="text-[9px] text-white/40 italic mt-1 whitespace-nowrap">
              Click to open day on GitHub
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="github" className="relative w-full py-20 sm:py-32 px-4 sm:px-8 md:px-10 max-w-6xl mx-auto flex flex-col justify-center">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 sm:mb-16">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 flex items-center gap-3 sm:gap-4">
            <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 animate-pulse" /> Open Source
          </h2>
          <p className="text-white/50 text-sm sm:text-base mt-2 sm:mt-3 max-w-xl font-light">
            A live window into my open source contributions, coding consistency, and technical milestones.
          </p>
        </div>

        <button 
          onClick={handleSync}
          disabled={loading || refreshing}
          className="px-4 sm:px-5 py-2.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-pointer font-mono text-xs sm:text-sm text-white/80 group min-h-[44px]"
        >
          <RefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-700 ${refreshing ? 'animate-spin' : ''}`} />
          Sync with GitHub
        </button>
      </div>

      {loading ? (
        <GithubSkeleton />
      ) : data ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Consistency Graph Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full p-5 sm:p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl relative"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Consistency Graph</h3>
                <p className="text-xs text-white/40 mt-0.5 sm:mt-1">Daily contribution frequency over the past year</p>
              </div>

              {/* Legend – GitHub dark mode colours */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase self-end sm:self-auto">
                <span>Less</span>
                {LEVEL_COLORS.map((color, i) => (
                  <div key={i} className="w-[10px] h-[10px]" style={{ backgroundColor: color, borderRadius: '2px' }} />
                ))}
                <span>More</span>
              </div>
            </div>

            {/* Mobile swipe helper */}
            <div className="sm:hidden text-[10px] text-white/40 font-mono mb-2 flex items-center gap-1">
              Swipe horizontally to view all weeks ↔
            </div>

            {/* Heatmap Grid */}
            {renderCalendar()}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mt-6 pt-4 border-t border-white/5">
              <span className="text-xs sm:text-sm text-white/50 font-light">
                <span className="text-emerald-400 font-semibold">{data.totalContributions.toLocaleString()}</span> contributions in the last year
              </span>
              <a 
                href={`https://github.com/${GITHUB_USERNAME}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium min-h-[36px] items-center"
              >
                Learn more on GitHub <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl flex flex-col justify-between sm:col-span-2 md:col-span-1"
            >
              <div className="flex items-center gap-4">
                <Image 
                  src={data.avatarUrl} 
                  alt={data.name} 
                  width={64}
                  height={64}
                  className="rounded-2xl border border-white/10 object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-base sm:text-lg font-bold text-white leading-tight truncate">{data.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-white/40 mt-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" /> {data.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/40 mt-0.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-white/30 shrink-0" /> Member since {data.joinedYear}
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mt-6 sm:mt-8 pt-6 border-t border-white/5 text-center">
                <div>
                  <div className="text-base sm:text-lg font-bold text-white">{data.publicRepos}</div>
                  <div className="text-[10px] text-white/40 font-mono uppercase mt-0.5">Repos</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-white">{data.stars}</div>
                  <div className="text-[10px] text-white/40 font-mono uppercase mt-0.5">Stars</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-white">{data.followers}</div>
                  <div className="text-[10px] text-white/40 font-mono uppercase mt-0.5">Follow</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-white">{data.totalContributions}</div>
                  <div className="text-[10px] text-white/40 font-mono uppercase mt-0.5">Contrib</div>
                </div>
              </div>
            </motion.div>

            {/* Current Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden group min-h-[220px]"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Flame className="w-20 sm:w-24 h-20 sm:h-24 text-orange-500" />
              </div>
              <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Flame className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500" />
              </div>
              <div className="mt-6 sm:mt-8">
                <div className="text-xs text-white/40 font-mono uppercase">Current Streak</div>
                <div className="text-4xl sm:text-5xl font-black text-white mt-1 sm:mt-2 font-sans tracking-tight">{data.currentStreak}</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Days active
                </div>
              </div>
            </motion.div>

            {/* Longest Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden group min-h-[220px]"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="w-20 sm:w-24 h-20 sm:h-24 text-yellow-500" />
              </div>
              <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Trophy className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-500" />
              </div>
              <div className="mt-6 sm:mt-8">
                <div className="text-xs text-white/40 font-mono uppercase">Longest Streak</div>
                <div className="text-4xl sm:text-5xl font-black text-white mt-1 sm:mt-2 font-sans tracking-tight">{data.longestStreak}</div>
                <div className="flex items-center gap-1.5 text-xs text-yellow-500 mt-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  All time record
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      ) : null}
    </section>
  );
}
