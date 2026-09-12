import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PlaceDirectionsList from "@/components/PlaceDirectionsList";
import SectionHeading from "@/components/SectionHeading";
import { chicagoFoodSpots, chicagoLandmarks, extremeFoodiesMap } from "@/lib/chicago-places";
import { conference } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Chicago",
  description:
    "Explore Chicago landmarks and food spots with map directions for the Mar Thoma North America 36th Family Conference 2027.",
};

const highlights = [
  {
    title: "Willis Tower",
    description:
      "Chicago’s iconic skyline landmark and one of the tallest buildings in the Western Hemisphere — a must-see symbol of the city.",
  },
  {
    title: "Lakefront & parks",
    description:
      "Miles of Lake Michigan shoreline, Grant Park, and Millennium Park make summer gatherings feel open, walkable, and welcoming.",
  },
  {
    title: "Travel-friendly hub",
    description:
      "Two major airports and strong transit connections make Chicago an accessible meeting point for families across North America.",
  },
];

export default function ChicagoPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-brand-dark text-white">
        <Image
          src="/images/willis-tower.jpg"
          alt="Willis Tower and Chicago skyline"
          fill
          priority
          className="object-cover object-center opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-light">
            Host city
          </p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Chicago, Illinois
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            The 36th Family Conference gathers near one of North America’s great cities —
            a place of skyline views, lakefront walks, and easy travel for families coming
            from near and far.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#landmarks"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-accent-light"
            >
              Landmarks
            </a>
            <a
              href="#food"
              className="inline-flex items-center justify-center rounded-full border border-white/35 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Food spots
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Why Chicago"
            title="A landmark city for a landmark gathering."
            description="Oak Brook puts the conference in a comfortable suburban venue while keeping downtown Chicago close enough for day trips and memorable family outings."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="landmarks" className="scroll-mt-24 bg-surface-muted py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Landmarks"
            title="Places worth putting on the map."
            description="Tap Directions to open Google Maps from your phone or computer."
            titleId="landmarks-heading"
          />
          <div className="mt-10">
            <PlaceDirectionsList places={chicagoLandmarks} headingId="landmarks-heading" />
          </div>
        </div>
      </section>

      <section id="food" className="scroll-mt-24 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Food spots"
            title="Popular places to eat in Chicago."
            description="A short list of well-known Chicago favorites — deep dish, dogs, and more — each with a directions link."
            titleId="food-heading"
          />
          <div className="mt-10">
            <PlaceDirectionsList places={chicagoFoodSpots} headingId="food-heading" />
          </div>

          <aside className="mt-8 flex flex-col gap-4 border border-brand/20 bg-brand/[0.04] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                For extreme foodies
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">
                {extremeFoodiesMap.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                {extremeFoodiesMap.blurb}
              </p>
            </div>
            <a
              href={extremeFoodiesMap.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
            >
              Open map
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </aside>
        </div>
      </section>

      <section className="bg-surface-muted py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/double-tree.jpg"
              alt={conference.venue.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Conference venue
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
              {conference.venue.name}
            </h2>
            <p className="mt-2 text-muted">{conference.venue.address}</p>
            <p className="mt-4 leading-relaxed text-muted">
              Families will gather at the Double Tree by Hilton in Oak Brook — about 15–20
              miles west of downtown Chicago — with city skyline day trips an easy option
              during your stay.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(conference.venue.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
              >
                Directions to venue
              </a>
              <Link
                href="/registration/"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
              >
                {conference.registration.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
