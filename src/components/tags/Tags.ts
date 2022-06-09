/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { boundMethod } from 'autobind-decorator';

class Tags {
  className: string = '';

  wrapper: HTMLElement | null = null;

  track: HTMLElement | null = null;

  tags: HTMLElement | null = null;

  constructor(className: string, elem: Element) {
    this.wrapper = elem as HTMLElement;
    this.className = className.replace('.tags-wrapper', 'tags');
    this.init();
  }

  init() {
    if (!this.wrapper) return false;
    this.track = this.wrapper.querySelector(`.${this.className}__scrollbar-track`);
    this.tags = this.wrapper.querySelector(`.${this.className}`);
    this.bindEvent();

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
