import * as touchEvents from './touchEnter';
import Tile from './tile';
import { DeviceEvent } from './tile';

export function render(events: DeviceEvent[]): void {
  const content = document.querySelector('.content');
  if (content) {
    events.forEach(
      (event: DeviceEvent): void => {
        const eventElement = new Tile(event);
        content.appendChild(eventElement.createEventElement());
      }
    );
    touchEvents.touchEvent();
  }
}
