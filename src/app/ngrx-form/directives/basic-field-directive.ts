import { Directive, Input, OnInit, Host, HostListener, ElementRef, HostBinding, Self } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/filter';

import { FormDirective } from './form-directive';
import { FieldControl } from './field-control';

const specificTypes = ['radio', 'checkbox'];
const typeExclusions = specificTypes
  .map(type => `:not([type="${type}"])`)
  .join('');

@Directive({
  selector: `[ngrxField]${typeExclusions}`,
  // We want a new FieldControl for each field directive, so as to not not share between inputs.
  // This is because FieldControl is stateful
  providers: [FieldControl]
})
export class BasicFieldDirective implements OnInit {
  @Input('ngrxField') name: string;

  @HostBinding('value') value: any;

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

  @HostListener('input', ['$event']) onChange(e: Event) {
    this._fieldControl.onChange((e.target as HTMLInputElement).value);
  }

  ngOnInit() {
    // Subscribe to changes in the fields value from the form store
    // and update the inputs value when a change occurs
    this._store
      .select('forms', this.formName, 'fields', this.name)
      .filter(fieldState => fieldState && (fieldState.value !== this.value))
      .subscribe((fieldState) => this.value = fieldState.value);
      
    this._fieldControl.initialise(this.name);
  }
}
