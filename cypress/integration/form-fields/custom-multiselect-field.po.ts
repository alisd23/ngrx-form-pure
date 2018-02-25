/// <reference types="Cypress" />

export class CustomMultiselectField {
  public id: string;
  public optionPrefix: string;

  constructor(id: string, optionPrefix: string) {
    this.id = id;
    this.optionPrefix = optionPrefix;
  }

  public get options() {
    return cy.get(`#${this.id}`).find('.multiselect-item');
  }

  public findByValue(value: string) {
    return this.options.filter(`#genre-${value}`);
  }

  public select(value: string) {
    this
      .findByValue(value)
      .click();
  }

  public shouldBeSelected(value: string) {
    return this
      .findByValue(value)
      .should('have.class', 'selected');
  }

  public shouldHaveSelectedOptions(values: string[]) {
    this.options.should(($options) => {
      // Should have 4 options
      expect($options).to.have.length(5);

      // Use jquery's map to grab all values off the if, and check if they are selected
      const selected = $options.map((i, el) => {
        const value = el.id.split('-')[1];
        const isSelected = Cypress.$(el).hasClass('selected');
        return isSelected ? value : null;
      });

      // call selected.get() to make this a plain string array
      expect(selected.get().filter(Boolean)).to.deep.eq(values);
    });
  }
}
