/*Сенсорный ввод */

// Сюда будем записывать события
let currentPointerEvents: PointerEventShare = {};
// Состояние нашей картинки
interface imageStateInterface {
  leftMin: number;
  left: number;
  leftMax: number;
  zoomMin: number;
  zoom: number;
  zoomMax: number;
  brightnessMin: number;
  brightness: number;
  brightnessMax: number;
}
interface PointerEventShare {
  [key: string]: PointerEvent | MouseEvent | undefined;
}

const imageState: imageStateInterface = {
  leftMin: -1000,
  left: 0,
  leftMax: 820,
  zoomMin: 100,
  zoom: 100,
  zoomMax: 300,
  brightnessMin: 0.2,
  brightness: 1,
  brightnessMax: 4
};
interface gestureStateInterface {
  startZoom: number | null;
  startDistance: number | null;
  startBrightness: number | null;
  startAngle: number | null;
  angleDiff: number | null;
  type: string | null;
}
interface gestureInterface {
  type: string | null;
}

// Описание текущего жеста
let gesture: gestureStateInterface | null = null;

export function touchEvent() {
  //Получаем элемент - камеры - картинки, чтобы вращать
  const camera = <HTMLDivElement>document.querySelector('.camera');
  camera.setAttribute('touch-action', 'none');
  const element = getCamElem();
  element.setAttribute('touch-action', 'none');
  const camSlider = getCamSlider();
  camSlider.style.opacity = '1';
  const padding = 20;
  const startSliderPosition = (element.offsetWidth - camSlider.offsetWidth) / 2 - padding;
  camSlider.style.left = `${startSliderPosition}px`;
  if (element) init(element);
}

function init(el: HTMLDivElement) {
  //навешиваем слушателей на события

  el.addEventListener('pointerdown', pointerDownHandler);
  el.addEventListener('pointermove', pointerMoveHandler);
  el.addEventListener('pointerup', pointerUpHandler);
  el.addEventListener('pointercancel', pointerUpHandler);
  el.addEventListener('pointerout', pointerUpHandler);
  el.addEventListener('pointerleave', pointerUpHandler);
  el.addEventListener('dblclick', fakePointerHandler);
  // Запрещает таскать картинку мышкой
  el.addEventListener('dragstart', event => {
    event.preventDefault();
  });
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

function pointerDownHandler(event: PointerEvent) {
  currentPointerEvents[event.pointerId] = event;
  if (!gesture) {
    gesture = {
      startZoom: null,
      startDistance: null,
      startBrightness: null,
      startAngle: null,
      angleDiff: null,
      type: 'move'
    };
  }
}
const getDistance = (e1: PointerEvent, e2: PointerEvent): number => {
  const { clientX: x1, clientY: y1 } = e1;
  const { clientX: x2, clientY: y2 } = e2;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};
const getAngle = (e1: PointerEvent, e2: PointerEvent): number => {
  const { clientX: x1, clientY: y1 } = e1;
  const { clientX: x2, clientY: y2 } = e2;
  const r = Math.atan2(x2 - x1, y2 - y1);
  return 360 - (180 + Math.round((r * 180) / Math.PI));
};
const feedbackNodes = {
  left: document.querySelector('.feedback__unit_left'),
  zoom: document.querySelector('.feedback__unit_zoom'),
  brightness: document.querySelector('.feedback__unit_brightness')
};

function setLeft(dx: number, element: HTMLDivElement) {
  const { leftMin, leftMax } = imageState;
  const camSlider: HTMLDivElement = getCamSlider();
  const padding = 20;
  //коэффициент
  const koef: number = ((element.offsetWidth - camSlider.offsetWidth) / 2 - padding) / 1000;

  imageState.left += dx;

  if (imageState.left < leftMin) {
    imageState.left = leftMin;
  } else if (imageState.left > leftMax) {
    imageState.left = leftMax;
  } else {
    if (camSlider.style.left) {
      const test = +camSlider.style.left.slice(0, -2) - dx * koef;
      camSlider.style.left = `${test}px`;
    }
  }
  element.style.backgroundPositionX = `${imageState.left}px`;
}

function pointerMoveHandler(event: PointerEvent) {
  const element = getCamElem();
  const pointersCount = Object.keys(currentPointerEvents).length;
  if (pointersCount === 0 || !gesture) {
    return;
  }
  let dx: number = 0,
    distance: number = 0,
    angle: number = 0;

  if (pointersCount === 1 && gesture.type === 'move' && !currentPointerEvents.fake) {
    const previousEvent = currentPointerEvents[event.pointerId];
    previousEvent ? (dx = event.clientX - previousEvent.clientX) : (dx = event.clientX);
    setLeft(dx, element);
    currentPointerEvents[event.pointerId] = event;
  } else if (pointersCount === 2) {
    currentPointerEvents[event.pointerId] = event;
    const events = Object.keys(currentPointerEvents).map(key => currentPointerEvents[key]);
    if (events[0] && events[1]) {
      distance = getDistance(<PointerEvent>events[0], <PointerEvent>events[1]);
      angle = getAngle(<PointerEvent>events[0], <PointerEvent>events[1]);
    }
    if (!gesture.startDistance) {
      gesture.startZoom = imageState.zoom;
      gesture.startDistance = distance;
      gesture.startBrightness = imageState.brightness;
      gesture.startAngle = angle;
      gesture.angleDiff = 0;
      gesture.type = null;
    }
    const diff: number = distance - gesture.startDistance;
    let angleDiff: number = 0;
    //Если расстояние больше 10, то zoom
    const diffExample: number = 10;
    //Если угол больше 8, то поворот
    const angleDiffExample = 8;
    if (gesture.startAngle) angleDiff = angle - gesture.startAngle;
    if (!gesture.type) {
      if (Math.abs(diff) < diffExample && Math.abs(angleDiff) < angleDiffExample) {
        return;
      } else if (Math.abs(diff) > diffExample) {
        gesture.type = 'zoom';
      } else {
        gesture.type = 'rotate';
      }
    }
    if (gesture.type === 'zoom') {
      const { zoomMin, zoomMax } = imageState;
      let zoom: number = zoomMin;
      gesture.startZoom ? (zoom = gesture.startZoom + diff) : (zoom = zoomMin + diff);
      if (diff < 0) {
        zoom = Math.max(zoom, zoomMin);
      } else {
        zoom = Math.min(zoom, zoomMax);
      }
      imageState.zoom = zoom;
      element.style.backgroundSize = `${zoom}%`;
    }
    if (gesture.type === 'rotate') {
      const { brightnessMin, brightnessMax } = imageState;
      if (Math.abs(gesture.angleDiff ? angleDiff - gesture.angleDiff : angleDiff) > brightnessMax) {
        gesture.startBrightness = imageState.brightness;
        gesture.startAngle = angle;
        gesture.angleDiff = brightnessMin;
        return;
      }
      //коэффициент
      const k: number = 50;
      gesture.angleDiff = angleDiff;
      let brightness: number = 0;
      if (gesture.startBrightness) brightness = gesture.startBrightness + angleDiff / k;
      if (angleDiff < 0) {
        brightness = Math.max(brightness, brightnessMin);
      } else {
        brightness = Math.min(brightness, brightnessMax);
      }
      imageState.brightness = brightness;
      element.style.filter = `brightness(${brightness})`;
    }
  }
}

function pointerUpHandler(event: PointerEvent) {
  gesture = null;
  delete currentPointerEvents[event.pointerId];
}

const fakePointer: HTMLDivElement = <HTMLDivElement>document.querySelector('.fake-pointer');

function fakePointerHandler(event: MouseEvent): void {
  if (currentPointerEvents['fake']) {
    delete currentPointerEvents.fake;
    fakePointer.style.left = '0';
    fakePointer.style.top = '0';
    fakePointer.classList.remove('active');
  } else {
    currentPointerEvents['fake'] = event;
    const width: number = fakePointer.offsetWidth;
    fakePointer.classList.add('active');
    fakePointer.setAttribute(
      'style',
      `left:${imageState.left + event.pageX - width / 2}px; top: ${event.pageY - width / 2}px`
    );
  }
}
