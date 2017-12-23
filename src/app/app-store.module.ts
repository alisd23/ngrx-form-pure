import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { formReducer, IFormState } from './ngrx-form';

export interface QueryFormShape {
  name: string;
  age: string;
}

export interface AppFormState {
  query: IFormState<QueryFormShape>;
}

export interface AppState {
  forms: AppFormState;
}

const reducers = {
  forms: formReducer
};

export const metaReducers = [storeLogger()];

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot(
      reducers,
      { metaReducers }
    )
  ]
})
export class AppStoreModule { }
