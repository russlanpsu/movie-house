import { IMAGE_BASE_URL } from "../constants";
import { useFavoritesStore } from "../stores/favoritesStore";
import { FavButton } from "./FavButton";
import "./MovieCard.css";
import type { Movie, MovieDetails } from "tmdb-ts";

/* export interface Movie {
  id: string | number;
  title: string;
  year: number;
  durationMin: number;
  ageRating: string;
  rating: number;
  genres: string[];
  posterUrl?: string;
} */

export interface MovieCardProps<T = Movie | MovieDetails> {
  // movie: Movie;
  movie: T;
  isFavorite?: boolean;
  /** Максимум жанров в карточке (по умолчанию 2) */
  maxGenres?: number;
  // onToggleFavorite?: (movie: T) => void;
  onToggleFavorite?: (movieId: number) => void;
  onTrailerClick?: (movie: T) => void;
  /** Клик по постеру или названию, например переход на страницу фильма */
  onOpen?: (movie: T) => void;
}

/* function formatDuration(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} мин`;
  return `${h} ч ${String(m).padStart(2, "0")} мин`;
} */

function ratingTone(rating: number): "high" | "mid" | "low" {
  if (rating >= 7.5) return "high";
  if (rating >= 6) return "mid";
  return "low";
}

export function MovieCard({
  movie,
  // isFavorite = false,
  maxGenres = 2,
  onToggleFavorite,
  onTrailerClick,
  onOpen,
}: MovieCardProps) {
  const { title, /*release_date,  durationMin, ageRating, */ vote_average,/*  genre_ids,  genres, */ poster_path, id } = movie;

  /* const isFavoriteFn = useFavoritesStore((state) => state.isFavorite);
  const isFavorite = isFavoriteFn(movie.id); */
  const isFavorite = useFavoritesStore((state) =>
    state.favorites.includes(movie.id)
  );

  const genres = 'genres' in movie ? movie.genres : [];

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        {poster_path ? (
          <a
            href={`/film/${id}`}
          >
            <img
              className="movie-card__img"
              src={`${IMAGE_BASE_URL}/t/p/w500/${poster_path}`}
              alt={`Постер фильма «${title}»`}
              loading="lazy"
              // width={260}
              // width={"100%"}
              height={340}
            />
          </a>
        ) : (
          <span className="movie-card__placeholder" aria-hidden="true">
            {title.trim().charAt(0).toUpperCase()}
          </span>
        )}

        <span
          className={`movie-card__rating movie-card__rating--${ratingTone(vote_average)}`}
          aria-label={`Рейтинг ${vote_average.toFixed(1)} из 10`}
        >
          {vote_average.toFixed(1)}
        </span>

        {/* <button
          type="button"
          className="movie-card__fav"
          aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
          title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite?.(movie)}
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
        </button> */}
        <div className="movie-card__fav ">
          <FavButton
            movie={movie}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      </div>

      <div className="movie-card__body">
        <div className="movie-card__head">
          {onOpen ? (
            <button
              type="button"
              className="movie-card__title movie-card__title--link"
              onClick={() => onOpen(movie)}
            >
              {title}
            </button>
          ) : (
            <h3 className="movie-card__title">{title}</h3>
          )}
          {/* <span className="movie-card__meta">
            {year} · {formatDuration(durationMin)} · {ageRating}
          </span> */}
        </div>

        {/* {genre_ids.length > 0 && (
          <ul className="movie-card__genres">
            {genre_ids.slice(0, maxGenres).map((genre) => (
              <li key={genre} className="movie-card__chip">
                {genre}
              </li>
            ))}
          </ul>
        )} */}
        {genres.length > 0 && (
          <ul className="movie-card__genres">
            {genres.slice(0, maxGenres).map((genre) => (
              <li key={genre.id} className="movie-card__chip">
                {genre.name}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className="movie-card__trailer"
          onClick={() => onTrailerClick?.(movie)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 4l13 8-13 8z" />
          </svg>
          Трейлер
        </button>
      </div>
    </article>
  );
}

// export const MovieCard = memo(MovieCardBase);
// export default MovieCard;
