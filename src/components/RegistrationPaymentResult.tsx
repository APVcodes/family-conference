"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { conference } from "@/lib/site-content";
import { registrationEndpoint } from "@/lib/registration-endpoint";
import { formatUsd } from "@/lib/registration";

type Summary = {
  firstName: string;
  lastName: string;
  email: string;
  parish: string;
  region: string;
  packageLabel: string;
  total: number;
  paymentPlan?: string;
  charged?: number;
  balance?: number;
  dueLabel?: string;
  paymentMethod?: string;
  processingFee?: number;
  participants: { name: string; categoryLabel: string; allergies?: string }[];
};

export default function RegistrationPaymentResult() {
  const [status, setStatus] = useState<"working" | "done" | "error">("working");
  const [message, setMessage] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId || !registrationEndpoint) {
      setStatus("error");
      setMessage("This payment confirmation link is missing a Stripe session.");
      return;
    }

    let cancelled = false;
    async function confirm() {
      try {
        const response = await fetch(registrationEndpoint, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "confirm-payment", sessionId }),
          redirect: "follow",
        });
        const result = (await response.json()) as {
          ok?: boolean;
          error?: string;
          registrationId?: string;
          summary?: Summary;
        };
        if (cancelled) return;
        if (!response.ok || !result.ok) {
          throw new Error(result.error || "The payment could not be confirmed.");
        }
        setRegistrationId(result.registrationId || "");
        setSummary(result.summary || null);
        setStatus("done");
      } catch (caught) {
        if (cancelled) return;
        setStatus("error");
        setMessage(caught instanceof Error ? caught.message : "The payment could not be confirmed.");
      }
    }

    void confirm();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "working") {
    return <p className="text-sm text-muted">Confirming your Stripe payment…</p>;
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6 text-sm text-brand" role="alert">
        <p>{message}</p>
        <Link href="/registration/" className="mt-4 inline-block font-semibold underline">
          Return to registration
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Payment received</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        Thank you{summary ? `, ${summary.firstName}` : ""}.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Stripe accepted {summary ? formatUsd(summary.charged ?? summary.total) : "the payment"}.
        {summary?.paymentPlan?.startsWith("Test payment")
          ? summary.balance
            ? ` This was a test charge. The remaining ${formatUsd(summary.balance)} is scheduled for ${summary.dueLabel}. The package total was not collected.`
            : " This was a test charge paid in full. The package total was not collected."
          : summary?.balance
            ? ` The remaining ${formatUsd(summary.balance)} is scheduled for ${summary.dueLabel}.`
            : " This registration is paid in full."}{" "}
        A confirmation email
        {summary ? ` is on its way to ${summary.email}` : " is on its way"}, and Stripe will send a separate
        receipt.
      </p>
      {summary && (
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Reference</dt>
            <dd className="font-medium">{registrationId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Package</dt>
            <dd className="text-right font-medium">{summary.packageLabel}</dd>
          </div>
          {summary.paymentPlan && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Payment plan</dt>
              <dd className="text-right font-medium">{summary.paymentPlan}</dd>
            </div>
          )}
          {summary.paymentMethod && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Payment method</dt>
              <dd className="text-right font-medium">{summary.paymentMethod}</dd>
            </div>
          )}
          {summary.processingFee ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Processing fee</dt>
              <dd className="text-right font-medium">{formatUsd(summary.processingFee)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Parish</dt>
            <dd className="text-right font-medium">
              {summary.parish}
              <span className="mt-0.5 block font-normal text-muted">{summary.region}</span>
            </dd>
          </div>
        </dl>
      )}
      {summary && (
        <ul className="mt-4 space-y-1 text-sm text-muted">
          {summary.participants.map((person) => (
            <li key={`${person.name}-${person.categoryLabel}`}>
              {person.name} — {person.categoryLabel}
              {person.allergies ? ` · Allergies: ${person.allergies}` : ""}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-sm leading-relaxed text-muted">
        Questions or changes:{" "}
        <a className="font-semibold text-brand hover:underline" href={`mailto:${conference.contactEmail}`}>
          {conference.contactEmail}
        </a>{" "}
        or {conference.contactPhone}.
      </p>
    </div>
  );
}
