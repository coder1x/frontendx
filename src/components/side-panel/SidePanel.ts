import { boundMethod } from 'autobind-decorator';

import { Throttle } from '@helpers/index';
import { Archive, Tags } from '@components/index';

class SidePanel {
  headerHeight: number = 0;

  element: HTMLElement | null = null;

  className: string;

  private panel: HTMLElement | null = null;

  private scroll: number = 0;

  private panelTop: number = 0;

  constructor(element: Element) {
    this.element = element as HTMLElement;
    this.className = 'js-side-panel';

    if (this.element) {
      this.init();
    }
  }

  private init() {
    this.setDomElement();

    if (!this.panel) {
      return false;
    }

    this.panelTop = this.panel.getBoundingClientRect().top + window.pageYOffset;
    this.bindEvent();
    return true;
  }

  private setDomElement() {
    if (!this.element) {
      return false;
    }

    this.panel = this.element.querySelector(`.${this.className}`) as HTMLElement;
    const tags = this.panel.querySelector(`.${this.className}__tags-wrapper`) as HTMLElement;
    const archive = this.panel.querySelector(`.${this.className}__archive-wrapper`) as Element;

    new Archive(archive);
    new Tags(tags);

    return true;
  }

  private setStyle(position = 'static', top = 'auto', bottom = 'auto') {
    if (!this.panel) {
      return false;
    }
    const { style } = this.panel;

    style.position = position;
    style.top = top;
    style.bottom = bottom;

    return true;
  }

  @boundMethod
  private handleWindowScroll() {
    if (!this.element || !this.panel) {
      return false;
    }

    if (window.pageYOffset > this.scroll) { // крутим вниз
      const { position } = this.panel.style;

      if (position === 'fixed' || position === 'absolute') {
        const top = `${this.panel.getBoundingClientRect().top
          + window.pageYOffset - this.panelTop}px`;

        this.setStyle('absolute', top);
      }
    } else { // крутим вверх
      const documentHeight = document.documentElement.clientHeight;
      const spaceToPageBottom = documentHeight - this.element.getBoundingClientRect().bottom;

      const { position } = this.panel.style;
      const isFixed = position !== 'fixed';
      const panelBottom = this.panel.getBoundingClientRect().bottom;

      if (panelBottom < 0 && isFixed) { // панель еще не видна (первая прокрутка вниз)
        const delta = documentHeight - spaceToPageBottom;
        const bottom = delta >= 0 ? `${delta}px` : '0px';

        this.setStyle('absolute', 'auto', bottom); // панель появилась из-под шапки

        return true;
      }

      const panelTop = this.panel.getBoundingClientRect().top;
      const isAbsolute = position === 'absolute';

      if (panelTop > this.headerHeight && isAbsolute) { // панель продолжает выезжать из-под шапки
        this.setStyle('fixed', `${this.headerHeight}px`);
      }

      const indent = this.panelTop - 68;

      if (window.pageYOffset < indent) {
        this.setStyle('static');
      }
    }

    this.scroll = window.pageYOffset;

    return true;
  }

  private bindEvent() {
    if (!this.panel) {
      return false;
    }

    new Throttle(this.handleWindowScroll, 'scroll', 10);

    return true;
  }
}

export default SidePanel;
