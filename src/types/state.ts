/**
 * Interface for the field errors of a form, which is a mapping of form shape
 * to string error
 */
export type IFieldErrors<TFormShape, TError = string> = {
  [Field in keyof TFormShape]?: TError;
};

/**
 * The interface for the root form reducer.
 * A map of form name keys to IFormState objects
 */
export interface IFormReducerState {
  [id: string]: IFormState<any>;
}

/**
 * Converts a form state type to a mapping of form fields to value types
 */
export type IFormValues<TFormState extends IFormState<any, any>> = {
  [Field in keyof TFormState['fields']]: TFormState['fields'][Field]['value'];
}

/**
 * The interface for an individual store in the state
 * "FormShape" is a mapping of field names to their values. E.g.
 *
 * interface FormShape {
 *   age: string;
 *   name: string;
 * }
 */
export interface IFormState<TFormShape, TError = string> {
  name: string;
  initialValues?: Partial<TFormShape>;
  fields: IFormFields<TFormShape, TError>;
  invalid: boolean;
}

/**
 * Converts a FormShape type, a mapping of field names to their value types, into
 * a mapping type of field names to IFormFieldState objects.
 * This is the interface used for the "controls" property of the IFormState interface.
 */
export type IFormFields<TFormShape, TError = string> = {
  [FieldName in keyof TFormShape]?: IFormFieldState<TFormShape[FieldName], TError>;
};

/**
 * The interface for a single field in the form state
 * "V" is the field value type (e.g. string, number)
 */
export interface IFormFieldState<TValue, TError = string> {
  error?: TError;
  focus: boolean;
  value: TValue;
  count: number;
  touched: boolean;
}

/**
 * The structure of the ngrx Store that *this library* cares about (the form section)
 * Probably only really used locally in the project, but will export anyway
 */
export interface IStoreState {
  form: IFormReducerState;
}
