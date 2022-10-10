import Archive from './Archive';

function renderCheckboxList(className: string) {
  const components: Archive[] = [];
  document.querySelectorAll(className).forEach((elem) => {
    components.push(new Archive(className, elem));
  });
  return components;
}

renderCheckboxList('.archive__year');
