import * as touchEvents from './touchEnter';

export function render(events: DeviceEvent[]): void {
  const content = document.querySelector('.content');
  if (content) {
    events.forEach(
      (event: DeviceEvent): void => {
        const eventElement = createEventElement(event);
        content.appendChild(eventElement);
      }
    );
    touchEvents.touchEvent();
  }
}

interface DeviceEvent {
  type: string;
  title: string;
  source: string;
  time: string;
  description: null | string;
  icon: string;
  data: EventData | undefined;
  size: EventSize;
}

type EventData = EventDataAudio | EventDataGraph | EventDataImage | EventDataButtons;

type EventSize = 's' | 'm' | 'l';

interface EventDataAudio {
  albumcover: string;
  artist: string;
  track: {
    name: string;
    length: string;
  };
  volume: number;
}
interface EventDataGraph {
  type: 'graph';
  values: object[];
}
interface EventDataImage {
  image: string;
}
interface EventDataButtons {
  buttons: string[];
}

function createEventElement(event: DeviceEvent) {
  const tile = <HTMLDivElement>(<HTMLTemplateElement>document.querySelector('.template')).content.cloneNode(true);

  const tileSize = <HTMLElement>tile.querySelector('.tile');
  tileSize.classList.add(`${event.size}`);
  searchAndSetAttr(tile, '.type-tile', 'type', event.type);
  searchElemAndInnerText(tile, '.title-tile', event.title);
  searchElemAndInnerText(tile, '.source-tile', event.source);
  event.type === 'critical'
    ? searchElemAndBgImage(tile, '.icon-tile', `url(img/${event.icon}-white.svg)`)
    : searchElemAndBgImage(tile, '.icon-tile', `url(img/${event.icon}.svg)`);
  searchElemAndInnerText(tile, '.time-tile', event.time);

  if (event.description) {
    searchElemAndInnerText(tile, '.description-tile', event.description);
  }

  const data = event.data;
  if (data) {
    //Если есть data, добавляем класс visable элементу info-tile
    const tileInfo = <HTMLElement>tile.querySelector('.info-tile');
    tileInfo.classList.add('visable');

    //Если нашли трек, то используем шаблон аудио
    if (isEventDataAudio(data)) {
      const audio = <HTMLDivElement>(
        (<HTMLTemplateElement>document.querySelector('.template-audio')).content.cloneNode(true)
      );
      fillTemplateAudio(audio, data);
      const dataTile = <HTMLElement>tile.querySelector('.data-tile');
      dataTile.classList.add('data-audio');
      dataTile.appendChild(audio);
    }

    //Нашли тип граф
    if (isEventDataGraph(data)) {
      //вставляем картинку-заглушку
      const graph = <HTMLDivElement>(
        (<HTMLTemplateElement>document.querySelector('.template-graph')).content.cloneNode(true)
      );
      fillTemplateGraph(graph, data);
      const dataTile = <HTMLElement>tile.querySelector('.data-tile');
      dataTile.appendChild(graph);
    }
    //Нашли изображение
    if (isEventDataImage(data)) {
      const image = <HTMLDivElement>(
        (<HTMLTemplateElement>document.querySelector('.template-image')).content.cloneNode(true)
      );
      //вставляем заглушку вместо "get_it_from_mocks_:3.jpg"
      const imgDiv = createImageElement();
      const labels = createLabelControl();
      image.appendChild(imgDiv);
      const dataTile = <HTMLElement>tile.querySelector('.data-tile');
      dataTile.classList.add('camera');
      dataTile.appendChild(image);
      dataTile.appendChild(labels);
    }
    //Нашли кнопки
    if (isEventDataButtons(data)) {
      const btns = <HTMLDivElement>(
        (<HTMLTemplateElement>document.querySelector('.template-buttons')).content.cloneNode(true)
      );
      data.buttons.forEach(textBtn => {
        const button = createButtonsElement(textBtn);
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

function isEventDataAudio(eventData: EventData): eventData is EventDataAudio {
  return typeof (<EventDataAudio>eventData).track !== 'undefined';
}

function isEventDataGraph(
  eventData: object | EventDataAudio | EventDataGraph | EventDataImage | EventDataButtons
): eventData is EventDataGraph {
  return typeof (<EventDataGraph>eventData).type !== 'undefined';
}

function isEventDataImage(
  eventData: object | EventDataAudio | EventDataGraph | EventDataImage | EventDataButtons
): eventData is EventDataImage {
  return typeof (<EventDataImage>eventData).image !== 'undefined';
}

function isEventDataButtons(
  eventData: object | EventDataAudio | EventDataGraph | EventDataImage | EventDataButtons
): eventData is EventDataButtons {
  return typeof (<EventDataButtons>eventData).buttons !== 'undefined';
}

function searchElemAndInnerText(templateElement: HTMLDivElement, selector: string, innerText: string) {
  const element: HTMLElement = <HTMLElement>templateElement.querySelector(selector);
  if (element) {
    element.innerText = innerText;
  }
  return element;
}

function searchElemAndBgImage(templateElement: HTMLDivElement, selector: string, url: string) {
  const element: HTMLElement = <HTMLElement>templateElement.querySelector(selector);
  if (element) {
    element.style.backgroundImage = url;
  }
}

function searchAndSetAttr(templateElement: HTMLDivElement, selector: string, attrName: string, attrValue: string) {
  const element: HTMLElement = <HTMLElement>templateElement.querySelector(selector);
  if (element) {
    element.setAttribute(attrName, attrValue);
  }
}

function fillTemplateAudio(audio: HTMLDivElement, data: EventDataAudio): void {
  if (audio !== null) {
    searchElemAndBgImage(audio, '.cover', `url("${data.albumcover}")`);
    searchElemAndInnerText(audio, '.artist', `${data.artist}-${data.track.name}`);
    searchElemAndInnerText(audio, '.length', data.track.length);
    searchAndSetAttr(audio, '.track', 'max', data.track.length);
    searchAndSetAttr(audio, '.track', 'value', `${data.track.length}/2`);
    searchAndSetAttr(audio, '.volume-range', 'value', data.volume.toString());
    searchElemAndInnerText(audio, '.volume', `${data.volume}%`);
  }
}

function fillTemplateGraph(graph: HTMLDivElement, data: EventDataGraph): void {
  if (graph !== null) {
    const graphNode: HTMLElement = <HTMLElement>graph.querySelector('.graph');
    graphNode.style.background = ` url('../../img/Richdata.png') no-repeat`;
    graphNode.style.backgroundImage = `-webkit-image-set( url('../../img/Richdata.png') 1x, url('../../img/Richdata@2x.png') 2x, url('../../images/Richdata@3x.png') 3x )`;
    graphNode.style.backgroundPosition = `center bottom`;
  }
}

function createImageElement(): HTMLDivElement {
  //вставляем заглушку вместо "get_it_from_mocks_:3.jpg"
  const imgDiv = document.createElement('div');
  imgDiv.style.background = `url('./img/Bitmap.png')`;
  imgDiv.style.background = `-webkit-image-set( url('../../img/Bitmap.png') 1x, url('../../img/Bitmap2x.png') 2x , url('img/Bitmap3x.png') 3x`;
  imgDiv.style.backgroundPosition = `50% 50%`;
  imgDiv.classList.add('cam');
  const camSlider = document.createElement('div');
  camSlider.classList.add(`cam-slider`);
  imgDiv.appendChild(camSlider);
  return imgDiv;
}

function createLabelControl(): HTMLDivElement {
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

function createButtonsElement(textBtn: string): HTMLDivElement {
  const button = document.createElement('div');
  button.classList.add('data-button');
  button.innerText = textBtn;
  return button;
}
