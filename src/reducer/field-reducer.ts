import { IFormFieldState, IFormReducerState } from '../types';
import {
  Actions, ActionConstants, RegisterFieldAction, UnregisterFieldAction, ResetFieldAction,
  ChangeFieldAction, FocusFieldAction
} from '../actions';
import { BlurFieldAction } from '../index';

const initialState: IFormFieldState<any> = {
  value: undefined,
  focus: false,
  touched: false,
  error: undefined,
  count: 0
}

/**
 * Registers a field. If the field is not already registered, set the fields state to
 * the default initial field state. Then increase the field count.
 * The count handles form elements which have multiple input elements for one form field,
 * E.g. a checkbox/radio button group
 * @param state - current state
 * @param action - registerField action to handle
 */
function registerFieldReducer(
  state: IFormFieldState<any> = initialState,
  action: RegisterFieldAction<IFormReducerState, any>
) {
  return {
    ...state,
    count: state.count + 1
  };
}

/**
 * Unregisters a field. Reduce the field count by 1.
 * If the current count is 1 this action is handled by the parent reducer,
 * as the field needs to be removed from state entirely.
 * @param state - current state
 * @param action - unregisterField action to handle
 */
function unregisterFieldReducer(
  state: IFormFieldState<any>,
  action: UnregisterFieldAction<IFormReducerState, any>
) {
  return {
    ...state,
    count: state.count - 1
  };
}

/**
 * Resets a fields state back to its initial values.
 * Maintain the field count as only the fields properties (touched, focus, value...)
 * need to be reset.
 * @param state - current state
 * @param action - resetField action to handle
 */
function resetFieldReducer(
  state: IFormFieldState<any>,
  action: ResetFieldAction<IFormReducerState, any>
) {
  const { value } = action.payload;
  return {
    ...initialState,
    count: state.count,
    value
  }
}

/**
 * Update a fields value.
 * @param state - current state
 * @param action - changeField action to handle
 */
function changeFieldReducer(
  state: IFormFieldState<any>,
  action: ChangeFieldAction<IFormReducerState, any>
) {
  return {
    ...state,
    value: action.payload.value
  }
}

/**
 * Set a fields focus state to true.
 * @param state - current state
 * @param action - focusField action to handle
 */
function focusFieldReducer(
  state: IFormFieldState<any>,
  action: FocusFieldAction<IFormReducerState, any>
) {
  return {
    ...state,
    focus: true
  };
}

/**
 * Called when a field is unfocused.
 * Field has now been 'touched', and 'focus' is set back to false.
 * @param state - current state
 * @param action - blurField action to handle
 */
function blurFieldReducer(
  state: IFormFieldState<any>,
  action: BlurFieldAction<IFormReducerState, any>
) {
  return {
    ...state,
    focus: false,
    touched: true
  };
}

/**
 * Warn that an action was dispatched for a field which hasn't been registered yet.
 * @param action - action to handle
 */
function warnFieldNotRegistered(action: Actions<IFormReducerState, any>) {
  const { formName } = action.payload;
  const fieldName = (action.payload as any).fieldName;
  let message = `[Form: ${formName}] Tried to modify a field which has not been registered yet`;

  if (fieldName) {
    message += ` (field: ${fieldName})`;
  }

  console.warn(message);
}

/**
 * Top level reducer for an individual field.
 * @param state - current state for the field
 * @param action - action to handle
 */
export function fieldReducer(
  state: IFormFieldState<any>,
  action: Actions<IFormReducerState, any>
): IFormFieldState<any> {
  // If an action is dispatched for a field which hasn't been registered yet, then this
  // is an error. Warn and do nothing.
  if (!state && action.type !== ActionConstants.REGISTER_FIELD) {
    warnFieldNotRegistered(action);
    return state;
  }

  switch (action.type) {
    case ActionConstants.REGISTER_FIELD:
      return registerFieldReducer(state, action);
    case ActionConstants.UNREGISTER_FIELD:
      return unregisterFieldReducer(state, action);
    case ActionConstants.RESET_FIELD:
      return resetFieldReducer(state, action);
    case ActionConstants.CHANGE_FIELD:
      return changeFieldReducer(state, action);
    case ActionConstants.FOCUS_FIELD:
      return focusFieldReducer(state, action);
    case ActionConstants.BLUR_FIELD:
      return blurFieldReducer(state, action);
    default: {
      return state;
    }
  }
}
