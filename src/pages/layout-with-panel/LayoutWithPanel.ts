import { boundMethod } from 'autobind-decorator';
import Observer from '../../components/observer/Observer';
import ScrollHeader from '../../components/header/ScrollHeader';

class LayoutWithPanel extends Observer {
  private className: string;

  private searchPanelElement: Element | null = null;

  private header: ScrollHeader | null = null;

  constructor() {
    super();
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
  }

  private toggleSearchPanel() {
    if (!this.searchPanelElement) return;
    this.searchPanelElement.classList.toggle(`${this.className}_hidden`);
  }
}

export default LayoutWithPanel;
