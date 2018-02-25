/// <reference types="Cypress" />

export class CheckboxGroupField {
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

  public shouldHaveSelectedOptions(values: string[]) {
    return this.options
      .should(($options) => {
        // Use jquery's map to grab all values off the if, and check if they are selected.
        // NOTE: typings for checkedValues are incorrect
        const checkedValues = $options
        .map((i, el) => Cypress.$(el).is(':checked')
          ? Cypress.$(el).attr('value')
          : null
        );

        // call selected.get() to make this a plain string array
        expect(checkedValues.get().filter(Boolean)).to.deep.eq(values);
      });
  }
}
