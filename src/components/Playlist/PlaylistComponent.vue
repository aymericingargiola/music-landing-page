<template>
  <div v-if="playlists.mp3 && playlists.wav && playlists.video" class="playlist-component col-12">
    <div class="row">
      <div class="col-12 col-md-4">
        <h3>MP3</h3>
        <div class="items-content">
          <transition-group name="playlist-items" tag="ul">
            <template v-for="music in playlists.mp3" :key="music.id">
              <PlaylistItem :music="music"
              :extra="extra(music.id)" :selectedContent="selectedContent"
@update:selectedContent="selectedContentUpdate($event)"/>
            </template>
          </transition-group>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <h3>Lossless</h3>
        <div class="items-content">
          <transition-group name="playlist-items" tag="ul">
            <template v-for="music in playlists.wav" :key="music.id">
              <PlaylistItem :music="music"
              :extra="extra(music.id)" :selectedContent="selectedContent"
@update:selectedContent="selectedContentUpdate($event)"/>
            </template>
          </transition-group>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <h3>Music Video</h3>
        <div class="items-content">
          <transition-group name="playlist-items" tag="ul">
            <template v-for="music in playlists.video" :key="music.id">
              <PlaylistItem :music="music"
              :extra="extra(music.id)" :selectedContent="selectedContent"
@update:selectedContent="selectedContentUpdate($event)"/>
            </template>
          </transition-group>
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
    extra(id) {
      return this.playlists?.extra?.find((m) => m.id === id);
    },
  },
  computed: {
  },
};
</script>

<style lang="scss">
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
