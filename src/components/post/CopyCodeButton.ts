import { boundMethod } from 'autobind-decorator';

class CopyCodeButton {
  className: string = '';

  element: HTMLElement | null = null;

  private codes: Element[] | null = null;

  constructor(element: Element) {
    this.element = element as HTMLElement;
    this.className = '.wp-block-code';
    this.init();
  }

  @boundMethod
  private static handleButtonClick(event: MouseEvent) {
    const element = event.currentTarget as HTMLButtonElement;
    const sibling = element.previousElementSibling as HTMLElement;

    if (sibling) {
      const code = sibling.innerText;

      navigator.clipboard.writeText(code)
        .then(() => {
        })
        .catch((err) => {
          console.log('Something went wrong', err);
        });
    }
  }

  private static bindEvent(button: HTMLButtonElement) {
    button.addEventListener('click', CopyCodeButton.handleButtonClick);
  }

  private init() {
    if (!this.element) {
      return false;
    }

    this.setDomElement();

    return true;
  }

  private createButtons() {
    this.codes?.forEach((item) => {
      const button = document.createElement('button');
      button.innerText = 'Скопировать';
      button.className = 'button-copy';

      CopyCodeButton.bindEvent(button);
      item.append(button);
    });
  }

  private setDomElement() {
    if (!this.element) {
      return false;
    }

    this.codes = [
      ...this.element.querySelectorAll(this.className),
    ];

    this.createButtons();

    return true;
  }
}

export default CopyCodeButton;
