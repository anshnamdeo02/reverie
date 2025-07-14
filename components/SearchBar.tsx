'use client';

import { useState } from 'react';

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-6">
      <input
        className="flex-1 p-2 bg-zinc-800 text-white rounded"
        type="text"
        placeholder="Search movies, series..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 rounded">
        Search
      </button>
    </form>
  );
}
