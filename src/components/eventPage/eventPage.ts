import './eventPage.css';

import Tile from './components/tile/index';
import { DeviceEvent } from './components/tile/index';
import * as touchEvents from './components/touchEnter';
import * as eventTemplate from './eventPage.hbs';

declare const EVENTS_URL: string;

export default class EventPage {
  containerElement: HTMLDivElement;
  contentElement: HTMLDivElement | null;
  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement;
    this.createDivContent();
    this.contentElement = document.querySelector<HTMLDivElement>('.content');
  }
  mount() {
    fetch(EVENTS_URL)
      .then(res => res.json())
      .then(data => this.renderEvents(data.events));
  }
  renderEvents(events: DeviceEvent[]): void {
    if (this.containerElement) {
      events.forEach(
        (event: DeviceEvent): void => {
          const eventElement = new Tile(event);
          if (this.contentElement) this.contentElement.appendChild(eventElement.createEventElement());
          else this.containerElement.appendChild(eventElement.createEventElement());
        }
      );
      touchEvents.touchEvent();
    }
  }
  createDivContent() {
    const html = eventTemplate();
    if (this.containerElement) {
      this.containerElement.insertAdjacentHTML('beforeend', html);
    }
  }
  unmount() {
    while (this.containerElement.firstChild) {
      this.containerElement.removeChild(this.containerElement.firstChild);
    }
  }
}
