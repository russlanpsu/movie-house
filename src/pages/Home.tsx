import { useEffect, useState } from "react"
import { tmdb } from "../api/tmdb/client";
import type { Movie } from "tmdb-ts";
import MovieCard from "../components/MovieCard";


function Home() {

  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

  useEffect(() => {
    (async() => {
      const popularMovies = (await tmdb.movies.popular()).results;
      setPopularMovies(popularMovies);
    })();
  }, []);

  return (
    <section>
      <h1>Home</h1>
      <p>Главная страница (заглушка)</p>
      {popularMovies.map(movie =>
        <MovieCard movie={movie}
        />
      )}
    </section>
  )
}

export default Home
