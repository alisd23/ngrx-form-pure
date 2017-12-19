import { Directive, Input, OnInit, Host, HostListener, ElementRef, HostBinding, EventEmitter } from '@angular/core';
import { FormDirective } from './form-directive';
import { getFormActions, FormActions, FormControls } from '../../ngrx-form';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';

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
  private input = new EventEmitter();
  private _formState$: Observable<FormControls<any>>;

  private get formName() { return this._parent.formName; }

  constructor(
    @Host() parent: FormDirective,
    store: Store<any>,
    el: ElementRef
  ) {
    this._parent = parent;
    this._store = store;
    this._el = el;
    this._formActions = getFormActions();
  }

  @HostListener('focus') onFocus() {
    this._store.dispatch(
      this._formActions.focusField(this.formName, this.name)
    );
  }

  @HostListener('blur') onBlur() {
    this._store.dispatch(
      this._formActions.blurField(this.formName, this.name)
    );
  }

  @HostListener('input', ['$event']) onChange(e) {
    this.input.next(this._el.nativeElement.value);
    this._store.dispatch(
      this._formActions.changeField(this.formName, this.name, this._el.nativeElement.value)
    );
  }

  ngOnInit() {
    this._formState$ = this._store
      .select('forms')
      .select(this.formName);

    this
      .input
      .withLatestFrom(
        this._formState$,
        (input, state) => ({ input, state })
      )
      .filter(({ input, state }) => input !== state[this.name])
      .subscribe(
        ({ input }) => this._store.dispatch(
          this._formActions.changeField(this.formName, this.name, this._el.nativeElement.value)
        )
      );

    this._store
      .select('forms')
      .select(this.formName)
      .filter((state: FormControls<any>) => state[this.name] !== this._value)
      .subscribe((state: FormControls<any>) => {
        this._value = state[this.name].value;
      });
  }
}
