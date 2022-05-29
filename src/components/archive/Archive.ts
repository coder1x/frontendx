/* eslint-disable no-undef */
import { boundMethod } from 'autobind-decorator';

class Archive {
  className: string = '';

  year: HTMLElement | null = null;

  months: HTMLElement | null = null;

  links: NodeListOf<Element> | null = null;

  constructor(className: string, elem: Element) {
    this.year = elem as HTMLElement;
    this.init();
  }

  init() {
    if (!this.year) return false;
    this.months = this.year.querySelector('.archive__months');
    this.links = this.year.querySelectorAll('.archive__articles-link');
    this.bindEvent();

    return true;
  }

  static handleMonthsMouseDown(e: MouseEvent) {
    e.preventDefault();
  }

  @boundMethod
  handleMonthsClick() {
    this.toggleList();
  }

  @boundMethod
  handleMonthsKeyDown(e: KeyboardEvent) {
    const currentTarget = e.currentTarget as HTMLElement;
    if (e.code === 'Escape') {
      this.closeList();
      this.toggleLinksAvailability();
      currentTarget.focus();
    }

    const target = e.target as HTMLElement;
    const isLink = target.classList.contains('archive__articles-link');
    const condition = !isLink && (e.code === 'Enter' || e.code === 'Space');

    if (condition) {
      e.preventDefault();
      this.toggleList();
      this.toggleLinksAvailability();
    }

    if (isLink && e.code === 'Space') {
      e.preventDefault();
    }
  }

  toggleList() {
    if (!this.months) return false;
    this.months.classList.toggle('archive__months_visually-hidden');
    return true;
  }

  closeList() {
    if (!this.months) return false;
    this.months.classList.add('archive__months_visually-hidden');
    return true;
  }

  toggleLinksAvailability() {
    if (this.months && this.links) {
      if (this.months.classList.contains('archive__months_visually-hidden')) {
        this.links.forEach((link) => link.setAttribute('tabindex', '-1'));
      } else {
        this.links.forEach((link) => link.removeAttribute('tabindex'));
      }
    }
  }

  bindEvent() {
    if (!this.year) return false;
    this.year.addEventListener('mousedown', Archive.handleMonthsMouseDown);
    this.year.addEventListener('click', this.handleMonthsClick);
    this.year.addEventListener('keydown', this.handleMonthsKeyDown);
    return true;
  }
}

export default Archive;
