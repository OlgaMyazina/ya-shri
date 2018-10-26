import * as renderEvents from './home/components/index';

const urlJSON = 'http://localhost:8000/api/events';

fetch(urlJSON)
  .then(res => res.json())
  .then(data => renderEvents.render(data.events));
