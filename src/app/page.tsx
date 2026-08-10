import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import VideoReels from "@/components/VideoReels";
import { aboutSections, conference } from "@/lib/site-content";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-light">
            {conference.organization}
          </p>
          <p className="mt-3 text-sm font-medium uppercase tracking-widest text-white/70">
            Family Conference · 2027
          </p>
          <h1
            className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            {conference.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {conference.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/registration/"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-accent-light"
            >
              {conference.registration.cta}
            </Link>
            <Link
              href="/about/"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore what&apos;s coming
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Plan Your Gathering"
            title="The essentials, all in one place."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Conference dates</h3>
              <p className="mt-2 text-2xl font-bold text-brand">{conference.dates}</p>
            </article>

            <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">{conference.registration.headline}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {conference.registration.description}
              </p>
              <Link
                href="/registration/"
                className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline"
              >
                Learn more →
              </Link>
            </article>

            <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Venue &amp; travel</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{conference.venue.name}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="images/venue.webp"
                alt={conference.venue.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {conference.venue.label}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                {conference.venue.name}
              </h2>
              <p className="mt-4 text-lg font-medium text-brand">{conference.dates}</p>
              <p className="mt-4 text-muted leading-relaxed">
                Join Mar Thoma families from across North America for four days of worship,
                fellowship, and community at this welcoming conference center.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="For Every Generation"
            title="A conference shaped for the whole family."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {aboutSections.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{section.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <VideoReels />

      <section className="bg-brand py-14 text-white sm:py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-3xl">
            Ready to join us in 2027?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Registration details are on the way. Sign up for updates and explore the conference
            program as it is announced.
          </p>
          <Link
            href="/registration/"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-accent-light"
          >
            {conference.registration.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
