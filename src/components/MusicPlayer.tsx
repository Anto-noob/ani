"use client"
import React, { useEffect, useRef, useState } from "react";

type Props = { audioSrc?: string };

export default function MusicPlayer({ audioSrc }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const firstInteractRef = useRef(false);

  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audio.loop = true;
    // Start muted so most browsers allow autoplay
    audio.muted = true;
    audioRef.current = audio;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setIsMuted(true);
      } catch {
        // if autoplay blocked, stay paused & muted; UI button will let user play
        setIsPlaying(false);
        setIsMuted(true);
      }
    };

    // timeupdate -> progress
    const onTime = () => {
      if (audio.duration && !Number.isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener("timeupdate", onTime);

    tryPlay();

    // Unmute on first user interaction (pointerdown/click). This is required to enable sound.
    const onFirstInteract = async () => {
      if (firstInteractRef.current) return;
      firstInteractRef.current = true;
      try {
        if (!audioRef.current) return;
        audioRef.current.muted = false;
        await audioRef.current.play();
        setIsMuted(false);
        setIsPlaying(true);
      } catch {
        // ignore
      }
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
    };

    window.addEventListener("pointerdown", onFirstInteract, { once: true });
    window.addEventListener("keydown", onFirstInteract, { once: true });
    window.addEventListener("touchstart", onFirstInteract, { once: true });

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audioRef.current = null;
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
    };
  }, [audioSrc]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        // If currently muted (autoplay path), try to unmute on explicit click
        if (audio.muted) {
          audio.muted = false;
          setIsMuted(false);
        }
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  if (!audioSrc) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* thin progress bar above the control */}
      <div
        aria-hidden
        className="w-44 h-1 rounded-full bg-white/30 shadow-inner"
        style={{ overflow: "hidden", backdropFilter: "blur(4px)" }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background:
              "linear-gradient(90deg, rgba(255,45,85,1) 0%, rgba(255,154,162,1) 100%)",
            transition: "width 220ms linear",
          }}
        />
      </div>

      <button
        aria-pressed={isPlaying}
        onClick={toggle}
        title={isPlaying ? "Pause music" : "Play music"}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-white/90 text-pink-600 hover:scale-105 transition-transform"
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="6" y="5" width="3" height="14" rx="1" fill="currentColor" />
            <rect x="15" y="5" width="3" height="14" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}