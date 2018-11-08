import Tile from './components/videoTile/index';
import * as deviceTemplate from './devicePage.hbs';

import dataVideos from '../../data/video.json';

export interface VideoDataElement {
  title: string;
  id: string;
  url: string;
}

export interface IVideoSettings {
  [key: string]: IVideoState;
}

export interface IVideoState {
  brightness: string;
  contrast: string;
}

export default class DevicePage {
  videos: { [key: string]: Tile } = {};
  onChange: any;
  containerElement: HTMLDivElement;
  userSettings: IVideoSettings;
  contentElement: HTMLDivElement | null;
  constructor(containerElement: HTMLDivElement, onChange: any, userSettings: IVideoSettings) {
    this.containerElement = containerElement;
    this.userSettings = userSettings;
    this.onChange = onChange;
    this.createDivContent();
    this.contentElement = document.querySelector<HTMLDivElement>('.content-device');
  }
  mount(): void {
    this.videoFromJSON();
  }

  createDivContent() {
    const html = deviceTemplate();

    if (this.containerElement) {
      this.containerElement.insertAdjacentHTML('beforeend', html);
    }
  }

  videoFromJSON(): void {
    dataVideos.forEach((dataVideo: VideoDataElement) => {
      if (this.contentElement) {
        const settings = this.userSettings[dataVideo.id] || { brightness: '1', contrast: '1' };
        if (!settings.brightness) settings.brightness = '1';
        if (!settings.contrast) settings.contrast = '1';
        let tile;
        if (this.contentElement)
          tile = new Tile(
            dataVideo,
            this.contentElement,
            dataVideo.url,
            this.onChange,
            settings.brightness,
            settings.contrast
          );
        else
          tile = new Tile(
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

  updateVideoSettings(videosSettings: IVideoSettings) {
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
