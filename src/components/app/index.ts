//todo: import from npm import Store from 'bikeflux/build/store/store';
import Store from '../../../../flux/build/store/store';

import Layout from '../layout/layout';
import EventPage from '../eventPage/eventPage';
import DevicePage from '../devicePage/devicePage';

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
    this.store = store;
    this.ls = new LocalStorageManager();
    if (!this.ls.getStateFromLocalStorage().route) this.currentRoute = ROUTE_EVENT;
    else this.currentRoute = this.ls.getStateFromLocalStorage().route;
    const layout = new Layout();
    layout.render();
    this.listnerEventNav();
    this.store.subscribe(this.routeChange.bind(this));
    this.container = <HTMLDivElement>document.querySelector('.container');
    this.renderPage(this.currentRoute);
    this.listenerEventVideoFilter();
  }
  routeChange() {
    const routeFromStore = this.store.getState().route;
    if (routeFromStore !== this.currentRoute) this.renderPage(routeFromStore);
  }
  listenerEventVideoFilter() {
    this.store.subscribe(() => {
      if (this.currentPage instanceof DevicePage) {
        const videosSettings = this.store.getState().videos;
        this.currentPage.updateVideoSettings(videosSettings);
      }
    });
  }

  onChangeVideoFilter(action: any) {
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
    if (this.currentPage) {
      this.currentPage.unmount();
    }
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
    const navElements = document.querySelectorAll<HTMLElement>('nav a');

    navElements.forEach(element => {
      element.addEventListener('click', e => {
        const link: HTMLElement = <HTMLElement>e.target;
        let route = '';
        if (link) route = link.innerText.trim();
        e.preventDefault();
        this.onNavLinkClick(route);
      });
    });
  }
}
