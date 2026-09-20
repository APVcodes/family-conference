import type { Metadata } from "next";
import Script from "next/script";
import FormesterForm from "@/components/FormesterForm";
import SectionHeading from "@/components/SectionHeading";
import { souvenirSubmission } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Submit to the Souvenir",
  description:
    "Submit photos and text for the Mar Thoma 36th Family Conference 2027 souvenir booklet.",
};

export default function SouvenirSubmitPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={souvenirSubmission.eyebrow}
          title={souvenirSubmission.title}
          description={souvenirSubmission.description}
          align="center"
        />

        <ul className="mt-8 space-y-2 rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">
          {souvenirSubmission.guidelines.map((guideline) => (
            <li key={guideline} className="flex gap-2">
              <span aria-hidden="true" className="text-brand">
                •
              </span>
              <span>{guideline}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Formester script loaded once, after the page becomes interactive */}
      <Script
        src="https://assets.formester.com/widget/standard.js"
        type="module"
        strategy="afterInteractive"
      />

      <div className="mx-auto mt-12 w-full max-w-4xl px-4 sm:px-6">
        <FormesterForm
          formId={souvenirSubmission.formesterId}
          url={souvenirSubmission.formesterUrl}
        />
      </div>
    </div>
  );
}
