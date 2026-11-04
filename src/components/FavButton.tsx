import type { Movie, MovieDetails } from "tmdb-ts";

interface FavButtonProps<T = Movie | MovieDetails>{
  movie: T;
  isFavorite: boolean;
  // onToggleFavorite?:(movie: T) => void;
  onToggleFavorite?:(movieId: number) => void;
}

export const FavButton = ({movie, isFavorite, onToggleFavorite}: FavButtonProps) => {
  return (
    <button
      type="button"
      // className="movie-card__fav"
      // className="w-[60px] h-[60px]"
      //text-[#f2b84b]
      className="cursor-pointer bg-[#14161a] text-[#f2b84b]"
      aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      aria-pressed={isFavorite}
      onClick={() => onToggleFavorite?.(movie.id)}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
    </button>
  )
}