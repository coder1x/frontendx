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

  private toggle(target: EventTarget | null, currentTarget: EventTarget | null, isClosed = false) {
    const element = target as HTMLElement;
    const elementYear = currentTarget as HTMLElement;

    if (!element || !elementYear) {
      return false;
    }

    if (element.closest(`.${this.className}__text-wrapper`)) {
      const months = elementYear.querySelector(`.${this.className}__months`) as HTMLElement;

      if (months) {
        const variantExpandable = 'archive__months_variant_expandable';

        const { classList } = months;

        if (isClosed) {
          classList.remove(variantExpandable);
        } else {
          classList.toggle(variantExpandable);
        }
      }
    }

    return true;
  }

  @boundMethod
  private handleYearClick(event: Event) {
    this.toggle(event.target, event.currentTarget);
  }

  @boundMethod
  private handleYearKeyDown(event: KeyboardEvent) {
    const isEnter = event.key === 'Enter';
    const isSpace = event.key === ' ';

    if (isEnter || isSpace) {
      event.preventDefault();
      this.toggle(event.target, event.currentTarget);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.toggle(event.target, event.currentTarget, true);
    }
  }

  private bindEvent() {
    this.elementsYears?.forEach((element) => {
      const elementYear = element as HTMLElement;

      elementYear.addEventListener('click', this.handleYearClick);
      elementYear.addEventListener('keydown', this.handleYearKeyDown);
    });
  }
}

export default Archive;
