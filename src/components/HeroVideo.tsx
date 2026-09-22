"use client";

import { useEffect, useRef, useState } from "react";

const allVideos = [
  "/videos/chicago-stock-video-1.mp4",
  "/videos/chicago-stock-video-2.mp4",
  "/videos/chicago-stock-video-3.mp4",
];

/** Prefer the lighter clips on phones so autoplay can start reliably. */
const mobileVideos = [
  "/videos/chicago-stock-video-2.mp4",
  "/videos/chicago-stock-video-1.mp4",
];

async function playSafely(video: HTMLVideoElement) {
  video.defaultMuted = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("muted", "");

  try {
    await video.play();
    return true;
  } catch {
    return false;
  }
}

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playlist, setPlaylist] = useState(allVideos);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)");
    if (coarse.matches) {
      setPlaylist(mobileVideos);
      setIndex(0);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const start = async () => {
      setFailed(false);
      video.pause();
      video.src = playlist[index];
      video.load();

      const tryPlay = async () => {
        if (cancelled) return;
        const ok = await playSafely(video);
        if (!ok && !cancelled) {
          setFailed(true);
        }
      };

      // iOS often fires canplay before play() is allowed to succeed.
      if (video.readyState >= 2) {
        await tryPlay();
      } else {
        const onCanPlay = () => {
          video.removeEventListener("canplay", onCanPlay);
          void tryPlay();
        };
        video.addEventListener("canplay", onCanPlay);
      }
    };

    void start();

    return () => {
      cancelled = true;
    };
  }, [playlist, index]);

  return (
    <>
      {/* Fallback image if autoplay is blocked or the clip fails to load */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/willis-tower.jpg)" }}
        aria-hidden="true"
      />

      {!failed && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          autoPlay
          preload="auto"
          controls={false}
          disablePictureInPicture
          onEnded={() => setIndex((current) => (current + 1) % playlist.length)}
          onError={() => setFailed(true)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
