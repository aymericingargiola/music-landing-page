<template>
  <div v-if="playlists.mp3
  && playlists.wav
  && playlists.video
  && currentItem" class="hero-component">
      <transition name="fade" mode="out-in">
        <div :key="backgroundImageLoaded" class="background"
        :style="{ backgroundImage: `url(${backgroundImage})`}"></div>
      </transition>
      <div class="container">
        <div class="col-12 hero-content">
          <div class="row">
            <div class="col-12">
              <transition name="fade" mode="out-in">
                <h1 :key="currentItem">{{currentItem.name}}</h1>
              </transition>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-lg-8">
              <div class="video-container">
                <div class="video-content">
                  <transition name="fade" mode="out-in">
                    <iframe :key="currentItemExtra" v-if="currentItemExtra && currentItemExtra.youtubeId" :src="`https://www.youtube-nocookie.com/embed/${currentItemExtra.youtubeId}`"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer;gyroscope"
                    allowfullscreen></iframe>
                    <div :key="currentItemExtra" v-else class="empty-video"></div>
                  </transition>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <ul>
                <transition name="fade" mode="out-in">
                <li v-if="releaseDate" class="info-item">
                  <span class="item-title">Release date :</span>
                  {{releaseDate}}
                </li>
                </transition>
                <transition name="fade" mode="out-in">
                <li v-if="currentItemMp3 && currentItemMp3.url" class="info-item">
                  <span class="item-title">MP3 : </span>
                  <a class="download" :href="currentItemMp3.url" target="_blank">Download</a>
                </li>
                </transition>
                <transition name="fade" mode="out-in">
                <li v-if="currentItemLossless && currentItemLossless.url" class="info-item">
                  <span class="item-title">WAV : </span>
                  <a class="download" :href="currentItemLossless.url" target="_blank">Download</a>
                </li>
                </transition>
                <transition name="fade" mode="out-in">
                <li v-if="currentItemVideo && currentItemVideo.url" class="info-item">
                  <span class="item-title">Video : </span>
                  <a class="download" :href="currentItemVideo.url" target="_blank">Download</a>
                </li>
                </transition>
              </ul>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import images from '@/helpers/images';

export default {
  props: {
    playlists: Object,
    selectedContent: String,
    filtering: Boolean,
  },
  name: 'HeroComponent',
  components: {
  },
  setup(props, context) {
    const heroBgFolder = '/imgs/heroes/';
    const pushedContent = ['Tm9hIEtpcmVsIC0gVGhvdWdodCBBYm91dCBUaGF0IChESiBLUyAmIExhemVyekYhbmUgQm9vdGxlZyBFZGl0KQ=='];
    const backgroundImageLoaded = false;
    if (!props.selectedContent) {
      context.emit('update:selectedContent', pushedContent[0]);
    }
    return { heroBgFolder, pushedContent, backgroundImageLoaded };
  },
  methods: {
    async preLoadImage(imgUrl) {
      this.backgroundImageLoaded = false;
      await images.preloadImage(imgUrl);
      this.backgroundImageLoaded = true;
    },
  },
  computed: {
    selectedId() {
      return this.selectedContent ? this.selectedContent : this.pushedContent[0];
    },
    currentItem() {
      const current = this.playlists.mp3.find((music) => (music.id === this.selectedId))
      || this.playlists.video.find((music) => (music.id === this.selectedId))
      || this.playlists.wav.find((music) => (music.id === this.selectedId));
      if (!current && (this.playlists.mp3.length > 0
      || this.playlists.video.length > 0
      || this.playlists.wav.length > 0)) {
        return this.playlists.mp3[0]
        || this.playlists.video[0]
        || this.playlists.wav[0];
      }
      return current;
    },
    currentItemMp3() {
      return this.playlists.mp3?.find((music) => (music.id === this.selectedId));
    },
    currentItemLossless() {
      return this.playlists.wav?.find((music) => (music.id === this.selectedId));
    },
    currentItemVideo() {
      return this.playlists.video?.find((music) => (music.id === this.selectedId));
    },
    currentItemExtra() {
      return this.playlists.extra?.find((music) => (music.id === this.selectedId));
    },
    releaseDate() {
      const date = this.currentItemExtra && this.currentItemExtra.releaseTimestamp
        ? new Date(parseInt(this.currentItemExtra.releaseTimestamp, 10) * 1000)
        : null;
      const options = {
        year: 'numeric', month: 'long', day: 'numeric',
      };
      if (!date) return date;
      return date.toLocaleDateString('en-US', options);
    },
    backgroundImage() {
      const imgUrl = `${this.heroBgFolder + this.selectedId}.webp`;
      this.preLoadImage(imgUrl);
      return imgUrl;
    },
  },
};
</script>

<style lang="scss">
.hero-component {
  position: relative;
  .hero-content {
    padding: 30px;
    border-radius: 5px;
    background-color: color($background3, 0.5);
    backdrop-filter: blur(10px);
    h1 {
      margin-top: 0px;
    }
    ul {
      position: relative;
      .info-item {
        padding: 15px;
        background: $background;
        margin-top: 15px;
        border-radius: 5px;
        &:first-child {
          margin-top: 0px;
        }
        .item-title {
          font-weight: bold;
        }
      }
      .info-items-leave-active {
        width: 100%;
        position: absolute;
      }
      .info-items-enter, .info-items-leave-to
      /* .list-complete-leave-active below version 2.1.8 */ {
        opacity: 0;
        transform: translateX(0%) scale(0.8);
      }
      .info-items-enter-from {
        opacity: 0;
        transform: translateX(0%) scale(0.8);
      }
    }
  }
  .background {
    position: absolute;
    width: 100vw;
    height: 100vh;
    max-height: 600px;
    pointer-events: none;
    opacity: 1;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient($background, transparent),
      linear-gradient(to top, $background, transparent);
    }
    &.fade-leave-to {
      opacity: 0;
    }
    &.fade-enter-from {
      opacity: 0;
    }
  }
  .video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    .video-content {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      iframe {
        border-radius: 5px;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
