export type FormControls<Shape> = {
  [FieldName in keyof Shape]: FormFieldState<Shape[FieldName]>;
};

export interface FormState<Shape> {
  name: string;
  controls: FormControls<Shape>;
  hasErrors: boolean;
}

export interface FormFieldState<V> {
  value: V;
  focus: boolean;
}

export interface FormReducerState {
  [name: string]: FormState<any>;
}
