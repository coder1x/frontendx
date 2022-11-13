import { boundMethod } from 'autobind-decorator';

import { Archive, Tags } from '@components/index';

class SidePanel {
  private header: HTMLElement | null = null;

  private element: HTMLElement | null = null;

  private className: string;

  private panel: HTMLElement | null = null;

  private scroll: number = 0;

  private headerHeight: number = 0;

  private panelTop: number = 0;

  private archive = 'archive'

  constructor(element: Element) {
    this.element = element as HTMLElement;
    this.className = 'js-side-panel';

    if (this.element) {
      this.init();
    }
  }

  toggleSidePanel(isActive = true) {
    if (!this.element) {
      return false;
    }

    if (isActive) {
      // открыть закрыть

    } else {
      // закрыть

    }

    return true;
  }

  private init() {
    this.setDomElement();

    if (!this.panel || !this.header) {
      return false;
    }

    // нужно просто запросить высоту хедера.
    this.headerHeight = this.header.offsetHeight;
    this.panelTop = this.panel.getBoundingClientRect().top + window.pageYOffset;
    this.bindEvent();
    return true;
  }

  private setDomElement() {
    if (!this.element) {
      return false;
    }

    this.header = document.querySelector('.header') as HTMLElement;
    this.panel = this.element.querySelector(`.${this.className}`) as HTMLElement;
    const tags = this.panel.querySelector(`.${this.className}__tags-wrapper`) as HTMLElement;
    const archive = this.panel.querySelector(`.${this.className}__archive-wrapper`) as Element;

    new Archive(archive);
    new Tags(tags);

    return true;
  }

  // =============================================

  // @boundMethod
  // private handleSearchPanelClick(event: MouseEvent) {
  //   const month = event.target as HTMLElement;
  //   const year = month.closest(`.${this.archive}__year`);

  //   if (!year || !month) {
  //     return false;
  //   }

  //   const monthList = year.querySelector(`.${this.archive}__months`) as HTMLElement;
  //   const monthListHeight = monthList.offsetHeight;
  //   const isListHidden = monthList.classList.contains(`${this.archive}__months_visually-hidden`);
  //   const dataHeightAttribute = parseFloat(monthList.getAttribute('data-height') ?? '');

  //   if (!this.panel) {
  //     return false;
  //   }

  //   const { style } = this.panel;
  //   const distanceToBottom = parseFloat(style.bottom);

  //   // НЕ первый клик по этому месяцу => на нем уже есть атрибут с высотой => берем высоту из атрибута
  //   if (dataHeightAttribute) {
  //     style.bottom = isListHidden ? `${distanceToBottom + dataHeightAttribute}px`
  //       : `${distanceToBottom - dataHeightAttribute}px`;
  //     return true;
  //   }

  //   // первый клик по этому месяцу => на нем еще нет атрибута с высотой => берем высоту из listHeight и вешаем атрибут с высотой
  //   style.bottom = `${distanceToBottom - monthListHeight}px`;
  //   monthList.setAttribute('data-height', String(monthListHeight));

  //   return true;
  // }

  // =============================================

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

      // const panelTop = this.panel.getBoundingClientRect().top;
      // const isAbsolute = position === 'absolute';

      // if (panelTop > this.headerHeight && isAbsolute) { // панель продолжает выезжать из-под шапки
      //   setStyle('fixed', `${this.headerHeight}px`);
      // }

      if (window.pageYOffset < this.panelTop) {
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

    window.addEventListener('scroll', this.handleWindowScroll);
    // this.panel.addEventListener('click', this.handleSearchPanelClick);

    return true;
  }
}

export default SidePanel;
