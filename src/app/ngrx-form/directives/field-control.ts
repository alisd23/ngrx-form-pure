import { Injectable, Host } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormDirective } from './form-directive';
import { IFormFieldState } from '../types';
import { getFormActions, FormActions } from '../actions';

@Injectable()
export class FieldControl {
  private _store: Store<any>;
  private _formDirective: FormDirective;
  private _fieldName: string;
  private _formActions: FormActions<any, any>;
  private _fieldState: IFormFieldState<any>;

  private get formName() { return this._formDirective.formName; }

  constructor(
    @Host() formDirective: FormDirective,
    store: Store<any>
  ) {
    this._formDirective = formDirective;
    this._store = store;
  }

  public onFocus() {
    this._store.dispatch(
      this._formActions.focusField(this._fieldName)
    );
  }

  public onBlur() {
    this._store.dispatch(
      this._formActions.blurField(this._fieldName)
    );
  }

  public onChange(value: any) {
    if (value !== this._fieldState.value) {
      this._store.dispatch(
        this._formActions.changeField(this._fieldName, value ? value : undefined)
      );
    }
  }

  // Called by the field directive in ngOnInit
  public initialise(fieldName: string) {
    this._fieldName = fieldName;
    this._formActions = getFormActions(this.formName);
    
    this._store
      .select('forms', this.formName, 'fields', this._fieldName)
      .subscribe(state => this._fieldState = state);

    // Register field with form state
    this._store.dispatch(
      this._formActions.registerField(this._fieldName)
    );
  }
}