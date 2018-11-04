import Store from '../../flux/build/store/store';
//import Store from 'bikeflux/build/store/store';

import Application from './components/app';
import LocalStorageManager from './localStorage';
const ls = new LocalStorageManager();

function reducer(state: any, action: any) {
  let newState = { ...state };
  console.log(state);
  console.log(action);
  switch (action.type) {
    case 'pageChange':
      newState.route = action.route;

      break;
    case 'contrastChange':
      if (newState.videos[action.videoId]) newState.videos[action.videoId].contrast = action.contrast;
      else
        newState.videos[action.videoId] = {
          contrast: action.contrast
        };

      break;
    case 'brightnessChange':
      if (newState.videos[action.videoId]) newState.videos[action.videoId].brightness = action.brightness;
      else
        newState.videos[action.videoId] = {
          brightness: action.brightness
        };
      //newState.videos[action.videoId].brightness = action.brightness;

      break;
  }
  return newState;
}
const store = new Store(reducer, ls.getStateFromLocalStorage());

ls.connectToStore(store);
const app = new Application(store);

/*this.store.subscrive(() => {
        const videosSettings = this.store.getState().videos;
        this.currentPage.updateVideosSettings(videosSettings);
      });*/

/*
import * as renderEvents from '../components/home/components/index';

declare const EVENTS_URL: string;

fetch(EVENTS_URL)
  .then(res => res.json())
  .then(data => renderEvents.render(data.events));
*/
