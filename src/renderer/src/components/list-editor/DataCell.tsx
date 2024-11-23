/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Input } from "../ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";

type Option = {
  label: string;
  value: string;
};

export const DataCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();

  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  const onSelectChange = (value: string) => {
    setValue(value);
    tableMeta?.updateData(row.index, column.id, value);
  };

  return columnMeta?.type === "select" ? (
    <Select onValueChange={onSelectChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Pick one" />
      </SelectTrigger>
      <SelectContent>
        {columnMeta?.options?.map((option: Option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      type={columnMeta?.type || "text"}
    />
  );
};
