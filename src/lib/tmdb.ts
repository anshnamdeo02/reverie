// src/lib/tmdb.ts

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function getMovieDetails(id: string) {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?language=en-US`,
    {
      headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
      next: { revalidate: 3600 },
    }
  )
  if (!res.ok) throw new Error(`Movie fetch failed (${res.status})`)
  return res.json()
}

export interface Genre {
  id: number
  name: string
}

export interface TVDetails {
  id: number;
  name: string;
  tagline: string;
  overview: string;
  first_air_date: string;
  genres: Genre[];
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  status: string;
  original_language: string;
  episode_run_time: number[];
}

export async function getTVDetails(id: string): Promise<TVDetails | null> {
  const res = await fetch(
    `${TMDB_BASE_URL}/tv/${id}?language=en-US`,
    {
      headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
      next:    { revalidate: 60 },
    }
  )
  if (!res.ok) return null
  return res.json()
}

export async function getTrending(category: 'movie' | 'tv' | 'person') {
  const res = await fetch(
    `${TMDB_BASE_URL}/trending/${category}/week?language=en-US`,
    {
      headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw new Error(`Trending fetch failed: ${category}`);
  return res.json();
}
