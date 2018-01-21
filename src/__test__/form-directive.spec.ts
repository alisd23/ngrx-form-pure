import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import {
  FormDirective, ActionConstants
} from '../index';

import { TestComponent } from './util/test.component';
import { TestAction, FORM_NAME } from './util/types';
import { setup, createRootState } from './util/setup';
import { StoreMock } from './mock/store-mock';

describe('Form directive [ngrxForm]', () => {
  let formDirective: FormDirective;
  let store: StoreMock;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let actions$: Subject<TestAction>;

  beforeEach(async(() => {
    actions$ = new Subject();
    setup(actions$);
  }));

  function setupTest() {
    fixture = TestBed.createComponent(TestComponent);
    debugElement = fixture.debugElement.query(By.directive(FormDirective));
    formDirective = debugElement.injector.get(FormDirective);
    store = debugElement.injector.get(Store) as any;
  }

  it('should create directive', () => {
    setupTest();
    expect(formDirective).toBeTruthy();
  });

  it('should fire DESTROY_FORM action on destroy', () => {
    setupTest();
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    formDirective.ngOnDestroy();
    fixture.detectChanges();

    // 1 FORM_INIT action, 2 REGISTER_FIELD actions, 1 DESTROY_FORM action
    expect(dispatchSpy).toHaveBeenCalledTimes(4);

    const destroyAction: TestAction = {
      type: ActionConstants.DESTROY_FORM,
      payload: { formName: FORM_NAME }
    }
    expect(dispatchSpy.calls.argsFor(3)).toEqual([destroyAction]);
  });

  it('emits form values on form submit', () => {
    setupTest();
    fixture.detectChanges();

    store.subject$.next(createRootState({
      fields: {
        name: { value: 'John' },
        age: { value: '40' },
      }
    }));

    const submitSpy = jasmine.createSpy('onSubmit');
    formDirective.submit.subscribe(submitSpy);
    debugElement.triggerEventHandler('submit', new Event('submit'));
    fixture.detectChanges();

    // 1 FORM_INIT action
    expect(submitSpy).toHaveBeenCalledTimes(1);
    expect(submitSpy).toHaveBeenCalledWith({
      name: 'John',
      age: '40'
    });
  });

  it('should fire INIT_FORM action on init', () => {
    setupTest();
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    // 1 FORM_INIT action, 2 REGISTER_FIELD actions
    expect(dispatchSpy).toHaveBeenCalledTimes(3);

    const initAction: TestAction = {
      type: ActionConstants.INIT_FORM,
      payload: { formName: FORM_NAME }
    }
    expect(dispatchSpy.calls.argsFor(0)).toEqual([initAction]);
  });

  it('should fire SET_INITIAL_VALUES if initial values are supplied', () => {
    setupTest();
    const dispatchSpy = spyOn(store, 'dispatch');
    const initialValues = {
      name: 'Jen',
      age: '30'
    }
    formDirective.initialValues = initialValues;
    fixture.detectChanges();

    // 1 FORM_INIT action, 2 REGISTER_FIELD actions, 1 INITIAL_VALUES action
    expect(dispatchSpy).toHaveBeenCalledTimes(4);

    const setInitialAction: TestAction = {
      type: ActionConstants.SET_INITIAL_VALUES,
      payload: {
        formName: FORM_NAME,
        values: initialValues
      }
    }
    expect(dispatchSpy.calls.argsFor(3)).toEqual([setInitialAction]);
  });

  it('should call updateFieldErrors after INIT_FORM action', () => {
    setupTest();
    fixture.detectChanges();
    const updateSpy = spyOn(formDirective, 'updateFieldErrors');

    const state = createRootState({
      fields: {
        name: { value: '' },
        age: { value: '40' },
      }
    });

    const initAction: TestAction = {
      type: ActionConstants.INIT_FORM,
      payload: { formName: FORM_NAME }
    }

    // Simulate corresponding state change from INIT_FORM action
    store.subject$.next(state);
    // Simulate INIT_FORM action
    actions$.next(initAction);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy.calls.allArgs()).toEqual([
      [state.form.test]
    ]);
  });

  it('should call updateFieldErrors after CHANGE_FIELD action', () => {
    setupTest();
    fixture.detectChanges();
    const updateSpy = spyOn(formDirective, 'updateFieldErrors');

    const state = createRootState({
      fields: {
        name: { value: 'Bob' },
        age: { value: '' },
      }
    });

    const changeAction: TestAction = {
      type: ActionConstants.CHANGE_FIELD,
      payload: { formName: FORM_NAME, fieldName: 'name', value: 'Bob' }
    }

    // Simulate corresponding state change from INIT_FORM action
    store.subject$.next(state);
    // Simulate INIT_FORM action
    actions$.next(changeAction);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy.calls.allArgs()).toEqual([
      [state.form.test]
    ]);
  });

  describe('updateFieldErrors()', () => {
    it('does nothing when no validators are present', () => {
      // const updateErrorsAction: TestAction = {
      //   type: ActionConstants.UPDATE_FIELD_ERRORS,
      //   payload: {
      //     formName: FORM_NAME,
      //     errors: {}
      //   }
      // };
      // 1 FORM_INIT action, 2 REGISTER_FIELD actions, 1 UPDATE_FIELD_ERRORS action
      // expect(dispatchSpy.calls.argsFor(3)).toEqual([updateErrorsAction]);
    });

    it('does does nothing when field errors have not changed', () => {

    });

    it('fires an UPDATE_FIELD_ERRORS action when an field transitions TO an error state', () => {

    });

    it('fires an UPDATE_FIELD_ERRORS action when an field transitions AWAY an error state', () => {

    });
  });
});
