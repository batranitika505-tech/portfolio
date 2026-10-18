import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache on server/edge for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get('refresh') === 'true';
  const username = 'batranitika505-tech';
  const contributionsUrl = `https://github.com/users/${username}/contributions`;

  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };

  const token = process.env.GITHUB_TOKEN;
  const apiHeaders: Record<string, string> = {
    'User-Agent': 'Portfolio-App',
    Accept: 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchOptions: RequestInit = forceRefresh
    ? { cache: 'no-store' }
    : { next: { revalidate: 3600 } };

  try {
    // 1. Fetch Contributions HTML
    const contribRes = await fetch(contributionsUrl, {
      headers,
      ...fetchOptions,
    });

    const contributions: { date: string; count: number; level: number }[] = [];

    if (contribRes.ok) {
      const html = await contribRes.text();
      const tdMatches = html.match(/<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g) || [];
      const tooltipMatches = html.match(/<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g) || [];

      const tooltips: Record<string, string> = {};
      for (const match of tooltipMatches) {
        const forId = match.match(/for="([^"]+)"/)?.[1];
        const text = match.replace(/<[^>]+>/g, '').trim();
        if (forId && text) {
          tooltips[forId] = text;
        }
      }

      for (const match of tdMatches) {
        const date = match.match(/data-date="([^"]+)"/)?.[1];
        const id = match.match(/id="([^"]+)"/)?.[1];
        const level = parseInt(match.match(/data-level="([^"]+)"/)?.[1] || '0', 10);

        if (date && id) {
          const tooltipText = tooltips[id] || '';
          let count = 0;
          if (tooltipText) {
            const countMatch = tooltipText.match(/^([0-9]+)\s+contribution/i);
            if (countMatch) {
              count = parseInt(countMatch[1], 10);
            } else if (tooltipText.toLowerCase().startsWith('no ')) {
              count = 0;
            }
          }
          contributions.push({ date, count, level });
        }
      }
      contributions.sort((a, b) => a.date.localeCompare(b.date));
    }

    // 2. Fetch Profile & Repo Stats on the Server Side (cached, rate-limit safe)
    let profileData: Record<string, unknown> | null = null;
    let starsSum = 0;

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers: apiHeaders, ...fetchOptions }),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers: apiHeaders, ...fetchOptions }),
      ]);

      if (userRes.ok) {
        profileData = await userRes.json();
      }
      if (reposRes.ok) {
        const repos = await reposRes.json();
        if (Array.isArray(repos)) {
          starsSum = repos.reduce((acc: number, curr: Record<string, unknown>) => acc + (Number(curr.stargazers_count) || 0), 0);
        }
      }
    } catch {
      // Fallback if upstream GitHub API rate limit is reached
    }

    const profile = {
      avatarUrl: profileData?.avatar_url || 'https://avatars.githubusercontent.com/u/228721586?v=4',
      name: profileData?.name || 'Nitika',
      login: profileData?.login || username,
      location: profileData?.location || 'India',
      publicRepos: typeof profileData?.public_repos === 'number' ? profileData.public_repos : 2,
      followers: typeof profileData?.followers === 'number' ? profileData.followers : 0,
      following: typeof profileData?.following === 'number' ? profileData.following : 0,
      joinedYear: profileData?.created_at ? new Date(String(profileData.created_at)).getFullYear() : 2025,
      stars: starsSum,
    };

    return NextResponse.json(
      { contributions, profile },
      {
        headers: {
          'Cache-Control': forceRefresh
            ? 'no-cache, no-store'
            : 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error', contributions: [], profile: null },
      { status: 500 }
    );
  }
}
