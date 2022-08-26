import LayoutWithPanel from './LayoutWithPanel';

function renderLayoutWithPanel(className: string) {
  const components: LayoutWithPanel[] = [];
  document.querySelectorAll(className).forEach(() => {
    components.push(new LayoutWithPanel());
  });
  return components;
}

renderLayoutWithPanel('.layout-with-panel');
