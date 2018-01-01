import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgrxFormModule } from 'ngrx-form';
import { AppComponent } from './app.component';
import { QueryComponent } from './query/query.component';
import { AppStoreModule } from './app-store.module';

@NgModule({
  declarations: [
    AppComponent,
    QueryComponent
  ],
  imports: [
    BrowserModule,
    AppStoreModule,
    NgrxFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }