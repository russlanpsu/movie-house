import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { tmdb } from '../api/tmdb/client';
import { MovieDetails } from '../components/MovieDetails';

export function MoviePage() {
  const { id } = useParams<{ id: string }>();

  const { data: movie, isLoading, isError, error } = useQuery({
    // 1. Ключ: id — часть идентичности кэша
    queryKey: ['movie', id],
    // 2. Функция запроса: использует id
    queryFn: () => tmdb.movies.details(Number(id), ['credits']),
    // 3. Опционально: не запрашивать, если id нет
    enabled: !!id,
  });

  if (isLoading) return <p>Загрузка…</p>;
  if (isError) return <p>Ошибка: {error.message}</p>;
  if (!movie) return <p>Фильм не найден</p>;

  return <MovieDetails movie={movie} />;
}