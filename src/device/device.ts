import Tile from './components/videoTile/index';

import picture from '../components/picture/picture.hbs';
import nav from '../components/nav/index';
import foo from '../components/footer';

import headerData from '../data/header.json';
import dataVideos from '../data/video.json';
import footerData from '../data/footer.json';

import imgSrc from '../images/logo@1x.png';
import imgSrcset from '../images/logo@2x.png';
import sourceSrcset from '../images/logo.svg';

export interface VideoDataElement {
  title: string;
  class: string;
  url: string;
}

/*Загружаем логотип для сайта */
const imageLogo = {
  class: 'logo',
  sourceSrcset: sourceSrcset,
  imgSrc: imgSrc,
  imgSrcset: `${imgSrcset} 2x`,
  imgAlt: 'Яндекс дом'
};
const dataLogo = picture(imageLogo);
const logoHTML: Element = <Element>document.querySelector('.logo-href');
logoHTML.innerHTML = dataLogo;

/*Загружаем данные для меню */
const dataNav = nav(headerData);
/*Получаем результат шаблонизатора и вставлем в html*/
const navHtml: Element = <Element>document.querySelector('.nav-list');
navHtml.innerHTML = dataNav;

/*Получаем данные для видео -тайлов*/
dataVideos.forEach((dataVideo: VideoDataElement) => {
  /*Получаем результат шаблонизатора и вставлем в html*/
  const videosContainer: HTMLDivElement = <HTMLDivElement>document.querySelector('.content-device');
  if (videosContainer) {
    new Tile(dataVideo, videosContainer, dataVideo.url);
  }
});

const dataFoo = foo(footerData);
/*Получаем результат шаблонизатора и вставлем в html*/
const fooHtml = document.querySelector('.foo-menu');
if (fooHtml) {
  fooHtml.innerHTML = dataFoo;
}
