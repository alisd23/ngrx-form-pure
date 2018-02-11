import { $, ElementFinder, ElementArrayFinder, Key } from 'protractor';

export class SelectField {
  public select: ElementFinder;
  public options: ElementArrayFinder;

  constructor(fieldName: string) {
    this.select = $(`input[ngrxField='${fieldName}'`);
    this.options = this.select.$$('option');
  }

  public value() {
    return this.select.getAttribute('value');
  }

  public findOptionByValue(value: string) {
    return this.options
      .filter(element => element
        .getAttribute('value')
        .then(elValue => elValue === value)
      )
      .first();
  }

  public clickOption(value: string) {
    this
      .findOptionByValue(value)
      .click()
  }
}
