/* eslint-disable no-undef */
import { boundMethod } from 'autobind-decorator';

class Archive {
  private className: string = '';

  private year: HTMLElement | null = null;

  private months: HTMLElement | null = null;

  private links: NodeListOf<Element> | null = null;

  constructor(className: string, elem: Element) {
    this.year = elem as HTMLElement;
    this.className = className.replace('.archive__year', 'archive');
    this.init();
  }

  private init() {
    if (!this.year) return false;
    this.months = this.year.querySelector(`.${this.className}__months`);
    this.links = this.year.querySelectorAll(`.${this.className}__articles-link`);
    this.bindEvent();

    return true;
  }

  private static handleMonthsMouseDown(event: MouseEvent) {
    event.preventDefault();
  }

  @boundMethod
  private handleMonthsClick() {
    this.toggleList();
  }

  @boundMethod
  private handleMonthsKeyDown(event: KeyboardEvent) {
    const currentTarget = event.currentTarget as HTMLElement;
    if (event.code === 'Escape') {
      this.closeList();
      this.toggleLinksAvailability();
      const month = currentTarget.querySelector(`.${this.className}__text-wrapper`) as HTMLElement;
      month.focus();
    }

    const target = event.target as HTMLElement;
    const isLink = target.classList.contains(`${this.className}__articles-link`);
    const condition = !isLink && (event.code === 'Enter' || event.code === 'Space');

    if (condition) {
      event.preventDefault();
      this.toggleList();
      this.toggleLinksAvailability();
    }

    if (isLink && event.code === 'Space') {
      event.preventDefault();
    }
  }

  private toggleList() {
    if (!this.months) return false;
    this.months.classList.toggle(`${this.className}__months_visually-hidden`);
    return true;
  }

  private closeList() {
    if (!this.months) return false;
    this.months.classList.add(`${this.className}__months_visually-hidden`);
    return true;
  }

  private toggleLinksAvailability() {
    if (!this.months || !this.links) return false;
    if (this.months.classList.contains(`${this.className}__months_visually-hidden`)) {
      this.links.forEach((link) => link.setAttribute('tabindex', '-1'));
    } else {
      this.links.forEach((link) => link.removeAttribute('tabindex'));
    }
    return true;
  }

  private bindEvent() {
    if (!this.year) return false;
    this.year.addEventListener('mousedown', Archive.handleMonthsMouseDown);
    this.year.addEventListener('click', this.handleMonthsClick);
    this.year.addEventListener('keydown', this.handleMonthsKeyDown);
    return true;
  }
}

export default Archive;
