<template>
  <div v-if="playlists.mp3 && playlists.wav && playlists.video" class="playlist-component col-12">
    <div class="row">
      <div class="col-12 col-md-4">
        <h3>MP3</h3>
        <div class="items-content">
          <ul class="item-list">
            <template v-for="music in playlists.mp3" :key="music.id">
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
            <template v-for="music in playlists.wav" :key="music.id">
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
            <template v-for="music in playlists.video" :key="music.id">
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

export default {
  props: {
    playlists: Object,
    selectedContent: String,
  },
  name: 'PlaylistComponent',
  components: {
    PlaylistItem,
  },
  data() {
    return {
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
