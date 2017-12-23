import { IFormState } from './types';

export function getFormValues<FormShape>(formState: IFormState<FormShape>): FormShape {
  return Object
    .keys(formState.fields)
    .reduce((result, fieldName) => ({
      ...result,
      [fieldName]: formState.fields[fieldName].value
    }), {}) as FormShape;
}