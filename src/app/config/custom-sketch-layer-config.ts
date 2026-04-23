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
    showInFeatureInfo?: boolean; // whether to show this field in the feature info popup
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
    labelField?: string; // the field whose value should be shown as label on the map
    iconHeightPxl: number; // the height in pixel of the custom icons on the map
}