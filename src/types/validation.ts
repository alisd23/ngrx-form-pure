import { IFormState } from './state';

export type IFieldValidator<FormShape, V> =
  (value: V, form: IFormState<FormShape>) => string | undefined

export type IFieldValidators<FormShape> = {
  [Field in keyof FormShape]?: IFieldValidator<FormShape, FormShape[Field]>[];
}
