import { IFormReducerState } from '../types';
import { Actions, ActionConstants } from '../actions';
import { formReducer } from './form-reducer';

/**
 * Top level reducer to handle all forms in the app
 * @param state - Top level forms state
 * @param action - action to handle
 */
export function rootReducer(
  state: IFormReducerState = {},
  action: Actions<IFormReducerState, any>
): IFormReducerState {
  switch (action.type) {
    case ActionConstants.DESTROY_FORM: {
      const { formName } = action.payload;
      const newState = { ...state };
      delete newState[formName];
      return newState;
    }
    case ActionConstants.INIT_FORM:
    case ActionConstants.RESET_FORM:
    case ActionConstants.REGISTER_FIELD:
    case ActionConstants.UNREGISTER_FIELD:
    case ActionConstants.UPDATE_FIELD_ERRORS:
    case ActionConstants.SET_INITIAL_VALUES:
    case ActionConstants.FOCUS_FIELD:
    case ActionConstants.BLUR_FIELD:
    case ActionConstants.CHANGE_FIELD:
    case ActionConstants.RESET_FIELD: {
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
