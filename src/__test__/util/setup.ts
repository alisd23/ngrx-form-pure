import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { Store, ActionsSubject } from '@ngrx/store';

import { TestComponent } from './test.component';
import { StoreMock } from '../mock/store-mock';
import { FORM_NAME } from './types';

import {
  FormDirective, FieldDirective
} from '../../index';

export function setup(actions$: Subject<any>) {
  TestBed.configureTestingModule({
    declarations: [
      TestComponent,
      FormDirective,
      FieldDirective
    ],
    providers: [
      { provide: Store, useFactory: () => new StoreMock() },
      { provide: ActionsSubject, useFactory: () => actions$ }
    ]
  })
  .compileComponents();
}

export function createRootState(formState: any) {
  return {
    form: {
      [FORM_NAME]: formState
    }
  };
}
