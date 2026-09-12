import type { ChicagoPlace } from "@/lib/chicago-places";
import { mapsDirectionsUrl } from "@/lib/chicago-places";

export default function PlaceDirectionsList({
  places,
  headingId,
}: {
  places: ChicagoPlace[];
  headingId: string;
}) {
  return (
    <ol className="divide-y divide-border border-y border-border" aria-labelledby={headingId}>
      {places.map((place, index) => (
        <li
          key={place.name}
          className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
        >
          <div className="min-w-0">
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-semibold tabular-nums text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{place.name}</h3>
            </div>
            <p className="mt-1 max-w-2xl pl-8 text-sm leading-relaxed text-muted sm:pl-9">
              {place.blurb}
            </p>
          </div>
          <a
            href={mapsDirectionsUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-brand transition-colors hover:border-brand hover:bg-brand hover:text-white sm:self-center"
          >
            Directions
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </a>
        </li>
      ))}
    </ol>
  );
}
