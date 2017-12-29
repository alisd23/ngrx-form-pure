import { OnDestroy } from '@angular/core';

/**
 * Converts a FormShape type, a mapping of field names to their value types, into
 * a mapping type of field names to IFormFieldState objects.
 * This is the interface used for the "controls" property of the IFormState interface.
 * 
 */
export type IFormFields<FormShape> = {
  [FieldName in keyof FormShape]: IFormFieldState<FormShape[FieldName]>;
};

/**
 * Interface for the field errors of a form, which is a mapping of form shape
 * to string error
 */
export type IFieldErrors<FormShape> = {
  [Field in keyof FormShape]?: string;
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
  initialValues?: FormShape;
  fields: IFormFields<FormShape>;
  invalid: boolean;
}

/**
 * The interface for a single field in the form state
 * "V" is the field value type (e.g. string, number)
 */
export interface IFormFieldState<V> {
  error?: string;
  focus: boolean;
  value: V;
  count: number;
  // pristine: boolean;
  touched: boolean;
}

/**
 * The interface for the root form reducer.
 * A map of form name keys to IFormState objects
 */
export interface IFormReducerState {
  [id: string]: IFormState<any>;
}

export interface IFieldInfo {
  fieldName: string;
  formName: string;
  onChange(newValue: any, e: Event): void;
}

export interface IFieldControl extends OnDestroy {
  onChange(e: Event): any;
  onValueUpdate(newValue: any): void;
  initialise(fieldInfo: IFieldInfo);
}
