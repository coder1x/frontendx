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

  private tagsStartY: number | null = null;

  private deltaPrevious: number = 0;

  private isMouseOnFrame: boolean = false;

  private isDraggingUp: boolean = false;

  private tagsTranslateY: number = 0;

  private thumbTop: number = 0;

  constructor(className: string, element: Element) {
    this.wrapper = element as HTMLElement;
    this.className = className.replace(/^./, '');
    this.init();
  }

  private init() {
    if (!this.wrapper) return false;
    this.track = this.wrapper.querySelector(`.${this.className}__scrollbar-track`);
    this.tags = this.wrapper.querySelector(`.${this.className}__list`);
    this.frame = this.wrapper.querySelector(`.${this.className}__frame`);
    this.thumb = this.wrapper.querySelector(`.${this.className}__scrollbar-thumb`);
    this.bindEvent();

    this.setDimensions();
    return true;
  }

  private setDimensions() {
    if (!this.track || !this.frame) return false;
    this.trackHeight = this.track.offsetHeight;
    this.frameHeight = this.frame.offsetHeight;

    if (!this.tags || !this.thumb) return false;
    this.tagsHeight = this.tags.offsetHeight;

    //  this.tagsScrollLimit - значение, до которого можно прокручивать теги без появления пустого пространства (максимальный процент )
    this.tagsScrollLimit = 100 - (this.frameHeight * 100) / this.tagsHeight;

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
      this.tags.addEventListener('wheel', this.handleTagsWheel);
      this.tags.addEventListener('touchstart', this.handleTagsTouchStart);
      this.tags.addEventListener('touchmove', this.handleTagsTouchMove);
    }

    window.addEventListener('mouseover', this.handleWindowMouseOver);
    window.addEventListener('wheel', this.handleWindowWheel, { passive: false });
  }

  @boundMethod
  private handleTagsTouchStart(event: TouchEvent) {
    this.tagsStartY = event.touches[0].clientY;
  }

  @boundMethod
  private handleTagsTouchMove(event: TouchEvent) {
    event.preventDefault();

    if (this.tagsStartY === null || !this.tags) return;
    const tagsEndY = event.touches[0].clientY;
    const deltaY = this.tagsStartY - tagsEndY;
    const isUp = deltaY > 0;
    if (deltaY === 0) return;

    const deltaCurrent = deltaY - this.deltaPrevious;
    const deltaCurrentPercent = (deltaCurrent * 100) / this.tagsHeight;
    this.deltaPrevious = deltaY;

    /* При изменении направления движения (вверх / вниз) значение deltaCurrent может стать очень большим
    (в зависимости от того, насколько далеко провели пальцем при последнем скролле),
     что ведет к неправильному расчету. Поэтому делаем return при первом срабатывании после изменения направления */
    if (this.isDraggingUp !== isUp) {
      console.log('this.isDraggingUp>>>', this.isDraggingUp);
      console.log('isUp>>>', isUp);

      this.isDraggingUp = isUp;
      return;
    }

    const isMovingUp = deltaY > 0 && deltaCurrent > 0;
    const isMovingDown = deltaY < 0 && deltaCurrent < 0;

    if (isMovingUp || isMovingDown) this.moveTagsList(deltaCurrentPercent, isMovingUp);
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
    this.isMouseOnFrame = Boolean(target.closest(`.${this.className}__frame`));
  }

  @boundMethod
  private handleTagsWheel(event: WheelEvent) {
    if (!this.tags) return;

    const { deltaY } = event;
    const deltaPercent = (deltaY * 100) / this.tagsHeight;

    this.moveTagsList(deltaPercent, deltaY > 0);
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
      this.tagsTranslateY = 0;
      this.thumbTop = 0;
      this.setStyle();
      return true;
    }

    if (pointerTopPosition > this.trackAreaHeight) {
      this.tagsTranslateY = this.tagsScrollLimit * -1;
      this.thumbTop = this.trackAreaHeight;
      this.setStyle();
      return true;
    }

    const scrollDistanceFull = (pointerTopPosition * 100) / this.trackHeight; // длина прокрутки

    // проверим, что мы не прокрутили лишнего (не начало появляться пустое пространство под списком тегов)
    const scrollDistance = scrollDistanceFull > this.tagsScrollLimit
      ? this.tagsScrollLimit : scrollDistanceFull;
    this.tagsTranslateY = scrollDistance * -1;
    this.thumbTop = pointerTopPosition;
    this.setStyle();
    return true;
  }

  private moveTagsList(delta: number, isMovingUp = true) {
    if (!this.thumb || !this.tags) return;

    const newShift = this.tagsTranslateY - delta;

    /* в зависимости от направления движения, проверим, что мы не перешли верхнюю / нижнюю границу */
    const isLimitReached = isMovingUp ? Math.abs(newShift) > this.tagsScrollLimit
      : this.tagsTranslateY > 0;

    const shiftCalculated = newShift;
    const shift = shiftCalculated > -0.001 ? 0 : shiftCalculated;

    const pointerTopPosition = Math.abs(((Math.abs(shift)) * this.trackAreaHeight)
      / this.tagsScrollLimit);

    if (!isLimitReached) {
      this.tagsTranslateY = shift;
      this.thumbTop = pointerTopPosition;
    } else if (isMovingUp) {
      this.tagsTranslateY = this.tagsScrollLimit * -1;
      this.thumbTop = this.trackAreaHeight;
    }
    this.setStyle();
  }

  private setStyle() {
    if (!this.thumb || !this.tags) return false;
    this.thumb.style.top = `${this.thumbTop}px`;
    this.tags.style.transform = `translateY(${this.tagsTranslateY}%)`;
    return true;
  }
}

export default Tags;
