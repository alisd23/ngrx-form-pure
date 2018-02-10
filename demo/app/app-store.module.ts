import { IFormState } from 'ngrx-form';
import { Colour, Band, Hobby, Genre } from './types';

export interface UserFormShape {
  name: string;
  age: string;
  colour: Colour;
  favouriteBand: Band;
  hobbies: Hobby[];
  terms: boolean;
  genres: Genre[];
}

export interface AppFormState {
  newUser: IFormState<UserFormShape>;
}

export interface AppState {
  form: AppFormState;
}
