'use strict';

export default class Tile {
  constructor(tile, video) {
    this.tile = tile;
    this.video = video;
    this.initVideo();
  }
  initVideo() {
    /*Инициализируем видео и добавляем на него обработчик*/
    console.log(this.tile);
    const videoEl = this.tile.querySelector('video');
    this.initVideoStream(videoEl, this.video.url);
    videoEl.addEventListener('click', () => {
      if (!this.tile.classList.contains('opened')) this.tile.classList.add('opened');
    });
  }

  initVideoStream(videoEl, url) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoEl);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        videoEL.play();
      });
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
      videoEl.addEventListener('loadedmetadata', function() {
        videoEl.play();
      });
    }
  }
}
