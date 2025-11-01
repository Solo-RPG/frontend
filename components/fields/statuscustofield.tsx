"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldDefinition } from "../forms/dynamic-form-renderer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ta } from "date-fns/locale";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { Button } from "../ui/button";
import { get } from "http";

export default function StatusCustoField({
  path,
  field,
  getValue,
  updateValue,
  displayName,
  showLabel,
  colSpan,
  rowSpan,
  getAllStatus
}: {
  path: string;
  field: FieldDefinition;
  getValue: (path: string) => unknown;
  updateValue: (path: string, value: unknown) => void;
  displayName: string;
  showLabel?: boolean;
  colSpan?: string;
  rowSpan?: string;
  getAllStatus?: () => string[];
}) {
  const [targetPath, setTargetPath] = useState(field.status_target)
  const currentTargetValue = getValue(`${targetPath}.value`) as number
  const [inputValue, setInputValue] = useState("0")
  const [allStatusValues, setAllStatusValues] = useState<string[]>(getAllStatus())

  useEffect(() => {
    setAllStatusValues(getAllStatus() || [])
  }, [getAllStatus]);

  const handleChange = () => {
    const inputIntValue = Number(inputValue)

    if (!targetPath) return
    let newTargetValue = currentTargetValue

    newTargetValue = currentTargetValue - inputIntValue

    updateValue(`${targetPath}.value`, newTargetValue)
  };

  return (
    <div key={path} className={` grid gap-2 grid-cols-3`}>
      <Select
        value={targetPath}
        onValueChange={(value) => {
          setTargetPath(value)
          updateValue(`${path}.status_target`, value)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o status alvo" />
        </SelectTrigger>
        <SelectContent>
          {allStatusValues.map((status) => (
            <SelectItem key={status} value={status}>
              {status.split('.').slice(-1)[0]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        id={path}
        type="string"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={`Digite o valor para subtrair em ${targetPath || "status"}`}
        required={field.required}
      />
      <Button
          type="button"
          onClick={handleChange}
          disabled={!targetPath}
        >Subtrair
    </Button>
    </div>
  );
}
