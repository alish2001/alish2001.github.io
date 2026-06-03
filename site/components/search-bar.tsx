"use client";

import { useState } from "react";

const ACCENT = "#b9a3f5";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/**
 * A flat, underline-only search field (no box). The native caret is tinted
 * with the accent color; when the field is empty and unfocused we show a
 * decorative blinking block cursor + hint for a terminal-prompt feel.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "search projects…",
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const showHint = value.length === 0 && !focused;

  return (
    <div
      className="relative w-full border-b border-neutral-700 transition-colors focus-within:border-(--accent)"
      style={{ ["--accent" as string]: ACCENT }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Search projects"
        autoComplete="off"
        spellCheck={false}
        className="w-full bg-transparent py-3 font-mono text-base text-neutral-100 caret-(--accent) outline-none"
      />
      {showHint && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-[1.15em] w-[0.5em]"
            style={{
              backgroundColor: ACCENT,
              animation: "cursor-blink 1.05s linear infinite",
            }}
          />
          <span className="font-mono text-base text-neutral-600">
            {placeholder}
          </span>
        </span>
      )}
    </div>
  );
}
