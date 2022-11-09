import { ScrollHeader } from '@components/index';

class Layout {
  constructor() {
    new ScrollHeader({
      selector: '.header',
      nameAnimation: 'fixedHeaderAnimation',
    });
  }
}

export default Layout;
