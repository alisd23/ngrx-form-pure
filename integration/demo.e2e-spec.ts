import { element } from 'protractor';
import { DemoPage } from './demo.po';

describe('ngrx-form integration tests', () => {
  let page: DemoPage;

  // Currently these tests all run in sequence, without a refresh inbetween.
  // This makes the tests much quicker to run.
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
      const selectedGenres = ['pop', 'jazz'];
      selectedGenres.forEach(genre => {
        page.genreMultiselect.select(genre);
      })
      expect(page.genreMultiselect.selectedValues()).toEqual(selectedGenres);
    });

    it('clicking a selected item should unselect it', () => {
      page.genreMultiselect.select('jazz');
      const selectedGenres = ['pop'];
      expect(page.genreMultiselect.selectedValues()).toEqual(selectedGenres);
    });
  });

  describe('Favorite band radio group', () => {
    it('clicking a radio input should select it', () => {
      expect(page.bandRadioGroup.getSelectedValue().isPresent()).toBeFalsy();
      page.bandRadioGroup.select('smashMouth');
      expect(page.bandRadioGroup.isSelected('smashMouth')).toBe(true);
      expect(page.bandRadioGroup.isSelected('bagRaiders')).toBe(false);
    });

    it('clicking a selected input does nothing', () => {
      page.bandRadioGroup.select('smashMouth');
      expect(page.bandRadioGroup.isSelected('smashMouth')).toBe(true);
      expect(page.bandRadioGroup.isSelected('bagRaiders')).toBe(false);
    });

    it('clicking a different radio input should selected it and deselect the previous input', () => {
      page.bandRadioGroup.select('bagRaiders');
      expect(page.bandRadioGroup.isSelected('smashMouth')).toBe(false);
      expect(page.bandRadioGroup.isSelected('bagRaiders')).toBe(true);
    });
  });

  describe('Hobbies checkbox group', () => {
    it('clicking a checkbox selects it', () => {
      page.hobbiesCheckboxGroup.select('music');
      expect(page.hobbiesCheckboxGroup.selectedValues()).toEqual(['music']);
      page.hobbiesCheckboxGroup.select('football');
      expect(page.hobbiesCheckboxGroup.selectedValues()).toEqual(['football', 'music']);
    });

    it('clicking a selected checkbox unselects it', () => {
      page.hobbiesCheckboxGroup.select('football');
      expect(page.hobbiesCheckboxGroup.selectedValues()).toEqual(['music']);
    });
  });
});
