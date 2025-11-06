import { FieldDefinition } from "../forms/dynamic-form-renderer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function NumberField({ path, field, value, displayName, updateValue, showLabel, colSpan, rowSpan }: {
  path: string;
  field: FieldDefinition;
  value: unknown;
  displayName: string;
  updateValue: (path: string, value: unknown) => void;
  showLabel?: boolean;
  colSpan?: string;
  rowSpan?: string;
}) {
  return (
    <div key={path} className={`space-y-2 col-span-${colSpan} row-span-${rowSpan}`}>
      <Label htmlFor={path}>
        {showLabel && <Label>{displayName}</Label>}
        {field.min !== undefined && field.max !== undefined && (
          <span className="text-sm text-muted-foreground ml-2">
            ({field.min}-{field.max})
          </span>
        )}
      </Label>
      <Input
        id={path}
        type="number"
        value={value as number || ""}
        onChange={(e) => updateValue(path, Number.parseInt(e.target.value) || 0)}
        min={field.min}
        max={field.max}
        placeholder={`Digite ${displayName}`}
        required={field.required}
      />
    </div>
  );
}