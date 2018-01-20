import { IFormState } from 'ngrx-form';
import { Colour, Band, Hobby, Genre } from './types';

export interface QueryFormShape {
  name: string;
  age: string;
  colour: Colour;
  favouriteBand: Band;
  hobbies: Hobby[];
  terms: boolean;
  genres: Genre[];
}

export interface AppFormState {
  query: IFormState<QueryFormShape>;
}

export interface AppState {
  form: AppFormState;
}
