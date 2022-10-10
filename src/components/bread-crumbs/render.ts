import BreadCrumbs from './BreadCrumbs';

function renderCheckboxList(className: string) {
  const components: BreadCrumbs[] = [];
  document.querySelectorAll(className).forEach((elem) => {
    components.push(new BreadCrumbs(className, elem));
  });
  return components;
}

renderCheckboxList('.bread-crumbs');
