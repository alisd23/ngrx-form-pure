/**
 * Interface for the field errors of a form, which is a mapping of form shape
 * to string error
 */
export type IFieldErrors<FormShape, ErrorType = string> = {
  [Field in keyof FormShape]?: ErrorType;
};

/**
 * The interface for the root form reducer.
 * A map of form name keys to IFormState objects
 */
export type IFormReducerState = {
  [id: string]: IFormState<any>;
}

/**
 * Converts a form state type to a mapping of form fields to value types
 */
export type IFormValues<FormState extends IFormState<any, any>> = {
  [Field in keyof FormState['fields']]: FormState['fields'][Field]['value'];
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
export interface IFormState<FormShape, ErrorType = string> {
  name: string;
  initialValues?: Partial<FormShape>;
  fields: IFormFields<FormShape, ErrorType>;
  invalid: boolean;
}

/**
 * Converts a FormShape type, a mapping of field names to their value types, into
 * a mapping type of field names to IFormFieldState objects.
 * This is the interface used for the "controls" property of the IFormState interface.
 */
export type IFormFields<FormShape, ErrorType = string> = {
  [FieldName in keyof FormShape]?: IFormFieldState<FormShape[FieldName], ErrorType>;
};

/**
 * The interface for a single field in the form state
 * "V" is the field value type (e.g. string, number)
 */
export interface IFormFieldState<ValueType, ErrorType = string> {
  error?: ErrorType;
  focus: boolean;
  value: ValueType;
  count: number;
  touched: boolean;
}
