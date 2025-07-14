import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q');
  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY!}`,
    },
    next: { revalidate: 86400 },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
