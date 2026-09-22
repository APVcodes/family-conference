import { theme } from "@/lib/site-content";

const sequence = ["Conference Theme", theme.title, theme.malayalam, theme.verse];

export default function ThemeBanner() {
  const track = [...sequence, ...sequence];

  return (
    <div className="overflow-hidden bg-brand-dark text-white" aria-hidden="true">
      <div className="theme-marquee flex w-max py-2.5">
        {track.map((text, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-[0.15em] sm:text-sm"
          >
            {text}
            <span className="ml-6 text-accent-light">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
