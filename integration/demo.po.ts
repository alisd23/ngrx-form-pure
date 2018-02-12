import { browser, by, element } from 'protractor';
import { TextField } from './form-fields/text-field.po';
import { SelectField } from './form-fields/select-field.po';
import { RadioGroupField } from './form-fields/radio-group-field.po';
import { CheckboxGroupField } from './form-fields/checkbox-group-field.po';
import { CustomMultiselectField } from './form-fields/custom-multiselect-field.po';

export class DemoPage {
  nameInput = new TextField('name');
  colourSelect = new SelectField('colour');
  genreMultiselect = new CustomMultiselectField('genre-multiselect', 'genre');
  bandRadioGroup = new RadioGroupField('favouriteBand');
  hobbiesCheckboxGroup = new CheckboxGroupField('hobbies');

  navigateTo() {
    return browser.get('/');
  }

  getForm() {
    return element(by.css('form'));
  }
}
