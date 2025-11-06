"use client"

import { SheetFieldValue } from "@/lib/service/types"
import { ObjectListField } from "../fields/objectlistfield"
import { ListField } from "../fields/listfield"
import { ObjectField } from "../fields/objectfield"
import StringField from "../fields/stringfield"
import TextareaField from "../fields/textareafield"
import NumberField  from "../fields/numberfield"
import BooleanField from "../fields/booleanfield"
import StatusField from "../fields/statusfield"
import AttributeFieldComponent from "../fields/attributefield"
import DadovidaField from "../fields/dadosvidafield"
import StatusCustoField from "../fields/statuscustofield"
import { useState } from "react"
import { all } from "axios"
import { get } from "http"

type FieldType = 'string' | 'number' | 'boolean' | 'list' | 'object' | 'textarea' | 'objectlist' | 'status' | 'attribute' | 'dadovida' | 'statuscusto';

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
  status_target?: string
  options?: string[]
  fields?: Record<string, FieldDefinition>
  itemType?: string
}

interface DynamicFormRendererProps {
  fields: Record<string, FieldDefinition>;
  values: Record<string, SheetFieldValue>;
  cols?: string
  onChange: (values: Record<string, SheetFieldValue>) => void;
  status?: [];
}

export function DynamicFormRenderer({ fields, values, cols, onChange, status }: DynamicFormRendererProps) {
  const [allStatus, setAllStatus] = useState<string[]>([]);

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

  const getAllStatus = () => {
    return allStatus;
  }

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
  };


  const renderField = (key: string, field: FieldDefinition, parentPath = "", isNested = false) => {
    const fieldName = field.name || key;
    const path = parentPath ? `${parentPath}.${fieldName}` : fieldName;
    
    const value = getValue(path);
    const displayName = getDisplayName(field, key);

    const flex = field.flex;
    const colSpan = field.span;
    const colsField = field.cols;
    const rowSpan = field.rows || "1";
    const color = field.color || "red";
    const showLabel = field.show_label;

    switch (field.type) {
      case "string":
        return <StringField
          key={path}
          path={path}
          field={field}
          value={value}
          displayName={displayName}
          updateValue={updateValue}
          showLabel={showLabel}
          colSpan={colSpan}
          rowSpan={rowSpan}
        />;

      case "textarea":
        return <TextareaField
          key={path}
          path={path}
          field={field}
          value={value}
          displayName={displayName}
          updateValue={updateValue}
          showLabel={showLabel}
          colSpan={colSpan}
          rowSpan={rowSpan}
        />;

      case "number":
        return <NumberField
          key={path}
          path={path}
          field={field}
          value={value}
          displayName={displayName}
          updateValue={updateValue}
          showLabel={showLabel}
          colSpan={colSpan}
          rowSpan={rowSpan}
        />;

      case "boolean":
        return <BooleanField
          key={path}
          path={path}
          field={field}
          value={value}
          displayName={displayName}
          updateValue={updateValue}
        />;

      case "list":
        return (
          <ListField
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
        );

      case "object":
        return (
          <ObjectField
            key={path}
            path={path}
            field={field}
            colSpan={colSpan}
            rowSpan={rowSpan}
            showLabel={showLabel}
            displayName={displayName}
            renderField={renderField}
            flex={flex}
            cols={colsField}
          />
        );

      case "objectlist":
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
            getValue={getValue}
            getAllStatus={getAllStatus}
          />
        );

      case "status":
        return <StatusField
          key={path}
          path={path}
          field={field}
          getValue={getValue}
          updateValue={updateValue}
          displayName={displayName}
          color={color}
          allStatus={allStatus}
          changeAllStatus={setAllStatus}
        />;

      case "attribute":
        return <AttributeFieldComponent
          key={path}
          path={path}
          field={field}
          getValue={getValue}
          updateValue={updateValue}
          displayName={displayName}
          colSpan={colSpan}
          rowSpan={rowSpan}
        />;

      case "dadovida":
        return <DadovidaField
          key={path}
          path={path}
          field={field}
          getValue={getValue}
          updateValue={updateValue}
          cols={colsField}
        />;

      case "statuscusto":
        return <StatusCustoField
          key={path}
          path={path}
          field={field}
          getValue={getValue}
          updateValue={updateValue}
          displayName={displayName}
          showLabel={showLabel}
          colSpan={colSpan}
          rowSpan={rowSpan}
        />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 grid gap-4 md:grid-cols-${cols || '2'}`}>
      {Object.entries(fields).map(([key, field]) => renderField(key, field))}
    </div>
  );
}
