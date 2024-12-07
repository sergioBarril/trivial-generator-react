import ejs from "ejs";

import fs from "fs";
import path from "path";

import templatePath from "./trivial.template.ejs?asset";

import trivialPlayerScriptPath from "./trivial.player.ejs?asset";
import trivialYoutubeScriptPath from "./trivial.youtube.ejs?asset";
import trivialModalScriptPath from "./trivial.modal.ejs?asset";

import trivialCssPath from "./trivial.css.ejs?asset";

import { SongWithId } from "..";

export type RenderTemplateProps = {
  songs: SongWithId[];
  unembeddableIds: Array<string>;
  failedIds: Array<string>;
  author: string;
  outputDir: string;
};

export type SongWithIdAndCopyright = SongWithId & { isEmbeddable: boolean };
export type AnimeInfo = Record<string, SongWithIdAndCopyright>;

export async function renderTemplate({
  songs,
  author,
  outputDir,
  unembeddableIds,
  failedIds
}: RenderTemplateProps) {
  const animeInfo: AnimeInfo = songs.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  const songsWithStatus = songs.map((s) => ({
    ...s,
    isEmbeddable: !unembeddableIds.find((uid) => uid === s.id),
    isError: Boolean(failedIds.find((fid) => fid === s.id))
  }));

  console.log(failedIds);

  const assetPaths = {
    css: trivialCssPath,
    youtubeScript: trivialYoutubeScriptPath,
    playerScript: trivialPlayerScriptPath,
    modalScript: trivialModalScriptPath
  };

  const data = { author, songs: songsWithStatus, animeInfo, assetPaths };

  // Render the template with the data
  const renderedHtml = await ejs.renderFile(templatePath, data);

  // Save the rendered HTML to a file (optional)
  const outputPath = path.join(outputDir, "trivial.html");

  fs.writeFileSync(outputPath, renderedHtml);

  // Log success message
  console.log("EJS template rendered successfully");

  return;
}
