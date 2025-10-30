export interface ApiResponse<T> {
  data: T;
  status: number;
}

//User types

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: {
    token: number;
    refreshToken: number;
  };
}

// Template types

export type Template = Record<string, any>;

export interface TemplateBasicInfo {
  id: string
  system_name: string
  version: string
  cols?: string
  description?: string
  created_at?: string
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
  flex?: string
  span?: string
  cols?: string
  color?: string
  showLabel?: boolean
  fields?: Record<string, FieldConfig> | FieldConfig[]
}

// Character types

export interface Character {
  id: string;
  owner_id: string;
  nome_personagem: string;
  ficha_id?: string;
  historia?: string;
  imagem?: string;
}

export interface CharacterCreateRequest {
  nome_personagem: string;
  historia?: string;
  imagem?: string;
}

export interface CharacterUpdateRequest {
  [key: string]: any; // Mapeamento dinâmico para atualizações parciais
  nome_personagem?: string;
  fichaId?: string | null;
  historia?: string;
  imagem?: string;
}

// Sheets types

export type SheetFieldValue = 
  | string 
  | number 
  | boolean 
  | { [key: string]: SheetFieldValue }
  | unknown;

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
  fields: { [key: string]: any };
}

export interface SheetUpdateRequest {
  fields?: { [key: string]: any };
  character_id?: string | null;
}

export type SheetFormData = Record<string, SheetFieldValue>;
