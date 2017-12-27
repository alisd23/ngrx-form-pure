import { Directive, Input, OnInit, OnDestroy, Host, HostListener, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { getFormActions, FormActions } from '../actions';
import 'rxjs/add/operator/filter';

import { FormDirective } from './form-directive';
import { RadioFieldControl, CheckboxFieldControl, DefaultFieldControl } from './field-controls';
import { IFieldControl } from '../types';

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
  @Input('normalizeOut') normalizeOut: (value: any, e: Event) => any;
  @Input('normalizeIn') normalizeIn: (value) => any;

  private fieldValue: any;
  private formActions: FormActions<any, any>;
  private fieldControl: IFieldControl;

  private get formName() { return this.formDirective.formName; }

  constructor(
    @Host() private formDirective: FormDirective,
    private store: Store<any>,
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
          this.normalizeOut ? this.normalizeOut(newValue, e) : newValue
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
      
    this.formActions.registerField(this.fieldName);

    this.store
      .select('forms', this.formName, 'fields', this.fieldName, 'value')
      .subscribe((value) => {
        const newValue = this.normalizeIn ? this.normalizeIn(value) : value;
        this.fieldValue = newValue;
        this.fieldControl.onValueUpdate(newValue);
      });
  }

  ngOnDestroy() {
    if (this.fieldControl) {
      this.fieldControl.ngOnDestroy();
    }
  }
}
