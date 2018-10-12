'use strict';

import nav from './components/nav';
import video from './components/video';
import initVideo from './initVideo';

/*Загружаем данные для меню */
const dataNav = nav({
  items: [
    {
      url: 'index.html',
      title: 'События'
    },
    {
      url: '#',
      title: 'Сводка'
    },
    {
      url: '#',
      title: 'Устройства'
    },
    {
      url: '#',
      title: 'Сценарии'
    }
  ]
});
/*Получаем результат шаблонизатора и вставлем в html*/
const navDiv = document.querySelector('.nav-list');
navDiv.innerHTML = dataNav;

/*Загружаем данные для видео */
const dataForVideo = [
  {
    title: 'Камера 1',
    class: 'video-1',
    url: 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
  },
  {
    title: 'Камера 2',
    class: 'video-2',
    url: 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
  },
  {
    title: 'Камера 3',
    class: 'video-3',
    url: 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
  },
  {
    title: 'Камера 4',
    class: 'video-4',
    url: 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
  }
];
const dataVideo = video({
  videos: dataForVideo
});
/*Получаем результат шаблонизатора и вставлем в html*/
const videoDiv = document.querySelector('.content-device');
videoDiv.innerHTML = dataVideo;
/*Инициализируем видео */
dataForVideo.forEach(video => {
  initVideo(document.querySelector(`.${video.class}`), video.url);
});

/*TODO: Наверное, timeout нужно переписать на requestAnimationFrame */

const tileCanvas = document.querySelector('.tile-canvas');
//const tile = document.querySelector('.title-tile-v');
let videoActive;

//запоминаем настройки (яркости, контрастности, громкости) для каждой камеры
const settings = [];
//от какого эл-та было видео
let elemVideo;

document.addEventListener('click', e => {
  const classList = e.target.classList;

  //если клик был по видео, то раскрываем его
  if (classList.contains('video')) {
    const tile = e.path[1];
    if (!tile.classList.contains('opened')) {
      //document.body.classList.add('opened');

      tile.classList.add('opened');
      document.body.classList.remove('opened');
      /*
      const { top, left } = tile.getBoundingClientRect();
      tile.style.display = 'block';
      tile.style.top = top + 'px';
      tile.style.left = left + 'px';
      tile.style.height = tile.height + 100 + 'px';
      tile.style.width = tile.width + 100 + 'px';
      console.log(e.path[1]);*/
    }
    //tileCanvas.style.left = e.x + 'px';
    //tileCanvas.style.top = e.y + 'px';
    //videoActive = e.target;
    //elemVideo = e.path[1];
    //e.path[1].classList.add('opened');
    //console.log(e.path[1]);
    //tileCanvas.appendChild(videoActive);
    //console.log(e);
    // tileCanvas.style.transition = 'transform 2s ease-in 1s';
    /*if (!tileCanvas.classList.contains('opened')) {
      document.body.classList.add('opened');
      /*const newVideo = videoActive.cloneNode();
      initVideo(
        newVideo,
        'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
      );*/
    // elemVideo = videoActive.classList;
    // tileCanvas.append(videoActive);
    // tileCanvas.classList.add('opened');
    //}
    /*setTimeout(() => {
      
    });*/
  }
  //Если нажата кнопка "закрыть
  if (classList.contains('close') || classList.contains('close-title')) {
    const tile = e.path[2].classList.contains('close') ? e.path[2] : e.path[3];

    //videoActive.width = `100%`;
    //videoActive.height = `70%`;
    tile.classList.remove('opened');
    document.body.classList.remove('opened');
    //const videoOpen = tileCanvas.querySelector('.video');
    //elemVideo.append(videoOpen);
    //tileCanvas.removeChild(videoOpen);
  }
});

/*Функция для работы с фильтром из input type range. Принимает первым аргументом все дом-элементы с заданным инпутом, создаёт слушателя на изменение, 
вторым аргументом - меняет заданное свойство фильтра у открытого видео  */
function filter(elem, nameFilter) {
  elem.forEach(elem => {
    elem.addEventListener('input', e => {
      const video = document.querySelector('.tile.opened video');
      video.style.filter = `${nameFilter}(${e.target.value})`;
    });
  });
}

filter(document.querySelectorAll('.brightness'), 'brightness');
filter(document.querySelectorAll('.contrast'), 'contrast');
/*
const brightness = document.querySelectorAll('.brightness');
brightness.forEach(elem => {
  elem.addEventListener('input', e => {
    const video = document.querySelector('.tile.opened video');
    //Изменение фильтра яркости от 0 до 2, введём коэффициент для шкалы 0-100 input range :
    //const kBrightness = 0.02;
    //const value = e.target.value * kBrightness;
    video.style.filter = `brightness(${e.target.value})`;
  });
});
const contrast = document.querySelectorAll('.contrast');
contrast.forEach(elem => {
  elem.addEventListener('input', e => {
    const video = document.querySelector('.tile.opened video');
    //Изменение фильтра контрасности от 0 до 3, введём коэффициент для шкалы 0-100 input range :
    //const kContrast = 0.03;
    //const value = e.target.value * kContrast;
    video.style.filter = `contrast(${e.target.value})`;
  });
});
*/
/*
brightness.addEventListener('change', e => {
  console.log(`change`);
  console.log(e.target.value);
});*/

/*
const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');
const back = document.createElement('canvas');
const backcontext = back.getContext('2d');

function init() {
  //задаём отступы
  const paddingConst = 40;

  back.width = canvas.width = videoActive.width = tileCanvas.offsetWidth - paddingConst;
  back.height = canvas.height = videoActive.height = tileCanvas.offsetHeight - paddingConst;
}

function animate() {
  draw(videoActive, context, backcontext, canvas.width, canvas.height);
  stopId = requestAnimationFrame(animate);
}

function draw(v, c, bc, w, h) {
  // First, draw it into the backing canvas
  bc.drawImage(v, 0, 0, w, h);
  // Grab the pixel data from the backing canvas
  var idata = bc.getImageData(0, 0, w, h);
  var data = idata.data;
  // Loop through the pixels, turning them grayscale
  for (let i = 0; i < idata.data.length; i += 4) {
    var r = idata.data[i];
    var g = idata.data[i + 1];
    var b = idata.data[i + 2];
    var brightness = (3 * r + 4 * g + b) >>> 3;
    idata.data[i] = brightness;
    idata.data[i + 1] = brightness;
    idata.data[i + 2] = brightness;
  }
  // Draw the pixels onto the visible canvas
  c.putImageData(idata, 0, 0);
}
*/
