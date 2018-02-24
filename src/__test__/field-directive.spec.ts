import { DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import {
  FieldDirective, ActionConstants
} from '../index';
import {
  DefaultFieldControl, CheckboxFieldControl, RadioFieldControl
} from '../directives/field-controls/index';

import { TestComponent } from './util/test.component';
import { createFakeEvent } from './util/fake-event';
import { ITestAction, FORM_NAME } from './util/types';
import { setup } from './util/setup';
import { detectFormLifecycleActions } from './util/detect-changes';
import { StoreMock } from './mock/store-mock';

describe('Field directive [ngrxField]', () => {
  let store: StoreMock;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;
  let actions$: Subject<ITestAction>;
  let nameField: DebugElement;
  let nameFieldDirective: FieldDirective;
  let ageField: DebugElement;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async(() => {
    actions$ = new Subject();
    setup(actions$);
  }));

  function setupTest() {
    fixture = TestBed.createComponent(TestComponent);
    debugElement = fixture.debugElement;
    nameField = debugElement.query(By.css('[ngrxField="name"]'));
    ageField = debugElement.query(By.css('[ngrxField="age"]'));
    store = debugElement.injector.get(Store) as any;
    nameFieldDirective = nameField.injector.get(FieldDirective);
    dispatchSpy = spyOn(store, 'dispatch');
  }

  describe('Form control type is selected correctly', () => {
    it('when the field is a regular input', () => {
      setupTest();
      nameFieldDirective.type = 'text';
      nameField.nativeElement.type = 'text';
      detectFormLifecycleActions(fixture);

      expect((nameFieldDirective as any).fieldControl.constructor.name).toEqual('DefaultFieldControl');
    });

    it('when the field is a radio input', () => {
      setupTest();
      nameFieldDirective.type = 'radio';
      nameField.nativeElement.type = 'radio';
      detectFormLifecycleActions(fixture);

      expect((nameFieldDirective as any).fieldControl.constructor.name).toEqual('RadioFieldControl');
    });

    it('when the field is a checkbox input', () => {
      setupTest();
      nameFieldDirective.type = 'checkbox';
      nameField.nativeElement.type = 'checkbox';
      detectFormLifecycleActions(fixture);

      expect((nameFieldDirective as any).fieldControl.constructor.name).toEqual('CheckboxFieldControl');
    });
  });

  it('fires REGISTER_FIELD actions at correct point in lifecycle', () => {
    setupTest();
    detectFormLifecycleActions(fixture);

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

  it('fires a FOCUS_FIELD action when focused', () => {
    setupTest();
    detectFormLifecycleActions(fixture);

    nameField.triggerEventHandler('focus', {});
    fixture.detectChanges();

    const nameFocusAction: ITestAction = {
      type: ActionConstants.FOCUS_FIELD,
      payload: {
        formName: FORM_NAME,
        fieldName: 'name'
      }
    };

    // 1 FORM_INIT action, 2 REGISTER_FIELD action, 1 FOCUS_FIELD action
    expect(dispatchSpy).toHaveBeenCalledTimes(4);
    expect(dispatchSpy.calls.argsFor(3)).toEqual([nameFocusAction]);
  });

  it('fires a BLUR_FIELD action when blurred', () => {
    setupTest();
    detectFormLifecycleActions(fixture);

    nameField.triggerEventHandler('focus', {});
    nameField.triggerEventHandler('blur', {});
    fixture.detectChanges();

    const nameBlurAction: ITestAction = {
      type: ActionConstants.BLUR_FIELD,
      payload: {
        formName: FORM_NAME,
        fieldName: 'name'
      }
    };

    // 1 FORM_INIT action, 2 REGISTER_FIELD action, 1 FOCUS_FIELD action, 1 BLUR_FIELD action
    expect(dispatchSpy).toHaveBeenCalledTimes(5);
    expect(dispatchSpy.calls.argsFor(4)).toEqual([nameBlurAction]);
  });

  describe('onChange()', () => {
    /**
     * Generic test function for testing change events for each type of field control
     * @param type - input type to change the 'name' field to
     * @param controlClass - The Control injectable which should be retrieved from the injector
     * @param expectedValue - expected value part of the changeAction payload
     */
    function runChangeTest(type: string, controlClass: any, expectedValue: any, setValues: Function) {
      nameFieldDirective.type = type;
      nameField.nativeElement.type = type;
      detectFormLifecycleActions(fixture);

      const fieldControl = nameField.injector.get(controlClass);
      setValues();
      fieldControl.onChange(createFakeEvent('input'));
      fixture.detectChanges();

      const fieldChangeAction: ITestAction = {
        type: ActionConstants.CHANGE_FIELD,
        payload: {
          formName: FORM_NAME,
          fieldName: 'name',
          value: expectedValue
        }
      };

      // 1 FORM_INIT action, 2 REGISTER_FIELD action, 1 CHANGE_FIELD action
      expect(dispatchSpy).toHaveBeenCalledTimes(4);
      expect(dispatchSpy.calls.argsFor(3)).toEqual([fieldChangeAction]);
    }

    it('should emit a correct CHANGE_FIELD action for a text input if the value has changed', () => {
      setupTest();
      runChangeTest('text', DefaultFieldControl, 'bob', () => {
        nameField.nativeElement.value = 'bob';
      });
    });

    it('should emit a correct CHANGE_FIELD action for a checkbox input if the value has changed', () => {
      // Turn the name input into a checkbox input, so the FieldDirective gets a CheckboxFieldControl
      // injected into it and response to 'input' events like a checkbox input
      setupTest();
      runChangeTest('checkbox', CheckboxFieldControl, true, () => {
        nameField.nativeElement.checked = true;
      });
    });

    it('should emit a correct CHANGE_FIELD action for a radio input if the value has changed', () => {
      // Turn the name input into a checkbox input, so the FieldDirective gets a RadioFieldControl
      // injected into it and response to 'input' events like a radio input
      setupTest();
      runChangeTest('radio', RadioFieldControl, 'orange', () => {
        nameField.nativeElement.checked = true;
        nameField.nativeElement.value = 'orange';
      });
    });

    it('should do nothing if the value has not changed', () => {
      setupTest();
      detectFormLifecycleActions(fixture);

      const fieldControl = nameField.injector.get(DefaultFieldControl);
      // Field value is hte current state value of the field
      (nameFieldDirective as any).fieldValue = 'apple';
      // Simulate change event with the same value as that in state
      nameField.nativeElement.value = 'apple';
      fieldControl.onChange(createFakeEvent('input'));

      // 1 FORM_INIT action, 2 REGISTER_FIELD action
      expect(dispatchSpy).toHaveBeenCalledTimes(3);
    });

    it('stateMutator mutates outgoing value when input value changes', () => {
      setupTest();
      nameFieldDirective.stateMutator = (value) => `mutated: ${value}`;
      detectFormLifecycleActions(fixture);

      nameFieldDirective.onChange('bob', createFakeEvent('input'));

      const fieldChangeAction: ITestAction = {
        type: ActionConstants.CHANGE_FIELD,
        payload: {
          formName: FORM_NAME,
          fieldName: 'name',
          value: 'mutated: bob'
        }
      };

      // 1 FORM_INIT action, 2 REGISTER_FIELD action, 1 CHANGE_FIELD action
      expect(dispatchSpy).toHaveBeenCalledTimes(4);
      expect(dispatchSpy.calls.argsFor(3)).toEqual([fieldChangeAction]);
    });

    it('valueMutator mutates new incoming value when the inputs\' value changes in state', () => {
      setupTest();
      nameFieldDirective.valueMutator = (stateValue) => `mutated: ${stateValue}`;
      detectFormLifecycleActions(fixture);

      const newState = {
        form: {
          [FORM_NAME]: {
            fields: {
              name: { value: 'jen' },
              age: { value: '' }
            }
          }
        }
      }
      store.subject$.next(newState);
      fixture.detectChanges();

      expect(nameField.nativeElement.value).toBe('mutated: jen');
      expect(ageField.nativeElement.value).toBe('');
    });
  });
});
