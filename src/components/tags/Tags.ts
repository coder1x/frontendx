import { boundMethod } from 'autobind-decorator';

class Tags {
  private className: string = '';

  private wrapper: HTMLElement | null = null;

  private track: HTMLElement | null = null;

  private tags: HTMLElement | null = null;

  private tagsList: HTMLElement | null = null;

  private frame: HTMLElement | null = null;

  private thumb: HTMLElement | null = null;

  private buttonDown: HTMLElement | null = null;

  private shiftY: number = 0;

  private trackHeight: number = 0;

  private thumbHeight: number = 0;

  private tagsHeight: number = 0;

  private frameHeight: number = 0;

  private trackAreaHeight: number = 0;

  private tagsScrollLimit: number = 0;

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
    this.buttonDown = this.wrapper.querySelector(`.${this.className}__scrollbar-button_down`);
    this.bindEvent();

    return true;
  }

  private getDimentions() {
    if (!this.track || !this.tags || !this.frame || !this.thumb) return false;
    this.trackHeight = this.track.offsetHeight;
    this.tagsHeight = this.tags.offsetHeight;
    this.frameHeight = this.frame.offsetHeight;
    //  this.tagsScrollLimit - значение, до которого можно прокручивать теги без появления пустого пространства (максимальный процен )
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

  @boundMethod
  private moveThumb(coordinateY: number) {
    const setStyle = (thumbTop = '0px', tagsTransform = 'translateY(0)') => {
      if (!this.thumb || !this.tags) return false;
      this.thumb.style.top = thumbTop;
      this.tags.style.transform = tagsTransform;
      return true;
    };

    if (!this.track) return false;

    const pointerTopPosition = coordinateY
      - this.track.getBoundingClientRect().top - this.shiftY;

    if (pointerTopPosition < 0) {
      setStyle();
      return true;
    }

    if (pointerTopPosition > this.trackAreaHeight) {
      setStyle(`${this.trackAreaHeight}px`, `translateY(-${this.tagsScrollLimit}%)`);
      return true;
    }

    const scrollDistanceFull = (pointerTopPosition * 100) / this.trackAreaHeight; // длина прокрутки
    // проверим, что мы не прокрутили лишнего (не начало появляться пустое пространство под списком тегов)
    const scrollDistance = scrollDistanceFull > this.tagsScrollLimit
      ? this.tagsScrollLimit : scrollDistanceFull;
    setStyle(`${pointerTopPosition}px`, `translateY(-${scrollDistance}%)`);
    return true;
  }
}

export default Tags;
