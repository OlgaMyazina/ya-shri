import Store from '../../../flux/build/store/store';
import Tile from './components/videoTile/index';
import foo from '../components/footer';
import header from '../components/header';

import headerData from '../data/header.json';
import dataVideos from '../data/video.json';
import footerData from '../data/footer.json';

export interface VideoDataElement {
  title: string;
  class: string;
  url: string;
}

/*Импортируем изображения для логотипа */
import imgLogoSrc from '../images/logo@1x.png';
import imgLogoSrcset from '../images/logo@2x.png';
import sourceLogoSrcset from '../images/logo.svg';

/*Импортируем изображения для меню */
import imgMenuIconSrc from '../images/icon_list_m.png';
import imgMenuIconSrcset from '../images/icon_list_m@2x.png';
import sourceMenuIconSrcset from '../images/icon_list_m@1x.svg';

/*Загружаем логотип для сайта */
const imageLogo = {
  class: 'logo__picture',
  sourceSrcset: sourceLogoSrcset,
  imgSrc: imgLogoSrc,
  imgSrcset: `${imgLogoSrcset} 2x`,
  imgAlt: 'Яндекс дом'
};

/*Загружаем иконку меню для сайта*/
const imageIcon = {
  class: 'menu-toggle__picture',
  sourceSrcset: sourceMenuIconSrcset,
  imgSrc: imgMenuIconSrc,
  imgSrcset: `${imgMenuIconSrcset} 2x`,
  imgAlt: 'menu'
};

/*Шаблонизатор header */
headerData.logo = imageLogo;
headerData.icon = imageIcon;
/*Получаем результат шаблонизатора и вставлем в html*/
const dataHeader = header(headerData);
const headerHTML: HTMLElement = <HTMLElement>document.querySelector('.header-wrap');
headerHTML.innerHTML = dataHeader;

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
interface iVideos {
  videos: iVideoState[];
}
interface iVideoState {
  brightness: string;
  contrast: string;
  videoId: string;
}

function videoState(state = 0, action: iVideoState) {
  const newState: iVideoState = {
    brightness: action.brightness,
    contrast: action.contrast,
    videoId: action.videoId
  };
  return newState;
}
let store = new Store(videoState);
console.log(store);
store.subscribe(() => console.log(store.getState()));

store.dispatch({
  brightness: 1.8,
  contrast: 0.1,
  videoId: 2
});
store.dispatch({
  brightness: 1,
  contrast: 1.5,
  videoId: 2
});
store.dispatch({
  brightness: 0.3,
  contrast: 2.8,
  videoId: 2
});
