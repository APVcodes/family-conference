import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { aboutSections, conference } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the Mar Thoma North America Diocese Family Conference 2027 — a gathering for every generation.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About the Conference"
          title="A welcoming gathering for Mar Thoma families."
          description={conference.subtitle}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6 text-muted leading-relaxed">
            <p>
              The Mar Thoma North America Diocese Family Conference brings together families
              from parishes across the continent for worship, fellowship, and spiritual
              renewal. It is a time to reconnect with friends, meet new members of our
              diocesan community, and grow together in faith.
            </p>
            <p>
              Whether you are attending with young children, teenagers, or as an empty-nester
              couple, the conference is designed to offer meaningful experiences for every
              generation. Program details, devotional resources, and activity schedules will
              be shared as planning progresses.
            </p>
            <p>
              Conference dates are <strong className="text-foreground">{conference.dates}</strong>,
              hosted at the{" "}
              <strong className="text-foreground">{conference.venue.name}</strong>.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-muted p-8">
            <h3 className="text-lg font-semibold">At a glance</h3>
            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Dates
                </dt>
                <dd className="mt-1 font-medium">{conference.dates}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Location
                </dt>
                <dd className="mt-1 font-medium">{conference.venue.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Host
                </dt>
                <dd className="mt-1 font-medium">{conference.organization}</dd>
              </div>
            </dl>
            <Link
              href="/contact/"
              className="mt-8 inline-flex text-sm font-semibold text-brand hover:underline"
            >
              Have questions? Contact us →
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <SectionHeading
            eyebrow="For Every Generation"
            title="Something for everyone in the family."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {aboutSections.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{section.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
