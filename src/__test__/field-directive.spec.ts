import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import {
  FieldDirective, ActionConstants
} from '../index';

import { TestComponent } from './util/test.component';
import { ITestAction, FORM_NAME } from './util/types';
import { setup } from './util/setup';
import { StoreMock } from './mock/store-mock';

describe('Field directive [ngrxField]', () => {
  let fieldDirective: FieldDirective;
  let store: StoreMock;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let actions$: Subject<ITestAction>;

  beforeEach(async(() => {
    actions$ = new Subject();
    setup(actions$);
  }));

  function setupTest() {
    fixture = TestBed.createComponent(TestComponent);
    debugElement = fixture.debugElement.query(By.directive(FieldDirective));
    fieldDirective = debugElement.injector.get(FieldDirective);
    store = debugElement.injector.get(Store) as any;
  }

  it('should create directive', () => {
    setupTest();
    expect(fieldDirective).toBeTruthy();
  });

  it('fires REGISTER_FIELD actions at correct point in lifecycle', () => {
    setupTest();
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    const nameRegisterAction: ITestAction = {
      type: ActionConstants.REGISTER_FIELD,
      payload: {
        formName: FORM_NAME,
        fieldName: 'name'
      }
    };
    const ageRegisterAction: ITestAction = {
      type: ActionConstants.REGISTER_FIELD,
      payload: {
        formName: FORM_NAME,
        fieldName: 'age'
      }
    };

    // 1 FORM_INIT action, 2 REGISTER_FIELD action
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy.calls.argsFor(1)).toEqual([nameRegisterAction]);
    expect(dispatchSpy.calls.argsFor(2)).toEqual([ageRegisterAction]);
  });
});
