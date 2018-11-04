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
  videos: Tile[] = [];
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
        console.log(this.userSettings);
        const tile = new Tile(dataVideo, this.containerElement, dataVideo.url, this.onChange);
        initialState[dataVideo.id] = {
          brightness: '1',
          contrast: '1'
        };
        this.videos.push(tile);
      }
    });
  }

  updateVideoSettings(videosSettings: iVideoSettings) {
    for (let videoId in videosSettings) {
      const index = this.videos.findIndex(videoTile => videoTile.video.classList.contains(videoId));
      this.videos[index].setBrightness(videosSettings[videoId].brightness);
      this.videos[index].setContrast(videosSettings[videoId].contrast);
    }
  }

  unmount() {
    this.videos.forEach(videoTile => {
      videoTile.removeEventToVideo();
      videoTile.removeEventToBrightness();
      videoTile.removeEventToContrast();
      videoTile.removeEventToBtns();
      videoTile.removeEventToVolume();
    });
  }
}
