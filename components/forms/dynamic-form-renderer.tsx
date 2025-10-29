"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { Template, Character, SheetFieldValue, SheetField, SheetCreateRequest } from "@/lib/service/types"
import { StatusBar } from "../ui/statusbar"
import { get } from "http"
import AttributeField from "../ui/attributefield"
import { tr } from "date-fns/locale"
import { Textarea } from "../ui/textarea"

type FieldType = 'string' | 'number' | 'boolean' | 'list' | 'object' | 'textarea' | 'objectlist' | 'status' | 'attribute';;

export interface FieldDefinition {
  name: string
  type: FieldType
  required?: boolean
  min?: number
  max?: number
  flex?: string
  span?: string
  cols?: string
  color?: string
  show_label?: boolean
  options?: string[]
  fields?: Record<string, FieldDefinition>
  itemType?: string
}

interface DynamicFormRendererProps {
  fields: Record<string, FieldDefinition>;
  values: Record<string, SheetFieldValue>;
  cols?: string
  onChange: (values: Record<string, SheetFieldValue>) => void;
}

export function DynamicFormRenderer({ fields, values, cols, onChange }: DynamicFormRendererProps) {
  const updateValue = (path: string, value: unknown) => {
    const newValues = { ...values };
    
    // Tenta atualizar diretamente primeiro
    if (newValues[path] !== undefined) {
      newValues[path] = value;
    } else {
      // Se não existir diretamente, atualiza como caminho aninhado
      const keys = path.split('.');
      let current: any = newValues;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = current[key] || {};
        current = current[key];
      }
      
      current[keys[keys.length - 1]] = value;
    }

    onChange(newValues);
  };

  const getValue = (path: string): unknown => {
    // Tenta acessar o valor diretamente primeiro
    if (values[path] !== undefined) {
      return values[path];
    }
    
    // Se não encontrou diretamente, tenta acessar como caminho aninhado
    const keys = path.split('.');
    let current: any = values;

    for (const key of keys) {
      if (current && typeof current === 'object') {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  };

  const getDisplayName = (field: FieldDefinition, defaultName: string) => {
    return field.name || defaultName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  const renderSubField = (subField: FieldDefinition, normalizedList: any[], index: number) => {
    const path = `${subField.name}`;
    const value = getValue(path);

    const displayName = getDisplayName(subField, subField.name);

    switch (subField.type) {
      case "string" || "number":
        return (
          <Input
            value={value as string || ""}
            onChange={(e) => {
              const newList = normalizedList.map((it, i) =>
                i === index ? { ...it, [subField.name]: e.target.value } : it
              );
              updateValue(path, newList);
            }}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value as string || ""}
            onChange={(e) => {
              const newList = normalizedList.map((it, i) =>
                i === index ? { ...it, [subField.name]: e.target.value } : it
              );
              updateValue(path, newList);
            }}
          />
        );

      default:
        return null;
    }
  };

  const renderField = (key: string, field: FieldDefinition, parentPath = "") => {
    const fieldName = field.name || key;
    const path = parentPath ? 
    `${parentPath}.${fieldName}` : 
    fieldName;
    
    const value = getValue(path);
    const displayName = getDisplayName(field, key);

    const flex = field.flex
    const span = field.span 
    const cols = field.cols 
    const color = field.color || "red"
    const showLabel = field.show_label

    switch (field.type) {
      case "string":
        if (field.options) {
          return (
            <div key={path} className={`space-y-2 flex-row col-span-${span}`}>
              <Label htmlFor={path}>
                {showLabel && <Label>{capitalize(displayName)}</Label>}
        
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
          )
        }
        return (
          <div key={path} className="space-y-2">
            <Label htmlFor={path}>
              {showLabel && <Label>{capitalize(displayName)}</Label>}
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
        )

      case "textarea":
        return (
          <div key={path} className={`space-y-2 col-span-${span}`}>
            {showLabel && <Label htmlFor={path}>{capitalize(displayName)}</Label>}
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
        )

      case "number":
        return (
          <div key={path} className={`space-y-2 col-span-${span}`}>
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
        )

      case "boolean":
        return (
          <div key={path} className="flex items-center space-x-2">
            <Checkbox 
              id={path} 
              checked={value as boolean || false} 
              onCheckedChange={(checked) => updateValue(path, checked)} 
            />
            <Label htmlFor={path}>{displayName}</Label>
          </div>
        )

      case "list": {
          const listValue = Array.isArray(value) ? value : []

          // Garante que cada item da lista siga a estrutura das opções
          const ensureItemShape = (item: any) => {
            const obj = typeof item === "object" && item !== null ? { ...item } : {}
            field.options.forEach((opt: string) => {
              if (!(opt in obj)) obj[opt] = ""
            })
            return obj
          }

          const normalizedList = listValue.map(ensureItemShape)

          return (
            <div key={path} className={`space-y-2 col-span-${span}`}>
              {showLabel && <Label>{capitalize(displayName)}</Label>}

              <div className="space-y-4">
                {normalizedList.map((item, index) => (
                  <div
                    key={`${path}-${index}`}
                    className="flex overflow-x-auto gap-3 items-end"
                  >
                    {field.options.map((opt: string) => (
                      <div key={opt} className="flex flex-col">
                        {index == 0 && <Label className="text-xs mb-1">{opt}</Label>}
                        <Input
                          value={item[opt]}
                          className=""
                          onChange={(e) => {
                            const newList = normalizedList.map((it, i) =>
                              i === index ? { ...it, [opt]: e.target.value } : it
                            )
                            updateValue(path, newList)
                          }}
                        />
                      </div>
                    ))}

                    {/* remover linha */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-12 h-10"
                      onClick={() => {
                        const newList = normalizedList.filter((_, i) => i !== index)
                        updateValue(path, newList)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* adicionar nova linha */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const emptyItem = field.options.reduce((acc: any, opt: string) => {
                      acc[opt] = ""
                      return acc
                    }, {})
                    updateValue(path, [...normalizedList, emptyItem])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </div>
        )
      }

      case "object":
        if (!field.fields) return null

        const className = `md:grid-${flex}-${cols}`

        return (
          <Card key={path} className={`border mt-4 items-center col-span-${span}`}>
            <CardHeader>
              <CardTitle className="text-lg">
                {showLabel && <Label>{capitalize(displayName)}</Label>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`grid gap-4 ${className}`}>
                {Object.entries(field.fields).map(([subKey, subField]) =>
                  renderField(subKey, subField, path),
                )}
              </div>
            </CardContent>
          </Card>
      )

      case "objectlist": {
        const listValue = Array.isArray(value) ? value : []

        // Garante que cada item tenha a estrutura de subcampos definida em field.fields
        const ensureItemShape = (item: any) => {
          const obj = typeof item === "object" && item !== null ? { ...item } : {}
          field.fields.forEach((subField: any) => {
            if (!(subField.name in obj)) obj[subField.name] = ""
          })
          return obj
        }

        const normalizedList = listValue.map(ensureItemShape)

        return (
          <div key={path} className={`space-y-2 col-span-${span}`}>
            {showLabel && <Label>{capitalize(displayName)}</Label>}

            <div className={`grid gap-4 md:grid-cols-${cols}`}>
              {normalizedList.map((item, index) => (
                <Card key={`${path}-${index}`} className="border p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      const newList = normalizedList.filter((_, i) => i !== index)
                      updateValue(path, newList)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className={`grid gap-4 md:grid-cols-2`}>
                    {field.fields.map((subField: any) => (
                      <div key={subField.name} className={`col-span-${subField.span || 1}`}>
                        <Label className="text-xs mb-1">{capitalize(subField.name)}</Label>
                        {subField.type === "string" ? (
                          <Input
                          value={item[subField.name]}
                          onChange={(e) => {
                            const newList = normalizedList.map((it, i) =>
                              i === index ? { ...it, [subField.name]: e.target.value } : it
                            )
                            updateValue(path, newList)
                          }}
                        />) : (<Textarea
                          value={item[subField.name]}
                          onChange={(e) => {
                            const newList = normalizedList.map((it, i) =>
                              i === index ? { ...it, [subField.name]: e.target.value } : it
                            )
                            updateValue(path, newList)
                          }}
                        />)}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}

              {/* Botão para adicionar novo item */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const emptyItem = field.fields.reduce((acc: any, subField: any) => {
                    acc[subField.name] = ""
                    return acc
                  }, {})
                  updateValue(path, [...normalizedList, emptyItem])
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        )
      }

      case "status": {
      
        const statusValue = {
          value: getValue(path + ".value") as number,
          max: getValue(path + ".max") as number
        }

        return (
          <StatusBar
            key={path}
            label={displayName}
            value={statusValue.value}
            max={statusValue.max}
            onChange1={(newValue) =>
              updateValue(path + ".value", newValue)
            }
            onChange2={(newMax) =>
              updateValue(path + ".max", newMax)
            }
            color={color}
          />
        )
      }

      case "attribute": {
        const attrValue = getValue(path + ".value") as string ?? 10
        const attrBonus = getValue(path + ".bonus") as string ?? "+0"
        return (
          <AttributeField
            key={path}
            className={`col-span-${span}`}
            label={displayName}
            value={attrValue}
            bonus={attrBonus}
            onChange={(val) => updateValue(path + ".value", val)}
            onChangeBonus={(val) => updateValue(path + ".bonus", val)}
          />
  )
      }

      default:
        return null
    }
  }

  

  return (
    <div className={`space-y-4 grid gap-4 md:grid-cols-${cols}`}>
      {Object.entries(fields).map(([key, field]) => renderField(key, field))}
    </div>
  )
}