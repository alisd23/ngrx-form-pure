import {
  Directive, OnInit, OnDestroy, Input, Output, HostListener, EventEmitter, AfterContentInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Subscription } from 'rxjs/Subscription';

import { IFormState, IFieldValidators } from '../types/index';
import { getFormActions, FormActions, ActionConstants } from '../actions';
import { getFormValues } from '../selectors';

@Directive({
  selector: '[ngrxForm]'
})
export class FormDirective implements OnInit, OnDestroy, AfterContentInit {
  @Input('ngrxForm') public formName: string;
  @Input('fieldValidators') private fieldValidators?: IFieldValidators<any>;
  @Input('initialValues') private initialValues?: any;

  @Output('ngrxSubmit') private submit = new EventEmitter();
  
  private initialized = false;
  private formState: IFormState<any>;
  private formActions: FormActions<any, any>;
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<any>,
    private actions$: Actions
  ) {}

  @HostListener('submit', ['$event'])
  onSubmit(event: Event) {
    // When a submit event fires, grab the most recent form values then emit
    // the submit output event to the parent component
    event.preventDefault();
    const values = getFormValues(this.formState);

    this.submit.emit(values)
  }

  updateFieldErrors(state: IFormState<any>) {
    if (!this.fieldValidators) {
      return;
    }

    const fieldNames = Object.keys(this.fieldValidators);
    const errors = {};
    let errorChanged = false;

    for (const fieldName of fieldNames) {
      const validators = this.fieldValidators[fieldName];
      if (Array.isArray(validators)) {
        // Run through validators in order until first validator returns something
        // truthy - the error string.
        for (const validate of validators) {
          const newError = validate(state.fields[fieldName].value, this.formState);
          
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
      this.store.dispatch(this.formActions.updateFieldErrors(errors));
    }
  }

  /**
   * After component initialises
   * Set up observable subscriptions (form state, actions, events etc...)
   */
  ngOnInit() {    
    this.formActions = getFormActions(this.formName);

    // Initialise form state
    this.store.dispatch(this.formActions.initForm());

    const storeSubscription = this.store
      .select('forms')
      .select(this.formName)
      .subscribe(formState => this.formState = formState);

    // When fields state updates and when form initialises - perform field validation
    const errorCheckActionTypes = [
      ActionConstants.CHANGE,
      ActionConstants.INIT
    ] as string[];

    const actionSubscription = this.actions$
      .filter(action => errorCheckActionTypes.indexOf(action.type) !== -1)
      .subscribe(() => this.updateFieldErrors(this.formState));    

    this.subscriptions.push(storeSubscription, actionSubscription);
    this.initialized = true;
  }

  // Called after the child directives (and therefore all field directives) have initialised
  ngAfterContentInit() {
    if (this.initialValues) {
      this.store.dispatch(
        this.formActions.setInitialValues(this.initialValues)
      );
    }
    
    if (this.fieldValidators) {
      this.updateFieldErrors(this.formState);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());

    if (this.initialized) {
      this.store.dispatch(
        this.formActions.destroyForm()
      );
    }
  }
}
