import { IFormFieldState, IFormReducerState } from '../types';
import { Actions, ActionConstants } from '../actions';

const initialState = {
  focus: false
}

export function fieldReducer(
  state: IFormFieldState<any>,
  action: Actions<IFormReducerState, any>
): IFormFieldState<any> {
  switch (action.type) {
    case ActionConstants.REGISTER_FIELD: {
      return {
        ...initialState,
        value: action.payload.initialValue
      };
    }
    case ActionConstants.FOCUS: {
      return {
        ...state,
        focus: true
      };
    }
    case ActionConstants.BLUR: {
      return {
        ...state,
        focus: false
      };
    }
    case ActionConstants.CHANGE: {
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