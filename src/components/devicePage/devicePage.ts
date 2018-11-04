//import Store from '../../../flux/build/store/store';

import Tile from './components/videoTile/index';

import dataVideos from '../data/video.json';

export interface VideoDataElement {
  title: string;
  class: string;
  url: string;
}

interface iVideoSettings {
  [key: string]: iVideoState;
}

interface iVideoState {
  brightness: string;
  contrast: string;
}
//let initialState: iVideoSettings = {};

/*Получаем данные для видео -тайлов*/

export default class DevicePage {
  videos: Tile[] = [];
  onChange: any;
  containerElement: HTMLDivElement;
  constructor(containerElement: HTMLDivElement, onChange: any) {
    this.containerElement = containerElement;
    this.videoFromJSON();
    this.onChange = onChange;
  }

  videoFromJSON(): void {
    dataVideos.forEach((dataVideo: VideoDataElement) => {
      /*Получаем результат шаблонизатора и вставлем в html*/
      const videosContainer = document.querySelector<HTMLDivElement>('.container');
      if (videosContainer) {
        const tile = new Tile(dataVideo, videosContainer, dataVideo.url, this.onChange);
        /*initialState[dataVideo.class] = {
          brightness: '1',
          contrast: '1'
        };*/
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
