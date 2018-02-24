import {
  Directive, OnInit, OnDestroy, Input, Output, HostListener, EventEmitter, AfterContentInit
} from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { IFormState, IFieldValidators, IStoreState } from '../types';
import { getFormActions, FormActions, ActionConstants } from '../actions';
import { getFormValues } from '../selectors';
import { delayAction } from '../utils/angular';

import 'rxjs/add/operator/filter';


@Directive({
  selector: '[ngrxForm]'
})
export class FormDirective implements OnInit, OnDestroy, AfterContentInit {
  @Input('ngrxForm') public formName: string;
  @Input('fieldValidators') public fieldValidators?: IFieldValidators<any>;
  @Input('initialValues') public initialValues?: any;

  @Output('ngrxSubmit') public submit = new EventEmitter();

  private formActions: FormActions<any, any>;
  private subscriptions: Subscription[] = [];

  public initialized = false;
  public formState: IFormState<any>;

  constructor(
    private store: Store<IStoreState>,
    private actions$: ActionsSubject
  ) {}

  @HostListener('submit', ['$event'])
  public onSubmit(event: Event) {
    // When a submit event fires, grab the most recent form values then emit
    // the submit output event to the parent component
    event.preventDefault();
    const values = getFormValues(this.formState);

    this.submit.emit(values)
  }

  public updateFieldErrors(state: IFormState<any>) {
    if (!this.fieldValidators || !state) {
      return;
    }

    const fieldNames = Object.keys(this.fieldValidators);
    const errors = {};
    let errorChanged = false;

    for (const fieldName of fieldNames) {
      const field = state.fields[fieldName];
      const validators = this.fieldValidators[fieldName];

      if (field && Array.isArray(validators)) {
        // Run through validators in order until first validator returns something
        // truthy - the error string.
        for (const validate of validators) {
          const newError = validate(field.value, state);

          // If the current error (or none) for this field is different from the new calculated
          // error (i.e. the fields error state has changed) then add this to the object
          if (newError) {
            errors[fieldName] = newError;
            break;
          }
        }

        const currentError = field.error;
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
  public ngOnInit() {
    this.formActions = getFormActions(this.formName);

    // Initialise form state
    delayAction(() => this.store.dispatch(this.formActions.initForm()));

    const storeSubscription = this.store
      .select('form', this.formName)
      .subscribe(formState => this.formState = formState);

    // When fields state updates and when form initialises - perform field validation
    const errorCheckActionTypes = [
      ActionConstants.CHANGE_FIELD,
      ActionConstants.INIT_FORM,
      ActionConstants.RESET_FORM,
      ActionConstants.RESET_FIELD
    ] as string[];

    const actionSubscription = this.actions$
      .filter(action => errorCheckActionTypes.indexOf(action.type) !== -1)
      .subscribe(() => this.updateFieldErrors(this.formState));

    this.subscriptions.push(storeSubscription, actionSubscription);
    this.initialized = true;
  }

  // Called after the child directives (and therefore all field directives) have initialised
  public ngAfterContentInit() {
    if (this.initialValues) {
      delayAction(() => {
        this.store.dispatch(
          this.formActions.setInitialValues(this.initialValues)
        );

        // Can only updateFieldErrors after all fields have been registered - so
        // we need to wait till initial change detection phase has ended.
        if (this.fieldValidators) {
          this.updateFieldErrors(this.formState);
        }
      });
    }
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());

    if (this.initialized) {
      delayAction(() => this.store.dispatch(
        this.formActions.destroyForm()
      ));
    }
  }
}
