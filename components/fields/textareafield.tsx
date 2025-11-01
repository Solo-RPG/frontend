import { Label } from "@/components/ui/label"
import { FieldDefinition } from "../forms/dynamic-form-renderer";

export default function TextareaField({ path, field, value, displayName, updateValue, showLabel, colSpan, rowSpan }: {
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
      {showLabel && <Label htmlFor={path}>{displayName}</Label>}
      <textarea
        id={path}
        value={(value as string) || ""}
        onChange={(e) => updateValue(path, e.target.value)}
        placeholder={`Digite ${displayName}`}
        required={field.required}
        className="w-full bg-background border-input border rounded-md p-2 focus:ring-2 focus:ring-ring focus:outline-none resize-y"
        rows={4}
      />
    </div>
  );
}