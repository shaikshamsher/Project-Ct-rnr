import { RETechWebPage } from './app.po';

describe('retech-web App', () => {
  let page: RETechWebPage;

  beforeEach(() => {
    page = new RETechWebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
