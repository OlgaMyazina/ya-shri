import Store from 'bikeflux/build/store/store';

import EventPage from '../eventPage/eventPage';
import DevicePage from '../devicePage/devicePage';

import './layout.css';

declare const EVENTS_URL: string;

export default class Layout {
  store: Store;
  eventPageLocation: string = 'События';
  devicePageLocation: string = 'Устройства';
  initLocation: string;
  currentLocation: string;

  currentPage: IPage;
  container: HTMLDivElement;
  constructor() {
    this.store = new Store();
    this.initLocation = this.currentLocation = this.eventPageLocation;
    this.container = <HTMLDivElement>document.querySelector('.container');
  }
  renderLayout(locationFromStore: string): void {
    // renderPage

    if (this.currentLocation === locationFromStore) {
      return;
    }

    if (this.currentPage) {
      // Мы уже что-то имеем на экране - это нужно удалить
      this.currentPage.unmount();
    }

    // Теперь рендерим то что нужно!

    if (locationFromStore === this.eventPageLocation) {
      this.currentPage = new EventPage(this.container);
    }

    if (locationFromStore === this.devicePageLocation) {
      this.currentPage = new DevicePage(this.container);
      this.store.subscrive(() => {
        const videosSettings = this.store.getState().videos;
        this.currentPage.updateVideosSettings(videosSettings);
      });
    }

    this.currentPage.render();
    this.currentLocation = locationFromStore;
  }
}

/** */
/*
onChange(handler) {
  this.changeHandlers.push(handler);
}
*/

/*Из device.ts */
/*
const TypeVideoSettings = 'videoSettingChange';

let initialState: iVideoSettings = {};
function onChange(action: any) {
  store.dispatch(action);
}
function videoReducer(state = initialState, action: any) {
  if (action.type == 'brightnessChange') state[action.videoId].brightness = action.brightness;
  if (action.type == 'contrastChange') state[action.videoId].contrast = action.contrast;
  return state;
}

 store = new Store(videoReducer);
store.subscribe(() => {
  videos.forEach(video => {
    const currentStore: iVideoSettings = store.getState();
    video.setContrast(currentStore[video.video.classList[0]].contrast);
    video.setBrightness(currentStore[video.video.classList[0]].brightness);
  });
});
*/

/**** */

/**структура класса devicePage */
/*
class DevicesPage() {
constructor() {
  this.videos = this.loadFromLocalJson();
}
updateVideosSettings(videosSettings: {[key:string]: IVideoSettings}) {
  for (videoId in videosSettings) {
    this.videos[videoId].setBrightness();
    this.videos[videoId].setContrast();

    this.renderFilters(videoId);
  }
}
  render() {
  }
}
*/
