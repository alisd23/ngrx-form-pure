import { $, ElementFinder, Key } from 'protractor';

export class TextField {
  public input: ElementFinder;

  constructor(fieldName: string) {
    this.input = $(`input[ngrxField='${fieldName}'`);
  }

  public value() {
    return this.input.getAttribute('value');
  }

  public type(...args: string[]) {
    this.input.sendKeys(...args);
  }

  public backspace(times: number = 1) {
    for (let i = 0; i < times; i++) {
      this.input.sendKeys(Key.BACK_SPACE);
    }
  }
}