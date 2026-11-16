import { useMemo, useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Плагины
// import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
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
  /** Классы контейнера-ленты (раскладка, отступы между миниатюрами) */
  className?: string;
  /** Классы обёртки миниатюры: скругление, рамка, тень. Заменяют значения по умолчанию */
  itemClassName?: string;
  /** Классы изображения: размер, object-fit, эффекты. Заменяют значения по умолчанию */
  imageClassName?: string;
  /** Alt-текст миниатюр; к нему добавляется номер, если картинок больше одной */
  alt?: string;
}

// Значения по умолчанию — горизонтальная лента миниатюр
const DEFAULT_CONTAINER =
  "flex flex-nowrap gap-3 overflow-x-auto overflow-y-hidden pb-2 snap-x snap-proximity";
const DEFAULT_ITEM = "rounded-lg";
const DEFAULT_IMAGE =
  "h-40 w-auto max-w-none object-cover transition-opacity hover:opacity-85";

export default function LightboxGallery({
  images,
  className = DEFAULT_CONTAINER,
  itemClassName = DEFAULT_ITEM,
  imageClassName = DEFAULT_IMAGE,
  alt = "Изображение",
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
      <div className={className}>
        {images.map((image, i) => (
          <button
            key={`${image.fullUrl}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Открыть изображение ${i + 1} из ${images.length}`}
            className={`shrink-0 snap-start cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${itemClassName}`}
          >
            <img
              src={image.thumbnailUrl}
              alt={images.length > 1 ? `${alt} ${i + 1}` : alt}
              loading="lazy"
              draggable={false}
              className={`block ${imageClassName}`}
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
        plugins={[Captions, Counter, Fullscreen, Slideshow, /* Thumbnails, */ Zoom]}
      />
    </>
  );
}
