import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getFormActions, getFieldErrors, IFieldValidators, validators, IFormState, IFieldErrors } from 'ngrx-form';

import { AppFormState, QueryFormShape, AppState } from '../app-store.module';
import { Colour, Band, Hobby } from '../types';

const queryFormActions = getFormActions<AppFormState>('query');

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent {
  public colours = Object.keys(Colour);
  public bands = Object.keys(Band);
  public hobbies = Object.keys(Hobby);

  public store: Store<AppState>;
  public loading = false;

  formState: IFormState<QueryFormShape>;

  initialValues: Partial<QueryFormShape> = {
    age: '23',
    colour: Colour.green,
    hobbies: [],
    terms: false,
    genres: []
  }

  fieldValidators: IFieldValidators<QueryFormShape> = {
    name: [validators.required('Name')],
    age: [validators.required('Age')],
    colour: [validators.required('Colour')],
    favouriteBand: [validators.required('Favourite band')],
  };

  constructor(store: Store<AppState>) {
    this.store = store;
    this.store
      .select('form', 'query')
      .subscribe(state => this.formState = state);
  }

  get fieldErrors(): IFieldErrors<QueryFormShape> {
    if (this.formState) {
      return getFieldErrors(this.formState);
    } else {
      return {};
    }
  }

  getBandName(band: Band) {
    return Band[band];
  }

  showFieldError(fieldName: keyof QueryFormShape) {
    const isFieldTouched = (
      this.formState &&
      this.formState.fields[fieldName] &&
      this.formState.fields[fieldName].touched
    ) || false;
    return isFieldTouched && this.fieldErrors[fieldName];
  }

  isHobbyChecked = (hobby: Hobby) => (hobbies: Hobby[]) => {
    return hobbies && hobbies.indexOf(hobby) !== -1;
  }

  onHobbyChange = (hobby: Hobby) =>
    (checked: boolean, e: Event): QueryFormShape['hobbies'] => {
      const currentState = this.formState.fields.hobbies.value;
      const newState = new Set(currentState);

      if (checked) {
        newState.add(hobby);
      } else {
        newState.delete(hobby);
      }

      return Array.from(newState);
  }

  onSubmit(values: QueryFormShape) {
    console.log('Submitted', values);
    this.loading = true;
    setTimeout(
      () => {
        this.loading = false;
        console.log('Submit success')
      },
      2000
    )
  }

  onReset() {
    (queryFormActions as any).reset();
  }
}
