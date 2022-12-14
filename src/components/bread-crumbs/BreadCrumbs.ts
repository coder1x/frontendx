import { boundMethod } from 'autobind-decorator';

import { Throttle } from '@helpers/index';

class BreadCrumbs {
  className: string = '';

  element: HTMLElement;

  private items: HTMLUListElement | null = null;

  private markers: HTMLElement | null = null;

  private lineHeight: number = 0;

  constructor(element: Element) {
    this.element = element as HTMLElement;
    this.className = 'js-bread-crumbs';

    if (this.element) {
      this.init();
    }
  }

  private init() {
    this.setDomElem();

    if (!this.items || !this.markers) {
      return false;
    }

    this.lineHeight = parseFloat(window.getComputedStyle(this.items).lineHeight);

    this.makeMarkers();
    this.bindEvent();

    return true;
  }

  private setDomElem() {
    this.items = this.element.querySelector(`.${this.className}__items`);
    this.markers = this.element.querySelector(`.${this.className}__markers`);
  }

  private bindEvent() {
    new Throttle(this.makeMarkers, 'resize', 20); // подписываемся на событие ресайза
  }

  private deleteMarkers() {
    if (!this.markers) {
      return false;
    }

    const marks = this.markers.querySelectorAll(`.${this.className}__marker`);
    marks.forEach((mark) => mark.remove());

    return true;
  }

  @boundMethod
  private makeMarkers() {
    if (!this.markers || !this.items) {
      return false;
    }

    this.deleteMarkers();

    const maxHeight = this.items.offsetHeight;
    const count = Math.round(maxHeight / this.lineHeight);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const element = document.createElement('li');

      element.innerText = '>';
      element.className = `bread-crumbs__marker ${this.className}__marker`;
      fragment.append(element);
    }

    this.markers.append(fragment);

    return true;
  }
}

export default BreadCrumbs;
