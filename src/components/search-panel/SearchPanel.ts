import { boundMethod } from 'autobind-decorator';

class SearchPanel {
  className: string = '';

  card: HTMLElement | null = null;

  header: HTMLElement | null = null;

  link: HTMLElement | null = null;

  href: string | null = '';

  panelWrapper: HTMLElement | null = null;

  panel: HTMLElement | null = null;

  scroll: number = 0;

  delta: number = 0;

  headerHeight: number = 0;

  panelTop: number = 0;

  constructor(className: string, elem: Element) {
    this.panelWrapper = elem as HTMLElement;
    this.className = className;
    this.init();
  }

  init() {
    this.header = document.querySelector('.header') as HTMLElement;

    if (!this.panelWrapper || !this.header) return false;

    this.panel = this.panelWrapper.querySelector('.search-panel') as HTMLElement;
    this.headerHeight = this.header.offsetHeight;
    this.panelTop = this.panel.getBoundingClientRect().top + window.pageYOffset;
    this.bindEvent();
    return true;
  }

  static handlePanelClick(e: MouseEvent) {
    const panel = e.currentTarget as HTMLElement;
    const month = e.target as HTMLElement;
    const year = month.closest('.archive__year') as HTMLElement;
    const monthList = year.querySelector('.archive__months') as HTMLElement;
    const monthListHeight = monthList.offsetHeight;
    const dataHeightAttribute = monthList.getAttribute('data-height');
    const { style } = panel;
    const bottom = parseFloat(style.bottom);
    // НЕ первый клик по этому месяцу => на нем уже есть атрибут с высотой => берем высоту из атрибута
    if (dataHeightAttribute) {
      if (!monthList.classList.contains('archive__months_visually-hidden')) {
        style.bottom = `${bottom - parseFloat(dataHeightAttribute)}px`;
      } else { style.bottom = `${bottom + parseFloat(dataHeightAttribute)}px`; }
      // первый клик по этому месяцу => на нем еще нет атрибута с высотой => берем высоту из listHeight и вешаем атрибут с высотой
    } else {
      style.bottom = `${bottom - monthListHeight}px`;
      monthList.setAttribute('data-height', String(monthListHeight));
    }
  }

  @boundMethod
  handleWindowScroll() {
    const setStyle = (
      position: string = 'static',
      top: string = 'auto',
      bottom: string = 'auto',
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
      if (this.panel.style.position === 'sticky') {
        const top = `${this.panel.getBoundingClientRect().top
          + window.pageYOffset - this.panelTop}px`;
        setStyle('absolute', top);
      }
    } else { // крутим вверх
      const spaceToPageBottom = document.documentElement.clientHeight
        - this.panelWrapper.getBoundingClientRect().bottom;

      if (this.panel.getBoundingClientRect().bottom < 0) { // панель еще не видна (первая прокрутка вниз)
        const delta = document.documentElement.clientHeight - spaceToPageBottom;
        const bottom = delta >= 0 ? `${delta}px` : '0px';
        setStyle('absolute', 'auto', bottom); // панель появилась из-под шапки
        return true;
      }

      if (this.panel.getBoundingClientRect().top > this.headerHeight
        && this.panel.style.position === 'absolute') { // панель продолжает выезжать из-под шапки
        setStyle('sticky', `${this.headerHeight}px`);
      }
    }
    this.scroll = window.pageYOffset;

    return true;
  }

  bindEvent() {
    if (!this.panel) return false;
    window.addEventListener('scroll', this.handleWindowScroll);
    this.panel.addEventListener('click', SearchPanel.handlePanelClick);
    return true;
  }
}

export default SearchPanel;
