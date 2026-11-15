import { useState, type CSSProperties } from "react";

import Lightbox, { type Slide } from "yet-another-react-lightbox";
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

// Тип слайда: изображение + подписи для плагина Captions
type GallerySlide = Slide & {
  src: string;
  width: number;
  height: number;
  title: string;
  description: string;
};

const slides: GallerySlide[] = [
  {
    src: "https://picsum.photos/id/1015/1600/1000",
    width: 1600,
    height: 1000,
    title: "Горная река",
    description: "Долина, залитая утренним светом",
  },
  {
    src: "https://picsum.photos/id/1018/1600/1000",
    width: 1600,
    height: 1000,
    title: "Горы",
    description: "Туман между вершинами",
  },
  {
    src: "https://picsum.photos/id/1039/1600/1000",
    width: 1600,
    height: 1000,
    title: "Водопад",
    description: "Тихая вода и мох",
  },
  {
    src: "https://picsum.photos/id/1043/1600/1000",
    width: 1600,
    height: 1000,
    title: "Побережье",
    description: "Закат над морем",
  },
  {
    src: "https://picsum.photos/id/1056/1600/1000",
    width: 1600,
    height: 1000,
    title: "Город",
    description: "Вечерние огни",
  },
  {
    src: "https://picsum.photos/id/1067/1600/1000",
    width: 1600,
    height: 1000,
    title: "Лес",
    description: "Тропа между деревьев",
  },
];

const thumb = (src: string): string => src.replace("/1600/1000", "/400/300");

export default function LightboxDemo() {
  // index === -1 — лайтбокс закрыт, иначе — индекс открытого слайда
  const [index, setIndex] = useState<number>(-1);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Галерея</h1>
      <p style={styles.hint}>
        Нажмите на фото. Доступны зум (колесо мыши / pinch), слайд-шоу,
        полноэкранный режим, миниатюры и подписи.
      </p>

      <div style={styles.grid}>
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            style={styles.item}
            onClick={() => setIndex(i)}
            aria-label={`Открыть: ${slide.title}`}
          >
            <img
              src={thumb(slide.src)}
              alt={slide.title}
              loading="lazy"
              style={styles.img}
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        // Синхронизируем индекс при листании
        on={{ view: ({ index: current }) => setIndex(current) }}
        plugins={[Captions, Counter, Fullscreen, Slideshow, Thumbnails, Zoom]}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        slideshow={{ autoplay: false, delay: 3000 }}
        thumbnails={{ position: "bottom", width: 100, height: 70, gap: 8 }}
        counter={{ container: { style: { top: 0, bottom: "unset" } } }}
        carousel={{ finite: false, preload: 2 }}
        animation={{ fade: 250, swipe: 350 }}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "system-ui, sans-serif",
  },
  title: { margin: 0, fontSize: 28 },
  hint: { color: "#555", margin: "8px 0 24px", maxWidth: 560 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 12,
  },
  item: {
    padding: 0,
    border: "none",
    background: "none",
    cursor: "zoom-in",
    borderRadius: 8,
    overflow: "hidden",
    aspectRatio: "4 / 3",
  },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
};
