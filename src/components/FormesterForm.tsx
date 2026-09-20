"use client";

import { useEffect, useRef, useState } from "react";

const COVER_WIDTH = 230;
const COVER_HEIGHT = 56;

function findIframe(host: Element | null): HTMLIFrameElement | null {
  if (!host) {
    return null;
  }

  return (
    host.querySelector("iframe") ??
    host.shadowRoot?.querySelector("iframe") ??
    null
  );
}

export default function FormesterForm({
  formId,
  url,
}: {
  formId: string;
  url: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cover, setCover] = useState({ left: 0, bottom: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) {
      return;
    }

    const host = wrap.querySelector("formester-standard-form");
    const observers: Array<ResizeObserver | MutationObserver> = [];
    let iframe: HTMLIFrameElement | null = null;
    let retries = 0;
    let retryTimer: number | undefined;

    const update = () => {
      const currentIframe = findIframe(host);
      if (!currentIframe) {
        return;
      }

      const wrapRect = wrap.getBoundingClientRect();
      const iframeRect = currentIframe.getBoundingClientRect();

      setCover({
        left: Math.max(0, iframeRect.left - wrapRect.left),
        bottom: Math.max(0, wrapRect.bottom - iframeRect.bottom),
      });
    };

    const watchIframe = (nextIframe: HTMLIFrameElement) => {
      if (iframe === nextIframe) {
        return;
      }

      iframe = nextIframe;
      iframe.addEventListener("load", update);

      const resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(wrap);
      resizeObserver.observe(iframe);
      observers.push(resizeObserver);
      update();
    };

    const tryAttach = () => {
      const nextIframe = findIframe(host);
      if (nextIframe) {
        watchIframe(nextIframe);
        return;
      }

      retries += 1;
      if (retries < 40) {
        retryTimer = window.setTimeout(tryAttach, 250);
      }
    };

    const mutationObserver = new MutationObserver(() => {
      const nextIframe = findIframe(host);
      if (nextIframe) {
        watchIframe(nextIframe);
      }
    });
    mutationObserver.observe(wrap, { childList: true, subtree: true });
    if (host?.shadowRoot) {
      mutationObserver.observe(host.shadowRoot, { childList: true, subtree: true });
    }
    observers.push(mutationObserver);

    tryAttach();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      window.clearTimeout(retryTimer);
      iframe?.removeEventListener("load", update);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden">
      <formester-standard-form
        set-auto-height="true"
        height="100%"
        width="100%"
        id={formId}
        url={url}
        className="block w-full"
      ></formester-standard-form>
      <div
        aria-hidden="true"
        className="pointer-events-auto absolute z-10 bg-surface-muted"
        style={{
          left: cover.left,
          bottom: cover.bottom,
          width: COVER_WIDTH,
          height: COVER_HEIGHT,
        }}
      />
    </div>
  );
}
