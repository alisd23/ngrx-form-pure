import { IFormReducerState, IFormState } from '../types';
import {
  Actions, ActionConstants, getFormActions, SetInitialValuesAction, InitFormAction, UpdateFieldErrorsAction,
  UnregisterFieldAction, ResetFormAction
} from '../actions';
import { fieldReducer } from './field-reducer';

/**
 * Initialises the form to the default state.
 * @param state - current state
 * @param action - initiForm action to handle
 */
function initFormReducer(
  state: IFormState<any>,
  action: InitFormAction<IFormReducerState>
) {
  const { formName } = action.payload;
  return {
    name: formName,
    fields: {},
    invalid: false,
  };
}

/**
 * Resets the form to its initial state, then sets form control values back to those stored
 * in the 'initialValues' field.
 * @param state - current state
 * @param action - resetForm action to handle
 */
function resetFormReducer(
  state: IFormState<any>,
  action: ResetFormAction<IFormReducerState>
) {
  const formActions = getFormActions<any>(action.payload.formName);
  const initialValues = state.initialValues || {};
  const fieldNames = Object.keys(state.fields);
  const fieldsState = { ...state.fields };

  for (const name of fieldNames) {
    // Reset each field and set initialValue (if there is one)
    fieldsState[name] = fieldReducer(
      state.fields[name],
      formActions.resetField(name, initialValues[name])
    );
  }

  return {
    ...state,
    fields: fieldsState,
    invalid: false
  };
}

/**
 * Set's the initial values for the fields. Updates each fields value to its initial values
 * and stores the 'initialValues' object at the form state level.
 * @param state - current state
 * @param action - setInitialValues action to handle
 */
function setInitialValuesReducer(
  state: IFormState<any>,
  action: SetInitialValuesAction<IFormReducerState, any>
) {
  const formActions = getFormActions<any>(action.payload.formName);
  const { values } = action.payload;
  const fieldNames = Object.keys(values);
  const fieldsState = { ...state.fields };

  for (const name of fieldNames) {
    // Don't set the value for any non-registered fields
    if (!state.fields[name]) {
      continue;
    }

    // Reuse CHANGE_FIELD action in field reducer to set field value to the initial value
    fieldsState[name] = fieldReducer(
      state.fields[name],
      formActions.changeField(name, values[name])
    );
  }

  return {
    ...state,
    fields: fieldsState,
    initialValues: values
  }
}

/**
 * Sets the error state value for ALL the fields in the form. If a field is not included
 * in the payload errors object, its error will be set to 'undefined'.
 * @param state - current state
 * @param action - updateFieldErrors action to handle
 */
function updateFieldErrorsReducer(
  state: IFormState<any>,
  action: UpdateFieldErrorsAction<IFormReducerState, any>
) {
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
    invalid: Object
      .keys(errors)
      .some(fieldName => Boolean(errors[fieldName])),
    fields
  };
}

/**
 * Removes a field from the form. This is needed because in dynamic forms, form fields
 * should be able to be dynamically added and removed without keeping any stale field state
 * in the form
 * @param state - current state
 * @param action - unregisterField action to handle
 */
function unregisterFieldReducer(
  state: IFormState<any>,
  action: UnregisterFieldAction<IFormReducerState, any>
) {
  const { fieldName } = action.payload;
  if (state.fields[fieldName].count <= 1) {
    const newState = {
      ...state,
      fields: {
        ...state.fields
      }
    }
    delete newState.fields[fieldName];
    return newState;
  } else {
    return {
      ...state,
      fields: {
        ...state.fields,
        [fieldName]: fieldReducer(state.fields[fieldName], action)
      }
    };
  }
}

/**
 * Top level reducer for an individual form.
 * @param state - current state for the form
 * @param action - action to handle
 */
export function formReducer(
  state: IFormState<any>,
  action: Actions<IFormReducerState, any>
): IFormState<any> {
  switch (action.type) {
    case ActionConstants.INIT_FORM:
      return initFormReducer(state, action);
    case ActionConstants.RESET_FORM:
      return resetFormReducer(state, action);
    case ActionConstants.SET_INITIAL_VALUES:
      return setInitialValuesReducer(state, action);
    case ActionConstants.UPDATE_FIELD_ERRORS:
      return updateFieldErrorsReducer(state, action);
    case ActionConstants.UNREGISTER_FIELD:
      return unregisterFieldReducer(state, action);
    case ActionConstants.CHANGE_FIELD:
    case ActionConstants.FOCUS_FIELD:
    case ActionConstants.REGISTER_FIELD:
    case ActionConstants.BLUR_FIELD: {
      const { fieldName } = action.payload;
      return {
        ...state,
        fields: {
          ...state.fields,
          [fieldName]: fieldReducer(state.fields[fieldName], action)
        }
      };
    }
    default:
      return state;
  }
}
