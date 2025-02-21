export interface Album {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  playcount: number;
  url: string;
}

export async function fetchUserTopAlbums(
  user: string,
  period: string,
  limit: number = 50,
  page: number = 1
): Promise<Album[]> {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!user || !apiKey) {
    throw new Error('Missing required parameters');
  }
  const url = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&period=${period}&limit=${limit}&page=${page}&api_key=${apiKey}&format=json`;
  const response = await fetch(url);
  const data = await response.json();
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
  return albums;
}
