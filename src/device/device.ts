import Store from '../../../flux/build/store/store';
import Tile from './components/videoTile/index';
import foo from '../components/footer';
import header from '../components/header';

import headerData from '../data/header.json';
import dataVideos from '../data/video.json';
import footerData from '../data/footer.json';

/*Импортируем изображения для логотипа */
import imgLogoSrc from '../images/logo@1x.png';
import imgLogoSrcset from '../images/logo@2x.png';
import sourceLogoSrcset from '../images/logo.svg';

/*Импортируем изображения для меню */
import imgMenuIconSrc from '../images/icon_list_m.png';
import imgMenuIconSrcset from '../images/icon_list_m@2x.png';
import sourceMenuIconSrcset from '../images/icon_list_m@1x.svg';

export interface VideoDataElement {
  title: string;
  class: string;
  url: string;
}

interface iVideos {
  [key: string]: iVideoState;
}

interface iVideoState {
  brightness: string;
  contrast: string;
  //videoId: string;
}

const TypeVideoSettings = 'videoSettingChange';

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

let initialState: iVideos = {};
function onChange(action: any) {
  store.dispatch(action);
}
function videoReducer(state = initialState, action: any) {
  console.log(`videoR->`);
  console.log(state);
  console.log(action);
  if (action.type == 'brightnessChange') state[action.videoId].brightness = action.brightness;
  if (action.type == 'contrastChange') state[action.videoId].contrast = action.contrast;
  console.log(state);
  return state;
}
const videos: Tile[] = [];
/*Получаем данные для видео -тайлов*/
dataVideos.forEach((dataVideo: VideoDataElement) => {
  /*Получаем результат шаблонизатора и вставлем в html*/
  const videosContainer: HTMLDivElement = <HTMLDivElement>document.querySelector('.content-device');
  if (videosContainer) {
    const tile = new Tile(dataVideo, videosContainer, dataVideo.url, onChange);
    initialState[dataVideo.class] = {
      brightness: '1',
      contrast: '1'
    };
    videos.push(tile);
  }
});

const dataFoo = foo(footerData);
/*Получаем результат шаблонизатора и вставлем в html*/
const fooHtml = document.querySelector('.foo-menu');
if (fooHtml) {
  fooHtml.innerHTML = dataFoo;
}

let store = new Store(videoReducer);
store.subscribe(() => {
  console.log(videos);
  videos.forEach(video => {
    const currentStore: iVideos = store.getState();
    console.log(currentStore);
    video.setContrast(currentStore[video.video.classList[0]].contrast);
    video.setBrightness(currentStore[video.video.classList[0]].brightness);
  });
});
