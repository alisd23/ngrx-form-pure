import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getFormActions, getFieldErrors, IFieldValidators, validators, IFormState, IFieldErrors } from 'ngrx-form';

import { AppFormState, UserFormShape, AppState } from '../types';
import { Colour, Band, Hobby } from '../enums';

const userFormActions = getFormActions<AppFormState>('newUser');

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  public colours = Object.keys(Colour);
  public bands = Object.keys(Band);
  public hobbies = Object.keys(Hobby);

  public store: Store<AppState>;
  public loading = false;

  public formState: IFormState<UserFormShape>;

  public initialValues: Partial<UserFormShape> = {
    age: '23',
    colour: Colour.green,
    hobbies: [],
    terms: false,
    genres: []
  }

  public fieldValidators: IFieldValidators<UserFormShape> = {
    name: [validators.required('Name')],
    age: [validators.required('Age')],
    colour: [validators.required('Colour')],
    favouriteBand: [validators.required('Favourite band')],
  };

  constructor(store: Store<AppState>) {
    this.store = store;
    this.store
      .select('form', 'newUser')
      .subscribe(state => this.formState = state);
  }

  public get fieldErrors(): IFieldErrors<UserFormShape> {
    if (this.formState) {
      return getFieldErrors(this.formState);
    } else {
      return {};
    }
  }

  public getBandName(band: Band) {
    return Band[band];
  }

  public showFieldError(fieldName: keyof UserFormShape, mustBeTouched = true) {
    const isFieldTouched = (
      this.formState &&
      this.formState.fields[fieldName] &&
      this.formState.fields[fieldName].touched
    ) || false;
    return (!mustBeTouched || isFieldTouched) && this.fieldErrors[fieldName];
  }

  public hobbyElementValueTransform = (hobbies: Hobby[], element: HTMLInputElement) => {
    return (
      hobbies &&
      hobbies.indexOf(element.value as Hobby) !== -1
    );
  }

  public hobbyStateValueTransform = (checked: boolean, e: Event): Hobby[] => {
    const currentState = this.formState.fields.hobbies.value;
    const newState = new Set(currentState);
    const hobby = (e.target as HTMLInputElement).value as Hobby;

    if (checked) {
      newState.add(hobby);
    } else {
      newState.delete(hobby);
    }

    return Array.from(newState);
  }

  public onSubmit(values: UserFormShape) {
    this.loading = true;
    setTimeout(
      () => {
        this.loading = false;
        // Need to complete current setTimeout so angular can update view (loading spinner
        // for example), so we need another setTimeout here
        setTimeout(() => alert(
          'Form submitted with values:\n' +
          JSON.stringify(values, null, 2)
        ), 100);
      },
      1000
    )
  }

  public onReset() {
    this.store.dispatch(
      userFormActions.resetForm()
    );
  }
}
