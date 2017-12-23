import { NgModule } from '@angular/core';
import { FieldDirective, FormDirective } from './directives';
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
  ],
  providers: []
})
export class NgrxFormModule { }
