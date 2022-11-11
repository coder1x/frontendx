import { boundMethod } from 'autobind-decorator';

class Throttle {
  sleep: number;

  action: string;

  onChange: Function;

  customEvent: string;

  private running: boolean = false;

  private objectThrottle: Window & typeof globalThis = window;

  private timeout: boolean = false;

  private currentTime: number = Date.now();

  constructor(onChange: Function, action = 'resize', sleep = 200) {
    this.action = action;
    this.customEvent = 'EventThrottleCustom';
    this.sleep = sleep;
    this.onChange = onChange ?? (() => { });
    this.optimized();
  }

  private optimized() {
    this.timeout = false;
    this.throttle();
    window.addEventListener(this.customEvent, this.handleOptimizedResize);
  }

  private throttle(object = window) {
    this.objectThrottle = object;
    object.addEventListener(this.action, this.handleThrottle);
  }

  @boundMethod
  private optimizedEnd() {
    if (Date.now() - this.currentTime < this.sleep) {
      setTimeout(this.optimizedEnd, this.sleep);
    } else {
      this.timeout = false;
      this.onChange();
    }
  }

  @boundMethod
  private handleOptimizedResize() {
    this.currentTime = Date.now();

    if (this.timeout === false) {
      this.timeout = true;
      setTimeout(this.optimizedEnd, this.sleep);
    }
  }

  @boundMethod
  private handleThrottle() {
    if (this.running) {
      return false;
    }
    this.running = true;

    requestAnimationFrame(() => {
      this.objectThrottle.dispatchEvent(new CustomEvent(this.customEvent));
      this.running = false;
    });

    return true;
  }
}

export default Throttle;
