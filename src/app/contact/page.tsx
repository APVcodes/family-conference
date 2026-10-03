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
          description="Reach the MidWest Regional Activities Committee with questions about the conference."
        />

        <div className="mt-12 rounded-2xl border border-border bg-surface-muted p-8">
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
