import './event.css';

import Tile from './components/tile/index';
import { DeviceEvent } from './components/tile/index';
import * as touchEvents from './components/touchEnter';

declare const EVENTS_URL: string;

export default class EventPage {
  containerElement: HTMLDivElement;
  constructor(containerElement: HTMLDivElement) {
    this.containerElement = containerElement;
  }
  render() {
    fetch(EVENTS_URL)
      .then(res => res.json())
      .then(data => this.renderEvents(data.events));
  }
  renderEvents(events: DeviceEvent[]): void {
    if (this.containerElement) {
      events.forEach(
        (event: DeviceEvent): void => {
          const eventElement = new Tile(event);
          this.containerElement.appendChild(eventElement.createEventElement());
        }
      );
      touchEvents.touchEvent();
    }
  }
  unmount() {}
}
