import { createColumnHelper } from "@tanstack/react-table";
import { DataCell } from "./DataCell";
import { Trash2 } from "lucide-react";
import type { ListEditorTableMeta } from "./ListEditorTable";

import { AnimeSong } from "./ListEditor.schemas";

const columnHelper = createColumnHelper<AnimeSong>();

export const columns = [
  columnHelper.display({
    id: "index",
    cell: ({ row }) => {
      return row.index + 1;
    }
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row, table }) => {
      const tableMeta = table.options.meta as ListEditorTableMeta;

      if (!tableMeta) return;

      const upButton = (
        <button
          className="text-gray-600 hover:text-gray-800 p-0 focus:outline-none"
          onClick={() => {
            tableMeta.moveRowUp(row.index);
          }}
        >
          ▲
        </button>
      );

      const downButton = (
        <button
          className="text-gray-600 hover:text-gray-800 p-0 focus:outline-none"
          onClick={() => {
            tableMeta.moveRowDown(row.index);
          }}
        >
          ▼
        </button>
      );

      return (
        <div className="flex items-center justify-between h-full gap-2">
          {/* Arrows on the Left */}
          <div className="flex flex-col items-center space-y-1">
            {row.index !== 0 && upButton}
            {row.index !== table.getRowCount() - 1 && downButton}
          </div>

          <Trash2
            className="cursor-pointer"
            onClick={() => {
              tableMeta.deleteRow(row.index);
            }}
          />
        </div>
      );
    }
  }),
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
