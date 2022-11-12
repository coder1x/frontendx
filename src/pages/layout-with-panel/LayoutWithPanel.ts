// import { boundMethod } from 'autobind-decorator';

import { Header, SidePanel } from '@components/index';

class LayoutWithPanel {
  private element: HTMLElement | null = null;

  private header: Header | null = null;;

  private sidePanel: SidePanel | null = null;

  private sidePanelWrapper: HTMLElement | null = null;

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

    this.header.onClickSidePanel = (isActive = true) => {
      this.sidePanel?.toggleSidePanel(isActive);
    };
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
