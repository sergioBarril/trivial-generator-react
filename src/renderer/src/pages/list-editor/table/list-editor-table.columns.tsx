import { createColumnHelper } from "@tanstack/react-table";
import { DataCell } from "./data-cell";
import { ThumbnailCell } from "./thumbnail-cell";

import ActionsCell from "./actions-cell";

import { AnimeSong, GameSong, NormieSong, Song } from "@renderer/types/list.types";

const animeColumnHelper = createColumnHelper<AnimeSong>();
const normieColumnHelper = createColumnHelper<NormieSong>();
const gameColumnHelper = createColumnHelper<GameSong>();

const songColumnHelper = createColumnHelper<Song>();

export const BASE_COLUMN_IDS = ["index", "actions", "thumbnail", "difficulty", "link"] as const;

export const songColumns = [
  songColumnHelper.display({
    id: "index",
    cell: ({ row }) => {
      return row.index + 1;
    }
  }),
  songColumnHelper.display({
    id: "actions",
    cell: ActionsCell
  }),
  songColumnHelper.display({
    id: "thumbnail",
    cell: ThumbnailCell
  }),
  songColumnHelper.accessor("anime", {
    id: "anime",
    header: "Anime",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  songColumnHelper.accessor("name", {
    id: "name",
    header: "Song name",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  songColumnHelper.accessor("band", {
    id: "band",
    header: "Band",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  songColumnHelper.accessor("difficulty", {
    id: "difficulty",
    header: "Difficulty",
    cell: DataCell,
    meta: {
      type: "select",
      options: [
        { value: "hard", label: "Hard" },
        { value: "normal", label: "Normal" },
        { value: "easy", label: "Easy" }
      ]
    }
  }),
  songColumnHelper.accessor("game", {
    id: "game",
    header: "Game",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  songColumnHelper.accessor("saga", {
    id: "saga",
    header: "Saga",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  songColumnHelper.accessor("oped", {
    id: "oped",
    header: "OP / ED",
    cell: DataCell,
    meta: {
      type: "select",
      options: [
        { value: "Opening", label: "Opening" },
        { value: "Ending", label: "Ending" },
        { value: "OST", label: "OST" }
      ]
    }
  }),
  songColumnHelper.accessor("link", {
    id: "link",
    header: "Link",
    cell: DataCell,
    meta: {
      type: "text"
    }
  })
];

export const animeColumns = [
  animeColumnHelper.display({
    id: "index",
    cell: ({ row }) => {
      return row.index + 1;
    }
  }),
  animeColumnHelper.display({
    id: "actions",
    cell: ActionsCell
  }),
  animeColumnHelper.display({
    id: "thumbnail",
    cell: ThumbnailCell
  }),
  animeColumnHelper.accessor("anime", {
    header: "Anime",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  animeColumnHelper.accessor("band", {
    header: "Band",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  animeColumnHelper.accessor("difficulty", {
    header: "Difficulty",
    cell: DataCell,
    meta: {
      type: "select",
      options: [
        { value: "hard", label: "Hard" },
        { value: "normal", label: "Normal" },
        { value: "easy", label: "Easy" }
      ]
    }
  }),
  animeColumnHelper.accessor("name", {
    header: "Song name",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  animeColumnHelper.accessor("oped", {
    header: "OP / ED",
    cell: DataCell,
    meta: {
      type: "select",
      options: [
        { value: "Opening", label: "Opening" },
        { value: "Ending", label: "Ending" },
        { value: "OST", label: "OST" }
      ]
    }
  }),
  animeColumnHelper.accessor("link", {
    header: "Link",
    cell: DataCell,
    meta: {
      type: "text"
    }
  })
];

export const normieColumns = [
  normieColumnHelper.display({
    id: "index",
    cell: ({ row }) => {
      return row.index + 1;
    }
  }),
  normieColumnHelper.display({
    id: "actions",
    cell: ActionsCell
  }),
  normieColumnHelper.display({
    id: "thumbnail",
    cell: ThumbnailCell
  }),
  normieColumnHelper.accessor("name", {
    header: "Song name",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  normieColumnHelper.accessor("band", {
    header: "Band",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  normieColumnHelper.accessor("difficulty", {
    header: "Difficulty",
    cell: DataCell,
    meta: {
      type: "select",
      options: [
        { value: "hard", label: "Hard" },
        { value: "normal", label: "Normal" },
        { value: "easy", label: "Easy" }
      ]
    }
  }),
  normieColumnHelper.accessor("link", {
    header: "Link",
    cell: DataCell,
    meta: {
      type: "text"
    }
  })
];

export const gameColumns = [
  gameColumnHelper.display({
    id: "index",
    cell: ({ row }) => {
      return row.index + 1;
    }
  }),
  gameColumnHelper.display({
    id: "actions",
    cell: ActionsCell
  }),
  gameColumnHelper.display({
    id: "thumbnail",
    cell: ThumbnailCell
  }),
  gameColumnHelper.accessor("name", {
    header: "Game name",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  gameColumnHelper.accessor("saga", {
    header: "Saga",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  gameColumnHelper.accessor("difficulty", {
    header: "Difficulty",
    cell: DataCell,
    meta: {
      type: "select",
      options: [
        { value: "hard", label: "Hard" },
        { value: "normal", label: "Normal" },
        { value: "easy", label: "Easy" }
      ]
    }
  }),
  gameColumnHelper.accessor("link", {
    header: "Link",
    cell: DataCell,
    meta: {
      type: "text"
    }
  })
];

export function getVisibleColumns(type: "anime" | "game" | "normie") {
  if (type === "anime") {
    return [...BASE_COLUMN_IDS, "name", "anime", "oped", "band"] as const;
  }

  if (type === "game") {
    return [...BASE_COLUMN_IDS, "saga", "game"] as const;
  }

  if (type === "normie") {
    return [...BASE_COLUMN_IDS, "name", "band"] as const;
  }

  throw new Error("Invalid trivial type");
}

export function getColumnVisibility(type: "anime" | "game" | "normie") {
  const visibleColumns = new Set(getVisibleColumns(type));

  return songColumns.reduce((acc, curr) => {
    acc[curr.id!] = (visibleColumns as Set<string>).has(curr.id!);
    return acc;
  }, {});
}
