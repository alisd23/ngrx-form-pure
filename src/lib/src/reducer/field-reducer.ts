import { IFormFieldState, IFormReducerState } from '../types/index';
import { Actions, ActionConstants } from '../actions';

const initialState: IFormFieldState<any> = {
  value: undefined,
  focus: false,
  touched: false,
  error: undefined,
  count: 0
}

export function fieldReducer(
  state: IFormFieldState<any> = initialState,
  action: Actions<IFormReducerState, any>
): IFormFieldState<any> {
  switch (action.type) {
    case ActionConstants.REGISTER_FIELD: {
      return {
        ...initialState,
        count: state.count ? (state.count + 1) : 1
      };
    }
    case ActionConstants.UNREGISTER_FIELD: {
      return {
        ...state,
        count: state.count - 1
      } 
    }
    case ActionConstants.CHANGE_FIELD: {
      return {
        ...state,
        value: action.payload.value
      }
    }
    case ActionConstants.FOCUS_FIELD: {
      return {
        ...state,
        focus: true
      };
    }
    case ActionConstants.BLUR_FIELD: {
      return {
        ...state,
        focus: false,
        touched: true
      };
    }
    default: {
      return state;
    }
  }
}