import { boundMethod } from 'autobind-decorator';

class Archive {
  className: string = '';

  year: HTMLElement | null = null;

  months: HTMLElement | null = null;

  constructor(className: string, elem: Element) {
    this.year = elem as HTMLElement;
    this.init();
  }

  init() {
    if (!this.year) return false;
    this.months = this.year.querySelector('.archive__months');
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
    if (e.code === 'Escape') {
      this.closeList();
    }

    const target = e.target as HTMLElement;
    const condition = !target.classList.contains('archive__articles-link')
      && (e.code === 'Enter' || e.code === 'Space');

    if (condition) {
      e.preventDefault();
      this.toggleList();
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

  bindEvent() {
    if (!this.year) return false;
    this.year.addEventListener('mousedown', Archive.handleMonthsMouseDown);
    this.year.addEventListener('click', this.handleMonthsClick);
    this.year.addEventListener('keydown', this.handleMonthsKeyDown);
    return true;
  }
}

export default Archive;
