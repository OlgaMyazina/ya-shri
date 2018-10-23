'use strict';

import nav from './components/nav';
import video from './components/video';
import initVideo from './initVideo';
import foo from './components/footer';

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
/*Инициализируем видео и добавляем на него обработчик*/
dataForVideo.forEach(video => {
  initVideo(document.querySelector(`.${video.class}`), video.url);
  video.addEventListener(e => {
    const tile = e.path[1];
    if (!tile.classList.contains('opened')) {
      tile.classList.add('opened');
    }
  });
});

/*Для футера */
const dataFoo = foo({
  items: [
    {
      url: '#',
      title: 'Помощь'
    },
    {
      url: '#',
      title: 'Обратная связь'
    },
    {
      url: '#',
      title: 'Разработчикам'
    },
    {
      url: 'files/license.pdf',
      title: 'Условия использования'
    }
  ]
});
/*Получаем результат шаблонизатора и вставлем в html*/
const fooDiv = document.querySelector('.foo-menu');
fooDiv.innerHTML = dataFoo;

/************************* */
/*Обработка видео - тайлов */

/*
document.addEventListener('click', e => {
  const classList = e.target.classList;

  //если клик был по видео, то раскрываем его
  if (classList.contains('video')) {
    const tile = e.path[1];
    if (!tile.classList.contains('opened')) {
      tile.classList.add('opened');
      //stream = e.target;
    }
  }
});
*/

//Определяем все кнопки, слушаем событие клика по кнопке
const buttons = document.querySelectorAll('.close-button');
buttons.forEach(button => {
  button.addEventListener('click', e => {
    const volume = document.querySelector('.opened .volume');
    volume.classList.remove('up');
    const video = document.querySelector('.opened video');
    console.log(video);
    video.muted = true;
    const tile = document.querySelector('.tile.opened');
    console.log(tile);
    tile.classList.remove('opened');
    analiser(null);
  });
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

const volumes = document.querySelectorAll('.volume');
volumes.forEach(volume => {
  volume.addEventListener('click', e => {
    const video = document.querySelector('.opened video');
    const volumeUp = volume.classList.contains('up');
    video.muted = volumeUp;
    volume.classList.toggle('up');

    console.log(video);
    if (volumeUp) {
      const chart = document.querySelector('.opened .chart');
      analiser(video, chart);
    }
    console.log('click');
  });
});
function analiser(stream, chart) {
  if (stream) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var ctx = new AudioContext();
    var source = ctx.createMediaElementSource(stream);
    var analyser = ctx.createAnalyser();
    var processor = ctx.createScriptProcessor(2048, 1, 1);
    source.connect(analyser);
    source.connect(processor);
    analyser.connect(ctx.destination);
    processor.connect(ctx.destination);
    analyser.fftSize = 32;
    var data = new Uint8Array(analyser.frequencyBinCount);
    processor.onaudioprocess = function() {
      analyser.getByteFrequencyData(data);
      console.log(data);
      /*Для отображения графика */

      //коэффициент
      const kData = 20;
      //Стобцы графика
      const bar4 = chart.querySelector('.bar-4');
      const bar3 = chart.querySelector('.bar-2');
      const bar2 = chart.querySelector('.bar-3');
      const bar1 = chart.querySelector('.bar-1');
      //объявление и инициализация значений для столбцов графика
      let bar4Volume = 0,
        bar3Volume = 0,
        bar2Volume = 0,
        bar1Volume = 0;
      //считаем значение
      for (let i = 0; i < 4; i++) {
        bar4Volume += data[i] / kData;
      }
      for (let i = 4; i < 8; i++) {
        bar3Volume += data[i] / kData;
      }
      for (let i = 8; i < 12; i++) {
        bar2Volume += data[i] / kData;
      }
      for (let i = 12; i < 16; i++) {
        bar1Volume += data[i] / kData;
      }
      //отображаем значения на графике
      bar4.setAttribute('width', bar4Volume);
      bar3.setAttribute('width', bar3Volume);
      bar2.setAttribute('width', bar2Volume);
      bar1.setAttribute('width', bar1Volume);
    };
  }
}

/*

var videoEl = document.getElementsByTagName('video')[0],
            playBtn = document.getElementById('playBtn'),
            vidControls = document.getElementById('controls'),
            volumeControl = document.getElementById('volume'),
            timePicker = document.getElementById('timer');
         

volumeControl.addEventListener('input', function () {
         
  videoEl.volume = volumeControl.value;
}, false);
/*Вначале в коде JavaScript мы получаем все элементы. 
Затем, если браузер поддерживает видео и может его воспроизвести, 
то обрабатываем событие canplaythrough, устанавливая уровень звука и удаляя класс hidden: */
/*videoEl.addEventListener('canplaythrough', function () {
  vidControls.classList.remove('hidden');
  videoEl.volume = volumeControl.value;
}, false);
/*Обрабатывая событие input, которое возникает при изменении значения ползунка,
 мы можем синхронизировать изменение ползунка и громкость видео:*/
/*volumeControl.addEventListener('input', function () {
         
  videoEl.volume = volumeControl.value;
}, false);*/
