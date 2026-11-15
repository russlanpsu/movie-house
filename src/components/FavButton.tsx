import type { Movie, MovieDetails } from "tmdb-ts";

interface FavButtonProps<T = Movie | MovieDetails> {
  movie: T;
  isFavorite: boolean;
  onToggleFavorite?: (movieId: number) => void;
}

export const FavButton = ({ movie, isFavorite, onToggleFavorite }: FavButtonProps) => {
  return (
    <button
      type="button"
      className={`
        group relative flex h-11 w-11 cursor-pointer items-center justify-center
        rounded-full
        bg-[#14161a]/80 backdrop-blur-sm
        ring-1 ring-white/10
        shadow-lg shadow-black/30
        transition-all duration-300 ease-out
        hover:scale-110 hover:bg-[#14161a] hover:ring-[#f2b84b]/40
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b84b] focus-visible:ring-offset-2 focus-visible:ring-offset-black
        ${isFavorite ? "text-[#f2b84b]" : "text-white/70 hover:text-[#f2b84b]"}
      `}
      aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      aria-pressed={isFavorite}
      onClick={() => onToggleFavorite?.(movie.id)}
    >
      {/* Свечение при избранном */}
      <span
        className={`
          pointer-events-none absolute inset-0 rounded-full
          bg-[#f2b84b]/20 blur-md
          transition-opacity duration-300
          ${isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-50"}
        `}
        aria-hidden="true"
      />

      <svg
        className={`
          relative z-10 h-[18px] w-[18px]
          transition-transform duration-300 ease-out
          ${isFavorite ? "scale-110" : "group-hover:scale-110"}
        `}
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
    </button>
  );
};