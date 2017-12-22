import { IFormFieldState, IFormReducerState, IFormState } from '../types';
import { Actions } from '../actions';

export function fieldReducer(
  state: IFormFieldState<any>,
  action: Actions<IFormReducerState, any>
) {
  switch (action.type) {
    case '@ngrx-form/focus': {
      return {
        ...state,
        focus: true
      };
    }
    case '@ngrx-form/blur': {
      return {
        ...state,
        focus: false
      };
    }
    case '@ngrx-form/change': {
      return {
        ...state,
        value: action.payload.value
      };
    }
    default: {
      return state;
    }
  }
}