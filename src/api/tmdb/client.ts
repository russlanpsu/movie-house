import { TMDB } from 'tmdb-ts';

const proxyFetch: typeof fetch = async (input, init) => {
  const originalUrl = new URL(input.toString());

  const proxyUrl = new URL(
    `${originalUrl.pathname}${originalUrl.search}`,
    "https://ancient-dream-2e3d.ruslanpsu.workers.dev"
  );

  const headers = new Headers(init?.headers);
  headers.delete('Authorization');

  const response = await fetch(proxyUrl, {
    ...init,
    headers,
  });

  // Клонируем, чтобы прочитать тело, не «съев» оригинал
  const cloned = response.clone();

  try {
    // Пытаемся прочитать как JSON — это типичный формат TMDB
    const data = await cloned.json();

    console.log('[TMDB]', response.status, originalUrl.pathname, {
      url: proxyUrl.toString(),
      ok: response.ok,
      status: response.status,
      data,
    });
  } catch {
    // Если тело не JSON (например, HTML-страница ошибки прокси),
    // читаем как текст — но уже из другой копии, т.к. cloned.json() мог
    // частично потребить поток
    try {
      const clonedText = response.clone();
      const text = await clonedText.text();
      console.log('[TMDB]', response.status, originalUrl.pathname, {
        url: proxyUrl.toString(),
        ok: response.ok,
        status: response.status,
        text: text.slice(0, 1000), // ограничим размер лога
      });
    } catch (textErr) {
      console.warn('[TMDB] Не удалось прочитать тело ответа:', textErr);
    }
  }

  return response;
};

export const tmdb = new TMDB('proxy-mode', {
  fetch: proxyFetch,
});


/* export const tmdb = new TMDB('xxx', {
  fetch: window.fetch.bind(window)
}); */