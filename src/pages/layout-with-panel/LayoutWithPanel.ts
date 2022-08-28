import { boundMethod } from 'autobind-decorator';
import Observer from '../../components/observer/Observer';
import ScrollHeader from '../../components/header/ScrollHeader';

class LayoutWithPanel extends Observer {
  private className: string;

  private searchPanelElement: HTMLElement | null = null;

  private header: ScrollHeader | null = null;

  private isStarted: boolean;

  private wrapper: Element;

  private panelHeight: string = 'auto';

  constructor(element: Element) {
    super();
    this.wrapper = element;
    this.isStarted = true;
    this.className = 'layout-with-panel__search-panel-wrapper';
    this.createComponents();
    this.createListeners();
  }

  private createComponents() {
    this.searchPanelElement = document.querySelector(`.${this.className}`) as HTMLElement;

    let { top } = this.searchPanelElement.getBoundingClientRect();
    if (top < 0) top = 0;
    const panelHeight = window.innerHeight - top;
    console.log('panelHeight>>>', panelHeight);
    this.panelHeight = `${panelHeight}px`;
    this.searchPanelElement.style.height = this.panelHeight;

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

    let { top } = this.searchPanelElement.getBoundingClientRect();
    if (top < 0) top = 0;
    let panelHeight = window.innerHeight - top;
    console.log('panelHeight>>>', panelHeight);

    panelHeight = window.innerHeight - top;
    this.panelHeight = `${panelHeight}px`;
    this.searchPanelElement.style.height = this.panelHeight;

    this.searchPanelElement.classList.add(`${this.className}_hidden`);
    this.searchPanelElement.classList.remove(`${this.className}_visible`);
  }

  private toggleSearchPanel() {
    if (!this.searchPanelElement) return;

    let { top } = this.searchPanelElement.getBoundingClientRect();
    if (top < 0) top = 0;
    let panelHeight = window.innerHeight - top;
    console.log('panelHeight>>>', panelHeight);

    if (this.isStarted) {
      this.searchPanelElement.classList.add(`${this.className}_visible`);
      this.isStarted = false;
      this.panelHeight = 'auto';
      this.searchPanelElement.style.height = this.panelHeight; // auto
      return;
    }

    if (this.panelHeight === 'auto') { // закрываем панель
      panelHeight = window.innerHeight - top;
      this.panelHeight = `${panelHeight}px`;
      this.searchPanelElement.style.height = this.panelHeight;

      this.searchPanelElement.classList.toggle(`${this.className}_hidden`);
      this.searchPanelElement.classList.toggle(`${this.className}_visible`);
      return;
    }

    // открываем панель
    this.panelHeight = 'auto';
    this.searchPanelElement.style.height = this.panelHeight;

    this.searchPanelElement.classList.toggle(`${this.className}_hidden`);
    this.searchPanelElement.classList.toggle(`${this.className}_visible`);
  }
}

export default LayoutWithPanel;
