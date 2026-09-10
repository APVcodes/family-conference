"use client";

import { useState } from "react";
import type { AgendaDay } from "@/lib/site-content";

export default function AgendaPreview({ days }: { days: AgendaDay[] }) {
  const [index, setIndex] = useState(0);
  const agenda = days[index];
  const canGoPrev = index > 0;
  const canGoNext = index < days.length - 1;

  function goPrev() {
    if (!canGoPrev) return;
    setIndex((current) => current - 1);
  }

  function goNext() {
    if (!canGoNext) return;
    setIndex((current) => current + 1);
  }

  return (
    <aside className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-light">
            {agenda.dayLabel}
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
            {agenda.date}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Preview
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Previous day"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              aria-label="Next day"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm text-white/70">{agenda.note}</p>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-white/50">
        Day {index + 1} of {days.length}
      </p>
      <ol className="mt-5 space-y-3">
        {agenda.items.map((item) => (
          <li
            key={`${agenda.date}-${item.time}-${item.title}`}
            className="grid grid-cols-[5.5rem_1fr] gap-3 border-t border-white/10 pt-3 first:border-t-0 first:pt-0"
          >
            <p className="text-sm font-semibold tabular-nums text-accent-light">
              {item.time}
            </p>
            <div>
              <p className="text-sm font-semibold leading-snug">{item.title}</p>
              <p className="mt-0.5 text-xs text-white/65">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
