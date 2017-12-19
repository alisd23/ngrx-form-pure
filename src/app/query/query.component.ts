import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, QueryFormShape, AppFormState } from '../app-store.module';
import { FormState, getFormActions, FormActions } from '../ngrx-form';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent {
  queryForm: Observable<FormState<QueryFormShape>>;
  queryFormActions: FormActions<AppFormState, QueryFormShape>;

  constructor(private store: Store<AppState>) {
    this.queryForm = store.select('forms').select('query');
    this.queryFormActions = getFormActions();

    this.store.dispatch(this.queryFormActions.initForm('query', {
      name: 'Alex',
      age: 23
    }));
  }
}
