import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppFormState, QueryFormShape, AppState } from '../app-store.module';
import { getFormActions, getFieldErrors, IFieldValidators, validators, IFormState, IFieldErrors } from '../ngrx-form';
import { Colours, Sexes, Hobbies } from '../types';

const queryFormActions = getFormActions<AppFormState>('query');

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {
  public colours = Object.keys(Colours);
  public sexes = Object.keys(Sexes);
  public hobbies = Object.keys(Hobbies);
  
  public store: Store<AppState>;
  
  formState: IFormState<QueryFormShape>;

  get fieldErrors(): IFieldErrors<QueryFormShape> {
    return getFieldErrors(this.formState);  
  }

  initialValues: Partial<QueryFormShape> = {
    name: 'Alex',
    age: '23',
    colour: Colours.green,
    hobbies: []
  }

  fieldValidators: IFieldValidators<QueryFormShape> = {
    name: [validators.required('Name')],
    age: [validators.required('Age')]
  };

  constructor(store: Store<AppState>) {
    this.store = store;
    this.store
      .select('forms', 'query')
      .subscribe(state => this.formState = state);
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
  }

  onReset() {
    (queryFormActions as any).reset();
  }
}

// ON FIELD CHANGE
// - Show field error when field is wrong and field is "dirty"
// - Show overall form error (maybe?) 