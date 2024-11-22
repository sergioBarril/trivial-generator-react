import { createColumnHelper } from "@tanstack/react-table";
import { DataCell } from "./DataCell";
import { Song } from "./ListEditorTable.mock";

const columnHelper = createColumnHelper<Song>();
export const columns = [
  columnHelper.accessor("anime", {
    header: "Anime",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  columnHelper.accessor("band", {
    header: "Band",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  columnHelper.accessor("difficulty", {
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
  columnHelper.accessor("name", {
    header: "Song name",
    cell: DataCell,
    meta: {
      type: "text"
    }
  }),
  columnHelper.accessor("oped", {
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
  columnHelper.accessor("link", {
    header: "Link",
    cell: DataCell,
    meta: {
      type: "text"
    }
  })
];
