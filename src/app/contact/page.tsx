import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { committee, conference } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Mar Thoma Diocese of North America about the 36th Family Conference 2027.",
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Questions about the 36th Family Conference?"
          description="Reach the MidWest Regional Activities Committee, or the Diocese office, with questions about the conference."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h3 className="text-lg font-semibold">Diocese Office</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              For questions about the 36th Family Conference, registration, accommodations, or
              program details, please contact the Mar Thoma Diocese of North America office.
            </p>
            <div className="mt-6 flex flex-col items-start gap-3">
              <a
                href={`mailto:${conference.contactEmail}`}
                className="inline-flex items-center gap-2 font-semibold text-brand hover:underline"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {conference.contactEmail}
              </a>
              <a
                href={`tel:${conference.contactPhone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 font-semibold text-brand hover:underline"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {conference.contactPhone}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-muted p-8">
            <h3 className="text-lg font-semibold">Conference details</h3>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Event
                </dt>
                <dd className="mt-1 font-medium">{conference.shortTitle}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Dates
                </dt>
                <dd className="mt-1 font-medium">{conference.dates}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Venue
                </dt>
                <dd className="mt-1 font-medium">{conference.venue.name}</dd>
                <dd className="mt-1 text-sm text-muted">{conference.venue.address}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Council
                </dt>
                <dd className="mt-1">
                  <a
                    href={conference.councilUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand hover:underline"
                  >
                    View Council Members
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
            For questions, contact
          </h2>
          <p className="mt-2 text-muted">{conference.host}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {committee.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm text-muted">{member.role}</p>
                <a
                  href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline"
                >
                  {member.phone}
                </a>
              </article>
            ))}
          </div>
          <a
            href={`mailto:${conference.contactEmail}`}
            className="mt-8 inline-flex items-center gap-2 font-semibold text-brand hover:underline"
          >
            {conference.contactEmail}
          </a>
        </div>
      </div>
    </div>
  );
}
