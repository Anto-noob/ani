"use client";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fff0f4] via-[#ffd6e0] to-[#ffcad4] p-6">
            <div className="max-w-4xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-white/60">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <svg
                            viewBox="0 0 100 100"
                            className="w-36 h-36 sm:w-44 sm:h-44 mx-auto"
                        >
                            <defs>
                                <linearGradient
                                    id="g1"
                                    x1="0%"
                                    x2="100%"
                                    y1="0%"
                                    y2="100%"
                                >
                                    <stop offset="0%" stopColor="#ff9eb3" />
                                    <stop offset="50%" stopColor="#ff6b81" />
                                    <stop offset="100%" stopColor="#ff2d55" />
                                </linearGradient>
                            </defs>
                            <path
                                fill="url(#g1)"
                                d="M50 85s-26-16-36-28c-9-11-6-26 6-33 12-7 25 1 30 7 5-6 18-14 30-7 12 7 15 22 6 33-10 12-36 28-36 28z"
                                className="origin-center animate-pulse-slow"
                            />
                        </svg>
                        {/* <span className="absolute -bottom-2 right-0 text-sm text-pink-600 font-semibold">3 years</span> */}
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-[#ff2d55] tracking-tight">
                        Happy 3rd Anniversary
                    </h1>

                    <p className="max-w-2xl text-sm sm:text-base text-[#6b2430]">
                        Three years together💕 every laugh, every hug, every tiny miracle. May the next years be even sweeter.
                    </p>

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => router.push("/gallery")}
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow hover:scale-[1.02] transition-transform focus:outline-none"
                        >
                            View Memories
                        </button>
                        <button
                            onClick={() => router.push("/threejs/index.html")}
                            className="flex flex-row justify-center items-center px-6 py-2 rounded-full bg-white text-pink-600 border border-pink-200 font-medium shadow-sm hover:bg-pink-50 transition"
                        >
                            View this <span className="mb-2">👉👈</span>
                        </button>
                    </div>
                    {/* 
          <div className="mt-6 w-full grid grid-cols-3 gap-3 sm:gap-6">
            <div className="rounded-xl bg-pink-50 p-3">
              <h3 className="text-xs font-semibold text-pink-600">Date</h3>
              <p className="text-sm text-[#7a2b3a]">Established 3 years ago</p>
            </div>
            <div className="rounded-xl bg-pink-50 p-3">
              <h3 className="text-xs font-semibold text-pink-600">Moments</h3>
              <p className="text-sm text-[#7a2b3a]">Shared laughs, trips & cosy nights</p>
            </div>
            <div className="rounded-xl bg-pink-50 p-3">
              <h3 className="text-xs font-semibold text-pink-600">Promise</h3>
              <p className="text-sm text-[#7a2b3a]">Many more sunsets together</p>
            </div>
          </div> */}

                    <footer className="mt-6 text-xs text-[#8b3a46] opacity-90">
                        Made with ♥
                    </footer>
                </div>

                <style jsx>{`
                    .animate-pulse-slow {
                        animation: pulse 2.8s ease-in-out infinite;
                        transform-origin: center;
                    }

                    @keyframes pulse {
                        0% {
                            transform: scale(1);
                            filter: drop-shadow(
                                0 6px 18px rgba(255, 45, 85, 0.18)
                            );
                        }
                        50% {
                            transform: scale(1.06);
                            filter: drop-shadow(
                                0 12px 30px rgba(255, 45, 85, 0.22)
                            );
                        }
                        100% {
                            transform: scale(1);
                            filter: drop-shadow(
                                0 6px 18px rgba(255, 45, 85, 0.18)
                            );
                        }
                    }
                `}</style>
            </div>
        </main>
    );
}
