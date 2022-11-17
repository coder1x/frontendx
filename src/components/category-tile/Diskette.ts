import { boundMethod } from 'autobind-decorator';

class Diskette {
  className: string = '';

  element: HTMLElement | null = null;

  private blind: HTMLElement | null = null;

  private link: HTMLAnchorElement | null = null;

  private window: HTMLElement | null = null;

  constructor(element: Element) {
    this.className = 'js-category-tile';
    this.element = element as HTMLElement;
    this.init();
  }

  private init() {
    if (!this.element) {
      return false;
    }

    this.blind = this.element.querySelector(`.${this.className}__blind`);
    this.link = this.element.querySelector(`.${this.className}__link`);
    this.window = this.element.querySelector(`.${this.className}__window-disk`);
    this.bindEvent();

    return true;
  }

  private openBlind(isOpen = false) {
    if (!this.blind || !this.window) {
      return false;
    }

    const name = this.className.replace('js-', '');

    const blindOpen = `${name}__blind_open`;
    const diskOpen = `${name}__window-disk_open`;

    if (isOpen) {
      this.blind.classList.add(blindOpen);
      this.window.classList.add(diskOpen);
    } else {
      this.blind.classList.remove(blindOpen);
      this.window.classList.remove(diskOpen);
    }

    return true;
  }

  @boundMethod
  private handleBlindOpen() {
    this.openBlind(true);
  }

  @boundMethod
  private handleBlindClose() {
    this.openBlind();
  }

  private bindEvent() {
    if (!this.link) {
      return false;
    }

    this.link.addEventListener('mouseover', this.handleBlindOpen);
    this.link.addEventListener('focus', this.handleBlindOpen);
    this.link.addEventListener('blur', this.handleBlindClose);
    this.link.addEventListener('mouseout', this.handleBlindClose);

    return true;
  }
}

export default Diskette;
