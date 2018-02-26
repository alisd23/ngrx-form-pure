import { IFieldValidator } from '../types';

export const validators = {
  required: (fieldName: string): IFieldValidator<any, any> =>
    (value) => (value === undefined || value === '')
      ? `${fieldName} is required`
      : undefined
}
