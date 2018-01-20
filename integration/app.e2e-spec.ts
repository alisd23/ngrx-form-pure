import { DemoPage } from './app.po';

describe('ngrx-form integration tests', () => {
  let page: DemoPage;

  beforeEach(() => {
    page = new DemoPage();
  });

  it('should display form', () => {
    page.navigateTo();
    expect(page.getForm().isDisplayed()).toBe(true);
  });
});
