<template>
  <div v-if="playlists.mp3 && playlists.wav && playlists.video" class="playlist-component col-12">
    <div class="row">
      <div class="col-12 col-md-4">
        <h3>
          MP3 ({{playlists.mp3.length}})
          <a href="https://antiphates.feralhosting.com/aymeric000/links/music/mp3.zip" class="download-all">Download all</a>
        </h3>
        <div class="items-content">
          <transition-group name="playlist-items" tag="ul">
            <template v-for="music in currentPageMp3Playlist" :key="music.id">
              <PlaylistItem :music="music"
              :extra="extra(music.id)" :selectedContent="selectedContent"
@update:selectedContent="selectedContentUpdate($event)"/>
            </template>
          </transition-group>
          <PaginationComponent
          :currentPage="currentPageMp3"
          :itemsTotal="playlists.mp3.length"
          :itemsPerPage="maxItems" :maxPagesVisible="3"
          @update:pagination="currentPageMp3 = $event"/>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <h3>
          Lossless ({{playlists.wav.length}})
          <a href="https://antiphates.feralhosting.com/aymeric000/links/music/wav.zip" class="download-all">Download all</a>
        </h3>
        <div class="items-content">
          <transition-group name="playlist-items" tag="ul">
            <template v-for="music in currentPageLosslessPlaylist" :key="music.id">
              <PlaylistItem :music="music"
              :extra="extra(music.id)" :selectedContent="selectedContent"
@update:selectedContent="selectedContentUpdate($event)"/>
            </template>
          </transition-group>
          <PaginationComponent
          :currentPage="currentPageLossless"
          :itemsTotal="playlists.wav.length"
          :itemsPerPage="maxItems" :maxPagesVisible="3"
          @update:pagination="currentPageLossless = $event"/>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <h3>Music Video ({{playlists.video.length}})</h3>
        <div class="items-content">
          <transition-group name="playlist-items" tag="ul">
            <template v-for="music in currentPageVideoPlaylist" :key="music.id">
              <PlaylistItem :music="music"
              :extra="extra(music.id)" :selectedContent="selectedContent"
@update:selectedContent="selectedContentUpdate($event)"/>
            </template>
          </transition-group>
          <PaginationComponent
          :currentPage="currentPageVideo"
          :itemsTotal="playlists.video.length"
          :itemsPerPage="maxItems" :maxPagesVisible="3"
          @update:pagination="currentPageVideo = $event"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaginationComponent from '../Filters/PaginationComponent.vue';
import PlaylistItem from './PlaylistItem.vue';

export default {
  props: {
    playlists: Object,
    selectedContent: String,
    textFilter: String,
    textFilterArtist: String,
    textFilterTitle: String,
  },
  name: 'PlaylistComponent',
  components: {
    PaginationComponent,
    PlaylistItem,
  },
  data() {
    return {
      currentPageMp3: 1,
      currentPageLossless: 1,
      currentPageVideo: 1,
      maxItems: 10,
    };
  },
  methods: {
    selectedContentUpdate(event) {
      this.$emit('update:selectedContent', event);
    },
    extra(id) {
      return this.playlists?.extra?.find((m) => m.id === id);
    },
    resetPagination() {
      this.currentPageMp3 = 1;
      this.currentPageLossless = 1;
      this.currentPageVideo = 1;
    },
  },
  watch: {
    textFilter(newVal, oldVal) {
      if (newVal?.length >= 3 && newVal !== oldVal) {
        this.resetPagination();
      }
    },
    textFilterArtist(newVal, oldVal) {
      if (newVal?.length >= 3 && newVal !== oldVal) {
        this.resetPagination();
      }
    },
    textFilterTitle(newVal, oldVal) {
      if (newVal?.length >= 3 && newVal !== oldVal) {
        this.resetPagination();
      }
    },
  },
  computed: {
    currentPageMp3Playlist() {
      return this.playlists.mp3.slice(
        (this.currentPageMp3 - 1) * this.maxItems,
        this.currentPageMp3 * this.maxItems,
      );
    },
    currentPageLosslessPlaylist() {
      return this.playlists.wav.slice(
        (this.currentPageLossless - 1) * this.maxItems,
        this.currentPageLossless * this.maxItems,
      );
    },
    currentPageVideoPlaylist() {
      return this.playlists.video.slice(
        (this.currentPageVideo - 1) * this.maxItems,
        this.currentPageVideo * this.maxItems,
      );
    },
  },
};
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
