/// <reference types="Cypress" />

export class RadioGroupField {
  private fieldName: string;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }

  public get options() {
    return cy.get(`[ngrxField='${this.fieldName}']`);
  }

  public optionByValue(value: string) {
    return this.options.filter(`[value='${value}']`)
  }

  public select(value: string) {
    this
      .optionByValue(value)
      .check();
  }

  public shouldBeSelected(value: string) {
    return this
      .optionByValue(value)
      .should('be.checked');
  }

  public shouldNotBeSelected(value: string) {
    return this
      .optionByValue(value)
      .should('be.not.checked');
  }

  public getSelectedValue() {
    return this.options
      .filter('[checked]');
  }
}
