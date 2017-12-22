import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Store } from '@ngrx/store';
import { FieldDirective, FormDirective } from './directives';

@NgModule({
  declarations: [
    FieldDirective,
    FormDirective
  ],
  exports: [
    FieldDirective,
    FormDirective
  ],
  providers: []
})
export class NgrxFormModule { }
