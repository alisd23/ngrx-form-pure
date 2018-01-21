import { IFormState, Actions } from '../../index';

export const FORM_NAME = 'test';

export interface ITestFormShape {
  name: string;
  age: string;
}

export type TestFormState = IFormState<ITestFormShape>;

export interface IRootState {
  form: {
    test?: TestFormState
  }
}

export type ITestAction = Actions<IRootState['form'], ITestFormShape>;
