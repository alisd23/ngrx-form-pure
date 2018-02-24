import { IFormState, IFieldErrors } from './types';

/**
 * Get's the values of all fields as a key-value map of fieldName to value
 * @param formState - top level state of the form to extract values from
 */
export function getFormValues<FormShape>(formState: IFormState<FormShape>): FormShape {
  return Object
    .keys(formState.fields || {})
    .reduce((result, fieldName: keyof FormShape) => ({
      ...result,
      [fieldName]: formState.fields[fieldName].value
    }), {}) as FormShape;
}

/**
 * Get's the errors of all fields as a key-value map of fieldName to error
 * @param formState - top level state of the form to extract errors from
 */
export function getFieldErrors<FormShape>(formState: IFormState<FormShape>): IFieldErrors<FormShape> {
  return Object
    .keys(formState.fields || {})
    .reduce((result, fieldName: keyof FormShape) => ({
      ...result,
      [fieldName]: formState.fields[fieldName].error
    }), {});
}

/**
 * Finds whether the form has the same values as it's 'initialValues'
 * False if there are no 'initialValues'
 * @param formState - top level state of the form to check
 */
export function isFormPristine<FormShape>(formState: IFormState<FormShape>): boolean {
  if (!formState.initialValues) {
    return false;
  }
  const fieldNames = Object.keys(formState.fields || {}) as (keyof FormShape)[];
  for (const name of fieldNames) {
    if (formState.fields[name].value !== formState.initialValues[name]) {
      return false
    }
  }
  return true;
}
