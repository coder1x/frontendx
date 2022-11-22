import { boundMethod } from 'autobind-decorator';

import { Throttle } from '@helpers/index';

class Header {
  element: HTMLElement | null = null;

  className: string = '';

  private prevY = 0;

  private direction = 'bottom';

  private prevDirection = 'top';

  private classHeader: string = '';

  private classes: string[] = [];

  private headerShow: boolean | null = null;

  private isFixed = false;

  private button: HTMLButtonElement | null = null;

  private sidePanel: HTMLButtonElement | null = null;

  private menu: HTMLElement | null = null;

  private toggleMenuActive = '';

  private toggleSidePanelActive = '';

  private menuVisible = '';

  private callbackAnimationEnd: Function | null = null;

  onClickSidePanel = (data: boolean) => { };

  constructor() {
    this.className = 'js-header';
    this.classHeader = 'header';
    this.init();
  }

  getHeaderHeight() {
    return this.element?.offsetHeight ?? 0;
  }

  removeSidePanel() {
    this.sidePanel?.remove();
  }

  private init() {
    this.headerShow = true;
    this.toggleMenuActive = `${this.classHeader}__toggle-menu_active`;
    this.toggleSidePanelActive = `${this.classHeader}__toggle-side-panel_active`;
    this.menuVisible = `${this.classHeader}__menu-wrapper_visible`;

    if (this.setDomElement()) {
      this.bindEvent();
      this.setAriaExpanded();
    }
  }

  private setDomElement() {
    const header = document.querySelectorAll(`.${this.className}`);

    if (header.length === 1) {
      this.element = header[0] as HTMLElement;
    }

    if (!this.element) {
      return false;
    }

    this.menu = this.element.querySelector(`.${this.className}__menu-wrapper`);
    this.button = this.element.querySelector(`.${this.className}__toggle-menu`);
    this.sidePanel = this.element.querySelector(`.${this.className}__toggle-side-panel`);

    return true;
  }

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

  private setAriaExpanded() {
    if (!this.button || !this.sidePanel) {
      return false;
    }

    const observerButton = new MutationObserver((mutation) => {
      mutation.forEach((item) => {
        const element = item.target as HTMLButtonElement;
        let isOpen = !!element.classList.contains('header__toggle-menu_active');

        if (!isOpen) {
          isOpen = !!element.classList.contains('header__toggle-side-panel_active');
        }

        element.setAttribute('aria-expanded', `${isOpen}`);
      });
    });

    observerButton.observe(this.button, { attributeFilter: ['class'] });
    observerButton.observe(this.sidePanel, { attributeFilter: ['class'] });

    return true;
  }

  @boundMethod
  private handleHeaderAnimationEnd(event: AnimationEvent) {
    if (event.animationName !== 'fixedHeaderAnimation' || !this.element) {
      return false;
    }

    if (!this.headerShow) {
      this.element.classList.remove(...this.classes);

      if (typeof this.callbackAnimationEnd === 'function') {
        this.callbackAnimationEnd();
        this.callbackAnimationEnd = null;
      }
      this.headerShow = true;
    }

    return true;
  }

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

    if (isTop && !this.isFixed) {
      const { offsetHeight } = this.element;

      body.style.paddingTop = `${offsetHeight}px`;
      classList.add(modifierFixed);
      this.isFixed = true;

      this.classes = [
        modifierAnimating,
        `${this.classHeader}_fixed-show`,
      ];
      this.toggleHeader();

      return true;
    }

    if (isBottom && this.isFixed) {
      this.classes = [
        modifierAnimating,
        `${this.classHeader}_fixed-hide`,
      ];

      this.callbackAnimationEnd = () => {
        body.style.paddingTop = '0px';
        classList.remove(modifierFixed);
        this.isFixed = false;
      };

      this.toggleHeader();

      return true;
    }
    return true;
  }

  private closeMenu() {
    if (!this.button || !this.menu) {
      return false;
    }
    this.button.classList.remove(this.toggleMenuActive);
    this.menu.classList.remove(this.menuVisible);

    return true;
  }

  @boundMethod
  private doSomething() {
    const { body } = document;

    if (!this.element || !body) {
      return false;
    }

    const { scrollY } = window;

    if (scrollY === 0) {
      this.element.classList.remove(`${this.classHeader}_fixed`);
      this.isFixed = false;
      body.style.paddingTop = '0px';
      return true;
    }

    let shift = 0;

    if (this.prevY < scrollY) {
      shift = scrollY - this.prevY;
      this.direction = 'bottom';
    } else {
      shift = this.prevY - scrollY;
      this.direction = 'top';
    }

    this.prevY = scrollY;

    if (shift < 5) {
      return false;
    }

    if (this.direction !== this.prevDirection) {
      this.moveHeader();
    }

    this.prevDirection = this.direction;

    if (this.direction === 'bottom') {
      this.closeMenu();
    }

    return true;
  }

  private bindEvent() {
    new Throttle(this.doSomething, 'scroll', 10);

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

    this.sidePanel.classList.toggle(this.toggleSidePanelActive);
    this.onClickSidePanel(true);

    return true;
  }

  @boundMethod
  private handleButtonClick() {
    if (!this.button || !this.menu) {
      return false;
    }

    this.button.classList.toggle(this.toggleMenuActive);
    this.menu.classList.toggle(this.menuVisible);

    return true;
  }

  @boundMethod
  private handleSidePanelKeyDown(event: KeyboardEvent) {
    if (!this.sidePanel) {
      return false;
    }

    if (event.key === 'Escape') {
      this.sidePanel.classList.remove(this.toggleSidePanelActive);
      this.onClickSidePanel(false);
    }
    return true;
  }

  @boundMethod
  private handleButtonKeyDown(event: KeyboardEvent) {
    if (!this.button || !this.menu) {
      return false;
    }

    if (event.key === 'Escape') {
      this.closeMenu();
    }

    return true;
  }
}

export default Header;
