const env = require('./isDev');

module.exports = {
  filename(ext) {
    let dir = '';

    if (ext === 'css') {
      dir = 'assets/css/';
    } else if (ext === 'js') {
      dir = 'assets/js/';
    }

    if (env.isDev) {
      return `${dir}[name].${ext}`;
    }
    return `${dir}[name].[hash].${ext}`;
  },
};
