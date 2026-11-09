export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'datetime' | 'date';

// a leaf compares one other field's value; "all"/"any" combine conditions with AND/OR, recursively
export interface FieldConditionLeaf {
    field: string; // id of the controlling field
    equals?: any;
    notEquals?: any; // exactly one of equals/notEquals should be set
}

export interface FieldConditionAll {
    all: FieldCondition[]; // AND
}

export interface FieldConditionAny {
    any: FieldCondition[]; // OR
}

export type FieldCondition = FieldConditionLeaf | FieldConditionAll | FieldConditionAny;

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
    condition?: FieldCondition; // if set, the field is only shown/required when this evaluates to true
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