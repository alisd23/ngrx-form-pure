import { Action } from '@ngrx/store';
import { IFormReducerState, IFormState, IFormValues } from './types';

// ========================= //
//        ACTION TYPES       //
// ========================= //
interface InitAction<RootShape, IFormState> extends Action {
  type: '@ngrx-form/init';
  payload: {
    formName: keyof RootShape;
    initialState: {
      [P in keyof IFormState]: IFormState[P]
    };
  };
}

interface DestroyAction<RootShape> extends Action {
  type: '@ngrx-form/destroy';
  payload: { formName: keyof RootShape };
}

interface FocusFieldAction<RootShape, FormShape> extends Action {
  type: '@ngrx-form/focus';
  payload: {
    formName: keyof RootShape;
    fieldName: keyof FormShape;
  };
}

interface BlurFieldAction<RootShape, FormShape> extends Action {
  type: '@ngrx-form/blur';
  payload: {
    formName: keyof RootShape;
    fieldName: keyof FormShape;
  };
}

interface ChangeFieldAction<RootShape, FormShape> extends Action {
  type: '@ngrx-form/change';
  payload: {
    formName: keyof RootShape;
    fieldName: keyof FormShape;
    value: any;
  };
}

export type Actions<S extends IFormReducerState, F extends IFormState<any>> =
  InitAction<S, F> |
  DestroyAction<S> |
  FocusFieldAction<S, F> |
  BlurFieldAction<S, F> |
  ChangeFieldAction<S, F>;


// ========================= //
//        ACTION CREATORS    //
// ========================= //

export interface FormActions<RootShape, Form extends IFormState<any>> {
  initForm: (initialState: IFormValues<Form>)
    => InitAction<RootShape, IFormValues<Form>>;
  destroyForm: ()
    => DestroyAction<RootShape>;
  focusField: (fieldName: keyof IFormValues<Form>)
    => FocusFieldAction<RootShape, IFormValues<Form>>;
  blurField: (fieldName: keyof IFormValues<Form>)
    => BlurFieldAction<RootShape, IFormValues<Form>>;
  changeField: (fieldName: keyof IFormValues<Form>, value: any)
    => ChangeFieldAction<RootShape, IFormValues<Form>>;
}

// Create actions given form shape (Makes Typings work nicely)
export function getFormActions<RootShape extends any>(formName: keyof RootShape):
  FormActions<RootShape, RootShape[keyof RootShape]> {
  return {
    initForm: (initialState) => ({
      type: '@ngrx-form/init',
      payload: { formName, initialState }
    }),
    destroyForm: () => ({
      type: '@ngrx-form/destroy',
      payload: { formName }
    }),
    focusField: (fieldName) => ({
      type: '@ngrx-form/focus',
      payload: { formName, fieldName }
    }),
    blurField: (fieldName) => ({
      type: '@ngrx-form/blur',
      payload: { formName, fieldName }
    }),
    changeField: (fieldName, value) => ({
      type: '@ngrx-form/change',
      payload: { formName, fieldName, value }
    })
  };
}
