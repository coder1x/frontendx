import { boundMethod } from 'autobind-decorator';

class ArticleCard {
  className: string = '';

  element: HTMLElement | null = null;

  title: HTMLHeadingElement | null = null;

  link: HTMLAnchorElement | null = null;

  href: string | null = '';

  constructor(element: Element) {
    this.element = element as HTMLElement;
    this.className = '.js-article-card';
    this.init();
  }

  init() {
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
  handleHeaderKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();

      if (this.href) {
        document.location.href = this.href;
      }
    }
  }

  bindEvent() {
    if (!this.title) {
      return false;
    }

    this.title.addEventListener('keydown', this.handleHeaderKeyDown);

    return true;
  }
}

export default ArticleCard;
