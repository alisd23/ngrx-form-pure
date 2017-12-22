import { Directive, OnChanges, forwardRef, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

@Directive({
  selector: '[ngrxForm]',
  // host: {'(submit)': 'onSubmit($event)', '(reset)': 'onReset()'},
})
export class FormDirective implements OnChanges {
  @Input('ngrxForm') private _name: string;
  @Output('submit') private _submit = new EventEmitter();
  private _store: Store<any>;

  constructor(store: Store<any>) {
    this._store = store;
  }

  @HostListener('submit', ['$event']) onSubmit(event) {
    
  }

  public get formName() { return this._name; }

  ngOnChanges(changes) {
    console.log(changes);
  }
}
