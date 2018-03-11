import { IFormState } from './state';

export type IFieldValidator<TFormShape, TValue> =
  (value: TValue, form: IFormState<TFormShape>) => string | undefined

export type IFieldValidators<TFormShape> = {
  [Field in keyof TFormShape]?: IFieldValidator<TFormShape, TFormShape[Field]>[];
}
