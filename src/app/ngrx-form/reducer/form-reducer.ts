import { IFormReducerState, IFormState } from '../types';
import { Actions, ActionConstants } from '../actions';
import { fieldReducer } from './field-reducer';

export function formReducer(
  state: IFormState<any>,
  action: Actions<IFormReducerState, any>
): IFormState<any> {
  switch (action.type) {
    case ActionConstants.INIT: {
      const { formName } = action.payload;
      return {
        name: formName,
        hasErrors: false,
        fields: {}
      };
    }
    case ActionConstants.FOCUS:
    case ActionConstants.BLUR:
    case ActionConstants.REGISTER_FIELD:
    case ActionConstants.CHANGE: {
      const { fieldName } = action.payload;
      return {
        ...state,
        fields: {
          ...state.fields,
          [fieldName]: fieldReducer(state.fields[fieldName], action)
        }
      };
    }
    default: {
      return state;
    }
  }
}