import { boundMethod } from 'autobind-decorator';

import { Header, SidePanel } from '@components/index';

class LayoutWithPanel {
  private element: HTMLElement | null = null;

  private header: Header | null = null;;

  private sidePanel: SidePanel | null = null;

  private sidePanelWrapper: HTMLElement | null = null;

  private isPanelVisible: boolean = false;

  private className: string = '';

  constructor(element: Element) {
    this.element = element as HTMLElement;
    this.className = 'js-layout-with-panel';

    if (this.element) {
      this.init();
    }
  }

  private init() {
    this.setDomElement();

    this.header = new Header();

    if (this.sidePanelWrapper) {
      this.sidePanel = new SidePanel(this.sidePanelWrapper);
    }

    if (this.header && this.sidePanel) {
      this.sidePanel.headerHeight = this.header.getHeaderHeight();

      this.header.onClickSidePanel = this.togglePanel;
    }
  }

  @boundMethod
  private togglePanel(isToggle: boolean) {
    if (!this.sidePanelWrapper) {
      return false;
    }

    const wrapper = `${this.className.replace('js-', '')}__side-panel-wrapper`;
    const { classList } = this.sidePanelWrapper;

    if (isToggle) {
      if (this.isPanelVisible) {
        this.isPanelVisible = false;
        classList.add(`${wrapper}_hidden`);
        classList.remove(`${wrapper}_visible`);
      } else {
        this.isPanelVisible = true;
        classList.remove(`${wrapper}_hidden`);
        classList.add(`${wrapper}_visible`);
      }
    } else {
      classList.add(`${wrapper}_hidden`);
      classList.remove(`${wrapper}_visible`);
      this.isPanelVisible = false;
    }

    return true;
  }

  private setDomElement() {
    if (!this.element) {
      return false;
    }

    this.sidePanelWrapper = this.element.querySelector(
      `.${this.className}__side-panel-wrapper`,
    );

    return true;
  }
}

export default LayoutWithPanel;
