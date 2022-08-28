import { boundMethod } from 'autobind-decorator';
import Observer from '../../components/observer/Observer';
import ScrollHeader from '../../components/header/ScrollHeader';

class LayoutWithPanel extends Observer {
  private className: string;

  private searchPanelElement: Element | null = null;

  private header: ScrollHeader | null = null;

  private isStarted: boolean;

  constructor() {
    super();
    this.isStarted = true;
    this.className = 'layout-with-panel__search-panel-wrapper';
    this.createComponents();
    this.createListeners();
  }

  private createComponents() {
    this.searchPanelElement = document.querySelector(`.${this.className}`);

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
    this.searchPanelElement.classList.add(`${this.className}_hidden`);
    this.searchPanelElement.classList.remove(`${this.className}_visible`);
  }

  private toggleSearchPanel() {
    if (!this.searchPanelElement) return;

    if (this.isStarted) {
      this.searchPanelElement.classList.add(`${this.className}_visible`);
      this.isStarted = false;
      return;
    }

    this.searchPanelElement.classList.toggle(`${this.className}_hidden`);
    this.searchPanelElement.classList.toggle(`${this.className}_visible`);
  }
}

export default LayoutWithPanel;
