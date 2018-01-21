import { Component, Injectable, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store, Action, ActionsSubject } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/observable';
import { Subscription } from 'rxjs/Subscription';
import { PartialObserver } from 'rxjs/Observer';

import {
  FormDirective, FieldDirective, InitFormAction, DestroyFormAction, SetInitialValuesAction, Actions,
  IFormState, ActionConstants, RegisterFieldAction
} from '../index';

const FORM_NAME = 'test';

interface TestFormShape {
  name: string;
  age: string;
}

type TestFormState = IFormState<TestFormShape>;

interface RootState {
  form:  {
    test: TestFormState
  }
}

type TestAction = Actions<RootState['form'], TestFormShape>;

@Component({
  selector: 'test-form-component',
  template: `
    <form ngrxForm="${FORM_NAME}">
      <input ngrxField="name" />
      <input ngrxField="age" />
    </form>
  `
})
class TestComponent {}

@Injectable()
class StoreMock {
  state$ = new BehaviorSubject({});

  select(...keys: any[]) {
    return this;
  }

  dispatch(action: TestAction) {}

  subscribe(...args): Subscription {
    return this.state$.subscribe(...args);
  }
}

describe('Form directive [ngrxForm]', () => {
  let component: TestComponent;
  let directive: FormDirective;
  let store: StoreMock;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let actions$: Subject<TestAction>;

  beforeEach(async(() => {
    actions$ = new Subject();

    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        FormDirective,
        FieldDirective
      ],
      providers: [
        { provide: Store, useClass: StoreMock },
        { provide: ActionsSubject, useFactory: () => actions$ }
      ]
    })
    .compileComponents();
  }));

  function setup() {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(FormDirective));
    directive = debugElement.injector.get(FormDirective);
    store = debugElement.injector.get(Store) as any;
  }

  it('should create directive', () => {
    setup();
    expect(directive).toBeTruthy();
  });

  it('should destroy form on destroy', () => {
    setup();
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    directive.ngOnDestroy();
    fixture.detectChanges();

    // 4 times because INIT_FORM, 2 REGISTER_FIELD actions, and DESTROY_FORM action
    expect(dispatchSpy).toHaveBeenCalledTimes(4);
    expect(dispatchSpy.calls.argsFor(3)).toEqual([
      {
        type: '@ngrx-form/destroy',
        payload: { formName: FORM_NAME }
      } as TestAction
    ]);
  });

  it('emits form values on form submit', () => {
    setup();
    fixture.detectChanges();

    store.state$.next({
      fields: {
        name: { value: 'John' },
        age: { value: '40' },
      }
    });

    const submitSpy = jasmine.createSpy('onSubmit');
    directive.submit.subscribe(submitSpy);
    debugElement.triggerEventHandler('submit', new Event('submit'));
    fixture.detectChanges();

    expect(submitSpy).toHaveBeenCalledTimes(1);
    expect(submitSpy).toHaveBeenCalledWith({
      name: 'John',
      age: '40'
    });
  });

  it('should initialise form on init', () => {
    setup();
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    expect(directive.formName).toBe(FORM_NAME);
    // 3 times because of the 2 REGISTER_FIELD actions fired by the fields
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy.calls.argsFor(0)).toEqual([
      {
        type: '@ngrx-form/init',
        payload: { formName: FORM_NAME }
      } as TestAction
    ]);
  });

  it('fires FORM_INIT, SET_INITIAL_VALUES, and REGISTER_FIELD actions in correct order after initialising', () => {
    setup();
    const dispatchSpy = spyOn(store, 'dispatch');
    const initialValues = {
      name: 'Jen',
      age: '30'
    }
    directive.initialValues = initialValues;
    fixture.detectChanges();

    expect(dispatchSpy.calls.allArgs()).toEqual([
      [{
        type: '@ngrx-form/init',
        payload: { formName: FORM_NAME }
      }] as TestAction[],
      [{
        type: '@ngrx-form/register-field',
        payload: {
          formName: FORM_NAME,
          fieldName: 'name',
        }
      }] as TestAction[],
      [{
        type: '@ngrx-form/register-field',
        payload: {
          formName: FORM_NAME,
          fieldName: 'age',
        }
      }] as TestAction[],
      [{
        type: ActionConstants.SET_INITIAL_VALUES,
        payload: {
          formName: FORM_NAME,
          values: initialValues
        }
      }] as TestAction[]
    ]);
  });
});
