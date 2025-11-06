import { FieldDefinition } from "../forms/dynamic-form-renderer";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export default function BooleanField({ path, field, value, displayName, updateValue }: {
  path: string;
  field: FieldDefinition;
  value: unknown;
  displayName: string;
  updateValue: (path: string, value: unknown) => void;
}) {
  return (
    <div key={path} className="flex items-center space-x-2">
      <Checkbox 
        id={path} 
        checked={value as boolean || false} 
        onCheckedChange={(checked) => updateValue(path, checked)} 
      />
      <Label htmlFor={path}>{displayName}</Label>
    </div>
  );
}