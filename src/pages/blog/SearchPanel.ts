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

  blog: HTMLElement | null = null;

  scroll: number = 0;

  test: boolean = false;

  delta: number = 0;

  height: number = 0;

  constructor(className: string, elem: Element) {
    this.panelWrapper = elem as HTMLElement;
    this.className = className;
    this.init();
  }

  init() {
    this.blog = document.querySelector('.blog') as HTMLElement;
    if (!this.panelWrapper) return false;
    this.panel = this.panelWrapper.querySelector('.search-panel') as HTMLElement;
    if (this.panel) {
      this.height = this.panel.offsetHeight;
    }

    // this.header = this.card.querySelector(`${this.className}__header`);
    // this.link = this.card.querySelector(`${this.className}__header-link`);
    // if (!this.link) return false;
    // this.href = this.link.getAttribute('href');
    this.bindEvent();

    return true;
  }

  @boundMethod
  handleHeaderKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      if (this.href) {
        document.location.href = this.href;
      }
    }
  }

  @boundMethod
  handleWindowScroll(e: Event) {
    if (!this.blog) return false;

    // const wrapperRight = this.blog.getBoundingClientRect().right - document.documentElement.clientWidth + 20;
    if (this.panelWrapper && this.panel) {
      if (window.pageYOffset > this.scroll) { // крутим вниз
        this.panel.style.position = 'static';
        // this.panel.style.bottom = 'auto';
      } else { // крутим вверх
        if (this.panel.getBoundingClientRect().bottom < 0) { // панель не видна (первая прокрутка вниз)
          console.log('1');
          const bottom = `${document.documentElement.clientHeight - 100}px`;
          this.panel.style.position = 'absolute';
          this.panel.style.top = 'auto';
          this.panel.style.bottom = bottom; // панель появилась из-под шапки
          return false;
        }
        console.log('2');
        console.log(this.panel.getBoundingClientRect().top);

        if (this.panel.getBoundingClientRect().top > 70) {
          this.panel.style.position = 'sticky';
          this.panel.style.top = '70px';
          this.panel.style.bottom = 'auto';
        }
      }
      //  this.delta = window.pageYOffset - this.scroll;
      this.scroll = window.pageYOffset;
    }
    return true;
  }

  bindEvent() {
    window.addEventListener('scroll', this.handleWindowScroll);
  }
}

export default SearchPanel;
