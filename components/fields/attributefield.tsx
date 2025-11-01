import { FieldDefinition } from "../forms/dynamic-form-renderer";
import AttributeField from "../ui/attributefield";

function AttributeFieldComponent({ path, field, getValue, updateValue, displayName, colSpan, rowSpan }: {
  path: string;
  field: FieldDefinition;
  getValue: (path: string) => unknown;
  updateValue: (path: string, value: unknown) => void;
  displayName: string;
  colSpan?: string;
  rowSpan?: string;
}) {
  const attrValue = getValue(path + ".value") as string ?? "10";
  const attrBonus = getValue(path + ".bonus") as string ?? "+0";
  return (
    <AttributeField
      key={path}
      className={`col-span-${colSpan} row-span-${rowSpan}`}
      label={displayName}
      value={attrValue}
      bonus={attrBonus}
      onChange={(val) => updateValue(path + ".value", val)}
      onChangeBonus={(val) => updateValue(path + ".bonus", val)}
    />
  );
}
export default AttributeFieldComponent;