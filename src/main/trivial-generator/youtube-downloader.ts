import ytdl from "@distube/ytdl-core";

import fs from "fs";
import path from "path";

type DownloadAudiosParams = {
  outputDir: string;
  embeddableMap: Map<string, boolean>;
};

export async function downloadAudios({ outputDir, embeddableMap }: DownloadAudiosParams) {
  // DOWNLOAD OFFLINE
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const offlineFolder = path.join(outputDir, "offline");
  if (!fs.existsSync(offlineFolder)) fs.mkdirSync(offlineFolder);

  const invalidSongIds = [...embeddableMap.keys()].filter((songId) => !embeddableMap.get(songId));

  const songsToDownload = invalidSongIds.filter((songID) => {
    const fullPath = path.join(offlineFolder, `${songID}.mp3`);
    return !fs.existsSync(fullPath);
  });

  const success: Array<string> = [];
  const failed: Array<string> = [];

  for (const songId of songsToDownload) {
    const fullPath = path.join(offlineFolder, `${songId}.mp3`);

    await new Promise<void>((resolve) => {
      const writeStream = fs.createWriteStream(fullPath);
      const download = ytdl(`https://youtu.be/${songId}`, {
        filter: "audioonly"
      });

      download.pipe(writeStream);
      download.on("end", () => {
        console.log(`${songId} downloaded`);
        success.push(songId);
        resolve();
      });
      download.on("error", (err) => {
        console.error(`Error downloading ${songId} -- ${err.message}`);
        failed.push(songId);
        resolve();
      });
    });
  }

  console.log(`${success.length} songs downloaded, ${failed.length} had errors.`);

  return { success, failed };
}
