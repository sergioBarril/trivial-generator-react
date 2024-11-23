import { z } from "zod";

export const animeSongSchema = z.object({
  anime: z.string().default(""),
  oped: z.enum(["Opening", "Ending", "OST"]).default("Opening"),
  band: z.string().default(""),
  name: z.string().default(""),
  difficulty: z.enum(["easy", "normal", "hard"]).default("normal"),
  link: z.string().default("")
});

export const animeListSchema = z.object({
  author: z.string().default(""),
  songs: z.array(animeSongSchema)
});

export type AnimeSong = z.infer<typeof animeSongSchema>;
export type AnimeSongList = z.infer<typeof animeListSchema>;
