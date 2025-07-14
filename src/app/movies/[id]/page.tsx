import { getMovieDetails } from '@/lib/tmdb';
import Image from 'next/image';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export default async function MoviePage({ params }: Props) {
  const id = params?.id;

  if (!id) return notFound();

  const movie = await getMovieDetails(id);

  if (!movie || movie.success === false) {
    return (
      <div className="p-8 text-red-500">
        Movie not found or an error occurred.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-black text-white">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3">
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/no-image.png'
            }
            alt={movie.title}
            width={500}
            height={750}
            className="rounded-xl object-cover w-full"
            priority
          />
        </div>

        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          {movie.tagline && (
            <p className="text-lg italic text-gray-400 mb-4">"{movie.tagline}"</p>
          )}

          <p className="mb-6">{movie.overview}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <span className="font-semibold">Genres:</span>{' '}
              {movie.genres.map((g: any) => g.name).join(', ')}
            </div>
            <div>
              <span className="font-semibold">Release:</span> {movie.release_date}
            </div>
            <div>
              <span className="font-semibold">Runtime:</span> {movie.runtime} min
            </div>
            <div>
              <span className="font-semibold">Rating:</span> {movie.vote_average.toFixed(1)}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {movie.status}
            </div>
            <div>
              <span className="font-semibold">Language:</span> {movie.original_language.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
