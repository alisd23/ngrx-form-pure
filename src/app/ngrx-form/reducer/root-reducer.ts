import { IFormReducerState } from '../types';
import { Actions, ActionConstants } from '../actions';
import { formReducer } from './form-reducer';

export function rootReducer(
  state: IFormReducerState = {},
  action: Actions<IFormReducerState, any>
): IFormReducerState {
  switch (action.type) {
    case ActionConstants.DESTROY: {
      const { formName } = action.payload;
      return {
        ...state,
        [formName]: undefined
      };
    }
    case ActionConstants.INIT:
    case ActionConstants.REGISTER_FIELD:
    case ActionConstants.UPDATE_FIELD_ERRORS:
    case ActionConstants.SET_INITIAL_VALUES:
    case ActionConstants.FOCUS:
    case ActionConstants.BLUR:
    case ActionConstants.CHANGE: {
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
