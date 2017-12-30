import { NgModule } from '@angular/core';
import { FieldDirective, FormDirective } from './directives/index';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    FieldDirective,
    FormDirective
  ],
  imports: [
    EffectsModule.forRoot([])
  ],
  exports: [
    FieldDirective,
    FormDirective
  ]
})
export class NgrxFormModule { }
