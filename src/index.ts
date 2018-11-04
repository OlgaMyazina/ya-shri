//import Store from '../../../flux/build/store/store';
import Store from 'bikeflux/build/store/store';

import { iVideoSettings } from './components/devicePage/devicePage';
import Application from './components/layout';
//import * as index from './index/index'; // './index/index.ts';
import { Page } from './index/index';

function onChangePage(action: any) {
  store.dispatch(action);
}
const index = new Page(onChangePage);

export interface iState {
  location: string;
  videos: iVideoSettings;
}

const initialState: iState = {
  location: '',
  videos: {}
};

function onChangeVideoFilter(action: any) {
  store.dispatch(action);
}
const app = new Application(onChangeVideoFilter);

const store = new Store(initialState);

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
