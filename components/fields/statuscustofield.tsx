"use client"

import { Input } from "@/components/ui/input"
import { FieldDefinition } from "../forms/dynamic-form-renderer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { get } from "http";

export default function StatusCustoField({
  path,
  normalizedList,
  index,
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
  normalizedList: any[];
  index: number;
  field: FieldDefinition;
  getValue: (path: string) => unknown;
  updateValue: (path: string, value: unknown) => void;
  displayName: string;
  showLabel?: boolean;
  colSpan?: string;
  rowSpan?: string;
  getAllStatus?: () => string[];
}) {
    const getCurrentValue = () => {
    const pathFound = getValue(`${path}`)
    return pathFound[index].custo
  }

  const [targetPath, setTargetPath] = useState(getCurrentValue)
  const currentTargetValue = getValue(`${targetPath}.value`) as number
  const [inputValue, setInputValue] = useState("")
  const [allStatusValues, setAllStatusValues] = useState<string[]>(getAllStatus || [])

  useEffect(() => {
    setAllStatusValues(getAllStatus || [])
  }, [getAllStatus]);

  const handleChange = () => {
    let newTargetValue = currentTargetValue

    if(inputValue[0] == "+") {
      newTargetValue += Number(inputValue.slice(1))
    } else if (inputValue[0] == "-") {
      newTargetValue -= Number(inputValue.slice(1))
    } else {
      newTargetValue = currentTargetValue - Number(inputValue)
    }

    updateValue(`${targetPath}.value`, newTargetValue)
  };

  return (
    <div key={path} className={`grid gap-2 grid-cols-3`}>
      <Select
        value={getCurrentValue()}
        onValueChange={(value) => {
          setTargetPath(value)
          const newList = normalizedList.map((it, i) =>
            i === index ? { ...it, [field.name]: value } : it
          )
          updateValue(path, newList)
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
        placeholder={`Ex: +6, -5, 3`}
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
