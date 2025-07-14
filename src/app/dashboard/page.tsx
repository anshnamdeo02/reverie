'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';

type Result = {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string | null;
  profile_path?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (!session || error) {
        router.push('/auth/login');
      } else {
        const email = session?.user?.email;
        if (email) setUserEmail(email);
      }

      setLoading(false);
    };

    getSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const handleSearch = async (query: string) => {
    const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results || []);
  };

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Welcome to your dashboard!</h1>
      <p className="mb-2 text-zinc-300">
        Logged in as: <span className="font-mono text-white">{userEmail}</span>
      </p>
      <button
        onClick={handleLogout}
        className="mt-4 mb-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        Logout
      </button>

      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {results.map((item) => (
          <Link
            href={
              item.media_type === 'person'
                ? `/people/${item.id}`
                : item.media_type === 'tv'
                ? `/tv/${item.id}`
                : `/movies/${item.id}`
            }
            key={item.id}
          >
            <div className="bg-zinc-800 p-2 rounded hover:scale-[1.03] transition">
              <img
                src={
                  item.media_type === 'person' && item.profile_path
                    ? `https://image.tmdb.org/t/p/w300${item.profile_path}`
                    : item.media_type !== 'person' && item.poster_path
                    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                    : '/no-image.png'
                }

                alt={item.title || item.name}
                className="rounded mb-2"
              />
              <p className="text-sm text-white">{item.title || item.name}</p>
              <p className="text-xs text-zinc-400 italic">{item.media_type}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
