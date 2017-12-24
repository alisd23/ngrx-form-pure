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
        fields: {},
        hasErrors: false,
      };
    }
    case ActionConstants.UPDATE_FIELD_ERRORS: {
      // Includes the new error state for ALL fields in the form
      // undefined = no error
      const { errors } = action.payload;
      const fields = { ...state.fields };
      const fieldNames = Object.keys(state.fields);

      for (const name of fieldNames) {
        fields[name] = {
          ...fields[name],
          error: errors[name]
        }
      }

      return {
        ...state,
        // At least one of the fields has a truthy value in the incoming errors obejct
        hasErrors: Object
          .keys(errors)
          .some(fieldName => Boolean(errors[fieldName])),
        fields
      };
    }
    case ActionConstants.CHANGE:
    case ActionConstants.FOCUS:
    case ActionConstants.REGISTER_FIELD:
    case ActionConstants.BLUR: {
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