<template>
  <div
    v-if="itemsOrderedByReleaseDate"
    class="latest-tracks-component col-12"
  >
    <div class="component-content">
      <div class="title">
        <h2>Latest tracks</h2>
      </div>
      <div class="content">
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="24"
          :breakpoints="{
            '320': {
              slidesPerView: 1,
              spaceBetween: 24
            },
            '640': {
              slidesPerView: 2,
              spaceBetween: 24
            },
            '992': {
              slidesPerView: 3,
              spaceBetween: 24
            }
          }"
          :navigation="true"
          :loop="false"
          :grab-cursor="true"
          :centered-slides="false"
          :watch-slides-progress="true"
          class="latest-tracks-swiper"
        >
          <swiper-slide
            v-for="music in itemsOrderedByReleaseDate"
            :key="music.id"
          >
            <div
              class="track-card"
              :class="{selected: selectedContent === music.id}"
              @click="updateSelectedContent(music.id)"
            >
              <div class="date">
                {{ releaseDate(music.releaseTimestamp) }}
              </div>
              <div class="track-name">
                <div class="artist">
                  {{ music.artist }}
                </div>
                <div class="title">
                  {{ music.title }}
                </div>
              </div>
              <div class="links">
                <a
                  v-if="getMp3Url(music.id)"
                  :href="getMp3Url(music.id)"
                  target="_blank"
                >MP3</a>
                <a
                  v-if="getWavUrl(music.id)"
                  :href="getWavUrl(music.id)"
                  target="_blank"
                >WAV</a>
                <a
                  v-if="getVideoUrl(music.id)"
                  :href="getVideoUrl(music.id)"
                  target="_blank"
                >Video</a>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const props = defineProps({
  playlists: Object,
  selectedContent: String,
  filtering: Boolean,
});

const emit = defineEmits(['update:selectedContent']);

// Swiper modules setup
const modules = [Navigation];

const updateSelectedContent = (id) => {
  if (!props.selectedContent || props.selectedContent !== id) {
    emit('update:selectedContent', id);
  } else if (props.selectedContent === id) {
    emit('update:selectedContent', null);
  }
};

const itemsOrderedByReleaseDate = computed(() => {
  if (!props.playlists.extra || props.playlists.extra.length < 1) return [];
  const extras = [...props.playlists.extra];
  return extras.sort((a, b) => b.releaseTimestamp - a.releaseTimestamp).slice(0, 24);
});

const getMp3Url = (id) => props.playlists.mp3?.find((m) => m.id === id)?.url;
const getWavUrl = (id) => props.playlists.wav?.find((m) => m.id === id)?.url;
const getVideoUrl = (id) => props.playlists.video?.find((m) => m.id === id)?.url;

const releaseDate = (timestamp) => {
  const date = timestamp
    ? new Date(parseInt(timestamp, 10) * 1000)
    : null;
  const options = {
    year: 'numeric', month: 'long', day: 'numeric',
  };
  if (!date) return date;
  return date.toLocaleDateString('en-US', options);
};
</script>

<style lang="scss">
.latest-tracks-component {
  .component-content {
    margin-bottom: 20px;
    padding: 30px;
    border-radius: 5px;
    background-color: color($background3, 0.5);
    backdrop-filter: blur(20px);
  }
  .title {
    h2 {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  .content {
    .swiper {
      overflow: visible;
    }
    .latest-tracks-swiper {
      padding: 20px 40px;
      .swiper-slide {
        height: auto;
        transition: opacity 0.3s ease;
        will-change: opacity;
      }
      .swiper-slide:not(.swiper-slide-visible) {
        opacity: 0;
        pointer-events: none;
        transform: scale(0.95);
      }
      .track-card {
        background: $background;
        padding: 15px;
        border-radius: 5px;
        height: 100%;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        z-index: 1;
        .date {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 8px;
          opacity: 0.6;
        }
        .track-name {
          margin-bottom: 8px;
          .artist {
            font-weight: bold;
            margin-bottom: 8px;
          }
          .title {
            font-size: 14px;
          }
        }
        .links {
          margin-top: auto;
          a {
            &:not(:first-child) {
              margin-left: 8px;
            }
          }
        }
        &:hover {
          background-color: color($color: $background2);
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        &.selected {
          background-color: color($color: $active-purple-hover);
          .links {
            a {
              color: color($color: $text);
            }
          }
        }
      }
    }
    .swiper-button-next,
    .swiper-button-prev {
      color: color($color: $text, $opacity: 0.7);
      background-color: rgba($background, 0.5);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      &:after {
        font-size: 16px;
        font-weight: bold;
      }
      &:hover {
        background-color: rgba($background, 0.8);
        color: $active-purple;
      }
    }
    .swiper-button-next {
      right: -12px;
    }
    .swiper-button-prev {
      left: -12px;
    }
  }
}
</style>
