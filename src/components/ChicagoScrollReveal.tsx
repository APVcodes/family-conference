"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function stageOpacity(progress: number, start: number, end: number) {
  if (progress < start) return 0;
  if (progress > end) return 1;
  return (progress - start) / (end - start);
}

export default function ChicagoScrollReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.visualViewport?.height ?? window.innerHeight;
      const total = section.offsetHeight - viewport;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      setProgress(clamp(-rect.top / total));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.visualViewport?.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.visualViewport?.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const titleOpacity = stageOpacity(progress, 0.08, 0.28);
  const titleY = (1 - titleOpacity) * 28;
  const cityOpacity = stageOpacity(progress, 0.32, 0.5);
  const cityY = (1 - cityOpacity) * 24;
  const ctaOpacity = stageOpacity(progress, 0.55, 0.72);
  const ctaY = (1 - ctaOpacity) * 20;
  const imageScale = 1.12 - progress * 0.12;
  const overlay = 0.35 + progress * 0.28;

  return (
    <section
      ref={sectionRef}
      className="relative h-[260vh] bg-brand-dark"
      aria-label="Chicago conference introduction"
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `scale(${imageScale})`,
            backgroundImage: "url(/images/willis-tower.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-brand-dark"
          style={{ opacity: overlay }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/40"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center text-white">
          <p
            className="max-w-4xl font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight tracking-tight will-change-transform sm:text-5xl lg:text-6xl"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            North American Mar Thoma
            <span className="block text-accent-light">Family Conference 2027</span>
          </p>

          <p
            className="mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-white/90 will-change-transform sm:text-base"
            style={{
              opacity: cityOpacity,
              transform: `translateY(${cityY}px)`,
            }}
          >
            Chicago, Illinois
          </p>

          <div
            className="mt-10 will-change-transform"
            style={{
              opacity: ctaOpacity,
              transform: `translateY(${ctaY}px)`,
              pointerEvents: ctaOpacity > 0.4 ? "auto" : "none",
            }}
          >
            <Link
              href="/chicago/"
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-accent-light hover:bg-accent hover:text-brand-dark"
            >
              Learn more about Chicago
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
