import { formReducer, getFormActions, IFormState, IFormReducerState, IFormFieldState, IFormValues, IFieldErrors } from '../index';
import immer from 'immer';

interface TestFormShape {
  name: string;
  age: string;
}

interface RootFormsState extends IFormReducerState {
  test?: IFormState<TestFormShape>;
}

const TEST_FORM_NAME = 'test';

describe('reducer', () => {
  let state: RootFormsState = {};
  const formActions = getFormActions<RootFormsState>(TEST_FORM_NAME);

  // Initialise form
  describe('INIT action', () => {
    it('Creates a new form object in state', () => {
      const expected: RootFormsState = {
        test: {
          name: TEST_FORM_NAME,
          fields: {},
          invalid: false
        }
      }

      state = formReducer(state, formActions.initForm());
      expect(state).toEqual(expected);
    });
  });

  // Register fields
  describe('REGISTER_FIELD action', () => {
    const initialField: IFormFieldState<any, any> = {
      value: undefined,
      focus: false,
      touched: false,
      error: undefined,
      count: 0
    }

    it('Register a new "name" field', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.name = {
          ...initialField,
          count: 1
        };
      });

      state = formReducer(state, formActions.registerField('name'));
      expect(state).toEqual(expected);
    });

    it('Register a second "name" field', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.name.count = 2;
      });

      state = formReducer(state, formActions.registerField('name'));
      expect(state).toEqual(expected);
    });

    it('Register a new "age" field', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.age = {
          ...initialField,
          count: 1
        };
      });

      state = formReducer(state, formActions.registerField('age'));
      expect(state).toEqual(expected);
    });
  });

  // Set intitial field values
  describe('SET_INITIAL_VALUES action', () => {
    it('Sets values correctly', () => {
      const values: Partial<TestFormShape> = {
        name: 'John'
      }
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.initialValues = values;
        draftState.test.fields.name.value = values.name;
      });

      state = formReducer(state, formActions.setInitialValues(values));
      expect(state).toEqual(expected);
    });
  });

  // Update field errors
  describe('UPDATE_FIELD_ERRORS action', () => {
    it('Sets errors correctly', () => {
      const errors: IFieldErrors<TestFormShape> = {
        age: 'Age is required'
      };
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.invalid = true;
        draftState.test.fields.age.error = errors.age;
      });
  
      state = formReducer(state, formActions.updateFieldErrors(errors));
      expect(state).toEqual(expected);
    });
  });

  // Focus field
  describe('FOCUS action', () => {
    it('Focus "name" and "age" sets focus property correctly', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.age.focus = true;
        draftState.test.fields.name.focus = true;
      });
  
      state = formReducer(state, formActions.focusField('name'));
      state = formReducer(state, formActions.focusField('age'));
      expect(state).toEqual(expected);
    });
  });

  // Change field

  // Blur field
});