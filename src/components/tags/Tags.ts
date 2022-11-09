import { boundMethod } from 'autobind-decorator';

class Tags {
  private className: string;

  private wrapper: HTMLElement;

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

  // eslint-disable-next-line no-undef
  private movementOnMouseHold: NodeJS.Timer | null = null;

  // eslint-disable-next-line no-undef
  private startMovementOnMouseHold: NodeJS.Timeout | null = null;

  // eslint-disable-next-line no-undef
  private buttons: NodeListOf<HTMLElement> | null = null;

  constructor(className: string, element: Element) {
    this.wrapper = element as HTMLElement;
    this.className = className.replace(/^./, '');
    this.init();
  }

  private init() {
    if (!this.wrapper) return false;
    this.track = this.getElement('scrollbar-track');
    this.tags = this.getElement('list');
    this.frame = this.getElement('frame');
    this.thumb = this.getElement('scrollbar-thumb');
    this.buttons = this.wrapper.querySelectorAll(
      `.${this.className}__scrollbar-button`,
      // eslint-disable-next-line no-undef
    ) as NodeListOf<HTMLElement>;

    this.bindEvent();

    this.setDimensions();
    return true;
  }

  private getElement(selector: string) {
    if (!this.wrapper) return null;
    return this.wrapper.querySelector(`.${this.className}__${selector}`) as HTMLElement;
  }

  private setDimensions() {
    if (!this.track || !this.frame) return false;
    this.trackHeight = this.track.offsetHeight;
    this.frameHeight = this.frame.offsetHeight;

    if (!this.tags || !this.thumb) return false;
    this.tagsHeight = this.tags.offsetHeight;

    if (this.tagsHeight <= this.frameHeight) {
      this.track.style.display = 'none';
      if (this.buttons) {
        this.buttons.forEach((button) => {
          // eslint-disable-next-line no-param-reassign
          button.style.display = 'none';
        });
      }
    }

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
    this.wrapper.addEventListener('dragstart', Tags.handleWrapperDragstart);

    if (this.buttons) {
      this.buttons.forEach((button) => {
        button.addEventListener('pointerdown', this.handleButtonPointerdown);
        window.addEventListener('pointerup', this.handleButtonPointerup);
      });
    }
    if (this.track) {
      this.track.addEventListener('pointerdown', this.handleTrackPointerdown);
    }

    if (this.thumb) {
      this.thumb.addEventListener('pointerdown', this.handleThumbPointerDown);
    }

    if (this.tags) {
      this.tags.addEventListener('focusin', this.handleTagsFocusin);
      this.tags.addEventListener('wheel', this.handleTagsWheel);
      this.tags.addEventListener('touchstart', this.handleTagsTouchStart);
      this.tags.addEventListener('touchmove', this.handleTagsTouchMove);
    }

    window.addEventListener('mouseover', this.handleWindowMouseOver);
    window.addEventListener('wheel', this.handleWindowWheel, { passive: false });
  }

  @boundMethod
  static handleWrapperDragstart(event: Event) {
    event.preventDefault();
  }

  @boundMethod
  private handleTagsFocusin() {
    if (!this.tags || !this.frame) return;

    const delta = this.tags.getBoundingClientRect().top - this.frame.getBoundingClientRect().top;
    const deltaPercent = (delta * 100) / this.tagsHeight;
    const pointerTopPosition = Math.abs(((Math.abs(deltaPercent)) * this.trackAreaHeight)
      / this.tagsScrollLimit);

    this.tagsTranslateY = deltaPercent <= 0 ? deltaPercent : 0;
    this.thumbTop = pointerTopPosition;
    this.tags.style.top = `${delta * -1}px`; // корректируем положение списка тегов, смещенных фокусом

    if (this.thumb) this.thumb.style.top = `${this.thumbTop}px`;
    this.setStyle();
  }

  @boundMethod
  private handleButtonPointerup() {
    if (this.movementOnMouseHold) {
      clearInterval(this.movementOnMouseHold);
    }
    if (this.startMovementOnMouseHold) {
      clearTimeout(this.startMovementOnMouseHold);
    }
  }

  @boundMethod
  private handleButtonPointerdown(event: PointerEvent) {
    const SHIFT_ON_BUTTON_PRESS = 20;
    const TIME_DELAY = 500;
    const TIME_INTERVAL = 100;

    if (!this.thumb) return;

    const target = event.target as HTMLElement;
    let shift = (SHIFT_ON_BUTTON_PRESS * 100) / this.tagsHeight;
    let direction = true;
    if (target.closest(`.${this.className}__scrollbar-button_up`)) {
      shift *= -1;
      direction = false;
    }

    this.moveTagsList(shift, direction);

    this.startMovementOnMouseHold = setTimeout(
      () => {
        this.movementOnMouseHold = setInterval(
          () => this.moveTagsList(shift, direction),
          TIME_INTERVAL,
        );
      },
      TIME_DELAY,
    );
  }

  @boundMethod
  private handleTrackPointerdown(event: PointerEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains(`${this.className}__scrollbar-thumb`)) return;
    this.shiftY = 0;
    this.moveThumb(event.clientY - this.thumbHeight / 2);
  }

  @boundMethod
  private handleTagsTouchStart(event: TouchEvent) {
    this.deltaPrevious = 0;
    this.tagsStartY = event.touches[0].clientY;
  }

  private defineDirection(deltaY: number) {
    if (deltaY === 0) return false;

    let signDirection = '';

    if (this.deltaPrevious < deltaY) signDirection = 'up';
    if (this.deltaPrevious > deltaY) signDirection = 'down';

    if (signDirection === '') return false;

    return signDirection;
  }

  @boundMethod
  private handleTagsTouchMove(event: TouchEvent) {
    event.preventDefault();
    if (this.tagsStartY === null || !this.tags) return;
    const tagsEndY = event.touches[0].clientY;
    const deltaY = this.tagsStartY - tagsEndY;
    const isUp = deltaY > 0;

    if (!this.defineDirection(deltaY)) return;

    const deltaCurrent = deltaY - this.deltaPrevious;
    const deltaCurrentPercent = (deltaCurrent * 100) / this.tagsHeight;
    this.deltaPrevious = deltaY;

    /* При изменении направления движения (вверх / вниз) значение deltaCurrent может стать очень большим
    (в зависимости от того, насколько далеко провели пальцем при последнем скролле),
     что ведет к неправильному расчету. Поэтому делаем return при первом срабатывании после изменения направления */
    if (this.isDraggingUp !== isUp) {
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
    if (!this.thumb || !this.track || !this.tags || !this.frame) return false;
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
    if (!this.track || !this.tags || !this.frame) return false;
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

    const scrollDistanceFull = (pointerTopPosition * this.tagsScrollLimit) / this.trackAreaHeight; // длина прокрутки

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

    const shift = this.tagsTranslateY - delta;

    /* в зависимости от направления движения, проверим, что мы не перешли верхнюю / нижнюю границу */
    const isLimitReached = isMovingUp ? Math.abs(shift) > this.tagsScrollLimit
      : this.tagsTranslateY >= 0;

    const pointerTopPosition = Math.abs(((Math.abs(shift)) * this.trackAreaHeight)
      / this.tagsScrollLimit);

    if (!isLimitReached) {
      this.tagsTranslateY = shift <= 0 ? shift : 0;

      this.thumbTop = shift <= 0 ? pointerTopPosition : 0;

      this.setStyle();
      return;
    }
    if (isMovingUp) {
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
