import { boundMethod } from 'autobind-decorator';

class ArticleCard {
  className: string = '';

  element: HTMLElement | null = null;

  private title: HTMLHeadingElement | null = null;

  private link: HTMLAnchorElement | null = null;

  private href: string | null = '';

  constructor(element: Element) {
    this.element = element as HTMLElement;
    this.className = '.js-article-card';
    this.init();
  }

  private init() {
    if (!this.element) {
      return false;
    }

    this.title = this.element.querySelector(`${this.className}__title`);
    this.link = this.element.querySelector(`${this.className}__title-link`);

    if (this.link) {
      this.href = this.link.getAttribute('href');
      this.bindEvent();
    }

    return true;
  }

  @boundMethod
  private handleHeaderKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();

      if (this.href) {
        document.location.href = this.href;
      }
    }
  }

  private bindEvent() {
    if (!this.title) {
      return false;
    }

    this.title.addEventListener('keydown', this.handleHeaderKeyDown);

    return true;
  }
}

export default ArticleCard;
