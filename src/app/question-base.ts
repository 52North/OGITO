export class QuestionBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  min: number;
  max: number;
  controlType: string;
  type: string;
  checked: boolean;
  options: {key: string, value: string}[];

  constructor(options: {
    value?: T;
    key?: string;
    label?: string;
    required?: boolean;
    order?: number;
    min?: number;
    max?: number;
    controlType?: string;
    type?: string;
    checked?: boolean;
    options?: {key: string, value: string}[];
     } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.min = options.min === undefined ? 1 : options.min;
    this.max = options.max === undefined ? 10 : options.max;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.checked = options.checked || false;
    this.options = options.options || [];
  }
}
