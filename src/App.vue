<template>
  <HeroComponent :playlists="filteredPlaylists ? filteredPlaylists : playlists"
  :selectedContent="this.selectedContent"
  :filtering="filteredPlaylists ? true : false"
  @update:selectedContent="selectedContent = $event"/>
  <div class="container">
    <div class="row">
      <input class="col-12" v-model="textFilter" placeholder="SEARCH">
    </div>
    <div class="row">
      <PlaylistComponent :playlists="filteredPlaylists ? filteredPlaylists : playlists"
      :selectedContent="this.selectedContent"
      @update:selectedContent="selectedContent = $event"/>
    </div>
  </div>
</template>

<script>
import {
  onMounted, reactive, ref, computed,
} from 'vue';
import array from '@/helpers/array';
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
    const textFilter = ref(null);
    const playlists = reactive({
      mp3: null,
      wav: null,
      video: null,
    });
    function filterPlaylists() {
      return array.objectMap(playlists, (value) => value.filter((i) => {
        const textSearchValue = textFilter.value.normalize('NFC').toLowerCase();
        const titlefilter = i.titlefilter ? i.titlefilter.normalize('NFC').toLowerCase() : '';
        const artistfilter = i.artistfilter ? i.artistfilter.normalize('NFC').toLowerCase() : '';
        return titlefilter.includes(textSearchValue) || artistfilter.includes(textSearchValue);
      }));
    }
    const filteredPlaylists = computed(() => (textFilter.value
    && textFilter.value.length > 3
      ? filterPlaylists()
      : null));
    onMounted(async () => {
      const playlistJson = await fetch('/jsons/playlist.json');
      const playlistLosslessJson = await fetch('/jsons/playlistLossless.json');
      const playlistVideoJson = await fetch('/jsons/playlistVideo.json');
      playlists.mp3 = await playlistJson.json();
      playlists.wav = await playlistLosslessJson.json();
      playlists.video = await playlistVideoJson.json();
    });
    return {
      selectedContent, textFilter, playlists, filteredPlaylists,
    };
  },
};
</script>

<style lang="scss">
@import './src/styles/bootstrap-grid';
@import './src/styles/main';
</style>
