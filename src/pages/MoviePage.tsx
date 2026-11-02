// В компоненте страницы фильма
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import { tmdb } from '../api/tmdb';
// import { MovieDetails } from '../components/MovieDetails';
import { tmdb } from '../api/tmdb/client';
import type { MovieDetails as TmdbMovieDetails} from 'tmdb-ts';
import { MovieDetails, type MovieDetailsProps } from '../components/MovieDetails';

export function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsProps['movie'] | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await tmdb.movies.details(Number(id), ['credits']);
      setMovie(data);
    })();
  }, [id]);

  if (!movie) return <p>Загрузка…</p>;

  return <MovieDetails movie={movie} />;
}