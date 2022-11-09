import { boundMethod } from 'autobind-decorator';

import Archive from '@components/archive/Archive';

class SidePanel {
  private header: HTMLElement | null = null;

  private panelWrapper: HTMLElement | null = null;

  private panel: HTMLElement | null = null;

  private scroll: number = 0;

  private headerHeight: number = 0;

  private panelTop: number = 0;

  private archive = 'archive'

  constructor(element: Element) {
    this.panelWrapper = element as HTMLElement;
    this.init();
  }

  private init() {
    this.header = document.querySelector('.header') as HTMLElement;

    if (!this.panelWrapper || !this.header) return false;

    this.panel = this.panelWrapper.querySelector('.side-panel') as HTMLElement;

    new Archive(this.panel.querySelector('.archive') as Element);

    this.headerHeight = this.header.offsetHeight;
    this.panelTop = this.panel.getBoundingClientRect().top + window.pageYOffset;
    this.bindEvent();
    return true;
  }

  @boundMethod
  private handleSearchPanelClick(event: MouseEvent) {
    const month = event.target as HTMLElement;
    const year = month.closest(`.${this.archive}__year`);
    if (!year || !month) return false;

    const monthList = (year.querySelector(`.${this.archive}__months`) as HTMLElement);
    const monthListHeight = monthList.offsetHeight;
    const isListHidden = monthList.classList.contains(`${this.archive}__months_visually-hidden`);
    const dataHeightAttribute = parseFloat(monthList.getAttribute('data-height') ?? '');

    if (!this.panel) return false;
    const { style } = this.panel;
    const distanceToBottom = parseFloat(style.bottom);

    // НЕ первый клик по этому месяцу => на нем уже есть атрибут с высотой => берем высоту из атрибута
    if (dataHeightAttribute) {
      style.bottom = isListHidden ? `${distanceToBottom + dataHeightAttribute}px`
        : `${distanceToBottom - dataHeightAttribute}px`;
      return true;
    }
    // первый клик по этому месяцу => на нем еще нет атрибута с высотой => берем высоту из listHeight и вешаем атрибут с высотой
    style.bottom = `${distanceToBottom - monthListHeight}px`;
    monthList.setAttribute('data-height', String(monthListHeight));
    return true;
  }

  @boundMethod
  private handleWindowScroll() {
    const setStyle = (
      position = 'static',
      top = 'auto',
      bottom = 'auto',
    ) => {
      if (this.panel) {
        const { style } = this.panel;
        style.position = position;
        style.top = top;
        style.bottom = bottom;
      }
    };

    if (!this.panelWrapper || !this.panel) return false;

    if (window.pageYOffset > this.scroll) { // крутим вниз
      if (this.panel.style.position === 'fixed'
        || this.panel.style.position === 'absolute') {
        const top = `${this.panel.getBoundingClientRect().top
          + window.pageYOffset - this.panelTop}px`;
        setStyle('absolute', top);
      }
    } else { // крутим вверх
      const documentHeight = document.documentElement.clientHeight;
      const spaceToPageBottom = documentHeight
        - this.panelWrapper.getBoundingClientRect().bottom;

      if (this.panel.getBoundingClientRect().bottom < 0
        && this.panel.style.position !== 'fixed') { // панель еще не видна (первая прокрутка вниз)
        const delta = documentHeight - spaceToPageBottom;
        const bottom = delta >= 0 ? `${delta}px` : '0px';
        setStyle('absolute', 'auto', bottom); // панель появилась из-под шапки
        return true;
      }

      if (this.panel.getBoundingClientRect().top > this.headerHeight
        && this.panel.style.position === 'absolute') { // панель продолжает выезжать из-под шапки
        setStyle('fixed', `${this.headerHeight}px`);
      }

      if (window.pageYOffset < this.panelTop) {
        setStyle('static');
      }
    }
    this.scroll = window.pageYOffset;

    return true;
  }

  private bindEvent() {
    if (!this.panel) return false;
    window.addEventListener('scroll', this.handleWindowScroll);
    this.panel.addEventListener('click', this.handleSearchPanelClick);
    return true;
  }
}

export default SidePanel;
