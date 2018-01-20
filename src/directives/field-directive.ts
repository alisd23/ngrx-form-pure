import { Directive, Input, OnInit, OnDestroy, HostListener, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

import { FormDirective } from './form-directive';
import { RadioFieldControl, CheckboxFieldControl, DefaultFieldControl } from './field-controls';
import { IFieldControl, IStoreState } from '../types';
import { getFormActions, FormActions } from '../actions';

const typeToControl = {
  radio: RadioFieldControl,
  checkbox: CheckboxFieldControl,
  default: DefaultFieldControl
}

@Directive({
  selector: `[ngrxField]`,
  providers: [RadioFieldControl, CheckboxFieldControl, DefaultFieldControl]
})
export class FieldDirective implements OnInit, OnDestroy {
  @Input('ngrxField') fieldName: string;
  @Input('name') name: string;
  @Input('type') type: string;
  @Input('stateMutator') stateMutator: (value: any, e: Event) => any;
  @Input('valueMutator') valueMutator: (value: any) => any;

  private initialized = false;
  private fieldValue: any;
  private formActions: FormActions<any, any>;
  private fieldControl: IFieldControl;
  private subscriptions: Subscription[] = [];

  private get formName() { return this.formDirective.formName; }

  constructor(
    // Angular DI will look up the heirarchy until the first FormDirective instance is found
    // which should be the parent form
    private formDirective: FormDirective,
    private store: Store<IStoreState>,
    private injector: Injector,
  ) {}

  @HostListener('focus') onFocus() {
    this.store.dispatch(
      this.formActions.focusField(this.fieldName)
    );
  }

  @HostListener('blur') onBlur() {
    this.store.dispatch(
      this.formActions.blurField(this.fieldName)
    );
  }

  onChange(newValue: any, e: Event) {
    if (newValue !== this.fieldValue) {
      this.store.dispatch(
        this.formActions.changeField(
          this.fieldName,
          this.stateMutator ? this.stateMutator(newValue, e) : newValue
        )
      );
    }
  }

  ngOnInit() {
    this.formActions = getFormActions(this.formName);

    this.fieldControl = this.injector.get(
      typeToControl[this.type] || typeToControl.default
    );

    this.fieldControl.initialise({
      get formName() { return this.formName },
      get fieldName() { return this.fieldName },
      onChange: (value, e) => this.onChange(value, e)
    });

    this.store.dispatch(
      this.formActions.registerField(this.fieldName)
    )

    const storeSubscription = this.store
      .select('form', this.formName, 'fields', this.fieldName, 'value')
      .subscribe((value) => {
        const newValue = this.valueMutator ? this.valueMutator(value) : value;
        this.fieldValue = newValue;
        this.fieldControl.onValueUpdate(newValue);
      });

    this.subscriptions.push(storeSubscription);
    this.initialized = true;
  }

  ngOnDestroy() {
    if (this.fieldControl) {
      this.fieldControl.ngOnDestroy();
    }

    this.subscriptions.forEach(sub => sub.unsubscribe());

    if (this.initialized) {
      this.store.dispatch(
        this.formActions.unregisterField(this.fieldName)
      );
    }
  }
}
