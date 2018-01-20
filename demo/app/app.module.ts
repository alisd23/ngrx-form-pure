import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgrxFormModule } from 'ngrx-form';
import { storeLogger } from 'ngrx-store-logger';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { QueryComponent } from './query/query.component';
import { GenreMultiselectComponent } from './genre-multiselect/genre-multiselect.component';

export const metaReducers = [storeLogger()];

@NgModule({
  declarations: [
    AppComponent,
    QueryComponent,
    GenreMultiselectComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(
      {},
      { metaReducers }
    ),
    NgrxFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
