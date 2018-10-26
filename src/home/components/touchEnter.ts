/*Сенсорный ввод */
const evCache: PointerEvent[] = [];
let prevDiff = -1;
//массив предыдущих координат
const prevCoord: PointerEvent[] = [];
const startCoord: PointerEvent[] = [];
let currentScale = 100,
  currentPos = 100;

export function touchEvent() {
  //Получаем элемент - камеры - картинки, чтобы вращать
  const cam = <HTMLDivElement>document.querySelector('.camera');
  cam.setAttribute('touch-action', 'none');
  const element = getCamElem();
  element.setAttribute('touch-action', 'none');
  const camSlider = getCamSlider();
  camSlider.style.opacity = '1';
  init(element);
  camSlider.style.left = `${currentPos * 0.75 + 15}px`;
}

function init(el: HTMLDivElement) {
  //навешиваем слушателей на события

  el.addEventListener('pointerdown', pointerdown_handler);
  el.addEventListener('pointermove', pointermove_handler);
  el.addEventListener('pointerup', pointerup_handler);

  el.addEventListener('pointercancel', pointerup_handler);
  el.addEventListener('pointerout', pointerup_handler);
  el.addEventListener('pointerleave', pointerup_handler);
}

function pointerdown_handler(ev: PointerEvent) {
  evCache.push(ev);
  startCoord.push(ev);
}

function pointermove_handler(ev: PointerEvent) {
  const camElement = getCamElem();
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

    let a,
      gradA = 0;
    if (startCoord.length > 0) {
      distXstart = startCoord[0].x - startCoord[1].x;
      distYstart = startCoord[0].y - startCoord[1].y;

      a = Math.atan((distXstart * distY - distYstart * distX) / (distXstart * distX + distYstart * distY));
      gradA = (a * 180) / Math.PI;
    }

    if (Math.abs(gradA) > 5) {
      //значит поворот
      camElement.style.webkitFilter = `brightness(${100 + gradA}%)`;
      //el.style.filter = `brightness(${100 + gradA}%)`;
      getBrightElem().innerText = `Яркость ${Math.round(100 + gradA)}%`;
    }
    {
      console.log(`currentScale: ${currentScale}, curDiff: ${curDiff}, prevDiff: ${prevDiff} `);

      if (prevDiff > 0) currentScale += curDiff - prevDiff;
      if (currentScale > 200) currentScale = 200;
      if (currentScale < 50) currentScale = 50;
      camElement.style.backgroundSize = `${currentScale}% ${currentScale}% `;
      camElement.style.webkitBackgroundSize = `${currentScale}% ${currentScale}% `;
      getZoomElem().innerText = `Приближение ${currentScale}%`;
    }

    // сохраяняем начальные и предыдущие координаты
    prevDiff = curDiff;
    prevCoord.push(evCache[0]);
    prevCoord.push(evCache[1]);
  }

  if (evCache.length === 1) {
    // значит перемещение влево или вправо (swipe)
    camElement.style.backgroundPositionX = `${currentPos}%`;
    //camElement.style.webkitBackgroundPositionX = `${currentPos}%`;

    if (startCoord.length > 0) {
      currentPos += startCoord[0].x - ev.clientX;
    }
    if (currentPos < 0) currentPos = 0;
    if (currentPos > 200) currentPos = 200;
    getCamSlider().style.left = `${currentPos * 0.75 + 15}px`;
  }
}

function pointerup_handler(ev: PointerEvent) {
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

function remove_event(ev: PointerEvent, arr: PointerEvent[]) {
  // Remove this event from the target's cache
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].pointerId == ev.pointerId) {
      arr.splice(i, 1);
      break;
    }
  }
}

function getCamElem(): HTMLDivElement {
  const element = <HTMLDivElement>document.querySelector('.cam');
  return element;
}

function getBrightElem(): HTMLDivElement {
  const element = <HTMLDivElement>document.querySelector('.control-bright');
  return element;
}

function getZoomElem(): HTMLDivElement {
  const element = <HTMLDivElement>document.querySelector('.control-zoom');
  return element;
}

function getCamSlider(): HTMLDivElement {
  const camSlider = <HTMLDivElement>document.querySelector('.cam-slider');
  return camSlider;
}
