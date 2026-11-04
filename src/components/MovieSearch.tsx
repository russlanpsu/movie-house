import { Autocomplete, TextField, type AutocompleteInputChangeReason } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import { tmdb } from '../api/tmdb/client';
import { useNavigate } from 'react-router-dom';

type Movie = { id: number; title: string; release_date?: string };

export function MovieSearch() {
  const [options, setOptions] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  // const controllerRef = useRef<AbortController | null>(null);

  const navigate = useNavigate();

  const search = useDebouncedCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 3 ) return setOptions([]);

    // Отменяем предыдущий запрос — защита от гонки
    // controllerRef.current?.abort();
    // const controller = new AbortController();
    // controllerRef.current = controller;

    setLoading(true);
    try {
      const data = await tmdb.search.movies({query })
      setOptions(data.results);
    } catch (err) {
      // if ((err as Error).name !== 'AbortError') setOptions([]);
      console.error(err);
    } finally {
      // if (!controller.signal.aborted) setLoading(false);
      setLoading(false);
    }
  }, 400);

  const handleInputChange = (
    _event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    // Игнорируем сброс при выборе фильма
    if (reason !== 'input') return;
    search(value);
  };

  const handleChange = (
    _event: React.SyntheticEvent,
    value: Movie | null
  ) => {
    if (value) {
      navigate(`/film/${value.id}`);
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(o) => `${o.title} (${o.release_date?.substring(0,4)})`}
      loading={loading}
      onInputChange={handleInputChange}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} label="Найти фильм" />}
      sx={{ width: 400 }}
    />
  );
}