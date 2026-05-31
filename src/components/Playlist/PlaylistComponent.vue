<template>
  <div
    v-if="playlists.mp3 && playlists.wav && playlists.video"
    class="playlist-component col-12"
  >
    <div class="row">
      <div class="col-12 col-md-4">
        <h3>
          MP3 ({{ playlists.mp3.length }})
          <a
            href="https://talos.feralhosting.com/aymeric000/links/music/mp3.zip"
            class="download-all"
          >Download all</a>
        </h3>
        <div class="items-content">
          <transition-group
            name="playlist-items"
            tag="ul"
          >
            <template
              v-for="music in currentPageMp3Playlist"
              :key="music.id"
            >
              <PlaylistItem
                :music="music"
                :extra="extra(music.id)"
                :selected-content="selectedContent"
                @update:selected-content="selectedContentUpdate($event)"
              />
            </template>
          </transition-group>
          <PaginationComponent
            :current-page="currentPageMp3"
            :items-total="playlists.mp3.length"
            :items-per-page="maxItems"
            :max-pages-visible="3"
            @update:pagination="currentPageMp3 = $event"
          />
        </div>
      </div>
      <div class="col-12 col-md-4">
        <h3>
          Lossless ({{ playlists.wav.length }})
          <a
            href="https://talos.feralhosting.com/aymeric000/links/music/wav.zip"
            class="download-all"
          >Download all</a>
        </h3>
        <div class="items-content">
          <transition-group
            name="playlist-items"
            tag="ul"
          >
            <template
              v-for="music in currentPageLosslessPlaylist"
              :key="music.id"
            >
              <PlaylistItem
                :music="music"
                :extra="extra(music.id)"
                :selected-content="selectedContent"
                @update:selected-content="selectedContentUpdate($event)"
              />
            </template>
          </transition-group>
          <PaginationComponent
            :current-page="currentPageLossless"
            :items-total="playlists.wav.length"
            :items-per-page="maxItems"
            :max-pages-visible="3"
            @update:pagination="currentPageLossless = $event"
          />
        </div>
      </div>
      <div class="col-12 col-md-4">
        <h3>Music Video ({{ playlists.video.length }})</h3>
        <div class="items-content">
          <transition-group
            name="playlist-items"
            tag="ul"
          >
            <template
              v-for="music in currentPageVideoPlaylist"
              :key="music.id"
            >
              <PlaylistItem
                :music="music"
                :extra="extra(music.id)"
                :selected-content="selectedContent"
                @update:selected-content="selectedContentUpdate($event)"
              />
            </template>
          </transition-group>
          <PaginationComponent
            :current-page="currentPageVideo"
            :items-total="playlists.video.length"
            :items-per-page="maxItems"
            :max-pages-visible="3"
            @update:pagination="currentPageVideo = $event"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import PaginationComponent from '../Filters/PaginationComponent.vue';
import PlaylistItem from './PlaylistItem.vue';

const props = defineProps({
  playlists: Object,
  selectedContent: String,
  textFilter: String,
  textFilterArtist: String,
  textFilterTitle: String,
});

const emit = defineEmits(['update:selectedContent']);

const currentPageMp3 = ref(1);
const currentPageLossless = ref(1);
const currentPageVideo = ref(1);
const maxItems = ref(10);

const selectedContentUpdate = (event) => {
  emit('update:selectedContent', event);
};

const extra = (id) => props.playlists?.extra?.find((m) => m.id === id);

const resetPagination = () => {
  currentPageMp3.value = 1;
  currentPageLossless.value = 1;
  currentPageVideo.value = 1;
};

watch(() => props.textFilter, (newVal, oldVal) => {
  if (newVal?.length >= 3 && newVal !== oldVal) {
    resetPagination();
  }
});

watch(() => props.textFilterArtist, (newVal, oldVal) => {
  if (newVal?.length >= 3 && newVal !== oldVal) {
    resetPagination();
  }
});

watch(() => props.textFilterTitle, (newVal, oldVal) => {
  if (newVal?.length >= 3 && newVal !== oldVal) {
    resetPagination();
  }
});

const currentPageMp3Playlist = computed(() => props.playlists.mp3.slice(
  (currentPageMp3.value - 1) * maxItems.value,
  currentPageMp3.value * maxItems.value,
));

const currentPageLosslessPlaylist = computed(() => props.playlists.wav.slice(
  (currentPageLossless.value - 1) * maxItems.value,
  currentPageLossless.value * maxItems.value,
));

const currentPageVideoPlaylist = computed(() => props.playlists.video.slice(
  (currentPageVideo.value - 1) * maxItems.value,
  currentPageVideo.value * maxItems.value,
));
</script>

<style lang="scss">
.download-all {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  margin-left: 4px;
}
.items-content {
  height: 100%;
  position: relative;
  ul {
    .playlist-items-item {
      transition: all 1s;
      display: block;
    }
    .playlist-items-move {
    }
    .playlist-items-enter-active {
      // width: 100%;
      // position: absolute;
    }
    .playlist-items-leave-active {
      width: 100%;
      position: absolute;
    }
    .playlist-items-enter, .playlist-items-leave-to
    /* .list-complete-leave-active below version 2.1.8 */ {
      opacity: 0;
      transform: translateX(0%) scale(0.8);
    }
    .playlist-items-enter-from {
      opacity: 0;
      transform: translateX(0%) scale(0.8);
    }
  }
}
</style>
