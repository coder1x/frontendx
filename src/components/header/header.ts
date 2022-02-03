import './header.scss';

interface Props {
  selector: string,
  nameAnimation: string
}

class Scroll {

  private ticking = false;
  private prevY = 0;
  private direction = 'bottom';
  private prevDirection = 'top';
  private header: HTMLElement;
  private className: string;
  private classes: string[];
  private nameAnimation: string;

  constructor(props: Props) {
    this.init(props);
  }

  private init(props: Props) {
    this.action();
    this.className = props.selector.replace('.', '');
    this.classes = [
      this.className + '_animating'
    ];
    this.nameAnimation = props.nameAnimation;
    this.header = document.querySelector(this.className);
  }

  // функция вызывается при скролле получая координаты Y
  private doSomething(scrollY: number) {
    console.log('doSomething');

    this.direction = this.prevY < scrollY ? 'bottom' : 'top';
    this.prevY = scrollY;
    this.moveHeader();
  }

  // показать или отключить анимацию появления шапки
  private toggleHeader(classes: string[], callback?: Function) {
    if (!callback)
      callback = () => { };

    const CL = this.header.classList;
    this.header.addEventListener('animationend', (event: AnimationEvent) => {
      if (event.animationName !== this.nameAnimation) {
        return;
      }
      CL.remove(...classes);
      callback();
    }, { once: true });
    CL.add(...classes);
  }

  // направление скрола вверх или в низ.
  private moveHeader() {
    const moveF = this.direction != this.prevDirection;
    const fixedC = this.className + '_fixed';
    const CL = this.header.classList;

    if (this.direction == 'top' && moveF) {
      const height = this.header.offsetHeight;
      const body = document.querySelector('body');
      body.style.paddingTop = height + 'px';
      CL.add(fixedC);
      this.toggleHeader([
        ...this.classes,
        this.className + '_fixed-show',
      ]);
    }
    else if (this.direction == 'bottom' && moveF) {


      this.toggleHeader([
        ...this.classes,
        this.className + '_fixed-hide',
      ],
        () => {
          const body = document.querySelector('body');
          body.style.paddingTop = '0px';
          CL.remove(fixedC);
        }
      );


    }
    this.prevDirection = this.direction;
  }

  // подписываемся на событие скролла 
  private action() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.doSomething(window.scrollY);
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }
}

new Scroll({
  selector: '.header',
  nameAnimation: 'fixedHeaderAnimation'
});

