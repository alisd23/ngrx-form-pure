import { IFormState, IFormReducerState } from 'ngrx-form';
import { Colour, Band, Hobby, Genre } from './enums';

// =========================//
//       State Typings      //
// =========================//

export interface UserFormShape {
  name: string;
  age: string;
  colour: Colour;
  favouriteBand: Band;
  hobbies: Hobby[];
  terms: boolean;
  genres: Genre[];
}

// Need to extend IFormReducerState to appease TypeScript when this type is passed
// in as a generic parameter (e.g. in getFormActions<AppFormState>)
export interface AppFormState extends IFormReducerState {
  newUser: IFormState<UserFormShape>;
}

export interface AppState {
  form: AppFormState;
}
