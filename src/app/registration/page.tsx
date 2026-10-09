import type { Metadata } from "next";
import RegistrationComingSoon from "@/components/RegistrationComingSoon";
import RegistrationExperience from "@/components/RegistrationExperience";

// Flip to true to show the full registration experience again.
const REGISTRATION_OPEN = false;

export const metadata: Metadata = {
  title: "Registration",
  description:
    "Register for the all-inclusive Mar Thoma 36th Family Conference 2027 package, including lodging, meals, and airport transportation if needed.",
};

export default function RegistrationPage() {
  return REGISTRATION_OPEN ? <RegistrationExperience /> : <RegistrationComingSoon />;
}
