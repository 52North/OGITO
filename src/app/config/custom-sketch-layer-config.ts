export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'datetime' | 'date';

export interface FieldConfig {
    id: string;
    label: string;
    type: FieldType;
    default?: any;
    placeholder?: string;
    min?: number; // for number fields
    max?: number; //for number fields
    options?: string[]; //for select and radio fields
    rows?: number; // for textarea, optional number of rows to display in the textarea without scrolling
    maxLength?: number; // for text and textarea
    minLength?: number; // for text and textarea
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