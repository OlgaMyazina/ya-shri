'use strict';

const urlJSON = 'files/events.json';

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
  pageLoad();
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
      graph.querySelector('.graph').style.background = ` url('../img/Richdata.png') no-repeat`;
      graph.querySelector(
        '.graph'
      ).style.backgroundImage = `-webkit-image-set( url('../img/Richdata.png') 1x, url('img/Richdata@2x.png') 2x, url('img/Richdata@3x.png') 3x )`;
      graph.querySelector('.graph').style.backgroundPosition = `center bottom`;
      tile.querySelector('.data-tile').appendChild(graph);
    }
    //Нашли изображение
    if (data.image) {
      //вставляем заглушку вместо "get_it_from_mocks_:3.jpg"
      const imgDiv = document.createElement('div');
      imgDiv.style.background = `url('img/Bitmap.png')`;
      imgDiv.style.background = `-webkit-image-set( url('img/Bitmap.png') 1x, url('img/Bitmap2x.png') 2x , url('img/Bitmap3x.png') 3x`;
      imgDiv.style.backgroundPosition = `50% 50%`;
      imgDiv.classList.add('cam');
      const image = document.querySelector('.template-image').content.cloneNode(true);
      image.appendChild(imgDiv);
      const labels = document.createElement('div');
      labels.classList.add('control-labels');
      const controlZoom = document.createElement('div');
      controlZoom.classList.add('control-zoom');
      const controlBright = document.createElement('div');
      controlBright.classList.add('control-bright');
      controlZoom.innerText = `Приближение: 78%`;
      controlBright.innerText = `Яркость: 50%`;
      const camSlider = document.createElement('div');
      camSlider.classList.add(`cam-slider`);
      imgDiv.appendChild(camSlider);
      labels.appendChild(controlZoom);
      labels.appendChild(controlBright);
      tile.querySelector('.data-tile').classList.add('camera');
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

function pageLoad() {
  //Получаем элемент - камеры - картинки, чтобы вращать
  const cam = document.querySelector('.camera');
  cam.setAttribute('touch-action', 'none');
  const el = document.querySelector('.cam');
  el.setAttribute('touch-action', 'none');
  const zoom = document.querySelector('.control-zoom');
  const bright = document.querySelector('.control-bright');
  const camSlider = document.querySelector('.cam-slider');
  camSlider.style.opacity = '1';

  /* */
  const evCache = [];
  let prevDiff = -1;
  //массив предыдущих координат
  const prevCoord = [];
  const startCoord = [];
  let currentScale = 100,
    currentPos = 100;
  init();

  function init() {
    //навешиваем слушателей на события

    el.addEventListener('pointerdown', pointerdown_handler);
    el.addEventListener('pointermove', pointermove_handler);
    el.addEventListener('pointerup', pointerup_handler);

    el.addEventListener('pointercancel', pointerup_handler);
    el.addEventListener('pointerout', pointerup_handler);
    el.addEventListener('pointerleave', pointerup_handler);
    camSlider.style.left = `${currentPos * 0.75 + 15}px`;
  }

  function pointerdown_handler(ev) {
    evCache.push(ev);
    startCoord.push({
      x: ev.clientX,
      y: ev.clientY
    });
  }

  function pointermove_handler(ev) {
    // Find this event in the cache and update its record with this event
    for (let i = 0; i < evCache.length; i++) {
      if (ev.pointerId == evCache[i].pointerId) {
        evCache[i] = ev;
        break;
      }
    }

    // If two pointers are down, check for pinch gestures
    if (evCache.length === 2) {
      // Расстояние между пальцами по х
      let curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
      let distX = evCache[0].clientX - evCache[1].clientX;
      let distY = evCache[0].clientY - evCache[1].clientY;
      let distXstart, distYstart;

      let a, gradA;
      if (startCoord.length > 0) {
        distXstart = startCoord[0].x - startCoord[1].x;
        distYstart = startCoord[0].y - startCoord[1].y;

        a = Math.atan((distXstart * distY - distYstart * distX) / (distXstart * distX + distYstart * distY));
        gradA = (a * 180) / Math.PI;
      }

      if (Math.abs(gradA) > 5) {
        //значит поворот
        el.style.webkitFilter = `brightness(${100 + gradA}%)`;
        el.style.filter = `brightness(${100 + gradA}%)`;
        bright.innerText = `Яркость ${Math.round(100 + gradA)}%`;
      }
      {
        console.log(`currentScale: ${currentScale}, curDiff: ${curDiff}, prevDiff: ${prevDiff} `);
        //пробовала через scale
        /*
        currentScale += (curDiff - prevDiff) / 100;
        if (currentScale > 2) currentScale = 2;
        if (currentScale < 0.5) currentScale = 0.5;
        cam.style.transform = `scale(${currentScale})`;
        cam.style.webkitTransform = `scale(${currentScale})`;
        */
        if (prevDiff > 0) currentScale += curDiff - prevDiff;
        if (currentScale > 200) currentScale = 200;
        if (currentScale < 50) currentScale = 50;
        el.style.backgroundSize = `${currentScale}% ${currentScale}% `;
        el.style.webkitBackgroundSize = `${currentScale}% ${currentScale}% `;
        zoom.innerText = `Приближение ${currentScale}%`;
      }

      // сохраяняем начальные и предыдущие координаты
      prevDiff = curDiff;
      prevCoord.push({
        x: evCache[0].clientX,
        y: evCache[0].clientY
      });
      prevCoord.push({
        x: evCache[1].clientX,
        y: evCache[1].clientY
      });
    }

    if (evCache.length === 1) {
      // значит перемещение влево или вправо (swipe)
      el.style.backgroundPositionX = `${currentPos}%`;
      el.style.webkitBackgroudPositionSize = `${currentPos}%`;

      if (startCoord.length > 0) {
        currentPos += startCoord[0].x - ev.clientX;
      }
      if (currentPos < 0) currentPos = 0;
      if (currentPos > 200) currentPos = 200;
      camSlider.style.left = `${currentPos * 0.75 + 15}px`;
    }
  }

  function pointerup_handler(ev) {
    console.log(ev.type, ev);
    // Удаление предыдущих и начальных координат
    remove_event(ev, evCache);

    if (evCache.length < 2) {
      prevDiff = -1;
      //Удаляем стартовые координаты
      remove_event(ev, prevCoord);
      remove_event(ev, startCoord);
    }
  }

  function remove_event(ev, arr) {
    // Remove this event from the target's cache
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].pointerId == ev.pointerId) {
        arr.splice(i, 1);
        break;
      }
    }
  }
}
