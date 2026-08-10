import Link from "next/link";
import { navLinks } from "@/lib/navigation";
import { conference } from "@/lib/site-content";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-brand-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-light">
              {conference.organization}
            </p>
            <p className="mt-2 text-lg font-semibold">{conference.shortTitle}</p>
            <p className="mt-2 text-sm text-white/75">{conference.dates}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-light">
              Navigate
            </p>
            <ul className="mt-3 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-light">
              Contact
            </p>
            <p className="mt-3 text-sm text-white/80">
              Questions about the Family Conference?
            </p>
            <a
              href={`mailto:${conference.contactEmail}`}
              className="mt-2 inline-block text-sm font-medium text-accent-light hover:underline"
            >
              {conference.contactEmail}
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Mar Thoma Diocese of North America
        </div>
      </div>
    </footer>
  );
}
