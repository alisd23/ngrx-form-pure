import { NgModule } from '@angular/core';
import { BasicFieldDirective, RadioFieldDirective, FormDirective } from './directives';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    BasicFieldDirective,
    RadioFieldDirective,
    FormDirective
  ],
  imports: [
    EffectsModule.forRoot([])
  ],
  exports: [
    BasicFieldDirective,
    RadioFieldDirective,
    FormDirective
  ]
})
export class NgrxFormModule { }
