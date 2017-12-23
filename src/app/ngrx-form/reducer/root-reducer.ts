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
