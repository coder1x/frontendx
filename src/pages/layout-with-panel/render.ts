import LayoutWithPanel from './LayoutWithPanel';

function renderLayoutWithPanel(className: string) {
  const layout = document.querySelectorAll(className);

  if (layout.length === 1) {
    return new LayoutWithPanel(layout[0]);
  }
  return null;
}

renderLayoutWithPanel('.js-layout-with-panel');
