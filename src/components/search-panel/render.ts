import SearchPanel from './SearchPanel';

function renderSearchPanel(className: string) {
  const components: SearchPanel[] = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new SearchPanel(element));
  });
  return components;
}

renderSearchPanel('.search-panel-wrapper');
