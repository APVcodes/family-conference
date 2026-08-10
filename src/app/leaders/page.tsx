import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { bishop, conference } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Leaders",
  description:
    "Meet the diocesan leadership guiding the Mar Thoma North America Family Conference 2027.",
};

export default function LeadersPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Diocesan Leadership"
          title="Guided by faithful leadership."
          description="The Family Conference is hosted under the spiritual guidance of the Diocese of North America."
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
                Under the leadership of our Diocesan Bishop, the Family Conference brings
                together parishes across North America for worship, fellowship, and shared
                mission. Additional council and committee members will be listed here as
                conference planning continues.
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

        <div className="mt-12 rounded-2xl bg-surface-muted p-8 text-center sm:p-10">
          <p className="text-muted">
            Additional conference committee members and parish representatives will be
            announced as planning progresses.
          </p>
          <Link
            href="/contact/"
            className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline"
          >
            Contact the diocese office →
          </Link>
        </div>
      </div>
    </div>
  );
}
