import { $, $$, ElementArrayFinder } from 'protractor';

export class CheckboxGroupField {
  public options: ElementArrayFinder;

  constructor(fieldName: string) {
    this.options = $$(`[ngrxField='${fieldName}'`);
  }

  public findByValue(value: string) {
    return this.options
      .filter(element => element
        .getAttribute('value')
        .then(elValue => elValue === value)
      )
      .first();
  }

  public select(value: string) {
    this
      .findByValue(value)
      .click();
  }

  public isSelected(value: string) {
    return this
      .findByValue(value)
      .getAttribute('checked')
      .then(isChecked => isChecked === 'true');
  }

  public selectedValues() {
    return this.options
      .filter(input => input
        .getAttribute('checked')
        .then(isChecked => isChecked === 'true')
      )
      .map<string>(option => option.getAttribute('value'));
  }
}
