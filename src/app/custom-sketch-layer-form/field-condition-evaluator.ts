import { FieldCondition } from '../config/custom-sketch-layer-config';

/**
 * Evaluates whether a field's `condition` is satisfied by the current form values.
 * Used to determine visibility of conditional fields in the form.
 */
export function evaluateFieldCondition(condition: FieldCondition | undefined, values: Record<string, any>): boolean {
  if (!condition) {
    return true;
  }

  if ('all' in condition) {
    return condition.all.every(c => evaluateFieldCondition(c, values));
  }

  if ('any' in condition) {
    return condition.any.some(c => evaluateFieldCondition(c, values));
  }

  if ('equals' in condition) {
    return values[condition.field] === condition.equals;
  }

  if ('notEquals' in condition) {
    return values[condition.field] !== condition.notEquals;
  }

  console.warn('Unrecognized field condition, defaulting to visible', condition);
  return true;
}
