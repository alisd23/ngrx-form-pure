import { Directive, OnInit, Input, Output, HostListener, EventEmitter, AfterContentInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { IFormState } from '../types';
import { getFormActions, FormActions, ActionConstants } from '../actions';
import { getFormValues } from '../selectors';
import { IFieldValidators } from '../validation';

@Directive({
  selector: '[ngrxForm]'
})
export class FormDirective implements OnInit, AfterContentInit {
  @Input('ngrxForm') private _name: string;
  @Input('fieldValidators') private _fieldValidators?: IFieldValidators<any>;
  @Input('initialValues') private _initialValues?: any;
  @Output('ngrxSubmit') private _submit = new EventEmitter();
  
  private _formState: IFormState<any>;
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
    // When a submit event fires, grab the most recent form values then emit
    // the submit output event to the parent component
    event.preventDefault();
    const values = getFormValues(this._formState);
    this._submit.emit(values)
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
          const newError = validate(state.fields[fieldName].value);
          
          // If the current error (or none) for this field is different from the new calculated
          // error (i.e. the fields error state has changed) then add this to the object
          if (newError) {
            errors[fieldName] = newError;
            break;
          }          
        }
        
        const currentError = state.fields[fieldName].error;
        if (currentError !== errors[fieldName]) {
          errorChanged = true;
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

    this._store
      .select('forms')
      .select(this._name)
      .subscribe(formState => this._formState = formState);

    // When fields state updates and when form initialises - perform field validation
    const errorCheckActionTypes = [
      ActionConstants.CHANGE,
      ActionConstants.INIT
    ] as string[];

    this._actions$
      .filter(action => errorCheckActionTypes.indexOf(action.type) !== -1)
      .subscribe(() => this.updateFieldErrors(this._formState));    
  }

  // Called after the child directives (and therefore all field directives) have initialised
  ngAfterContentInit() {
    if (this._initialValues) {
      this._store.dispatch(
        this._formActions.setInitialValues(this._initialValues)
      )
    }
  }
}
