import { $, ElementFinder, Key, by } from 'protractor';

export class TextField {
  public input: ElementFinder;
  public label: ElementFinder;

  constructor(fieldName: string) {
    this.input = $(`input[ngrxField='${fieldName}'`);
    this.label = this.input.element(by.xpath('..')).$('label.error');
  }

  public value() {
    return this.input.getAttribute('value');
  }

  public type(...args: string[]) {
    this.input.sendKeys(...args);
  }

  public backspace(times: number = 1) {
    this.input.click();
    for (let i = 0; i < times; i++) {
      this.input.sendKeys(Key.BACK_SPACE);
    }
  }
}
