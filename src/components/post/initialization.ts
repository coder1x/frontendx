import CopyCodeButton from './CopyCodeButton';

function initialization(className: string) {
  const layout = document.querySelectorAll(className);

  if (layout.length === 1) {
    new CopyCodeButton(layout[0]);
  }
}

initialization('.content');
