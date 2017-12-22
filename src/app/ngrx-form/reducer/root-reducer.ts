import { IFormFieldState, IFormReducerState } from '../types';
import { Actions } from '../actions';
import { formReducer } from './form-reducer';

export function rootReducer(
  state: IFormReducerState = {},
  action: Actions<IFormReducerState, any>
) {
  switch (action.type) {
    case '@ngrx-form/destroy': {
      const { formName } = action.payload;
      return {
        ...state,
        [formName]: undefined
      };
    }
    case '@ngrx-form/init':
    case '@ngrx-form/focus':
    case '@ngrx-form/blur':
    case '@ngrx-form/change': {
      const { formName } = action.payload;
      return {
        ...state,
        [formName]: formReducer(state[formName], action)
      };
    }
    default: {
      return state;
    }
  }
}
