"use client";

import { useEffect, useState } from "react";
import { registrationEndpoint } from "@/lib/registration-endpoint";
import {
  ageCategories,
  ageCategoryById,
  currentPricingTier,
  formatUsd,
  installmentDueLabel,
  installmentsAvailable,
  paymentMethodOptions,
  paymentSchedule,
  priceForMethod,
  quoteRegistration,
  regions,
  testInstallmentAmount,
  testInstallmentDueLabel,
  testPaymentAmount,
  type PaymentMethod,
  type PaymentPlan,
  type AgeCategory,
  type BillingRole,
} from "@/lib/registration";

type Participant = {
  id: string;
  name: string;
  category: AgeCategory | "";
  hasAllergy: "yes" | "no" | "";
  allergies: string;
};

const billingLabels: Record<BillingRole, string> = {
  included: "Included in package",
  "extra-adult": "Extra adult",
  "extra-child": "Extra child",
  free: "Free",
};

const tierLabels = {
  earlyBird: "Early bird (through January 31, 2027)",
  regular: "Regular (from February 1, 2027)",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-brand";

function newParticipant(): Participant {
  return { id: crypto.randomUUID(), name: "", category: "", hasAllergy: "", allergies: "" };
}

function digits(value: string) {
  return value.replace(/\D/g, "");
}

export default function RegistrationForm() {
  const tier = currentPricingTier();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [parish, setParish] = useState("");
  const [region, setRegion] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([newParticipant()]);
  const [airportTransportation, setAirportTransportation] = useState<"yes" | "no" | "">("");
  const [accessibilityNeeded, setAccessibilityNeeded] = useState<"yes" | "no" | "">("");
  const [accessibilityDetails, setAccessibilityDetails] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>("full");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [testCode, setTestCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTestCode(params.get("test")?.trim() ?? "");
    if (params.get("payment") === "cancelled") {
      setError("Payment was cancelled. Your registration was not saved.");
    }
  }, []);

  const quote = quoteRegistration(
    participants.map((person) => person.category),
    tier,
  );
  const testMode = testCode.length > 0;
  const cardInstallments = (installmentsAvailable() && paymentMethod === "card") || testMode;
  const selectedPlan: PaymentPlan = cardInstallments ? paymentPlan : "full";
  const schedule = paymentSchedule(quote.total, selectedPlan);
  const testInstallments = testMode && selectedPlan === "installments";
  const fullPrice =
    !testMode && paymentMethod && quote.occupancy > 0
      ? priceForMethod(quote.total, "full", paymentMethod)
      : null;
  const installmentPrice =
    !testMode && paymentMethod === "card" && quote.occupancy > 0
      ? priceForMethod(quote.total, "installments", "card")
      : null;
  const priced = selectedPlan === "installments" ? installmentPrice : fullPrice;
  const dueToday = testInstallments
    ? testInstallmentAmount
    : testMode
      ? testPaymentAmount
      : (priced?.dueToday ?? schedule.dueToday);
  const balanceDueLabel = testInstallments ? testInstallmentDueLabel() : installmentDueLabel;

  function updateParticipant(id: string, patch: Partial<Participant>) {
    setParticipants((current) =>
      current.map((person) => (person.id === id ? { ...person, ...patch } : person)),
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Enter the registrant’s first and last name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address for the confirmation.");
      return;
    }
    if (digits(phone).length < 10) {
      setError("Enter a phone number for the registrant.");
      return;
    }
    if (!parish.trim() || !region) {
      setError("Enter the parish and region.");
      return;
    }
    if (participants.some((person) => !person.name.trim() || !person.category)) {
      setError("Add a name and age group for each participant.");
      return;
    }
    if (participants.some((person) => !person.hasAllergy)) {
      setError("Tell us whether each participant has allergies.");
      return;
    }
    if (participants.some((person) => person.hasAllergy === "yes" && !person.allergies.trim())) {
      setError("List the allergies for each participant who has them.");
      return;
    }
    if (quote.occupancy < 1) {
      setError("Include at least one participant age 6 or older. Children ages 1–5 are free and do not set the room rate.");
      return;
    }
    if (!airportTransportation) {
      setError("Tell us whether airport transportation is needed.");
      return;
    }
    if (!accessibilityNeeded) {
      setError("Tell us whether accessibility accommodations are needed.");
      return;
    }
    if (accessibilityNeeded === "yes" && !accessibilityDetails.trim()) {
      setError("Describe the accessibility accommodations you need.");
      return;
    }
    if (!emergencyName.trim() || digits(emergencyPhone).length < 10) {
      setError("Enter an emergency contact name and phone number.");
      return;
    }
    if (!testMode && !paymentMethod) {
      setError("Choose a payment method.");
      return;
    }
    if (!disclaimerAccepted) {
      setError("Please acknowledge the payment disclaimer before submitting.");
      return;
    }
    if (!registrationEndpoint) {
      setError(
        "This form is not connected to Google Sheets yet. Deploy google-apps-script/registration.gs and paste the web app URL into src/lib/registration-endpoint.ts.",
      );
      return;
    }

    const people = participants.map((person, index) => {
      const category = person.category as AgeCategory;
      const billing = quote.lines[index]?.billing ?? "included";
      return {
        name: person.name.trim(),
        category,
        categoryLabel: ageCategoryById(category).label,
        billing,
        billingLabel: billingLabels[billing],
        hasAllergy: person.hasAllergy === "yes" ? "Yes" : "No",
        allergies: person.hasAllergy === "yes" ? person.allergies.trim() : "",
      };
    });

    const payload = {
      action: "create-checkout",
      origin: window.location.origin,
      website,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      parish: parish.trim(),
      region,
      airportTransportation: airportTransportation === "yes" ? "Yes" : "No",
      accessibilityNeeded: accessibilityNeeded === "yes" ? "Yes" : "No",
      accessibilityDetails: accessibilityNeeded === "yes" ? accessibilityDetails.trim() : "",
      emergencyName: emergencyName.trim(),
      emergencyPhone: emergencyPhone.trim(),
      disclaimerAccepted: true,
      paymentPlan: selectedPlan,
      paymentMethod: paymentMethod || "card",
      testCode,
      participants: people,
      quote: {
        tier,
        tierLabel: tierLabels[tier],
        packageLabel: quote.packageLabel,
        packagePrice: quote.packagePrice,
        extraAdults: quote.extraAdults,
        extraAdultRate: quote.extraAdultRate,
        extraChildren: quote.extraChildren,
        extraChildRate: quote.extraChildRate,
        freeChildren: quote.freeChildren,
        occupancy: quote.occupancy,
        partySize: quote.partySize,
        needsExtraRoom: quote.needsExtraRoom,
        roomNote: quote.roomNote,
        total: quote.total,
      },
    };

    setSubmitting(true);
    try {
      const response = await fetch(registrationEndpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });
      const result = (await response.json()) as { ok?: boolean; url?: string; error?: string };
      if (!response.ok || !result.ok || !result.url) {
        throw new Error(result.error || "Payment could not be started.");
      }
      window.location.assign(result.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not start payment. Please try again in a moment.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold">Registrant</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            First name
            <input className={inputClass} value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" required />
          </label>
          <label className="block text-sm font-medium">
            Last name
            <input className={inputClass} value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" required />
          </label>
          <label className="block text-sm font-medium sm:col-span-2">
            Email
            <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            <span className="mt-1.5 block text-xs font-normal text-muted">
              The confirmation, with your full submission, is sent to this address.
            </span>
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input className={inputClass} type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" required />
          </label>
          <label className="block text-sm font-medium">
            Parish
            <input className={inputClass} value={parish} onChange={(event) => setParish(event.target.value)} required />
          </label>
          <label className="block text-sm font-medium">
            Region
            <select className={inputClass} value={region} onChange={(event) => setRegion(event.target.value)} required>
              <option value="">Select a region</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold">Participants</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          List everyone in this registration, including yourself. The room rate is chosen from this list.
          Children ages 1–5 are free and are not counted, so three people plus a child under 5 is priced as
          a family of 3. Young Adult is ages 13–35, Adult is ages 36–59, and Senior is ages 60 and older.
          Those three groups use the adult rate. Ages 6–12 use the child rate when the group is larger than
          the room rate.
        </p>
        <div className="mt-5 space-y-4">
          {participants.map((person, index) => (
            <div key={person.id} className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <label className="block text-sm font-medium">
                Name
                <input
                  className={inputClass}
                  value={person.name}
                  onChange={(event) => updateParticipant(person.id, { name: event.target.value })}
                  required
                />
              </label>
              <label className="block text-sm font-medium">
                Age group
                <select
                  className={inputClass}
                  value={person.category}
                  onChange={(event) =>
                    updateParticipant(person.id, { category: event.target.value as AgeCategory | "" })
                  }
                  required
                >
                  <option value="">Select an age group</option>
                  {ageCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-muted hover:text-foreground disabled:opacity-40"
                disabled={participants.length === 1}
                onClick={() => setParticipants((current) => current.filter((item) => item.id !== person.id))}
              >
                Remove
              </button>
              <fieldset className="sm:col-span-3">
                <legend className="text-sm font-medium">Any allergies?</legend>
                <div className="mt-2 flex gap-6 text-sm font-normal">
                  {(["yes", "no"] as const).map((value) => (
                    <label key={value} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name={`allergy-${person.id}`}
                        checked={person.hasAllergy === value}
                        onChange={() =>
                          updateParticipant(person.id, {
                            hasAllergy: value,
                            allergies: value === "no" ? "" : person.allergies,
                          })
                        }
                        required
                      />
                      {value === "yes" ? "Yes" : "No"}
                    </label>
                  ))}
                </div>
              </fieldset>
              {person.hasAllergy === "yes" && (
                <label className="block text-sm font-medium sm:col-span-3">
                  Allergies
                  <textarea
                    className={`${inputClass} min-h-20`}
                    value={person.allergies}
                    onChange={(event) => updateParticipant(person.id, { allergies: event.target.value })}
                    placeholder="List each allergy"
                    required
                  />
                </label>
              )}
              {person.category && quote.lines[index] && (
                <p className="text-xs font-medium text-brand sm:col-span-3">
                  {billingLabels[quote.lines[index].billing]}
                </p>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-brand hover:underline"
          onClick={() => setParticipants((current) => [...current, newParticipant()])}
        >
          Add a participant
        </button>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold">Airport transportation</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Do you need ground transportation from the airport to the conference hotel? This helps us
          arrange rides ahead of time.
        </p>
        <div className="mt-4 flex gap-6 text-sm">
          {(["yes", "no"] as const).map((value) => (
            <label key={value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="airport"
                checked={airportTransportation === value}
                onChange={() => setAirportTransportation(value)}
                required
              />
              {value === "yes" ? "Yes" : "No"}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold">Accessibility accommodations</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Does anyone in your party need handicap or accessibility accommodations?
        </p>
        <div className="mt-4 flex gap-6 text-sm">
          {(["yes", "no"] as const).map((value) => (
            <label key={value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="accessibility"
                checked={accessibilityNeeded === value}
                onChange={() => setAccessibilityNeeded(value)}
                required
              />
              {value === "yes" ? "Yes" : "No"}
            </label>
          ))}
        </div>
        {accessibilityNeeded === "yes" && (
          <label className="mt-4 block text-sm font-medium">
            What accommodations are needed?
            <textarea
              className={`${inputClass} min-h-28`}
              value={accessibilityDetails}
              onChange={(event) => setAccessibilityDetails(event.target.value)}
              required
            />
          </label>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold">Emergency contact</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Name
            <input className={inputClass} value={emergencyName} onChange={(event) => setEmergencyName(event.target.value)} required />
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input className={inputClass} type="tel" value={emergencyPhone} onChange={(event) => setEmergencyPhone(event.target.value)} required />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface-muted p-6 sm:p-8">
        <h3 className="text-lg font-semibold">Estimated total</h3>
        <p className="mt-1 text-sm text-muted">{tierLabels[tier]}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt>{quote.packageLabel || "Room rate"}</dt>
            <dd className="font-semibold">
              {quote.packageId ? formatUsd(quote.packagePrice) : "Add someone age 6 or older"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>
              Extra adults ({quote.extraAdults} × {formatUsd(quote.extraAdultRate)})
            </dt>
            <dd className="font-semibold">{formatUsd(quote.extraAdults * quote.extraAdultRate)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>
              Extra children ages 6–12 ({quote.extraChildren} × {formatUsd(quote.extraChildRate)})
            </dt>
            <dd className="font-semibold">{formatUsd(quote.extraChildren * quote.extraChildRate)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-2">
            <dt className="font-semibold">Package total</dt>
            <dd className="font-semibold">{formatUsd(quote.total)}</dd>
          </div>
          {priced && (
            <>
              <div className="flex justify-between gap-4">
                <dt>Stripe processing fee</dt>
                <dd className="font-semibold">{formatUsd(priced.fee)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-base">
                <dt className="font-semibold">Amount due today</dt>
                <dd className="font-semibold text-brand">{formatUsd(priced.dueToday)}</dd>
              </div>
              {priced.balance > 0 && (
                <div className="flex justify-between gap-4">
                  <dt>Remaining on {installmentDueLabel}</dt>
                  <dd className="font-semibold">{formatUsd(priced.balance)}</dd>
                </div>
              )}
            </>
          )}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          {quote.occupancy > 0
            ? `Children ages 1–5 (${quote.freeChildren}) are free and are not counted. ${quote.occupancy} ${quote.occupancy === 1 ? "person counts" : "people count"} toward the room rate.`
            : "Children ages 1–5 are free and are not counted. Add someone age 6 or older to set the room rate."}
        </p>
        {quote.needsExtraRoom && (
          <p className="mt-3 text-sm font-medium text-brand">
            This group has more than four people. The registration team will be noted that extra room space
            is needed.
          </p>
        )}
        {testMode && (
          <p className="mt-4 rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-brand">
            Test payment is on. Pay in full charges {formatUsd(testPaymentAmount)}. Two installments charge{" "}
            {formatUsd(testInstallmentAmount)} today and {formatUsd(testInstallmentAmount)} tomorrow. The package
            total is not charged. Open this page without <span className="font-medium">?test=</span> in the address
            to take a real payment.
          </p>
        )}
        {quote.occupancy > 0 && !testMode && (
          <fieldset className="mt-6 space-y-3">
            <legend className="text-sm font-semibold text-foreground">Payment method</legend>
            <p className="text-sm leading-relaxed text-muted">
              Stripe’s processing fee is added to the package price, so the conference receives the package
              amount. Card is 2.9% + $0.30. ACH bank debit is 0.8%, capped at $5. Pay later is 5.99% + $0.30.
              These are Stripe’s standard US rates.{" "}
              <a className="font-semibold text-brand hover:underline" href="https://stripe.com/pricing#standard-pricing" target="_blank" rel="noreferrer">
                Stripe’s pricing
              </a>
              .
            </p>
            {paymentMethodOptions.map((option) => (
              <label key={option.id} className="flex items-start gap-3 text-sm">
                <input
                  type="radio"
                  name="payment-method"
                  className="mt-1"
                  checked={paymentMethod === option.id}
                  onChange={() => setPaymentMethod(option.id)}
                  required
                />
                <span>
                  <span className="font-medium text-foreground">{option.label}</span>
                  <span className="mt-0.5 block text-muted">{option.rate}</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}
        {quote.occupancy > 0 && cardInstallments && (
          <fieldset className="mt-6 space-y-3">
            <legend className="text-sm font-semibold text-foreground">How would you like to pay?</legend>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="radio"
                name="payment-plan"
                className="mt-1"
                checked={selectedPlan === "full"}
                onChange={() => setPaymentPlan("full")}
                required
              />
              <span>
                <span className="font-medium text-foreground">Pay in full</span>
                <span className="mt-0.5 block text-muted">
                  {formatUsd(testMode ? testPaymentAmount : (fullPrice?.dueToday ?? quote.total))} today
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="radio"
                name="payment-plan"
                className="mt-1"
                checked={selectedPlan === "installments"}
                onChange={() => setPaymentPlan("installments")}
                required
              />
              <span>
                <span className="font-medium text-foreground">Two installments</span>
                <span className="mt-0.5 block text-muted">
                  {testMode
                    ? `${formatUsd(testInstallmentAmount)} today, then ${formatUsd(testInstallmentAmount)} tomorrow, charged automatically to the same card`
                    : `${formatUsd(installmentPrice?.dueToday ?? paymentSchedule(quote.total, "installments").dueToday)} today, then ${formatUsd(installmentPrice?.balance ?? paymentSchedule(quote.total, "installments").balance)} on March 1, 2027, charged automatically to the same card`}
                </span>
              </span>
            </label>
          </fieldset>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 text-sm leading-relaxed text-muted shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold text-foreground">Payment disclaimer</h3>
        <p className="mt-3">
          Payment is processed by Stripe. You enter payment details on Stripe’s secure page. The Diocese does
          not see or store your card or bank account. The amount due includes Stripe’s processing fee for the
          method you choose. Stripe’s own terms and privacy policy apply. After payment, a confirmation email
          with your registration details is sent to the primary registrant. Stripe also emails a payment receipt.
        </p>
        <label className="mt-4 flex items-start gap-3 text-foreground">
          <input
            type="checkbox"
            className="mt-1"
            checked={disclaimerAccepted}
            onChange={(event) => setDisclaimerAccepted(event.target.checked)}
            required
          />
          <span>
            {`I understand Stripe will charge ${
              quote.occupancy > 0 ? formatUsd(dueToday) : "the amount due"
            } today${
              selectedPlan === "installments" ? `, and the remaining balance on ${balanceDueLabel}` : ""
            }. This website does not store my payment details.`}
          </span>
        </label>
      </section>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || quote.occupancy < 1}
        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-accent-light disabled:opacity-60"
      >
        {submitting
          ? "Opening Stripe…"
          : quote.occupancy < 1
            ? "Continue to payment"
            : `${testMode ? "Continue to test payment" : "Continue to payment"} · ${formatUsd(dueToday)}`}
      </button>
    </form>
  );
}
