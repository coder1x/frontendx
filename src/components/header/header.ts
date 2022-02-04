import './header.scss';
import Throttle from '../throttle/throttle';

interface Props {
  selector: string,
  nameAnimation: string
}

class ScrollH {

  private prevY = 0;
  private direction = 'bottom';
  private prevDirection = 'top';
  private header: HTMLElement;
  private className: string;
  private classes: string[];
  private nameAnimation: string;
  private headerShow: boolean;
  private button: HTMLButtonElement;
  private menu: HTMLElement;

  constructor(props: Props) {
    this.init(props);
  }

  get isFixed() {
    return this.header.classList.contains(this.className + '_fixed');
  }

  private init(props: Props) {

    this.headerShow = true;
    this.className = props.selector.replace('.', '');
    this.classes = [
      this.className + '_animating'
    ];
    this.nameAnimation = props.nameAnimation;
    this.header = document.querySelector(this.className);

    this.setDom(props.selector);
    this.action();
  }

  private setDom(className: string) {
    this.menu = this.header.querySelector(className + '__menu-wrap');
    this.button = this.header.querySelector(className + '__toggle-menu');
  }

  // функция вызывается при скролле получая координаты Y
  private doSomething = () => {
    const scrollY = window.scrollY;
    this.direction = this.prevY < scrollY ? 'bottom' : 'top';
    this.prevY = scrollY;

    const moveF = this.direction != this.prevDirection;

    if (moveF)
      this.moveHeader();

    this.prevDirection = this.direction;
  }

  // показать или отключить анимацию появления шапки
  private toggleHeader(classes: string[], callback?: Function) {
    callback = callback ?? (() => { });

    const CL = this.header.classList;
    this.header.addEventListener('animationend', (event: AnimationEvent) => {
      if (event.animationName !== this.nameAnimation) return;

      if (!this.headerShow) {
        CL.remove(...classes);
        callback();
        this.headerShow = true;
      }

    }, { once: true });

    if (this.headerShow) {
      CL.add(...classes);
      this.headerShow = false;
    }
  }

  private getBodyElem() {
    return document.querySelector('body');
  }

  // направление скролла вверх или в низ.
  private moveHeader() {

    const fixedC = this.className + '_fixed';
    const CL = this.header.classList;

    if (this.direction == 'top' && !this.isFixed) {

      const height = this.header.offsetHeight;
      this.getBodyElem().style.paddingTop = height + 'px';
      CL.add(fixedC);
      this.toggleHeader([
        ...this.classes,
        this.className + '_fixed-show',
      ]);
    }
    else if (this.direction == 'bottom' && this.isFixed) {

      this.toggleHeader([
        ...this.classes,
        this.className + '_fixed-hide',
      ],
        () => {
          this.getBodyElem().style.paddingTop = '0px';
          CL.remove(fixedC);
        }
      );
    }

  }

  // подписываемся на событие скролла 
  private action() {
    new Throttle('scroll', this.doSomething, 10);


    const showMenuFocus = (e: KeyboardEvent) => {
      if (e.key == ' ') {
        e.preventDefault();
      } else {
        if (e.key == 'Escape') {
          this.button.classList.remove(this.className + '__toggle-menu_active');
          this.menu.classList.remove(this.className + '__menu-wrap_visible');
        }
      }
    };

    this.button.addEventListener('keydown', showMenuFocus);

    this.button.addEventListener('click', () => {

      this.button.classList.toggle(this.className + '__toggle-menu_active');
      this.menu.classList.toggle(this.className + '__menu-wrap_visible');

    });

  }
}


new ScrollH({
  selector: '.header',
  nameAnimation: 'fixedHeaderAnimation'
});

