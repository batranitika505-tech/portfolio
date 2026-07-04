'use client';

import { motion } from 'framer-motion';
import { GitCommit, Star, Users, FolderKanban, Activity, Flame, Trophy, MapPin, Calendar, ArrowUpRight, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

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

function calculateStreaks(contributions: ContributionDay[]) {
  let longestStreak = 0;
  let tempStreak = 0;

  // contributions are sorted chronologically
  contributions.forEach((day) => {
    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let currentStreak = 0;
  const revContribs = [...contributions].reverse();
  const hasRecentCommits = revContribs.some(c => (c.date === todayStr || c.date === yesterdayStr) && c.count > 0);

  if (hasRecentCommits) {
    for (const day of revContribs) {
      if (day.date > todayStr) continue;
      if (day.count > 0) {
        currentStreak++;
      } else {
        if (currentStreak > 0) break;
      }
    }
  }

  return { currentStreak, longestStreak };
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

  const fetchGithubData = async () => {
    try {
      // 1. Fetch contributions calendar
      const calendarRes = await fetch('/api/github-contributions');
      const calendarData = await calendarRes.json();
      
      const rawContributions: ContributionDay[] = calendarData.contributions || [];
      
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

      // Apply overrides (e.g. for private contributions not scraped by the public API)
      const overriddenContributions = pastAndPresentContributions.map(day => {
        if (LOCAL_OVERRIDES[day.date]) {
          return {
            ...day,
            count: LOCAL_OVERRIDES[day.date].count,
            level: LOCAL_OVERRIDES[day.date].level
          };
        }
        return day;
      });

      // Slices last 371 days ending on today (to show 53 weeks)
      const rollingContributions = overriddenContributions.slice(-371);
      
      const totalInYear = rollingContributions.reduce((acc, curr) => acc + curr.count, 0);

      // 2. Fetch user profile
      const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
      const profileData = await profileRes.json();

      // 3. Fetch user repositories (to calculate total stars)
      const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
      const reposData = await reposRes.json();
      const starsSum = Array.isArray(reposData) 
        ? reposData.reduce((acc, curr) => acc + (curr.stargazers_count || 0), 0)
        : 0;

      // Streaks calculation (using all historical data up to today for accurate streak logs)
      const { currentStreak, longestStreak } = calculateStreaks(overriddenContributions);

      const joinedYear = profileData.created_at 
        ? new Date(profileData.created_at).getFullYear() 
        : 2025;

      setData({
        avatarUrl: profileData.avatar_url || 'https://avatars.githubusercontent.com/u/228721586?v=4',
        name: profileData.name || 'Nitika',
        login: profileData.login || GITHUB_USERNAME,
        location: profileData.location || 'India',
        publicRepos: profileData.public_repos || 0,
        followers: profileData.followers || 0,
        following: profileData.following || 0,
        totalContributions: totalInYear,
        currentStreak,
        longestStreak,
        contributions: rollingContributions,
        joinedYear,
        stars: starsSum
      });
    } catch (error) {
      console.error('Error fetching Github stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGithubData();
  }, []);

  const handleSync = () => {
    setRefreshing(true);
    fetchGithubData();
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
                  className="w-[11px] h-[11px] transition-all duration-200 hover:scale-125 hover:brightness-125"
                  style={getLevelStyle(day.level)}
                  onMouseEnter={(e) => handleMouseEnter(e, day)}
                  onMouseLeave={handleMouseLeave}
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
              Click to view details
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="projects" className="relative w-full py-32 px-4 sm:px-10 max-w-6xl mx-auto flex flex-col justify-center">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 flex items-center gap-4">
            <Activity className="w-10 h-10 text-emerald-400 animate-pulse" /> Open Source
          </h2>
          <p className="text-white/50 mt-3 max-w-xl font-light">
            A live window into my open source contributions, coding consistency, and technical milestones.
          </p>
        </div>

        <button 
          onClick={handleSync}
          disabled={loading || refreshing}
          className="px-5 py-2.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-none font-mono text-sm text-white/80 group"
        >
          <RefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-700 ${refreshing ? 'animate-spin' : ''}`} />
          Sync with GitHub
        </button>
      </div>

      {loading ? (
        <GithubSkeleton />
      ) : data ? (
        <div className="space-y-8">
          {/* Consistency Graph Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full p-8 rounded-3xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl relative"
          >
            {/* Header info */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Consistency Graph</h3>
                <p className="text-xs text-white/40 mt-1">Daily contribution frequency over the past year</p>
              </div>

              {/* Legend – GitHub dark mode colours */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase">
                <span>Less</span>
                {LEVEL_COLORS.map((color, i) => (
                  <div key={i} className="w-[10px] h-[10px]" style={{ backgroundColor: color, borderRadius: '2px' }} />
                ))}
                <span>More</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            {renderCalendar()}

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
              <span className="text-sm text-white/50 font-light">
                <span className="text-emerald-400 font-semibold">{data.totalContributions.toLocaleString()}</span> contributions in the last year
              </span>
              <a 
                href={`https://github.com/${GITHUB_USERNAME}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-none font-medium"
              >
                Learn more on GitHub <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-3xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl flex flex-col justify-between"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={data.avatarUrl} 
                  alt={data.name} 
                  className="w-16 h-16 rounded-2xl border border-white/10 object-cover"
                />
                <div>
                  <h4 className="text-lg font-bold text-white leading-tight">{data.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-white/40 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-white/30" /> {data.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/40 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-white/30" /> Member since {data.joinedYear}
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-2 mt-8 pt-6 border-t border-white/5 text-center">
                <div>
                  <div className="text-lg font-bold text-white">{data.publicRepos}</div>
                  <div className="text-[10px] text-white/40 font-mono uppercase mt-0.5">Repos</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{data.stars}</div>
                  <div className="text-[10px] text-white/40 font-mono uppercase mt-0.5">Stars</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{data.followers}</div>
                  <div className="text-[10px] text-white/40 font-mono uppercase mt-0.5">Follow</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{data.totalContributions}</div>
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
              className="p-8 rounded-3xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Flame className="w-24 h-24 text-orange-500" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div className="mt-8">
                <div className="text-xs text-white/40 font-mono uppercase">Current Streak</div>
                <div className="text-5xl font-black text-white mt-2 font-sans tracking-tight">{data.currentStreak}</div>
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
              className="p-8 rounded-3xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Trophy className="w-24 h-24 text-yellow-500" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="mt-8">
                <div className="text-xs text-white/40 font-mono uppercase">Longest Streak</div>
                <div className="text-5xl font-black text-white mt-2 font-sans tracking-tight">{data.longestStreak}</div>
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
