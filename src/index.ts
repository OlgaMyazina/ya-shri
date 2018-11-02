import * as renderEvents from './home/components/index';
import Store from '../../flux/build/store/store';
declare const EVENTS_URL: string;

function counter(state = 0, action: any) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}
let store = new Store(counter);
console.log(store);
store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });

fetch(EVENTS_URL)
  .then(res => res.json())
  .then(data => renderEvents.render(data.events));
