<template>
  <Transition>
    <LoaderComponent
      v-if="!playlistsReady"
      class="loader"
    />
  </Transition>
  <Transition>
    <HeroComponent
      v-if="playlistsReady"
      :playlists="filteredPlaylists"
      :selected-content="selectedContent"
      :filtering="filteredPlaylists ? true : false"
      @update:selected-content="updateSelectedContent($event)"
    />
  </Transition>
  <div class="container">
    <div class="row">
      <Transition>
        <LatestTracksComponent
          v-if="playlistsReady"
          :playlists="{
            mp3: playlists.mp3,
            wav: playlists.wav,
            video: playlists.video,
            extra: playlists.extra
          }"
        />
      </Transition>
    </div>
    <div class="row">
      <Transition>
        <h2 v-if="playlistsReady">
          Search
        </h2>
      </Transition>
      <Transition>
        <TextFilter
          v-if="playlistsReady"
          size-mobile="d-none"
          size-tablet=""
          size-desktop="d-lg-block col-lg-4"
          placeholder="Search artist"
          @update:update-value="textFilterArtist = $event"
        />
      </Transition>
      <Transition>
        <TextFilter
          v-if="playlistsReady"
          size-mobile="d-none"
          size-tablet=""
          size-desktop="d-lg-block col-lg-4"
          placeholder="Search title"
          @update:update-value="textFilterTitle = $event"
        />
      </Transition>
      <Transition>
        <TextFilter
          v-if="playlistsReady"
          size-mobile="col-12"
          size-tablet="col-md-12"
          size-desktop="col-lg-4"
          placeholder="Search track"
          @update:update-value="textFilter = $event"
        />
      </Transition>
    </div>
    <div class="row">
      <Transition>
        <PlaylistComponent
          :playlists="filteredPlaylists"
          :selected-content="selectedContent"
          :text-filter="textFilter"
          :text-filter-artist="textFilterArtist"
          :text-filter-title="textFilterTitle"
          @update:selected-content="updateSelectedContent($event)"
        />
      </Transition>
    </div>
  </div>
  <Transition name="pop-b">
    <AudioPlayer
      v-if="playlistsReady"
      :playlist="playlists.mp3"
      :selected-content="selectedContent"
      @update:selected-content="updateSelectedContent($event)"
    />
  </Transition>
  <SupportComponent />
</template>

<script setup>
import {
  onMounted, reactive, ref, computed,
} from 'vue';
import array from '@/helpers/array';
import { useRouter } from 'vue-router';
import AudioPlayer from '@/components/AudioPlayer/AudioPlayer.vue';
import HeroComponent from '@/components/HeroComponent.vue';
import LatestTracksComponent from '@/components/LatestTracksComponent.vue';
import PlaylistComponent from '@/components/Playlist/PlaylistComponent.vue';
import TextFilter from '@/components/Filters/TextFilter.vue';
import SupportComponent from '@/components/Tools/SupportComponent.vue';
import LoaderComponent from '@/components/Tools/loaderComponent.vue';

const router = useRouter();
const urlParams = new URLSearchParams(window.location.hash.replace('#/', ''));
const pushedContent = reactive([]);
const selectedContent = ref(urlParams.get('track'));
const textFilter = ref(null);
const textFilterArtist = ref(null);
const textFilterTitle = ref(null);
const playlists = reactive({});
const playlistsReady = computed(() => playlists.mp3
  && playlists.wav
  && playlists.video
  && playlists.extra);

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
  if ((textFilter.value?.length >= 3
  || textFilterArtist.value?.length >= 3
  || textFilterTitle.value?.length >= 3)
  && (arr.mp3.findIndex((m) => m.id === selectedContent.value) === -1
  && arr.wav.findIndex((m) => m.id === selectedContent.value) === -1
  && arr.video.findIndex((m) => m.id === selectedContent.value) === -1)) {
    selectedContent.value = arr.mp3[0]?.id || arr.wav[0]?.id || arr.video[0]?.id;
    router.push({ path: '/', query: { track: selectedContent.value } });
  }
  return arr;
}

const filteredPlaylists = computed(() => (playlists.mp3
&& playlists.wav && playlists.video && playlists.extra ? textFilterPlaylists() : {}));

onMounted(async () => {
  const playlistPushedContent = await fetch('/jsons/playlistPushedContent.json');
  const playlistJson = await fetch('/jsons/playlist.json');
  const playlistLosslessJson = await fetch('/jsons/playlistLossless.json');
  const playlistVideoJson = await fetch('/jsons/playlistVideo.json');
  const playlistExtra = await fetch('/jsons/playlistExtra.json');
  pushedContent.value = await playlistPushedContent.json();
  if (!selectedContent.value) {
    selectedContent.value = pushedContent.value[0].id;
    router.push({ path: '/', query: { track: selectedContent.value } });
  }
  playlists.mp3 = await playlistJson.json();
  playlists.wav = await playlistLosslessJson.json();
  playlists.video = await playlistVideoJson.json();
  playlists.extra = await playlistExtra.json();
});
</script>

<style lang="scss">
@import '@/styles/bootstrap-grid';
@import '@/styles/main';
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.pop-b-enter-active,
.pop-b-leave-active {
  transform: translateY(55vh);
  transition: transform 1s ease;
  transition-delay: 1s;
}

.pop-b-enter-from,
.pop-b-leave-to {
  transform: translateY(100%);
}
</style>
