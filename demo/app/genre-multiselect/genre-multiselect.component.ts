import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getFormActions, delayAction } from 'ngrx-form';

import { AppFormState, AppState } from '../types';
import { Genre } from '../enums';

const userFormActions = getFormActions<AppFormState>('newUser');

@Component({
  selector: 'app-genre-multiselect',
  templateUrl: './genre-multiselect.component.html',
  styleUrls: ['./genre-multiselect.component.scss']
})
export class GenreMultiselectComponent implements OnInit {
  public store: Store<AppState>;
  // Default to something sensible whilst form/fields are initialising
  public values: Genre[] = [];
  public options = Object.keys(Genre);

  constructor(store: Store<AppState>) {
    this.store = store;
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
    // Need to delay any store actions until after the form and all field components
    // have initialised (all *init functions have run - e.g. ngAfterViewInit).
    // In angular you are not supposed to trigger changes whilst in a round of change
    // detection, so all actions must wait until AFTER this initial change detection stage
    // See the README.md for more information
    delayAction(() => this.store.dispatch(
      userFormActions.registerField('genres')
    ));

    this.store
      .select('form', 'newUser', 'fields', 'genres', 'value')
      // Don't want to set values whilst form is initialising, as value will be
      // undefined/null
      .filter(value => Boolean(value))
      .subscribe(values => this.values = values);
  }
}
