<template>
  <div class="playlist col-12">
    <div class="row">
      <div class="col-12 col-md-4">
        <h3>MP3</h3>
        <div class="items-content">
          <ul class="item-list">
            <template v-for="music in playlist" :key="music.id">
              <PlaylistItem :music="music" :selectedContent="selectedContent"
@update:selectedContent="selectedContentUpdate($event)"/>
            </template>
          </ul>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <h3>Lossless</h3>
        <div class="items-content">
          <ul class="item-list">
            <template v-for="music in playlistLossless" :key="music.id">
              <PlaylistItem :music="music" :selectedContent="selectedContent"
@update:selectedContent="selectedContentUpdate($event)"/>
            </template>
          </ul>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <h3>Music Video</h3>
        <div class="items-content">
          <ul class="item-list">
            <template v-for="music in playlistVideo" :key="music.id">
              <PlaylistItem :music="music" :selectedContent="selectedContent"
@update:selectedContent="selectedContentUpdate($event)"/>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlaylistItem from './PlaylistItem.vue';
import playlistJson from '../../../public/jsons/playlist.json';
import playlistLosslessJson from '../../../public/jsons/playlistLossless.json';
import playlistVideoJson from '../../../public/jsons/playlistVideo.json';

export default {
  props: {
    selectedContent: String,
  },
  name: 'PlaylistComponent',
  components: {
    PlaylistItem,
  },
  data() {
    return {
      playlist: playlistJson,
      playlistLossless: playlistLosslessJson,
      playlistVideo: playlistVideoJson,
      selected: null,
    };
  },
  methods: {
    selectedContentUpdate(event) {
      this.$emit('update:selectedContent', event);
    },
  },
};
</script>

<style lang="scss">
.items-content {
  height: 100%;
  .item-list {
    padding-left: 0px;
    height: 100%;
    margin: 0px;
    list-style: none;
  }
}
</style>
