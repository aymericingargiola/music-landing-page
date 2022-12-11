<template>
  <div v-if="currentItem" class="hero-component">
        <div class="background">
          <transition name="fade" mode="out-in">
            <img
            :key="backgroundImage"
            :alt="currentItem.name"
            :src="backgroundImage">
          </transition>
        </div>
      <div class="container">
        <div class="col-12 hero-content">
          <div class="row">
            <div class="col-12">
              <transition name="fade" mode="out-in">
                <h1 :key="currentItem">
                  <span class="artist">{{currentItem.artist}}</span>
                  <span class="title">{{currentItem.title}}</span>
                </h1>
              </transition>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-lg-8">
              <div class="video-container">
                <div class="video-content">
                  <transition name="fade" mode="out-in">
                    <div :key="backgroundImageLoading"
                    v-if="backgroundImageLoading" class="loading">
                      <LoaderComponent/>
                    </div>
                    <videoPlayer :key="backgroundImageLoading && backgroundImage"
                    v-else-if="currentItemVideo
                    && currentItemExtra
                    && currentItemExtra.optiweb
                    && backgroundImage
                    && !backgroundImageLoading"
                    :poster="backgroundImage"
                    :sources="[
                    {src:optiWebVideoUrl,type:`video/mp4`}
                    ]" />
                    <iframe :key="currentItemExtra"
                    v-else-if="currentItemExtra
                    && currentItemExtra.youtubeId
                    && !currentItemExtra.optiweb
                    && !backgroundImageLoading"
                    :src="`https://www.youtube-nocookie.com/embed/${currentItemExtra.youtubeId}`"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer;gyroscope"
                    allowfullscreen></iframe>
                    <div v-else class="empty-video">
                      <svg enable-background="new 0 0 520 520" version="1.1" viewBox="0 0 520 520" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m505.29 157.62c-9.005-5.568-20.585-6.075-30.037-1.342l-78.253 38.964v-42.185c0-16.862-13.256-30.136-30.118-30.136h-183.15l-68.365-80.99c-10.883-12.866-30.131-14.591-43.027-3.685-12.866 10.892-14.476 30.112-3.578 42.985l335.87 396.91c6.038 7.134 14.641 10.797 23.318 10.797 6.962 0 13.97-2.377 19.71-7.23 12.866-10.891 14.276-30.164 3.378-43.038l-54.037-63.626v-19.903l78.136 38.964c4.309 2.154 9.098 3.22 13.764 3.22 5.576 0 11.435-1.528 16.34-4.562 8.99-5.561 14.76-15.386 14.76-25.971v-183.2c0-10.586-5.72-20.41-14.71-25.971z"/><path d="M0,153.059v244.267c0,16.862,14.138,30.597,31,30.597h260.756L29.879,122.647C13.443,123.128,0,136.499,0,153.059z"/></svg>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-4">
              <transition name="fade" mode="out-in">
                <ul :key="currentItemMp3">
                  <li v-if="releaseDate" class="info-item">
                    <span class="item-title">Release date :</span>
                    {{releaseDate}}
                  </li>
                  <li v-if="currentItemMp3 && currentItemMp3.url"
                  class="info-item">
                    <span class="item-title">MP3 : </span>
                    <a class="download" :href="currentItemMp3.url" target="_blank">Download</a>
                  </li>
                  <li v-if="currentItemLossless && currentItemLossless.url"
                  class="info-item">
                    <span class="item-title">WAV : </span>
                    <a class="download" :href="currentItemLossless.url" target="_blank">Download</a>
                  </li>
                  <li v-if="currentItemVideo && currentItemVideo.url"
                  class="info-item">
                    <span class="item-title">Video : </span>
                    <a class="download" :href="currentItemVideo.url" target="_blank">Download</a>
                  </li>
                </ul>
              </transition>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import images from '@/helpers/images';
import VideoPlayer from '@/components/Medias/VideoPlayer.vue';
import LoaderComponent from '@/components/Tools/loaderComponent.vue';

export default {
  props: {
    playlists: Object,
    selectedContent: String,
    filtering: Boolean,
  },
  name: 'HeroComponent',
  components: {
    VideoPlayer,
    LoaderComponent,
  },
  setup(props) {
    const heroBgFolder = '/imgs/heroes/';
    const backgroundImageLoading = ref(true);
    const backgroundImage = ref(null);
    const currentItem = computed(() => {
      const current = props.playlists.mp3.find(
        (music) => (music.id === props.selectedContent),
      )
      || props.playlists.video.find((music) => (music.id === props.selectedContent))
      || props.playlists.wav.find((music) => (music.id === props.selectedContent));
      if (!current && (props.playlists.mp3.length > 0
      || props.playlists.video.length > 0
      || props.playlists.wav.length > 0)) {
        return props.playlists.mp3[0]
        || props.playlists.video[0]
        || props.playlists.wav[0];
      }
      return current;
    });
    const currentItemMp3 = computed(
      () => props.playlists.mp3?.find((music) => (music.id === props.selectedContent)),
    );
    const currentItemLossless = computed(
      () => props.playlists.wav?.find((music) => (music.id === props.selectedContent)),
    );
    const currentItemVideo = computed(
      () => props.playlists.video?.find((music) => (music.id === props.selectedContent)),
    );
    const currentItemExtra = computed(
      () => props.playlists.extra?.find((music) => (music.id === props.selectedContent)),
    );
    const releaseDate = computed(() => {
      const date = currentItemExtra?.value?.releaseTimestamp
        ? new Date(parseInt(currentItemExtra.value.releaseTimestamp, 10) * 1000)
        : null;
      const options = {
        year: 'numeric', month: 'long', day: 'numeric',
      };
      if (!date) return date;
      return date.toLocaleDateString('en-US', options);
    });
    async function getBackgroundImage() {
      backgroundImageLoading.value = true;
      if (!props.selectedContent) return;
      backgroundImage.value = null;
      const imgIdMap = currentItemExtra?.value?.remapImages
      || currentItemExtra?.value?.id
      || 'unknow';
      const imgUrl = `${heroBgFolder}${imgIdMap}.webp`;
      const isLoaded = await images.preloadImage(imgUrl);
      // Long image loading test
      // eslint-disable-next-line no-promise-executor-return
      // await new Promise((resolve) => setTimeout(resolve, 20000));
      if (isLoaded === true) {
        backgroundImage.value = imgUrl;
      } else {
        backgroundImage.value = `${heroBgFolder}unknow.webp`;
      }
      backgroundImageLoading.value = false;
    }
    getBackgroundImage();
    watch(
      () => props.selectedContent,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          getBackgroundImage();
        }
      },
    );
    const optiWebVideoUrl = computed(() => {
      const videoUrl = currentItemVideo?.value?.url;
      const optUrl = `${videoUrl?.replace(/.([^.]*)$/, '%20_optweb')}.mp4`;
      return optUrl;
    });
    return {
      heroBgFolder,
      backgroundImage,
      backgroundImageLoading,
      getBackgroundImage,
      currentItem,
      currentItemMp3,
      currentItemLossless,
      currentItemVideo,
      currentItemExtra,
      releaseDate,
      optiWebVideoUrl,
    };
  },
};
</script>

<style lang="scss">
.hero-component {
  position: relative;
  .hero-content {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 30px;
    border-radius: 5px;
    background-color: color($background3, 0.5);
    backdrop-filter: blur(20px);
    h1 {
      margin-top: 0px;
      margin-bottom: 30px;
      .artist {
        display: block;
        letter-spacing: 2px;
      }
      .title {
        font-size: 24px;
        font-weight: normal;
      }
    }
    .empty-video {
      background: $background;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border-radius: 5px;
      svg {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0.2);
        path {
          fill: $alert;
        }
      }
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
    img {
      position: absolute;
      object-fit: cover;
      object-position: center;
      width: 100%;
      height: 100%;
    }
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient($background 2%, transparent 100%),
      linear-gradient(to top, $background 2%, transparent 100%);
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
    padding-bottom: calc(100% * 9/16);
    @include media-breakpoint-down(lg) {
      margin-bottom: 24px;
    }
    .video-content {
      display: flex;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      iframe, video {
        border-radius: 5px;
        width: 100%;
      }
      video {
        max-height: 100%;
        background: #000;
      }
      iframe {
        height: 100%;
      }
    }
  }
}
</style>
