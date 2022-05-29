<template>
  <HeroComponent :playlists="filteredPlaylists"
  :selectedContent="this.selectedContent"
  :filtering="filteredPlaylists ? true : false"
  @update:selectedContent="selectedContent = $event"/>
  <div class="container">
    <div class="row">
      <TextFilter v-if="playlists.mp3"
      sizeMobile="d-none"
      sizeTablet=""
      sizeDesktop="d-lg-block col-lg-4"
      placeholder="Search artist"
      @update:updateValue="textFilterArtist = $event"
      />
      <TextFilter v-if="playlists.mp3"
      sizeMobile="d-none"
      sizeTablet=""
      sizeDesktop="d-lg-block col-lg-4"
      placeholder="Search title"
      @update:updateValue="textFilterTitle = $event"
      />
      <TextFilter v-if="playlists.mp3"
      sizeMobile="col-12"
      sizeTablet="col-md-12"
      sizeDesktop="col-lg-4"
      placeholder="Search track"
      @update:updateValue="textFilter = $event"
      />
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
import TextFilter from './components/Filters/TextFilter.vue';

export default {
  name: 'App',
  components: {
    HeroComponent,
    PlaylistComponent,
    TextFilter,
  },
  setup() {
    const selectedContent = ref(null);
    const textFilter = ref(null);
    const textFilterArtist = ref(null);
    const textFilterTitle = ref(null);
    const playlists = reactive({
      mp3: null,
      wav: null,
      video: null,
      extra: null,
    });
    function textFilterPlaylists() {
      const arr = array.objectMap(playlists, (value) => value.filter((music) => {
        const textSearchValue = textFilter?.value?.normalize('NFC').toLowerCase();
        const textSearchValueArtist = textFilterArtist?.value?.normalize('NFC').toLowerCase();
        const textSearchValueTitle = textFilterTitle?.value?.normalize('NFC').toLowerCase();
        const filter = music.filter ? music.filter.normalize('NFC').toLowerCase() : '';
        const filterArtist = music.artistfilter ? music.artistfilter.normalize('NFC').toLowerCase() : '';
        const filterTitle = music.titlefilter ? music.titlefilter.normalize('NFC').toLowerCase() : '';
        const filterIncludeSearch = textFilter.value?.length >= 3
          ? filter.includes(textSearchValue)
          : true;
        const filterArtistIncludeSearch = textFilterArtist.value?.length >= 3
          ? filterArtist.includes(textSearchValueArtist)
          : true;
        const filterTitleIncludeSearch = textFilterTitle.value?.length >= 3
          ? filterTitle.includes(textSearchValueTitle)
          : true;
        return filterIncludeSearch && filterArtistIncludeSearch && filterTitleIncludeSearch;
      }));
      if (textFilter.value?.length >= 3) {
        selectedContent.value = arr.mp3[0]?.id || arr.wav[0]?.id || arr.video[0]?.id;
      }
      return arr;
    }
    const filteredPlaylists = computed(() => (playlists.mp3
    && playlists.wav && playlists.video && playlists.extra ? textFilterPlaylists() : {}));
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
      selectedContent, textFilter, textFilterArtist, textFilterTitle, playlists, filteredPlaylists,
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
