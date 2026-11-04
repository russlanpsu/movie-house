import type { AppendToResponse, MovieDetails } from 'tmdb-ts';
import styles from './MovieDetails.module.css';
import { FavButton } from './FavButton';
import { useFavoritesStore } from '../stores/favoritesStore';

export interface MovieDetailsProps {
  movie: AppendToResponse<MovieDetails, "credits"[], "movie">;
}

// Базовый URL для изображений TMDB
const IMAGE_BASE = 'https://ancient-dream-2e3d.ruslanpsu.workers.dev/t/p';

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours} ч ${mins} мин` : `${mins} мин`;
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  const {
    title,
    original_title,
    overview,
    tagline,
    poster_path,
    backdrop_path,
    release_date,
    runtime,
    vote_average,
    vote_count,
    genres,
    production_companies,
    production_countries,
    spoken_languages,
    budget,
    revenue,
    status,
    homepage,
    imdb_id,
    belongs_to_collection,
    credits,
  } = movie;

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.favorites.includes(movie.id));

  const releaseYear = release_date ? new Date(release_date).getFullYear() : null;
  const cast = credits?.cast ?? [];

  return (
    <article className={styles.container}>
      {/* Фоновый постер (backdrop) */}
      {backdrop_path && (
        <div
          className={styles.backdrop}
          style={{ backgroundImage: `url(${IMAGE_BASE}/w1280${backdrop_path})` }}
        >
          <div className={styles.backdropOverlay} />
        </div>
      )}

      <div className={styles.content}>
        {/* Постер + основная информация */}
        <div className={styles.mainInfo}>
          {poster_path && (
            <img
              className={styles.poster}
              src={`${IMAGE_BASE}/w500${poster_path}`}
              alt={`Постер фильма ${title}`}
            />
          )}

          <div className={styles.info}>

            <h1 className={styles.title}>
              {title} {releaseYear && <span className={styles.year}>({releaseYear})</span>}
            </h1>

            {original_title !== title && (
              <p className={styles.originalTitle}>Оригинальное название: {original_title}</p>
            )}

            {tagline && <p className={styles.tagline}>«{tagline}»</p>}

            {/* Рейтинг */}
            <div className={styles.rating}>
              <span className={styles.ratingValue}>★ {vote_average.toFixed(1)}</span>
              <span className={styles.ratingCount}>({vote_count.toLocaleString('ru-RU')} голосов)</span>
            </div>

            {/* Метаданные */}
            <ul className={styles.metaList}>
              {release_date && (
                <li>
                  <strong>Дата выхода:</strong> {new Date(release_date).toLocaleDateString('ru-RU')}
                </li>
              )}
              {runtime > 0 && (
                <li>
                  <strong>Длительность:</strong> {formatRuntime(runtime)}
                </li>
              )}
              {status && (
                <li>
                  <strong>Статус:</strong> {status}
                </li>
              )}
              {production_countries.length > 0 && (
                <li>
                  <strong>Страна:</strong>{' '}
                  {production_countries.map((c) => c.name).join(', ')}
                </li>
              )}
              {spoken_languages.length > 0 && (
                <li>
                  <strong>Языки:</strong>{' '}
                  {spoken_languages.map((l) => l.english_name).join(', ')}
                </li>
              )}
            </ul>

            {/* Жанры */}
            {genres.length > 0 && (
              <div className={styles.genres}>
                {genres.map((genre) => (
                  <span key={genre.id} className={styles.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Ссылки */}
            <div className={styles.links}>
              {homepage && (
                <a href={homepage} target="_blank" rel="noopener noreferrer">
                  Официальный сайт
                </a>
              )}
              {imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IMDb
                </a>
              )}
            </div>
            <FavButton
              movie={movie}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </div>

        {/* Описание */}
        {overview && (
          <section className={styles.section}>
            <h2>Описание</h2>
            <p>{overview}</p>
          </section>
        )}

        {/* Коллекция */}
        {belongs_to_collection && (
          <section className={styles.section}>
            <h2>Коллекция</h2>
            <p>{belongs_to_collection.name}</p>
          </section>
        )}

        {/* Актёрский состав */}
        {cast.length > 0 && (
          <section className={styles.section}>
            <h2>В главных ролях</h2>
            <ul className={styles.castList}>
              {cast.slice(0, 10).map((actor) => (
                <li key={actor.id} className={styles.castItem}>
                  {actor.profile_path ? (
                    <a href={`/person/${actor.id}`}>
                      <img
                        className={styles.castPhoto}
                        src={`${IMAGE_BASE}/w185${actor.profile_path}`}
                        alt={actor.name}
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <div className={styles.castPhotoPlaceholder} />
                  )}
                  <div>
                    <p className={styles.castName}>{actor.name}</p>
                    <p className={styles.castCharacter}>{actor.character}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Финансы и компании */}
        <section className={styles.section}>
          <h2>Финансы</h2>
          <ul className={styles.metaList}>
            {budget > 0 && (
              <li>
                <strong>Бюджет:</strong> {formatMoney(budget)}
              </li>
            )}
            {revenue > 0 && (
              <li>
                <strong>Сборы:</strong> {formatMoney(revenue)}
              </li>
            )}
          </ul>
        </section>

        {production_companies.length > 0 && (
          <section className={styles.section}>
            <h2>Производство</h2>
            <ul className={styles.companiesList}>
              {production_companies.map((company) => (
                <li key={company.id}>
                  {company.logo_path && (
                    <img
                      className={styles.companyLogo}
                      src={`${IMAGE_BASE}/w92${company.logo_path}`}
                      alt={company.name}
                      loading="lazy"
                    />
                  )}
                  <span>{company.name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}