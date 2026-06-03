"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { fetchRepos, type Repo } from "@/lib/github";
import { ProjectCard } from "@/components/project-card";
import { SearchBar } from "@/components/search-bar";
import { Skeleton } from "@/components/ui/skeleton";

const ACCENT = "#b9a3f5";

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function ProjectsPage() {
  const reduced = useReducedMotion() ?? false;
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    fetchRepos()
      .then((r) => active && setRepos(r))
      .catch((e: Error) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!repos) return [];
    const q = query.trim().toLowerCase();
    if (!q) return repos;
    return repos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.language?.toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q)),
    );
  }, [repos, query]);

  return (
    <div className="flex min-h-screen flex-col px-6 py-8 sm:px-20 sm:py-16 lg:px-32">
      {/* Header */}
      <header className="flex items-center justify-between font-sans text-sm">
        <Link
          href="/"
          className="group flex min-h-[40px] items-center gap-2 text-neutral-400 transition-colors hover:text-white"
        >
          <span
            aria-hidden
            className="transition-transform duration-200 ease-out group-hover:-translate-x-1"
          >
            ←
          </span>
          back
        </Link>
        <nav className="flex gap-6 lowercase tracking-wide text-neutral-400">
          <span className="flex min-h-[40px] items-center" style={{ color: ACCENT }}>
            projects
          </span>
          <a
            href="mailto:a3sharia@uwaterloo.ca"
            className="flex min-h-[40px] items-center transition-colors hover:text-white"
          >
            contact
          </a>
        </nav>
      </header>

      {/* Main */}
      <main className="mt-10 flex-1 sm:mt-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-bold uppercase leading-[0.95] tracking-[-0.03em] text-[clamp(2rem,6vw,4rem)]">
            Projects
          </h1>
          <p className="mt-3 font-mono text-sm text-neutral-500">
            Live from{" "}
            <a
              href="https://github.com/alish2001"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-300 underline-offset-4 hover:underline"
            >
              github.com/alish2001
            </a>{" "}
            · sorted by recent activity
            {repos ? ` · ${repos.length} repos` : ""}
          </p>
        </motion.div>

        <div className="mt-8 max-w-md">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="mt-10">
          {error ? (
            <div className="rounded-xl ring-1 ring-foreground/10 p-6 font-mono text-sm text-neutral-400">
              {error}
            </div>
          ) : !repos ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="font-mono text-sm text-neutral-500">
              No projects match{" "}
              <span style={{ color: ACCENT }}>&ldquo;{query}&rdquo;</span>.
            </p>
          ) : (
            <motion.div
              initial={reduced ? false : "hidden"}
              animate="show"
              variants={gridContainer}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((repo) => (
                <motion.div key={repo.id} variants={gridItem}>
                  <ProjectCard repo={repo} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
