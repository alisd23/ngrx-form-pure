import { FormFieldState, FormReducerState } from './types';
import { Actions } from './form-actions';

const initialiseField = (value): FormFieldState<any> => ({
  value,
  focus: false
});

export function formReducer<S extends FormReducerState>(
  state: S = {} as S,
  action: Actions<S, any>
) {
  switch (action.type) {
    case '@ngrx-form/init': {
      const { formName, initialState } = action.payload;
      return {
        ...(state as object),
        [formName]: Object
          .keys(initialState)
          .reduce((result, fieldName) => ({
            ...result,
            [fieldName]: initialiseField(initialState[fieldName])
          }), {})
      };
    }
    case '@ngrx-form/destroy': {
      const { formName } = action.payload;
      return {
        ...(state as object),
        [formName]: undefined
      };
    }
    case '@ngrx-form/focus': {
      const { formName, fieldName } = action.payload;
      return {
        ...(state as object),
        [formName]: {
          ...(state[formName] as object),
          [fieldName]: {
            ...(state[formName][fieldName] as object),
            focus: true
          }
        }
      };
    }
    case '@ngrx-form/blur': {
      const { formName, fieldName } = action.payload;
      return {
        ...(state as object),
        [formName]: {
          ...(state[formName] as object),
          [fieldName]: {
            ...(state[formName][fieldName] as object),
            focus: false
          }
        }
      };
    }
    case '@ngrx-form/change': {
      const { formName, fieldName, value } = action.payload;
      return {
        ...(state as object),
        [formName]: {
          ...(state[formName] as object),
          [fieldName]: {
            ...(state[formName][fieldName] as object),
            value
          }
        }
      };
    }
    default: {
      return state;
    }
  }
}
