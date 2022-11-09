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

    console.log('Archive');
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
  private handleYearClick() {
    if (!this.element) {
      return false;
    }
    console.log('fdfd');

    return true;
  }

  private bindEvent() {
    this.elementsYears?.forEach((element) => {
      element.addEventListener('click', this.handleYearClick);
    });
  }
}

export default Archive;
