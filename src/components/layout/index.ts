import EventPage from '../eventPage/eventPage';
import DevicePage, { iVideoSettings } from '../devicePage/devicePage';
//import { iState } from './index';

import './layout.css';

declare const EVENTS_URL: string;

type iPage = EventPage | DevicePage;

export default class Application {
  eventPageLocation: string = 'События';
  devicePageLocation: string = 'Устройства';
  currentLocation: string;
  currentPage: iPage;
  container: HTMLDivElement;
  onChangeVideoFilter: any;
  constructor(onChangeVideoFilter: any) {
    this.currentLocation = this.eventPageLocation;
    this.container = <HTMLDivElement>document.querySelector('.container');
    this.currentPage = new EventPage(this.container);
    this.renderLayout(this.currentLocation);
    this.onChangeVideoFilter = onChangeVideoFilter;
  }
  renderLayout(locationFromStore: string): void {
    // renderPage
    //Страница не изменилась
    if (this.currentLocation === locationFromStore) return;

    if (this.currentPage) {
      // Мы уже что-то имеем на экране - это нужно удалить
      this.currentPage.unmount();
    }
    // Теперь рендерим то что нужно!
    if (locationFromStore === this.eventPageLocation) {
      this.currentPage = new EventPage(this.container);
    }
    if (locationFromStore === this.devicePageLocation) {
      this.currentPage = new DevicePage(this.container, this.onChangeVideoFilter);
    }

    this.currentPage.mount();
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
