import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, AppFormState, QueryFormShape } from '../app-store.module';
import { getFormActions, IFieldValidators, validators } from '../ngrx-form';

const queryFormActions = getFormActions<AppFormState>('query');

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {
  private _queryForm: Observable<AppFormState['query']>;

  initialValues: Partial<QueryFormShape> = {
    name: 'Alex',
    age: '23'
  }
  fieldValidators: IFieldValidators<QueryFormShape> = {
    name: [validators.required('Name')],
    age: [validators.required('Age')]
  };

  constructor(private store: Store<AppState>) {
    this._queryForm = this.store.select('forms').select('query');
    this._queryForm.subscribe(() => {});
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