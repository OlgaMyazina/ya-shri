'use strict';

/*TODO: Наверное, timeout нужно переписать на requestAnimationFrame */

const tileCanvas = document.querySelector('.tile-canvas');
let videoActive;
//глобальная переменная для остановки requestAnimationFrame
let stopId;
//запоминаем настройки (яркости, контрастности, громкости) для каждой камеры
const settings = [];

document.addEventListener('click', e => {
  const classList = e.target.classList;
  //если клик был по видео, то раскрываем его
  if (classList.contains('video')) {
    tileCanvas.style.left = e.x + 'px';
    tileCanvas.style.top = e.y + 'px';
    videoActive = e.target;

    setTimeout(() => {
      document.body.classList.add('opened');
      setTimeout(() => {
        tileCanvas.classList.add('opened');
      }, 10);
    }, 10);
    setTimeout(() => {
      init();
      animate();
    }, 20);
  }
  //Если нажата кнопка "закрыть
  if (classList.contains('close')) {
    videoActive.width = `100%`;
    videoActive.height = `70%`;
    tileCanvas.classList.remove('opened');
    setTimeout(() => {
      document.body.classList.remove('opened');
    }, 1000);
  }
  stopId = '';
});

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
