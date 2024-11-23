/* eslint-disable react/prop-types */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import { Dispatch, SetStateAction } from "react";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";

import { columns } from "./ListEditorTable.columns";
import { Song } from "./ListEditorTable.mock";

type ListEditorTableProps = {
  data: Array<Song>;
  setData: Dispatch<SetStateAction<Song[]>>;
  className?: string;
};

export type ListEditorTableMeta = {
  updateData: (rowIndex: number, columnId: string, value: string) => void;
  deleteRow: (rowIndex: number) => void;
  moveRowUp: (rowIndex: number) => void;
  moveRowDown: (rowIndex: number) => void;
};

export const ListEditorTable = ({ className, data, setData }: ListEditorTableProps) => {
  const updateData = (rowIndex: number, columnId: string, value: string) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value
          };
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { updateData, deleteRow, moveRowUp, moveRowDown }
  });

  return (
    <Table divClassName={className}>
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
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
