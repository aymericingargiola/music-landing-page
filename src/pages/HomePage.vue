<template>
  <HeroComponent v-if="playlists.mp3
  && playlists.wav
  && playlists.video
  && playlists.extra" :playlists="filteredPlaylists"
  :selectedContent="this.selectedContent"
  :filtering="filteredPlaylists ? true : false"
  @update:selectedContent="updateSelectedContent($event)"/>
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
      :selectedContent="selectedContent"
      :textFilter="textFilter"
      :textFilterArtist="textFilterArtist"
      :textFilterTitle="textFilterTitle"
      @update:selectedContent="updateSelectedContent($event)"/>
    </div>
  </div>
</template>

<script>
import {
  onMounted, reactive, ref, computed,
} from 'vue';
import array from '@/helpers/array';
import { useRouter } from 'vue-router';
import HeroComponent from '@/components/HeroComponent.vue';
import PlaylistComponent from '@/components/Playlist/PlaylistComponent.vue';
import TextFilter from '@/components/Filters/TextFilter.vue';

export default {
  name: 'HomePage',
  components: {
    HeroComponent,
    PlaylistComponent,
    TextFilter,
  },
  setup() {
    const router = useRouter();
    const urlParams = new URLSearchParams(window.location.hash.replace('#/', ''));
    const selectedContent = ref(urlParams.get('track'));
    const textFilter = ref(null);
    const textFilterArtist = ref(null);
    const textFilterTitle = ref(null);
    const playlists = reactive({});
    function updateSelectedContent(id) {
      selectedContent.value = id;
      router.push({ path: '/', query: { track: selectedContent.value } });
    }
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
      if (!selectedContent.value && (textFilter.value?.length >= 3
      || textFilterArtist.value?.length >= 3
      || textFilterTitle.value?.length >= 3)) {
        selectedContent.value = arr.mp3[0]?.id || arr.wav[0]?.id || arr.video[0]?.id;
        router.push({ path: '/', query: { track: selectedContent.value } });
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
      updateSelectedContent,
      selectedContent,
      textFilter,
      textFilterArtist,
      textFilterTitle,
      playlists,
      filteredPlaylists,
    };
  },
};
</script>

<style lang="scss">
@import './src/styles/bootstrap-grid';
@import './src/styles/main';
</style>
