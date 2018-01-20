import { NgModule, ModuleWithProviders, Optional } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { formReducer } from './reducer';
import { FieldDirective, FormDirective } from './directives';

@NgModule({
  declarations: [
    FieldDirective,
    FormDirective
  ],
  imports: [
    StoreModule.forFeature('form', formReducer)
  ],
  exports: [
    FieldDirective,
    FormDirective
  ]
})
export class NgrxFormModule {}
