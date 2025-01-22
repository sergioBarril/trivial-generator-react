import { z } from "zod";

// BaseSong schema
const BaseSongSchema = z.object({
  id: z.string().default(""),
  name: z.string(),
  link: z.string(),
  difficulty: z.enum(["easy", "normal", "hard"]).default("normal")
});

// AnimeSong schema
export const AnimeSongSchema = BaseSongSchema.extend({
  anime: z.string(),
  oped: z.enum(["Opening", "Ending", "OST"]).default("Opening"),
  band: z.string()
});

// GameSong schema
export const GameSongSchema = BaseSongSchema.extend({
  game: z.string(),
  saga: z.string()
});

// NormieSong schema
export const NormieSongSchema = BaseSongSchema.extend({
  band: z.string()
});

// Song schema (union of AnimeSong, GameSong, and NormieSong)
export const SongSchema = z.union([AnimeSongSchema, GameSongSchema, NormieSongSchema]);

export const ListTypeSchema = z.enum(["anime", "normie", "game"]);

export const SongListSchema = z.object({
  author: z.string().default(""),
  type: ListTypeSchema,
  songs: z.array(SongSchema)
});

export const ListFileSchema = z.object({
  path: z.string(),
  content: SongListSchema
});
