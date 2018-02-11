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
      const selectedGenres = ['jazz', 'pop'];
      selectedGenres.forEach(genre => {
        page.genreMultiselect.select(genre);
      })
      page.genreMultiselect.options.each(option => {
        option.getAttribute('id').then(id => {
          const genre = id.split('-')[1];
          expect(page.genreMultiselect.isSelected(genre))
            .toBe(selectedGenres.some(g => g === genre));
        })
      });
    });

    it('clicking a selected item should unselect it', () => {
      page.genreMultiselect.select('jazz');
      const selectedGenres = ['pop'];
      page.genreMultiselect.options.each(option => {
        option.getAttribute('id').then(id => {
          const genre = id.split('-')[1];
          expect(page.genreMultiselect.isSelected(genre))
            .toBe(selectedGenres.some(g => g === genre));
        });
      });
    });
  });
});
