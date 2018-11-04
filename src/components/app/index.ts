//import Store from 'bikeflux/build/store/store';
import Store from '../../../../flux/build/store/store';

import Layout from '../layout/layout';
import EventPage from '../eventPage/eventPage';
import DevicePage, { iVideoSettings } from '../devicePage/devicePage';
//import { iState } from './index';

import './app.css';
import LocalStorageManager from '../../localStorage';

declare const EVENTS_URL: string;
const ROUTE_EVENT = 'События';
const ROUTE_DEVICE = 'Устройства';

type iPage = EventPage | DevicePage;

export default class Application {
  currentRoute: string;
  currentPage: iPage | undefined;
  container: HTMLDivElement;
  store: Store;
  ls: LocalStorageManager;
  constructor(store: Store) {
    this.currentRoute = ROUTE_EVENT;
    this.store = store;
    this.ls = new LocalStorageManager();
    // = ls.getStateFromLocalStorage;
    //this.currentPage = new EventPage(this.container);
    const layout = new Layout();
    layout.render();
    this.listnerEventNav();
    this.store.subscribe(this.routeChange.bind(this));
    this.container = <HTMLDivElement>document.querySelector('.container');
    this.renderPage(this.currentRoute);
  }
  routeChange() {
    console.log(this.store);
    const routeFromStore = this.store.getState().route;
    if (routeFromStore !== this.currentRoute) this.renderPage(routeFromStore);
  }

  onChangeVideoFilter(action: any) {
    console.log(action);
    this.store.dispatch(action);
  }
  onNavLinkClick(route: string) {
    const action = {
      type: 'pageChange',
      route: route
    };
    this.store.dispatch(action);
  }
  renderPage(routeFromStore: string): void {
    // renderPage
    console.log(`renderPage`);
    if (this.currentPage) {
      // Мы уже что-то имеем на экране - это нужно удалить
      this.currentPage.unmount();
    }
    // Теперь рендерим то что нужно!
    console.log(ROUTE_DEVICE);
    console.log(ROUTE_EVENT);
    console.log(routeFromStore);
    switch (routeFromStore) {
      case ROUTE_EVENT:
        this.currentPage = new EventPage(this.container);
        break;
      case ROUTE_DEVICE:
        const userVideoSettings = this.ls.getStateFromLocalStorage().videos;
        if (userVideoSettings)
          this.currentPage = new DevicePage(this.container, this.onChangeVideoFilter.bind(this), userVideoSettings);
        break;
      default:
        throw Error('неизвестная страница');
    }
    if (this.currentPage) this.currentPage.mount();
    this.currentRoute = routeFromStore;
  }
  listnerEventNav() {
    /*Перехватываем клик на ссылки */
    const navElements = document.querySelectorAll<HTMLElement>('nav a');

    navElements.forEach(element => {
      element.addEventListener('click', e => {
        const link: HTMLElement = <HTMLElement>e.target;
        let route = '';
        if (link) route = link.innerText.trim(); //innerHTML; // console.log(link.innerHTML);
        e.preventDefault();
        this.onNavLinkClick(route);
      });
    });
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
