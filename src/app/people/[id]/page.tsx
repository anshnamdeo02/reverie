import { notFound } from 'next/navigation';

export default async function PersonPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [personRes, creditsRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/person/${id}?language=en-US`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY!}`,
      },
      next: { revalidate: 3600 },
    }),
    fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY!}`,
      },
      next: { revalidate: 3600 },
    }),
  ]);

  if (!personRes.ok || !creditsRes.ok) return notFound();

  const person = await personRes.json();
  const credits = await creditsRes.json();

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">{person.name}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
        alt={person.name}
        className="rounded mb-6"
      />
      <p className="text-zinc-300 mb-4">{person.biography || 'No biography available.'}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Known For</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {credits.cast.slice(0, 8).map((item: any) => (
          <div key={item.id} className="bg-zinc-800 p-2 rounded">
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                  : '/placeholder-movie.png'
              }
              alt={item.title || item.name}
              className="rounded mb-2"
            />


            <p className="text-sm text-white">{item.title || item.name}</p>
            <p className="text-xs text-zinc-400 italic">{item.media_type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
