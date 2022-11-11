import Diskette from './Diskette';

function renderDiskette(className: string) {
  const components: Diskette[] = [];
  document.querySelectorAll(className).forEach((element) => {
    components.push(new Diskette(className, element));
  });
  return components;
}

renderDiskette('.category-tile');
