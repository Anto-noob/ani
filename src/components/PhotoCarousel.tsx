"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
    images: string[];
    full?: boolean;
};

export default function PhotoCarousel({ images, full = false }: Props) {
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [dragX, setDragX] = useState(0);
    const startX = useRef<number | null>(null);
    const dragging = useRef(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const autoplay = useRef<number | null>(null);
    const total = images.length;

    useEffect(() => {
        if (!isPlaying || total <= 1) return;
        autoplay.current = window.setInterval(
            () => setIndex((i) => (i + 1) % total),
            3000
        );
        return () => {
            if (autoplay.current) window.clearInterval(autoplay.current);
            autoplay.current = null;
        };
    }, [isPlaying, total]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    function prev() {
        setIndex((i) => (i - 1 + total) % total);
    }
    function next() {
        setIndex((i) => (i + 1) % total);
    }

    function onPointerDown(e: React.PointerEvent) {
        dragging.current = true;
        startX.current = e.clientX;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        setIsPlaying(false);
    }
    function onPointerMove(e: React.PointerEvent) {
        if (!dragging.current || startX.current == null) return;
        setDragX(e.clientX - startX.current);
    }
    function onPointerUp() {
        if (!dragging.current || startX.current == null) {
            resetDrag();
            return;
        }
        const w = containerRef.current?.clientWidth || window.innerWidth;
        const threshold = Math.max(40, w * 0.08);
        if (dragX > threshold) prev();
        else if (dragX < -threshold) next();
        resetDrag();
        setTimeout(() => setIsPlaying(true), 700);
    }
    function resetDrag() {
        dragging.current = false;
        startX.current = null;
        setDragX(0);
    }

    function offsetFor(i: number) {
        let raw = i - index;
        const half = Math.floor(total / 2);
        if (raw > half) raw -= total;
        if (raw < -half) raw += total;
        return raw;
    }

    const containerStyle = full
        ? {
              maxWidth: "100%",
              padding: "36px",
              background:
                  "linear-gradient(180deg,#fdeff2 0%, #ffd6e0 50%, #ffcad4 100%)",
          }
        : {
              maxWidth: 1200,
              padding: "48px 28px",
              background: "linear-gradient(180deg,#1a0b17 0%, #2b0d2a 100%)",
          };

    const trackHeight = full ? "calc(100vh - 220px)" : "62vh";

    return (
        <div
            className={
                full
                    ? "fixed inset-0 z-40 flex items-center justify-center"
                    : "w-full"
            }
        >
            <div
                ref={containerRef}
                className={`flex flex-col justify-center items-center relative mx-auto overflow-hidden select-none ${
                    full ? "rounded-none h-full" : "rounded-2xl"
                }`}
                style={{ ...containerStyle, width: full ? "100%" : undefined }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
            >
                {/* <div className="flex flex-col justify-center items-center"> */}
                {/* arrows */}
                <button
                    aria-label="Prev"
                    onClick={() => {
                        prev();
                        setIsPlaying(false);
                        setTimeout(() => setIsPlaying(true), 700);
                    }}
                    className={`absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full ${
                        full
                            ? "bg-white/30 text-white"
                            : "bg-white/10 text-white"
                    } flex items-center justify-center hover:scale-105 transition`}
                >
                    ‹
                </button>

                <button
                    aria-label="Next"
                    onClick={() => {
                        next();
                        setIsPlaying(false);
                        setTimeout(() => setIsPlaying(true), 700);
                    }}
                    className={`absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full ${
                        full
                            ? "bg-white/30 text-white"
                            : "bg-white/10 text-white"
                    } flex items-center justify-center hover:scale-105 transition`}
                >
                    ›
                </button>

                {/* 3D coverflow */}
                <div
                    className="relative w-full mx-auto flex items-center justify-center"
                    style={{ height: trackHeight, perspective: 1800 }}
                >
                    {images.map((src, i) => {
                        const off = offsetFor(i);
                        const absOff = Math.abs(off);
                        const baseX =
                            off * 42 +
                            (dragX / (containerRef.current?.clientWidth || 1)) *
                                100;
                        const rotateY = off * -18 + dragX / 30;
                        const scale =
                            off === 0 ? 1 : Math.max(0.72, 1 - absOff * 0.08);
                        const z = 200 - absOff;
                        const opacity =
                            absOff > 4 ? 0 : 1 - Math.min(0.85, absOff * 0.18);
                        const blur = absOff >= 3 ? 6 : 0;
                        const transition = dragging.current
                            ? "none"
                            : "transform 520ms cubic-bezier(.22,.9,.3,1), opacity 420ms";

                        return (
                            <div
                                key={i}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    width: full ? "60%" : "64%",
                                    transform: `translateX(${baseX}%) translateZ(0) rotateY(${rotateY}deg)`,
                                    transition,
                                    zIndex: z,
                                    opacity,
                                    filter: blur
                                        ? `blur(${blur}px)`
                                        : undefined,
                                    pointerEvents: "auto",
                                }}
                            >
                                <div
                                    className="card relative rounded-2xl overflow-hidden shadow-2xl"
                                    style={{
                                        aspectRatio: "14/9",
                                        transform: `scale(${scale})`,
                                        transition,
                                        background: full
                                            ? "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(255,255,255,0.02))"
                                            : undefined,
                                        border: full
                                            ? "none"
                                            : "1px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    {/* images are NOT clickable per request; removed onClick */}
                                    <img
                                        src={src}
                                        alt={`Photo ${i + 1}`}
                                        draggable={false}
                                        className="w-full h-full object-contain"
                                        style={{
                                            display: "block",
                                            cursor: "default",
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            pointerEvents: "none",
                                            background:
                                                "radial-gradient(ellipse at center, rgba(0,0,0,0) 48%, rgba(0,0,0,0.18) 100%)",
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* dots */}
                <div className="mt-6 flex justify-center gap-3">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            aria-label={`Go to ${i + 1}`}
                            onClick={() => {
                                setIndex(i);
                                setIsPlaying(false);
                                setTimeout(() => setIsPlaying(true), 700);
                            }}
                            className={`w-3.5 h-3.5 rounded-full transition ${
                                i === index
                                    ? full
                                        ? "bg-[#ff2d55]"
                                        : "bg-[#ff2d55]"
                                    : "bg-white/20"
                            }`}
                        />
                    ))}
                </div>
                {/* </div> */}
            </div>
        </div>
    );
}

<style jsx>{`
    /* subtle glass buttons */
    button[aria-label] {
        backdrop-filter: blur(6px);
    }
    /* card reflection effect via pseudo-element is not available inline; use a wrapper div with overflow:hidden instead */
    .card {
        overflow: visible;
    }
    .card:before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: inherit;
        filter: blur(20px) brightness(1.1);
        z-index: -1;
    }
`}</style>;
