import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getFormValues, getFieldErrors } from 'ngrx-form';

import { AppState } from './app-store.module';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

enum ViewModes {
  Full = 'Full',
  Values = 'Values',
  Errors = 'Errors'
}

const modes = [
  { type: ViewModes.Full , label: 'Full State' },
  { type: ViewModes.Values , label: 'Values only' },
  { type: ViewModes.Errors , label: 'Errors only' }
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public state: AppState;
  public viewMode = ViewModes.Values;
  public viewModes = modes;

  constructor(
    private store: Store<AppState>
  ) {}

  public get formattedState() {
    return this.stringify(this.currentState).trim();
  }

  public get currentState(): any {
    switch (this.viewMode) {
      case ViewModes.Full:
        return this.state;
      case ViewModes.Values:
        return this.state.form.newUser
          ? getFormValues(this.state.form.newUser)
          : {};
      case ViewModes.Errors:
        return this.state.form.newUser
          ? getFieldErrors(this.state.form.newUser)
          : {};
      default:
        return this.state;
    }
  }

  public onModeChange(newMode: ViewModes) {
    this.viewMode = newMode;
  }

  public ngOnInit() {
    this.store.subscribe(state => this.state = state);
  }

  private stringify(object, indent = 0) {
    const baseIndentString = Array(indent).fill(' ').join('');
    const innerIndentString = Array(indent + 2).fill(' ').join('');

    if (Array.isArray(object)) {
      if (object.length === 0) {
        return '[]';
      }
      const values = object.map(o => this.stringify(o)).join(`,\n${innerIndentString}`);
      return `[\n${innerIndentString}${values}\n${baseIndentString}]`;
    }
    if (typeof object !== 'object') {
      // not an object, stringify using native function
      return JSON.stringify(object);
    }

    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    const props = Object
      .keys(object)
      .map(key => `${key}: ${this.stringify(object[key], indent + 2)}`)
      .join(`,\n${innerIndentString}`);

    return `{\n${innerIndentString}${props}${baseIndentString}\n${baseIndentString}}`;
  }
}
