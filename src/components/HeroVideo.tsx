"use client";

import { useEffect, useRef, useState } from "react";

const videos = [
  "/videos/chicago-stock-video-1.mp4",
  "/videos/chicago-stock-video-2.mp4",
  "/videos/chicago-stock-video-3.mp4",
];

export default function HeroVideo() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [sources, setSources] = useState([videos[0], videos[1]]);
  const [videoIndex, setVideoIndex] = useState(0);
  const [activeSlot, setActiveSlot] = useState(0);

  useEffect(() => {
    void videoRefs.current[activeSlot]?.play();
  }, [activeSlot, sources]);

  function advanceVideo() {
    const nextIndex = (videoIndex + 1) % videos.length;
    const nextSlot = activeSlot === 0 ? 1 : 0;

    setSources((currentSources) => {
      const nextSources = [...currentSources];
      nextSources[nextSlot] = videos[nextIndex];
      return nextSources;
    });
    setVideoIndex(nextIndex);
    setActiveSlot(nextSlot);
  }

  return sources.map((source, slot) => (
    <video
      key={slot}
      ref={(element) => {
        videoRefs.current[slot] = element;
      }}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
        slot === activeSlot ? "opacity-100" : "opacity-0"
      }`}
      src={source}
      autoPlay={slot === activeSlot}
      muted
      playsInline
      onEnded={slot === activeSlot ? advanceVideo : undefined}
      aria-hidden="true"
    />
  ));
}