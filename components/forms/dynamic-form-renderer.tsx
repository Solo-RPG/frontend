"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

interface FieldDefinition {
  name?: string // Adicionamos a propriedade name para armazenar o nome exibível
  type: string
  required?: boolean
  min?: number
  max?: number
  options?: string[]
  fields?: Record<string, FieldDefinition>
  itemType?: string
}

interface DynamicFormRendererProps {
  fields: Record<string, FieldDefinition>
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
}

export function DynamicFormRenderer({ fields, values, onChange }: DynamicFormRendererProps) {
  const updateValue = (path: string, value: any) => {
    const newValues = { ...values }
    const keys = path.split(".")
    let current = newValues

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    onChange(newValues)
  }

  const getValue = (path: string) => {
    const keys = path.split(".")
    let current = values

    for (const key of keys) {
      if (current && typeof current === "object") {
        current = current[key]
      } else {
        return undefined
      }
    }

    return current
  }

  // Função para obter o nome de exibição do campo
  const getDisplayName = (field: FieldDefinition, defaultName: string) => {
    return field.name || defaultName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const renderField = (key: string, field: FieldDefinition, path: string = key) => {
    const value = getValue(path)
    const displayName = getDisplayName(field, key)

    switch (field.type) {
      case "string":
        if (field.options) {
          return (
            <div key={path} className="space-y-2">
              <Label htmlFor={path}>
                {displayName}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Select value={value || ""} onValueChange={(val) => updateValue(path, val)}>
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
          )
        }
        return (
          <div key={path} className="space-y-2">
            <Label htmlFor={path}>
              {displayName}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={path}
              type="text"
              value={value || ""}
              onChange={(e) => updateValue(path, e.target.value)}
              placeholder={`Digite ${displayName}`}
              required={field.required}
            />
          </div>
        )

      case "number":
        return (
          <div key={path} className="space-y-2">
            <Label htmlFor={path}>
              {displayName}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.min !== undefined && field.max !== undefined && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({field.min}-{field.max})
                </span>
              )}
            </Label>
            <Input
              id={path}
              type="number"
              value={value || ""}
              onChange={(e) => updateValue(path, Number.parseInt(e.target.value) || 0)}
              min={field.min}
              max={field.max}
              placeholder={`Digite ${displayName}`}
              required={field.required}
            />
          </div>
        )

      case "boolean":
        return (
          <div key={path} className="flex items-center space-x-2">
            <Checkbox id={path} checked={value || false} onCheckedChange={(checked) => updateValue(path, checked)} />
            <Label htmlFor={path}>{displayName}</Label>
          </div>
        )

      case "list":
        const listValue = value || []
        return (
          <div key={path} className="space-y-2">
            <Label>
              {displayName}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {listValue.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  {field.options ? (
                    <Select
                      value={item}
                      onValueChange={(val) => {
                        const newList = [...listValue]
                        newList[index] = val
                        updateValue(path, newList)
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      className="flex-1"
                      value={item}
                      onChange={(e) => {
                        const newList = [...listValue]
                        newList[index] = e.target.value
                        updateValue(path, newList)
                      }}
                      placeholder={`Item ${index + 1}`}
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newList = listValue.filter((_: any, i: number) => i !== index)
                      updateValue(path, newList)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newList = [...listValue, field.options ? field.options[0] : ""]
                  updateValue(path, newList)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar {displayName}
              </Button>
            </div>
          </div>
        )

      case "object":
        if (!field.fields) return null
        return (
          <Card key={path}>
            <CardHeader>
              <CardTitle className="text-lg">
                {displayName}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(field.fields).map(([subKey, subField]) =>
                  renderField(subKey, subField, `${path}.${subKey}`),
                )}
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return <div className="space-y-4">{Object.entries(fields).map(([key, field]) => renderField(key, field))}</div>
}