export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  titleId,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  titleId?: string;
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          {eyebrow}
        </p>
      )}
      <h2
        id={titleId}
        className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}
