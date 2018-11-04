import Tile from './components/videoTile/index';

import dataVideos from '../../data/video.json';

export interface VideoDataElement {
  title: string;
  id: string;
  url: string;
}

export interface iVideoSettings {
  [key: string]: iVideoState;
}

export interface iVideoState {
  brightness: string;
  contrast: string;
}
let initialState: iVideoSettings = {};

/*Получаем данные для видео -тайлов*/

export default class DevicePage {
  videos: { [key: string]: Tile } = {};
  onChange: any;
  containerElement: HTMLDivElement;
  userSettings: iVideoSettings;
  constructor(containerElement: HTMLDivElement, onChange: any, userSettings: iVideoSettings) {
    this.containerElement = containerElement;
    this.userSettings = userSettings;
    this.onChange = onChange;
  }
  mount(): void {
    this.videoFromJSON();
  }

  videoFromJSON(): void {
    dataVideos.forEach((dataVideo: VideoDataElement) => {
      /*Получаем результат шаблонизатора и вставлем в html*/

      if (this.containerElement) {
        const settings = this.userSettings[dataVideo.id] || { brightness: '1', contrast: '1' };
        if (!settings.brightness) settings.brightness = '1';
        if (!settings.contrast) settings.contrast = '1';
        const tile = new Tile(
          dataVideo,
          this.containerElement,
          dataVideo.url,
          this.onChange,
          settings.brightness,
          settings.contrast
        );
        this.videos[dataVideo.id] = tile;
      }
    });
  }

  updateVideoSettings(videosSettings: iVideoSettings) {
    for (let videoId in videosSettings) {
      this.videos[videoId].setBrightness(videosSettings[videoId].brightness || '1');
      this.videos[videoId].setContrast(videosSettings[videoId].contrast || '1');
    }
  }

  unmount() {
    for (let videoId in this.videos) {
      this.videos[videoId].remove();
    }
    while (this.containerElement.firstChild) {
      this.containerElement.removeChild(this.containerElement.firstChild);
    }
  }
}
