import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('user');
  const period = searchParams.get('period') || 'overall';
  const limit = searchParams.get('limit') || '50';
  const page = searchParams.get('page') || '1';
  const API_KEY = process.env.LASTFM_API_KEY;

  if (!user || !API_KEY) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&period=${period}&limit=${limit}&page=${page}&api_key=${API_KEY}&format=json`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    const albums = data.topalbums.album.map((album: any) => {
      const imageUrl =
        album.image?.[4]?.['#text'] || album.image?.[3]?.['#text'] || '';
      return {
        id: album.mbid || album.url,
        name: album.name,
        artist: album.artist.name,
        imageUrl,
        playcount: album.playcount,
        url: album.url,
      };
    });

    return NextResponse.json({ albums });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data from Last.fm' },
      { status: 500 }
    );
  }
}
