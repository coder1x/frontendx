/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { boundMethod } from 'autobind-decorator';

class Tags {
  className: string = '';

  wrapper: HTMLElement | null = null;

  track: HTMLElement | null = null;

  tags: HTMLElement | null = null;

  tagsList: HTMLElement | null = null;

  frame: HTMLElement | null = null;

  thumb: HTMLElement | null = null;

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
    this.bindEvent();

    return true;
  }

  renderThumb() {
    if (!this.track || !this.tags || !this.frame || !this.thumb) return false;
    const trackHeight = this.track.offsetHeight;
    const tagsHeight = this.tags.offsetHeight;
    const frameHeight = this.frame.offsetHeight;
    /* высота элемента tags относится к высоте frame так же, как track к thumb => вычислим высоту thumb (ползунка) */
    const thumbHeight = (frameHeight * trackHeight) / tagsHeight;
    this.thumb.style.height = thumbHeight > 20 ? `${thumbHeight}px` : '20px';
    return true;
  }

  @boundMethod
  handleScrollbarTrackClick(e: MouseEvent) {
    const currentTarget = e.currentTarget as HTMLElement;
    if (!this.tags) return false;
    console.log(this.tags.offsetHeight);
    this.tags.style.transform = 'translateY(-150px)';
    return true;
  }

  bindEvent() {
    if (!this.track) return false;

    this.track.addEventListener('click', this.handleScrollbarTrackClick);
    return true;
  }
}

export default Tags;
