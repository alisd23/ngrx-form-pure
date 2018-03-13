import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgrxFormModule } from 'ngrx-form';
import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, ActionReducer } from '@ngrx/store';
import * as hljs from 'highlight.js';
import { HighlightJsModule, HIGHLIGHT_JS } from 'angular-highlight-js';

import { AppState } from './types';
import { AppComponent } from './app.component';
import { UserFormComponent } from './user-form/user-form.component';
import { GenreMultiselectComponent } from './genre-multiselect/genre-multiselect.component';

export function logger(reducer: ActionReducer<any>): any {
  // default, no options
  return storeLogger()(reducer);
}

export const metaReducers = [logger];

@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    GenreMultiselectComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(
      {},
      { metaReducers }
    ),
    NgrxFormModule,
    HighlightJsModule.forRoot({
      provide: HIGHLIGHT_JS,
      useFactory: () => hljs
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
