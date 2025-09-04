import PhotoCarousel from "@/components/PhotoCarousel";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Gallery - Anniversary",
};

export default function GalleryPage() {
  // Server-side: read public/gallery
  const galleryDir = path.join(process.cwd(), "public", "gallery");
  let files: string[] = [];
  try {
    files = fs.readdirSync(galleryDir)
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort();
  } catch (e) {
    files = [];
  }

  const images = files.map((f) => `/gallery/${encodeURIComponent(f)}`);

  // If no images, keep the helpful centered card. Otherwise show immersive full-screen carousel.
  if (images.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#fff0f4] via-[#ffd6e0] to-[#ffcad4]">
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 border border-white/60 text-center">
          <h1 className="text-2xl font-extrabold text-[#ff2d55] mb-4">Memories — Photo Carousel</h1>
          <div className="text-sm text-[#7a2b3a]">
            No images found. Place your pictures in <code className="px-1 py-0.5 bg-pink-50 rounded">/public/gallery</code>.
          </div>
        </div>
      </main>
    );
  }

  // immersive full-page carousel
  return (
    <>
      <PhotoCarousel images={images} full />
      {/* keep page semantics accessible for users without JavaScript
      <noscript>
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-[#ff2d55] mb-4">Memories — Photo Carousel</h2>
            <p className="text-sm text-gray-600 mb-4">
              This gallery requires JavaScript to display images. Please enable JavaScript or use a modern browser.
            </p>
            <a
              href="https://www.google.com/search?q=enable+javascript"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 text-white bg-[#ff2d55] rounded-lg shadow hover:bg-[#e62b4d] transition"
            >
              How to enable JavaScript
            </a>
          </div>
        </div>
      </noscript> */}
    </>
  );
}