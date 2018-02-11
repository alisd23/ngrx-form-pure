import { browser, by, element } from 'protractor';
import { TextField } from './form-fields/text-field.po';
import { SelectField } from './form-fields/select-field.po';
import { CustomMultiselectField } from './form-fields/custom-multiselect-field.po';

export class DemoPage {
  nameInput = new TextField('name');
  colourSelect = new SelectField('colour');
  genreMultiselect = new CustomMultiselectField('genre-multiselect', 'genre');

  navigateTo() {
    return browser.get('/');
  }

  getForm() {
    return element(by.css('form'));
  }
}
