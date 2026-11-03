// src/pages/FavoritesPage.tsx
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type {  MovieDetails } from 'tmdb-ts';
import { tmdb } from '../api/tmdb/client';
import { MovieCard } from '../components/MovieCard';
import { useFavoritesStore } from '../stores/favoritesStore';
import './FavoritesPage.css';

export function FavoritesPage() {
  // Подписка на список ID из Zustand (он сам читает/пишет localStorage через persist)
  const favorites = useFavoritesStore((state) => state.favorites);

  const {
    data: movies,
    isPending,
    isError,
    error,
  } = useQuery({
    // Ключ включает favorites — при изменении списка запрос перезапустится
    queryKey: ['favorites', favorites],
    //queryFn: async (): Promise<Movie[]> => {
    queryFn: async ()  => {
      // Promise.allSettled: один упавший details(id) не ломает всю страницу
      const results = await Promise.allSettled(
        favorites.map((id) => tmdb.movies.details(id))
      );

      return results
        /* .filter(
          (r): r is PromiseFulfilledResult<Movie> => r.status === 'fulfilled'
        )
        .map((r) => r.value); */
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<MovieDetails>).value);
    },
    // Не делаем запрос, если избранное пусто
    enabled: favorites.length > 0,
  });

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);


  // Пустой список — отдельное состояние, не ошибка и не загрузка
  if (favorites.length === 0) {
    return (
      <section className="favorites-page">
        <h1>Избранное</h1>
        <p className="favorites-page__empty">
          Пока ничего не добавлено. <Link to="/">Перейти к популярным фильмам</Link>
        </p>
      </section>
    );
  }

  if (isPending) {
    return (
      <section className="favorites-page">
        <h1>Избранное</h1>
        <p>Загрузка…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="favorites-page">
        <h1>Избранное</h1>
        <p className="favorites-page__error">
          Не удалось загрузить избранное: {error.message}
        </p>
      </section>
    );
  }

  // Если все details упали (например, фильмы удалены из TMDB) —
  // movies будет пустым массивом, хотя favorites не пуст
  if (movies.length === 0) {
    return (
      <section className="favorites-page">
        <h1>Избранное</h1>
        <p className="favorites-page__empty">
          Не удалось получить данные о сохранённых фильмах.
        </p>
      </section>
    );
  }

  return (
    <section className="favorites-page">
      <h1>Избранное</h1>
      <p className="favorites-page__count">
        {movies.length} {pluralizeMovies(movies.length)}
      </p>
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleFavorite={movie =>toggleFavorite(movie.id)}
          />
        ))}
      </div>
    </section>
  );
}

// Простая плюрализация для счётчика
function pluralizeMovies(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'фильм';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'фильма';
  return 'фильмов';
}

export default FavoritesPage;