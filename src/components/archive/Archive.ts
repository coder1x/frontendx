import { boundMethod } from 'autobind-decorator';

class Archive {
  private className: string = '';

  private element: Element | null = null;

  private elementsYears: Element[] | null = null;

  constructor(element: Element) {
    this.element = element;
    this.className = 'js-archive';
    this.init();
  }

  private init() {
    this.setDomElement();
    this.bindEvent();
  }

  private setDomElement() {
    if (!this.element) {
      return false;
    }

    this.elementsYears = [
      ...this.element.querySelectorAll(`.${this.className}__year`),
    ] as Element[];

    return true;
  }

  @boundMethod
  private handleYearClick(event: any) {
    if (!this.element) {
      return false;
    }

    const element = event.currentTarget as HTMLElement;

    const months = element.querySelector('.archive__months') as HTMLElement;

    months.classList.toggle('archive__months_variant_expandable');

    return true;
  }

  private bindEvent() {
    this.elementsYears?.forEach((element) => {
      element.addEventListener('click', this.handleYearClick);
    });
  }
}

export default Archive;
