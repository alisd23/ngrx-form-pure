import { Directive, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { IFormState } from '../types';
import { getFormActions, FormActions, ActionConstants } from '../actions';
import { getFormValues } from '../selectors';
import { IFieldValidators } from '../validation';

@Directive({
  selector: '[ngrxForm]'
})
export class FormDirective implements OnInit {
  @Input('ngrxForm') private _name: string;
  @Input('ngrxFieldValidators') private _fieldValidators?: IFieldValidators<any>;
  @Output('ngrxSubmit') private _submit = new EventEmitter();
  
  private _submitEvent$ = new EventEmitter<Event>();
  private _formState$: Observable<IFormState<any>>
  private _actions$: Actions;
  private _formActions: FormActions<any, any>;
  private _store: Store<any>;

  constructor(
    store: Store<any>,
    actions$: Actions
  ) {
    this._store = store;
    this._actions$ = actions$;
  }

  @HostListener('submit', ['$event'])
  onSubmit(event: Event) {
    event.preventDefault();
    this._submitEvent$.next(event);
  }

  public get formName() { return this._name; }

  updateFieldErrors(state: IFormState<any>) {
    if (!this._fieldValidators) {
      return;
    }

    const fieldNames = Object.keys(this._fieldValidators);
    const errors = {};
    let errorChanged = false;

    for (const fieldName of fieldNames) {
      const validators = this._fieldValidators[fieldName];
      if (Array.isArray(validators)) {
        // Run through validators in order until first validator returns something
        // truthy - the error string.
        for (const validate of validators) {
          const currentError = state.fields[fieldName].error;
          const newError = validate(state.fields[fieldName].value);

          // If the current error (or none) for this field is different from the new calculated
          // error (i.e. the fields error state has changed) then add this to the object
          if (currentError !== newError) {
            errorChanged = true;
            errors[fieldName] = newError;
            break;
          }
        }
      }
    }

    if (errorChanged) {
      this._store.dispatch(this._formActions.updateFieldErrors(errors));
    }
  }

  /**
   * After component initialises
   * Set up observable subscriptions (form state, actions, events etc...)
   */
  ngOnInit() {    
    this._formActions = getFormActions(this.formName);

    // Initialise form state
    this._store.dispatch(this._formActions.initForm());
    
    this._formState$ = this._store
      .select('forms')
      .select(this._name);

    // When a submit event fires, grab the most recent form state then emit
    // the submit output event to the parent component
    this._submitEvent$
      .withLatestFrom(
        this._formState$,
        (event, form) => getFormValues(form)
      )
      .subscribe(values => this._submit.emit(values));

    // When fields state updates and when form initialises - perform field validation
    const errorCheckActionTypes = [
      ActionConstants.CHANGE,
      ActionConstants.INIT
    ] as string[];

    this._actions$
      .filter(action => errorCheckActionTypes.indexOf(action.type) !== -1)
      .withLatestFrom(
        this._formState$,
        (action, state) => ({ action, state })  
      )
      .subscribe(({ state }) => this.updateFieldErrors(state));    
  }
}
