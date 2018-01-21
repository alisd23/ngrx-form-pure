import { IFormState, Actions } from '../../index';

export const FORM_NAME = 'test';

export interface TestFormShape {
  name: string;
  age: string;
}

export type TestFormState = IFormState<TestFormShape>;

export interface RootState {
  form: {
    test?: TestFormState
  }
}

export type TestAction = Actions<RootState['form'], TestFormShape>;
