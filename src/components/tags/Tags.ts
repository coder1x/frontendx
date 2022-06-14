/* eslint-disable no-unused-vars */
import { boundMethod } from 'autobind-decorator';

class Tags {
  test: boolean = false;

  className: string = '';

  wrapper: HTMLElement | null = null;

  track: HTMLElement | null = null;

  tags: HTMLElement | null = null;

  tagsList: HTMLElement | null = null;

  frame: HTMLElement | null = null;

  thumb: HTMLElement | null = null;

  buttonDown: HTMLElement | null = null;

  shiftY: number = 0;

  trackHeight: number = 0;

  thumbHeight: number = 0;

  tagsHeight: number = 0;

  frameHeight: number = 0;

  trackAreaHeight: number = 0;

  constructor(className: string, elem: Element) {
    this.wrapper = elem as HTMLElement;
    this.className = className.replace('.tags-wrapper', 'tags');
    this.init();
    this.renderThumb();
  }

  init() {
    if (!this.wrapper) return false;
    this.track = this.wrapper.querySelector(`.${this.className}__scrollbar-track`);
    this.tags = this.wrapper.querySelector(`.${this.className}`);
    this.frame = this.wrapper.querySelector(`.${this.className}-frame`);
    this.thumb = this.wrapper.querySelector(`.${this.className}__scrollbar-thumb`);
    this.buttonDown = this.wrapper.querySelector(`.${this.className}__scrollbar-button_down`);
    this.dragControlMouse();

    return true;
  }

  renderThumb() {
    if (!this.track || !this.tags || !this.frame || !this.thumb || !this.buttonDown) return false;
    this.trackHeight = this.track.offsetHeight;
    this.tagsHeight = this.tags.offsetHeight;
    console.log('this.tagsHeight>>>', this.tagsHeight);

    this.frameHeight = this.frame.offsetHeight;

    /* высота элемента tags относится к высоте frame так же, как track к thumb => вычислим высоту thumb (ползунка) */
    const thumbHeightCalc = (this.frameHeight * this.trackHeight) / this.tagsHeight;
    this.thumbHeight = thumbHeightCalc > 20 ? thumbHeightCalc : 20;
    this.thumb.style.height = `${this.thumbHeight}px`;
    this.trackAreaHeight = this.trackHeight - this.thumbHeight;
    return true;
  }

  // Вешаем обработчики события нажатия мышью на ползунке (захвата ползунка) и перемещения ползунка
  @boundMethod
  private dragControlMouse() {
    const handlePointerStart = (event: PointerEvent) => {
      event.preventDefault();
      const { target } = event;// as HTMLElement;
      if (!(target instanceof HTMLElement)) {
        throw new Error('Cannot handle move outside of DOM');
      }
      target.classList.add(`${this.className}__scrollbar-thumb_grabbing`);

      if (this.thumb) {
        this.shiftY = event.clientY - this.thumb.getBoundingClientRect().top;
      }
      const handlePointerMove = (innerEvent: PointerEvent) => {
        if (this.thumb && this.track) {
          const pointerTopPosition = innerEvent.clientY
            - this.track.getBoundingClientRect().top - this.shiftY;

          if (pointerTopPosition < 0) {
            this.thumb.style.top = '0px';
            if (this.tags) {
              this.tags.style.transform = 'translateY(0)';
            }
            return true;
          }
          if (pointerTopPosition > this.trackAreaHeight) {
            this.thumb.style.top = `${this.trackAreaHeight}px`;
            if (this.tags) {
              this.tags.style.transform = 'translateY(100%)';
            }
            return true;
          }
          this.thumb.style.top = `${pointerTopPosition}px`;
          const scrollDistance = (pointerTopPosition * 100) / this.trackAreaHeight;
          if (this.tags) {
            this.tags.style.transform = `translateY(-${scrollDistance}%)`;
          }

          return true;
        }
        return true;
      };

      const handlePointerUp = () => {
        console.log('handlePointerUp');

        target.classList.remove(`${this.className}__scrollbar-thumb_grabbing`);
        target
          .removeEventListener('pointermove', handlePointerMove);
        target
          .removeEventListener('pointerup', handlePointerUp);
      };

      /* elem.setPointerCapture(pointerId) – привязывает события с данным pointerId к elem.
  После такого вызова все события указателя с таким pointerId будут иметь elem в
  качестве целевого элемента (как будто произошли над elem), вне зависимости от того,
  где в документе они произошли. */
      target.setPointerCapture(event.pointerId);
      target.addEventListener('pointermove', handlePointerMove);
      target.addEventListener('pointerup', handlePointerUp);
    };
    const handleDragSelectStart = () => false;
    if (this.thumb) {
      this.thumb.addEventListener('pointerdown', handlePointerStart);
      this.thumb.addEventListener('dragstart', handleDragSelectStart);
      this.thumb.addEventListener('selectstart', handleDragSelectStart);
    }
  }
}

export default Tags;
