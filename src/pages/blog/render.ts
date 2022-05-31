import SearchPanel from './SearchPanel';

function renderSearchPanel(className: string) {
  const components: SearchPanel[] = [];
  document.querySelectorAll(className).forEach((elem) => {
    components.push(new SearchPanel(className, elem));
  });
  return components;
}

renderSearchPanel('.blog__search-panel-wrapper');
