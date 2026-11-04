import { tmdb } from "../api/tmdb/client";
import type { Genre, Movie } from "tmdb-ts";
import {MovieCard} from "../components/MovieCard";
import "./Home.css"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "../stores/favoritesStore";
import { useEffect, useMemo, useRef } from "react";

function Home() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
  });

  // 2. Настраиваем IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Если элемент виден и есть следующая страница, и сейчас ничего не грузится
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();

        }
      },
      {
        // Начинаем загрузку заранее, за 200px до конца списка
        rootMargin: '200px'
      }
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    // Очистка при размонтировании
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const popularMovies: Movie[] = data?.pages.flatMap((page) => page.results) ?? [];

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
        {popularMovies.map(movie =>
          <MovieCard
            key={movie.id}
            movie={{
              ...movie,
              genres: movie.genre_ids.flatMap((id) => {
                const genre = genresMap.get(id);
                return genre ? [genre] : [];
              })
            }}
            onToggleFavorite={movie =>toggleFavorite(movie.id)}
          />
        )}
      </div>

       {/* 3. Элемент-триггер и индикатор загрузки */}
      <div ref={loadMoreRef} style={{ height: '20px' }} />

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
