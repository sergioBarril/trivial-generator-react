// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { youtube } from "@googleapis/youtube";

const API_KEY = import.meta.env.MAIN_VITE_YOUTUBE_API_KEY;

const youtubeAPI = youtube({ version: "v3", auth: API_KEY });

export async function importYoutubePlaylist(playlistId: string) {
  console.log(import.meta.env.VITE_YOUTUBE_API_KEY);
  const response = await youtubeAPI.playlistItems
    .list({
      part: "id,snippet",
      playlistId,
      key: API_KEY,
      maxResults: 50
    })
    .catch((err) => {
      if (err.code === 404) {
        throw new Error("Playlist not found");
      } else {
        throw err;
      }
    });

  const playlistItems = response.data.items;
  const songs = playlistItems.map((song) => {
    const { title, resourceId } = song.snippet;
    return { id: resourceId.videoId, title };
  });

  return songs;
}
