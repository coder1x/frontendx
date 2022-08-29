import { boundMethod } from 'autobind-decorator';
import Observer from '../../components/observer/Observer';
import ScrollHeader from '../../components/header/ScrollHeader';

class LayoutWithPanel extends Observer {
  private className: string;

  private wrapper: HTMLElement;

  private searchPanelElement: HTMLElement | null = null;

  private header: ScrollHeader | null = null;

  private isStarted: boolean;

  private panelHeight: string = 'auto';

  constructor(element: Element, className: string) {
    super();
    this.wrapper = element as HTMLElement;
    this.isStarted = true;
    this.className = `${className.replace(/^./, '')}__search-panel-wrapper`;
    this.createComponents();
    this.createListeners();
  }

  private setPanelHeight(isAutoHeight = false) {
    if (!this.searchPanelElement) return;
    if (!isAutoHeight) {
      let { top } = this.searchPanelElement.getBoundingClientRect();
      if (top < 0) top = 0;
      this.panelHeight = `${window.innerHeight - top}px`;
    } else { this.panelHeight = 'auto'; }
    this.searchPanelElement.style.height = this.panelHeight;
  }

  private createComponents() {
    this.searchPanelElement = this.wrapper.querySelector(`.${this.className}`) as HTMLElement;
    const isAuto = window.innerWidth > 1099;
    this.setPanelHeight(isAuto);

    this.header = new ScrollHeader({
      selector: '.header',
      nameAnimation: 'fixedHeaderAnimation',
    });
  }

  private createListeners() {
    if (this.header) {
      this.header.subscribe(this.handleCloseSearchPanel);
      this.header.subscribe(this.handleToggleSearchPanel);
    }
  }

  @boundMethod
  private handleCloseSearchPanel(key: string) {
    if (key !== 'close') return;
    this.closeSearchPanel();
  }

  @boundMethod
  private handleToggleSearchPanel(key: string) {
    if (key !== 'toggle') return;
    this.toggleSearchPanel();
  }

  private closeSearchPanel() {
    if (!this.searchPanelElement) return;
    this.setPanelHeight();

    this.searchPanelElement.classList.add(`${this.className}_hidden`);
    this.searchPanelElement.classList.remove(`${this.className}_visible`);
  }

  private toggleSearchPanel() {
    if (!this.searchPanelElement) return;

    if (this.isStarted) { // открываем панель первый раз
      this.setPanelHeight(true);
      this.isStarted = false;
      this.searchPanelElement.classList.add(`${this.className}_visible`);
      return;
    }

    if (this.panelHeight === 'auto') { // закрываем панель
      this.setPanelHeight();
    } else {
      this.setPanelHeight(true); // открываем панель
    }

    this.searchPanelElement.classList.toggle(`${this.className}_hidden`);
    this.searchPanelElement.classList.toggle(`${this.className}_visible`);
  }
}

export default LayoutWithPanel;
