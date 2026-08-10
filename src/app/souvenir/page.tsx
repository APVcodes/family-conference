import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { souvenirs } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Souvenir",
  description:
    "Conference souvenirs and keepsakes for the Mar Thoma Family Conference 2027.",
};

export default function SouvenirPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Conference Keepsakes"
          title="Souvenirs & memorabilia."
          description="Commemorative items to remember your time at the 2027 Family Conference. Details and ordering information will be shared closer to the event."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {souvenirs.map((item) => (
            <article
              key={item.name}
              className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-brand">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.description}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand">
                {item.status}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-brand-dark p-8 text-center text-white sm:p-10">
          <p className="text-white/80">
            Souvenir availability and pricing will be announced with registration details.
          </p>
          <Link
            href="/registration/"
            className="mt-4 inline-flex text-sm font-semibold text-accent-light hover:underline"
          >
            Check registration updates →
          </Link>
        </div>
      </div>
    </div>
  );
}
