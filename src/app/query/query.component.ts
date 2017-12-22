import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, AppFormState } from '../app-store.module';
import { IFormState, getFormActions, FormActions } from '../ngrx-form';

const queryFormActions = getFormActions<AppFormState>('query');

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {
  queryForm: Observable<AppFormState['query']>;

  constructor(private store: Store<AppState>) {
    this.queryForm = store.select('forms').select('query');

    this.store.dispatch(queryFormActions.initForm({
      name: 'Alex',
      age: 23
    }));
  }
}
