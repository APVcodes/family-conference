import type { Metadata } from "next";
import Script from "next/script";
import FormesterForm from "@/components/FormesterForm";
import SectionHeading from "@/components/SectionHeading";
import { conference, pricing } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Registration",
  description: "Registration information for the Mar Thoma 36th Family Conference 2027.",
};

export default function RegistrationPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Registration"
          title="Registration Form"
          description={conference.registration.description}
          align="center"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[pricing.earlyBird, pricing.regular].map((tier) => (
            <div
              key={tier.label}
              className="rounded-2xl border border-border bg-surface-muted p-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-brand">
                {tier.label}
              </h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Single</dt>
                  <dd className="font-semibold">{tier.single}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Double</dt>
                  <dd className="font-semibold">{tier.double}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Family of 4</dt>
                  <dd className="font-semibold">{tier.family}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>

      {/* Formester script loaded once, after the page becomes interactive */}
      <Script
        src="https://assets.formester.com/widget/standard.js"
        type="module"
        strategy="afterInteractive"
      />

      <div className="mx-auto mt-12 w-full max-w-4xl px-4 sm:px-6">
        <FormesterForm />
      </div>
    </div>
  );
}