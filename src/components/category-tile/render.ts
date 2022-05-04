import Diskette from './Diskette';

function renderCheckboxList(className: string) {
  const components: Diskette[] = [];
  document.querySelectorAll(className).forEach((elem) => {
    components.push(new Diskette(className, elem));
  });
  return components;
}

renderCheckboxList('.category-tile');
