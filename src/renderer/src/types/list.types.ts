import { animeListSchema, animeSongSchema, listFileSchema } from "@renderer/schemas/list.schemas";
import { z } from "zod";

export type AnimeSong = z.infer<typeof animeSongSchema>;
export type AnimeSongList = z.infer<typeof animeListSchema>;

export type ListFile = z.infer<typeof listFileSchema>;
