import { Action } from '@ngrx/store';
import { IFormReducerState, IFormState, IFieldErrors, IFormValues } from './types/index';

// ========================= //
//        ACTION TYPES       //
// ========================= //

export enum ActionConstants {
  INIT = '@ngrx-form/init',
  DESTROY = '@ngrx-form/destroy',
  FOCUS = '@ngrx-form/focus',
  BLUR = '@ngrx-form/blur',
  CHANGE = '@ngrx-form/change',
  UPDATE_FIELD_ERRORS = '@ngrx-form/update-field-errors',
  REGISTER_FIELD = '@ngrx-form/register-field',
  UNREGISTER_FIELD = '@ngrx-form/unregister-field',
  SET_INITIAL_VALUES = '@ngrx-form/set-initial-values'
}

export interface InitFormAction<RootState> extends Action {
  type: ActionConstants.INIT;
  payload: {
    formName: keyof RootState;
  };
}

export interface DestroyFormAction<RootState> extends Action {
  type: ActionConstants.DESTROY;
  payload: { formName: keyof RootState };
}

export interface FocusFieldAction<RootState, FormShape> extends Action {
  type: ActionConstants.FOCUS;
  payload: {
    formName: keyof RootState;
    fieldName: keyof FormShape;
  };
}

export interface BlurFieldAction<RootState, FormShape> extends Action {
  type: ActionConstants.BLUR;
  payload: {
    formName: keyof RootState;
    fieldName: keyof FormShape;
  };
}

export interface ChangeFieldAction<RootState, FormShape> extends Action {
  type: ActionConstants.CHANGE;
  payload: {
    formName: keyof RootState;
    fieldName: keyof FormShape;
    value?: any;
  };
}

export interface UpdateFieldErrors<RootState, FormShape> extends Action {
  type: ActionConstants.UPDATE_FIELD_ERRORS;
  payload: {
    formName: keyof RootState;
    errors: IFieldErrors<FormShape>;
  }
}

export interface RegisterFieldAction<RootState, FormShape> extends Action {
  type: ActionConstants.REGISTER_FIELD;
  payload: {
    formName: keyof RootState;
    fieldName: keyof FormShape;
  }
}

export interface UnregisterFieldAction<RootState, FormShape> extends Action {
  type: ActionConstants.UNREGISTER_FIELD;
  payload: {
    formName: keyof RootState;
    fieldName: keyof FormShape;
  }
}

export interface SetInitialValuesAction<RootState, FormShape> extends Action {
  type: ActionConstants.SET_INITIAL_VALUES;
  payload: {
    formName: keyof RootState;
    values: FormShape
  }
}

export type Actions<S extends IFormReducerState, F extends IFormState<any>> =
  InitFormAction<S> |
  DestroyFormAction<S> |
  FocusFieldAction<S, F> |
  BlurFieldAction<S, F> |
  ChangeFieldAction<S, F> |
  UpdateFieldErrors<S, F> |
  RegisterFieldAction<S, F> |
  UnregisterFieldAction<S, F> |
  SetInitialValuesAction<S, F>;

  
// ========================= //
//        ACTION CREATORS    //
// ========================= //

export interface FormActions<RootState, FormShape> {
  initForm: () =>
    InitFormAction<RootState>;
  destroyForm: () =>
    DestroyFormAction<RootState>;
  focusField: (fieldName: keyof FormShape) =>
    FocusFieldAction<RootState, FormShape>;
  blurField: (fieldName: keyof FormShape) =>
    BlurFieldAction<RootState, FormShape>;
  changeField: (fieldName: keyof FormShape, value: any) =>
    ChangeFieldAction<RootState, FormShape>;
  updateFieldErrors: (errors: IFieldErrors<Partial<FormShape>>) =>
    UpdateFieldErrors<RootState, FormShape>
  registerField: (fieldName: keyof FormShape) =>
    RegisterFieldAction<RootState, FormShape>;
  unregisterField: (fieldName: keyof FormShape) =>
    UnregisterFieldAction<RootState, FormShape>;
  setInitialValues: (values: Partial<FormShape>) =>
    SetInitialValuesAction<RootState, FormShape>;
}

// Create actions given form shape (Makes Typings work nicely)
export function getFormActions<RootFormsState extends any>(formName: keyof RootFormsState):
  FormActions<RootFormsState, IFormValues<RootFormsState[keyof RootFormsState]>> {
  return {
    initForm: () => ({
      type: ActionConstants.INIT,
      payload: { formName }
    }),
    destroyForm: () => ({
      type: ActionConstants.DESTROY,
      payload: { formName }
    }),
    focusField: (fieldName) => ({
      type: ActionConstants.FOCUS,
      payload: { formName, fieldName }
    }),
    blurField: (fieldName) => ({
      type: ActionConstants.BLUR,
      payload: { formName, fieldName }
    }),
    changeField: (fieldName, value) => ({
      type: ActionConstants.CHANGE,
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
