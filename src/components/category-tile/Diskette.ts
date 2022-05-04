import { boundMethod } from 'autobind-decorator';

class Diskette {
  className: string = '';

  blind: HTMLElement | null = null;

  categoryTile: HTMLElement | null = null;

  link: HTMLElement | null = null;

  window: HTMLElement | null = null;

  constructor(className: string, elem: Element) {
    this.className = className;
    this.categoryTile = elem as HTMLElement;
    this.init();
  }

  init() {
    if (!this.categoryTile) return false;

    this.blind = this.categoryTile.querySelector(`${this.className}__lid`);
    this.link = this.categoryTile.querySelector(`${this.className}__link`);
    this.window = this.categoryTile.querySelector(`${this.className}__window-disk`);
    this.bindEvent();

    return true;
  }

  openBlind(isOpen = false) {
    const name = this.className.replace('.', '');
    if (!this.blind || !this.window) return false;
    if (isOpen) {
      this.blind.classList.add(`${name}__lid_open`);
      this.window.classList.add(`${name}__window-disk_open`);
    } else {
      this.blind.classList.remove(`${name}__lid_open`);
      this.window.classList.remove(`${name}__window-disk_open`);
    }
    return true;
  }

  @boundMethod
  blindOpen() {
    this.openBlind(true);
  }

  @boundMethod
  blindClose() {
    this.openBlind();
  }

  bindEvent() {
    if (!this.link) return false;
    this.link.addEventListener('mouseover', this.blindOpen);
    this.link.addEventListener('focus', this.blindOpen);
    this.link.addEventListener('blur', this.blindClose);
    this.link.addEventListener('mouseout', this.blindClose);

    return true;
  }
}

export default Diskette;
