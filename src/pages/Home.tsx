import { useEffect, useState } from "react"
import { tmdb } from "../api/tmdb/client";
import type { Movie } from "tmdb-ts";
import {MovieCard} from "../components/MovieCard";
import "./Home.css"

function Home() {

  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('Start Home...')

  useEffect(() => {
    console.log('Run effect...');
    (async() => {
      console.log('Before run api...');
      const popularMovies = (await tmdb.movies.popular()).results;
      console.log('After run api...');
      setPopularMovies(popularMovies);
      console.log({popularMovies});
      const film = await tmdb.movies.details(155, ['credits']);
      console.log({film});
    })();
  }, []);

  const loadMore = async () => {
    if (isLoading) return;
    if (totalPages !== null && page >= totalPages) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const response = await tmdb.movies.popular({ page: nextPage });
      setPopularMovies(prev => [...prev, ...response.results]);
      setPage(nextPage);
      setTotalPages(response.total_pages);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMore = totalPages === null || page < totalPages;

  return (
    <section>
      <h1>Home</h1>
      <p>Главная страница (заглушка)</p>
      <div className="movie-list">
        {popularMovies.map(movie =>
          <MovieCard key={movie.id} movie={movie}/>
        )}
      </div>
      {popularMovies.length}
      {hasMore && (
        <button onClick={loadMore} disabled={isLoading}>
          {isLoading ? 'Загрузка…' : 'Показать ещё'}
        </button>
      )}
    </section>
  )
}

export default Home
