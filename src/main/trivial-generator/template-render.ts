import ejs from "ejs";

import fs from "fs";
import path from "path";

import templatePath from "./trivial.template.ejs?asset";

type AnimeSong = {
  anime: string;
  oped: "Opening" | "Ending" | "OST";
  band: string;
  name: string;
  difficulty: "easy" | "normal" | "hard";
  link: string;
};

type SongWithId = AnimeSong & { id: string };

type AnimeInfo = Record<string, SongWithId>;

type ListFileContent = {
  author: string;
  songs: AnimeSong[];
};

type RenderTemplateProps = {
  listFileContent: ListFileContent;
  outputDir: string;
};

export async function renderTemplate({ listFileContent, outputDir }: RenderTemplateProps) {
  // Data to pass to the template
  const { songs, author } = listFileContent;

  const songsWithId: SongWithId[] = songs.map((song) => ({
    ...song,
    id: song.link.split("/").at(-1)!
  }));

  const animeInfo: AnimeInfo = songsWithId.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  const data = {
    author,
    songs: songsWithId,
    animeInfo
  };
  // Render the template with the data
  const renderedHtml = await ejs.renderFile(templatePath, data);

  // Save the rendered HTML to a file (optional)
  const outputPath = path.join(outputDir, "trivial.html");

  fs.writeFileSync(outputPath, renderedHtml);

  // Log success message
  console.log('EJS template rendered successfully. Open "counter.html" to view the result.');
}
