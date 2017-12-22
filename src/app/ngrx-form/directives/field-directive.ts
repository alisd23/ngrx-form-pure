import { Directive, Input, OnInit, Host, HostListener, ElementRef, HostBinding, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { FormDirective } from './form-directive';
import { getFormActions, FormActions } from '../actions';
import { IFormControls } from '../types';

interface IFieldEvent {
  type: 'blur' | 'input' | 'focus';
  value?: any;
}

@Directive({
  selector: '[ngrxField]'
})
export class FieldDirective implements OnInit {
  @Input('ngrxField') name: string;

  @HostBinding('attr.value') private _value: any;
  private _store: Store<any>;
  private _el: ElementRef;
  private _formActions: FormActions<any, any>;
  private _parent: FormDirective;

  private _fieldEvent$ = new EventEmitter<IFieldEvent>();
  private _formState$: Observable<IFormControls<any>>;

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

    this._formState$ = this._store
      .select('forms')
      .select(this.formName);

    // Fire *change* action when field changes its value (input event)
    this._fieldEvent$
      .filter(event => event.type === 'input')
      .map(event => event.value)
      .withLatestFrom(
        this._formState$,
        (value, state) => ({ value, state })
      )
      .filter(({ value, state }) => value !== state[this.name])
      .subscribe(
        ({ value }) => this._store.dispatch(
          this._formActions.changeField(this.name, this._el.nativeElement.value)
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
    this._store
      .select('forms')
      .select(this.formName)
      .filter((state: IFormControls<any>) => state[this.name] !== this._value)
      .subscribe((state: IFormControls<any>) => {
        this._value = state[this.name].value;
      });
  }
}
