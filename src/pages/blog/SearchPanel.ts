/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { boundMethod } from 'autobind-decorator';

class SearchPanel {
  className: string = '';

  card: HTMLElement | null = null;

  header: HTMLElement | null = null;

  link: HTMLElement | null = null;

  href: string | null = '';

  panelWrapper: HTMLElement | null = null;

  panel: HTMLElement | null = null;

  //  blog: HTMLElement | null = null;

  scroll: number = 0;

  delta: number = 0;

  headerHeight: number = 0;

  constructor(className: string, elem: Element) {
    this.panelWrapper = elem as HTMLElement;
    this.className = className;
    this.init();
  }

  init() {
    // this.blog = document.querySelector('.blog') as HTMLElement;
    this.header = document.querySelector('.header') as HTMLElement;
    if (!this.panelWrapper || !this.header) return false;
    this.panel = this.panelWrapper.querySelector('.search-panel') as HTMLElement;
    this.headerHeight = this.header.offsetHeight;
    this.bindEvent();

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  handlePanelWrapperClick(e: MouseEvent) {
    const panel = e.currentTarget as HTMLElement;
    const target = e.target as HTMLElement;
    const list = target.closest('.archive__year') as HTMLElement;
    const listHeight = list.offsetHeight;
    // list.style.borderColor = 'red';
    // list.style.borderWidth = '1px';
    // list.style.borderStyle = 'solid';
    console.log('listHeight>>>', listHeight);
    // console.log(list);
    const bottom = parseFloat(panel.style.bottom);
    // const bottom = panel.style.bottom;
    console.log('bottom>>>', bottom);
    panel.style.bottom = `${bottom - listHeight}px`;
  }

  @boundMethod
  handleWindowScroll(e: Event) {
    const setStyle = (position: string = 'static', top: string = 'auto', bottom: string = 'auto') => {
      if (this.panel) {
        const style = this.panel.style;
        style.position = position;
        style.top = top;
        style.bottom = bottom;
      }
    };

    if (!this.panelWrapper || !this.panel) return false;

    if (window.pageYOffset > this.scroll) { // крутим вниз
      setStyle();
    } else { // крутим вверх
      const spaceToPageBottom = document.documentElement.clientHeight - this.panelWrapper.getBoundingClientRect().bottom;
      if (this.panel.getBoundingClientRect().bottom < 0) { // панель еще не видна (первая прокрутка вниз)
        const delta = document.documentElement.clientHeight - spaceToPageBottom;
        const bottom = delta >= 0 ? `${delta}px` : '0px';
        setStyle('absolute', 'auto', bottom); // панель появилась из-под шапки
        return true;
      }

      if (this.panel.getBoundingClientRect().top > this.headerHeight) { // панель продолжает выезжать из-под шапки
        setStyle('sticky', `${this.headerHeight}px`);
      }
    }
    this.scroll = window.pageYOffset;

    return true;
  }

  bindEvent() {
    if (!this.panel) return false;
    window.addEventListener('scroll', this.handleWindowScroll);
    this.panel.addEventListener('click', this.handlePanelWrapperClick);
    return true;
  }
}

export default SearchPanel;
