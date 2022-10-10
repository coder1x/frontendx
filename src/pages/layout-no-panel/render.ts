import LayoutNoPanel from './LayoutNoPanel';

function renderLayoutNoPanel(className: string) {
  const components: LayoutNoPanel[] = [];
  document.querySelectorAll(className).forEach(() => {
    components.push(new LayoutNoPanel());
  });
  return components;
}

renderLayoutNoPanel('.layout-no-panel');
