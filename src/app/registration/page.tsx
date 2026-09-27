import type { Metadata } from "next";
import RegistrationExperience from "@/components/RegistrationExperience";

export const metadata: Metadata = {
  title: "Registration",
  description:
    "Register for the all-inclusive Mar Thoma 36th Family Conference 2027 package, including lodging, meals, and airport transportation if needed.",
};

export default function RegistrationPage() {
  return <RegistrationExperience />;
}
