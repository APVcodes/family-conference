"use client";

import { useState, type FormEvent } from "react";
import { souvenirAdminApiUrl } from "@/lib/souvenir-admin";

type Submission = {
  _row: number;
  Status?: string;
  [column: string]: string | number | undefined;
};

const HIDDEN_COLUMNS = new Set(["_row", "Status", "Reviewed At"]);

/**
 * Best-effort column detection. The exact headers Formester's Google
 * Sheets integration writes (and the exact format of the file-upload
 * column's value) aren't known until a real test submission is made —
 * see docs/souvenir-review-setup.md. Until then, this renders images by
 * matching any column whose header looks upload-related, and falls back
 * to a plain key/value list for everything else so nothing is hidden.
 */
function isImageColumn(header: string) {
  return /image|photo|file|upload/i.test(header);
}

function extractDriveFileId(value: string): string | null {
  const idParam = value.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParam) return idParam[1];
  const pathMatch = value.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (pathMatch) return pathMatch[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(value)) return value;
  return null;
}

function toImageUrls(rawValue: unknown): string[] {
  if (typeof rawValue !== "string" || !rawValue.trim()) return [];
  return rawValue
    .split(/[\n,]+/)
    .map((piece) => piece.trim())
    .filter(Boolean)
    .map((piece) => {
      const fileId = extractDriveFileId(piece);
      return fileId
        ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
        : piece;
    });
}

function SubmissionCard({
  submission,
  onReview,
  pending,
}: {
  submission: Submission;
  onReview: (row: number, action: "approve" | "reject") => void;
  pending: boolean;
}) {
  const entries = Object.entries(submission).filter(
    ([key]) => !HIDDEN_COLUMNS.has(key),
  );
  const imageEntries = entries.filter(([key]) => isImageColumn(key));
  const otherEntries = entries.filter(([key]) => !isImageColumn(key));

  return (
    <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      {imageEntries.map(([key, value]) => {
        const urls = toImageUrls(value);
        if (urls.length === 0) return null;
        return (
          <div key={key} className="mb-4 flex flex-wrap gap-3">
            {urls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                loading="lazy"
                className="h-32 w-32 rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        );
      })}

      <dl className="space-y-2 text-sm">
        {otherEntries.map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-brand">
              {key}
            </dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-foreground">
              {value ?? ""}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => onReview(submission._row, "approve")}
          className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => onReview(submission._row, "reject")}
          className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </article>
  );
}

export default function SouvenirAdminPanel() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewingRow, setReviewingRow] = useState<number | null>(null);

  if (!souvenirAdminApiUrl) {
    return (
      <div className="rounded-2xl border border-border bg-surface-muted p-8 text-center">
        <h1 className="text-lg font-semibold">Souvenir Review</h1>
        <p className="mt-2 text-sm text-muted">
          Admin API is not configured. Set NEXT_PUBLIC_SOUVENIR_ADMIN_API_URL
          and rebuild the site. See docs/souvenir-review-setup.md.
        </p>
      </div>
    );
  }

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${souvenirAdminApiUrl}?password=${encodeURIComponent(password)}`,
      );
      const data = await res.json();
      if (data.error) {
        setError("Incorrect password.");
        return;
      }
      setSubmissions((data.submissions ?? []) as Submission[]);
      setAuthed(true);
    } catch {
      setError("Could not reach the review service. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(row: number, action: "approve" | "reject") {
    setReviewingRow(row);
    setError(null);
    try {
      const res = await fetch(souvenirAdminApiUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ password, row, action }),
      });
      const data = await res.json();
      if (data.error) {
        setError(`Could not update submission: ${data.error}`);
        return;
      }
      setSubmissions((prev) => prev.filter((s) => s._row !== row));
    } catch {
      setError("Could not reach the review service. Try again.");
    } finally {
      setReviewingRow(null);
    }
  }

  const pending = submissions.filter((s) => !s.Status);

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm">
        <h1 className="text-center text-lg font-semibold">Souvenir Review</h1>
        <form onSubmit={signIn} className="mt-6 space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold">
        Souvenir Review ({pending.length} pending)
      </h1>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 space-y-6">
        {pending.length === 0 && (
          <p className="text-sm text-muted">No pending submissions.</p>
        )}
        {pending.map((submission) => (
          <SubmissionCard
            key={submission._row}
            submission={submission}
            onReview={handleReview}
            pending={reviewingRow === submission._row}
          />
        ))}
      </div>
    </div>
  );
}
