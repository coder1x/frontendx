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

  private startY: number | null = null;

  private deltaPrevious: number = 0;

  private isMouseOnFrame: boolean = false;

  private isMovementUp: boolean = false;

  private maxPercentage: number = 0;

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
    this.maxPercentage = 100 - (this.frameHeight * 100) / this.tagsHeight;

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
    this.startY = event.touches[0].clientY;
  }

  @boundMethod
  private handleTagsTouchMove(event: TouchEvent) {
    event.preventDefault();
    if (!this.startY || !this.tags) {
      return;
    }
    const endY = event.touches[0].clientY;
    const deltaY = this.startY - endY;

    const isUp = deltaY > 0;

    const deltaCurrent = deltaY - this.deltaPrevious;
    const deltaCurrentPercent = (deltaCurrent * 100) / this.tagsHeight;
    this.deltaPrevious = deltaY;
    const transformValue = this.tags.style.transform;

    /* При изменении направления движения (вверх / вниз) значение deltaCurrent может стать очень большим
    (в зависимости от того, насколько далеко провели пальцем при последнем скролле),
     что ведет к неправильному расчету. Поэтому делаем return при первом срабатывании после изменения направления */
    if (this.isMovementUp !== isUp) {
      this.isMovementUp = isUp;
      return;
    }

    if (deltaY > 0) { // скроллим вверх
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
    const { deltaY } = event;
    const deltaPercent = (deltaY * 100) / this.tagsHeight;
    const transformValue = this.tags.style.transform;

    if (deltaY > 0) { // скроллим вверх
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

    const scrollDistanceFull = (pointerTopPosition * 100)
      / (this.trackAreaHeight + this.thumbHeight); // длина прокрутки

    // проверим, что мы не прокрутили лишнего (не начало появляться пустое пространство под списком тегов)
    const scrollDistance = scrollDistanceFull > this.tagsScrollLimit
      ? this.tagsScrollLimit : scrollDistanceFull;
    this.setStyle(`${pointerTopPosition}px`, `translateY(-${scrollDistance}%)`);
    return true;
  }

  moveTagsList(transform: string, delta: number, isMovingUp = true) {
    if (!this.thumb || !this.tags) return;

    /* здесь используем утверждение as, т.к. знаем, что свойство transform = translateY существует */
    const currentShift = (transform.match(/(?<=translateY\()[0-9-.]+/) as Array<any>)[0];
    const newShift = parseFloat(currentShift) - delta;

    /* в зависимости от направления движения, проверим, что мы не перешли верхнюю / нижнюю границу */
    const isLimitReached = isMovingUp ? Math.abs(newShift) > this.tagsScrollLimit
      : parseFloat(currentShift) > 0;

    const shiftCalculated = newShift;
    const shift = shiftCalculated > -0.001 ? 0 : shiftCalculated;
    const pointerTopPosition = Math.abs(((Math.abs(shift)) * this.trackAreaHeight)
      / this.maxPercentage);

    if (!isLimitReached) {
      this.setStyle(`${Math.abs(pointerTopPosition)}px`, `translateY(${shift}%)`);
    } else if (isMovingUp) {
      this.setStyle(`${this.trackAreaHeight}px`, `translateY(-${this.tagsScrollLimit}%)`);
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
