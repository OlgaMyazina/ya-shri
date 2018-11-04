import * as index from './index/index'; // './index/index.ts';
index;

import * as renderEvents from '../components/home/components/index';

declare const EVENTS_URL: string;

fetch(EVENTS_URL)
  .then(res => res.json())
  .then(data => renderEvents.render(data.events));
