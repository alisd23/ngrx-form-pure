import { Action } from '@ngrx/store';
import { FormReducerState, FormState } from './types';

// ========================= //
//        ACTION TYPES       //
// ========================= //
interface InitAction<RootShape, Shape> extends Action {
  type: '@ngrx-form/init';
  payload: {
    formName: keyof RootShape;
    initialState: Shape;
  };
}

interface DestroyAction<RootShape> extends Action {
  type: '@ngrx-form/destroy';
  payload: { formName: keyof RootShape };
}

interface FocusFieldAction<RootShape, Shape> extends Action {
  type: '@ngrx-form/focus';
  payload: {
    formName: keyof RootShape;
    fieldName: keyof Shape;
  };
}

interface BlurFieldAction<RootShape, Shape> extends Action {
  type: '@ngrx-form/blur';
  payload: {
    formName: keyof RootShape;
    fieldName: keyof Shape;
  };
}

interface ChangeFieldAction<RootShape, Shape> extends Action {
  type: '@ngrx-form/change';
  payload: {
    formName: keyof RootShape;
    fieldName: keyof Shape;
    value: any;
  };
}

export type Actions<S extends FormReducerState, F extends FormState<any>> =
  InitAction<S, F> |
  DestroyAction<S> |
  FocusFieldAction<S, F> |
  BlurFieldAction<S, F> |
  ChangeFieldAction<S, F>;

// ========================= //
//        ACTION CREATORS    //
// ========================= //
export interface FormActions<RootShape, Shape> {
  initForm: (formName: keyof RootShape, initialState: Shape) => InitAction<RootShape, Shape>;
  destroyForm: (formName: keyof RootShape) => DestroyAction<RootShape>;
  focusField: (formName: keyof RootShape, fieldName: keyof Shape) => FocusFieldAction<RootShape, Shape>;
  blurField: (formName: keyof RootShape, fieldName: keyof Shape) => BlurFieldAction<RootShape, Shape>;
  changeField: (formName: keyof RootShape, fieldName: keyof Shape, value: any) => ChangeFieldAction<RootShape, Shape>;
}

// Create actions given form shape (Makes TypeScript work well)
export function getFormActions<RootShape, Shape>(): FormActions<RootShape, Shape> {
  return {
    initForm: (formName, initialState) => ({
      type: '@ngrx-form/init',
      payload: { formName, initialState }
    }),
    destroyForm: (formName) => ({
      type: '@ngrx-form/destroy',
      payload: { formName }
    }),
    focusField: (formName, fieldName) => ({
      type: '@ngrx-form/focus',
      payload: { formName, fieldName }
    }),
    blurField: (formName, fieldName) => ({
      type: '@ngrx-form/blur',
      payload: { formName, fieldName }
    }),
    changeField: (formName, fieldName, value) => ({
      type: '@ngrx-form/change',
      payload: { formName, fieldName, value }
    })
  };
}
