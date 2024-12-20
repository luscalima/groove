export type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  artworkPath: string;
  lyricsPath: string;
  audioPath: string;
};

export const songs: Song[] = [
  {
    id: 1,
    title: "Stand By Me",
    artist: "Florence + The Machine",
    album: "Ceremonials",
    genre: "Indie",
    releaseDate: "2011-10-28",
    artworkPath: "/artworks/florence/standbyme",
    lyricsPath: "/lyrics/florence/standbyme",
    audioPath: "/audios/florence/standbyme",
  },
  {
    id: 2,
    title: "Take Me Home, Country Roadsssssss",
    artist: "John Denver",
    album: "Poems, Prayers & Promises",
    genre: "Country",
    releaseDate: "1971-04-06",
    artworkPath: "/artworks/johndenver/takemehomecountryroads",
    lyricsPath: "/lyrics/johndenver/takemehomecountryroads",
    audioPath: "/audios/johndenver/takemehomecountryroads",
  },
];
