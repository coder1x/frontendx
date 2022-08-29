import LayoutWithPanel from './LayoutWithPanel';

function renderLayoutWithPanel(className: string) {
  const components: LayoutWithPanel[] = [];
  document.querySelectorAll(className).forEach((component) => {
    components.push(new LayoutWithPanel(component, className));
  });
  return components;
}

renderLayoutWithPanel('.layout-with-panel');
