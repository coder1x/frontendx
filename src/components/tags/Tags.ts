import { boundMethod } from 'autobind-decorator';

class Tags {
  className: string;

  element: HTMLElement;

  private track: HTMLElement | null = null;

  private tags: HTMLUListElement | null = null;

  private frame: HTMLElement | null = null;

  private slider: HTMLElement | null = null;

  private scrollbar: HTMLElement | null = null;

  private shiftY: number = 0;

  private sliderHeight: number = 0;

  private tagsHeight: number = 0;

  private trackAreaHeight: number = 0;

  private tagsScrollLimit: number = 0;

  private tagsStartY: number | null = null;

  private deltaPrevious: number = 0;

  private isMouseOnFrame: boolean = false;

  private isDraggingUp: boolean = false;

  private tagsTranslateY: number = 0;

  private sliderTop: number = 0;

  private movementOnMouseHold: ReturnType<typeof setInterval> | null = null;

  private startMovementOnMouseHold: ReturnType<typeof setTimeout> | null = null;

  private buttonsUp: HTMLElement | null = null;

  private buttonsDown: HTMLElement | null = null;

  constructor(element: Element) {
    this.element = element as HTMLElement;
    this.className = 'js-tags';

    if (this.element) {
      this.init();
    }
  }

  private static handleWrapperDragStart(event: MouseEvent) {
    event.preventDefault();
  }

  private init() {
    this.setDomElement();
    this.bindEvent();
    this.setDimensions();
  }

  private setDomElement() {
    this.track = this.getElement('scrollbar-track') as HTMLElement;
    this.tags = this.getElement('list') as HTMLUListElement;
    this.frame = this.getElement('frame') as HTMLElement;
    this.slider = this.getElement('scrollbar-slider') as HTMLElement;
    this.buttonsUp = this.getElement('scrollbar-button-up') as HTMLElement;
    this.buttonsDown = this.getElement('scrollbar-button-down') as HTMLElement;
    this.scrollbar = this.getElement('scrollbar') as HTMLElement;
  }

  private getElement(nameElement: string, parentElement?: Element) {
    return (parentElement ?? this.element).querySelector(`.${this.className}__${nameElement}`);
  }

  private setDimensions() {
    if (!this.track || !this.frame) {
      return false;
    }

    const trackHeight = this.track.offsetHeight;
    const frameHeight = this.frame.offsetHeight;

    if (!this.tags || !this.slider) {
      return false;
    }

    this.tagsHeight = this.tags.offsetHeight;

    if (this.tagsHeight <= frameHeight) {
      this.track.style.display = 'none';

      if (this.buttonsUp && this.buttonsDown) {
        this.buttonsUp.style.display = 'none';
        this.buttonsDown.style.display = 'none';
      }
    }

    this.tagsScrollLimit = 100 - (frameHeight * 100) / this.tagsHeight;
    const sliderHeightCalc = (frameHeight * trackHeight) / this.tagsHeight;
    const SLIDER_MIN_HEIGHT = 20;
    this.sliderHeight = sliderHeightCalc > SLIDER_MIN_HEIGHT ? sliderHeightCalc : SLIDER_MIN_HEIGHT;

    this.slider.style.height = `${this.sliderHeight}px`;
    this.trackAreaHeight = trackHeight - this.sliderHeight;

    return true;
  }

  private defineDirection(deltaY: number) {
    if (deltaY === 0) {
      return '';
    }

    let signDirection = '';

    if (this.deltaPrevious < deltaY) signDirection = 'up';
    if (this.deltaPrevious > deltaY) signDirection = 'down';

    if (signDirection === '') {
      return '';
    }

    return signDirection;
  }

  private moveSlider(coordinateY: number) {
    if (!this.track) {
      return false;
    }

    const pointerTopPosition = coordinateY - this.track.getBoundingClientRect().top - this.shiftY;

    if (pointerTopPosition < 0) {
      this.tagsTranslateY = 0;
      this.sliderTop = 0;
      this.setStyle();

      return true;
    }

    if (pointerTopPosition > this.trackAreaHeight) {
      this.tagsTranslateY = this.tagsScrollLimit * -1;
      this.sliderTop = this.trackAreaHeight;
      this.setStyle();

      return true;
    }

    const scrollDistanceFull = (pointerTopPosition * this.tagsScrollLimit) / this.trackAreaHeight; // длина прокрутки
    const isScrollMax = scrollDistanceFull > this.tagsScrollLimit;
    const scrollDistance = isScrollMax ? this.tagsScrollLimit : scrollDistanceFull;

    this.tagsTranslateY = scrollDistance * -1;
    this.sliderTop = pointerTopPosition;
    this.setStyle();

    return true;
  }

  private moveTagsList(delta: number, isMovingUp = true) {
    const shift = this.tagsTranslateY - delta;
    const positiveShift = Math.abs(shift);

    /* в зависимости от направления движения, проверим, что мы не перешли верхнюю / нижнюю границу */
    const isLimitReached = isMovingUp ? positiveShift > this.tagsScrollLimit
      : this.tagsTranslateY >= 0;

    const pointerTopPosition = Math.abs((positiveShift * this.trackAreaHeight)
      / this.tagsScrollLimit);

    if (!isLimitReached) {
      this.tagsTranslateY = shift <= 0 ? shift : 0;
      this.sliderTop = shift <= 0 ? pointerTopPosition : 0;

      this.setStyle();
      return false;
    }

    if (isMovingUp) {
      this.tagsTranslateY = this.tagsScrollLimit * -1;
      this.sliderTop = this.trackAreaHeight;
    }

    this.setStyle();

    return true;
  }

  private setStyle() {
    if (!this.slider || !this.tags) {
      return false;
    }

    this.slider.style.top = `${this.sliderTop}px`;
    this.tags.style.transform = `translateY(${this.tagsTranslateY}%)`;

    return true;
  }

  @boundMethod
  private handleTagsFocusin() {
    if (!this.tags || !this.frame || !this.scrollbar) {
      return false;
    }

    const delta = this.tags.getBoundingClientRect().top - this.frame.getBoundingClientRect().top;
    const deltaPercent = (delta * 100) / this.tagsHeight;
    const pointerTopPosition = Math.abs((Math.abs(deltaPercent) * this.trackAreaHeight)
      / this.tagsScrollLimit);

    this.tagsTranslateY = deltaPercent <= 0 ? deltaPercent : 0;
    this.sliderTop = pointerTopPosition;
    this.tags.style.top = `${delta * -1}px`; // корректируем положение списка тегов, смещенных фокусом
    this.scrollbar.style.top = `${delta * -1}px`;

    if (this.slider) {
      this.slider.style.top = `${this.sliderTop}px`;
    }

    this.setStyle();

    return true;
  }

  @boundMethod
  private handleTagsTouchMove(event: TouchEvent) {
    event.preventDefault();

    if (this.tagsStartY === null) {
      return false;
    }

    const tagsEndY = event.touches[0].clientY;
    const deltaY = this.tagsStartY - tagsEndY;
    const isUp = deltaY > 0;

    if (!this.defineDirection(deltaY)) {
      return false;
    }

    const deltaCurrent = deltaY - this.deltaPrevious;
    const deltaCurrentPercent = (deltaCurrent * 100) / this.tagsHeight;
    this.deltaPrevious = deltaY;

    if (this.isDraggingUp !== isUp) {
      this.isDraggingUp = isUp;

      return false;
    }

    const isMovingUp = deltaY > 0 && deltaCurrent > 0;
    const isMovingDown = deltaY < 0 && deltaCurrent < 0;

    if (isMovingUp || isMovingDown) {
      this.moveTagsList(deltaCurrentPercent, isMovingUp);
    }

    return true;
  }

  @boundMethod
  private handleWindowWheel(event: WheelEvent) {
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
    if (!this.tags) {
      return false;
    }

    const { deltaY } = event;
    const deltaPercent = (deltaY * 100) / this.tagsHeight;

    this.moveTagsList(deltaPercent, deltaY > 0);

    return true;
  }

  @boundMethod
  private handleSliderPointerDown(event: PointerEvent) {
    if (!this.slider || !this.track) {
      return false;
    }

    this.slider.setPointerCapture(event.pointerId);
    this.shiftY = event.clientY - this.slider.getBoundingClientRect().top;
    this.track.addEventListener('pointermove', this.handleSliderPointerMove, { passive: true });
    this.track.addEventListener('pointerup', this.handleSliderPointerUp);

    return true;
  }

  @boundMethod
  private handleSliderPointerMove(event: PointerEvent) {
    event.preventDefault();
    this.moveSlider(event.clientY);
  }

  @boundMethod
  private handleSliderPointerUp() {
    if (!this.track) {
      return false;
    }

    this.track.removeEventListener('pointerup', this.handleSliderPointerUp);
    this.track.removeEventListener('pointermove', this.handleSliderPointerMove);

    return true;
  }

  @boundMethod
  private handleButtonPointerUp() {
    if (this.movementOnMouseHold) {
      clearInterval(this.movementOnMouseHold);
    }

    if (this.startMovementOnMouseHold) {
      clearTimeout(this.startMovementOnMouseHold);
    }
  }

  @boundMethod
  private handleTrackPointerDown(event: PointerEvent) {
    const target = event.target as HTMLElement;

    if (target.classList.contains(`${this.className}__scrollbar-slider`)) {
      return false;
    }

    this.shiftY = 0;
    this.moveSlider(event.clientY - this.sliderHeight / 2);

    return true;
  }

  @boundMethod
  private handleTagsTouchStart(event: TouchEvent) {
    this.deltaPrevious = 0;
    this.tagsStartY = event.touches[0].clientY;
  }

  @boundMethod
  private handleButtonPointerDown(event: PointerEvent) {
    const SHIFT_ON_BUTTON_PRESS = 20;
    const TIME_DELAY = 500;
    const TIME_INTERVAL = 100;

    const target = event.target as HTMLElement;
    let shift = (SHIFT_ON_BUTTON_PRESS * 100) / this.tagsHeight;
    let direction = true;

    if (target.closest(`.${this.className}__scrollbar-button-up`)) {
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

    return true;
  }

  private bindEvent() {
    this.element.addEventListener('dragstart', Tags.handleWrapperDragStart);

    if (this.buttonsUp && this.buttonsDown) {
      this.buttonsUp.addEventListener('pointerdown', this.handleButtonPointerDown);
      this.buttonsDown.addEventListener('pointerdown', this.handleButtonPointerDown);
      window.addEventListener('pointerup', this.handleButtonPointerUp);
    }

    if (this.track) {
      this.track.addEventListener('pointerdown', this.handleTrackPointerDown);
    }

    if (this.slider) {
      this.slider.addEventListener('pointerdown', this.handleSliderPointerDown);
    }

    if (this.tags) {
      this.tags.addEventListener('focusin', this.handleTagsFocusin);
      this.tags.addEventListener('wheel', this.handleTagsWheel, { passive: true });
      this.tags.addEventListener('touchstart', this.handleTagsTouchStart, { passive: false });
      this.tags.addEventListener('touchmove', this.handleTagsTouchMove, { passive: false });
    }

    window.addEventListener('mouseover', this.handleWindowMouseOver);
    window.addEventListener('wheel', this.handleWindowWheel, { passive: false });
  }
}

export default Tags;
