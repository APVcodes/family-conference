import SectionHeading from "@/components/SectionHeading";
import RegistrationForm from "@/components/RegistrationForm";
import { conference } from "@/lib/site-content";
import { extraRates, formatUsd, includedBenefits, packages } from "@/lib/registration";

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
            Early bird pricing ends January 31, 2027. Regular pricing starts February 1, 2027. The room rate
            follows how many people count toward occupancy. Children ages 1–5 are free and are not counted, so
            three people plus a child under 5 is priced as a family of 3. Anyone past four people in the room
            rate is added at the extra adult or child rate. A group of more than four people is noted for the
            registration team because extra room space is needed.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-brand text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Package type</th>
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
                      {item.included} {item.included === 1 ? "person" : "people"}
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
