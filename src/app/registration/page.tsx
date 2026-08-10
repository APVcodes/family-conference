import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { conference } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Registration",
  description: "Registration information for the Mar Thoma Family Conference 2027.",
};

export default function RegistrationPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Registration"
          title="Registration opens soon."
          description={conference.registration.description}
          align="center"
        />

        <div className="mt-12 rounded-2xl border border-dashed border-brand/30 bg-surface-muted p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Coming soon</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            The registration form and family sign-up guidance are being prepared. Check back
            here for updates, or reach out to the diocese office with questions in the
            meantime.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={`mailto:${conference.contactEmail}?subject=Family%20Conference%202027%20Registration%20Updates`}
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
            >
              Request updates
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
