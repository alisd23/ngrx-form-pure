import { Action } from '@ngrx/store';

import { IFormReducerState, IFieldErrors, IFormValues } from './types';

// ========================= //
//        ACTION TYPES       //
// ========================= //

export enum ActionConstants {
  INIT_FORM = '@ngrx-form-pure/init',
  RESET_FORM = '@ngrx-form-pure/reset-form',
  DESTROY_FORM = '@ngrx-form-pure/destroy',
  FOCUS_FIELD = '@ngrx-form-pure/focus',
  BLUR_FIELD = '@ngrx-form-pure/blur',
  CHANGE_FIELD = '@ngrx-form-pure-pure/change',
  RESET_FIELD = '@ngrx-form-pure/reset-field',
  UPDATE_FIELD_ERRORS = '@ngrx-form-pure/update-field-errors',
  REGISTER_FIELD = '@ngrx-form-pure/register-field',
  UNREGISTER_FIELD = '@ngrx-form-pure/unregister-field',
  SET_INITIAL_VALUES = '@ngrx-form-pure/set-initial-values'
}

export interface InitFormAction<TRootFormsState> extends Action {
  type: ActionConstants.INIT_FORM;
  payload: {
    formName: keyof TRootFormsState;
  };
}

export interface ResetFormAction<TRootFormsState> extends Action {
  type: ActionConstants.RESET_FORM;
  payload: {
    formName: keyof TRootFormsState;
  };
}

export interface DestroyFormAction<TRootFormsState> extends Action {
  type: ActionConstants.DESTROY_FORM;
  payload: { formName: keyof TRootFormsState };
}

export interface FocusFieldAction<TRootFormsState, TFormShape> extends Action {
  type: ActionConstants.FOCUS_FIELD;
  payload: {
    formName: keyof TRootFormsState;
    fieldName: keyof TFormShape;
  };
}

export interface BlurFieldAction<TRootFormsState, TFormShape> extends Action {
  type: ActionConstants.BLUR_FIELD;
  payload: {
    formName: keyof TRootFormsState;
    fieldName: keyof TFormShape;
  };
}

export interface ChangeFieldAction<TRootFormsState, TFormShape> extends Action {
  type: ActionConstants.CHANGE_FIELD;
  payload: {
    formName: keyof TRootFormsState;
    fieldName: keyof TFormShape;
    value?: any;
  };
}

// NOTE: does not have an associated action creator.
// If requested this could be added
export interface ResetFieldAction<TRootFormsState, TFormShape> extends Action {
  type: ActionConstants.RESET_FIELD;
  payload: {
    formName: keyof TRootFormsState;
    fieldName: keyof TFormShape;
    value?: any;
  };
}

export interface UpdateFieldErrorsAction<TRootFormsState, TFormShape> extends Action {
  type: ActionConstants.UPDATE_FIELD_ERRORS;
  payload: {
    formName: keyof TRootFormsState;
    errors: IFieldErrors<TFormShape>;
  }
}

export interface RegisterFieldAction<TRootFormsState, TFormShape> extends Action {
  type: ActionConstants.REGISTER_FIELD;
  payload: {
    formName: keyof TRootFormsState;
    fieldName: keyof TFormShape;
  }
}

export interface UnregisterFieldAction<TRootFormsState, TFormShape> extends Action {
  type: ActionConstants.UNREGISTER_FIELD;
  payload: {
    formName: keyof TRootFormsState;
    fieldName: keyof TFormShape;
  }
}

export interface SetInitialValuesAction<TRootFormsState, TFormShape> extends Action {
  type: ActionConstants.SET_INITIAL_VALUES;
  payload: {
    formName: keyof TRootFormsState;
    values: Partial<TFormShape>;
  }
}

export type Actions<TRootFormsState extends IFormReducerState, TFormShape> =
  InitFormAction<TRootFormsState> |
  ResetFormAction<TRootFormsState> |
  DestroyFormAction<TRootFormsState> |
  FocusFieldAction<TRootFormsState, TFormShape> |
  BlurFieldAction<TRootFormsState, TFormShape> |
  ChangeFieldAction<TRootFormsState, TFormShape> |
  ResetFieldAction<TRootFormsState, TFormShape> |
  UpdateFieldErrorsAction<TRootFormsState, TFormShape> |
  RegisterFieldAction<TRootFormsState, TFormShape> |
  UnregisterFieldAction<TRootFormsState, TFormShape> |
  SetInitialValuesAction<TRootFormsState, TFormShape>;


// ========================= //
//        ACTION CREATORS    //
// ========================= //

export interface IFormActions<TRootFormsState, TFormShape> {
  initForm: () =>
    InitFormAction<TRootFormsState>;
  resetForm: () =>
    ResetFormAction<TRootFormsState>;
  destroyForm: () =>
    DestroyFormAction<TRootFormsState>;
  focusField: (fieldName: keyof TFormShape) =>
    FocusFieldAction<TRootFormsState, TFormShape>;
  blurField: (fieldName: keyof TFormShape) =>
    BlurFieldAction<TRootFormsState, TFormShape>;
  changeField: <T extends keyof TFormShape>(fieldName: T, value: TFormShape[T]) =>
    ChangeFieldAction<TRootFormsState, TFormShape>;
  updateFieldErrors: (errors: IFieldErrors<Partial<TFormShape>>) =>
    UpdateFieldErrorsAction<TRootFormsState, TFormShape>
  registerField: (fieldName: keyof TFormShape) =>
    RegisterFieldAction<TRootFormsState, TFormShape>;
  unregisterField: (fieldName: keyof TFormShape) =>
    UnregisterFieldAction<TRootFormsState, TFormShape>;
  setInitialValues: (values: Partial<TFormShape>) =>
    SetInitialValuesAction<TRootFormsState, TFormShape>;
}

// Create actions given form shape (Makes Typings work nicely)
export function getFormActions<TRootFormsState extends IFormReducerState> () {
  return <TFormName extends keyof TRootFormsState>(formName: TFormName):
  IFormActions<TRootFormsState, IFormValues<TRootFormsState[TFormName]>> => ({
    initForm: () => ({
      type: ActionConstants.INIT_FORM,
      payload: { formName }
    }),
    resetForm: () => ({
      type: ActionConstants.RESET_FORM,
      payload: { formName }
    }),
    destroyForm: () => ({
      type: ActionConstants.DESTROY_FORM,
      payload: { formName }
    }),
    focusField: (fieldName) => ({
      type: ActionConstants.FOCUS_FIELD,
      payload: { formName, fieldName }
    }),
    blurField: (fieldName) => ({
      type: ActionConstants.BLUR_FIELD,
      payload: { formName, fieldName }
    }),
    changeField: (fieldName, value) => ({
      type: ActionConstants.CHANGE_FIELD,
      payload: { formName, fieldName, value }
    }),
    updateFieldErrors: (errors) => ({
      type: ActionConstants.UPDATE_FIELD_ERRORS,
      payload: { formName, errors }
    }),
    registerField: (fieldName) => ({
      type: ActionConstants.REGISTER_FIELD,
      payload: { formName, fieldName }
    }),
    unregisterField: (fieldName) => ({
      type: ActionConstants.UNREGISTER_FIELD,
      payload: { formName, fieldName }
    }),
    setInitialValues: (values) => ({
      type: ActionConstants.SET_INITIAL_VALUES,
      payload: { formName, values }
    })
  });
}
