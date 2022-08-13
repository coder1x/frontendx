import { boundMethod } from 'autobind-decorator';

class BreadCrumbs {
  private className: string = '';

  private breadCrumbs: HTMLElement;

  private items: HTMLElement | null = null;

  private markers: HTMLElement | null = null;

  private maxHeight: number = 0;

  constructor(className: string, elem: Element) {
    this.breadCrumbs = elem as HTMLElement;
    this.className = className.replace('.bread-crumbs', 'bread-crumbs');
    this.init();
  }

  private init() {
    this.items = this.breadCrumbs.querySelector(`.${this.className}__items`);
    this.markers = this.breadCrumbs.querySelector(`.${this.className}__markers`);
    this.makeMarkers();
    this.bindEvent();
  }

  // здесь нужен кастомный ресайз
  private bindEvent() {
    window.addEventListener('resize', this.makeMarkers);
  }

  @boundMethod
  private makeMarkers() {
    if (!this.items || !this.markers) return;
    this.maxHeight = this.items.offsetHeight;

    const marks = this.markers.querySelectorAll(`.${this.className}__marker`);
    marks.forEach((mark) => mark.remove());

    const addMarkers = (wrapper: HTMLElement, maxHeight: number) => {
      const element = document.createElement('li');
      element.innerText = '>';
      element.className = `${this.className}__marker`;
      wrapper.append(element);
      if (wrapper.offsetHeight < maxHeight) {
        addMarkers(wrapper, maxHeight);
      }
    };
    addMarkers(this.markers, this.maxHeight);
  }
}

export default BreadCrumbs;
