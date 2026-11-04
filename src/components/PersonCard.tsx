import type { PersonDetailsEx } from '../api/tmdb/api-utils';
import { IMAGE_BASE_URL } from '../constants';


interface PersonCardProps {
  person: PersonDetailsEx;
}

// const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const PersonCard = ({ person }: PersonCardProps) => {
  // Безопасное извлечение вложенных данных (могут быть undefined)
  const externalIds = person.external_ids;
  const images = person.images?.profiles || [];
  const movieCredits = person.movie_credits?.cast || [];
  const tvCredits = person.tv_credits?.cast || [];

  // Определение пола
  const genderMap: Record<number, string> = {
    0: 'Не указан',
    1: 'Женский',
    2: 'Мужской',
    3: 'Небинарный',
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="md:flex">
        {/* Левая колонка: Фото и основная информация */}
        <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col items-center">
          {person.profile_path ? (
            <img
              src={`${IMAGE_BASE_URL}/t/p/w500/${person.profile_path}`}
              alt={person.name}
              className="w-64 h-64 object-cover rounded-full shadow-lg border-4 border-white"
            />
          ) : (
            <div className="w-64 h-64 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 shadow-lg border-4 border-white">
              Нет фото
            </div>
          )}

          <h1 className="mt-4 text-3xl font-bold text-center text-gray-900">{person.name}</h1>

          {person.also_known_as?.length > 0 && (
            <p className="text-sm text-gray-500 text-center mt-1">
              Также известен как: {person.also_known_as.join(', ')}
            </p>
          )}

          <div className="mt-6 w-full space-y-3 text-sm text-gray-700">
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Известен по:</span>
              <span>{person.known_for_department || '—'}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Пол:</span>
              <span>{genderMap[person.gender] || '—'}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">День рождения:</span>
              <span>{person.birthday || '—'}</span>
            </div>
            {person.deathday && (
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold">День смерти:</span>
                <span>{person.deathday}</span>
              </div>
            )}
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Место рождения:</span>
              <span className="text-right">{person.place_of_birth || '—'}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Популярность:</span>
              <span>{person.popularity?.toFixed(2) || '—'}</span>
            </div>
          </div>

          {/* Внешние ссылки */}
          <div className="mt-6 w-full flex flex-wrap gap-2 justify-center">
            {person.homepage && (
              <a
                href={person.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-700"
              >
                Домашняя страница
              </a>
            )}
            {person.imdb_id && (
              <a
                href={`https://www.imdb.com/name/${person.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-yellow-500 text-black rounded-full text-xs hover:bg-yellow-600"
              >
                IMDb
              </a>
            )}
            {externalIds?.instagram_id && (
              <a
                href={`https://instagram.com/${externalIds.instagram_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-pink-600 text-white rounded-full text-xs hover:bg-pink-700"
              >
                Instagram
              </a>
            )}
            {externalIds?.twitter_id && (
              <a
                href={`https://twitter.com/${externalIds.twitter_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-sky-500 text-white rounded-full text-xs hover:bg-sky-600"
              >
                Twitter
              </a>
            )}
          </div>
        </div>

        {/* Правая колонка: Биография и фильмография */}
        <div className="md:w-2/3 p-6 md:p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Биография</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {person.biography || 'Биография отсутствует.'}
            </p>
          </section>

          {/* Фильмография (кино) */}
          {movieCredits.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Фильмография (кино)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {movieCredits.slice(0, 10).map((credit: any) => (
                  <div key={credit.credit_id} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    <p className="font-semibold text-gray-800">{credit.title || credit.original_title}</p>
                    <p className="text-sm text-gray-600">{credit.character ? `Роль: ${credit.character}` : credit.job}</p>
                    <p className="text-xs text-gray-500">{credit.release_date?.split('-')[0] || '—'}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Фильмография (ТВ) */}
          {tvCredits.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Фильмография (ТВ)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tvCredits.slice(0, 10).map((credit: any) => (
                  <div key={credit.credit_id} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    <p className="font-semibold text-gray-800">{credit.name || credit.original_name}</p>
                    <p className="text-sm text-gray-600">{credit.character ? `Роль: ${credit.character}` : credit.job}</p>
                    <p className="text-xs text-gray-500">{credit.first_air_date?.split('-')[0] || '—'}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Галерея изображений */}
          {images.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Фотографии</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.slice(0, 6).map((img: any) => (
                  <img
                    key={img.file_path}
                    src={`https://image.tmdb.org/t/p/w200${img.file_path}`}
                    alt="Фото персоны"
                    className="h-32 w-auto object-cover rounded-lg shadow"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonCard;