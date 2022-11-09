import { boundMethod } from 'autobind-decorator';

import { Throttle } from '@helpers/index';

class BreadCrumbs {
  private className: string = '';

  private breadCrumbs: HTMLElement;

  private items: HTMLUListElement | null = null;

  private markers: HTMLElement | null = null;

  private lineHeight: number = 0;

  constructor(className: string, elem: Element) {
    this.breadCrumbs = elem as HTMLElement;
    this.className = className.replace('.bread-crumbs', 'bread-crumbs');
    this.init();
  }

  private init() {
    this.items = this.breadCrumbs.querySelector(`.${this.className}__items`);
    this.markers = this.breadCrumbs.querySelector(`.${this.className}__markers`);

    if (!this.items || !this.markers) return;

    this.lineHeight = parseFloat(window.getComputedStyle(this.items).lineHeight);

    this.makeMarkers();
    this.bindEvent();
  }

  private bindEvent() {
    new Throttle('resize', this.makeMarkers, 10); // подписываемся на событие ресайза
  }

  @boundMethod
  private makeMarkers() {
    if (!this.markers || !this.items) return;

    // удаляем существующие галочки
    const marks = this.markers.querySelectorAll(`.${this.className}__marker`);
    marks.forEach((mark) => mark.remove());

    const maxHeight = this.items.offsetHeight;
    const count = Math.round(maxHeight / this.lineHeight);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const element = document.createElement('li');
      element.innerText = '>';
      element.className = `${this.className}__marker`;
      fragment.append(element);
    }

    this.markers.append(fragment);
  }
}

export default BreadCrumbs;
