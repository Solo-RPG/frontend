import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface OptionsEditorProps {
  fieldType: string
  field: {
    options?: string[]
  }
  currentPath: string
  updateField: (path: string, value: any) => void
}

export default function OptionsEditor({
  fieldType,
  field,
  currentPath,
  updateField,
}: OptionsEditorProps) {
  const [newOption, setNewOption] = useState("")

  const handleAddOption = () => {
    if (!newOption.trim()) return
    const updated = [...(field.options || []), newOption.trim()]
    updateField(`${currentPath}.options`, updated)
    setNewOption("")
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = (field.options || []).filter((_, i) => i !== index)
    updateField(`${currentPath}.options`, newOptions.length ? newOptions : null)
  }

  return (
    <div className="col-span-2 space-y-2">
      {fieldType === "string" ? (
        <Label>Opções</Label>
      ) : (
        <Label>Colunas da Lista</Label>
      )}

      <div className="flex flex-wrap gap-2">
        {(Array.isArray(field.options) ? field.options : []).map((opt, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
          >
            <span>{opt}</span>
            <button
              type="button"
              className="text-sm hover:text-destructive"
              onClick={() => handleRemoveOption(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Adicionar nova opção"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddOption()
            }
          }}
        />
        <Button type="button" onClick={handleAddOption}>
          Adicionar
        </Button>
      </div>
    </div>
  )
}