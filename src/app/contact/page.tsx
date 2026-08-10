import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { conference } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Mar Thoma Diocese of North America about the Family Conference 2027.",
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Questions about the Family Conference?"
          description="Reach out to the Diocese office for registration updates, travel questions, or general conference information."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h3 className="text-lg font-semibold">Diocese Office</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              For questions about the Family Conference, registration, accommodations, or
              program details, please contact the Diocese of North America office.
            </p>
            <a
              href={`mailto:${conference.contactEmail}`}
              className="mt-6 inline-flex items-center gap-2 text-brand font-semibold hover:underline"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {conference.contactEmail}
            </a>
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
      </div>
    </div>
  );
}
