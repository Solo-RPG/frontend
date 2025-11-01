import { useEffect } from "react";
import { FieldDefinition } from "../forms/dynamic-form-renderer";
import { StatusBar } from "../ui/statusbar";

export default function StatusField({ path, field, getValue, updateValue, displayName, color, allStatus, changeAllStatus }: {
  path: string;
  field: FieldDefinition;
  getValue: (path: string) => unknown;
  updateValue: (path: string, value: unknown) => void;
  displayName: string;
  color: string;
  allStatus?: any[];
  changeAllStatus: (status: string[]) => void;
}) {
  const statusValue = {
    value: getValue(path + ".value") as number,
    max: getValue(path + ".max") as number
  };
  
  useEffect(() => {
    if (!path) return
    // usa o updater para evitar mutação e garantir re-render
    changeAllStatus(prev => {
      if (!prev) return [path]
      if (prev.includes(path)) return prev
      return [...prev, path]
    })
  }, [path, changeAllStatus])


  return (
    <StatusBar
      key={path}
      label={displayName}
      value={statusValue.value}
      max={statusValue.max}
      onChange1={(newValue) => updateValue(path + ".value", newValue)}
      onChange2={(newMax) => updateValue(path + ".max", newMax)}
      color={color}
    />
  );
}