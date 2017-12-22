import { IFormFieldState, IFormReducerState, IFormState } from '../types';
import { Actions } from '../actions';
import { fieldReducer } from './field-reducer';

const initialiseField = (value): IFormFieldState<any> => ({
  value,
  focus: false
});

export function formReducer(
  state: IFormState<any>,
  action: Actions<IFormReducerState, any>
) {
  switch (action.type) {
    case '@ngrx-form/init': {
      const { formName, initialState } = action.payload;
      return {
        name: formName,
        hasErrors: false,
        controls: Object
          .keys(initialState)
          .reduce((result, fieldName) => ({
            ...result,
            [fieldName]: initialiseField(initialState[fieldName])
          }), {})
      };
    }
    case '@ngrx-form/focus':
    case '@ngrx-form/blur':
    case '@ngrx-form/change': {
      const { fieldName } = action.payload;
      return {
        ...state,
        controls: {
          ...state.controls,
          [fieldName]: fieldReducer(state.controls[fieldName], action)
        }
      };
    }
    default: {
      return state;
    }
  }
}