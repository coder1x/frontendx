import { boundMethod } from 'autobind-decorator';

class ArticleCard {
  className: string = '';

  card: HTMLElement | null = null;

  header: HTMLElement | null = null;

  link: HTMLElement | null = null;

  href: string | null = '';

  constructor(className: string, elem: Element) {
    this.card = elem as HTMLElement;
    this.className = className;
    this.init();
  }

  init() {
    if (!this.card) return false;

    this.header = this.card.querySelector(`${this.className}__header`);
    this.link = this.card.querySelector(`${this.className}__header-link`);

    if (!this.link) return false;

    this.href = this.link.getAttribute('href');
    this.bindEvent();

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
    if (!this.header) return false;

    this.header.addEventListener('keydown', this.handleHeaderKeyDown);

    return true;
  }
}

export default ArticleCard;
