import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { conference } from "@/lib/site-content";

export default function RegistrationComingSoon() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Registration"
          title="Registration opens soon"
          description="We are putting the finishing touches on registration. Please check back shortly."
          align="center"
        />

        <section className="mt-10 rounded-2xl border border-brand/20 bg-brand/5 p-6 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Coming soon</p>
          <h2 className="mt-2 text-lg font-semibold">36th Family Conference 2027</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {conference.dates} · {conference.venue.name}, {conference.venue.address}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/chicago/"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              Explore Chicago
            </Link>
            <Link
              href="/contact/"
              className="rounded-full border border-brand/30 px-5 py-2.5 text-sm font-semibold text-brand"
            >
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
