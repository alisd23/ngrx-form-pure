import { IFormState, IFieldErrors } from './types';

export function getFormValues<FormShape>(formState: IFormState<FormShape>): FormShape {
  return Object
    .keys(formState.fields)
    .reduce((result, fieldName: keyof FormShape) => ({
      ...result,
      [fieldName]: formState.fields[fieldName].value
    }), {}) as FormShape;
}

export function getFieldErrors<FormShape>(formState: IFormState<FormShape>): IFieldErrors<FormShape> {
  return Object
    .keys(formState.fields)
    .reduce((result, fieldName: keyof FormShape) => ({
      ...result,
      [fieldName]: formState.fields[fieldName].error
    }), {});
}

export function isFormPristine<FormShape>(formState: IFormState<FormShape>): boolean {
  const fieldNames = Object.keys(formState.fields) as (keyof FormShape)[];
  for (const name of fieldNames) {
    if (formState.fields[name].value !== formState.initialValues[name]) {
      return false
    }
  }
  return true;
}
