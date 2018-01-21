import { formReducer, getFormActions, IFormFieldState, IFieldErrors } from '../index';
import immer from 'immer';

import { TestFormShape, RootState } from './util/types';

type RootFormsState = RootState['form'];

const TEST_FORM_NAME = 'test';

describe('reducer', () => {
  let state: RootFormsState = {};
  const formActions = getFormActions<RootFormsState>('test');

  // Initialise form
  describe('INIT_FORM action', () => {
    it('Creates a new form object in state', () => {
      const expected: RootFormsState = {
        test: {
          name: TEST_FORM_NAME,
          fields: {},
          invalid: false
        }
      }

      state = formReducer(state as any, formActions.initForm());
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

      state = formReducer(state as any, formActions.registerField('name'));
      expect(state).toEqual(expected);
    });

    it('Register a second "name" field', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.name.count = 2;
      });

      state = formReducer(state as any, formActions.registerField('name'));
      expect(state).toEqual(expected);
    });

    it('Register a new "age" field', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.age = {
          ...initialField,
          count: 1
        };
      });

      state = formReducer(state as any, formActions.registerField('age'));
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

      state = formReducer(state as any, formActions.setInitialValues(values));
      expect(state).toEqual(expected);
    });
  });

  // Update field errors
  describe('UPDATE_FIELD_ERRORS action', () => {
    it('Sets state correctly when errors exist', () => {
      const errors: IFieldErrors<TestFormShape> = {
        age: 'Age is required'
      };
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.invalid = true;
        draftState.test.fields.age.error = errors.age;
      });

      state = formReducer(state as any, formActions.updateFieldErrors(errors));
      expect(state).toEqual(expected);
    });

    it('Sets state correctly when no errors are present', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.invalid = false;
        draftState.test.fields.age.error = undefined;
      });

      state = formReducer(state as any, formActions.updateFieldErrors({}));
      expect(state).toEqual(expected);
    });
  });

  // Focus field
  describe('FOCUS_FIELD action', () => {
    it('Focus "name" sets focus property correctly', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.name.focus = true;
      });

      state = formReducer(state as any, formActions.focusField('name'));
      expect(state).toEqual(expected);
    });

    it('Focus "age" sets focus property correctly', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.age.focus = true;
      });

      state = formReducer(state as any, formActions.focusField('age'));
      expect(state).toEqual(expected);
    });
  });

  // Change field
  describe('CHANGE_FIELD action', () => {
    it('Changing "name" sets value correctly', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.name.value = 'John Smith';
      });

      state = formReducer(state as any, formActions.changeField('name', 'John Smith'));
      expect(state).toEqual(expected);
    });

    it('Changing "age" sets value correctly', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.age.value = '31';
      });

      state = formReducer(state as any, formActions.changeField('age', '31'));
      expect(state).toEqual(expected);
    });
  });

  // Blur field
  describe('FOCUS_FIELD action', () => {
    it('Blur "name" updates state correctly', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.name.focus = false;
        draftState.test.fields.name.touched = true;
      });

      state = formReducer(state as any, formActions.blurField('name'));
      expect(state).toEqual(expected);
    });
    it('Blur "age" updates state correctly', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.age.focus = false;
        draftState.test.fields.age.touched = true;
      });

      state = formReducer(state as any, formActions.blurField('age'));
      expect(state).toEqual(expected);
    });
  });

  // Unregister fields
  describe('UNREGISTER_FIELD action', () => {
    it('Unregistering "name" reduces count', () => {
      const expected: RootFormsState = immer(state, draftState => {
        draftState.test.fields.name.count = 1;
      });

      state = formReducer(state as any, formActions.unregisterField('name'));
      expect(state).toEqual(expected);
    })

    it('Unregistering "name" again removes it from state', () => {
      const expected: RootFormsState = immer(state, draftState => {
        delete draftState.test.fields.name;
      });

      state = formReducer(state as any, formActions.unregisterField('name'));
      expect(state).toEqual(expected);
    })

    it('Unregistering "age" removes it from state', () => {
      const expected: RootFormsState = immer(state, draftState => {
        delete draftState.test.fields.age;
      });

      state = formReducer(state as any, formActions.unregisterField('age'));
      expect(state).toEqual(expected);
    })
  });

  // Destroy form
  describe('DESTROY_FORM action', () => {
    it('Destroying "test" form removes it from state', () => {
      const expected: RootFormsState = {};
      state = formReducer(state as any, formActions.destroyForm());
      expect(state).toEqual(expected);
    })
  })
});
