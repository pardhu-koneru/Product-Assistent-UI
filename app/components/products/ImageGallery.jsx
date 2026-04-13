import { resolveMediaUrl } from "~/services/mediaUrl";

/**
 * ImageGallery — product image viewer with thumbnail strip.
 *
 * @param {{ images: Array, selectedIdx: number, onSelect: (idx: number) => void, title: string }} props
 */
export default function ImageGallery({ images, selectedIdx, onSelect, title }) {
  const currentImage = images[selectedIdx] || images[0];
  const currentSrc = resolveMediaUrl(currentImage.image);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="max-h-96 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
        <img
          src={currentSrc}
          alt={currentImage.alt_text || title}
          className="max-h-96 w-auto object-contain"
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => {
            const thumbSrc = resolveMediaUrl(img.image);
            return (
              <button
                key={img.id}
                onClick={() => onSelect(idx)}
                className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === selectedIdx
                    ? "border-indigo-600"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={thumbSrc}
                  alt={img.alt_text || `Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
