export interface ApiResponse<T> {
  data: T;
  status: number;
}

export type Template = Record<string, any>;

export interface TemplateBasicInfo {
  id: string;
  system_name: string;
  version: string;
  description?: string;
  created_at?: string;
}

export interface FieldConfig {
  name?: string
  type: string
  required?: boolean
  default?: any
  description?: string
  options?: string[]
  min?: number
  max?: number
  fields?: Record<string, FieldConfig> | FieldConfig[]
}