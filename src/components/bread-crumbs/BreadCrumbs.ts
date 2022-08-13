import { boundMethod } from 'autobind-decorator';

class BreadCrumbs {
  private className: string = '';

  private breadCrumbs: HTMLElement;

  private items: HTMLElement | null = null;

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

  // здесь нужен кастомный ресайз
  private bindEvent() {
    window.addEventListener('resize', this.makeMarkers);
  }

  @boundMethod
  private makeMarkers() {
    if (!this.markers || !this.items) return;

    // удаляем существующие галочки
    const marks = this.markers.querySelectorAll(`.${this.className}__marker`);
    marks.forEach((mark) => mark.remove());

    const maxHeight = this.items.offsetHeight;
    console.log('maxHeight>>>', maxHeight);
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
