/**
 * Converts a FormShape type, a mapping of field names to their value types, into
 * a mapping type of field names to IFormFieldState objects.
 * This is the interface used for the "controls" property of the IFormState interface.
 * 
 */
export type IFormControls<FormShape> = {
  [FieldName in keyof FormShape]: IFormFieldState<FormShape[FieldName]>;
};

/**
 * Converts a IFormState type into an interface mapping of field names to their
 * value type. E.g.
 * 
 * interface Form {                              interface IFormValues<Form> {
 *   name: string;                                 age: string;
 *   controls: {                                   name: string;
 *     age: { value: string; ...}       =>       }
 *     name: { value: string; ...}
 *   }
 *  ...
 * }
 */
export type IFormValues<Form extends IFormState<any>> = {
  [FieldName in keyof Form['controls']]: Form['controls'][FieldName]['value'];
};

/**
 * The interface for an individual store in the state
 * "FormShape" is a mapping of field names to their values. E.g.
 * 
 * interface FormShape {
 *   age: string;
 *   name: string;
 * }
 */
export interface IFormState<FormShape> {
  name: string;
  controls: IFormControls<FormShape>;
  hasErrors: boolean;
}

/**
 * The interface for a single field in the form state
 * "V" is the field value type (e.g. string, number)
 */
export interface IFormFieldState<V> {
  value: V;
  focus: boolean;
}

/**
 * The interface for the root form reducer.
 * A map of form name keys to IFormState objects
 */
export interface IFormReducerState {
  [id: string]: IFormState<any>;
}
