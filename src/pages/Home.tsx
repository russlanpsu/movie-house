import { tmdb } from "../api/tmdb/client";
import type { Genre, Movie } from "tmdb-ts";
import {MovieCard} from "../components/MovieCard";
import "./Home.css"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "../stores/favoritesStore";
import { useMemo } from "react";
// import { useInView } from "react-intersection-observer";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
// import { MovieDetails } from "../components/MovieDetails";



function Home() {

   // 1. Хук useInView возвращает ref для элемента-триггера и флаг inView
  /* const { ref, inView } = useInView({
    // Начинаем загрузку заранее, за 200px до конца списка
    rootMargin: '200px',
  }); */


  const { data: genresData, isLoading: isGenresLoading } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: () => tmdb.genres.movies(), // Метод tmdb-ts для получения жанров
    staleTime: Infinity, // Жанры меняются очень редко, можно кешировать надолго
  });

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
    enabled: !!genresData,
    refetchOnWindowFocus: false,
    /* refetchOnMount: false,  */
  });

  const ref = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: hasNextPage && !isFetchingNextPage,
    rootMargin: "200px",
  });

  /* useEffect(() => {
    // Проверяем, что триггер виден, есть следующая страница и загрузка не идет
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]); */

  const popularMovies: Movie[] = data?.pages.flatMap((page) => page.results) ?? [];
  const uniqueMovies = Array.from(
    new Map(popularMovies.map((movie) => [movie.id, movie])).values()
  );

  // Создаем Map для быстрого поиска названия жанра по id
  const genresMap = useMemo(() => {
    if (!genresData) return new Map<number, Genre>();
    return new Map(genresData.genres.map((g) => [g.id, g]));
  }, [genresData]);

  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  // const isFavorite = useFavoritesStore((state) => state.isFavorite);

  return (
    <section>
      <h1>Home</h1>
      <p>Главная страница (заглушка)</p>

      {error && <div className="error-message">{error.message}</div>}


      {/* Показываем лоадер, если грузится самая первая страница */}
      {(isLoading || isGenresLoading )&& <p>Загрузка фильмов...</p>}
      <div className="movie-list">
        {uniqueMovies.map(movie =>
          <MovieCard
            key={`${movie.id}|${data?.pageParams[data?.pageParams.length - 1]}`}
            movie={{
              ...movie,
              genres: movie.genre_ids.flatMap((id) => {
                const genre = genresMap.get(id);
                return genre ? [genre] : [];
              })
            }}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </div>

       {/* 3. Элемент-триггер и индикатор загрузки */}
      <div ref={ref} style={{ height: '20px' }} />

      {isFetchingNextPage && <p>Загрузка...</p>}


      {/* {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Загрузка…" : "Показать ещё"}
        </button>
      )} */}
    </section>
  )
}

export default Home
