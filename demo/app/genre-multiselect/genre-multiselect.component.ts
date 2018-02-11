import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getFormActions } from 'ngrx-form';

import { AppFormState, AppState } from '../app-store.module';
import { Genre } from '../types';

const userFormActions = getFormActions<AppFormState>('newUser');

@Component({
  selector: 'app-genre-multiselect',
  templateUrl: './genre-multiselect.component.html',
  styleUrls: ['./genre-multiselect.component.scss']
})
export class GenreMultiselectComponent implements OnInit {
  public store: Store<AppState>;
  public values: Genre[];
  public options = Object.keys(Genre);

  constructor(store: Store<AppState>) {
    this.store = store;
    this.store
      .select('form', 'newUser', 'fields', 'genres')
      .filter(Boolean)
      .subscribe(state => this.values = state.value);
  }

  public onOptionSelected(option: Genre) {
    const valuesSet = new Set<Genre>(this.values);

    if (this.isOptionSelected(option)) {
      valuesSet.delete(option);
    } else {
      valuesSet.add(option);
    }

    this.store.dispatch(
      userFormActions.changeField('genres', Array.from(valuesSet)
    ));
  }

  public isOptionSelected(option: Genre) {
    return this.values.some(value => value === option);
  }

  public ngOnInit() {
    this.store.dispatch(
      userFormActions.registerField('genres')
    );
  }
}
