// api/tmdb/client.ts

import { TMDB } from 'tmdb-ts';

const proxyFetch: typeof fetch = async (input, init) => {
  const originalUrl = new URL(input.toString());

  const proxyUrl = new URL(
    `${originalUrl.pathname}${originalUrl.search}`,
    //window.location.origin
    "https://ancient-dream-2e3d.ruslanpsu.workers.dev"
  );

  const headers = new Headers(init?.headers);

  // Авторизацию будет добавлять backend
  headers.delete('Authorization');

  return fetch(proxyUrl, {
    ...init,
    headers,
  });
};

export const tmdb = new TMDB('proxy-mode', {
  fetch: proxyFetch,
});