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
  testAchPaymentAmount,
  testAchInstallmentAmount,
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span data-field-error role="alert" className="mt-1.5 block text-xs font-medium text-red-700">
      {message}
    </span>
  );
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
  const [submitted, setSubmitted] = useState(false);
  const [followUpDone, setFollowUpDone] = useState<{ id: string; email: string } | null>(null);
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
  const installmentMethod = paymentMethod === "card" || paymentMethod === "ach";
  const showInstallments = (installmentsAvailable() && installmentMethod) || testMode;
  const selectedPlan: PaymentPlan = showInstallments ? paymentPlan : "full";
  const schedule = paymentSchedule(quote.total, selectedPlan);
  const testInstallments = testMode && selectedPlan === "installments";
  const fullPrice =
    !testMode && paymentMethod && quote.roomCount > 0
      ? priceForMethod(quote.total, "full", paymentMethod)
      : null;
  const installmentPrice =
    !testMode && installmentMethod && quote.roomCount > 0
      ? priceForMethod(quote.total, "installments", paymentMethod)
      : null;
  const priced = selectedPlan === "installments" ? installmentPrice : fullPrice;
  const testFullAmount = paymentMethod === "ach" ? testAchPaymentAmount : testPaymentAmount;
  const testInstallmentCharge = paymentMethod === "ach" ? testAchInstallmentAmount : testInstallmentAmount;
  const dueToday = testInstallments
    ? testInstallmentCharge
    : testMode
      ? testFullAmount
      : (priced?.dueToday ?? schedule.dueToday);
  const balanceDueLabel = testInstallments ? testInstallmentDueLabel() : installmentDueLabel;

  function updateParticipant(id: string, patch: Partial<Participant>) {
    setParticipants((current) =>
      current.map((person) => (person.id === id ? { ...person, ...patch } : person)),
    );
  }

  function validate() {
    const found: Record<string, string> = {};
    if (!firstName.trim()) found.firstName = "Enter the registrant’s first name.";
    if (!lastName.trim()) found.lastName = "Enter the registrant’s last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found.email = "Enter a valid email address for the confirmation.";
    if (digits(phone).length < 10) found.phone = "Enter a phone number with at least 10 digits.";
    if (!parish.trim()) found.parish = "Enter the parish.";
    if (!region) found.region = "Select a region.";
    participants.forEach((person) => {
      if (!person.name.trim()) found[`name-${person.id}`] = "Enter this participant’s full name.";
      if (!person.category) found[`category-${person.id}`] = "Select an age group.";
      if (!person.hasAllergy) found[`allergy-${person.id}`] = "Tell us whether this participant has allergies.";
      else if (person.hasAllergy === "yes" && !person.allergies.trim()) {
        found[`allergies-${person.id}`] = "List the allergies for this participant.";
      }
    });
    if (quote.adultCount < 1 && participants.every((person) => person.category)) {
      found.participants = "Include at least one adult (age 13 or older) in each registration.";
    }
    if (!airportTransportation) found.airport = "Tell us whether airport transportation is needed.";
    if (!accessibilityNeeded) found.accessibility = "Tell us whether accessibility accommodations are needed.";
    else if (accessibilityNeeded === "yes" && !accessibilityDetails.trim()) {
      found.accessibilityDetails = "Describe the accessibility accommodations you need.";
    }
    if (!emergencyName.trim()) found.emergencyName = "Enter an emergency contact name.";
    if (digits(emergencyPhone).length < 10) found.emergencyPhone = "Enter an emergency contact phone number.";
    if (!quote.needsTeamFollowUp) {
      if (!testMode && !paymentMethod && quote.roomCount > 0) found.paymentMethod = "Choose a payment method.";
      if (!disclaimerAccepted) found.disclaimer = "Please acknowledge the payment disclaimer before submitting.";
    }
    return found;
  }

  // Once the form has been submitted, errors update live as each field is fixed.
  const errors = submitted ? validate() : {};
  const errorCount = Object.keys(errors).length;
  const inputCls = (key: string) => (errors[key] ? `${inputClass} border-red-600` : inputClass);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitted(true);

    if (Object.keys(validate()).length > 0) {
      // Wait for the error messages to render, then bring the first one into view.
      requestAnimationFrame(() => {
        document
          .querySelector("[data-field-error]")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
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

    if (quote.needsTeamFollowUp) {
      await submitFollowUp(people);
      return;
    }

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
        roomCount: quote.roomCount,
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

  async function submitFollowUp(people: Record<string, unknown>[]) {
    setSubmitting(true);
    try {
      const response = await fetch(registrationEndpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "request-followup",
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
          participants: people,
          partySize: quote.partySize,
        }),
        redirect: "follow",
      });
      const result = (await response.json()) as { ok?: boolean; registrationId?: string; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "We could not save your registration.");
      }
      setFollowUpDone({ id: result.registrationId ?? "", email: email.trim() });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not save your registration. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (followUpDone) {
    return (
      <section
        role="status"
        ref={(element) => element?.scrollIntoView({ behavior: "smooth", block: "center" })}
        className="rounded-2xl border border-brand/30 bg-brand/5 p-6 shadow-sm sm:p-8"
      >
        <h3 className="text-lg font-semibold text-brand">Thank you. We have your registration details.</h3>
        <p className="mt-3 text-sm leading-relaxed">
          Someone from our team will contact you to complete your registration. Your group has more than four
          people, and each room holds a maximum of four, so our team will work out the best room arrangement and
          payment with you.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          A confirmation is on its way to {followUpDone.email}.
          {followUpDone.id ? ` Your reference is ${followUpDone.id}.` : ""} You do not need to call us.
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold">Registrant</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            First name
            <input className={inputCls("firstName")} value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" required />
            <FieldError message={errors.firstName} />
          </label>
          <label className="block text-sm font-medium">
            Last name
            <input className={inputCls("lastName")} value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" required />
            <FieldError message={errors.lastName} />
          </label>
          <label className="block text-sm font-medium sm:col-span-2">
            Email
            <input className={inputCls("email")} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            <FieldError message={errors.email} />
            <span className="mt-1.5 block text-xs font-normal text-muted">
              The confirmation, with your full submission, is sent to this address.
            </span>
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input className={inputCls("phone")} type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" required />
            <FieldError message={errors.phone} />
          </label>
          <label className="block text-sm font-medium">
            Parish
            <input className={inputCls("parish")} value={parish} onChange={(event) => setParish(event.target.value)} required />
            <FieldError message={errors.parish} />
          </label>
          <label className="block text-sm font-medium">
            Region
            <select className={inputCls("region")} value={region} onChange={(event) => setRegion(event.target.value)} required>
              <option value="">Select a region</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <FieldError message={errors.region} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold">Participants</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          List everyone in this registration, including yourself. Your package updates below as you add people.
        </p>
        <details className="mt-3 rounded-xl border border-border px-4 py-3 text-sm">
          <summary className="cursor-pointer font-semibold text-brand">Age groups and pricing</summary>
          <p className="mt-3 leading-relaxed text-muted">
            Young Adult (13–35), Adult (36–59) and Senior (60+) all use the adult rate. Ages 6–12 use the child
            rate. Children ages 1–5 are free. Each room holds up to four people, children ages 1–5 included.
            For more than four people, complete the form and our team will contact you to finish your
            registration. Each registration needs at least one adult.
          </p>
        </details>
        <div className="mt-5 space-y-4">
          {participants.map((person, index) => (
            <div key={person.id} className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <label className="block text-sm font-medium">
                Full name
                <input
                  className={inputCls(`name-${person.id}`)}
                  value={person.name}
                  onChange={(event) => updateParticipant(person.id, { name: event.target.value })}
                  required
                />
                <FieldError message={errors[`name-${person.id}`]} />
              </label>
              <label className="block text-sm font-medium">
                Age group
                <select
                  className={inputCls(`category-${person.id}`)}
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
                <FieldError message={errors[`category-${person.id}`]} />
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
                <FieldError message={errors[`allergy-${person.id}`]} />
              </fieldset>
              {person.hasAllergy === "yes" && (
                <label className="block text-sm font-medium sm:col-span-3">
                  Allergies
                  <textarea
                    className={`${inputCls(`allergies-${person.id}`)} min-h-20`}
                    value={person.allergies}
                    onChange={(event) => updateParticipant(person.id, { allergies: event.target.value })}
                    placeholder="List each allergy"
                    required
                  />
                  <FieldError message={errors[`allergies-${person.id}`]} />
                </label>
              )}
              {person.category &&
                quote.lines[index] &&
                quote.lines[index].billing !== "included" && (
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

        <FieldError message={errors.participants} />
        <div
          aria-live="polite"
          className="mt-6 rounded-xl border border-brand/30 bg-brand/5 p-4 text-sm"
        >
          {quote.needsTeamFollowUp ? (
            <p className="font-medium text-brand">
              Rooms hold a maximum of four people, and this registration has {quote.partySize}. Fill out the rest
              of the form and someone from our team will contact you to complete your registration.
            </p>
          ) : !quote.base ? (
            <p className="text-muted">
              {quote.partySize === 0
                ? "Choose an age group for each participant to see your package."
                : "Add at least one adult (age 13 or older) to see your package."}
            </p>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">Your package · 1 room</p>
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4">
                <span>
                  <span className="font-semibold">{quote.base.label}</span>
                  <span className="block text-xs text-muted">
                    {quote.adultCount} {quote.adultCount === 1 ? "adult" : "adults"}
                    {quote.childCount > 0 &&
                      ` and ${quote.childCount} ${quote.childCount === 1 ? "child" : "children"} (6–12)`}
                    {quote.extraAdults > 0 &&
                      ` · includes ${quote.extraAdults} extra ${quote.extraAdults === 1 ? "adult" : "adults"} at ${formatUsd(quote.extraAdultRate)}`}
                    {quote.extraChildren > 0 &&
                      ` · includes ${quote.extraChildren} extra ${quote.extraChildren === 1 ? "child" : "children"} at ${formatUsd(quote.extraChildRate)}`}
                  </span>
                </span>
                <span className="font-semibold">{formatUsd(quote.total)}</span>
              </div>
              {quote.freeChildren > 0 && (
                <p className="mt-2 text-xs text-muted">
                  {quote.freeChildren} {quote.freeChildren === 1 ? "child" : "children"} ages 1–5 free.
                </p>
              )}
            </>
          )}
        </div>
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
        <FieldError message={errors.airport} />
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
        <FieldError message={errors.accessibility} />
        {accessibilityNeeded === "yes" && (
          <label className="mt-4 block text-sm font-medium">
            What accommodations are needed?
            <textarea
              className={`${inputCls("accessibilityDetails")} min-h-28`}
              value={accessibilityDetails}
              onChange={(event) => setAccessibilityDetails(event.target.value)}
              required
            />
            <FieldError message={errors.accessibilityDetails} />
          </label>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold">Emergency contact</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Full name
            <input className={inputCls("emergencyName")} value={emergencyName} onChange={(event) => setEmergencyName(event.target.value)} autoComplete="name" required />
            <FieldError message={errors.emergencyName} />
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input className={inputCls("emergencyPhone")} type="tel" value={emergencyPhone} onChange={(event) => setEmergencyPhone(event.target.value)} required />
            <FieldError message={errors.emergencyPhone} />
          </label>
        </div>
      </section>

      {!quote.needsTeamFollowUp && (
      <>
      <section className="rounded-2xl border border-border bg-surface-muted p-6 sm:p-8">
        <h3 className="text-lg font-semibold">Estimated total</h3>
        <p className="mt-1 text-sm text-muted">{tierLabels[tier]}</p>
        <dl className="mt-4 space-y-2 text-sm">
          {quote.roomCount > 0 && (
            <div className="flex justify-between gap-4">
              <dt>Number of rooms</dt>
              <dd className="font-semibold">{quote.roomCount}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt>{quote.packageLabel || "Room rate"}</dt>
            <dd className="font-semibold">
              {quote.base ? formatUsd(quote.packagePrice) : "Add at least one adult"}
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
          {quote.roomCount > 0
            ? `Children ages 1–5 (${quote.freeChildren}) are free and are not counted in the price. ${quote.occupancy} ${quote.occupancy === 1 ? "person counts" : "people count"} toward the package.`
            : "Children ages 1–5 are free and are not counted. Add at least one adult (age 13 or older) to set your package."}
        </p>
        {testMode && (
          <p className="mt-4 rounded-xl border border-brand/30 bg-white px-4 py-3 text-sm text-brand">
            Test payment is on. Card pay in full charges {formatUsd(testPaymentAmount)}. Card installments charge{" "}
            {formatUsd(testInstallmentAmount)} today and {formatUsd(testInstallmentAmount)} tomorrow. ACH pay in full
            charges {formatUsd(testAchPaymentAmount)}. ACH installments charge {formatUsd(testAchInstallmentAmount)} today
            and {formatUsd(testAchInstallmentAmount)} tomorrow. The package total is not charged. Open this page without{" "}
            <span className="font-medium">?test=</span> in the address to take a real payment.
          </p>
        )}
        {quote.roomCount > 0 && (
          <fieldset className="mt-6 space-y-3">
            <legend className="text-sm font-semibold text-foreground">Payment method</legend>
            {!testMode && (
              <p className="text-sm leading-relaxed text-muted">
                Stripe’s processing fee is added to the package price, so the conference receives the package
                amount. Card is 2.9% + $0.30. ACH bank debit is 0.8%, capped at $5. Pay later is 5.99% + $0.30.
                These are Stripe’s standard US rates. On two installments, the ACH cap applies to each payment.{" "}
                <a className="font-semibold text-brand hover:underline" href="https://stripe.com/pricing#standard-pricing" target="_blank" rel="noreferrer">
                  Stripe’s pricing
                </a>
                .
              </p>
            )}
            {paymentMethodOptions
              .filter((option) => !testMode || option.id !== "pay-later")
              .map((option) => (
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
            <FieldError message={errors.paymentMethod} />
          </fieldset>
        )}
        {quote.roomCount > 0 && showInstallments && (
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
                  {formatUsd(testMode ? testFullAmount : (fullPrice?.dueToday ?? quote.total))} today
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
                    ? `${formatUsd(testInstallmentCharge)} today, then ${formatUsd(testInstallmentCharge)} tomorrow, ${paymentMethod === "ach" ? "debited from the same bank account" : "charged automatically to the same card"}`
                    : `${formatUsd(installmentPrice?.dueToday ?? paymentSchedule(quote.total, "installments").dueToday)} today, then ${formatUsd(installmentPrice?.balance ?? paymentSchedule(quote.total, "installments").balance)} on March 1, 2027, ${paymentMethod === "ach" ? "debited from the same bank account" : "charged automatically to the same card"}`}
                </span>
              </span>
            </label>
          </fieldset>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 text-sm leading-relaxed text-muted shadow-sm sm:p-8">
        <h3 className="text-lg font-semibold text-foreground">Payment disclaimer</h3>
        <p className="mt-3">
          Payment is processed by Stripe. You enter payment details on Stripe’s secure page. The Mar Thoma
          Diocese of North America does not see or store your card or bank account. The amount due includes Stripe’s processing fee for the
          method you choose. Stripe’s own terms and privacy policy apply. After the first payment is recorded, a
          confirmation email with your registration details is sent to the primary registrant. A bank debit can
          take several business days to clear. Stripe also emails a payment receipt.
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
              quote.roomCount > 0 ? formatUsd(dueToday) : "the amount due"
            } today${
              selectedPlan === "installments" ? `, and the remaining balance on ${balanceDueLabel}` : ""
            }. This website does not store my payment details.`}
          </span>
        </label>
        <FieldError message={errors.disclaimer} />
      </section>
      </>
      )}

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {errorCount > 0 && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          {errorCount === 1
            ? "Please fix 1 item highlighted above before continuing."
            : `Please fix ${errorCount} items highlighted above before continuing.`}
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-accent-light disabled:opacity-60"
      >
        {submitting
          ? quote.needsTeamFollowUp
            ? "Submitting…"
            : "Opening Stripe…"
          : quote.needsTeamFollowUp
            ? "Submit for team follow-up"
          : quote.roomCount < 1
            ? "Continue to payment"
            : `${testMode ? "Continue to test payment" : "Continue to payment"} · ${formatUsd(dueToday)}`}
      </button>
    </form>
  );
}
