import Store from '../../flux/build/store/store';
//todo: import from npm: import Store from 'bikeflux/build/store/store';

import Application from './components/app';
import LocalStorageManager from './localStorage';
const ls = new LocalStorageManager();

function reducer(state: any, action: any) {
  let newState = { ...state };
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
      break;
  }
  return newState;
}
const store = new Store(reducer, ls.getStateFromLocalStorage());

ls.connectToStore(store);
const app = new Application(store);
