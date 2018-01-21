import { Action } from '@ngrx/store';

import { IFormReducerState, IFormState, IFieldErrors, IFormValues } from './types';

// ========================= //
//        ACTION TYPES       //
// ========================= //

export enum ActionConstants {
  INIT_FORM = '@ngrx-form/init',
  DESTROY_FORM = '@ngrx-form/destroy',
  FOCUS_FIELD = '@ngrx-form/focus',
  BLUR_FIELD = '@ngrx-form/blur',
  CHANGE_FIELD = '@ngrx-form/change',
  UPDATE_FIELD_ERRORS = '@ngrx-form/update-field-errors',
  REGISTER_FIELD = '@ngrx-form/register-field',
  UNREGISTER_FIELD = '@ngrx-form/unregister-field',
  SET_INITIAL_VALUES = '@ngrx-form/set-initial-values'
}

export interface InitFormAction<RootFormsState> extends Action {
  type: ActionConstants.INIT_FORM;
  payload: {
    formName: keyof RootFormsState;
  };
}

export interface DestroyFormAction<RootFormsState> extends Action {
  type: ActionConstants.DESTROY_FORM;
  payload: { formName: keyof RootFormsState };
}

export interface FocusFieldAction<RootFormsState, FormShape> extends Action {
  type: ActionConstants.FOCUS_FIELD;
  payload: {
    formName: keyof RootFormsState;
    fieldName: keyof FormShape;
  };
}

export interface BlurFieldAction<RootFormsState, FormShape> extends Action {
  type: ActionConstants.BLUR_FIELD;
  payload: {
    formName: keyof RootFormsState;
    fieldName: keyof FormShape;
  };
}

export interface ChangeFieldAction<RootFormsState, FormShape> extends Action {
  type: ActionConstants.CHANGE_FIELD;
  payload: {
    formName: keyof RootFormsState;
    fieldName: keyof FormShape;
    value?: any;
  };
}

export interface UpdateFieldErrors<RootFormsState, FormShape> extends Action {
  type: ActionConstants.UPDATE_FIELD_ERRORS;
  payload: {
    formName: keyof RootFormsState;
    errors: IFieldErrors<FormShape>;
  }
}

export interface RegisterFieldAction<RootFormsState, FormShape> extends Action {
  type: ActionConstants.REGISTER_FIELD;
  payload: {
    formName: keyof RootFormsState;
    fieldName: keyof FormShape;
  }
}

export interface UnregisterFieldAction<RootFormsState, FormShape> extends Action {
  type: ActionConstants.UNREGISTER_FIELD;
  payload: {
    formName: keyof RootFormsState;
    fieldName: keyof FormShape;
  }
}

export interface SetInitialValuesAction<RootFormsState, FormShape> extends Action {
  type: ActionConstants.SET_INITIAL_VALUES;
  payload: {
    formName: keyof RootFormsState;
    values: Partial<FormShape>;
  }
}

export type Actions<RootFormsState extends IFormReducerState, FormShape> =
  InitFormAction<RootFormsState> |
  DestroyFormAction<RootFormsState> |
  FocusFieldAction<RootFormsState, FormShape> |
  BlurFieldAction<RootFormsState, FormShape> |
  ChangeFieldAction<RootFormsState, FormShape> |
  UpdateFieldErrors<RootFormsState, FormShape> |
  RegisterFieldAction<RootFormsState, FormShape> |
  UnregisterFieldAction<RootFormsState, FormShape> |
  SetInitialValuesAction<RootFormsState, FormShape>;


// ========================= //
//        ACTION CREATORS    //
// ========================= //

export interface FormActions<RootFormsState, FormShape> {
  initForm: () =>
    InitFormAction<RootFormsState>;
  destroyForm: () =>
    DestroyFormAction<RootFormsState>;
  focusField: (fieldName: keyof FormShape) =>
    FocusFieldAction<RootFormsState, FormShape>;
  blurField: (fieldName: keyof FormShape) =>
    BlurFieldAction<RootFormsState, FormShape>;
  changeField: (fieldName: keyof FormShape, value: any) =>
    ChangeFieldAction<RootFormsState, FormShape>;
  updateFieldErrors: (errors: IFieldErrors<Partial<FormShape>>) =>
    UpdateFieldErrors<RootFormsState, FormShape>
  registerField: (fieldName: keyof FormShape) =>
    RegisterFieldAction<RootFormsState, FormShape>;
  unregisterField: (fieldName: keyof FormShape) =>
    UnregisterFieldAction<RootFormsState, FormShape>;
  setInitialValues: (values: Partial<FormShape>) =>
    SetInitialValuesAction<RootFormsState, FormShape>;
}

// Create actions given form shape (Makes Typings work nicely)
export function getFormActions<RootFormsState extends any>(formName: keyof RootFormsState):
  FormActions<RootFormsState, IFormValues<RootFormsState[keyof RootFormsState]>> {
  return {
    initForm: () => ({
      type: ActionConstants.INIT_FORM,
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
  };
}
