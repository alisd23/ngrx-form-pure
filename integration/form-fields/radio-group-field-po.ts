import { $$, ElementArrayFinder } from 'protractor';

export class RadioGroupField {
  public inputs: ElementArrayFinder;

  constructor(fieldName: string) {
    this.inputs = $$(`[ngrxField='${fieldName}'`);
  }

  public findByValue(value: string) {
    return this.inputs
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
}
