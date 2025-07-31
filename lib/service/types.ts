export interface ApiResponse<T> {
  data: T;
  status: number;
}

// Template types

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

// Character types

export interface Character {
  id: string;
  ownerId: string;
  nomePersonagem: string;
  fichaId?: string;
  historia?: string;
  imagem?: string;
}

export interface CharacterCreateRequest {
  ownerId: string;
  nomePersonagem: string;
  fichaId?: string;
  historia?: string;
  imagem?: string;
}

export interface CharacterUpdateRequest {
  [key: string]: any; // Mapeamento dinâmico para atualizações parciais
  nomePersonagem?: string;
  fichaId?: string | null;
  historia?: string;
  imagem?: string;
}

// Sheets types

export type SheetFieldValue = 
  | string 
  | number 
  | boolean 
  | { [key: string]: SheetField };

export interface SheetField {
  value: SheetFieldValue;
  required?: boolean;
  options?: string[];
}

export interface SheetForm {
  id: string;
  template_id: string;
  template_system_name: string;
  template_system_version: string;
  owner_id: string;
  character_id?: string | null;
  data: { [key: string]: SheetField };
}

export interface SheetCreateRequest {
  template_id?: string;
  system_name?: string;
  owner_id: string;
  fields: { [key: string]: any }; // Ou user_data conforme seu backend
}

export interface SheetUpdateRequest {
  fields?: { [key: string]: any };
  character_id?: string | null;
}
