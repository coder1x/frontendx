
class Throttle {
  sleep: number;
  action: string;
  onChange: Function;
  customEvent: string;

  constructor(action: string, onChange: Function, sleep: number) {
    this.action = action ?? 'resize';
    this.customEvent = 'EventThrottleCustom';
    this.sleep = sleep ?? 200;
    this.onChange = onChange ?? (() => { });
    this.optimized();
  }

  private optimized() {
    let rTime: Date;
    let timeout = false;

    const optimizedEnd = () => {
      if (Number(new Date()) - Number(rTime) < this.sleep) {
        setTimeout(optimizedEnd, this.sleep);
      } else {
        timeout = false;
        this.onChange();
      }
    };

    this.throttle();

    window.addEventListener(this.customEvent, () => {
      rTime = new Date();
      if (timeout === false) {
        timeout = true;
        setTimeout(optimizedEnd, this.sleep);
      }
    });
  }

  private throttle(obj = window) {
    let running = false;
    let func = () => {
      if (running) { return false; }
      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(this.customEvent));
        running = false;
      });
    };
    obj.addEventListener(this.action, func);
  }

}


export default Throttle;