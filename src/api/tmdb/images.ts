import { IMAGE_BASE_URL } from '../../constants';

// Размеры, которые TMDB отдаёт для каждого типа картинок
export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type StillSize = 'w92' | 'w185' | 'w300' | 'original';
export type LogoSize = 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';

export type ImageSize = PosterSize | ProfileSize | BackdropSize | StillSize | LogoSize;

type ImagePath = string | null | undefined;

/**
 * Если путь точно строка — результат string,
 * если может отсутствовать — string | null
 */
type ImageUrl<P extends ImagePath> = P extends string ? string : string | null;

/** Полный URL картинки TMDB или null, если пути нет */
export function tmdbImageUrl<P extends ImagePath>(
  path: P,
  size: ImageSize = 'original',
): ImageUrl<P> {
  if (!path) return null as ImageUrl<P>;
  // TMDB отдаёт пути со слэшем в начале ("/abc.jpg"), но подстрахуемся
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${IMAGE_BASE_URL}/t/p/${size}${normalized}` as ImageUrl<P>;
}

// Обёртки с типобезопасными размерами для конкретных видов картинок
export const posterUrl = <P extends ImagePath>(path: P, size: PosterSize = 'w500') =>
  tmdbImageUrl(path, size);
export const profileUrl = <P extends ImagePath>(path: P, size: ProfileSize = 'w185') =>
  tmdbImageUrl(path, size);
export const backdropUrl = <P extends ImagePath>(path: P, size: BackdropSize = 'w1280') =>
  tmdbImageUrl(path, size);
export const stillUrl = <P extends ImagePath>(path: P, size: StillSize = 'w300') =>
  tmdbImageUrl(path, size);
export const logoUrl = <P extends ImagePath>(path: P, size: LogoSize = 'w185') =>
  tmdbImageUrl(path, size);
