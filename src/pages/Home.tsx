import { tmdb } from "../api/tmdb/client";
import type { Movie } from "tmdb-ts";
import {MovieCard} from "../components/MovieCard";
import "./Home.css"
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "../stores/favoritesStore";

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

  /* const onToggleFavoriteHandler = (movie: Movie) => {
    console.log('Toggle favorite: ', movie);
  } */

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  // const isFavorite = useFavoritesStore((state) => state.isFavorite);

  return (
    <section>
      <h1>Home</h1>
      <p>Главная страница (заглушка)</p>

      {error && <div className="error-message">{error.message}</div>}


      {/* Показываем лоадер, если грузится самая первая страница */}
      {isLoading && <p>Загрузка фильмов...</p>}
      <div className="movie-list">
        {popularMovies.map(movie =>
          <MovieCard
            key={movie.id}
            // isFavorite={isFavorite(movie.id)}
            // movie={{...movie, genres: [{id:1, name: 'Drama'}, {id:2, name: 'Thriller'}]}}
            movie={movie}
            onToggleFavorite={movie =>toggleFavorite(movie.id)}
          />
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
