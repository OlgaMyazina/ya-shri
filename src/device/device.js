'use strict';

import headerData from '../data/header.json';
import nav from '../components/nav';
import dataVideos from '../data/video';
import Tile from './components/videoTile';
import foo from '../components/footer';

/*Загружаем данные для меню */
const htmlNav = nav(headerData);

/*Получаем данные для видео -тайлов*/
dataVideos.forEach(dataVideo => {
  /*Получаем результат шаблонизатора и вставлем в html*/
  const videosContainer = document.querySelector('.content-device');
  /*videosContainer.innerHTML += htmlTile;*/
  new Tile(dataVideo, videosContainer);
});
