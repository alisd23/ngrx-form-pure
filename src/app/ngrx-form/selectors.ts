import { IFormState } from './types';
import { IFieldErrors } from './index';

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
