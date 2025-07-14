// src/app/tv/[id]/page.tsx

import Image from 'next/image';
import { getTVDetails, TVDetails, Genre } from '@/lib/tmdb';

interface TVPageProps {
  params: Promise<{ id: string }>;
}

export default async function TVPage({ params }: TVPageProps) {
  const { id } = await params;
  const tv: TVDetails | null = await getTVDetails(id);

  if (!tv) {
    return (
      <div className="p-8 text-red-500">
        TV show not found or an error occurred.
      </div>
    );
  }

  const {
    name,
    tagline,
    overview,
    genres = [] as Genre[],
    first_air_date,
    vote_average,
    vote_count,
    poster_path,
    status,
    original_language,
    episode_run_time = [],
  } = tv;

  const runtime = episode_run_time?.[0] || null;

  return (
    <div className="min-h-screen px-6 py-10 bg-black text-white">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3">
          <Image
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : '/no-image.png'
            }
            alt={name}
            width={500}
            height={750}
            className="rounded-xl object-cover w-full"
            priority
          />
        </div>

        <div className="md:w-2/3 space-y-6">
          <h1 className="text-4xl font-bold">{name}</h1>
          {tagline && <p className="italic text-zinc-400">"{tagline}"</p>}

          <p className="text-zinc-200">{overview}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 text-sm text-gray-300 pt-4">
            <div>
              <span className="font-semibold">Genres:</span>{' '}
              {genres.map((g) => g.name).join(', ') || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">First Air Date:</span>{' '}
              {first_air_date || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Runtime:</span>{' '}
              {runtime ? `${runtime} min` : 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Rating:</span>{' '}
              {vote_average?.toFixed(1)} ({vote_count} votes)
            </div>
            <div>
              <span className="font-semibold">Status:</span> {status || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Language:</span>{' '}
              {original_language?.toUpperCase() || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
