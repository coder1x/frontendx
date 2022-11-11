import BreadCrumbs from './BreadCrumbs';

function renderBreadCrumbs(className: string) {
  const components: BreadCrumbs[] = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new BreadCrumbs(element));
  });
  return components;
}

renderBreadCrumbs('.js-bread-crumbs');
