<template>
  <HeroComponent :playlists="filteredPlaylists"
  :selectedContent="this.selectedContent"
  :filtering="filteredPlaylists ? true : false"
  @update:selectedContent="selectedContent = $event"/>
  <div class="container">
    <div class="row">
      <div v-if="playlists.mp3" class="search-component col-4">
        <input v-model="textFilter" placeholder="Search">
      </div>
    </div>
    <div class="row">
      <PlaylistComponent :playlists="filteredPlaylists"
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
      extra: null,
    });
    function filterPlaylists() {
      const arr = array.objectMap(playlists, (value) => value.filter((i) => {
        if (textFilter.value?.length >= 3) {
          const textSearchValue = textFilter.value.normalize('NFC').toLowerCase();
          const titlefilter = i.titlefilter ? i.titlefilter.normalize('NFC').toLowerCase() : '';
          const artistfilter = i.artistfilter ? i.artistfilter.normalize('NFC').toLowerCase() : '';
          return titlefilter.includes(textSearchValue) || artistfilter.includes(textSearchValue);
        }
        if (!textFilter.value || textFilter.value?.length < 3) {
          return true;
        }
        return false;
      }));
      if (textFilter.value?.length >= 3) {
        selectedContent.value = arr.mp3[0]?.id || arr.wav[0]?.id || arr.video[0]?.id;
      }
      return arr;
    }
    const filteredPlaylists = computed(() => (playlists.mp3
    && playlists.wav && playlists.video && playlists.extra ? filterPlaylists() : {}));
    onMounted(async () => {
      const playlistJson = await fetch('/jsons/playlist.json');
      const playlistLosslessJson = await fetch('/jsons/playlistLossless.json');
      const playlistVideoJson = await fetch('/jsons/playlistVideo.json');
      const playlistExtra = await fetch('/jsons/playlistExtra.json');
      playlists.mp3 = await playlistJson.json();
      playlists.wav = await playlistLosslessJson.json();
      playlists.video = await playlistVideoJson.json();
      playlists.extra = await playlistExtra.json();
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
.search-component {
  margin-top: 20px;
  input {
    transition: 0.5s ease;
    height: 40px;
    width: 100%;
    border-radius: 5px;
    appearance: none;
    padding: 12px;
    background: $background3;
    border: none;
    outline: solid $active-purple 3px;
    outline-offset: -3px;
    color: $text;
    font-size: 18px;
    &::placeholder {
      color: $text-darker;
    }
    &:focus {
      outline: solid $active-purple-hover 3px;
      outline-offset: 0px;
      background: $background4;
    }
  }
}
</style>
