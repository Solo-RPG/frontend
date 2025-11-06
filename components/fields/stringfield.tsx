import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FieldDefinition } from "../forms/dynamic-form-renderer";


export default function StringField({ path, field, value, displayName, updateValue, showLabel, colSpan, rowSpan }: {
  path: string;
  field: FieldDefinition;
  value: unknown;
  displayName: string;
  updateValue: (path: string, value: unknown) => void;
  showLabel?: boolean;
  colSpan?: string;
  rowSpan?: string;
}) {
  if (field.options) {
    return (
      <div key={path} className={`space-y-2 flex-row col-span-${colSpan} row-span-${rowSpan}`}>
        <Label htmlFor={path}>
          {showLabel && <Label>{displayName}</Label>}
        </Label>
        <Select 
          value={value as string || ""} 
          onValueChange={(val) => updateValue(path, val)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Selecione ${displayName}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  return (
    <div key={path} className="space-y-2">
      <Label htmlFor={path}>
        {showLabel && <Label>{displayName}</Label>}
      </Label>
      <Input
        id={path}
        type="text"
        value={value as string || ""}
        onChange={(e) => updateValue(path, e.target.value)}
        placeholder={`Digite ${displayName}`}
        required={field.required}
      />
    </div>
  );
}
