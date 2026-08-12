import type { Metadata } from "next";
import Script from "next/script";
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
          title="Registration Form"
          description={conference.registration.description}
          align="center"
        />
      </div>

      {/* Formester script loaded once, after the page becomes interactive */}
      <Script
        src="https://assets.formester.com/widget/standard.js"
        type="module"
        strategy="afterInteractive"
      />

      <div className="mx-auto mt-12 w-full max-w-4xl px-4 sm:px-6">
        <formester-standard-form
          set-auto-height="true"
          height="100%"
          width="100%"
          id="8Cci8mm9c"
          url="https://aihrkgqy.formester.com/f/8Cci8mm9c"
          className="block w-full"
        ></formester-standard-form>
      </div>
    </div>
  );
}