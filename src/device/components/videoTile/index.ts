import * as Hls from 'hls.js';
import * as videoTemplate from './videoTile.handlebars';
import './videoTile.css';
import * as interfaceDataElement from '../../device';

export default class Tile {
  tile: HTMLDivElement;
  video: HTMLVideoElement;
  ctx: AudioContext | undefined;
  source: MediaElementAudioSourceNode | undefined;
  analyser: AnalyserNode | undefined;
  processor: ScriptProcessorNode | undefined;
  constructor(videoData: interfaceDataElement.VideoDataElement, videosContainer: HTMLDivElement, url: string) {
    const html = videoTemplate(videoData);

    this.appendToContainer(html, videosContainer);
    this.tile = <HTMLDivElement>videosContainer.querySelector('.device-wrap:last-child  .tile');
    /*Инициализируем видео*/
    this.video = <HTMLVideoElement>this.tile.querySelector('video');
    this.initVideoStream(this.video, url);

    /*Обработчики */
    this.addEventToVideo();
    this.addEventToBtns();
    this.addEventToBrightness();
    this.addEventToContrast();
    this.addEventToVolume();
  }

  initVideoStream(video: HTMLVideoElement, url: string): void {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
      video.addEventListener('loadedmetadata', function() {
        video.play();
      });
    }
  }

  appendToContainer(html: any, videosContainer: any) {
    const newHtmlElem = document.createElement('template');
    newHtmlElem.innerHTML = html;
    videosContainer.appendChild(newHtmlElem.content);
  }

  addEventToVideo() {
    if (this.video) {
      this.video.addEventListener('click', () => {
        this.tile.classList.add('opened');
        this.initAudioContext();
        console.log(this.tile);
      });
    }
  }

  addEventToBrightness() {
    const inputBrightness: HTMLInputElement = <HTMLInputElement>this.tile.querySelector('.brightness');
    if (inputBrightness) {
      inputBrightness.addEventListener('input', e => {
        this.video.style.filter = `brightness(${(<HTMLInputElement>e.target).value})`;
      });
    }
  }

  addEventToContrast() {
    const inputContrast: HTMLInputElement = <HTMLInputElement>this.tile.querySelector('.contrast');
    if (inputContrast !== null) {
      inputContrast.addEventListener('input', e => {
        this.video.style.filter = `contrast(${(<HTMLInputElement>e.target).value})`;
      });
    }
  }
  addEventToBtns() {
    const button: HTMLDivElement = <HTMLDivElement>this.tile.querySelector('.close');
    button.addEventListener('click', () => {
      this.tile.classList.remove('opened');
      this.onVolumeMute();
    });
  }

  addEventToVolume() {
    const volume: HTMLDivElement = <HTMLDivElement>this.tile.querySelector('.volume');
    if (volume) {
      volume.addEventListener('click', e => {
        const volumeUp = volume.classList.contains('up');
        volumeUp ? this.onVolumeMute() : this.onVolumeUnMute();
      });
    }
  }

  onVolumeUnMute() {
    const volume: HTMLDivElement = <HTMLDivElement>this.tile.querySelector('.volume');
    volume.classList.add('up');
    this.video.muted = false;
    this.analiser(this.tile.querySelector('.chart'), 'running');
  }

  onVolumeMute() {
    const volume: HTMLDivElement = <HTMLDivElement>this.tile.querySelector('.volume');
    volume.classList.remove('up');
    this.video.muted = true;
    this.analiser(this.tile.querySelector('.chart'), 'closed');
  }

  initAudioContext() {
    if (this.ctx === undefined) {
      this.ctx = new AudioContext();
      this.source = this.ctx.createMediaElementSource(this.video);
      this.analyser = this.ctx.createAnalyser();
      this.processor = this.ctx.createScriptProcessor(256, 1, 1);
    }
  }

  analiser(chart: any, newState: string) {
    console.log(this.ctx);
    if (this.ctx !== undefined) {
      console.log(`ctx!==undefined`);
      if (this.source !== undefined && this.analyser !== undefined && this.processor !== undefined) {
        console.log(`this.source, this.analiser, this.processor`);
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
            if (this.analyser !== undefined) {
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
            }
          };
        } else {
          /*Останавливаем */
          this.processor.onaudioprocess = null;
          this.source.disconnect(this.analyser);
          this.source.disconnect(this.processor);
          this.ctx.suspend();
        }
      }
    }
  }
}
