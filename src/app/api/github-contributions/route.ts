import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const username = 'batranitika505-tech';
  const url = `https://github.com/users/${username}/contributions`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 }, // Disable Next.js fetch cache to ensure real-time data
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch from GitHub: ${res.statusText}` }, { status: res.status });
    }

    const html = await res.text();

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

    const contributions: { date: string; count: number; level: number }[] = [];
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

    // Sort contributions chronologically (earliest to latest)
    contributions.sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ contributions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
