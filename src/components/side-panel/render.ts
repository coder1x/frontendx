import SidePanel from './SidePanel';

function renderSearchPanel(className: string) {
  const components: SidePanel[] = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new SidePanel(element));
  });
  return components;
}

renderSearchPanel('.side-panel');
