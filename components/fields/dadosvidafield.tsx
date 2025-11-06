import { FieldDefinition } from "../forms/dynamic-form-renderer";
import ColorCircle from "../ui/colorcircle";

function DadovidaField({ path, field, getValue, updateValue, cols }: {
  path: string;
  field: FieldDefinition;
  getValue: (path: string) => unknown;
  updateValue: (path: string, value: unknown) => void;
  cols?: string;
}) {
  const colorCircles = [];

  for (let i = 0; i < (field.quantity || 0); i++) {
    colorCircles.push(
      <ColorCircle
        key={i}
        value={getValue(`${path}.circle_${i + 1}`) as boolean || false}
        onToggle={(e) => updateValue(`${path}.circle_${i + 1}`, e)}
      />
    );
  }

  return (
    <div key={path} className={`grid w-full gap-4 justify-self-center justify-items-center items-center grid-cols-${cols} border rounded-md sm:p-8 sm:pl-16 sm:pr-16`}>
      <h1 className="col-span-4 text-lg mb-2">Dados de Vida</h1>
      {colorCircles}
    </div>
  );
}
export default DadovidaField;