import { $, $$, ElementArrayFinder } from 'protractor';

export class CustomMultiselectField {
  public options: ElementArrayFinder;
  public optionPrefix: string;

  constructor(id: string, optionPrefix: string) {
    this.optionPrefix = optionPrefix;
    this.options = $(`#${id}`).$$('.multiselect-item');
  }

  public findByValue(value: string) {
    return this.options
      .filter(element => element
        .getAttribute('id')
        .then(id => id === `genre-${value}`)
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
      .getAttribute('class')
      .then(classString => classString.includes('selected'));
  }

  public selectedValues() {
    return this.options
      .map<string>(option => option
        .getAttribute('id')
        .then(id => {
          const value = id.split('-')[1];
          return this
            .isSelected(value)
            .then(isSelected => isSelected ? value : null);
        })
      )
      .then(a => a.filter(Boolean));
  }
}
