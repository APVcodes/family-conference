import type { Metadata } from "next";
import RegistrationPaymentResult from "@/components/RegistrationPaymentResult";

export const metadata: Metadata = {
  title: "Payment received",
  description: "Confirmation after Stripe payment for the 36th Family Conference 2027.",
  robots: { index: false, follow: false },
};

export default function RegistrationSuccessPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <RegistrationPaymentResult />
      </div>
    </div>
  );
}
