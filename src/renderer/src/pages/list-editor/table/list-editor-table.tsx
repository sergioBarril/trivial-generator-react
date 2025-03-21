/* eslint-disable react/prop-types */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import { Dispatch, LegacyRef, SetStateAction, useMemo } from "react";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../../components/ui/Table";

import { getColumnVisibility, songColumns } from "./list-editor-table.columns";
import { Song } from "@renderer/types/list.types";
import { getYoutubeVideoId } from "@renderer/lib/utils";

type ListEditorTableProps = {
  data: Array<Song>;
  setData: Dispatch<SetStateAction<Song[]>>;
  className?: string;
  tableDivRef?: LegacyRef<HTMLDivElement>;
  type?: "anime" | "game" | "normie";
};

export type ListEditorTableMeta = {
  updateData: (rowIndex: number, columnId: string, value: string) => void;
  deleteRow: (rowIndex: number) => void;
  moveRowUp: (rowIndex: number) => void;
  moveRowDown: (rowIndex: number) => void;
};

export const ListEditorTable = ({
  className,
  data,
  setData,
  tableDivRef,
  type = "anime"
}: ListEditorTableProps) => {
  const columnVisibility = useMemo(() => getColumnVisibility(type), [type]);

  const updateData = (rowIndex: number, columnId: string, value: string) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const newData = {
            ...old[rowIndex],
            [columnId]: value
          };

          if (columnId === "link") {
            newData.id = getYoutubeVideoId(newData.link) || "";
          }

          return newData;
        }
        return row;
      })
    );
  };

  const deleteRow = (rowIndex: number) => {
    setData((old) => old.filter((_, i) => i !== rowIndex));
  };

  const moveRowUp = (rowIndex: number) => {
    if (rowIndex === 0) return;

    setData((old) => {
      const targetRow = old[rowIndex - 1];
      const currentRow = old[rowIndex];

      const newData = [...old];
      newData[rowIndex] = targetRow;
      newData[rowIndex - 1] = currentRow;

      return newData;
    });
  };

  const moveRowDown = (rowIndex: number) => {
    if (rowIndex === data.length - 1) return;

    setData((old) => {
      const targetRow = old[rowIndex + 1];
      const currentRow = old[rowIndex];

      const newData = [...old];
      newData[rowIndex] = targetRow;
      newData[rowIndex + 1] = currentRow;

      return newData;
    });
  };

  const table = useReactTable<Song>({
    data,
    columns: songColumns,
    state: {
      columnVisibility
    },
    getCoreRowModel: getCoreRowModel(),
    meta: { updateData, deleteRow, moveRowUp, moveRowDown }
  });

  return (
    <Table divClassName={className} divRef={tableDivRef}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => {
          const isRowValid = Boolean(row.original.link.length);

          return (
            <TableRow
              key={row.id}
              isValid={isRowValid}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
