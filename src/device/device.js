'use strict';

import headerData from '../data/header';
import nav from '../components/nav';
import dataVideos from '../data/video';
import Tile from './components/videoTile';
import footerData from '../data/footer';
import foo from '../components/footer';

/*Загружаем данные для меню */
const dataNav = nav(headerData);
/*Получаем результат шаблонизатора и вставлем в html*/
const navHtml = document.querySelector('.nav-list');
navHtml.innerHTML = dataNav;

/*Получаем данные для видео -тайлов*/
dataVideos.forEach(dataVideo => {
  /*Получаем результат шаблонизатора и вставлем в html*/
  const videosContainer = document.querySelector('.content-device');
  /*videosContainer.innerHTML += htmlTile;*/
  new Tile(dataVideo, videosContainer);
});

const dataFoo = foo(footerData);
/*Получаем результат шаблонизатора и вставлем в html*/
const fooHtml = document.querySelector('.foo-menu');
fooHtml.innerHTML = dataFoo;
