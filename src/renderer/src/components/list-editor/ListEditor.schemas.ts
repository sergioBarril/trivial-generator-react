import { z } from "zod";

export const animeSongSchema = z.object({
  anime: z.string(),
  oped: z.enum(["Opening", "Ending", "OST"]),
  band: z.string(),
  name: z.string(),
  difficulty: z.enum(["easy", "normal", "hard"]),
  link: z.string()
});

export const animeListSchema = z.object({
  author: z.string().default(""),
  songs: z.array(animeSongSchema)
});
