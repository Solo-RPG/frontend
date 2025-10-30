"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical, Plus, X } from "lucide-react"
import { Template, Character, SheetFieldValue, SheetField, SheetCreateRequest } from "@/lib/service/types"
import { StatusBar } from "../ui/statusbar"
import { get } from "http"
import AttributeField from "../ui/attributefield"
import { tr } from "date-fns/locale"
import { Textarea } from "../ui/textarea"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog"
import ColorCircle from "../ui/colorcircle"
import { useState } from "react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { ObjectListField } from "../fields/objectlistfield"
import { ListField } from "../fields/listfield"
import { ObjectField } from "../fields/objectfield"

type FieldType = 'string' | 'number' | 'boolean' | 'list' | 'object' | 'textarea' | 'objectlist' | 'status' | 'attribute' | 'dadovida'

export interface FieldDefinition {
  name: string
  type: FieldType
  required?: boolean
  min?: number
  max?: number
  flex?: string
  span?: string
  cols?: string
  rows?: string
  color?: string
  show_label?: boolean
  quantity?: number
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

  const renderField = (key: string, field: FieldDefinition, parentPath = "", isNested = false) => {
    const fieldName = field.name || key;
    const path = parentPath ? 
    `${parentPath}.${fieldName}` : 
    fieldName;
    
    const value = getValue(path);
    const displayName = getDisplayName(field, key);

    const flex = field.flex
    const colSpan = field.span 
    const cols = field.cols 
    const rowSpan = field.rows || 1
    const color = field.color || "red"
    const showLabel = field.show_label



    switch (field.type) {
      case "string":
        if (field.options) {
          return (
            <div key={path} className={`space-y-2 flex-row col-span-${colSpan} row-span-${rowSpan}`}>
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
          <div key={path} className={`space-y-2 col-span-${colSpan} row-span-${rowSpan}`}>
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

      case "list":
        return (
          <ListField
            path={path}
            value={value}
            field={field}
            colSpan={colSpan}
            rowSpan={rowSpan}
            showLabel={showLabel}
            displayName={displayName}
            updateValue={updateValue}
          />
      )

      case "object":
        return (
          <ObjectField
            path={path}
            field={field}
            colSpan={colSpan}
            rowSpan={rowSpan}
            showLabel={showLabel}
            displayName={displayName}
            renderField={renderField}
            flex={flex}
            cols={cols}
          />
      )

      case "objectlist": {
        return (
          <ObjectListField
            key={path}
            path={path}
            value={value}
            field={field}
            colSpan={colSpan}
            rowSpan={rowSpan}
            showLabel={showLabel}
            displayName={displayName}
            updateValue={updateValue}
          />
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
            className={`col-span-${colSpan} row-span-${rowSpan}`}
            label={displayName}
            value={attrValue}
            bonus={attrBonus}
            onChange={(val) => updateValue(path + ".value", val)}
            onChangeBonus={(val) => updateValue(path + ".bonus", val)}
          />
  )
      }

      case "dadovida": {
          const [toggle, setToggle] = useState(false);

          const colorCircles = []

          for(let i=0 ; i < field.quantity; i++) {
            colorCircles.push(<ColorCircle key={i}
              value={getValue(`${path}.circle_${i+1}`) as boolean || false}
              onToggle={(e) => updateValue(`${path}.circle_${i+1}`, e)}
            />)
          }
          

          return (
            <div key={path} className={`grid w-full gap-4 justify-self-center justify-items-center items-center grid-cols-${cols} border rounded-md p-8 pl-16 pr-16`}>
              <h1 className=" col-span-4 text-lg mb-2">Dados de Vida</h1>
              {colorCircles}
            </div>
          )
          
      }


      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 grid gap-4 md:grid-cols-${cols || '2'}`}>
      {Object.entries(fields).map(([key, field]) => renderField(key, field))}
    </div>
  )
}