import { element } from 'protractor';
import { DemoPage } from './demo.po';

describe('ngrx-form integration tests', () => {
  let page: DemoPage;

  beforeEach(() => {
    page = new DemoPage();
  });

  it('should display form', () => {
    page.navigateTo();
    expect(page.getForm().isDisplayed()).toBe(true);
  });

  describe('Name input', () => {
    it('should respond to typing characters', () => {
      page.nameInput.type('fred');
      expect(page.nameInput.value()).toBe('fred');
    });

    it('should respond to deleting characters', () => {
      page.nameInput.type('fred');
      page.nameInput.backspace(2);
      expect(page.nameInput.value()).toBe('fr');
    });
  });

  describe('Colour Select', () => {
    it('should respond to clicking options', () => {
      page.colourSelect.clickOption('green');
      expect(page.colourSelect.value()).toEqual('green');
      page.colourSelect.clickOption('blue');
      expect(page.colourSelect.value()).toEqual('blue');
    });
  });

  describe('custom select list component', () => {
    it('clicking an unselected item should select it', () => {

    });

    it('clicking a selected item should unselect it', () => {

    });
  });
});
