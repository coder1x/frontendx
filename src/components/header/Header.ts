import { boundMethod } from 'autobind-decorator';

import { Throttle } from '@helpers/index';

class Header {
  private prevY = 0;

  private direction = 'bottom';

  private prevDirection = 'top';

  private element: HTMLElement | null = null;

  private className: string = '';

  private classHeader: string = '';

  private classes: string[] = [];

  private headerShow: boolean | null = null;

  private button: HTMLButtonElement | null = null;

  private sidePanel: HTMLButtonElement | null = null;

  private menu: HTMLElement | null = null;

  private callbackAnimationEnd = () => { };

  private buttonActive = '';

  private menuVisible = '';

  constructor(element: Element) {
    this.element = element as HTMLElement;
    this.className = 'js-header';
    this.classHeader = 'header';

    if (this.element) {
      this.init();
    }
  }

  private isFixed() {
    if (this.element) {
      return this.element.classList.contains(`.${this.classHeader}_fixed`);
    }

    return false;
  }

  private init() {
    this.headerShow = true;
    this.buttonActive = `${this.classHeader}__toggle-menu_active`;
    this.menuVisible = `${this.classHeader}__menu-wrapper_visible`;

    this.setDomElement();
    this.bindEvent();
  }

  private setDomElement() {
    if (!this.element) {
      return false;
    }

    this.menu = this.element.querySelector(`.${this.className}__menu-wrapper`);
    this.button = this.element.querySelector(`.${this.className}__toggle-menu`);
    this.sidePanel = this.element.querySelector(`.${this.className}__toggle-side-panel`);

    return true;
  }

  // показать или отключить анимацию появления шапки
  private toggleHeader() {
    if (!this.element) {
      return false;
    }

    this.element.addEventListener('animationend', this.handleHeaderAnimationEnd, { once: true });

    if (this.headerShow) {
      this.element.classList.add(...this.classes);
      this.headerShow = false;
    }

    return true;
  }

  @boundMethod
  private handleHeaderAnimationEnd(event: AnimationEvent) {
    if (event.animationName !== 'fixedHeaderAnimation' || !this.element) {
      return false;
    }

    const { classList } = this.element;

    if (!this.headerShow) {
      classList.remove(...this.classes);

      this.callbackAnimationEnd();
      this.headerShow = true;
    }

    return true;
  }

  // направление скролла вверх или в низ.
  private moveHeader() {
    const { body } = document;
    if (!this.element || !body) {
      return false;
    }

    const modifierFixed = `${this.classHeader}_fixed`;
    const { classList } = this.element;

    const isBottom = this.direction === 'bottom';
    const isTop = this.direction === 'top';
    const modifierAnimating = `${this.classHeader}_animating`;

    if (isTop && !this.isFixed()) {
      const height = this.element.offsetHeight;

      body.style.paddingTop = `${height}px`;
      classList.add(modifierFixed);

      this.classes = [
        modifierAnimating,
        `${this.classHeader}_fixed-show`,
      ];
      this.toggleHeader();

      return true;
    }

    if (isBottom && this.isFixed()) {
      this.classes = [
        modifierAnimating,
        `${this.classHeader}_fixed-hide`,
      ];

      this.callbackAnimationEnd = () => {
        body.style.paddingTop = '0px';
        classList.remove(modifierFixed);
      };

      this.toggleHeader();

      return true;
    }
    return true;
  }

  // функция вызывается при скролле получая координаты Y
  @boundMethod
  private doSomething() {
    const { body } = document;

    if (!this.element || !body) {
      return false;
    }

    const { scrollY } = window;

    if (scrollY === 0) {
      this.element.classList.remove(`${this.classHeader}_fixed`);
      body.style.paddingTop = '0px';

      return true;
    }

    this.direction = this.prevY < scrollY ? 'bottom' : 'top';
    this.prevY = scrollY;

    if (this.direction !== this.prevDirection) {
      this.moveHeader();
    }

    this.prevDirection = this.direction;

    return true;
  }

  private bindEvent() {
    new Throttle(this.doSomething, 'scroll', 10); // подписываемся на событие скролла

    if (!this.button) {
      return false;
    }

    this.button.addEventListener('keydown', this.handleButtonKeyDown);
    this.button.addEventListener('click', this.handleButtonClick);

    if (!this.sidePanel) {
      return false;
    }
    this.sidePanel.addEventListener('keydown', this.handleSidePanelKeyDown);
    this.sidePanel.addEventListener('click', this.handleSidePanelClick);

    return true;
  }

  @boundMethod
  private handleSidePanelClick() {
    if (!this.sidePanel) {
      return false;
    }

    this.sidePanel.classList.toggle(this.buttonActive);
    // this.notify('toggle');

    return true;
  }

  @boundMethod
  private handleButtonClick() {
    if (!this.button || !this.menu) {
      return false;
    }

    this.button.classList.toggle(this.buttonActive);
    this.menu.classList.toggle(this.menuVisible);

    return true;
  }

  private handleSidePanelKeyDown() {
    if (!this.sidePanel) {
      return false;
    }

    // if (event.key === 'Escape') {
    //   // this.notify('close');
    // }
    return true;
  }

  @boundMethod
  private handleButtonKeyDown(event: KeyboardEvent) {
    if (!this.button || !this.menu) {
      return false;
    }

    if (event.key === 'Escape') {
      this.button.classList.remove(this.buttonActive);
      this.menu.classList.remove(this.menuVisible);
    }

    return true;
  }
}

export default Header;
