'use strict';
import videoTemplate from './videoTile.handlebars';
import './videoTile.css';
/*export default video;*/

export default class Tile {
  constructor(videoData, videosContainer) {
    const html = videoTemplate(videoData);
    this.appendToContainer(html, videosContainer);
    this.tile = videosContainer.querySelector('.device-wrap:last-child  .tile');
    /*Инициализируем видео*/
    this.videoEl = this.tile.querySelector('video');
    this.initVideoStream(videoData.url);

    /*Обработчики */
    this.addEventToVideo();
    this.addEventToBtns();
    this.addEventToBrightness();
    this.addEventToContrast();
    this.addEventToVolume();
  }

  initVideoStream(url) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(this.videoEl);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        this.videoEL.play();
      });
    } else if (this.videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoEl.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
      this.videoEl.addEventListener('loadedmetadata', function() {
        this.videoEl.play();
      });
    }
  }

  appendToContainer(html, videosContainer) {
    const newHtmlElem = document.createElement('template');
    newHtmlElem.innerHTML = html;
    videosContainer.appendChild(newHtmlElem.content);
  }

  addEventToVideo() {
    this.videoEl.addEventListener('click', () => {
      if (!this.tile.classList.contains('opened')) {
        this.tile.classList.add('opened');
        this.initAudioContext();
      }
    });
  }

  addEventToBrightness() {
    const inputBrightness = this.tile.querySelector('.brightness');
    inputBrightness.addEventListener('input', e => {
      this.videoEl.style.filter = `brightness(${e.target.value})`;
    });
  }

  addEventToContrast() {
    const inputContrast = this.tile.querySelector('.contrast');
    inputContrast.addEventListener('input', e => {
      this.videoEl.style.filter = `contrast(${e.target.value})`;
    });
  }
  addEventToBtns() {
    const button = this.tile.querySelector('.close');
    button.addEventListener('click', () => {
      this.tile.classList.remove('opened');
      this.onVolumeMute();
    });
  }

  addEventToVolume() {
    const volume = this.tile.querySelector('.volume');
    volume.addEventListener('click', e => {
      const volumeUp = volume.classList.contains('up');
      volumeUp ? this.onVolumeMute() : this.onVolumeUnMute();
    });
  }

  onVolumeUnMute() {
    const volume = this.tile.querySelector('.volume');
    volume.classList.add('up');
    this.videoEl.muted = false;
    this.analiser(this.tile.querySelector('.chart'), 'running');
  }

  onVolumeMute() {
    const volume = this.tile.querySelector('.volume');
    volume.classList.remove('up');
    this.videoEl.muted = true;
    this.analiser(this.tile.querySelector('.chart'), 'closed');
  }

  initAudioContext() {
    if (this.ctx === undefined) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.source = this.ctx.createMediaElementSource(this.videoEl);
      this.analyser = this.ctx.createAnalyser();
      this.processor = this.ctx.createScriptProcessor(256, 1, 1);
    }
  }

  analiser(chart, newState) {
    this.source.connect(this.analyser);
    this.source.connect(this.processor);

    if (newState == 'running') {
      /*запускаем */
      this.ctx.resume();

      this.analyser.connect(this.ctx.destination);
      this.processor.connect(this.ctx.destination);
      this.analyser.fftSize = 32;
      const data = new Uint8Array(this.analyser.frequencyBinCount);
      this.processor.onaudioprocess = () => {
        this.analyser.getByteFrequencyData(data);

        /*Для отображения графика */

        //коэффициент
        const kData = 25;
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
    } else {
      /*Останавливаем */
      this.processor.onaudioprocess = null;
      this.source.disconnect(this.analyser);
      this.source.disconnect(this.processor);
      this.ctx.suspend();
    }
    //this.videoEl.play();
  }
}
