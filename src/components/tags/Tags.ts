/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { boundMethod } from 'autobind-decorator';

class Tags {
  private className: string;

  private wrapper: HTMLElement | null;

  private track: HTMLElement | null = null;

  private tags: HTMLElement | null = null;

  private frame: HTMLElement | null = null;

  private thumb: HTMLElement | null = null;

  private shiftY: number = 0;

  private trackHeight: number = 0;

  private thumbHeight: number = 0;

  private tagsHeight: number = 0;

  private frameHeight: number = 0;

  private trackAreaHeight: number = 0;

  private tagsScrollLimit: number = 0;

  private yStart: number | null = null;

  private yDeltaPrevious: number = 0;

  private isMouseOnFrame: boolean = false;

  constructor(className: string, element: Element) {
    this.wrapper = element as HTMLElement;
    this.className = className.replace(/^./, '');
    this.init();
    this.getDimentions();
  }

  private init() {
    if (!this.wrapper) return false;
    this.track = this.wrapper.querySelector(`.${this.className}__scrollbar-track`);
    this.tags = this.wrapper.querySelector(`.${this.className}__list`);
    this.frame = this.wrapper.querySelector(`.${this.className}__frame`);
    this.thumb = this.wrapper.querySelector(`.${this.className}__scrollbar-thumb`);
    this.bindEvent();

    return true;
  }

  private getDimentions() {
    if (!this.track || !this.tags || !this.frame || !this.thumb) return false;
    this.trackHeight = this.track.offsetHeight;
    this.tagsHeight = this.tags.offsetHeight;
    this.frameHeight = this.frame.offsetHeight;
    //  this.tagsScrollLimit - значение, до которого можно прокручивать теги без появления пустого пространства (максимальный процент )
    this.tagsScrollLimit = 100 - ((this.frameHeight * 100) / this.tagsHeight);

    /* высота элемента tags относится к высоте frame так же, как track к thumb => вычислим высоту thumb (ползунка) */
    const thumbHeightCalc = (this.frameHeight * this.trackHeight) / this.tagsHeight;
    this.thumbHeight = thumbHeightCalc > 20 ? thumbHeightCalc : 20;
    this.thumb.style.height = `${this.thumbHeight}px`;
    this.trackAreaHeight = this.trackHeight - this.thumbHeight;
    return true;
  }

  private bindEvent() {
    if (this.thumb) {
      this.thumb.addEventListener('pointerdown', this.handleThumbPointerDown);
    }

    if (this.tags) {
      /* элемент с overflow:hidden не может сгенерировать событие scroll, поэтому используем событие wheel */
      this.tags.addEventListener('wheel', this.handleTagsWheel);
      this.tags.addEventListener('touchstart', this.handleTagsTouchStart);
      this.tags.addEventListener('touchmove', this.handleTagsTouchMove);
    }

    window.addEventListener('mouseover', this.handleWindowMouseOver);
    const body = document.querySelector('body') as HTMLElement;
    window.addEventListener('wheel', this.handleWindowWheel, { passive: false });
  }

  @boundMethod
  private handleTagsTouchStart(event: TouchEvent) {
    this.yStart = event.touches[0].clientY;
  }

  @boundMethod
  private handleTagsTouchMove(event: TouchEvent) {
    event.preventDefault();
    if (!this.yStart || !this.tags) {
      return;
    }
    const yEnd = event.touches[0].clientY;
    const yDelta = this.yStart - yEnd;
    const deltaCurrent = yDelta - this.yDeltaPrevious;
    const deltaCurrentPercent = (deltaCurrent * 100) / this.tagsHeight;
    this.yDeltaPrevious = yDelta;
    const transformValue = this.tags.style.transform;

    if (yDelta > 0) { // скроллим вверх
      // transform у элемента отсутствует при самом первом скролле, установим его
      if (!transformValue) {
        this.tags.style.transform = 'translateY(0%)';
      }
      if (deltaCurrent > 0) {
        this.moveTagsList(transformValue, deltaCurrentPercent);
      }
    } else if (deltaCurrent < 0) { // скроллим вниз
      this.moveTagsList(transformValue, deltaCurrentPercent, false);
    }
  }

  @boundMethod
  private handleWindowWheel(event: Event) {
    if (this.isMouseOnFrame) {
      event.preventDefault();
    }
  }

  @boundMethod
  private handleWindowMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement;

    this.isMouseOnFrame = !!target.closest(`.${this.className}__frame`);
  }

  @boundMethod
  private handleTagsWheel(event: WheelEvent) {
    if (!this.tags) {
      return;
    }
    const yDelta = event.deltaY;
    const deltaPercent = (yDelta * 100) / this.tagsHeight;
    const transformValue = this.tags.style.transform ? this.tags.style.transform : 'translateY(0%)';

    if (yDelta > 0) { // скроллим вверх
      // transform у элемента отсутствует при самом первом скролле, установим его
      if (!transformValue) {
        this.tags.style.transform = 'translateY(0%)';
      }
      console.log('deltaPercent>>>', deltaPercent);
      this.moveTagsList(transformValue, deltaPercent);
    } else { // скроллим вниз
      this.moveTagsList(transformValue, deltaPercent, false);
    }
  }

  @boundMethod
  private handleThumbPointerDown(event: PointerEvent) {
    if (!this.thumb || !this.track) return false;
    this.thumb.setPointerCapture(event.pointerId);
    this.shiftY = event.clientY - this.thumb.getBoundingClientRect().top;
    this.track.addEventListener('pointermove', this.handleThumbPointerMove);
    this.track.addEventListener('pointerup', this.handleThumbPointerUp);

    return true;
  }

  @boundMethod
  private handleThumbPointerMove(event: PointerEvent) {
    event.preventDefault();
    this.moveThumb(event.clientY);
  }

  @boundMethod
  private handleThumbPointerUp() {
    if (!this.track) return false;
    this.track.removeEventListener('pointerup', this.handleThumbPointerUp);
    this.track.removeEventListener('pointermove', this.handleThumbPointerMove);
    return true;
  }

  private moveThumb(coordinateY: number) {
    if (!this.track) return false;

    const pointerTopPosition = coordinateY
      - this.track.getBoundingClientRect().top - this.shiftY;

    if (pointerTopPosition < 0) {
      this.setStyle();
      return true;
    }

    if (pointerTopPosition > this.trackAreaHeight) {
      this.setStyle(`${this.trackAreaHeight}px`, `translateY(-${this.tagsScrollLimit}%)`);
      return true;
    }

    const scrollDistanceFull = (pointerTopPosition * 100) / this.trackAreaHeight; // длина прокрутки
    // проверим, что мы не прокрутили лишнего (не начало появляться пустое пространство под списком тегов)
    const scrollDistance = scrollDistanceFull > this.tagsScrollLimit
      ? this.tagsScrollLimit : scrollDistanceFull;
    this.setStyle(`${pointerTopPosition}px`, `translateY(-${scrollDistance}%)`);
    return true;
  }

  moveTagsList(transform: string, delta: number, isMovingUp = true) {
    if (!this.thumb || !this.tags) return;

    /* здесь используем утверждение as, т.к. знаем, что свойство transform = translateY существует (мы его устанавливаем, если его нет) */
    const currentShift = (transform.match(/(?<=translateY\()[0-9-.]+/) as Array<any>)[0];

    /* в зависимости от направления движения, проверим, что мы не перешли верхнюю / нижнюю границу */
    const isLimitReached = isMovingUp === true
      ? Math.abs(parseFloat(currentShift) - delta)
      >= this.tagsScrollLimit : parseFloat(currentShift) > 0;

    console.log('currentShift>>>', currentShift);
    console.log('delta>>>', delta);
    console.log('Math.abs(parseFloat(currentShift) - delta)>>>', Math.abs(parseFloat(currentShift) - delta));
    console.log('this.tagsScrollLimit>>>', this.tagsScrollLimit);

    if (!isLimitReached) {
      const shiftCalculated = parseFloat(currentShift) - delta;
      const shift = shiftCalculated > -0.05 ? 0 : shiftCalculated;

      this.setStyle(`${Math.abs(shift)}%`, `translateY(${shift}%)`);
    } else if (isMovingUp) {
      this.setStyle(`${Math.abs(this.tagsScrollLimit)}%`, `translateY(-${this.tagsScrollLimit}%)`);
    }
  }

  setStyle(thumbTop = '0px', tagsTransform = 'translateY(0%)') {
    if (!this.thumb || !this.tags) return false;
    this.thumb.style.top = thumbTop;
    this.tags.style.transform = tagsTransform;
    return true;
  }
}

export default Tags;
