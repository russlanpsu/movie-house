import { tmdb } from "../api/tmdb/client";
import type { Movie } from "tmdb-ts";
import {MovieCard} from "../components/MovieCard";
import "./Home.css"
import { useInfiniteQuery } from "@tanstack/react-query";

function Home() {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["popularMovies"],
    queryFn: ({ pageParam }) => tmdb.movies.popular({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
  });

  const popularMovies: Movie[] = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <section>
      <h1>Home</h1>
      <p>Главная страница (заглушка)</p>

      {error && <div className="error-message">{error.message}</div>}


      {/* Показываем лоадер, если грузится самая первая страница */}
      {isLoading && <p>Загрузка фильмов...</p>}
      <div className="movie-list">
        {popularMovies.map(movie =>
          <MovieCard key={movie.id} movie={movie}/>
        )}
      </div>


      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Загрузка…" : "Показать ещё"}
        </button>
      )}
    </section>
  )
}

export default Home
