/// <reference types="Cypress" />

import { TextField } from './form-fields/text-field.po';
import { CustomMultiselectField } from './form-fields/custom-multiselect-field.po';
import { RadioGroupField } from './form-fields/radio-group-field.po';
import { CheckboxGroupField } from './form-fields/checkbox-group-field.po';

export class DemoPage {
  public nameInput = new TextField('name');
  genreMultiselect = new CustomMultiselectField('genre-multiselect', 'genre');
  bandRadioGroup = new RadioGroupField('favouriteBand');
  hobbiesCheckboxGroup = new CheckboxGroupField('hobbies');

  constructor() {
    cy.visit('/');
  }

  public get colourSelect() {
    return cy.get(`select[ngrxField='colour'`);
  }

  getForm() {
    return cy.get('form');
  }
}
