export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'datetime' | 'date';

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  default?: any;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: string[];
  readonly?: boolean;
  required?: boolean;
}

export interface CategoriesConfig{
    id: string
    label: string
    icon: string
}

export interface CustomLayerDefinition {
    layername: string;
    groupname: string;
    header?: string,
    categories: CategoriesConfig[];
    fields: FieldConfig[];
}