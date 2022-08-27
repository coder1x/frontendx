/* eslint-disable class-methods-use-this */
import { boundMethod } from 'autobind-decorator';
import Observer from '../../components/observer/Observer';
import ScrollHeader from '../../components/header/ScrollHeader';
import SearchPanel from '../../components/search-panel/SearchPanel';

class LayoutWithPanel extends Observer {
  private headerElement: HTMLElement | null = null;

  private searchPanelElement: Element | null = null;

  private header: ScrollHeader | null = null;

  private searchPanel: SearchPanel | null = null;

  constructor() {
    super();
    this.createComponents();
    this.createListeners();
  }

  private createComponents() {
    this.searchPanelElement = document.querySelector('.layout-with-panel__search-panel-wrapper');

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

    console.log('&');
    this.closeSearchPanel();
  }

  @boundMethod
  private handleToggleSearchPanel(key: string) {
    console.log('!');

    if (key !== 'toggle') return;
    this.toggleSearchPanel();
  }

  private closeSearchPanel() {
    console.log('close');
  }

  @boundMethod
  private toggleSearchPanel() {
    if (!this.searchPanelElement) return;
    this.searchPanelElement.classList.toggle('layout-with-panel__search-panel-wrapper_hidden');
    console.log('toggle');
  }
}

export default LayoutWithPanel;
