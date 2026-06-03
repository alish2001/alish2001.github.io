"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
  GithubIcon,
  LinkedInIcon,
  MailIcon,
  ResumeIcon,
} from "@/components/icons";

const ACCENT = "#b9a3f5";
const LINES = ["Ali", "Shariatmadari"] as const;

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/alish2001",
    Icon: GithubIcon,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alish2001",
    Icon: LinkedInIcon,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:a3sharia@uwaterloo.ca",
    Icon: MailIcon,
    external: false,
  },
  {
    label: "Resume",
    href: "/Ali_Shariatmadari_Resume.pdf",
    Icon: ResumeIcon,
    external: true,
  },
] as const;

const SPEED = 70; // ms per character
const START_DELAY = 350; // ms before typing begins
const LINE_PAUSE = 260; // ms pause when the cursor drops to line 2

/** Types each line out character-by-character, tracking the cursor position. */
function useTypewriter(reduced: boolean) {
  const [typed, setTyped] = useState<string[]>(() => LINES.map(() => ""));
  const [activeLine, setActiveLine] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setTyped(LINES.map((l) => l));
      setActiveLine(LINES.length - 1);
      setDone(true);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let li = 0;
    let ci = 0;

    const tick = () => {
      if (cancelled) return;
      if (li >= LINES.length) {
        setDone(true);
        return;
      }
      const line = LINES[li];
      if (ci <= line.length) {
        setActiveLine(li);
        setTyped((prev) => {
          const next = [...prev];
          next[li] = line.slice(0, ci);
          return next;
        });
        ci += 1;
        timers.push(setTimeout(tick, SPEED));
      } else {
        li += 1;
        ci = 0;
        timers.push(setTimeout(tick, LINE_PAUSE));
      }
    };

    timers.push(setTimeout(tick, START_DELAY));
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  return { typed, activeLine, done };
}

function Cursor({ blink }: { blink: boolean }) {
  return (
    <span
      aria-hidden
      className="ml-[0.08em] inline-block h-[0.78em] w-[0.5em] translate-y-[0.04em] align-baseline"
      style={{
        backgroundColor: ACCENT,
        animation: blink ? "cursor-blink 1.05s linear infinite" : undefined,
      }}
    />
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Home() {
  const reduced = useReducedMotion() ?? false;
  const { typed, activeLine, done } = useTypewriter(reduced);

  // Reveal the supporting content as the name finishes typing.
  const contentDelay = reduced ? 0 : 1.5;

  return (
    <div className="flex min-h-screen flex-1 flex-col px-6 py-8 sm:px-20 sm:py-16 lg:px-32">
      {/* Top nav */}
      <motion.header
        initial={reduced ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-end"
      >
        <nav className="flex gap-6 font-sans text-sm lowercase tracking-wide text-neutral-400">
          <a
            href="#projects"
            className="flex min-h-[40px] items-center px-1 transition-colors hover:text-white"
          >
            projects
          </a>
          <a
            href="#contact"
            className="flex min-h-[40px] items-center px-1 transition-colors hover:text-white"
          >
            contact
          </a>
        </nav>
      </motion.header>

      {/* Hero */}
      <main className="flex flex-1 flex-col justify-center">
        <h1
          className="font-bold uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2rem,8vw,7rem)]"
          style={{ minHeight: "1.8em" }}
          aria-label="Ali Shariatmadari"
        >
          <span className="block text-neutral-100" aria-hidden>
            {typed[0]}
            {activeLine === 0 && !done && <Cursor blink={false} />}
          </span>
          <span className="block" style={{ color: ACCENT }} aria-hidden>
            {typed[1]}
            {(activeLine === 1 || done) && <Cursor blink={done} />}
          </span>
        </h1>

        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          transition={{ staggerChildren: 0.1, delayChildren: contentDelay }}
        >
          <motion.p
            variants={fadeUp}
            className="mt-8 text-base font-medium text-neutral-200 sm:text-lg"
          >
            Software Engineer @ Robinhood
            <span className="mx-2 text-neutral-600">·</span>
            UWaterloo Software Engineering &rsquo;25
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-neutral-400 sm:text-lg"
          >
            I build things that are technically deep and genuinely useful — from
            robotics, game engines, and programming languages to AI-powered HCI
            systems, computer graphics, and scalable infrastructure. I care
            about correctness, performance, and code that lasts.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-xl text-sm leading-relaxed text-pretty text-neutral-600"
          >
            Previously @ BitGo, PostGrid, Capsule, Bloq, and TD Bank.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-xs font-medium uppercase tracking-[0.18em]"
          >
            <a
              href="#projects"
              className="group flex min-h-[40px] items-center gap-2 font-semibold transition-opacity hover:opacity-80"
              style={{ color: ACCENT }}
            >
              Projects
              <span
                aria-hidden
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </a>

            <div className="-ml-2 flex items-center gap-1">
              {SOCIALS.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  {...(external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="inline-flex size-10 items-center justify-center text-neutral-400 transition hover:text-white active:scale-[0.96]"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
