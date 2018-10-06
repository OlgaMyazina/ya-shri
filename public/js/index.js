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
      graph.querySelector(
        '.graph'
      ).style.backgroundImage = `-webkit-image-set( url('../img/Richdata.png') 1x, url('img/Richdata@2x.png') 2x, url('img/Richdata@3x.png') 3x )`;
      tile.querySelector('.data-tile').appendChild(graph);
    }
    //Нашли изображение
    if (data.image) {
      //вставляем заглушку вместо "get_it_from_mocks_:3.jpg"
      const imgDiv = document.createElement('div');
      imgDiv.style.background = `-webkit-image-set( url('img/Bitmap.png') 1x, url('img/Bitmap2x.png') 2x , url('img/Bitmap3x.png') 3x`;
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

  /* */
  const evCache = [];
  let prevDiff = -1;
  let prevDist = -1;
  //массив предыдущих координат
  const prevCoord = [];
  const startCoord = [];
  let currentScale = 100,
    currentPos = 50;
  init();

  function init() {
    // Install event handlers for the pointer target
    const el = document.querySelector('.cam');
    el.addEventListener('pointerdown', pointerdown_handler);
    el.addEventListener('pointermove', pointermove_handler);

    // Use same handler for pointer{up,cancel,out,leave} events since
    // the semantics for these events - in this app - are the same.
    el.addEventListener('pointerup', pointerup_handler);
    el.addEventListener('pointercancel', pointerup_handler);
    el.addEventListener('pointerout', pointerup_handler);
    el.addEventListener('pointerleave', pointerup_handler);
  }

  function pointerdown_handler(ev) {
    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
    evCache.push(ev);
    startCoord.push({
      x: ev.clientX,
      y: ev.clientY
    });
    console.log('pointerDown', ev);
  }

  function pointermove_handler(ev) {
    // This function implements a 2-pointer horizontal pinch/zoom gesture.
    //
    // If the distance between the two pointers has increased (zoom in),
    // the taget element's background is changed to "pink" and if the
    // distance is decreasing (zoom out), the color is changed to "lightblue".
    //
    // This function sets the target element's border to "dashed" to visually
    // indicate the pointer's target received a move event.
    console.log('pointerMove', ev);

    // Find this event in the cache and update its record with this event
    for (var i = 0; i < evCache.length; i++) {
      if (ev.pointerId == evCache[i].pointerId) {
        evCache[i] = ev;
        break;
      }
    }

    // If two pointers are down, check for pinch gestures
    if (evCache.length === 2) {
      // Calculate the distance between the two pointers
      var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
      let distX = evCache[0].clientX - evCache[1].clientX;
      let distY = evCache[0].clientY - evCache[1].clientY;
      let currDist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
      let distXprev, distXstart, distYstart;
      let distYprev;
      let t;
      let prevDist;
      let a, newA, lastA;
      if (startCoord.length > 0) {
        distXstart = startCoord[0].x - startCoord[1].x;
        distYstart = startCoord[0].y - startCoord[1].y;
        /*
        t = distXstart * distX + distYstart * distY;
        prevDist = Math.sqrt(Math.pow(distXstart, 2) + Math.pow(distYstart, 2));
        a = Math.acos(t / (currDist * prevDist));
        newA = (a * 180) / Math.PI;
      */

        a = Math.atan((distXstart * distY - distYstart * distX) / (distXstart * distX + distYstart * distY));
        newA = (a * 180) / Math.PI;
      }

      if (Math.abs(newA) > 5) {
        console.log(`100+угол: ${100 + newA}`);
        //значит поворот
        cam.style.webkitFilter = `brightness(${100 + newA}%)`;
        cam.style.filter = `brightness(${100 + newA}%)`;
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
        cam.style.backgroundSize = `${currentScale}% ${currentScale}%`;
      }

      // Cache the distance for the next move event
      prevDiff = curDiff;
      prevCoord.push({
        x: evCache[0].clientX,
        y: evCache[0].clientY
      });
      prevCoord.push({
        x: evCache[1].clientX,
        y: evCache[1].clientY
      });
      lastA = newA;
    }

    if (evCache.length === 1) {
      // значит перемещение влево или вправо (swipe)
      cam.style.backgroundPositionX = `${currentPos + startCoord[0].x - ev.clientX}%`;
      console.log(`свайп от ${currentPos + startCoord[0].x} to ${currentPos + startCoord[0].x - ev.clientX}`);
    }
  }

  function pointerup_handler(ev) {
    console.log(ev.type, ev);
    // Remove this pointer from the cache and reset the target's
    // background and border
    remove_event(ev);

    // If the number of pointers down is less than two then reset diff tracker
    if (evCache.length < 2) {
      prevDiff = -1;
      //Удаляем стартовые координаты
      for (var i = 0; i < prevCoord.length; i++) {
        prevCoord.splice(i, 1);
        break;
      }
      for (var i = 0; i < startCoord.length; i++) {
        startCoord.splice(i, 1);
        break;
      }
    }
  }

  function remove_event(ev) {
    // Remove this event from the target's cache
    for (var i = 0; i < evCache.length; i++) {
      if (evCache[i].pointerId == ev.pointerId) {
        evCache.splice(i, 1);
        break;
      }
    }
  }

  // Log events flag
  var logEvents = false;

  // Logging/debugging functions
  function enableLog(ev) {
    logEvents = logEvents ? false : true;
  }

  /*Зум: получаем первый pointer.id и ждём второй. 
Когда есть два - считаем между ними расстояние => 
увеличение - прилижение, уменьшение- отдаление */

  /*Использование pointer lock */

  //запрашиваем pointer lock для элемента
  //cam.requestPointerLock = cam.requestPointerLock || cam.webkitRequestPointerLock || cam.mozRequestPointerLock;

  //выводим из режима захвата курсора
  //document.exitPointerLock();

  //для какого элемента включен pointer lock
  //cam = document.pointerLockElement;

  //событие для включения/выключения режима pointer lock
  /*
  document.addEventListener('pointerlockchange', e => {
    //обрабатываем
    console.log(`pointerlockchange: ${e}`);
  });
  //обработка ошибок
  document.addEventListener('pointerlockerror', e => {
    console.error(`Случилась ошибка при работе pointer lock: ${e}`);
  });
  */
}
