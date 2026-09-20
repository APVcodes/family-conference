import type { Metadata } from "next";
import SouvenirAdminPanel from "@/components/SouvenirAdminPanel";

export const metadata: Metadata = {
  title: "Souvenir Review",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function SouvenirAdminPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SouvenirAdminPanel />
      </div>
    </div>
  );
}
