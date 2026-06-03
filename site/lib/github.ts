export type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  pushed_at: string;
  created_at: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
};

const USER = "alish2001";
const CACHE_KEY = `gh:repos:${USER}`;
const TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches public repos for the user straight from the GitHub REST API
 * (unauthenticated — uses the visitor's IP, 60 req/hr). Results are cached in
 * sessionStorage for 10 minutes so navigating around doesn't burn the limit.
 */
export async function fetchRepos(): Promise<Repo[]> {
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const { ts, data } = JSON.parse(raw) as { ts: number; data: Repo[] };
        if (Date.now() - ts < TTL_MS) return data;
      }
    } catch {
      // ignore malformed cache
    }
  }

  const res = await fetch(
    `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&direction=desc`,
    { headers: { Accept: "application/vnd.github+json" } },
  );

  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      throw new Error(
        "GitHub's API rate limit was hit (60 requests/hr per IP). Give it a few minutes and refresh.",
      );
    }
    throw new Error(`Couldn't reach GitHub (HTTP ${res.status}).`);
  }

  const data = (await res.json()) as Repo[];
  const repos = data
    .filter((r) => !r.fork)
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at));

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ ts: Date.now(), data: repos }),
      );
    } catch {
      // storage full / unavailable — non-fatal
    }
  }

  return repos;
}

/** Compact relative time, e.g. "3 days ago". */
export function timeAgo(iso: string): string {
  const diffSec = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    if (Math.abs(diffSec) >= secs) return rtf.format(-Math.round(diffSec / secs), unit);
  }
  return "just now";
}
