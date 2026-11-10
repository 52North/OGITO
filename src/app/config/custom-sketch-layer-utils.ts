import { CustomLayerDefinition, FieldConfig } from './custom-sketch-layer-config';

/**
 * Resolves the effective field list for a given category: the category's own
 * `fields` if it defines one, otherwise the layer definition's default `fields`.
 */
export function getFormFieldsForCategory(layerDefinition: CustomLayerDefinition, categoryId: string | undefined): FieldConfig[] {
  const category = layerDefinition.categories.find(c => c.id === categoryId);
  return category?.fields ?? layerDefinition.fields;
}
