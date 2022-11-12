import LayoutWithPanel from './LayoutWithPanel';

function renderLayoutWithPanel(className: string) {
  const components: LayoutWithPanel[] = [];
  document.querySelectorAll(className).forEach((component) => {
    components.push(new LayoutWithPanel(component));
  });
  return components;
}

renderLayoutWithPanel('.js-layout-with-panel');
