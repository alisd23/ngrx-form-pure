import { Directive, Input, OnInit, Host, HostListener, ElementRef, HostBinding, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publish';

import { FormDirective } from './form-directive';
import { getFormActions, FormActions } from '../actions';
import { IFormFieldState } from '../types';

interface IFieldEvent {
  type: 'blur' | 'input' | 'focus';
  value?: any;
}

@Directive({
  selector: '[ngrxField]'
})
export class FieldDirective implements OnInit {
  @Input('ngrxField') name: string;
  @Input('ngrxInitialValue') initialValue: any;

  @HostBinding('attr.value') private _value: any;
  private _store: Store<any>;
  private _el: ElementRef;
  private _formActions: FormActions<any, any>;
  private _parent: FormDirective;

  private _fieldEvent$ = new EventEmitter<IFieldEvent>();
  private _fieldState$: Observable<IFormFieldState<any>>;

  private get formName() { return this._parent.formName; }

  constructor(
    @Host() parent: FormDirective,
    store: Store<any>,
    el: ElementRef
  ) {
    this._parent = parent;
    this._store = store;
    this._el = el;
  }

  @HostListener('focus') onFocus() {
    this._fieldEvent$.next({ type: 'focus' });
  }

  @HostListener('blur') onBlur() {
    this._fieldEvent$.next({ type: 'blur' });
  }

  @HostListener('input', ['$event']) onChange(e) {
    this._fieldEvent$.next({
      type: 'input',
      value: this._el.nativeElement.value
    });
  }

  ngOnInit() {
    this._formActions = getFormActions(this.formName);

    this._fieldState$ = this._store
      .select('forms', this.formName, 'fields', this.name)
      .filter(Boolean);

    // Fire *change* action when field changes its value (input event)
    this._fieldEvent$
      .filter(event => event.type === 'input')
      .map(event => event.value)
      .withLatestFrom(
        this._fieldState$,
        (value, fieldState) => ({ value, fieldState })
      )
      .filter(({ value, fieldState }) => value !== fieldState.value)
      .subscribe(
        ({ value }) => this._store.dispatch(
          this._formActions.changeField(this.name, value ? value : undefined)
        )
      );

    // Fire *focus* action when field is focused
    this._fieldEvent$
      .filter(event => event.type === 'focus')
      .subscribe(() => 
        this._store.dispatch(
          this._formActions.focusField(this.name)
        )
      )

    // Fire *blur* action when input is unfocused
    this._fieldEvent$
      .filter(event => event.type === 'blur')
      .subscribe(() => 
        this._store.dispatch(
          this._formActions.blurField(this.name)
        )
      )

    // Subscribe to changes in the fields value from the form store
    // and update the inputs value when a change occurs
    this._fieldState$
      .filter((fieldState: IFormFieldState<any>) => fieldState.value !== this._value)
      .subscribe((fieldState: IFormFieldState<any>) => {
        this._value = fieldState.value;
      });
      
    // Register field with form state
    this._store.dispatch(
      this._formActions.registerField(this.name, this.initialValue)
    )
  }
}
