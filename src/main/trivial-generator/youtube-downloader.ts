import ytdl from "@distube/ytdl-core";

import fs from "fs";
import path from "path";

type DownloadAudioParams = {
  outputDir: string;
  songId: string;
};

export async function downloadAudio({ outputDir, songId }: DownloadAudioParams) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const offlineFolder = path.join(outputDir, "offline");
  if (!fs.existsSync(offlineFolder)) fs.mkdirSync(offlineFolder);

  const fullPath = path.join(offlineFolder, `${songId}.mp3`);

  if (fs.existsSync(fullPath)) {
    const sizeInBytes = fs.statSync(fullPath).size;

    if (sizeInBytes > 0) return true;
    else return false;
  }

  return await new Promise<boolean>((resolve) => {
    const writeStream = fs.createWriteStream(fullPath);
    const download = ytdl(`https://youtu.be/${songId}`, {
      filter: "audioonly"
    });

    download.pipe(writeStream);
    download.on("end", () => {
      console.log(`${songId} downloaded`);
      resolve(true);
    });
    download.on("error", (err) => {
      console.error(`Error downloading ${songId} -- ${err.message}`);
      resolve(false);
    });
  });
}
