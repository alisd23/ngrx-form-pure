import { Directive, OnChanges, forwardRef, Input } from '@angular/core';
import { FieldDirective } from './index';
import { FormContainer } from './form-container';

@Directive({
  selector: '[ngrxForm]',
  // host: {'(submit)': 'onSubmit($event)', '(reset)': 'onReset()'},
})
export class FormDirective implements OnChanges {
  @Input('ngrxForm') private _name: string;

  private _fields: FieldDirective[] = [];

  public get formName() { return this._name; }

  public registerField(field: FieldDirective) {
    this._fields.push(field);
  }

  ngOnChanges(changes) {
    console.log(changes);
  }
}
