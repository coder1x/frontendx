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

  toggleList() {
    if (!this.months) return false;
    this.months.classList.toggle('archive__months_visually-hidden');
    return true;
  }

  @boundMethod
  blindToggle() {
    this.toggleList();
  }

  bindEvent() {
    if (!this.year) return false;
    this.year.addEventListener('focus', this.blindToggle);
    this.year.addEventListener('blur', this.blindToggle);
    this.year.addEventListener('click', this.blindToggle);
    return true;
  }
}

export default Archive;
