/// <reference types="cypress" />

export class TextField {
  private fieldName: string;

  constructor(fieldName: string) {
    this.fieldName = fieldName
  }

  public get input() {
    return cy.get(`input[ngrxField='${this.fieldName}']`);
  }

  public get label() {
    return this.input.parent().find('label.error');
  }

  public type(text: string) {
    this.input.type(text);
  }

  public backspace(times: number = 1) {
    this.input.focus();
    for (let i = 0; i < times; i++) {
      this.input.type('{backspace}');
    }
  }
}
