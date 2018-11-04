import Store from '../../flux/build/store/store';
import { iVideoSettings } from './components/devicePage/devicePage';

export interface iState {
  route: string;
  videos: iVideoSettings;
}

const LS_STORE = 'store';
const INIT_STORE: iState = {
  route: '',
  videos: {}
};
export default class LocalStorageManager {
  storage: Storage;
  constructor() {
    this.storage = localStorage;

    this.setStateToLocalStorage(INIT_STORE);
  }
  getStateFromLocalStorage(): any {
    const stateStorage = this.storage.getItem(LS_STORE);
    if (stateStorage) return JSON.parse(stateStorage);
    return stateStorage;
  }
  setStateToLocalStorage(value: any) {
    this.storage.setItem(LS_STORE, JSON.stringify(value));
  }
  connectToStore(store: Store) {
    store.subscribe(() => {
      const storeState = store.getState();
      this.setStateToLocalStorage(storeState);
    });
  }
}
