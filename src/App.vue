<template>
  <HeroComponent :playlists="playlists" :selectedContent="selectedContent"
  @update:selectedContent="selectedContent = $event"/>
  <div class="container">
    <PlaylistComponent :playlists="playlists" :selectedContent="selectedContent"
  @update:selectedContent="selectedContent = $event"/>
  </div>
</template>

<script>
import { reactive } from 'vue';
import playlistJson from '../public/jsons/playlist.json';
import playlistLosslessJson from '../public/jsons/playlistLossless.json';
import playlistVideoJson from '../public/jsons/playlistVideo.json';
import HeroComponent from './components/HeroComponent.vue';
import PlaylistComponent from './components/Playlist/PlaylistComponent.vue';

export default {
  name: 'App',
  components: {
    HeroComponent,
    PlaylistComponent,
  },
  setup() {
    const selectedContent = null;
    const playlists = reactive({
      mp3: playlistJson,
      wav: playlistLosslessJson,
      video: playlistVideoJson,
    });
    return { selectedContent, playlists };
  },
};
</script>

<style lang="scss">
@import './src/styles/bootstrap-grid';
@import './src/styles/main';
</style>
