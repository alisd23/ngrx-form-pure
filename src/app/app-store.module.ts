import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule, ActionReducer } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { formReducer, NgrxFormModule, FormState } from './ngrx-form';
import { AppComponent } from './app.component';
import { QueryComponent } from './query/query.component';

export interface QueryFormShape {
  name: string;
  age: number;
}

export interface AppFormState {
  query: FormState<QueryFormShape>;
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
