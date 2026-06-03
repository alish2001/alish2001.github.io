import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { timeAgo, type Repo } from "@/lib/github";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  Rust: "#dea584",
  Go: "#00add8",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Ruby: "#701516",
  Swift: "#f05138",
  Kotlin: "#a97bff",
  Dart: "#00b4ab",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

export function ProjectCard({ repo }: { repo: Repo }) {
  const langColor = repo.language ? LANG_COLORS[repo.language] ?? "#9ca3af" : null;
  const topics = repo.topics.slice(0, 4);

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${repo.name} on GitHub`}
      className="group block rounded-xl transition active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9a3f5]"
    >
      <Card className="h-full transition duration-200 group-hover:-translate-y-0.5 group-hover:ring-[#b9a3f5]/50 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3 font-mono">
            <span className="truncate transition-colors group-hover:text-[#b9a3f5]">
              {repo.name}
            </span>
            {repo.stargazers_count > 0 && (
              <span className="flex shrink-0 items-center gap-1 text-xs font-normal text-neutral-500 tabular-nums">
                <span aria-hidden>★</span>
                {repo.stargazers_count}
              </span>
            )}
          </CardTitle>
          <CardDescription className="line-clamp-2 min-h-[2.5rem] text-pretty">
            {repo.description ?? "No description provided."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-neutral-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-between font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            {langColor && (
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ backgroundColor: langColor }}
              />
            )}
            {repo.language ?? "—"}
          </span>
          <span>Updated {timeAgo(repo.pushed_at)}</span>
        </CardFooter>
      </Card>
    </a>
  );
}
