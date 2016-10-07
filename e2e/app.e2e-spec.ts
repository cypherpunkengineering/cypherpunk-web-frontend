import { DesktopPage } from './app.po';

describe('desktop App', function() {
  let page: DesktopPage;

  beforeEach(() => {
    page = new DesktopPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
