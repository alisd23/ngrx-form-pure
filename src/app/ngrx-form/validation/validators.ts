export type IFieldValidator<V> = {
  (value: V): string | undefined;
}

export type IFieldValidators<FormShape> = {
  [Field in keyof FormShape]?: IFieldValidator<FormShape[Field]>[];
}

export const validators = {
  required: (fieldName: string): IFieldValidator<any> =>
    (value) => value === undefined ? `${fieldName} is required` : undefined
}
