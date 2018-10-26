import * as renderEvents from './home/components/index';

declare const EVENTS_URL: string;

fetch(EVENTS_URL)
  .then(res => res.json())
  .then(data => renderEvents.render(data.events));
