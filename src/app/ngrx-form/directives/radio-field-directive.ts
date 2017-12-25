import { Directive, Input, OnInit, Host, HostListener, HostBinding, Self } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/filter';

import { FormDirective } from './form-directive';
import { FieldControl } from './field-control';

@Directive({
  selector: `[ngrxField][type="radio"]`,
  // We want a new FieldControl for each field directive, so as to not not share between inputs.
  // This is because FieldControl is stateful
  providers: [FieldControl]
})
export class RadioFieldDirective implements OnInit {
  @Input('ngrxField') name: string;
  @Input('value') value: string;

  @HostBinding('checked') private _checked: boolean;

  private _fieldControl: FieldControl;
  private _store: Store<any>;
  private _formDirective: FormDirective;

  private get formName() { return this._formDirective.formName; }

  constructor(
    @Host() formDirective: FormDirective,
    @Self() fieldControl: FieldControl,
    store: Store<any>,
  ) {
    this._fieldControl = fieldControl;
    this._formDirective = formDirective;
    this._store = store;
  }

  @HostListener('focus') onFocus() {
    this._fieldControl.onFocus();
  }

  @HostListener('blur') onBlur() {
    this._fieldControl.onBlur();
  }

  @HostListener('change', ['$event']) onChange(e: Event) {
    if ((e.target as HTMLInputElement).checked) {
      this._fieldControl.onChange(this.value);
    }
  }

  ngOnInit() {
    // Subscribe to changes in the fields value from the form store
    // and update the inputs value when a change occurs
    this._store
      .select('forms', this.formName, 'fields', this.name)
      .filter(Boolean)
      .subscribe(fieldState => this._checked = (fieldState.value === this.value));
      
    this._fieldControl.initialise(this.name);

    console.log(this.name, this.value, this._checked);
  }
}
