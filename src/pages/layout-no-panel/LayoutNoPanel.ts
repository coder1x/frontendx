import ScrollHeader from '../../components/header/ScrollHeader';

class Layout {
  constructor() {
    new ScrollHeader({
      selector: '.header',
      nameAnimation: 'fixedHeaderAnimation',
    });
  }
}

export default Layout;
