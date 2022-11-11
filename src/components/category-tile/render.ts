import Diskette from './Diskette';

function renderDiskette(className: string) {
  const components: Diskette[] = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new Diskette(element));
  });
  return components;
}

renderDiskette('.js-category-tile');
