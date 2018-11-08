import './tile.css';
import picture from '../../../picture';

/*Импортируем изображения для графика */
import imgGraphSrc from '../../../../images/Richdata.png';
import imgGraphSrcset2 from '../../../../images/Richdata@2x.png';
import imgGraphSrcset3 from '../../../../images/Richdata@3x.png';
import sourceGraphSrcset from '../../../../images/Richdata.svg';

const template = `<template class="template-tile">
<section class="tile tilehover">
  <article>
    <header class="type-tile">
      <div class="icon-tile"></div>
      <h1 class="title-tile"></h1>
      <div class="source-tile"></div>
      <div class="time-tile"></div>
    </header>
    <div class="info-tile">
      <div class="description-tile"></div>
      <div class="data-tile">
        <template class="template-audio">
          <audio controls>
            <source src="#">
          </audio>
          <div class="cover"></div>
          <div class="artist"></div>
          <input name="track-range" type="range" min="0" max="100" step="1" value="50" class="track">
          <label for="track-range" class="length"></label>
          <div class="prev"></div>
          <div class="next"></div>
          <input name="volume-range" type="range" min="0" max="100" step="1" value="50" class="volume-range">
          <label for="volume-range" class="volume"></label>
        </template>
        <template class="template-graph">
          <div class="graph"></div>
        </template>
        <template class="template-image">
        </template>
        <template class="template-buttons">
          <div class="buttons"></div>
        </template>
      </div>
    </div>
  </article>
</section>
</template>`;

export interface DeviceEvent {
  type: string;
  title: string;
  source: string;
  time: string;
  description: null | string;
  icon: string;
  data: EventData | undefined;
  size: EventSize;
}

export type EventData = EventDataAudio | EventDataGraph | EventDataImage | EventDataButtons;

export type EventSize = 's' | 'm' | 'l';

export interface EventDataAudio {
  albumcover: string;
  artist: string;
  track: {
    name: string;
    length: string;
  };
  volume: number;
}
export interface EventDataGraph {
  type: 'graph';
  values: object[];
}
export interface EventDataImage {
  image: string;
}
export interface EventDataButtons {
  buttons: string[];
}

export default class Tile {
  event: DeviceEvent;
  constructor(event: DeviceEvent) {
    this.event = event;
  }

  createEventElement() {
    const tileTemplate = document.querySelector<HTMLTemplateElement>('.template'); //.content.cloneNode(true);
    if (tileTemplate) tileTemplate.insertAdjacentHTML('beforeend', template);
    const tile: HTMLDivElement = <HTMLDivElement>(
      (<HTMLTemplateElement>document.querySelector('.template-tile')).content.cloneNode(true)
    );
    const tileSize = <HTMLDivElement>tile.querySelector('.tile');
    tileSize.classList.add(`${this.event.size}`);
    this.searchAndSetAttr(tile, '.type-tile', 'type', this.event.type);
    this.searchElemAndInnerText(tile, '.title-tile', this.event.title);
    this.searchElemAndInnerText(tile, '.source-tile', this.event.source);
    this.event.type === 'critical'
      ? this.searchElemAndBgImage(tile, '.icon-tile', `url(img/${this.event.icon}-white.svg)`)
      : this.searchElemAndBgImage(tile, '.icon-tile', `url(img/${this.event.icon}.svg)`);
    this.searchElemAndInnerText(tile, '.time-tile', this.event.time);

    if (this.event.description) {
      this.searchElemAndInnerText(tile, '.description-tile', this.event.description);
    }

    const data = this.event.data;
    if (data) {
      //Если есть data, добавляем класс visable элементу info-tile
      const tileInfo = <HTMLElement>tile.querySelector('.info-tile');
      tileInfo.classList.add('visable');

      //Если нашли трек, то используем шаблон аудио
      if (this.isEventDataAudio(data)) {
        const audio = <HTMLDivElement>(
          (<HTMLTemplateElement>document.querySelector('.template-audio')).content.cloneNode(true)
        );
        this.fillTemplateAudio(audio, data);
        const dataTile = <HTMLElement>tile.querySelector('.data-tile');
        dataTile.classList.add('data-audio');
        dataTile.appendChild(audio);
      }

      //Нашли тип граф
      if (this.isEventDataGraph(data)) {
        //вставляем картинку-заглушку
        const graph: HTMLDivElement = <HTMLDivElement>(
          (<HTMLTemplateElement>tile.querySelector('.template-graph')).content.cloneNode(true)
        );
        this.fillTemplateGraph(graph, data);
        const dataTile = <HTMLElement>tile.querySelector('.data-tile');
        dataTile.appendChild(graph);
      }
      //Нашли изображение
      if (this.isEventDataImage(data)) {
        const image = <HTMLDivElement>(
          (<HTMLTemplateElement>document.querySelector('.template-image')).content.cloneNode(true)
        );
        //вставляем заглушку вместо "get_it_from_mocks_:3.jpg"
        const imgDiv = this.createImageElement();
        const labels = this.createLabelControl();
        image.appendChild(imgDiv);
        const dataTile = <HTMLElement>tile.querySelector('.data-tile');
        dataTile.classList.add('camera');
        dataTile.appendChild(image);
        dataTile.appendChild(labels);
      }
      //Нашли кнопки
      if (this.isEventDataButtons(data)) {
        const btns = <HTMLDivElement>(
          (<HTMLTemplateElement>document.querySelector('.template-buttons')).content.cloneNode(true)
        );
        data.buttons.forEach(textBtn => {
          const button = this.createButtonsElement(textBtn);
          const buttons = btns.querySelector('.buttons');
          if (buttons) {
            buttons.appendChild(button);
          }
        });
        const dataTile = <HTMLElement>tile.querySelector('.data-tile');
        dataTile.appendChild(btns);
      }
    }
    return tile;
  }

  isEventDataAudio(eventData: EventData): eventData is EventDataAudio {
    return typeof (<EventDataAudio>eventData).track !== 'undefined';
  }

  isEventDataGraph(eventData: EventData): eventData is EventDataGraph {
    return typeof (<EventDataGraph>eventData).type !== 'undefined';
  }

  isEventDataImage(eventData: EventData): eventData is EventDataImage {
    return typeof (<EventDataImage>eventData).image !== 'undefined';
  }

  isEventDataButtons(eventData: EventData): eventData is EventDataButtons {
    return typeof (<EventDataButtons>eventData).buttons !== 'undefined';
  }

  searchElemAndInnerText(templateElement: HTMLDivElement, selector: string, innerText: string) {
    const element: HTMLElement = <HTMLElement>templateElement.querySelector(selector);
    if (element) {
      element.innerText = innerText;
    }
    return element;
  }

  searchElemAndBgImage(templateElement: HTMLDivElement, selector: string, url: string) {
    const element: HTMLElement = <HTMLElement>templateElement.querySelector(selector);
    if (element) {
      element.style.backgroundImage = url;
    }
  }

  searchAndSetAttr(templateElement: HTMLDivElement, selector: string, attrName: string, attrValue: string) {
    const element: HTMLElement = <HTMLElement>templateElement.querySelector(selector);
    if (element) {
      element.setAttribute(attrName, attrValue);
    }
  }

  fillTemplateAudio(audio: HTMLDivElement, data: EventDataAudio): void {
    if (audio !== null) {
      this.searchElemAndBgImage(audio, '.cover', `url("${data.albumcover}")`);
      this.searchElemAndInnerText(audio, '.artist', `${data.artist}-${data.track.name}`);
      this.searchElemAndInnerText(audio, '.length', data.track.length);
      this.searchAndSetAttr(audio, '.track', 'max', data.track.length);
      this.searchAndSetAttr(audio, '.track', 'value', `${data.track.length}/2`);
      this.searchAndSetAttr(audio, '.volume-range', 'value', data.volume.toString());
      this.searchElemAndInnerText(audio, '.volume', `${data.volume}%`);
    }
  }

  fillTemplateGraph(graph: HTMLDivElement, data: EventDataGraph): void {
    if (graph !== null) {
      const graphNode: HTMLElement = <HTMLElement>graph.querySelector('.graph');
      /*Загружаем картинку-график*/
      const imageGraph = {
        class: 'image-graph',
        sourceSrcset: sourceGraphSrcset,
        imgSrc: imgGraphSrc,
        imgSrcset: `${imgGraphSrcset2} 2x, ${imgGraphSrcset3} 3x`,
        imgAlt: 'graph'
      };
      /*Получаем результат шаблонизатора и вставлем в html*/
      const dataGraph = picture(imageGraph);
      const graphHTML: HTMLElement = graphNode;
      graphHTML.innerHTML = dataGraph;
    }
  }

  createImageElement(): HTMLDivElement {
    //вставляем заглушку вместо "get_it_from_mocks_:3.jpg"
    const imgDiv = document.createElement('div');

    imgDiv.style.background = `url('img/Bitmap.png')`;
    imgDiv.style.background = `-webkit-image-set( url('img/Bitmap.png') 1x, url('img/Bitmap2x.png') 2x , url('img/Bitmap3x.png') 3x`;
    imgDiv.style.backgroundPosition = `50% 50%`;
    imgDiv.classList.add('cam');
    const camSlider = document.createElement('div');
    camSlider.classList.add(`cam-slider`);
    imgDiv.appendChild(camSlider);
    return imgDiv;
  }

  createLabelControl(): HTMLDivElement {
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
    return labels;
  }

  createButtonsElement(textBtn: string): HTMLDivElement {
    const button = document.createElement('div');
    button.classList.add('data-button');
    button.innerText = textBtn;
    return button;
  }
}
