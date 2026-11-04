import { tmdb } from "./client";

export const getPeopleDetails = (id: number) => {
  return tmdb.people.details(id, [
    'movie_credits',
    'tv_credits',
    'combined_credits',
    'external_ids',
    'images',
  ]);
}

export type PersonDetailsEx = Awaited<ReturnType<typeof getPeopleDetails>>;