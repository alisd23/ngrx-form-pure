import { DemoPage } from './demo.po';

describe('ngrx-form-pure integration tests', () => {
  let page: DemoPage;

  // Currently these tests all run in sequence, without a refresh inbetween.
  // This makes the tests much quicker to run.
  before(() => {
    page = new DemoPage();
  });

  it('should display form', () => {
    page.getForm().should('be.visible');
  });

  describe('Name input', () => {
    it('should display correct initial errors after focus and blur', () => {
      page.nameInput.input.click();
      page.nameInput.input.blur();
      page.nameInput.label.should('be.visible');
    });

    it('should respond to typing characters', () => {
      page.nameInput.type('fred');
      page.nameInput.input.should('have.value', 'fred');
      page.nameInput.label.should('not.exist');
    });

    it('should respond to deleting characters', () => {
      page.nameInput.backspace(2);
      page.nameInput.input.should('have.value', 'fr');
    });
  });

  describe('Colour Select', () => {
    it('should respond to clicking options', () => {
      page.colourSelect.select('green');
      page.colourSelect.should('have.value', 'green');
      page.colourSelect.select('blue');
      page.colourSelect.should('have.value', 'blue');
    });
  });

  describe('custom select list component', () => {
    it('clicking an unselected item should select it', () => {
      const selectedGenres = ['pop', 'jazz'];
      selectedGenres.forEach(genre => {
        page.genreMultiselect.select(genre);
      })
      page.genreMultiselect.shouldHaveSelectedOptions(selectedGenres);
    });

    it('clicking a selected item should unselect it', () => {
      page.genreMultiselect.select('jazz');
      const selectedGenres = ['pop'];
      page.genreMultiselect.shouldHaveSelectedOptions(selectedGenres);
    });
  });

  describe('Favorite band radio group', () => {
    it('clicking a radio input should select it', () => {
      page.bandRadioGroup.getSelectedValue().should('not.exist');
      page.bandRadioGroup.select('smashMouth');
      page.bandRadioGroup.shouldBeSelected('smashMouth');
      page.bandRadioGroup.shouldNotBeSelected('bagRaiders');
    });

    it('clicking a selected input does nothing', () => {
      page.bandRadioGroup.select('smashMouth');
      page.bandRadioGroup.shouldBeSelected('smashMouth');
      page.bandRadioGroup.shouldNotBeSelected('bagRaiders');
    });

    it('clicking a different radio input should selected it and deselect the previous input', () => {
      page.bandRadioGroup.select('bagRaiders');
      page.bandRadioGroup.shouldBeSelected('bagRaiders');
      page.bandRadioGroup.shouldNotBeSelected('smashMouth');
    });
  });

  describe('Hobbies checkbox group', () => {
    it('clicking a checkbox selects it', () => {
      page.hobbiesCheckboxGroup.select('music');
      page.hobbiesCheckboxGroup.shouldHaveSelectedOptions(['music']);
      page.hobbiesCheckboxGroup.select('football');
      page.hobbiesCheckboxGroup.shouldHaveSelectedOptions(['football', 'music']);
    });

    // it('clicking a selected checkbox unselects it', () => {
    //   page.hobbiesCheckboxGroup.select('football');
    //   expect(page.hobbiesCheckboxGroup.selectedValues()).toEqual(['music']);
    // });
  });
});
