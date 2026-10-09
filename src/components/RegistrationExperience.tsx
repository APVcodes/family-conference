import SectionHeading from "@/components/SectionHeading";
import RegistrationForm from "@/components/RegistrationForm";
import { conference } from "@/lib/site-content";
import { extraRates, formatUsd, includedBenefits, packageIncludedText, packages } from "@/lib/registration";

export default function RegistrationExperience() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Registration"
          title="All-inclusive conference package"
          description="This year, registration is one package. The room rate is set from the people you list."
          align="center"
        />

        <section className="mt-10 rounded-2xl border border-brand/20 bg-brand/5 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-brand">Included in your registration fee</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">
            {includedBenefits.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-0.5 text-brand" aria-hidden="true">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {conference.dates} · {conference.venue.name}, {conference.venue.address}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Package rates</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Early bird pricing ends January 31, 2027. Regular pricing starts February 1, 2027. Adult rates apply
            to ages 13 and older, child rates to ages 6–12, and children ages 1–5 are free.
          </p>
          <details className="mt-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm">
            <summary className="cursor-pointer font-semibold text-brand">How pricing works</summary>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted">
              <li>One room is one base package. Your party is matched to the largest package it fully fills.</li>
              <li>
                Anyone beyond what the package includes in that room is added at the extra adult or extra child
                rate, for example 1 adult and 1 child is Single Occupancy plus one extra child.
              </li>
              <li>
                A room holds a maximum of four people, children ages 1–5 included. For a group of more than four,
                fill out the registration and someone from our team will contact you to complete it.
              </li>
              <li>Every registration needs at least one adult (13+). Children ages 1–5 are free.</li>
            </ul>
          </details>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-brand text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Base Package Type</th>
                  <th className="px-4 py-3 font-semibold">Early bird</th>
                  <th className="px-4 py-3 font-semibold">Regular</th>
                  <th className="px-4 py-3 font-semibold">Included</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((item) => (
                  <tr key={item.id} className="border-t border-border odd:bg-surface even:bg-surface-muted">
                    <td className="px-4 py-3 font-medium">{item.label}</td>
                    <td className="px-4 py-3">{formatUsd(item.earlyBird)}</td>
                    <td className="px-4 py-3">{formatUsd(item.regular)}</td>
                    <td className="px-4 py-3">
                      {packageIncludedText(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="bg-brand text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Beyond the package</th>
                  <th className="px-4 py-3 font-semibold">Early bird</th>
                  <th className="px-4 py-3 font-semibold">Regular</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border bg-surface">
                  <td className="px-4 py-3 font-medium">Extra adult (ages 13+)</td>
                  <td className="px-4 py-3">{formatUsd(extraRates.adult.earlyBird)}</td>
                  <td className="px-4 py-3">{formatUsd(extraRates.adult.regular)}</td>
                </tr>
                <tr className="border-t border-border bg-surface-muted">
                  <td className="px-4 py-3 font-medium">Extra child (ages 6–12)</td>
                  <td className="px-4 py-3">{formatUsd(extraRates.child.earlyBird)}</td>
                  <td className="px-4 py-3">{formatUsd(extraRates.child.regular)}</td>
                </tr>
                <tr className="border-t border-border bg-surface">
                  <td className="px-4 py-3 font-medium">Child (ages 1–5)</td>
                  <td className="px-4 py-3">Free</td>
                  <td className="px-4 py-3">Free</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-10">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
