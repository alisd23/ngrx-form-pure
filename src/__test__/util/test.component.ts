import { Component } from '@angular/core';

import { FORM_NAME } from './types';

@Component({
  selector: 'test-form-component',
  template: `
    <form ngrxForm="${FORM_NAME}">
      <input ngrxField="name" />
      <input ngrxField="age" />
    </form>
  `
})
export class TestComponent {}
