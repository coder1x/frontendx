import { boundMethod } from 'autobind-decorator';

import { PanelObserver, Throttle } from '@helpers/index';

interface Props {
  selector: string,
  nameAnimation: string
}

class ScrollHeader extends PanelObserver {
  private prevY = 0;

  private direction = 'bottom';

  private prevDirection = 'top';

  private header: HTMLElement | null = null;

  private className: string = '';

  private classes: string[] = [];

  private nameAnimation: string = '';

  private headerShow: boolean | null = null;

  private button: HTMLButtonElement | null = null;

  private search: HTMLButtonElement | null = null;

  private menu: HTMLElement | null = null;

  private buttonActive = '';

  private menuVisible = '';

  constructor(props: Props) {
    super();
    this.init(props);
  }

  get isFixed() {
    if (this.header) {
      return this.header.classList.contains(`${this.className}_fixed`);
    }

    return false;
  }

  private init(props: Props) {
    this.headerShow = true;
    this.className = props.selector.replace('.', '');
    this.classes = [
      `${this.className}_animating`,
    ];
    this.nameAnimation = props.nameAnimation;
    this.header = document.querySelector(this.className);

    this.setDomElement(props.selector);
    this.bindEvent();
  }

  private setDomElement(className: string) {
    if (!this.header) return false;

    this.menu = this.header.querySelector(`${className}__menu-wrapper`);
    this.button = this.header.querySelector(`${className}__toggle-menu`);
    this.search = this.header.querySelector(`${className}__toggle-side-panel`);

    return true;
  }

  // показать или отключить анимацию появления шапки
  private toggleHeader(classes: string[], callback?: Function) {
    if (!this.header) return false;

    const { classList } = this.header;

    this.header.addEventListener('animationend', (event: AnimationEvent) => {
      if (event.animationName !== this.nameAnimation) return;

      if (!this.headerShow) {
        classList.remove(...classes);

        if (typeof callback === 'function') { callback(); }
        this.headerShow = true;
      }
    }, { once: true });

    if (this.headerShow) {
      classList.add(...classes);
      this.headerShow = false;
    }
    return true;
  }

  private static getBodyElem() {
    return document.querySelector('body');
  }

  // направление скролла вверх или в низ.
  private moveHeader() {
    const body = ScrollHeader.getBodyElem();
    if (!this.header || !body) return false;

    const modifierFixed = `${this.className}_fixed`;
    const { classList } = this.header;

    if (this.direction === 'top' && !this.isFixed) {
      const height = this.header.offsetHeight;
      body.style.paddingTop = `${height}px`;
      classList.add(modifierFixed);

      this.toggleHeader([
        ...this.classes,
        `${this.className}_fixed-show`,
      ]);
    } else if (this.direction === 'bottom' && this.isFixed) {
      this.toggleHeader(
        [
          ...this.classes,
          `${this.className}_fixed-hide`,
        ],
        () => {
          body.style.paddingTop = '0px';
          classList.remove(modifierFixed);
        },
      );
    }
    return true;
  }

  // функция вызывается при скролле получая координаты Y
  @boundMethod
  private doSomething() {
    const { scrollY } = window;

    if (scrollY === 0) {
      const body = ScrollHeader.getBodyElem();
      if (!this.header || !body) return false;
      this.header.classList.remove(`${this.className}_fixed`);
      body.style.paddingTop = '0px';
      return true;
    }

    this.direction = this.prevY < scrollY ? 'bottom' : 'top';
    this.prevY = scrollY;

    const isMoved = this.direction !== this.prevDirection;

    if (isMoved) { this.moveHeader(); }

    this.prevDirection = this.direction;

    return true;
  }

  private bindEvent() {
    if (!this.button) return false;
    new Throttle(this.doSomething, 'scroll', 10); // подписываемся на событие скролла

    this.buttonActive = `${this.className}__toggle-menu_active`;
    this.menuVisible = `${this.className}__menu-wrapper_visible`;

    this.button.addEventListener('keydown', this.handleKeydownButton);
    this.button.addEventListener('click', this.handleClickButton);

    if (!this.search) return false;
    this.search.addEventListener('keydown', this.handleKeydownButton);
    this.search.addEventListener('click', this.handleClickButton);

    return true;
  }

  @boundMethod
  private handleClickButton(event: Event) {
    const target = event.target as HTMLElement;

    if (target.closest(`.${this.className}__toggle-menu`)) {
      if (!this.button || !this.menu) return false;

      this.button.classList.toggle(this.buttonActive);
      this.menu.classList.toggle(this.menuVisible);

      return true;
    }

    if (target.closest(`.${this.className}__toggle-side-panel`)) {
      if (!this.search) return false;

      this.search.classList.toggle(this.buttonActive);
      this.notify('toggle');

      return true;
    }
    return true;
  }

  @boundMethod
  private handleKeydownButton(event: KeyboardEvent) {
    const target = event.target as HTMLElement;

    if (target.closest(`.${this.className}__toggle-menu`)) {
      if (!this.button || !this.menu) return false;

      if (event.key === 'Escape' || event.key === 'Space') {
        this.button.classList.remove(this.buttonActive);
        this.menu.classList.remove(this.menuVisible);
      }
      return true;
    }

    if (target.closest(`.${this.className}__toggle-side-panel`)) {
      if (!this.search) return false;

      if (event.key === 'Escape' || event.key === 'Space') {
        this.notify('close');
      }
      return true;
    }
    return true;
  }
}

export default ScrollHeader;
