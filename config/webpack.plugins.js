const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

const FoxFavicon = require('fox-favicon');
const FoxUrlConvertor = require('fox-url-convertor');

const path = require('path');
const env = require('./isDev');
const FL = require('./filename');
const paths = require('./paths');

const pagesDir = path.join(paths.src, '/pages/');

const pages = fs.readdirSync(pagesDir).map((file) => {
  return file.split('/', 2);
});

const description = 'Разбираем как использовать различные паттерны и подходы ' +
  ' в frontend разработке';
const keywords = 'webDev, frontend, веб разработка,' +
  'плагины, компоненты, Java Script, Type Script, WebPack, CSS, SCSS, PUG';

const plugins = [];

if (env.isDev) {
  plugins.push(
    new ESLintPlugin({
      extensions: ['js', 'ts'],
    }));
}

plugins.push(
  new CleanWebpackPlugin()
);

plugins.push(
  ...pages.map((fileName) => new HTMLWebpackPlugin({
    filename: `./${fileName}.html`,
    template: `./pages/${fileName}/${fileName}.pug`,
    alwaysWriteToDisk: true,
    inject: 'body',
    hash: true,
    meta: {
      viewport: {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1',
      },
      description: {
        name: 'description',
        content: description,
      },
      keywords: {
        name: 'keywords',
        content: keywords,
      },
      'twitter-card': {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      'twitter-title': {
        name: 'twitter:title',
        content: 'Frontend для прагматиков',
      },
      'twitter-description': {
        name: 'twitter:description',
        content: description,
      },
      'twitter-site': {
        name: 'twitter:site',
        content: 'https://frontendx.ru/',
      },
      'twitter-image': {
        name: 'twitter:image',
        content: 'https://frontendx.ru/social.webp',
      },
      'og-type': {
        property: 'og:type',
        content: 'blog',
      },
      'og-title': {
        property: 'og:title',
        content: 'Frontend для прагматиков',
      },
      'og-description': {
        property: 'og:description',
        content: description,
      },
      'og-image': {
        property: 'og:image',
        content: 'https://frontendx.ru/social.webp',
      },
    },
  })),
);

plugins.push(
  new FoxUrlConvertor({
    URLchange: '%5C',
    URLto: '/',
  }),
);

plugins.push(
  new FoxFavicon({
    src: path.join(paths.src, paths.assets, 'images/icon/favicon.png'),
    path: 'assets/favicons/',
    urlIcon: 'assets/favicons/',
    devMode: env.isDev,
    appName: 'Frontend для прагматиков',
    appShortName: 'Frontend для прагматиков',
    appDescription: 'Узнайте, как использовать Range Slider Fox'
      + ' на нескольких практических демонстрациях',
    developerName: 'coder1',
    developerURL: 'https://github.com/coder1x/',
    icons: {
      android: [
        'android-chrome-36x36.png',
        'android-chrome-48x48.png',
        'android-chrome-72x72.png',
        'android-chrome-96x96.png',
        'android-chrome-144x144.png',
        'android-chrome-192x192.png',
        'android-chrome-256x256.png',
      ],
      appleIcon: [
        'apple-touch-icon-114x114.png',
        'apple-touch-icon-120x120.png',
        'apple-touch-icon-167x167.png',
        'apple-touch-icon-57x57.png',
        'apple-touch-icon-60x60.png',
        'apple-touch-icon-72x72.png',
        'apple-touch-icon-76x76.png',
        'apple-touch-icon-precomposed.png',
        'apple-touch-icon.png',
      ],
      appleStartup: [],
      coast: true, // Create Opera Coast icon. `boolean`
      favicons: true, // Create regular favicons. `boolean`
      firefox: [
        'firefox_app_60x60.png',
        'firefox_app_128x128.png',
      ],
      opengraph: true, // Create Facebook OpenGraph image. `boolean`
      twitter: true, // Create Twitter Summary Card image. `boolean`
      windows: true, // Create Windows 8 tile icons. `boolean`
      yandex: true, // Create Yandex browser icon. `boolean`
    },
  }),
);

plugins.push(
  new MiniCssExtractPlugin({
    filename: FL.filename('css'),
  }),
);

module.exports = {
  plugins: plugins,
};
