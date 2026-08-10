import { promoVideos } from "@/lib/site-content";

function VideoPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-border bg-brand-dark/5 p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-md">
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-brand">
        Video coming soon
      </p>
    </div>
  );
}

export default function VideoReels() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Watch &amp; Share
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Reels &amp; Promo Videos
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Promotional videos and highlight reels will be posted here as they become
            available.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {promoVideos.map((video) =>
            video.embedUrl ? (
              <div
                key={video.id}
                className="overflow-hidden rounded-2xl border border-border shadow-sm"
              >
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <VideoPlaceholder
                key={video.id}
                title={video.title}
                description={video.description}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
