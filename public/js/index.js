'use strict';

const urlJSON = '../files/events.json';

fetch(urlJSON)
  .then(res => res.json())
  .then(data => render(data.events));

function render(events) {
  const content = document.querySelector('.content');
  console.log(content);
  events.forEach(event => {
    const eventElement = createEventElement(event);
    content.appendChild(eventElement);
  });
}
function createEventElement(event) {
  const tile = document.querySelector('.template').content.cloneNode(true);
  tile.querySelector('.tile').classList.add(`${event.size}`);
  tile.querySelector('.type-tile').setAttribute('type', event.type);
  tile.querySelector('.title-tile').innerText = event.title;
  tile.querySelector('.source-tile').innerText = event.source;
  tile.querySelector('.description-tile').innerText = event.description;
  event.type === 'critical'
    ? (tile.querySelector('.icon-tile').style.backgroundImage = `url(img/${event.icon}-white.svg)`)
    : (tile.querySelector('.icon-tile').style.backgroundImage = `url(img/${event.icon}.svg)`);
  tile.querySelector('.time-tile').innerText = event.time;
  const data = event.data;
  if (event.description) tile.querySelector('.info-tile').classList.add('visable');
  if (data) {
    //Если есть data, добавляем класс visable элементу info-tile
    tile.querySelector('.info-tile').classList.add('visable');
    //Если нашли трек, то используем шаблон аудио
    if (data.track) {
      const audio = document.querySelector('.template-audio').content.cloneNode(true);
      audio.querySelector('.cover').style.backgroundImage = `url("${data.albumcover}")`;
      audio.querySelector('.artist').innerText = `${data.artist}-${data.track.name}`;
      audio.querySelector('.length').innerText = data.track.length;
      audio.querySelector('.track').setAttribute('max', data.track.lenght);
      audio.querySelector('.track').setAttribute('value', `${data.track.lenght}/2`);
      audio.querySelector('.volume-range').setAttribute('value', data.volume);
      audio.querySelector('.volume').innerText = `${data.volume}%`;
      tile.querySelector('.data-tile').classList.add('data-audio');
      tile.querySelector('.data-tile').appendChild(audio);
    }
    //Нашли тип граф
    if (data.type === 'graph') {
      //вставляем картинку-заглушку
      const graph = document.querySelector('.template-graph').content.cloneNode(true);
      graph.querySelector(
        '.graph'
      ).style.backgroundImage = `-webkit-image-set( url('../img/Richdata.png') 1x, url('img/Richdata@2x.png') 2x, url('img/Richdata@3x.png') 3x )`;
      tile.querySelector('.data-tile').appendChild(graph);
    }
    //Нашли изображение
    if (data.image) {
      //вставляем заглушку вместо "get_it_from_mocks_:3.jpg"
      const image = document.querySelector('.template-image').content.cloneNode(true);
      image.querySelector(
        '.image'
      ).style.backgroundImage = `-webkit-image-set( url('../img/Bitmap.png') 1x, url('img/Bitmap2x.png') 2x, url('img/Bitmap3x.png') 3x )`;
      const labels = document.createElement('div');
      labels.classList.add('control-labels');
      const controlZoom = document.createElement('div');
      controlZoom.classList.add('control-zoom');
      const controlBright = document.createElement('div');
      controlBright.classList.add('control-bright');
      controlZoom.innerText = `Приближение: 78%`;
      controlBright.innerText = `Яркость: 50%`;
      labels.appendChild(controlZoom);
      labels.appendChild(controlBright);
      tile.querySelector('.data-tile').appendChild(image);
      tile.querySelector('.data-tile').appendChild(labels);
    }
    //Нашли копки
    if (data.buttons) {
      const btns = document.querySelector('.template-buttons').content.cloneNode(true);
      data.buttons.forEach(btn => {
        const button = document.createElement('div');
        button.classList.add('data-button');
        button.innerText = btn;
        btns.querySelector('.buttons').appendChild(button);
      });
      tile.querySelector('.data-tile').appendChild(btns);
    }
  }
  return tile;
}

/*Сенсорный ввод */
//Получаем элемент - камеры - картинки, чтобы вращать
const cam = document.querySelector('.image');

/*Зум: получаем первый pointer.id и ждём второй. Когда есть два - считаем между ними расстояние -> увеличение - прилижение, уменьшение- отдаление */

/*Использование pointer lock */

//запрашиваем pointer lock для элемента
cam.requestPointerLock = cam.requestPointerLock || cam.webkitRequestPointerLock || cam.mozRequestPointerLock;

//выводим из режима захвата курсора
document.exitPointerLock();

//для какого элемента включен pointer lock
cam = document.pointerLockElement;

//событие для включения/выключения режима pointer lock
document.addEventListener('pointerlockchange', e => {
  //обрабатываем
});
//обработка ошибок
document.addEventListener('pointerlockerror', e => {
  console.error(`Случилась ошибка при работе pointer lock: ${e}`);
});
