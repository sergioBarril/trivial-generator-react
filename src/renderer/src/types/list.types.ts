import {
  SongListSchema,
  ListFileSchema,
  ListTypeSchema,
  SongSchema,
  AnimeSongSchema,
  NormieSongSchema,
  GameSongSchema
} from "@renderer/schemas/list.schemas";
import { z } from "zod";

export type Song = z.infer<typeof SongSchema>;
export type SongList = z.infer<typeof SongListSchema>;

export type AnimeSong = z.infer<typeof AnimeSongSchema>;
export type NormieSong = z.infer<typeof NormieSongSchema>;
export type GameSong = z.infer<typeof GameSongSchema>;

export type ListFile = z.infer<typeof ListFileSchema>;
export type ListType = z.infer<typeof ListTypeSchema>;
