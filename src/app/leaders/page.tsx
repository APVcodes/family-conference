import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { bishop, committee, conference, speakers } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Leaders",
  description:
    "Meet the diocesan leadership guiding the Mar Thoma Diocese of North America 36th Family Conference 2027.",
};

export default function LeadersPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Diocesan Leadership"
          title="Guided by faithful leadership."
          description="The 36th Family Conference is hosted under the spiritual guidance of the Mar Thoma Diocese of North America."
        />

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[4/5] min-h-[320px] lg:aspect-auto">
              <Image
                src={bishop.image}
                alt={bishop.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Diocesan Bishop
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                {bishop.name}
              </h2>
              <p className="mt-2 text-lg font-medium text-brand">{bishop.title}</p>
              <p className="mt-1 text-muted">{bishop.organization}</p>
              <p className="mt-6 leading-relaxed text-muted">
                Under the leadership of our Diocesan Bishop, the 36th Family Conference brings
                together parishes across North America for worship, fellowship, and shared
                mission.
              </p>
              <a
                href={conference.councilUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex text-sm font-semibold text-brand hover:underline"
              >
                View Council Members →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {speakers
            .filter((speaker) => speaker.role === "Main Speaker")
            .map((speaker) => (
              <article
                key={speaker.name}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  {speaker.role}
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
                  {speaker.name}
                </h2>
                {"office" in speaker && speaker.office ? (
                  <p className="mt-2 text-muted">{speaker.office}</p>
                ) : null}
              </article>
            ))}
        </div>

        <div className="mt-12">
          <SectionHeading
            eyebrow={conference.host}
            title="For questions, contact"
            description="Reach the MidWest Regional Activities Committee directly."
          />
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
          <p className="mt-8 text-center">
            <a
              href={`mailto:${conference.contactEmail}`}
              className="text-sm font-semibold text-brand hover:underline"
            >
              {conference.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
