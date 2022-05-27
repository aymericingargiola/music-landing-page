<template>
  <HeroComponent :playlists="playlists" :selectedContent="this.selectedContent"
  @update:selectedContent="selectedContent = $event"/>
  <div class="container">
    <PlaylistComponent :playlists="playlists" :selectedContent="this.selectedContent"
  @update:selectedContent="selectedContent = $event"/>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import HeroComponent from './components/HeroComponent.vue';
import PlaylistComponent from './components/Playlist/PlaylistComponent.vue';

export default {
  name: 'App',
  components: {
    HeroComponent,
    PlaylistComponent,
  },
  setup() {
    const selectedContent = ref(null);
    const playlists = reactive({
      mp3: null,
      wav: null,
      video: null,
    });
    onMounted(async () => {
      const playlistJson = await fetch('/jsons/playlist.json');
      const playlistLosslessJson = await fetch('/jsons/playlistLossless.json');
      const playlistVideoJson = await fetch('/jsons/playlistVideo.json');
      playlists.mp3 = await playlistJson.json();
      playlists.wav = await playlistLosslessJson.json();
      playlists.video = await playlistVideoJson.json();
    });
    return { selectedContent, playlists };
  },

};
</script>

<style lang="scss">
@import './src/styles/bootstrap-grid';
@import './src/styles/main';
</style>
