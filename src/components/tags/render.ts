import Tags from './Tags';

function renderCheckboxList(className: string) {
  const components: Tags[] = [];
  document.querySelectorAll(className).forEach((elem) => {
    components.push(new Tags(className, elem));
  });
  return components;
}

renderCheckboxList('.tags');
