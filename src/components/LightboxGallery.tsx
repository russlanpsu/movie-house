import { useMemo, useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Плагины
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
// Импорт Captions расширяет тип Slide полями title и description
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";

export interface GalleryImage {
  fullUrl: string;
  thumbnailUrl: string;
}

export interface LightboxGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export default function LightboxGallery({
  images,
  className = "",
}: LightboxGalleryProps) {
  // -1 — лайтбокс закрыт, иначе индекс открытой картинки
  const [index, setIndex] = useState<number>(-1);

  // Полноразмерные картинки загружаются лайтбоксом только при открытии
  const slides = useMemo(
    () => images.map(({ fullUrl }) => ({ src: fullUrl })),
    [images],
  );

  if (images.length === 0) return null;

  return (
    <>
      <div
        className={`flex flex-nowrap gap-3 overflow-x-auto overflow-y-hidden pb-2 snap-x snap-proximity ${className}`}
      >
        {images.map((image, i) => (
          <button
            key={`${image.fullUrl}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Открыть изображение ${i + 1} из ${images.length}`}
            className="shrink-0 snap-start cursor-zoom-in overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <img
              src={image.thumbnailUrl}
              alt={`Изображение ${i + 1}`}
              loading="lazy"
              draggable={false}
              className="block h-40 w-auto max-w-none object-cover transition-opacity hover:opacity-85"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        on={{ view: ({ index: current }) => setIndex(current) }}
        plugins={[Captions, Counter, Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  );
}
