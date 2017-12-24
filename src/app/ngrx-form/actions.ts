import { Action } from '@ngrx/store';
import { IFormReducerState, IFormState, IFormValues, IFieldErrors } from './types';

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
  REGISTER_FIELD = '@ngrx-form/register-field'
}

interface InitFormAction<RootState> extends Action {
  type: ActionConstants.INIT;
  payload: {
    formName: keyof RootState;
  };
}

interface DestroyAction<RootState> extends Action {
  type: ActionConstants.DESTROY;
  payload: { formName: keyof RootState };
}

interface FocusFieldAction<RootState, FormState> extends Action {
  type: ActionConstants.FOCUS;
  payload: {
    formName: keyof RootState;
    fieldName: keyof FormState;
  };
}

interface BlurFieldAction<RootState, FormState> extends Action {
  type: ActionConstants.BLUR;
  payload: {
    formName: keyof RootState;
    fieldName: keyof FormState;
  };
}

interface ChangeFieldAction<RootState, FormState> extends Action {
  type: ActionConstants.CHANGE;
  payload: {
    formName: keyof RootState;
    fieldName: keyof FormState;
    value?: any;
  };
}

interface UpdateFieldErrors<RootState, FormShape extends IFormValues<any>> extends Action {
  type: ActionConstants.UPDATE_FIELD_ERRORS;
  payload: {
    formName: keyof RootState;
    errors: IFieldErrors<FormShape>;
  }
}

interface RegisterFieldAction<RootState, FormShape extends IFormValues<any>> extends Action {
  type: ActionConstants.REGISTER_FIELD;
  payload: {
    formName: keyof RootState;
    fieldName: keyof FormShape
    initialValue?: FormShape[keyof FormShape];
  }
}

export type Actions<S extends IFormReducerState, F extends IFormState<any>> =
  InitFormAction<S> |
  DestroyAction<S> |
  FocusFieldAction<S, F> |
  BlurFieldAction<S, F> |
  ChangeFieldAction<S, F> |
  UpdateFieldErrors<S, F> |
  RegisterFieldAction<S, F>;

  
// ========================= //
//        ACTION CREATORS    //
// ========================= //

export interface FormActions<RootState, FormShape> {
  initForm: () =>
    InitFormAction<RootState>;
  destroyForm: () =>
    DestroyAction<RootState>;
  focusField: (fieldName: keyof FormShape) =>
    FocusFieldAction<RootState, FormShape>;
  blurField: (fieldName: keyof FormShape) =>
    BlurFieldAction<RootState, FormShape>;
  changeField: (fieldName: keyof FormShape, value: any) =>
    ChangeFieldAction<RootState, FormShape>;
  updateFieldErrors: (errors: IFieldErrors<Partial<FormShape>>) =>
    UpdateFieldErrors<RootState, FormShape>
  registerField: (fieldName: keyof FormShape, initialValue?: any) =>
    RegisterFieldAction<RootState, FormShape>;
}

// Create actions given form shape (Makes Typings work nicely)
export function getFormActions<RootShape extends any>(formName: keyof RootShape):
  FormActions<RootShape, RootShape[keyof RootShape]> {
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
    registerField: (fieldName, initialValue) => ({
      type: ActionConstants.REGISTER_FIELD,
      payload: { formName, fieldName, initialValue }
    })
  };
}
