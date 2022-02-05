import './category-tile.scss';

class Diskette {


  className: string;
  lid: HTMLElement;
  categoryTile: HTMLElement;
  link: HTMLElement;
  window: HTMLElement;

  constructor(className: string, elem: Element) {
    this.className = className;
    this.categoryTile = elem as HTMLElement;
    this.init();
  }

  init() {
    this.lid = this.categoryTile.querySelector(this.className + '__lid');
    this.link = this.categoryTile.querySelector(this.className + '__link');
    this.window = this.categoryTile.querySelector(
      this.className + '__window-disk'
    );

    this.setActions();
  }

  setActions() {

    const name = this.className.replace('.', '');

    const modAdd = () => {
      this.lid.classList.add(name + '__lid_open');
      this.window.classList.add(name + '__window-disk_open');
    };

    const modRemove = () => {
      this.lid.classList.remove(name + '__lid_open');
      this.window.classList.remove(name + '__window-disk_open');
    };


    this.link.addEventListener('mouseover', modAdd);
    this.link.addEventListener('focus', modAdd);
    this.link.addEventListener('blur', modRemove);
    this.link.addEventListener('mouseout', modRemove);
  }
}



function renderCheckboxList(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new Diskette(className, elem));
  }
  return objMas;
}


renderCheckboxList('.category-tile');