import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getFormActions, getFieldErrors, IFieldValidators, validators, IFormState, IFieldErrors } from 'ngrx-form';
import { AppFormState, QueryFormShape, AppState } from '../app-store.module';
import { Colours, Bands, Hobbies } from '../enums';

const queryFormActions = getFormActions<AppFormState>('query');

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {
  public colours = Object.keys(Colours);
  public bands = Object.keys(Bands);
  public hobbies = Object.keys(Hobbies);
  
  public store: Store<AppState>;
  public loading = false;
  
  formState: IFormState<QueryFormShape>;

  initialValues: Partial<QueryFormShape> = {
    age: '23',
    colour: Colours.green,
    hobbies: []
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
      .select('forms', 'query')
      .subscribe(state => this.formState = state);
  }

  get fieldErrors(): IFieldErrors<QueryFormShape> {
    return getFieldErrors(this.formState);  
  }

  getBandName(band: Bands) {
    return Bands[band];
  }

  showFieldError(fieldName: keyof QueryFormShape) {
    const isFieldTouched = (
      this.formState.fields[fieldName] &&
      this.formState.fields[fieldName].touched
    ) || false;
    const hasError = this.fieldErrors[fieldName];
    return isFieldTouched && hasError;
  }

  isHobbyChecked = (hobby: Hobbies) => (hobbies: Hobbies[]) => {
    return hobbies && hobbies.indexOf(hobby) !== -1;
  }

  onHobbyChange = (hobby: Hobbies) => (checked: boolean, e: Event): QueryFormShape['hobbies'] => {
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

// ON FIELD CHANGE_FIELD
// - Show field error when field is wrong and field is "dirty"
// - Show overall form error (maybe?) 